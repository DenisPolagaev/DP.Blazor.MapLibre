// Projection pipeline built directly on proj-wasm.
// Replaces maplibre-proj/backproj for the projection plugin.
//
// Responsibilities:
//   - real lon/lat <-> fake lon/lat (fake space is what MapLibre renders in Mercator)
//   - MapLibre protocol handler that reprojects vector tiles (MLT or MVT in / MLT out)
//   - GeoJSON reprojection
//
// Threading: the PROJ maths does *not* run here. proj-wasm owns a small pool of module workers and every
// transform is a batched call into it; what stays on the map's main thread is the tile work around it — decode,
// densify, clip, simplify and encode. See PROJ_WORKERS for the pool size.
//
// Our own archives are MapLibre Tiles (MLT v1): the input tile is decoded with @maplibre/mlt and the result is
// encoded back with @maplibre/mlt. A third-party style (the OpenFreeMap basemap the Map API serves) has no MLT
// build, so its MVT tiles are decoded with MapLibre's own @mapbox/vector-tile and re-encoded as MLT. The output of
// the handler is always MLT, whatever came in.
//
// Known simplifications vs backproj: no cross-input-tile feature stitching beyond the feature id and
// no polygon repair. Geometry is densified in real space, clipped to the output tile and simplified in tile space.

import * as proj from './vendor/proj-wasm/dist/proj.mjs';
import { decodeTile, encodeTile } from '@maplibre/mlt';
import { VectorTile } from '@mapbox/vector-tile';
import { PMTiles } from 'pmtiles';
import Pbf from 'pbf';

const EARTH_RADIUS = 6378137;
const MERC_MAX = Math.PI * EARTH_RADIUS; // 20037508.342789244
const TILE_EXTENT = 4096;
const DEG = 180 / Math.PI;
const RAD = Math.PI / 180;
const DEFAULT_MAX_INPUT_TILES = 16;

// proj-wasm spawns its own module workers, and each one loads the WASM build plus proj.db (10 MB). Every operation
// of a projection is created against the one context, so they all live on the worker that owns it and a wider pool
// would only duplicate that cost: one worker keeps a projected map to a single WASM instance.
const PROJ_WORKERS = 1;

// Input tiles of one output tile are fetched in parallel: a reprojected tile needs up to MaxInputTiles of them and
// a serial chain of request round trips dominated every first pan. Kept modest so one tile cannot starve the
// browser's connection pool.
const MAX_INPUT_FETCH_CONCURRENCY = 6;

// One input cache per reprojected source. Entries are promises of ArrayBuffer and are evicted least-recently-used.
const MAX_INPUT_CACHE = 256;

let contextPromise = null;

async function getContext() {
    if (!contextPromise) {
        contextPromise = (async () => {
            await proj.init({ workers: PROJ_WORKERS });
            const context = await proj.contextCreate();

            // PROJ 9 enables network lookups by default, and a WASM build has no network: a transformation that
            // wants a datum grid (NAD83 for EPSG:5070, OSGB36, CH1903+, …) blocks forever on a fetch that can never
            // complete, taking the map's main thread with it. The grids are not shipped (proj.db is local), so the
            // ballpark/Helmert fallback is both the only option and the correct one.
            const setNetwork = proj.projContextSetEnableNetwork ?? proj.contextSetEnableNetwork;
            if (typeof setNetwork === 'function') {
                await setNetwork({ context, enabled: 0 });
            }

            return context;
        })().catch((error) => {
            // A rejected promise must not be cached: the next attempt has to retry instead of failing forever.
            contextPromise = null;
            throw error;
        });
    }

    return contextPromise;
}

// Batching matters here: one proj-wasm round trip per output tile instead of one per vertex, and one flat
// numeric array instead of a [x, y, 0, 0] array per vertex (set_coord_array copies that straight into its
// Float64Array; the per-vertex shape allocated two arrays per point and copied element by element).
function flatTransform(op, coords, direction) {
    return (async () => {
        const count = coords.length;
        const array = await proj.coordArray(count);
        if (count > 0) {
            const flat = new Array(count * 4).fill(0);
            for (let i = 0; i < count; i++) {
                const offset = i * 4;
                flat[offset] = coords[i][0];
                flat[offset + 1] = coords[i][1];
            }
            await proj.setCoords(array, flat);
            await proj.projTransArray({ p: op, direction, n: count, coord: array });
        }

        const out = new Array(count);
        for (let i = 0; i < count; i++) {
            const c = proj.getCoords(array, i);
            out[i] = [c[0], c[1]];
        }
        return out;
    })();
}

function median(values) {
    if (values.length === 0) {
        return 0;
    }
    const sorted = [...values].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
}

function robustRange(values) {
    const m = median(values);
    const dev = values.map((v) => Math.abs(v - m));
    const mad = median(dev) || 1;
    const kept = values.filter((v) => Math.abs(v - m) <= 6 * mad);
    const pool = kept.length > 2 ? kept : values;
    return [Math.min(...pool), Math.max(...pool)];
}

function inverseMercator(x, y) {
    return [x / EARTH_RADIUS * DEG, (2 * Math.atan(Math.exp(y / EARTH_RADIUS)) - Math.PI / 2) * DEG];
}

// ----- axis order ------------------------------------------------------------

// The projected side of proj_create_crs_to_crs follows the CRS's declared axes, and several EPSG CRS do not list
// (easting, northing): EPSG:3035 and EPSG:3034 are (northing, easting), EPSG:3414 is too, and the pre-"East North"
// Krovak is (southing, westing). This pipeline works in (easting, northing), so the mapping is read once per CRS
// (proj_cs_get_axis_info, no transformation involved) and applied around every batch. A CRS whose axes are not a
// plain (east|west, north|south) pair — a polar stereographic reports "south along 45°E" on both — is left alone,
// and so is a bare conversion definition, which has no coordinate system at all.
const AXIS_EAST = 'east';
const AXIS_WEST = 'west';
const AXIS_NORTH = 'north';
const AXIS_SOUTH = 'south';

