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
    point: { x: number; y: number } | null;
    lngLat: { lng: number; lat: number } | null;
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

export function createCompactMapEventDto(
    e: Record<string, unknown> | null | undefined,
    options?: CompactEventOptions,
): CompactMapEventDto {
    const includeGeometry = options?.includeGeometry === true;
    const rawFeatures = Array.isArray(e?.['features']) ? (e['features'] as Record<string, unknown>[]) : undefined;
    const features = rawFeatures?.map((feature) => {
        const layer = feature['layer'] as Record<string, unknown> | undefined;
        const dto: CompactMapFeatureDto = {
            id: feature['id'] ?? null,
            source: feature['source'] ?? null,
            sourceLayer: feature['sourceLayer'] ?? null,
            layerId: layer?.['id'] ?? null,
            properties: feature['properties'] ?? null,
        };
        if (includeGeometry) {
            dto.geometry = feature['geometry'] ?? null;
        }
        return dto;
    });
    const point = e?.['point'] as { x?: number; y?: number } | undefined;
    const lngLat = e?.['lngLat'] as { lng?: number; lat?: number } | undefined;
    const originalEvent = e?.['originalEvent'] as Record<string, unknown> | undefined;
    const tile = e?.['tile'] as Record<string, unknown> | undefined;
    const tileId = tile?.['tileID'] as Record<string, unknown> | undefined;
    const canonical = tileId?.['canonical'] as { z?: number; x?: number; y?: number } | undefined;
    return {
        type: e?.['type'] ?? null,
        point: point ? { x: point.x ?? 0, y: point.y ?? 0 } : null,
        lngLat: lngLat ? { lng: lngLat.lng ?? 0, lat: lngLat.lat ?? 0 } : null,
        originalEvent: originalEvent
            ? {
                  type: originalEvent['type'] ?? null,
                  button: originalEvent['button'] ?? null,
                  ctrlKey: !!originalEvent['ctrlKey'],
                  shiftKey: !!originalEvent['shiftKey'],
                  altKey: !!originalEvent['altKey'],
                  metaKey: !!originalEvent['metaKey'],
              }
            : null,
        layerId: features?.[0]?.layerId ?? null,
        features,
        dataType: e?.['dataType'] ?? null,
        isSourceLoaded: e?.['isSourceLoaded'] ?? null,
        sourceId: e?.['sourceId'] ?? null,
        sourceDataType: e?.['sourceDataType'] ?? null,
        sourceDataChanged: e?.['sourceDataChanged'] ?? null,
        tile: canonical
            ? { z: canonical.z ?? 0, x: canonical.x ?? 0, y: canonical.y ?? 0 }
            : (tile ?? null),
        newProjection: e?.['newProjection'] ?? null,
        id: e?.['id'] ?? null,
    };
}
