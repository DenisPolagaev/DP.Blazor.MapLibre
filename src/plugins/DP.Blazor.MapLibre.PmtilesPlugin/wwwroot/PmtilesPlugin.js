/**
 * Registers maplibregl.addProtocol('pmtiles', ...) once per page.
 * Sources use urls like pmtiles://https://host/archive.pmtiles
 */
export async function initialize() {
    if (globalThis.__blazorMapLibrePmtilesProtocol) {
        return;
    }

    if (typeof globalThis.maplibregl?.addProtocol !== 'function') {
        throw new Error('MapLibre GL JS is not available on globalThis.maplibregl');
    }

    const { Protocol } = await import('./pmtiles/pmtiles.mjs');
    const protocol = new Protocol();
    const tile = protocol.tile.bind(protocol);
    globalThis.maplibregl.addProtocol('pmtiles', (params, abort) => {
        const result = tile(params, abort);
        if (result && typeof result.then === 'function') {
            return result.catch((err) => {
                if (err?.name === 'AbortError' || abort?.signal?.aborted) {
                    throw err;
                }
                // Sparse archives and failed range reads otherwise surface as
                // MapLibre Evented `error` from `_loadTile`.
                return { data: new Uint8Array() };
            });
        }
        return result;
    });
    globalThis.__blazorMapLibrePmtilesProtocol = protocol;
}

export function dispose() {
    // Protocol stays registered: other maps may still have pmtiles:// sources.
}
