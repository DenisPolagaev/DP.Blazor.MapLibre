/**
 * Registers the `pmtiles` protocol on MapLibre GL JS. Sources use urls like pmtiles://https://host/archive.pmtiles
 *
 * The protocol is page-global, not per map, so its state lives on globalThis rather than in getMapState:
 *  - `registration` is a memoized promise, so concurrent initialize() calls register the protocol once.
 *  - `refCount` counts the plugin instances that initialized successfully. dispose() decrements it and
 *    calls maplibregl.removeProtocol('pmtiles') only when it reaches 0, so one map disposing its plugin
 *    does not break pmtiles sources still used by other maps.
 * The state object is stored on globalThis so that a second copy of this module cannot register the
 * protocol twice.
 */

const SHARED_STATE_KEY = '__blazorMapLibrePmtiles';

// The vendored pmtiles FetchSource throws `Bad response code: <status>` for HTTP statuses >= 300.
const BAD_RESPONSE_PATTERN = /^Bad response code: (\d{3})$/;

// HTTP statuses that mean "no tile at this position": an empty tile is returned instead of an error.
const EMPTY_TILE_STATUSES = new Set([204, 404]);

function sharedState() {
    if (!globalThis[SHARED_STATE_KEY]) {
        globalThis[SHARED_STATE_KEY] = { refCount: 0, registration: null };
    }

    return globalThis[SHARED_STATE_KEY];
}

/** Returns the HTTP status carried by a pmtiles error, or undefined when the error has none. */
function httpStatusOf(error) {
    if (typeof error?.status === 'number') {
        return error.status;
    }

    const match = BAD_RESPONSE_PATTERN.exec(error?.message ?? '');
    return match ? Number(match[1]) : undefined;
}

function isAbortError(error, abort) {
    return error?.name === 'AbortError' || abort?.signal?.aborted === true;
}

/**
 * Wraps Protocol.tile so that only "no such tile" responses become empty tiles.
 * Everything else (HTTP 5xx, network failures, invalid archives, TileJSON failures, aborts) is rethrown,
 * so MapLibre emits an error event instead of silently showing blank tiles.
 */
function createTileHandler(protocol) {
    const tile = protocol.tile.bind(protocol);
    return (params, abort) => {
        const result = tile(params, abort);
        if (!result || typeof result.then !== 'function') {
            return result;
        }

        return result.catch((error) => {
            // TileJSON (`type: 'json'`) must not become an empty tile: MapLibre would read `tiles` from it.
            if (params?.type === 'json' || isAbortError(error, abort)) {
                throw error;
            }

            if (EMPTY_TILE_STATUSES.has(httpStatusOf(error))) {
                return { data: new Uint8Array() };
            }

            throw error;
        });
    };
}

async function registerProtocol() {
    if (typeof globalThis.maplibregl?.addProtocol !== 'function') {
        throw new Error('MapLibre GL JS is not available on globalThis.maplibregl');
    }

    const { Protocol } = await import('./pmtiles/pmtiles.mjs');
    globalThis.maplibregl.addProtocol('pmtiles', createTileHandler(new Protocol()));
}

/**
 * Registers the protocol if needed and counts this instance as a user of it.
 * Concurrent calls share one registration. A failed registration is cleared so a later call can retry.
 */
export async function initialize() {
    const shared = sharedState();
    if (!shared.registration) {
        shared.registration = registerProtocol().catch((error) => {
            shared.registration = null;
            throw error;
        });
    }

    await shared.registration;
    shared.refCount += 1;
}

/**
 * Releases one reference to the protocol. The protocol is removed when the last reference is released.
 * The C# plugin calls this only after a successful initialize().
 */
export function dispose() {
    const shared = globalThis[SHARED_STATE_KEY];
    if (!shared || shared.refCount === 0) {
        return;
    }

    shared.refCount -= 1;
    if (shared.refCount === 0) {
        globalThis.maplibregl.removeProtocol('pmtiles');
        shared.registration = null;
    }
}
