# Map API methods (selected)

The `MapLibre` component wraps MapLibre GL JS 6.2. Key methods:

## Style and terrain

- `SetStyle(OneOf<JsonObject, string>, SetStyleOptions?)` — pass `{ Diff = true }` for incremental style updates (`style.load` fires); supports bulk transactions
- `NativeMap` — raw `maplibregl.Map` JS handle for calling unwrapped MapLibre GL JS methods
- `AddControl(type, position?, options?)` — returns control handle for `HasControl`/`RemoveControl`; `options` go to the control constructor (e.g. `FullscreenControlOptions.Pseudo`)
- `GetStyleAsJsonElement()` — typed style read
- `SetTerrain(TerrainSpecification?)`, `SetSky`, `SetLight`
- `SetPaintProperty`, `SetLayoutProperty`, `SetGlobalStateProperty`

## GeoJSON

- `SetSourceData` / `SetSourceDataAsJson` / `SetSourceDataAsync` — await MapLibre `setData()` Promise (v6)
- `UpdateSourceData` / `UpdateSourceDataAsync` — await `updateData()` Promise (no `waitForCompletion` flag)
- `GetGeoJsonDataAsync`, `GetGeoJsonBoundsAsync`, `GetClusterOptionsAsync`, `SetClusterOptionsAsync`

## Camera and time

- `SetTransformConstrain` / `TransformConstrain` parameter on the component
- `SetTransformRequest` — customize tile/glyph/sprite HTTP requests from C#; return `TransformRequestResult` with only the MapLibre `RequestParameters` fields you need (`url`, optional `headers`, `credentials`, `referrerPolicy`, etc.)
- Prefer JS-only transform policy for tile hot path
- `SetEventedParent` — bubble events to another map by its `MapId`
- `TimeControlSetNow`, `TimeControlRestoreNow`, `TimeControlIsFrozen` (top-level `setNow` / `restoreNow` / `isTimeFrozen` in MapLibre 6)

## Query

- `QueryRenderedFeatures` / `QuerySourceFeatures` — return `IFeature[]`
- `QueryRenderedLayerFeatures` — typed `LayerFeatureFeature[]` with `layer` metadata

## Layers

- `HasLayer`, `HasSource`, `GetLayerAsLayer`, `GetSourceAsSource`
- `SetLayerZoomRange`, `MoveLayer(id, beforeId?)`
- `GetFilter` — returns `JsonElement?`; `GetGlobalStateProperty`
- `SetPitch`, `SetRoll`, `SetPadding`, `SetMaxBounds(LngLatBounds?)`, `SetMaxZoom`, `SetMinZoom`, `SetMaxPitch`, `SetMinPitch`, `SetRenderWorldCopies`, `SetVerticalFieldOfView`
- `SetGlyphs`, `SnapToNorth`, `TriggerRepaint`
- `slot` on base `Layer`; `CustomLayer` style model

## Custom layers

- `AddCustomLayer(layerId, CustomLayerOptions, CustomLayerHandler, beforeId?)` — `OnRender`/`OnPrerender` receive `modelViewProjectionMatrix` (16 floats) from MapLibre 6 `CustomRenderMethodInput`

## Images / raster

- `SetMissingStyleImageResolver` — supply missing sprite/style images (MapLibre 6+; replaces resolving via `OnStyleImageMissing` + `AddImage`)
- `UpdateImageSourceAsync` (URL) / `UpdateImageSourceWithImageAsync` (decoded bitmap, MapLibre 6.1+)
- `SetRasterPremultiplyAlphaAsync`

## Container

- `SetContainer(element)` — pass an `HTMLElement` from another window (iframe) before first render.

## Map options (selected)

- `ZoomLevelsToOverscale` (JSON `zoomLevelsToOverscale`; MapLibre 6 default is `4`)
- `RotateSpeed`, `PitchSpeed`, `AnisotropicFilterPitch`, `TerrainSkirtLength`, `AroundCenter`
- WebGL2 is required (WebGL1 path removed in MapLibre 6)

## Default style

`MapOptions.Style` defaults to `MapStyles.OpenStreetMap`.

## Events

- `AddListener<T>`, `AddOnceListener<T>` — generic subscriptions; optional `throttleMs` for high-frequency events; returns `Listener` with working `Remove()`.
- `RemoveAllListeners(eventName?)` — detach all listeners on this map.
- Convenience: `OnClick`, `OnContextMenu`, `OnDblClick`, `OnMouseDown`/`OnMouseUp`/`OnMouseEnter`/`OnMouseLeave`, `OnMoveStart`/`OnMove`/`OnMoveEnd`, camera `OnRotate*`/`OnPitch*`/`OnRoll*`, `OnBoxZoom*`, `OnWebGlContext*`, `OnWheel`, `OnRender`, …
- Aliases: `MapSourceDataEvent`, `MapStyleDataEvent`, `MapMovementEvent`, `MapBoxZoomEvent`
- `MapEvent.GetOriginalDomEvent()` for typed DOM fields from `originalEvent`
- Use `MapEventNames` for event name constants.

## Marker and Popup

- Marker `Opacity` / `OpacityWhenCovered` accept string or number
- See event listeners doc for Marker/Popup handles
