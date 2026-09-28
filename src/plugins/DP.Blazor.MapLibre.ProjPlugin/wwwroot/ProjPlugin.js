// DP.Blazor.MapLibre.ProjPlugin
//
// Any-projection support for MapLibre GL JS on top of a self-contained, main-thread
// proj-wasm pipeline (see proj-pipeline.js). No maplibre-proj / backproj / Web Workers.
//
// All vendored modules are resolved through a page import map registered on first use.

const coreModulePath = '_content/DP.Blazor.MapLibre/MapLibre.razor.js';
const vendorRoot = '_content/ProjPlugin/vendor/';

function contentUrl(relativePath) {
    return new URL(relativePath, document.baseURI).href;
}

const vendor = {
    projWasm: contentUrl(`${vendorRoot}proj-wasm/dist/proj.mjs`),
    wasmts: contentUrl(`${vendorRoot}wcohen-wasmts/dist/wasmts.js`),
    vectorTile: contentUrl(`${vendorRoot}mapbox-vector-tile/index.js`),
    pointGeometry: contentUrl(`${vendorRoot}mapbox-point-geometry/index.js`),
    pbf: contentUrl(`${vendorRoot}pbf/index.js`),
    pmtiles: contentUrl(`${vendorRoot}pmtiles/pmtiles.mjs`),
    squintCore: contentUrl(`${vendorRoot}squint-cljs/core.js`),
    squintString: contentUrl(`${vendorRoot}squint-cljs/src/squint/string.js`),
    squintMulti: contentUrl(`${vendorRoot}squint-cljs/src/squint/multi.js`),
    resourceTracker: contentUrl(`${vendorRoot}resource-tracker/resource.mjs`),
    workerRouter: contentUrl(`${vendorRoot}worker-router/dist/index.mjs`),
    workerRouterBootstrap: contentUrl(`${vendorRoot}worker-router/dist/worker-bootstrap.mjs`),
    comlink: contentUrl(`${vendorRoot}comlink/dist/esm/comlink.mjs`),
    comlinkNodeAdapter: contentUrl(`${vendorRoot}comlink/dist/esm/node-adapter.mjs`),
};

function buildImportMap() {
    return {
        imports: {
            'maplibre-gl': contentUrl('_content/DP.Blazor.MapLibre/maplibre-gl/dist/maplibre-gl.mjs'),
            'proj-wasm': vendor.projWasm,
            '@wcohen/wasmts': vendor.wasmts,
            '@mapbox/vector-tile': vendor.vectorTile,
            '@mapbox/point-geometry': vendor.pointGeometry,
            'pbf': vendor.pbf,
            'pmtiles': vendor.pmtiles,
            'squint-cljs/core.js': vendor.squintCore,
            'squint-cljs/src/squint/string.js': vendor.squintString,
            'squint-cljs/src/squint/multi.js': vendor.squintMulti,
            'resource-tracker': vendor.resourceTracker,
            'worker-router': vendor.workerRouter,
            'worker-router/worker-bootstrap': vendor.workerRouterBootstrap,
            'comlink': vendor.comlink,
            'comlink/dist/esm/node-adapter.mjs': vendor.comlinkNodeAdapter,
        },
    };
}

function hostProvidesImportMap() {
    return [...document.querySelectorAll('script[type="importmap"]')].some((script) => {
        try {
            return !!JSON.parse(script.textContent || '{}')?.imports?.['proj-wasm'];
        } catch {
            return false;
        }
    });
}

function installImportMap() {
    if (globalThis.__blazorMapLibreProjImportMapInstalled) {
        return;
    }

    if (!hostProvidesImportMap()) {
        const map = buildImportMap();
        const existing = document.querySelector('script[type="importmap"]');
        if (existing) {
            let parsed = {};
            try {
                parsed = JSON.parse(existing.textContent || '{}') || {};
            } catch {
                parsed = {};
            }
            parsed.imports = { ...(parsed.imports ?? {}), ...map.imports };
            existing.textContent = JSON.stringify(parsed);
        }

        const script = document.createElement('script');
        script.type = 'importmap';
        script.textContent = JSON.stringify(map);
        document.head.appendChild(script);
    }

    globalThis.__blazorMapLibreProjImportMapInstalled = true;
}