function axisMapping(directions) {
    const [first, second] = directions;
    const xAxis = first === AXIS_EAST || first === AXIS_WEST ? 0
        : second === AXIS_EAST || second === AXIS_WEST ? 1 : -1;
    if (xAxis < 0) {
        return null;
    }

    const yAxis = xAxis === 0 ? 1 : 0;
    const yDirection = directions[yAxis];
    if (yDirection !== AXIS_NORTH && yDirection !== AXIS_SOUTH) {
        return null;
    }

    const mapping = {
        xAxis,
        yAxis,
        xSign: directions[xAxis] === AXIS_WEST ? -1 : 1,
        ySign: yDirection === AXIS_SOUTH ? -1 : 1,
    };
    // (easting, northing) in order and positive: nothing to correct.
    return mapping.xAxis === 0 && mapping.xSign === 1 && mapping.ySign === 1 ? null : mapping;
}

async function readAxisMapping(context, crsObject) {
    try {
        const coordinateSystem = await proj.projCrsGetCoordinateSystem({ context, crs: crsObject });
        const count = await proj.projCsGetAxisCount({ context, cs: coordinateSystem });
        if (count !== 2) {
            return null;
        }

        const directions = [];
        for (let index = 0; index < 2; index++) {
            const axis = await proj.projCsGetAxisInfo({ context, cs: coordinateSystem, index });
            directions.push(String(axis?.direction ?? '').toLowerCase());
        }
        return axisMapping(directions);
    } catch {
        return null;
    }
}

// The CRS's own area of use, [west, south, east, north]. Sampling it instead of the whole world is what keeps a
// regional CRS from being fed coordinates it cannot represent: PROJ does not merely return "invalid" for those, its
// datum-transformation path can loop without returning (EPSG:5070 with a world grid hangs the WASM worker), and the
// extent of a CONUS Albers is the CONUS anyway.
async function readAreaOfUse(context, crsObject) {
    try {
        const area = await proj.projGetAreaOfUse({ context, obj: crsObject });
        const bounds = [
            Number(area?.westLonDegree),
            Number(area?.southLatDegree),
            Number(area?.eastLonDegree),
            Number(area?.northLatDegree),
        ];
        if (!bounds.every(Number.isFinite) || bounds[0] >= bounds[2] || bounds[1] >= bounds[3]) {
            return null;
        }

        // Clamp to the planet: proj.db carries areas that reach past the poles.
        return [
            Math.max(-180, bounds[0]),
            Math.max(-90, bounds[1]),
            Math.min(180, bounds[2]),
            Math.min(90, bounds[3]),
        ];
    } catch {
        return null;
    }
}

// polarHemisphere ("north" | "south", optional) limits the default sampling to one hemisphere so that a polar CRS is
// framed by its own pole. It is ignored when an area of use is available.
export async function createProjection(crs, areaOfUse, polarHemisphere = null) {
    const context = await getContext();

    // One operation, used in both directions: PJ_FWD maps real (lon, lat) to the CRS, PJ_INV maps the CRS back.
    // Besides halving the PROJ objects, the inverse of a pipeline is exact. A second, separately built crs->4326
    // operation may select a different transformation — for EPSG:5070 it enters NADCON/grid territory and never
    // returns in this WASM build, while the reverse of the forward pipeline is a plain inverse projection.
    const operation = await proj.projCreateCrsToCrs({ context, source_crs: 'EPSG:4326', target_crs: crs });

    let crsObject = null;
    try {
        crsObject = await proj.projCreate({ context, definition: crs });
    } catch {
        // A definition PROJ cannot parse as a CRS (a bare conversion) simply has no axes or area to read.
    }

    const axes = crsObject ? await readAxisMapping(context, crsObject) : null;
    const samplingArea = (Array.isArray(areaOfUse) && areaOfUse.length === 4 ? areaOfUse : null)
        ?? (crsObject ? await readAreaOfUse(context, crsObject) : null);

    // The projected side is converted to (easting, northing) here, and back to the CRS's own axis order for the
    // inverse transform: `proj_create_crs_to_crs` expects and returns the CRS axis order on that side, while EPSG:4326
    // is (lat, lon) — hence the swap around the operation.
    const axisSwap = axes !== null;
    const toEastNorth = axisSwap
        ? ([a, b]) => (axes.xAxis === 0
            ? [axes.xSign * a, axes.ySign * b]
            : [axes.xSign * b, axes.ySign * a])
        : (pair) => pair;
    const fromEastNorth = axisSwap
        ? (x, y) => (axes.xAxis === 0
            ? [axes.xSign * x, axes.ySign * y]
            : [axes.ySign * y, axes.xSign * x])
        : (x, y) => [x, y];

    // (lon, lat) pairs in, (easting, northing) out — and back. PJ_FWD is 1, PJ_INV is -1.
    const toMeters = async (realPairs) => {
        const meters = await flatTransform(
            operation,
            realPairs.map(([lon, lat]) => [lat, lon]),
            1);
        return axisSwap ? meters.map(toEastNorth) : meters;
    };
    const fromMeters = async (xyPairs) => {
        const raw = axisSwap ? xyPairs.map(([x, y]) => fromEastNorth(x, y)) : xyPairs;
        const real = await flatTransform(operation, raw, -1);
        return real.map(([lat, lon]) => [lon, lat]);
    };

    // Sample the CRS area of use (or the world) to derive the fake-space scale/offset: a fixed 9×9 grid inclusive
    // of both edges, so a tiny area (Singapore is 0.5°×0.3°) still yields several distinct rows and columns. The
    // round-trip filter then drops what the CRS cannot represent. Samples are (lon, lat).
    const samples = [];
    if (samplingArea) {
        const [west, south, east, north] = samplingArea;
        const columns = 9;
        const rows = 9;
        for (let row = 0; row < rows; row++) {
            const latitude = south + (north - south) * row / (rows - 1);
            for (let column = 0; column < columns; column++) {
                samples.push([west + (east - west) * column / (columns - 1), latitude]);
            }
        }
    } else {
        const [minLatitude, maxLatitude] = polarHemisphere === 'north'
            ? [0, 80]
            : polarHemisphere === 'south' ? [-80, 0] : [-80, 80];
        for (let latitude = minLatitude; latitude <= maxLatitude; latitude += 10) {
            for (let longitude = -180; longitude < 180; longitude += 10) {
                samples.push([longitude, latitude]);
            }
        }
    }

    const meters = await toMeters(samples);
    const back = await fromMeters(meters);

    // Keep only samples inside the CRS area of use: outside points extrapolate, and a
    // forward->inverse round-trip no longer returns the original lon/lat.
    const kept = [];
    for (let i = 0; i < samples.length; i++) {
        const [lon, lat] = samples[i];
        const [x, y] = meters[i];
        const [backLon, backLat] = back[i];
        if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(backLat) || !Number.isFinite(backLon)) {
            continue;
        }
        const lonDelta = Math.abs(((backLon - lon + 540) % 360) - 180);
        if (Math.abs(backLat - lat) < 0.01 && lonDelta < 0.01) {
            kept.push([x, y]);
        }
    }

    const pool = kept.length >= 3 ? kept : meters.filter((p) => Number.isFinite(p[0]) && Number.isFinite(p[1]));
    const xs = pool.map((p) => p[0]);
    const ys = pool.map((p) => p[1]);
    if (xs.length < 2 || ys.length < 2) {
        throw new Error(`Could not derive projection extent for "${crs}".`);
    }

    const [x0, x1] = robustRange(xs);
    const [y0, y1] = robustRange(ys);
    const offsetX = (x0 + x1) / 2;
    const offsetY = (y0 + y1) / 2;
    const extent = Math.max(x1 - x0, y1 - y0) || 1;
    const scale = (2 * MERC_MAX) / extent;

    const projection = {
        crs,
        scale,
        offsetX,
        offsetY,

        metersToFake(x, y) {
            return inverseMercator((x - offsetX) * scale, (y - offsetY) * scale);
        },

        fakeToMeters(lon, lat) {
            return [
                lon * RAD * EARTH_RADIUS / scale + offsetX,
                EARTH_RADIUS * Math.asinh(Math.tan(lat * RAD)) / scale + offsetY,
            ];
        },

        async toFake(realPairs) {
            const meters = await toMeters(realPairs);
            return meters.map(([x, y]) => (Number.isFinite(x) && Number.isFinite(y)) ? projection.metersToFake(x, y) : [NaN, NaN]);
        },

        async toReal(fakePairs) {
            const meters = fakePairs.map(([lon, lat]) => projection.fakeToMeters(lon, lat));
            return fromMeters(meters);
        },
    };

    // Fake-space world bounds (for fitBounds).
    const fakeCorners = pool
        .map(([x, y]) => projection.metersToFake(x, y))
        .filter(([lon, lat]) => Number.isFinite(lon) && Number.isFinite(lat));
    if (fakeCorners.length >= 2) {
        const lons = fakeCorners.map((c) => c[0]);
        const lats = fakeCorners.map((c) => c[1]);
        const [w, e] = robustRange(lons);
        const [s, n] = robustRange(lats);
        projection.bounds = [[w, s], [e, n]];
    }

    return projection;
}

