export function payloadKeyFromValue(value) {
    if (typeof value === 'string') {
        return value;
    }
    return JSON.stringify(value);
}
export function createGeoJsonSkipCache() {
    const lastBySource = new Map();
    return {
        shouldSkip(sourceId, payloadKey) {
            return lastBySource.get(sourceId) === payloadKey;
        },
        remember(sourceId, payloadKey) {
            lastBySource.set(sourceId, payloadKey);
        },
        forget(sourceId) {
            if (sourceId === undefined) {
                lastBySource.clear();
                return;
            }
            lastBySource.delete(sourceId);
        },
    };
}
const caches = new Map();
export function skipCacheFor(container) {
    let cache = caches.get(container);
    if (!cache) {
        cache = createGeoJsonSkipCache();
        caches.set(container, cache);
    }
    return cache;
}
export function disposeSkipCache(container) {
    caches.get(container)?.forget();
    caches.delete(container);
}
//# sourceMappingURL=geojson-skip.js.map