async function ensureMapLibreGlobal() {
    if (globalThis.maplibregl?.Map) {
        return;
    }

    const mapLibre = await import(contentUrl(coreModulePath));
    await mapLibre.prepareMapLibreGl();
    if (!globalThis.maplibregl?.Map) {
        throw new Error('MapLibre GL JS failed to load');
    }
}

const MAX_TILE_WORKERS = 1; // retained for compatibility; the pipeline is single-threaded

let mapObject = null;
let pipelinePromise = null;

export function initialize(map) {
    mapObject = map;

    const pending = globalThis.__blazorMapLibreProjPendingMapStyle;
    if (map && pending) {
        delete globalThis.__blazorMapLibreProjPendingMapStyle;
        applyStyleToMap(pending.style);
        if (pending.bounds && isUsableBounds(pending.bounds)) {
            map.fitBounds(pending.bounds, pending.fitBoundsOptions);
        }
    }
}

async function loadPipeline() {
    if (!pipelinePromise) {
        pipelinePromise = (async () => {
            installImportMap();
            await ensureMapLibreGlobal();
            return import(contentUrl('_content/ProjPlugin/proj-pipeline.js'));
        })();
    }

    return pipelinePromise;
}

function ensureMap() {
    if (!mapObject) {
        throw new Error('ProjPlugin is not initialized. Register it with the map first.');
    }

    return mapObject;
}

function applyStyleToMap(style) {
    const map = mapObject ?? globalThis.maplibregl?.getMap?.();
    if (map) {
        map.setStyle(style);
    } else {
        globalThis.__blazorMapLibreProjPendingMapStyle = { style };
    }
}

// ----- projections / transformer handles ------------------------------------

const projections = new Map();
const transformers = new Map();
let transformerSeq = 0;

async function getProjection(crs, areaOfUse) {
    const key = `${crs}|${Array.isArray(areaOfUse) ? areaOfUse.join(',') : ''}`;
    if (!projections.has(key)) {
        const pipeline = await loadPipeline();
        projections.set(key, await pipeline.createProjection(crs, areaOfUse));
    }

    return projections.get(key);
}

function storeTransformer(projection, crs, preferredId) {
    const id = preferredId ?? `proj-${++transformerSeq}`;
    transformers.set(id, { projection, crs });
    return id;
}

function getTransformerEntry(transformerId) {
    const entry = transformerId ? transformers.get(transformerId) : null;
    if (!entry) {
        throw new Error(`ProjPlugin transformer '${transformerId}' was not found. Reproject a style first.`);
    }

    return entry;
}

// ----- style reprojection ----------------------------------------------------

const rasterSourceTypes = new Set(['raster', 'raster-dem', 'image', 'video', 'canvas']);

async function prepareStyle(rawStyle) {
    const style = JSON.parse(JSON.stringify(rawStyle));
    const sources = style.sources ?? (style.sources = {});
    const dropped = new Set();

    for (const [id, source] of Object.entries(sources)) {
        if (rasterSourceTypes.has(source?.type)) {
            dropped.add(id);
            continue;
        }

        if (source?.type !== 'vector') {
            continue;
        }

        // PMTiles source: keep it; input tiles are read from the archive via range requests.
        if (typeof source.url === 'string' && source.url.startsWith('pmtiles://')) {
            source.__pmtilesArchive = source.url.slice('pmtiles://'.length);
            delete source.url;
            continue;
        }
        if (Array.isArray(source.tiles) && source.tiles.some((t) => typeof t === 'string' && t.startsWith('pmtiles://'))) {
            const first = source.tiles.find((t) => t.startsWith('pmtiles://'));
            source.__pmtilesArchive = first.slice('pmtiles://'.length).replace(/\/\{z\}\/\{x\}\/\{y\}.*$/, '');
            delete source.tiles;
            continue;
        }

        if (source.url && !Array.isArray(source.tiles)) {
            if (!/^(https?|data|blob):/i.test(source.url)) {
                dropped.add(id);
                continue;
            }

            try {
                const response = await fetch(source.url);
                if (response.ok) {
                    const tilejson = await response.json();
                    if (Array.isArray(tilejson.tiles) && tilejson.tiles.length > 0) {
                        source.tiles = tilejson.tiles;
                    }
                    for (const key of ['minzoom', 'maxzoom', 'bounds', 'attribution', 'scheme']) {
                        if (source[key] === undefined && tilejson[key] !== undefined) {
                            source[key] = tilejson[key];
                        }
                    }
                }
            } catch {
                // ignore, handled by the tiles check below
            }
            delete source.url;
        }

        const tiles = Array.isArray(source.tiles) ? source.tiles : [];
        if (tiles.length === 0 || !tiles.some((url) => /^https?:/i.test(url))) {
            dropped.add(id);
        }
    }

    for (const id of dropped) {
        delete sources[id];
    }

    if (Array.isArray(style.layers)) {
        style.layers = style.layers.filter((layer) => !dropped.has(layer.source));
    }

    return style;
}

