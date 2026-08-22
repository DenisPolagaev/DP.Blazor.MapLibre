export function createCompactMapEventDto(e, options) {
    const includeGeometry = options?.includeGeometry === true;
    const rawFeatures = Array.isArray(e?.['features']) ? e['features'] : undefined;
    const features = rawFeatures?.map((feature) => {
        const layer = feature['layer'];
        const dto = {
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
    const point = e?.['point'];
    const lngLat = e?.['lngLat'];
    const originalEvent = e?.['originalEvent'];
    const tile = e?.['tile'];
    const tileId = tile?.['tileID'];
    const canonical = tileId?.['canonical'];
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
//# sourceMappingURL=events.js.map