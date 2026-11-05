// Main-thread projection pipeline built directly on proj-wasm (no Web Workers).
// Replaces maplibre-proj/backproj for the projection plugin.
//
// Responsibilities:
//   - real lon/lat <-> fake lon/lat (fake space is what MapLibre renders in Mercator)
//   - MapLibre protocol handler that reprojects vector tiles (MLT in / MLT out)
//   - GeoJSON reprojection
//
// Vector tiles are MapLibre Tiles (MLT v1): the input tile is decoded with @maplibre/mlt, the
// geometry is reprojected, and the result is encoded back with @maplibre/mlt. There is no MVT
// branch: a source that declares encoding "mvt" cannot be reprojected.
//
// Known simplifications vs backproj: no cross-input-tile feature stitching beyond the feature id and
// no polygon repair. Geometry is densified in real space and clipped to the output tile.

import * as proj from './vendor/proj-wasm/dist/proj.mjs';
import { decodeTile, encodeTile } from '@maplibre/mlt';
import { PMTiles } from 'pmtiles';

const EARTH_RADIUS = 6378137;
const MERC_MAX = Math.PI * EARTH_RADIUS; // 20037508.342789244
const TILE_EXTENT = 4096;
const DEG = 180 / Math.PI;
const RAD = Math.PI / 180;
const DEFAULT_MAX_INPUT_TILES = 64;

let contextPromise = null;

async function getContext() {
    if (!contextPromise) {
        contextPromise = (async () => {
            await proj.init();
            return await proj.contextCreate();
        })();
    }

    return contextPromise;
}

