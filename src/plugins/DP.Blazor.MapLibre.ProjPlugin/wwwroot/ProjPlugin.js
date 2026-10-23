// DP.Blazor.MapLibre.ProjPlugin
//
// Any-projection support for MapLibre GL JS on top of the main-thread proj-wasm pipeline in proj-pipeline.js.
// There are no Web Workers and no maplibre-proj / backproj.
//
// State ownership:
// - Process-wide (module scope): the proj-wasm instance (inside proj-pipeline.js), the import map flag, the
//   projection cache, the transformer registry and the protocol name sequence. MapLibre's protocol registry is
//   process-wide, so protocol names must be unique per document.
// - Per map (getMapState): protocol names with the generation that registered them, source protocols, the
//   transformer ids the map owns, and the queue that serializes style changes.
//
// Entry points that act on a map take the map as an optional trailing argument. The Blazor plugin always passes
// it. Without it, the map from the last initialize() call is used; that fallback exists for standalone callers
// such as the browser test harness.

import { getMapState, peekMapState, deleteMapState } from '../DP.Blazor.MapLibre/PluginRuntime.js';

const STATE_KEY = 'ProjPlugin';
const DEFAULT_MAX_INPUT_TILES = 64;
const POLAR_HEMISPHERES = ['north', 'south'];
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
        } catch (error) {
            console.warn(`ProjPlugin: ignoring an invalid import map in the page: ${error.message}`);
            return false;
        }
    });
}

// ----- import map -----------------------------------------------------------------

let importMapInstalled = false;

// import.meta.resolve applies the document's import maps and throws for an unmapped bare specifier.
// Returns null when the browser has no import.meta.resolve, so the result cannot be verified.
function importMapResolves() {
    if (typeof import.meta.resolve !== 'function') {
        return null;
    }

    try {
        import.meta.resolve('proj-wasm');
        return true;
    } catch {
        return false;
    }
}

// Adds the vendored module entries unless the host already declares them. Browsers read import maps only before
// the first module loads, so an entry added here can be ignored; that case is reported with console.warn.
function installImportMap() {
    if (importMapInstalled) {
        return;
    }
    importMapInstalled = true;

    if (hostProvidesImportMap()) {
        return;
    }

    const map = buildImportMap();
    const existing = document.querySelector('script[type="importmap"]');
    if (existing) {
        let parsed = {};
        try {
            parsed = JSON.parse(existing.textContent || '{}') || {};
        } catch (error) {
            console.warn(`ProjPlugin: the page's existing import map is not valid JSON and was replaced: ${error.message}`);
        }
        parsed.imports = { ...(parsed.imports ?? {}), ...map.imports };
        existing.textContent = JSON.stringify(parsed);
    }

    const script = document.createElement('script');
    script.type = 'importmap';
    script.textContent = JSON.stringify(map);
    document.head.appendChild(script);

    const resolves = importMapResolves();
    if (resolves !== true) {
        const outcome = resolves === false ? 'did not honour them' : 'cannot be verified';
        console.warn(
            `ProjPlugin: the vendored module entries were added at runtime and this browser ${outcome}. `
            + 'Browsers read import maps only before the first module loads. Copy the entries from '
            + 'GetImportMapAsync() into a static <script type="importmap"> before Blazor starts.');
    }
}

// ----- MapLibre and pipeline loading ----------------------------------------------

// The C# base class prepares globalThis.maplibregl before importing this module. The fixture for the browser tests
// assigns it the same way.
function requireMapLibre() {
    const maplibre = globalThis.maplibregl;
    if (typeof maplibre?.addProtocol !== 'function' || typeof maplibre?.removeProtocol !== 'function') {
        throw new Error(
            'ProjPlugin requires globalThis.maplibregl. MapLibre prepares it when the plugin is registered '
            + 'with MapLibre.RegisterPlugin.');
    }

    return maplibre;
}

let pipelinePromise = null;

function loadPipeline() {
    requireMapLibre();
    if (!pipelinePromise) {
        pipelinePromise = Promise.resolve()
            .then(() => {
                installImportMap();
                return import(contentUrl('_content/ProjPlugin/proj-pipeline.js'));
            })
            .catch((error) => {
                // Clear the cache so a later call can retry after the host fixes the import map.
                pipelinePromise = null;
                throw new Error(
                    `ProjPlugin could not load proj-pipeline.js: ${error.message}. If the message is `
                    + '"Failed to resolve module specifier", add the entries from GetImportMapAsync() to a static '
                    + '<script type="importmap"> before Blazor starts.',
                    { cause: error });
            });
    }

    return pipelinePromise;
}

// ----- per-map bookkeeping --------------------------------------------------------

