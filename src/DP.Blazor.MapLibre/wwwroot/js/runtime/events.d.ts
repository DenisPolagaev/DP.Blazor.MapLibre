/**
 * Builds a serializable event payload without mutating MapLibre's event object.
 */
export type CompactMapFeatureDto = {
    id: unknown;
    source: unknown;
    sourceLayer: unknown;
    layerId: unknown;
    properties: unknown;
    geometry?: unknown;
};
export type CompactMapEventDto = {
    type: unknown;
    point: {
        x: number;
        y: number;
    } | null;
    lngLat: {
        lng: number;
        lat: number;
    } | null;
    originalEvent: {
        type: unknown;
        button: unknown;
        ctrlKey: boolean;
        shiftKey: boolean;
        altKey: boolean;
        metaKey: boolean;
    } | null;
    layerId: unknown;
    features: CompactMapFeatureDto[] | undefined;
    dataType: unknown;
    isSourceLoaded: unknown;
    sourceId: unknown;
    sourceDataType: unknown;
    sourceDataChanged: unknown;
    tile: unknown;
    newProjection: unknown;
    id: unknown;
};
export type CompactEventOptions = {
    includeGeometry?: boolean;
};
export declare function createCompactMapEventDto(e: Record<string, unknown> | null | undefined, options?: CompactEventOptions): CompactMapEventDto;
//# sourceMappingURL=events.d.ts.map