// ----- tile math -------------------------------------------------------------

function tileToMerc(z, x, y) {
    const worldSize = 2 * MERC_MAX;
    const size = worldSize / Math.pow(2, z);
    return {
        minX: -MERC_MAX + x * size,
        maxX: -MERC_MAX + (x + 1) * size,
        minY: MERC_MAX - (y + 1) * size,
        maxY: MERC_MAX - y * size,
    };
}

function mercToLonLat(x, y) {
    return [x / EARTH_RADIUS * DEG, (2 * Math.atan(Math.exp(y / EARTH_RADIUS)) - Math.PI / 2) * DEG];
}

function lonLatToMerc(lon, lat) {
    return [lon * RAD * EARTH_RADIUS, EARTH_RADIUS * Math.log(Math.tan(Math.PI / 4 + lat * RAD / 2))];
}

function inputTileLocalToLonLat(px, py, z, x, y, extent = TILE_EXTENT) {
    const b = tileToMerc(z, x, y);
    const mx = b.minX + (px / extent) * (b.maxX - b.minX);
    const my = b.maxY - (py / extent) * (b.maxY - b.minY);
    return mercToLonLat(mx, my);
}

function fakeToTileLocal(fake, z, x, y) {
    const [mx, my] = lonLatToMerc(fake[0], fake[1]);
    const b = tileToMerc(z, x, y);
    return [
        (mx - b.minX) / (b.maxX - b.minX) * TILE_EXTENT,
        (b.maxY - my) / (b.maxY - b.minY) * TILE_EXTENT,
    ];
}

// ----- Tile decoding (MLT + MVT input) -----------------------------------------

// GEOMETRY_TYPE of the MapLibre Tile spec: 0..2 are single-part geometries, 3..5 their multi variants.
const GEOMETRY_TYPE = {
    POINT: 0,
    LINESTRING: 1,
    POLYGON: 2,
    MULTIPOINT: 3,
    MULTILINESTRING: 4,
    MULTIPOLYGON: 5,
};

const INT32_MAX = 2 ** 31 - 1;
const INT64_MAX = 2n ** 63n - 1n;

// ----- MVT input --------------------------------------------------------------

// MVT geometry type (1 = point, 2 = line, 3 = polygon) to the pipeline's GEOMETRY_TYPE. A third-party MVT tile is
// decoded with MapLibre's own @mapbox/vector-tile; loadGeometry() already returns rings of tile-local points, the
// shape the rest of the pipeline expects, so the only difference from the MLT path is the decoder.
const MVT_GEOMETRY_TYPE = {
    1: GEOMETRY_TYPE.POINT,
    2: GEOMETRY_TYPE.LINESTRING,
    3: GEOMETRY_TYPE.POLYGON,
};

function decodeMvtTile(bytes) {
    const tile = new VectorTile(new Pbf(bytes));
    return Object.entries(tile.layers).map(([name, layer]) => ({
        name,
        extent: layer.extent || TILE_EXTENT,
        features: Array.from({ length: layer.length }, (_, index) => {
            const feature = layer.feature(index);
            return {
                id: feature.id,
                geometry: {
                    type: MVT_GEOMETRY_TYPE[feature.type] ?? GEOMETRY_TYPE.POINT,
                    coordinates: feature.loadGeometry(),
                },
                properties: feature.properties,
            };
        }),
    }));
}

function isGzip(bytes) {
    return bytes.length > 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;
}

// decodeTile does not inflate gzip (transport normally does: PMTiles and HTTP Content-Encoding do it
// before us). A raw gzip payload is still handled so a gzipped file served as-is reprojects too.
async function inflate(bytes) {
    if (typeof DecompressionStream !== 'function') {
        throw new Error('the tile is gzip-compressed and this browser has no DecompressionStream');
    }
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
}

