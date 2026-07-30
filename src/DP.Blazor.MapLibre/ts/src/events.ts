/** Compact MapLibre → .NET event DTO. Geometry is opt-in. */
export interface CompactMapFeatureDto {
  id: string | number | null;
  source: string | null;
  sourceLayer: string | null;
  layerId: string | null;
  properties: Record<string, unknown> | null;
  geometry?: unknown;
}

export interface CompactMapEventDto {
  type: string | null;
  point: { x: number; y: number } | null;
  lngLat: { lng: number; lat: number } | null;
  originalEvent: {
    type: string | null;
    button: number | null;
    ctrlKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
    metaKey: boolean;
  } | null;
  layerId: string | null;
  features?: CompactMapFeatureDto[];
}

export interface CompactEventOptions {
  includeGeometry?: boolean;
}

/**
 * Builds a serializable event payload without mutating MapLibre's event object.
 */
export function createCompactMapEventDto(
  e: Record<string, unknown> | null | undefined,
  options?: CompactEventOptions,
): CompactMapEventDto {
  const includeGeometry = options?.includeGeometry === true;
  const rawFeatures = Array.isArray(e?.['features']) ? (e['features'] as Array<Record<string, unknown>>) : undefined;

  const features = rawFeatures?.map((feature) => {
    const layer = feature['layer'] as Record<string, unknown> | undefined;
    const dto: CompactMapFeatureDto = {
      id: (feature['id'] as string | number | null | undefined) ?? null,
      source: (feature['source'] as string | null | undefined) ?? null,
      sourceLayer: (feature['sourceLayer'] as string | null | undefined) ?? null,
      layerId: (layer?.['id'] as string | null | undefined) ?? null,
      properties: (feature['properties'] as Record<string, unknown> | null | undefined) ?? null,
    };

    if (includeGeometry) {
      dto.geometry = feature['geometry'] ?? null;
    }

    return dto;
  });

  const point = e?.['point'] as { x?: number; y?: number } | undefined;
  const lngLat = e?.['lngLat'] as { lng?: number; lat?: number } | undefined;
  const originalEvent = e?.['originalEvent'] as Record<string, unknown> | undefined;

  return {
    type: (e?.['type'] as string | null | undefined) ?? null,
    point: point ? { x: point.x ?? 0, y: point.y ?? 0 } : null,
    lngLat: lngLat ? { lng: lngLat.lng ?? 0, lat: lngLat.lat ?? 0 } : null,
    originalEvent: originalEvent
      ? {
          type: (originalEvent['type'] as string | null | undefined) ?? null,
          button: (originalEvent['button'] as number | null | undefined) ?? null,
          ctrlKey: !!originalEvent['ctrlKey'],
          shiftKey: !!originalEvent['shiftKey'],
          altKey: !!originalEvent['altKey'],
          metaKey: !!originalEvent['metaKey'],
        }
      : null,
    layerId: (features?.[0]?.layerId as string | null | undefined) ?? null,
    features,
  };
}