// Process-wide caches. Projections are pure functions of their inputs, so they are shared by all maps.
const projectionCache = new Map(); // key -> Promise<projection>
const transformers = new Map(); // transformer id -> { projection, crs, owner }
let transformerSequence = 0;
let protocolSequence = 0; // MapLibre protocol names are process-wide

// Bookkeeping for calls that have no map at all (only possible through standalone use).
const sharedState = createMapState();
let lastMap = null;

function createMapState() {
    return {
        protocols: new Map(), // protocol name -> generation that registered it
        sourceProtocols: new Map(), // reprojectSource sourceId -> protocol name
        transformerIds: new Set(),
        generation: 0, // incremented by every apply
        queue: Promise.resolve(), // serializes style changes for this map
    };
}

function ownerOf(map) {
    return map ?? lastMap;
}

function stateFor(map) {
    const owner = ownerOf(map);
    return owner ? getMapState(owner, STATE_KEY, createMapState) : sharedState;
}

function resolveMap(map) {
    const owner = ownerOf(map);
    if (!owner) {
        throw new Error('ProjPlugin is not initialized. Register it with the map first.');
    }

    return owner;
}

function enqueue(state, task) {
    const run = state.queue.then(task);
    // The queue continues after a failure; the caller still receives the error through `run`.
    state.queue = run.catch(() => {});
    return run;
}

// ----- protocols ------------------------------------------------------------------

function removeProtocol(state, name) {
    state.protocols.delete(name);
    for (const [sourceId, protocol] of state.sourceProtocols) {
        if (protocol === name) {
            state.sourceProtocols.delete(sourceId);
        }
    }

    requireMapLibre().removeProtocol(name);
}

// Removes the protocols registered before `generation`, i.e. the handlers of the style that was just replaced.
function removeProtocolsBefore(state, generation) {
    for (const [name, created] of [...state.protocols]) {
        if (created < generation) {
            removeProtocol(state, name);
        }
    }
}

function removeAllProtocols(state) {
    for (const name of [...state.protocols.keys()]) {
        removeProtocol(state, name);
    }
}

// Registers a MapLibre protocol for one reprojected source. A non-null sourceKey makes a later call with the same key
// replace the earlier handler instead of accumulating handlers.
function registerSourceProtocol(state, generation, label, sourceKey, reprojectTile) {
    if (sourceKey != null) {
        const previous = state.sourceProtocols.get(sourceKey);
        if (previous) {
            removeProtocol(state, previous);
        }
    }

    const name = `reproj-${sanitize(label)}_${++protocolSequence}`;
    requireMapLibre().addProtocol(name, async (params) => ({ data: await reprojectTile(params.url) }));
    state.protocols.set(name, generation);
    if (sourceKey != null) {
        state.sourceProtocols.set(sourceKey, name);
    }

    return name;
}

// ----- transformers and projections -----------------------------------------------

function storeTransformer(state, projection, crs, preferredId) {
    const id = preferredId ?? `proj-${++transformerSequence}`;
    transformers.get(id)?.owner.transformerIds.delete(id);
    transformers.set(id, { projection, crs, owner: state });
    state.transformerIds.add(id);
    return id;
}

function releaseTransformerEntry(id) {
    const entry = transformers.get(id);
    if (!entry) {
        return false;
    }

    transformers.delete(id);
    entry.owner.transformerIds.delete(id);
    return true;
}

function getTransformerEntry(transformerId) {
    const entry = transformerId ? transformers.get(transformerId) : null;
    if (!entry) {
        throw new Error(`ProjPlugin transformer '${transformerId}' was not found. Reproject a style first.`);
    }

    return entry;
}

function getProjection(crs, areaOfUse, polarHemisphere) {
    const key = `${crs}|${areaOfUse ? areaOfUse.join(',') : ''}|${polarHemisphere ?? ''}`;
    if (!projectionCache.has(key)) {
        const pending = loadPipeline().then((pipeline) => pipeline.createProjection(crs, areaOfUse, polarHemisphere));
        projectionCache.set(key, pending);
        // A failed derivation is not cached, so a corrected CRS or area is derived again.
        pending.catch(() => {
            if (projectionCache.get(key) === pending) {
                projectionCache.delete(key);
            }
        });
    }

    return projectionCache.get(key);
}

// Reuses the projection of an existing transformer when its id is passed back with the same CRS.
async function resolveProjection(args) {
    const existing = args.transformerId ? transformers.get(args.transformerId) : undefined;
    if (existing) {
        if (existing.crs !== args.crs) {
            throw new Error(
                `ProjPlugin transformer '${args.transformerId}' was created for ${existing.crs}, not ${args.crs}.`);
        }

        return existing.projection;
    }

    return getProjection(args.crs, args.areaOfUse, args.polarHemisphere);
}