// Decodes one input tile into [{ name, extent, features }]; features carry a geometry in tile-local units.
// `encoding` selects the decoder: "mlt" for our archives, "mvt" for third-party styles.
async function decodeInputTile(buffer, encoding) {
    let bytes = new Uint8Array(buffer);
    if (isGzip(bytes)) {
        bytes = await inflate(bytes);
    }

    return encoding === 'mvt' ? decodeMvtTile(bytes) : decodeMltTile(bytes);
}

function decodeMltTile(bytes) {
    return decodeTile(bytes).map((table) => ({
        name: table.name,
        extent: table.extent || TILE_EXTENT,
        features: table.getFeatures(),
    }));
}

// ----- MapLibre Tile encoding -------------------------------------------------

// Columns reported as mixed-typed, so a reprojection that hits the same column in every tile warns once instead of
// once per output tile (this runs inside the tile loop).
const warnedMixedColumns = new Set();

// The physical column type the encoder should write. Passing it explicitly keeps the encoder from
// inferring a type per layer: its inference throws when a column mixes numbers and bigints, which the
// reprojected output can do because it merges features from several input tiles.
function propertyColumnType(values, layerName, columnName) {
    const present = values.filter((value) => value !== null && value !== undefined);
    if (present.length === 0) {
        return 'string';
    }
    if (present.some((value) => typeof value === 'object')) {
        return 'map';
    }
    if (present.every((value) => typeof value === 'boolean')) {
        return 'boolean';
    }
    if (present.every((value) => typeof value === 'string')) {
        return 'string';
    }
    if (present.every((value) => typeof value === 'bigint' || Number.isInteger(value))) {
        const big = present.map((value) => (typeof value === 'bigint' ? value : BigInt(value)));
        if (big.some((value) => value > INT64_MAX)) {
            return 'uint64';
        }
        const fitsInt32 = big.every((value) => value >= BigInt(-INT32_MAX - 1) && value <= BigInt(INT32_MAX));
        return fitsInt32 ? 'int32' : 'int64';
    }
    if (present.every((value) => typeof value === 'number')) {
        return 'double';
    }

    // Mixed scalars (for example a string in one tile and a number in another): a string column keeps the tile
    // readable — the alternative is losing the features. A numeric style expression stops matching after such a
    // column turns into strings, so the case is reported once per column instead of once per tile.
    const key = `${layerName}|${columnName}`;
    if (!warnedMixedColumns.has(key)) {
        warnedMixedColumns.add(key);
        console.warn(
            `ProjPlugin: layer "${layerName}" property "${columnName}" mixes value types across input tiles; `
            + 'the reprojected tiles write it as strings, so numeric style expressions will stop matching.');
    }

    return 'string';
}

function propertyTypesFor(features, layerName) {
    const columns = new Map();
    for (const feature of features) {
        for (const [name, value] of Object.entries(feature.properties ?? {})) {
            const values = columns.get(name);
            if (values) {
                values.push(value);
            } else {
                columns.set(name, [value]);
            }
        }
    }

    const types = {};
    for (const [name, values] of columns) {
        types[name] = propertyColumnType(values, layerName, name);
    }

    return types;
}

function concatBytes(chunks) {
    const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const out = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
        out.set(chunk, offset);
        offset += chunk.length;
    }
    return out;
}

// `Promise.all` with a concurrency ceiling, preserving the input order of the results.
async function mapLimit(items, limit, worker) {
    const results = new Array(items.length);
    let next = 0;
    const runners = new Array(Math.min(limit, items.length)).fill(null).map(async () => {
        while (next < items.length) {
            const index = next++;
            results[index] = await worker(items[index], index);
        }
    });
    await Promise.all(runners);
    return results;
}

// Encodes layers into one MLT tile. Layers are encoded one at a time because the encoder takes a
// single property-type map per call, and two layers of one tile may name a column differently typed.
function encodeTileLayers(layers) {
    const chunks = [];
    for (const layer of layers) {
        if (layer.features.length === 0) {
            continue;
        }
        chunks.push(encodeTile([{
            name: layer.name,
            extent: TILE_EXTENT,
            features: layer.features,
        }], { propertyTypes: propertyTypesFor(layer.features, layer.name) }));
    }

    return chunks.length === 0 ? new Uint8Array(0) : concatBytes(chunks);
}

// ----- clipping / densify ----------------------------------------------------

function clipPolygon(ring, extent, buffer) {
    const min = -buffer;
    const max = extent + buffer;
    let output = ring;
    const edges = [
        (p) => p[0] >= min,
        (p) => p[0] <= max,
        (p) => p[1] >= min,
        (p) => p[1] <= max,
    ];
    const intersect = (a, b, edge) => {
        if (edge === 0) {
            const t = (min - a[0]) / (b[0] - a[0]);
            return [min, a[1] + t * (b[1] - a[1])];
        }
        if (edge === 1) {
            const t = (max - a[0]) / (b[0] - a[0]);
            return [max, a[1] + t * (b[1] - a[1])];
        }
        if (edge === 2) {
            const t = (min - a[1]) / (b[1] - a[1]);
            return [a[0] + t * (b[0] - a[0]), min];
        }
        const t = (max - a[1]) / (b[1] - a[1]);
        return [a[0] + t * (b[0] - a[0]), max];
    };

    for (let edge = 0; edge < 4 && output.length > 0; edge++) {
        const input = output;
        output = [];
        const inside = edges[edge];
        for (let i = 0; i < input.length; i++) {
            const current = input[i];
            const previous = input[(i + input.length - 1) % input.length];
            const currentInside = inside(current);
            const previousInside = inside(previous);
            if (currentInside) {
                if (!previousInside) {
                    output.push(intersect(previous, current, edge));
                }
                output.push(current);
            } else if (previousInside) {
                output.push(intersect(previous, current, edge));
            }
        }
    }

    return output;
}

