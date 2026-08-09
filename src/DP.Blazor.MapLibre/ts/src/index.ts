// Sample/experiment GeoportalMapHandle facade — not used by DP.Geoportal.Web or the examples host.
export { createCompactMapEventDto } from './events.js';
export type { CompactEventOptions, CompactMapEventDto, CompactMapFeatureDto } from './events.js';
export { GeoportalMapHandle, createGeoportalMapHandle } from './geoportal-map-handle.js';
export type {
  ApplyViewStateOptions,
  Disposer,
  GeoJsonSetOptions,
  JsTransformRequestPolicy,
  LngLatLike,
  MapViewState,
  TileSourceSpec,
} from './types.js';
