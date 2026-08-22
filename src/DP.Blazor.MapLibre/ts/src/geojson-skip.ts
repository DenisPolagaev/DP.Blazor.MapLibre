export type GeoJsonSkipCache = {
    shouldSkip(sourceId: string, payloadKey: string): boolean;
    remember(sourceId: string, payloadKey: string): void;
    forget(sourceId?: string): void;
};

export function payloadKeyFromValue(value: unknown): string {
    if (typeof value === 'string') {
        return value;
    }

    return JSON.stringify(value);
}

export function createGeoJsonSkipCache(): GeoJsonSkipCache {
    const lastBySource = new Map<string, string>();

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

const caches = new Map<string, GeoJsonSkipCache>();

export function skipCacheFor(container: string): GeoJsonSkipCache {
    let cache = caches.get(container);
    if (!cache) {
        cache = createGeoJsonSkipCache();
        caches.set(container, cache);
    }

    return cache;
}

export function disposeSkipCache(container: string): void {
    caches.get(container)?.forget();
    caches.delete(container);
}