function clipSegment(a, b, extent, buffer) {
    const min = -buffer;
    const max = extent + buffer;
    let [x0, y0] = a;
    let [x1, y1] = b;
    let t0 = 0;
    let t1 = 1;
    const dx = x1 - x0;
    const dy = y1 - y0;
    const p = [-dx, dx, -dy, dy];
    const q = [x0 - min, max - x0, y0 - min, max - y0];
    for (let i = 0; i < 4; i++) {
        if (p[i] === 0) {
            if (q[i] < 0) {
                return null;
            }
        } else {
            const r = q[i] / p[i];
            if (p[i] < 0) {
                if (r > t1) {
                    return null;
                }
                if (r > t0) {
                    t0 = r;
                }
            } else {
                if (r < t0) {
                    return null;
                }
                if (r < t1) {
                    t1 = r;
                }
            }
        }
    }
    return [
        [x0 + t0 * dx, y0 + t0 * dy],
        [x0 + t1 * dx, y0 + t1 * dy],
    ];
}

function ringArea(ring) {
    let area = 0;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        area += (ring[j][0] * ring[i][1]) - (ring[i][0] * ring[j][1]);
    }
    return area / 2;
}

// Subdivide segments in real lon/lat so curved projections render smoothly and clipping
// stays accurate. Linear interpolation in lon/lat is a good approximation for small steps.
function densifyRing(ring, maxDegrees) {
    if (ring.length < 2) {
        return ring;
    }

    const out = [ring[0]];
    for (let i = 1; i < ring.length; i++) {
        const a = ring[i - 1];
        const b = ring[i];
        const distance = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const steps = Math.max(1, Math.min(128, Math.ceil(distance / maxDegrees)));
        for (let k = 1; k <= steps; k++) {
            out.push([a[0] + (b[0] - a[0]) * k / steps, a[1] + (b[1] - a[1]) * k / steps]);
        }
    }
    return out;
}

function latToTileY(lat, z) {
    const clamped = Math.max(-85.051128, Math.min(85.051128, lat));
    const m = Math.log(Math.tan(Math.PI / 4 + clamped * RAD / 2));
    return (1 - m / Math.PI) / 2 * Math.pow(2, z);
}

// Pick the highest input zoom whose bbox tile footprint stays within `maxTiles` — the same budget the
// enumeration below enforces, so the documented MaxInputTiles option is the one knob that decides both the
// requested detail and the number of requests per output tile.
function chooseInputZoom(west, east, south, north, outputZ, maxTiles) {
    const fullLon = east - west >= 359.999;
    for (let z = Math.min(outputZ, 14); z >= 0; z--) {
        const world = Math.pow(2, z);
        let columns;
        if (fullLon) {
            columns = world;
        } else {
            const tx0 = Math.floor((west + 180) / 360 * world);
            const tx1 = Math.floor((east + 180) / 360 * world);
            columns = tx1 >= tx0 ? tx1 - tx0 + 1 : (world - tx0) + (tx1 + 1);
        }
        const ty0 = Math.floor(latToTileY(north, z));
        const ty1 = Math.floor(latToTileY(south, z));
        const rows = Math.abs(ty1 - ty0) + 1;
        if (columns * rows <= maxTiles) {
            return z;
        }
    }
    return 0;
}

// ----- output geometry --------------------------------------------------------

// Vertices are written as Int32 zigzag varints, so positions are rounded and range-checked before encoding.
function roundPosition(position) {
    return [Math.round(position[0]), Math.round(position[1])];
}

function isEncodable(position) {
    return Number.isFinite(position[0]) && Number.isFinite(position[1])
        && Math.abs(position[0]) <= INT32_MAX && Math.abs(position[1]) <= INT32_MAX;
}

// Drops consecutive duplicate positions (rounding collapses short segments) so a ring keeps at least
// the vertices the encoder needs to describe it.
function simplifyRing(ring) {
    const out = [];
    for (const position of ring) {
        const rounded = roundPosition(position);
        const last = out[out.length - 1];
        if (!last || last[0] !== rounded[0] || last[1] !== rounded[1]) {
            out.push(rounded);
        }
    }
    return out;
}

// Douglas–Peucker in tile units. Densification inserts a vertex every 0.25° of real space, and most of them land
// on a straight line in the output tile as well; keeping them costs tile bytes, encode time and vertices for the
// GPU. The tolerance stays far below one device pixel (256 px per tile, 4096 units per tile → 16 units per pixel),
// so only vertices that carry no visible shape are dropped.
const SIMPLIFY_TOLERANCE_UNITS = 1;

function segmentDistanceSquared(point, a, b) {
    let dx = b[0] - a[0];
    let dy = b[1] - a[1];
    let length = dx * dx + dy * dy;
    if (length === 0) {
        dx = point[0] - a[0];
        dy = point[1] - a[1];
        return dx * dx + dy * dy;
    }

    // Clamped projection of the point onto the segment: a ring simplified against the infinite line would cut
    // corners at the seam.
    let t = ((point[0] - a[0]) * dx + (point[1] - a[1]) * dy) / length;
    t = Math.max(0, Math.min(1, t));
    const px = a[0] + t * dx - point[0];
    const py = a[1] + t * dy - point[1];
    length = px * px + py * py;
    return length;
}

function simplifyPath(points, tolerance = SIMPLIFY_TOLERANCE_UNITS) {
    if (points.length <= 2) {
        return points;
    }

    const keep = new Uint8Array(points.length);
    keep[0] = 1;
    keep[points.length - 1] = 1;
    const toleranceSquared = tolerance * tolerance;
    const stack = [[0, points.length - 1]];
    while (stack.length > 0) {
        const [first, last] = stack.pop();
        let farthest = -1;
        let farthestDistance = 0;
        for (let i = first + 1; i < last; i++) {
            const distance = segmentDistanceSquared(points[i], points[first], points[last]);
            if (distance > farthestDistance) {
                farthestDistance = distance;
                farthest = i;
            }
        }

        if (farthest >= 0 && farthestDistance > toleranceSquared) {
            keep[farthest] = 1;
            stack.push([first, farthest], [farthest, last]);
        }
    }

    const out = [];
    for (let i = 0; i < points.length; i++) {
        if (keep[i] === 1) {
            out.push(points[i]);
        }
    }
    return out;
}

// A ring is simplified on its open vertex sequence and closed again, so the closing vertex survives.
function simplifyClosedPath(ring, tolerance = SIMPLIFY_TOLERANCE_UNITS) {
    if (ring.length <= 4) {
        return ring;
    }

    const first = ring[0];
    const last = ring[ring.length - 1];
    const closed = first[0] === last[0] && first[1] === last[1];
    const body = closed ? ring.slice(0, -1) : ring;
    if (body.length <= 2) {
        return ring;
    }

    const simplified = simplifyPath([...body, body[0]], tolerance);
    return simplified.length >= 4 ? simplified : ring;
}

