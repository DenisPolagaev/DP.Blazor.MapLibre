// Main-thread projection pipeline built directly on proj-wasm (no Web Workers).
// Replaces maplibre-proj/backproj for the projection plugin.
//
// Responsibilities:
//   - real lon/lat <-> fake lon/lat (fake space is what MapLibre renders in Mercator)
//   - MapLibre protocol handler that reprojects vector tiles (MVT in / MVT out)
//   - GeoJSON reprojection
//
// Known simplifications vs backproj: no cross-input-tile feature stitching and no
// polygon repair. Geometry is densified in real space and clipped to the output tile.

import * as proj from './vendor/proj-wasm/dist/proj.mjs';
import { VectorTile } from '@mapbox/vector-tile';
import { PMTiles } from 'pmtiles';
import Pbf from 'pbf';

const EARTH_RADIUS = 6378137;
const MERC_MAX = Math.PI * EARTH_RADIUS; // 20037508.342789244
const TILE_EXTENT = 4096;
const DEG = 180 / Math.PI;
const RAD = Math.PI / 180;

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

export async function createProjection(crs, areaOfUse) {
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
        for (let latitude = -80; latitude <= 80; latitude += 10) {
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

function inputTileGeom(realLonLat, z, x, y) {
    // real lon/lat -> tile-local [0..extent] for the input Mercator tile.
    const [mx, my] = lonLatToMerc(realLonLat[0], realLonLat[1]);
    const b = tileToMerc(z, x, y);
    return [
        (mx - b.minX) / (b.maxX - b.minX) * TILE_EXTENT,
        (b.maxY - my) / (b.maxY - b.minY) * TILE_EXTENT,
    ];
}

function inputTileLocalToLonLat(px, py, z, x, y) {
    const b = tileToMerc(z, x, y);
    const mx = b.minX + (px / TILE_EXTENT) * (b.maxX - b.minX);
    const my = b.maxY - (py / TILE_EXTENT) * (b.maxY - b.minY);
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

// ----- MVT encoding ----------------------------------------------------------

function zigzag(value) {
    return (value << 1) ^ (value >> 31);
}

function writeValue(pbf, value) {
    const type = typeof value;
    if (type === 'string') {
        pbf.writeStringField(1, value);
    } else if (type === 'boolean') {
        pbf.writeBooleanField(7, value);
    } else if (type === 'number') {
        if (Number.isInteger(value)) {
            if (value < 0) {
                pbf.writeSVarintField(6, value);
            } else {
                pbf.writeVarintField(5, value);
            }
        } else {
            pbf.writeDoubleField(3, value);
        }
    } else if (value == null) {
        pbf.writeStringField(1, '');
    } else {
        pbf.writeStringField(1, String(value));
    }
}

function writeGeometry(pbf, geometry, type) {
    const commands = [];
    let cx = 0;
    let cy = 0;
    const emit = (id, points) => {
        if (points.length === 0) {
            return;
        }
        commands.push((id & 0x7) | (points.length << 3));
        for (const [px, py] of points) {
            const rx = Math.round(px);
            const ry = Math.round(py);
            commands.push(zigzag(rx - cx));
            commands.push(zigzag(ry - cy));
            cx = rx;
            cy = ry;
        }
    };

    if (type === 1) {
        for (const [point] of geometry) {
            emit(1, [point]);
        }
    } else {
        for (const ring of geometry) {
            if (ring.length < 2) {
                continue;
            }
            emit(1, [ring[0]]);
            emit(2, ring.slice(1));
            if (type === 3) {
                commands.push((7 & 0x7) | (1 << 3));
            }
        }
    }

    pbf.writePackedVarint(4, commands);
}

function encodeMvt(layers) {
    const pbf = new Pbf();
    for (const [name, layer] of Object.entries(layers)) {
        if (layer.features.length === 0) {
            continue;
        }

        pbf.writeMessage(3, (_obj, message) => {
            message.writeVarintField(15, 2); // version
            message.writeStringField(1, name);

            const keys = [];
            const keyIndex = new Map();
            const values = [];
            const valueIndex = new Map();

            for (const feature of layer.features) {
                message.writeMessage(2, (_o, f) => {
                    if (feature.id != null) {
                        f.writeVarintField(1, feature.id);
                    }

                    const tags = [];
                    for (const [k, v] of Object.entries(feature.tags ?? {})) {
                        if (v == null) {
                            continue;
                        }
                        let ki = keyIndex.get(k);
                        if (ki === undefined) {
                            ki = keys.length;
                            keys.push(k);
                            keyIndex.set(k, ki);
                        }
                        const vk = `${typeof v}:${v}`;
                        let vi = valueIndex.get(vk);
                        if (vi === undefined) {
                            vi = values.length;
                            values.push(v);
                            valueIndex.set(vk, vi);
                        }
                        tags.push(ki, vi);
                    }

                    if (tags.length > 0) {
                        f.writePackedVarint(2, tags);
                    }
                    f.writeVarintField(3, feature.type);
                    writeGeometry(f, feature.geometry, feature.type);
                });
            }

            for (const key of keys) {
                message.writeStringField(3, key);
            }
            for (const value of values) {
                message.writeMessage(4, (_o, v) => writeValue(v, value));
            }
            message.writeVarintField(5, TILE_EXTENT);
        });
    }

    return pbf.finish();
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

// `input` is either an array of XYZ tile URL templates, or `{ kind: 'pmtiles' }` (the archive
// URL is derived from the requested output tile URL).
export function createTileReprojector(projection, input) {
    const isPmtiles = !Array.isArray(input) && input?.kind === 'pmtiles';
    const templates = Array.isArray(input) ? input : (input?.templates ?? []);
    const inputCache = new Map();
    const pmtilesCache = new Map();
    const MAX_INPUT_CACHE = 256;

    async function fetchTile(url) {
        if (inputCache.has(url)) {
            return inputCache.get(url);
        }
        const promise = fetch(url).then((r) => (r.ok ? r.arrayBuffer() : new ArrayBuffer(0)));
        inputCache.set(url, promise);
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
        const clean = url.replace(/^[a-z0-9_-]+:\/\//i, '');
        const match = clean.match(/(\d+)\/(\d+)\/(\d+)/);
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
        const maxTiles = 64;
        let tilesFetched = 0;
        let fragmentSeq = 0;

        for (let yy = y0; yy <= y1 && tilesFetched < maxTiles; yy++) {
            for (const xx of xColumns) {
                if (tilesFetched >= maxTiles) {
                    break;
                }
                tilesFetched++;
                let buffer;
                try {
                    buffer = await fetchInput(inputZoom, xx, yy, archive);
                } catch {
                    continue;
                }
                if (!buffer || buffer.byteLength === 0) {
                    continue;
                }

                let tile;
                try {
                    tile = new VectorTile(new Pbf(new Uint8Array(buffer)));
                } catch {
                    continue;
                }

                for (const [layerName, layer] of Object.entries(tile.layers)) {
                    const layerMap = collected.get(layerName) ?? (() => {
                        const created = new Map();
                        collected.set(layerName, created);
                        return created;
                    })();
                    for (let i = 0; i < layer.length; i++) {
                        const feature = layer.feature(i);
                        const geometry = feature.loadGeometry();
                        const realRings = geometry.map((ring) =>
                            densifyRing(ring.map((p) => inputTileLocalToLonLat(p.x, p.y, inputZoom, xx, yy)), 0.25));

                        // Stitch fragments of the same feature across input tiles when the
                        // feature carries an id; otherwise keep fragments independent.
                        const key = feature.id != null
                            ? `id:${feature.id}`
                            : `frag:${inputZoom}:${xx}:${yy}:${i}:${fragmentSeq++}`;
                        let entry = layerMap.get(key);
                        if (!entry) {
                            entry = { type: feature.type, id: feature.id, tags: feature.properties, rings: [] };
                            layerMap.set(key, entry);
                        }
                        entry.rings.push(...realRings);
                    }
                }
            }
        }

        const layers = {};
        for (const [layerName, layerMap] of collected) {
            const features = [];
            for (const entry of layerMap.values()) {
                const realRings = entry.type === 2 ? mergeLines(entry.rings, 1e-6) : entry.rings;
                const flat = realRings.flat();
                if (flat.length === 0) {
                    continue;
                }

                const fake = await projection.toFake(flat);
                let index = 0;
                const fakeRings = realRings.map((ring) => ring.map(() => fakeToTileLocal(fake[index++], z, x, y)));

                const extentF = TILE_EXTENT;
                const buffered = 8;
                const finite = ([px, py]) => Number.isFinite(px) && Number.isFinite(py);
                let outGeometry;
                if (entry.type === 1) {
                    outGeometry = fakeRings.flat()
                        .filter((p) => finite(p) && p[0] >= -64 && p[0] <= extentF + 64 && p[1] >= -64 && p[1] <= extentF + 64)
                        .map((p) => [p]);
                } else if (entry.type === 2) {
                    outGeometry = [];
                    for (const ring of fakeRings) {
                        for (let s = 0; s < ring.length - 1; s++) {
                            if (!finite(ring[s]) || !finite(ring[s + 1])) {
                                continue;
                            }
                            const seg = clipSegment(ring[s], ring[s + 1], extentF, buffered);
                            if (seg) {
                                outGeometry.push(seg);
                            }
                        }
                    }
                    outGeometry = mergeLines(outGeometry, 0.5);
                } else {
                    outGeometry = [];
                    for (const ring of fakeRings) {
                        const clipped = clipPolygon(ring.filter(finite), extentF, buffered);
                        if (clipped.length >= 3) {
                            const area = ringArea(clipped);
                            if (Math.abs(area) > 1) {
                                outGeometry.push(area > 0 ? clipped : clipped.reverse());
                            }
                        }
                    }
                }

                if (outGeometry.length === 0) {
                    continue;
                }

                features.push({ id: entry.id, tags: entry.tags, type: entry.type, geometry: outGeometry });
            }

            if (features.length > 0) {
                layers[layerName] = { features };
            }
        }

        return encodeMvt(layers);
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