const protocolSeq = 0;

async function reprojectStyleInternal(style, crs, transformerId, areaOfUse) {
    const pipeline = await loadPipeline();
    const projection = await getProjection(crs, areaOfUse);
    const prepared = await prepareStyle(style);
    const sources = prepared.sources ?? {};

    for (const [id, source] of Object.entries(sources)) {
        if (source.type === 'geojson' && source.data && typeof source.data === 'object') {
            source.data = await pipeline.reprojectGeoJson(source.data, projection);
        } else if (source.type === 'vector' && (source.__pmtilesArchive || Array.isArray(source.tiles))) {
            const protocolId = `reproj-${sanitize(id)}_${++globalThis.__blazorMapLibreProjProtocolSeq}`;
            const isPmtiles = !!source.__pmtilesArchive;
            const reprojectTile = pipeline.createTileReprojector(
                projection,
                isPmtiles ? { kind: 'pmtiles' } : [...source.tiles]);
            globalThis.maplibregl.addProtocol(protocolId, (params) =>
                reprojectTile(params.url).then((data) => ({ data })));
            if (isPmtiles) {
                source.tiles = [`${protocolId}://${source.__pmtilesArchive}/{z}/{x}/{y}`];
                delete source.__pmtilesArchive;
            } else {
                source.tiles = source.tiles.map((tile) => `${protocolId}://${tile}`);
            }
        }
    }

    prepared.projection = { type: 'mercator' };
    const transformer = storeTransformer(projection, crs, transformerId);
    return { style: prepared, projection, transformerId: transformer };
}

globalThis.__blazorMapLibreProjProtocolSeq ??= 0;

function toBoundsDto(bounds) {
    if (!bounds) {
        return null;
    }

    return {
        _sw: { lng: bounds[0][0], lat: bounds[0][1] },
        _ne: { lng: bounds[1][0], lat: bounds[1][1] },
    };
}

function toResultDto(result) {
    return {
        style: result.style,
        bounds: toBoundsDto(result.bounds),
        maxBounds: result.maxBounds ? toBoundsDto(result.maxBounds) : null,
        transformerId: result.transformerId,
    };
}

function isUsableBounds(bounds) {
    if (!Array.isArray(bounds) || bounds.length !== 2) {
        return false;
    }

    const [[west, south], [east, north]] = bounds;
    return [west, south, east, north].every(Number.isFinite)
        && Math.abs(east - west) > 1e-6
        && Math.abs(north - south) > 1e-6;
}

function sanitize(value) {
    return String(value).replace(/[^a-zA-Z0-9]/g, '_');
}

async function reprojectCore(options) {
    if (!options?.crs) {
        throw new Error('reprojectStyle requires a crs (for example "EPSG:5070").');
    }
    if (!options.style) {
        throw new Error('reprojectStyle requires a style.');
    }

    const result = await reprojectStyleInternal(options.style, options.crs, options.transformerId, options.areaOfUse);
    const projection = result.projection;

    return {
        style: result.style,
        bounds: projection.bounds ?? [[-180, -85], [180, 85]],
        maxBounds: null,
        transformerId: result.transformerId,
    };
}