// Rings of a multipolygon are told apart by winding, the same rule the decoder's GeoJSON helper uses:
// a ring wound like the current exterior starts a new polygon, the other way is one of its holes.
function groupPolygonRings(rings) {
    const polygons = [];
    let polygon;
    let exteriorIsCcw;
    for (const ring of rings) {
        const area = ringArea(ring);
        if (!polygon || area === 0 || (area < 0) === exteriorIsCcw) {
            if (polygon) {
                polygons.push(polygon);
            }
            polygon = [ring];
            exteriorIsCcw = area === 0 ? undefined : area < 0;
        } else {
            polygon.push(ring);
        }
    }
    if (polygon) {
        polygons.push(polygon);
    }
    return polygons;
}

function buildPointGeometry(fakeRings) {
    const points = fakeRings.flat()
        .filter((p) => isEncodable(p)
            && p[0] >= -64 && p[0] <= TILE_EXTENT + 64
            && p[1] >= -64 && p[1] <= TILE_EXTENT + 64)
        .map(roundPosition);
    if (points.length === 0) {
        return null;
    }
    return points.length === 1
        ? { type: 'Point', coordinates: points[0] }
        : { type: 'MultiPoint', coordinates: points };
}

function buildLineGeometry(fakeRings) {
    const segments = [];
    for (const ring of fakeRings) {
        for (let s = 0; s < ring.length - 1; s++) {
            const a = ring[s];
            const b = ring[s + 1];
            if (!isEncodable(a) || !isEncodable(b)) {
                continue;
            }
            const segment = clipSegment(a, b, TILE_EXTENT, 8);
            if (segment) {
                segments.push(segment);
            }
        }
    }
    const lines = mergeLines(segments, 0.5)
        .map(simplifyRing)
        .map((line) => simplifyPath(line))
        .filter((line) => line.length >= 2);
    if (lines.length === 0) {
        return null;
    }
    return lines.length === 1
        ? { type: 'LineString', coordinates: lines[0] }
        : { type: 'MultiLineString', coordinates: lines };
}

function buildPolygonGeometry(fakeRings) {
    const rings = [];
    for (const ring of fakeRings) {
        const usable = ring.filter(isEncodable);
        if (usable.length < 3) {
            continue;
        }
        // Winding is preserved on purpose: it is what separates exteriors from holes below.
        const clipped = clipPolygon(usable, TILE_EXTENT, 8);
        if (clipped.length < 3 || Math.abs(ringArea(clipped)) <= 1) {
            continue;
        }
        const simplified = simplifyClosedPath(simplifyRing(clipped));
        if (simplified.length >= 3) {
            rings.push(simplified);
        }
    }
    if (rings.length === 0) {
        return null;
    }
    const polygons = groupPolygonRings(rings);
    return polygons.length === 1
        ? { type: 'Polygon', coordinates: polygons[0] }
        : { type: 'MultiPolygon', coordinates: polygons };
}

// MLT carries multi geometries as one feature; the output keeps that shape and only reports the
// single-part variant when a feature really has one part.
function buildFeatureGeometry(type, fakeRings) {
    if (type === GEOMETRY_TYPE.POINT || type === GEOMETRY_TYPE.MULTIPOINT) {
        return buildPointGeometry(fakeRings);
    }
    if (type === GEOMETRY_TYPE.LINESTRING || type === GEOMETRY_TYPE.MULTILINESTRING) {
        return buildLineGeometry(fakeRings);
    }
    return buildPolygonGeometry(fakeRings);
}