function flatTransform(op, coords, direction) {
    // coords: [[a, b], ...] passed straight through the PROJ axis order.
    return (async () => {
        const array = await proj.coordArray(coords.length);
        await proj.setCoords(array, coords.map(([a, b]) => [a, b, 0, 0]));
        if (coords.length > 0) {
            await proj.projTransArray({ p: op, direction, n: coords.length, coord: array });
        }
        const out = [];
        for (let i = 0; i < coords.length; i++) {
            const c = await proj.getCoords(array, i);
            out.push([c[0], c[1]]);
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

// polarHemisphere ("north" | "south", optional) limits the default sampling to one hemisphere so that a polar CRS is
// framed by its own pole. It is ignored when areaOfUse is given.
export async function createProjection(crs, areaOfUse, polarHemisphere = null) {
    const context = await getContext();
    const forwardOp = await proj.projCreateCrsToCrs({ context, source_crs: 'EPSG:4326', target_crs: crs });
    const inverseOp = await proj.projCreateCrsToCrs({ context, source_crs: crs, target_crs: 'EPSG:4326' });

    // Sample the world (or the provided lon/lat area of use) to derive the fake-space
    // scale/offset. The round-trip filter drops points outside the CRS area of use.
    const samples = [];
    if (Array.isArray(areaOfUse) && areaOfUse.length === 4) {
        const [west, south, east, north] = areaOfUse;
        const lonStep = Math.max(1, (east - west) / 8);
        const latStep = Math.max(1, (north - south) / 8);
        for (let latitude = south; latitude <= north + 1e-9; latitude += latStep) {
            for (let longitude = west; longitude <= east + 1e-9; longitude += lonStep) {
                samples.push([latitude, longitude]);
            }
        }
    } else {
        const [minLatitude, maxLatitude] = polarHemisphere === 'north'
            ? [0, 80]
            : polarHemisphere === 'south' ? [-80, 0] : [-80, 80];
        for (let latitude = minLatitude; latitude <= maxLatitude; latitude += 10) {
            for (let longitude = -180; longitude < 180; longitude += 10) {
                samples.push([latitude, longitude]);
            }
        }
    }

    const meters = await flatTransform(forwardOp, samples, 1);
    const back = await flatTransform(inverseOp, meters, 1);

    // Keep only samples inside the CRS area of use: outside points extrapolate, and a
    // forward->inverse round-trip no longer returns the original lon/lat.
    const kept = [];
    for (let i = 0; i < samples.length; i++) {
        const [lat, lon] = samples[i];
        const [x, y] = meters[i];
        const [backLat, backLon] = back[i];
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

    const toMeters = (realPairs) => flatTransform(forwardOp, realPairs.map(([lon, lat]) => [lat, lon]), 1);
    const fromMeters = (xyPairs) => flatTransform(inverseOp, xyPairs, 1);

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
            const real = await fromMeters(meters);
            return real.map(([lat, lon]) => [lon, lat]);
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

// ----- MapLibre Tile decoding -------------------------------------------------

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

// Decodes one input tile into [{ name, extent, features }]; features carry the MapLibre Tile geometry.
async function decodeInputTile(buffer) {
    let bytes = new Uint8Array(buffer);
    if (isGzip(bytes)) {
        bytes = await inflate(bytes);
    }

    return decodeTile(bytes).map((table) => ({
        name: table.name,
        extent: table.extent || TILE_EXTENT,
        features: table.getFeatures(),
    }));
}

// ----- MapLibre Tile encoding -------------------------------------------------

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

    // Mixed scalars (for example a string in one tile and a number in another): a string column keeps
    // the tile readable, and the type change is surfaced instead of silently reshaping the schema.
    console.warn(
        `ProjPlugin: layer "${layerName}" property "${columnName}" mixes value types; `
        + 'the reprojected tile writes it as strings.');
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

// Pick the highest input zoom whose bbox tile footprint stays within the budget.
function chooseInputZoom(west, east, south, north, outputZ) {
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
        if (columns * rows <= 16) {
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
        const simplified = simplifyRing(clipped);
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
// requested output tile URL). `options.sourceId` labels warnings and `options.maxInputTiles` caps the input tiles read
// for one output tile (default 64). Only the first URL template is used; extra templates are reported.
export function createTileReprojector(projection, input, options = {}) {
    const isPmtiles = !Array.isArray(input) && input?.kind === 'pmtiles';
    const templates = Array.isArray(input) ? input : (input?.templates ?? []);
    const sourceId = options.sourceId ?? 'unnamed';
    const maxInputTiles = options.maxInputTiles ?? DEFAULT_MAX_INPUT_TILES;
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
    const inputCache = new Map();
    const pmtilesCache = new Map();
    const MAX_INPUT_CACHE = 256;

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

    function fetchTile(url) {
        if (inputCache.has(url)) {
            return inputCache.get(url);
        }
        const promise = loadInputTile(url);
        inputCache.set(url, promise);
        promise.catch(() => {
            if (inputCache.get(url) === promise) {
                inputCache.delete(url);
            }
        });
        if (inputCache.size > MAX_INPUT_CACHE) {
            inputCache.delete(inputCache.keys().next().value);
        }
        return promise;
    }

    async function fetchInput(z, x, y, archive) {
        if (isPmtiles) {
            let pm = pmtilesCache.get(archive);
            if (!pm) {
                pm = new PMTiles(archive);
                pmtilesCache.set(archive, pm);
            }
            const tile = await pm.getZxy(z, x, y);
            return tile?.data ?? null;
        }
        const url = templates[0]
            .replace('{z}', String(z))
            .replace('{x}', String(x))
            .replace('{y}', String(y));
        return fetchTile(url);
    }

    return async function reprojectTile(url) {
        // z/x/y are read from the end of the URL, after MapLibre filled the placeholders. Earlier digit runs
        // (dates, ports, archive names) must not be mistaken for the tile coordinates.
        const clean = url.replace(/^[a-z0-9_-]+:\/\//i, '');
        const match = clean.match(/(\d+)\/(\d+)\/(\d+)(?:\.[A-Za-z0-9]+)?(?:\?.*)?$/);
        if (!match) {
            throw new Error(`Cannot parse tile coordinates from ${url}`);
        }
        const z = parseInt(match[1], 10);
        const x = parseInt(match[2], 10);
        const y = parseInt(match[3], 10);
        const archive = clean.slice(0, match.index).replace(/\/$/, '');

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
        let west = Math.min(...valid.map((c) => c[0]));
        let east = Math.max(...valid.map((c) => c[0]));
        let south = Math.min(...valid.map((c) => c[1]));
        let north = Math.max(...valid.map((c) => c[1]));

        // Enumerate input Mercator tiles covering the real bbox (handles full-longitude
        // bboxes and antimeridian wrap, both common for polar/global projections).
        const inputZoom = chooseInputZoom(west, east, south, north, z);
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

        const collected = new Map();
        const candidateCount = (y1 - y0 + 1) * xColumns.length;
        if (candidateCount > maxInputTiles) {
            console.warn(
                `ProjPlugin: source "${sourceId}" tile ${z}/${x}/${y} needs ${candidateCount} input tiles but `
                + `maxInputTiles is ${maxInputTiles}; the output tile is incomplete. Raise maxInputTiles to include it.`);
        }
        let tilesFetched = 0;
        let fragmentSeq = 0;

        for (let yy = y0; yy <= y1 && tilesFetched < maxInputTiles; yy++) {
            for (const xx of xColumns) {
                if (tilesFetched >= maxInputTiles) {
                    break;
                }
                tilesFetched++;
                // Fetch errors propagate: the output tile fails and MapLibre emits an error event.
                const buffer = await fetchInput(inputZoom, xx, yy, archive);
                if (!buffer || buffer.byteLength === 0) {
                    continue;
                }

                let decoded;
                try {
                    decoded = await decodeInputTile(buffer);
                } catch (error) {
                    console.warn(
                        `ProjPlugin: source "${sourceId}" input tile ${inputZoom}/${xx}/${yy} could not be decoded `
                        + `as MapLibre Tile and was skipped: ${error.message}`);
                    continue;
                }

                for (const table of decoded) {
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
        }

        const layers = [];
        for (const [layerName, layerMap] of collected) {
            const features = [];
            for (const entry of layerMap.values()) {
                const flat = entry.rings.flat();
                if (flat.length === 0) {
                    continue;
                }

                const fake = await projection.toFake(flat);
                let index = 0;
                const fakeRings = entry.rings.map((ring) => ring.map(() => fakeToTileLocal(fake[index++], z, x, y)));
                const geometry = buildFeatureGeometry(entry.type, fakeRings);
                if (!geometry) {
                    continue;
                }

                features.push({ id: entry.id, geometry, properties: entry.tags });
            }

            if (features.length > 0) {
                layers.push({ name: layerName, features });
            }
        }

        return encodeTileLayers(layers);
    };
}

function mergeLines(segments, eps = 0.5) {
    if (segments.length <= 1) {
        return segments;
    }
    const lines = segments.map((s) => [s[0], s[1]]);
    const used = new Array(lines.length).fill(false);
    const result = [];
    for (let i = 0; i < lines.length; i++) {
        if (used[i]) {
            continue;
        }
        used[i] = true;
        let line = lines[i];
        let merged = true;
        while (merged) {
            merged = false;
            for (let j = 0; j < lines.length; j++) {
                if (used[j]) {
                    continue;
                }
                const other = lines[j];
                const close = (a, b) => Math.abs(a[0] - b[0]) <= eps && Math.abs(a[1] - b[1]) <= eps;
                if (close(line[line.length - 1], other[0])) {
                    line = line.concat(other.slice(1));
                    used[j] = true;
                    merged = true;
                } else if (close(line[line.length - 1], other[other.length - 1])) {
                    line = line.concat([...other].reverse().slice(1));
                    used[j] = true;
                    merged = true;
                } else if (close(line[0], other[other.length - 1])) {
                    line = other.slice(0, other.length - 1).concat(line);
                    used[j] = true;
                    merged = true;
                }
            }
        }
        result.push(line);
    }
    return result;
}

export function reprojectGeoJson(data, projection) {
    return transformGeometry(JSON.parse(JSON.stringify(data)), projection);
}

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
