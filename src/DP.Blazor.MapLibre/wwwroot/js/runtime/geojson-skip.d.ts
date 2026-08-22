export type GeoJsonSkipCache = {
    shouldSkip(sourceId: string, payloadKey: string): boolean;
    remember(sourceId: string, payloadKey: string): void;
    forget(sourceId?: string): void;
};
export declare function payloadKeyFromValue(value: unknown): string;
export declare function createGeoJsonSkipCache(): GeoJsonSkipCache;
export declare function skipCacheFor(container: string): GeoJsonSkipCache;
export declare function disposeSkipCache(container: string): void;
//# sourceMappingURL=geojson-skip.d.ts.map