// `input` is either an array of XYZ tile URL templates, or `{ kind: 'pmtiles' }` (the archive URL is derived from the
// requested output tile URL). `options.sourceId` labels warnings, `options.encoding` selects the input decoder
// ("mlt" by default, "mvt" for third-party styles) and `options.maxInputTiles` caps the input tiles read for one
// output tile — it is also the budget the input zoom is chosen with (default 16). Only the first URL template is
// used; extra templates are reported.
export function createTileReprojector(projection, input, options = {}) {
    const isPmtiles = !Array.isArray(input) && input?.kind === 'pmtiles';
    const templates = Array.isArray(input) ? input : (input?.templates ?? []);
    const sourceId = options.sourceId ?? 'unnamed';
    const maxInputTiles = options.maxInputTiles ?? DEFAULT_MAX_INPUT_TILES;
    const inputEncoding = options.encoding === 'mvt' ? 'mvt' : 'mlt';
    if (!isPmtiles) {
        if (templates.length === 0) {
            throw new Error(`Source "${sourceId}" has no tile URL templates to reproject.`);
        }
        if (templates.length > 1) {
            console.warn(
                `ProjPlugin: source "${sourceId}" has ${templates.length} tile URL templates; only the first `
                + `("${templates[0]}") is reprojected.`);
        }
    }

    // Input tiles of this source, keyed by URL (or by archive + z/x/y for PMTiles). Both paths share one
    // least-recently-used map: an input tile is usually read by several output tiles, and a plain FIFO threw away
    // entries that were still in use while keeping ones nobody asked for.
    const tileCache = new Map();
    const archives = new Map();

    function cachedLoad(key, loader) {
        const cached = tileCache.get(key);
        if (cached !== undefined) {
            tileCache.delete(key);
            tileCache.set(key, cached);
            return cached;
        }

        const promise = loader();
        tileCache.set(key, promise);
        promise.catch(() => {
            if (tileCache.get(key) === promise) {
                tileCache.delete(key);
            }
        });
        if (tileCache.size > MAX_INPUT_CACHE) {
            tileCache.delete(tileCache.keys().next().value);
        }
        return promise;
    }

    // 204 and 404 mean "no tile here" (sparse tilesets) and yield an empty buffer. Other HTTP errors and network
    // failures reject. Rejections are not cached, and MapLibre reports the output tile as errored.
    async function loadInputTile(url) {
        const response = await fetch(url);
        if (response.status === 204 || response.status === 404) {
            return new ArrayBuffer(0);
        }
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} while loading input tile ${url}`);
        }
        return response.arrayBuffer();
    }

    function fetchInput(z, x, y, archive) {
        if (isPmtiles) {
            let pm = archives.get(archive);
            if (!pm) {
                pm = new PMTiles(archive);
                archives.set(archive, pm);
            }

            const reader = pm;
            return cachedLoad(`pmtiles|${archive}|${z}/${x}/${y}`, async () => {
                const tile = await reader.getZxy(z, x, y);
                return tile?.data ?? null;
            });
        }

        const url = templates[0]
            .replace('{z}', String(z))
            .replace('{x}', String(x))
            .replace('{y}', String(y));
        return cachedLoad(url, () => loadInputTile(url));
    }

    // MapLibre hands the protocol handler a URL with the placeholders already filled and gives it no tile
    // coordinates, so z/x/y are read from the end of it. Everything before that is the archive (for a PMTiles
    // source) and may itself contain digits — dates, ports, archive names — hence the anchored match and the
    // explicit validation instead of trusting the first three numbers.
    function parseTileUrl(url) {
        const clean = url.replace(/^[a-z0-9_-]+:\/\//i, '');
        const match = clean.match(/(\d+)\/(\d+)\/(\d+)(?:\.[A-Za-z0-9]+)?(?:[?#].*)?$/);
        if (!match) {
            throw new Error(`Cannot parse tile coordinates from ${url}`);
        }

        const z = parseInt(match[1], 10);
        const x = parseInt(match[2], 10);
        const y = parseInt(match[3], 10);
        const world = Math.pow(2, z);
        if (!Number.isInteger(z) || z > 24 || x >= world || y >= world) {
            throw new Error(`Tile coordinates out of range in ${url} (z=${z}, x=${x}, y=${y})`);
        }

        return { z, x, y, archive: clean.slice(0, match.index).replace(/\/$/, '') };
    }

    return async function reprojectTile(url) {
        const { z, x, y, archive } = parseTileUrl(url);

        // Output tile covers the fake Mercator world; its corners can fall outside the CRS
        // domain, so sample a grid inside the tile and take the bbox of the finite results.
        const grid = [];
        const steps = 4;
        for (let gy = 0; gy <= steps; gy++) {
            for (let gx = 0; gx <= steps; gx++) {
                grid.push(inputTileLocalToLonLat(gx / steps * TILE_EXTENT, gy / steps * TILE_EXTENT, z, x, y));
            }
        }
        const realGrid = await projection.toReal(grid);
        const valid = realGrid.filter(([lon, lat]) => Number.isFinite(lon) && Number.isFinite(lat));
        if (valid.length === 0) {
            return new Uint8Array();
        }
        const west = Math.min(...valid.map((c) => c[0]));
        const east = Math.max(...valid.map((c) => c[0]));
        const south = Math.min(...valid.map((c) => c[1]));
        const north = Math.max(...valid.map((c) => c[1]));

        // Enumerate input Mercator tiles covering the real bbox (handles full-longitude
        // bboxes and antimeridian wrap, both common for polar/global projections).
        const inputZoom = chooseInputZoom(west, east, south, north, z, maxInputTiles);
        const world = Math.pow(2, inputZoom);
        const fullLon = east - west >= 359.999;
        const xColumns = [];
        if (fullLon) {
            for (let i = 0; i < world; i++) {
                xColumns.push(i);
            }
        } else {
            const wrap = (value) => ((value % world) + world) % world;
            const tx0 = wrap(Math.floor((west + 180) / 360 * world));
            const tx1 = wrap(Math.floor((east + 180) / 360 * world));
            if (tx1 >= tx0) {
                for (let i = tx0; i <= tx1; i++) {
                    xColumns.push(i);
                }
            } else {
                for (let i = tx0; i < world; i++) {
                    xColumns.push(i);
                }
                for (let i = 0; i <= tx1; i++) {
                    xColumns.push(i);
                }
            }
        }
        const y0 = Math.max(0, Math.min(world - 1, Math.floor(latToTileY(north, inputZoom))));
        const y1 = Math.max(0, Math.min(world - 1, Math.floor(latToTileY(south, inputZoom))));

        const candidateCount = (y1 - y0 + 1) * xColumns.length;
        if (candidateCount > maxInputTiles) {
            console.warn(
                `ProjPlugin: source "${sourceId}" tile ${z}/${x}/${y} needs ${candidateCount} input tiles but `
                + `maxInputTiles is ${maxInputTiles}; the output tile is incomplete. Raise maxInputTiles to include it.`);
        }

        const candidates = [];
        for (let yy = y0; yy <= y1 && candidates.length < maxInputTiles; yy++) {
            for (const xx of xColumns) {
                if (candidates.length >= maxInputTiles) {
                    break;
                }
                candidates.push({ xx, yy });
            }
        }

        // One output tile reads up to maxInputTiles input tiles. Fetching them one after another chained a whole
        // row of request round trips in front of every first paint, so they run concurrently and the results are
        // reassembled in enumeration order (the order decides property types and fragment ids).
        const decodedTiles = await mapLimit(
            candidates,
            MAX_INPUT_FETCH_CONCURRENCY,
            async ({ xx, yy }) => {
                // Fetch errors propagate: the output tile fails and MapLibre emits an error event.
                const buffer = await fetchInput(inputZoom, xx, yy, archive);
                if (!buffer || buffer.byteLength === 0) {
                    return null;
                }

                try {
                    return { xx, yy, tables: await decodeInputTile(buffer, inputEncoding) };
                } catch (error) {
                    console.warn(
                        `ProjPlugin: source "${sourceId}" input tile ${inputZoom}/${xx}/${yy} could not be decoded `
                        + `as "${inputEncoding}" and was skipped: ${error.message}`);
                    return null;
                }
            });

        const collected = new Map();
        let fragmentSeq = 0;
        for (const decoded of decodedTiles) {
            if (!decoded) {
                continue;
            }

            const { xx, yy, tables } = decoded;
            for (const table of tables) {
                const layerMap = collected.get(table.name) ?? (() => {
                    const created = new Map();
                    collected.set(table.name, created);
                    return created;
                })();
                for (const feature of table.features) {
                    const geometry = feature.geometry;
                    const realRings = geometry.coordinates.map((ring) =>
                        densifyRing(
                            ring.map((p) => inputTileLocalToLonLat(p.x, p.y, inputZoom, xx, yy, table.extent)),
                            0.25));

                    // Stitch fragments of the same feature across input tiles when the
                    // feature carries an id; otherwise keep fragments independent.
                    const key = feature.id != null
                        ? `id:${feature.id}`
                        : `frag:${inputZoom}:${xx}:${yy}:${fragmentSeq++}`;
                    let entry = layerMap.get(key);
                    if (!entry) {
                        entry = { type: geometry.type, id: feature.id, tags: feature.properties, rings: [] };
                        layerMap.set(key, entry);
                    }
                    entry.rings.push(...realRings);
                }
            }
        }

        // Every vertex of the output tile goes through the CRS transform in one call: a call per feature paid the
        // proj-wasm round trip hundreds of times per tile. The batch is split back by the recorded offsets.
        const pending = [];
        const batch = [];
        for (const [layerName, layerMap] of collected) {
            for (const entry of layerMap.values()) {
                const flat = entry.rings.flat();
                if (flat.length === 0) {
                    continue;
                }
                pending.push({ layerName, entry, start: batch.length, count: flat.length });
                for (const point of flat) {
                    batch.push(point);
                }
            }
        }

        const fake = batch.length > 0 ? await projection.toFake(batch) : [];
        const layerFeatures = new Map();
        for (const { layerName, entry, start, count } of pending) {
            const slice = fake.slice(start, start + count);
            let index = 0;
            const fakeRings = entry.rings.map((ring) => ring.map(() => fakeToTileLocal(slice[index++], z, x, y)));
            const geometry = buildFeatureGeometry(entry.type, fakeRings);
            if (!geometry) {
                continue;
            }

            if (!layerFeatures.has(layerName)) {
                layerFeatures.set(layerName, []);
            }
            layerFeatures.get(layerName).push({ id: entry.id, geometry, properties: entry.tags });
        }

        const layers = [];
        for (const [layerName, features] of layerFeatures) {
            layers.push({ name: layerName, features });
        }

        return encodeTileLayers(layers);
    };
}

// Chains segments that share an endpoint into polylines. The previous version rescanned every segment for every
// merge and copied the whole line on each one, i.e. quadratic in the number of segments of a tile with a copy per
// step — the single most expensive thing a line layer did. Endpoints are indexed into buckets of the merge
// tolerance, and a join looks at the nine neighbouring buckets only (a point just across a bucket edge still
// matches), so chaining is linear in the number of segments. The result keeps the input order: the line that starts
// at the first unused segment comes first.
function mergeLines(segments, eps = 0.5) {
    if (segments.length <= 1) {
        return segments;
    }

    const lines = segments.map((segment) => [segment[0], segment[1]]);
    const used = new Array(lines.length).fill(false);
    const buckets = new Map();
    const bucketKey = (x, y) => `${Math.round(x / eps)}:${Math.round(y / eps)}`;

    const register = (index) => {
        for (const point of lines[index]) {
            const key = bucketKey(point[0], point[1]);
            const bucket = buckets.get(key);
            if (bucket) {
                bucket.push(index);
            } else {
                buckets.set(key, [index]);
            }
        }
    };
    for (let i = 0; i < lines.length; i++) {
        register(i);
    }

    const close = (a, b) => Math.abs(a[0] - b[0]) <= eps && Math.abs(a[1] - b[1]) <= eps;

    // Unused segments with an endpoint within eps of `point`, in input order.
    const candidatesAt = (point) => {
        const bx = Math.round(point[0] / eps);
        const by = Math.round(point[1] / eps);
        const found = new Set();
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const bucket = buckets.get(`${bx + dx}:${by + dy}`);
                if (!bucket) {
                    continue;
                }
                for (const index of bucket) {
                    if (used[index] || found.has(index)) {
                        continue;
                    }
                    if (close(lines[index][0], point) || close(lines[index][1], point)) {
                        found.add(index);
                    }
                }
            }
        }
        return [...found].sort((a, b) => a - b);
    };

    const result = [];
    for (let i = 0; i < lines.length; i++) {
        if (used[i]) {
            continue;
        }
        used[i] = true;
        const line = [lines[i][0], lines[i][1]];

        // Extend from the tail with push, from the head into a separate array: a chain that grows backwards is
        // reversed once instead of shifting the whole line on every join.
        let extending = true;
        while (extending) {
            extending = false;
            for (const index of candidatesAt(line[line.length - 1])) {
                const other = lines[index];
                if (close(line[line.length - 1], other[0])) {
                    line.push(other[1]);
                } else {
                    line.push(other[0]);
                }
                used[index] = true;
                extending = true;
                break;
            }
        }

        const head = [];
        extending = true;
        while (extending) {
            extending = false;
            const anchor = head.length === 0 ? line[0] : head[head.length - 1];
            for (const index of candidatesAt(anchor)) {
                const other = lines[index];
                if (close(anchor, other[1])) {
                    head.push(other[0]);
                } else {
                    head.push(other[1]);
                }
                used[index] = true;
                extending = true;
                break;
            }
        }

        result.push(head.length === 0 ? line : [...head.reverse(), ...line]);
    }
    return result;
}

export function reprojectGeoJson(data, projection) {
    return transformGeometry(JSON.parse(JSON.stringify(data)), projection);
}

// Exported for the browser test harness: both are pure, and the tile path only exposes them indirectly.
export { mergeLines, simplifyPath, simplifyClosedPath };

async function transformGeometry(node, projection) {
    const all = [];
    const walk = (coords) => {
        if (typeof coords?.[0] === 'number') {
            all.push(coords);
            return;
        }
        coords.forEach(walk);
    };
    const features = node.type === 'FeatureCollection' ? node.features : [node];
    for (const feature of features) {
        if (feature?.geometry?.coordinates) {
            walk(feature.geometry.coordinates);
        }
    }

    if (all.length === 0) {
        return node;
    }

    const fake = await projection.toFake(all);
    let index = 0;
    const rebuild = (coords) => {
        if (typeof coords?.[0] === 'number') {
            return fake[index++];
        }
        return coords.map(rebuild);
    };
    for (const feature of features) {
        if (feature?.geometry?.coordinates) {
            feature.geometry.coordinates = rebuild(feature.geometry.coordinates);
        }
    }

    return node;
}
