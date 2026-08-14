export interface LngLatLike {
  lng: number;
  lat: number;
}

export interface MapViewState {
  center: LngLatLike;
  zoom: number;
  bearing: number;
  pitch: number;
  padding?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
}

export interface ApplyViewStateOptions extends Partial<MapViewState> {
  /** When true, animate with easeTo; otherwise jumpTo. */
  animate?: boolean;
}

export interface GeoJsonSetOptions {
  /** When true, prefer updateData for incremental patches if supported. */
  incremental?: boolean;
}

export interface TileSourceSpec {
  type: 'vector' | 'raster';
  tiles: string[];
  minzoom?: number;
  maxzoom?: number;
  bounds?: number[];
  tileSize?: number;
  promoteId?: string | Record<string, string>;
  attribution?: string;
}

export type Disposer = () => void;

/**
 * Synchronous URL/header policy only. Never call .NET on the tile hot path.
 */
export type JsTransformRequestPolicy = (
  url: string,
  resourceType?: string,
) => { url: string; headers?: Record<string, string>; credentials?: RequestCredentials } | undefined;
