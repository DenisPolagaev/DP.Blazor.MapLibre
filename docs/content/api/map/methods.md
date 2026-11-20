# Map API methods (selected)

The `MapLibre` component wraps MapLibre GL JS 6.19.0. Key methods:

## Style and terrain

- `SetStyle(OneOf<JsonObject, string>, SetStyleOptions?)` — pass `{ Diff = true }` for incremental style updates (`style.load` fires); supports bulk transactions
- `NativeMap` — raw `maplibregl.Map` JS handle for calling unwrapped MapLibre GL JS methods
- `AddControl(type, position?, options?)` — returns control handle for `HasControl`/`RemoveControl`; `options` go to the control constructor (e.g. `FullscreenControlOptions.Pseudo`)
- `GetStyleAsJsonElement()` — typed style read
- `GetStyleUrl()` — style URL, or `null` for object styles (MapLibre 6.8+)
- `SetFontFaces` / `GetFontFaces` — style `font-faces` for complex scripts (MapLibre 6.7+); also on `StyleSpecification.FontFaces`
- `SetTerrain(TerrainSpecification?)`, `SetSky`, `SetLight`
- `SetPaintProperty`, `SetLayoutProperty`, `SetGlobalStateProperty`, `GetGlobalState()` (whole state, MapLibre 6.14+)
- `StyleSpecification.State` — the style's `state` defaults read by the `global-state` expression (`Expr.GlobalState(name)`)

## GeoJSON

- `SetSourceData` / `SetSourceDataAsJson` / `SetSourceDataAsync` — await MapLibre `setData()` Promise (v6)
- `UpdateSourceData` / `UpdateSourceDataAsync` — await `updateData()` Promise (no `waitForCompletion` flag)
- `GetGeoJsonDataAsync`, `GetGeoJsonBoundsAsync`, `GetClusterOptionsAsync`, `SetClusterOptionsAsync`

## Camera and time

- `CalculateAnchoredCameraOptions(AnchoredCameraOptions)` — camera options that place an anchor at a screen point (MapLibre 6.11+)
- `SetTransformConstrain` / `TransformConstrain` parameter on the component
- `SetTransformRequest` — customize tile/glyph/sprite HTTP requests from C#; return `TransformRequestResult` with only the MapLibre `RequestParameters` fields you need (`url`, optional `headers`, `credentials`, `referrerPolicy`, etc.)
- `HasTransformRequest()` — whether a request transform is installed (MapLibre 6.19 `getTransformRequest` returns a function, which cannot cross interop)
- Prefer JS-only transform policy for tile hot path
- `SetEventedParent` — bubble events to another map by its `MapId`
- `TimeControlSetNow`, `TimeControlRestoreNow`, `TimeControlIsFrozen` (top-level `setNow` / `restoreNow` / `isTimeFrozen` in MapLibre 6)

## Query

- `QueryRenderedFeatures` / `QuerySourceFeatures` — return `IFeature[]`
- `QueryRenderedLayerFeatures` — typed `LayerFeatureFeature[]` with `layer` metadata

## Layers

- `HasLayer`, `HasSource`, `GetLayerAsLayer`, `GetSourceAsSource`
- `SetLayerZoomRange`, `MoveLayer(id, beforeId?)`
- `GetFilter` — returns `JsonElement?`; `GetGlobalStateProperty`, `GetGlobalState`
- `SetPitch`, `SetRoll`, `SetPadding`, `SetMaxBounds(LngLatBounds?)`, `SetMaxZoom`, `SetMinZoom`, `SetMaxPitch`, `SetMinPitch`, `SetRenderWorldCopies`, `SetVerticalFieldOfView`, `SetPixelRatio`
- `GetZoomSnap` / `SetZoomSnap` (MapLibre 6), `GetAnisotropicFilterPitch` / `SetAnisotropicFilterPitch`
- `ShowCollisionBoxes`, `ShowOverdrawInspector`, `ShowPadding`, `ShowVertices` (debug, next to `ShowTileBoundaries`)
- `SetContinuousRepaint(bool)` — the `map.repaint` flag used for performance analysis
- `SetSourceTileLodParams(maxZoomLevelsOnScreen, tileCountMaxMinRatio, sourceId?)` — tile level-of-detail under pitch
- `SetTrustedTypesPolicy(name)` — pass-through Trusted Types policy (MapLibre 6.19+, page-wide)
- `AddProjection(ProjectionCrs)` / `RemoveProjection(name)` — custom planar CRS with its own quad tile grid (MapLibre 6.15+, experimental); the CRS converter is a pair of functions registered on `globalThis`
- `FillExtrusionLayerLayout.FillExtrusionRoundedCornerDistance` (MapLibre 6.2+); `SymbolLayerLayout.SymbolHeightOffset` / `SymbolHeightAnchor` (MapLibre 6.6+)
- `SetGlyphs`, `SnapToNorth`, `TriggerRepaint`
- `slot` on base `Layer`; `CustomLayer` style model