function readProjectionArgs(options) {
    if (!options?.crs) {
        throw new Error('A crs is required (for example "EPSG:5070").');
    }

    const maxInputTiles = options.maxInputTiles ?? DEFAULT_MAX_INPUT_TILES;
    if (!Number.isInteger(maxInputTiles) || maxInputTiles < 1) {
        throw new Error(`maxInputTiles must be a positive integer, got ${maxInputTiles}.`);
    }

    const polarHemisphere = options.polarHemisphere ?? null;
    if (polarHemisphere !== null && !POLAR_HEMISPHERES.includes(polarHemisphere)) {
        throw new Error(`polarHemisphere must be "north" or "south", got "${polarHemisphere}".`);
    }

    return {
        crs: options.crs,
        areaOfUse: Array.isArray(options.areaOfUse) ? options.areaOfUse : null,
        polarHemisphere,
        maxInputTiles,
        transformerId: options.transformerId ?? null,
    };
}

// ----- style reprojection ---------------------------------------------------------

const rasterSourceTypes = new Set(['raster', 'raster-dem', 'image', 'video', 'canvas']);

function warnSkippedSource(sourceId, reason) {
    console.warn(`ProjPlugin: skipped source "${sourceId}" and its layers: ${reason}.`);
}

// Returns a copy of the style in which vector sources have explicit tile URLs (TileJSON and pmtiles archives are
// expanded). Sources that cannot be reprojected are removed together with their layers; every removal is logged.
async function prepareStyle(rawStyle) {
    const style = JSON.parse(JSON.stringify(rawStyle));
    const sources = style.sources ?? (style.sources = {});
    const dropped = new Set();
    const drop = (id, reason) => {
        warnSkippedSource(id, reason);
        dropped.add(id);
    };

    for (const [id, source] of Object.entries(sources)) {
        if (rasterSourceTypes.has(source?.type)) {
            drop(id, `"${source.type}" sources cannot be reprojected`);
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
                drop(id, `unsupported TileJSON url "${source.url}"`);
                continue;
            }

            try {
                const response = await fetch(source.url);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                const tilejson = await response.json();
                if (Array.isArray(tilejson.tiles) && tilejson.tiles.length > 0) {
                    source.tiles = tilejson.tiles;
                }
                for (const key of ['minzoom', 'maxzoom', 'bounds', 'attribution', 'scheme']) {
                    if (source[key] === undefined && tilejson[key] !== undefined) {
                        source[key] = tilejson[key];
                    }
                }
            } catch (error) {
                // Logged here; the source is then dropped below because it has no tiles.
                console.warn(`ProjPlugin: TileJSON for source "${id}" could not be loaded from ${source.url}: ${error.message}`);
            }
            delete source.url;
        }

        const tiles = Array.isArray(source.tiles) ? source.tiles : [];
        if (tiles.length === 0) {
            drop(id, 'it has no tiles (vector sources need tiles or a TileJSON url)');
        } else if (!tiles.some((url) => /^https?:/i.test(url))) {
            drop(id, 'none of its tile URLs is http(s); a source that was already reprojected cannot be reprojected again');
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

// Rewrites one source object in place: GeoJSON coordinates are reprojected, vector tile URLs are routed through a
// protocol handler. `label` names the protocol; `sourceKey` (optional) enables replacement on repeated calls.
async function reprojectSourceObject(source, context) {
    const { label, sourceKey, projection, pipeline, state, generation, maxInputTiles } = context;

    if (source.type === 'geojson' && source.data && typeof source.data === 'object') {
        source.data = await pipeline.reprojectGeoJson(source.data, projection);
        return source;
    }

    if (source.type !== 'vector' || !(source.__pmtilesArchive || Array.isArray(source.tiles))) {
        return source;
    }

    const isPmtiles = !!source.__pmtilesArchive;
    const reprojectTile = pipeline.createTileReprojector(
        projection,
        isPmtiles ? { kind: 'pmtiles' } : [...source.tiles],
        { sourceId: label, maxInputTiles });
    const protocol = registerSourceProtocol(state, generation, label, sourceKey, reprojectTile);

    if (isPmtiles) {
        source.tiles = [`${protocol}://${source.__pmtilesArchive}/{z}/{x}/{y}`];
        delete source.__pmtilesArchive;
    } else {
        source.tiles = source.tiles.map((tile) => `${protocol}://${tile}`);
    }

    return source;
}

// Reprojects a style document. Protocols are registered with `generation`; the caller removes older ones once the
// new style is on the map.
async function reprojectStyleCore(options, state, generation) {
    const args = readProjectionArgs(options);
    if (!options.style) {
        throw new Error('reprojectStyle requires a style.');
    }

    const pipeline = await loadPipeline();
    const projection = await resolveProjection(args);
    const style = await prepareStyle(options.style);

    for (const [sourceId, source] of Object.entries(style.sources ?? {})) {
        await reprojectSourceObject(source, {
            label: sourceId,
            sourceKey: null,
            projection,
            pipeline,
            state,
            generation,
            maxInputTiles: args.maxInputTiles,
        });
    }

    style.projection = { type: 'mercator' };
    return {
        style,
        bounds: projection.bounds ?? [[-180, -85], [180, 85]],
        transformerId: storeTransformer(state, projection, args.crs, args.transformerId),
    };
}

function applyResult(map, state, generation, result, options) {
    map.setStyle(result.style, options?.setStyleOptions);
    removeProtocolsBefore(state, generation);
    if (options?.fitBounds !== false && isUsableBounds(result.bounds)) {
        map.fitBounds(result.bounds, options?.fitBoundsOptions);
    }
}

// ----- DTOs -----------------------------------------------------------------------

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
        // Not populated by the current pipeline.
        maxBounds: null,
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

// ----- exports --------------------------------------------------------------------

// Records the map for the fallback used by calls without a map argument.
export function initialize(map) {
    if (!map) {
        throw new Error('ProjPlugin.initialize requires a map.');
    }

    lastMap = map;
    stateFor(map);
}

// Pure: returns the reprojected style without changing the map. Protocols created here are released by the next
// apply on this map, by detach, or by dispose.
export function reprojectStyle(options, map) {
    const state = stateFor(map);
    return enqueue(state, async () => toResultDto(await reprojectStyleCore(options, state, state.generation)));
}

// Reprojects the style and sets it on the map. Protocols of the previous style are released after setStyle.
export function applyReprojection(options, map) {
    const target = resolveMap(map);
    const state = stateFor(target);
    return enqueue(state, async () => {
        const generation = ++state.generation;
        const result = await reprojectStyleCore(options, state, generation);
        applyResult(target, state, generation, result, options);
        return toResultDto(result);
    });
}

// Reprojects the map's current style. The current style must not already be reprojected by this plugin.
export function reprojectCurrentStyle(options, map) {
    const target = resolveMap(map);
    const state = stateFor(target);
    return enqueue(state, async () => {
        const generation = ++state.generation;
        const result = await reprojectStyleCore({ ...options, style: target.getStyle() }, state, generation);
        applyResult(target, state, generation, result, options);
        return toResultDto(result);
    });
}

export function reprojectSource(options, map) {
    if (!options?.source) {
        throw new Error('reprojectSource requires a source.');
    }

    const args = readProjectionArgs(options);
    const state = stateFor(map);
    return enqueue(state, async () => {
        const pipeline = await loadPipeline();
        const projection = await resolveProjection(args);
        const source = JSON.parse(JSON.stringify(options.source));
        await reprojectSourceObject(source, {
            label: options.sourceId ?? 'source',
            sourceKey: options.sourceId ?? null,
            projection,
            pipeline,
            state,
            generation: state.generation,
            maxInputTiles: args.maxInputTiles,
        });

        return {
            source,
            transformerId: storeTransformer(state, projection, args.crs, args.transformerId),
        };
    });
}

// ----- coordinates ----------------------------------------------------------------

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

export function releaseTransformer(transformerId) {
    return releaseTransformerEntry(transformerId);
}

// ----- lifecycle and diagnostics --------------------------------------------------

// There are no worker threads: this clears the process-wide projection cache and
// releases the transformers owned by the map. Without a map it also releases protocols that have no map.
export function releaseProjectionResources(map) {
    projectionCache.clear();

    const owner = ownerOf(map);
    if (!owner) {
        removeAllProtocols(sharedState);
    }

    const state = owner ? peekMapState(owner, STATE_KEY) : sharedState;
    for (const id of [...(state?.transformerIds ?? [])]) {
        releaseTransformerEntry(id);
    }
}

function releaseMapResources(map) {
    const state = peekMapState(map, STATE_KEY);
    if (!state) {
        return;
    }

    removeAllProtocols(state);
    for (const id of [...state.transformerIds]) {
        releaseTransformerEntry(id);
    }

    deleteMapState(map, STATE_KEY);
}

// Releases the protocol handlers and transformers of the map. The reprojected style is NOT rolled back: it stays on
// the map and its reprojected vector sources stop loading until the host sets a style again.
export function detach(map) {
    const owner = ownerOf(map);
    if (owner) {
        releaseMapResources(owner);
    }
}

export function dispose(map) {
    const owner = ownerOf(map);
    if (owner) {
        releaseMapResources(owner);
    }

    if (lastMap === owner) {
        lastMap = null;
    }
}

export function getImportMap() {
    return buildImportMap();
}

export function getVendorManifest() {
    return fetch(contentUrl(`${vendorRoot}manifest.json`)).then((res) => (res.ok ? res.json() : null));
}
