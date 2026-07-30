# Map API methods (selected)

The `MapLibre` component wraps MapLibre GL JS 5.17. Key methods added in recent releases:

## Style and terrain

- `SetStyle(OneOf<JsonObject, string>, SetStyleOptions?)` — pass `{ Diff = true }` for incremental style updates (`style.load` fires); supports bulk transactions
- `NativeMap` — raw `maplibregl.Map` JS handle for calling unwrapped MapLibre GL JS methods
- `AddControl(type, position?, options?)` — returns control handle for `HasControl`/`RemoveControl`; `options` go to the control constructor
- `GetStyleAsJsonElement()` — typed style read
- `SetTerrain(TerrainSpecification?)`, `SetSky`, `SetLight`
- `SetPaintProperty`, `SetLayoutProperty`, `SetGlobalStateProperty`

## GeoJSON

- `SetSourceData`, `UpdateSourceData`, `UpdateSourceDataAsync` (with `waitForCompletion`)

## Camera and time

- `SetTransformConstrain` / `TransformConstrain` parameter on the component
- `SetTransformRequest` — customize tile/glyph/sprite HTTP requests from C#; return `TransformRequestResult` with only the MapLibre `RequestParameters` fields you need (`url`, optional `headers`, `credentials`, etc.)
- `SetEventedParent` — bubble events to another map by its `MapId`
- `TimeControlSetNow`, `TimeControlRestoreNow`, `TimeControlIsFrozen`

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

- `AddCustomLayer(layerId, CustomLayerOptions, CustomLayerHandler, beforeId?)` — supports `minzoom`/`maxzoom`, matrix in `OnRender`/`OnPrerender`

## Container

- `SetContainer(element)` — pass an `HTMLElement` from another window (iframe) before first render (MapLibre 5.17+).

## Default style

`MapOptions.Style` defaults to `MapStyles.OpenStreetMap`.

## Events

- `AddListener<T>`, `AddOnceListener<T>` — generic subscriptions; optional `throttleMs` for high-frequency events; returns `Listener` with working `Remove()`.
- `RemoveAllListeners(eventName?)` — detach all listeners on this map.
- Convenience: `OnClick`, `OnContextMenu`, `OnDblClick`, `OnMouseDown`/`OnMouseUp`/`OnMouseEnter`/`OnMouseLeave`, `OnMoveStart`/`OnMove`/`OnMoveEnd`, camera `OnRotate*`/`OnPitch*`/`OnRoll*`, `OnBoxZoom*`, `OnWebGlContext*`, `OnWheel`, `OnRender`, …
- `MapEvent.GetOriginalDomEvent()` for typed DOM fields from `originalEvent`
- Use `MapEventNames` for event name constants.

## Marker and Popup

- `AddMarker(options, position)` — returns `MapMarker` handle (`SetLngLat`, `SetRotation`, `SetDraggable`, `SetPopup`, `TogglePopup`, class names, events)
- `AddPopup(options, lngLat, html|PopupContent)` — returns `MapPopup` handle (`SetHtml`, `SetText`, `TrackPointer`, `IsOpen`, events)
- `CreatePopup` — legacy wrapper around `AddPopup`
- Marker events: `OnClick`, `OnDragStart`, `OnDrag`, `OnDragEnd` on `MapMarker`
- Popup events: `OnOpen`, `OnClose` on `MapPopup`

See [Event listeners](../events/listeners.md) and [Layers overview](../layers/index.md).