## Custom layers

- `AddCustomLayer(layerId, CustomLayerOptions, CustomLayerHandler, beforeId?)` — `OnRender`/`OnPrerender` receive `modelViewProjectionMatrix` (16 floats) from MapLibre 6 `CustomRenderMethodInput`

## Images / raster

- `SetMissingStyleImageResolver` — supply missing sprite/style images (MapLibre 6+; replaces resolving via `OnStyleImageMissing` + `AddImage`)
- `UpdateImageSourceAsync` (URL) / `UpdateImageSourceWithImageAsync` (decoded bitmap, MapLibre 6.1+)
- `SetRasterPremultiplyAlphaAsync`
- `SetSourceWarpAsync` / `GetSourceWarpAsync` (`ImageSourceWarp`, MapLibre 6.5+)

## Container

- `SetContainer(element)` — pass an `HTMLElement` from another window (iframe) before first render.

## Map options (selected)

- `ZoomLevelsToOverscale` (JSON `zoomLevelsToOverscale`; MapLibre 6 default is `4`)
- `RotateSpeed`, `PitchSpeed`, `AnisotropicFilterPitch`, `TerrainSkirtLength`
- `DragRotate` accepts `true`/`false` or `DragRotateOptions { Around = "pointer" | "center", Movement = "circular" | "linear" }` (MapLibre 6.15+; replaces `AroundCenter`, which is obsolete)
- `GlobalState` — initial style global state (MapLibre 6.14+); `SetStyleOptions.GlobalState` for a style reload
- WebGL2 is required (WebGL1 path removed in MapLibre 6)

## Style-spec additions

- `VectorTileSource.Sparse` — a 404 tile shows the matching part of the nearest existing ancestor (MapLibre 6.17+, experimental)
- `RasterLayerPaint.RasterLayerBlend`, `LineLayerPaint.LineLayerBlend`, `FillLayerPaint.FillLayerBlend` — CSS blend modes (MapLibre 6.18+)
- `FitBoundOptions.AbsolutePadding` / `CameraForBoundsOptions.AbsolutePadding` (MapLibre 6.12+)
- `GeolocateControlOptions.ZoomToUserAccuracy` (MapLibre 6.12+)
- `Expr.InterpolateOklab` / `InterpolateOklch` / `InterpolateZoomOklab` / `InterpolateZoomOklch` — perceptual colour interpolation (MapLibre 6.19+); `oklab()` / `oklch()` colours are plain colour strings in the layer models

## Default style

`MapOptions.Style` defaults to `MapStyle.OpenStreetMap.Standard.ToStylePayload()`.

## Not wrapped on purpose

- `MapOptions.transformStyle` / `SetStyleOptions.transformStyle` — a JavaScript callback over whole style objects.
  The component owns one internally to keep the selected projection across style loads; a .NET callback would
  exchange two complete style documents per style load. Use a custom style document instead.
- `CustomLayerInterface.renderToTerrainTile` / `terrainTileRevision` (MapLibre 6.13+, experimental) — terrain
  draping for custom layers; the `CustomLayerHandler` contract carries the render matrix only.
- Per-axis `maxBounds` (MapLibre 6.16+) — expressed in JavaScript as `-Infinity`/`Infinity` for the unconstrained
  longitude range, and non-finite numbers cannot cross the JSON interop boundary. `SetMaxBounds(LngLatBounds?)`
  covers the finite case.
- `Style#triggerSymbolPlacement` — MapLibre exposes the `Style` instance only as `map.style` (internal);
  `getStyle()` returns the serialized style specification.

## Events

- `AddListener<T>`, `AddOnceListener<T>` — generic subscriptions; optional `throttleMs` for high-frequency events; returns `Listener` with working `Remove()`.
- `RemoveAllListeners(eventName?)` — detach all listeners on this map.
- Convenience: `OnClick`, `OnContextMenu`, `OnDblClick`, `OnMouseDown`/`OnMouseUp`/`OnMouseEnter`/`OnMouseLeave`, `OnMoveStart`/`OnMove`/`OnMoveEnd`, camera `OnRotate*`/`OnPitch*`/`OnRoll*`, `OnBoxZoom*`, `OnWebGlContext*`, `OnWheel`, `OnRender`, …
- Event payloads use the base types `MapDataEvent`, `MapMoveEvent`, and `MapZoomEvent`.
- `MapEvent.GetOriginalDomEvent()` for typed DOM fields from `originalEvent`
- Use `MapEventNames` for event name constants.

## Marker and Popup

- Marker `Opacity` / `OpacityWhenCovered` accept string or number
- See event listeners doc for Marker/Popup handles