export async function reprojectStyle(options) {
    return toResultDto(await reprojectCore(options));
}

export async function applyReprojection(options) {
    const result = await reprojectCore(options);
    const map = ensureMap();

    map.setStyle(result.style, options.setStyleOptions);
    if (options.fitBounds !== false && isUsableBounds(result.bounds)) {
        map.fitBounds(result.bounds, options.fitBoundsOptions);
    }

    return toResultDto(result);
}

export async function reprojectCurrentStyle(options) {
    if (!options?.crs) {
        throw new Error('reprojectCurrentStyle requires a crs.');
    }

    const map = ensureMap();
    const result = await reprojectCore({ ...options, style: map.getStyle() });

    map.setStyle(result.style, options.setStyleOptions);
    if (options.fitBounds !== false && isUsableBounds(result.bounds)) {
        map.fitBounds(result.bounds, options.fitBoundsOptions);
    }

    return toResultDto(result);
}

export async function reprojectSource(options) {
    if (!options?.crs) {
        throw new Error('reprojectSource requires a crs.');
    }
    if (!options.source) {
        throw new Error('reprojectSource requires a source.');
    }

    const pipeline = await loadPipeline();
    const projection = await getProjection(options.crs, options.areaOfUse);
    const source = JSON.parse(JSON.stringify(options.source));

    if (source.type === 'geojson' && source.data && typeof source.data === 'object') {
        source.data = await pipeline.reprojectGeoJson(source.data, projection);
    } else if (source.type === 'vector' && (source.__pmtilesArchive || Array.isArray(source.tiles))) {
        const protocolId = `reproj-${sanitize(options.sourceId ?? 'source')}_${++globalThis.__blazorMapLibreProjProtocolSeq}`;
        const isPmtiles = !!source.__pmtilesArchive;
        const reprojectTile = pipeline.createTileReprojector(
            projection,
            isPmtiles ? { kind: 'pmtiles' } : [...source.tiles]);
        globalThis.maplibregl.addProtocol(protocolId, (params) =>
            reprojectTile(params.url).then((data) => ({ data })));
        if (isPmtiles) {
            source.tiles = [`${protocolId}://${source.__pmtilesArchive}/{z}/{x}/{y}`];
            delete source.__pmtilesArchive;
        } else {
            source.tiles = source.tiles.map((tile) => `${protocolId}://${tile}`);
        }
    }

    return {
        source,
        transformerId: storeTransformer(projection, options.crs, options.transformerId),
    };
}

// ----- coordinates -----------------------------------------------------------

export async function inverseTransformCoords(coordinates, transformerId) {
    const entry = getTransformerEntry(transformerId);
    const input = (coordinates ?? []).map((c) => [c.lng ?? c[0], c.lat ?? c[1]]);
    const real = await entry.projection.toReal(input);
    return real.map(([lng, lat]) => ({ lng, lat }));
}

export async function transformPoint(coordinate, transformerId) {
    const entry = getTransformerEntry(transformerId);
    const fake = await entry.projection.toFake([[coordinate.lng ?? coordinate[0], coordinate.lat ?? coordinate[1]]]);
    return { lng: fake[0][0], lat: fake[0][1] };
}

export async function shutdownTileWorkers() {
    projections.clear();
    transformers.clear();
}

export function releaseTransformer(transformerId) {
    return transformers.delete(transformerId);
}

export function getImportMap() {
    return buildImportMap();
}

export function getVendorManifest() {
    return fetch(contentUrl(`${vendorRoot}manifest.json`)).then((res) => (res.ok ? res.json() : null));
}

export function dispose() {
    transformers.clear();
    mapObject = null;
}

const pipelineApi = {
    initialize,
    reprojectStyle,
    applyReprojection,
    reprojectCurrentStyle,
    reprojectSource,
    inverseTransformCoords,
    transformPoint,
    shutdownTileWorkers,
    releaseTransformer,
    getImportMap,
    getVendorManifest,
    dispose,
};

globalThis.__blazorMapLibreProj = pipelineApi;
