# Event listeners

## Add and remove

```csharp
Listener listener = await map.OnClick("my-layer", e => { ... });
await listener.Remove(); // calls map.off() in JavaScript
```

`Listener` implements `IAsyncDisposable` — use `await using` or `DisposeAsync()` on the component.

## APIs

- `AddListener<T>(eventName, handler, layer?, throttleMs?)` — generic subscription
- `AddListener<T>(eventName, handler, params string[] layerIds)` — multiple layers
- `AddOnceListener<T>` / `AddOnceAsyncListener<T>` — single fire (`map.once`), including multi-layer overloads
- `RemoveAllListeners(eventName?)` — detach all listeners on this map
- `OnClick`, `OnMoveEnd`, `OnIdle`, `OnMouseMove` (with optional `throttleMs`), `OnData`, `OnSourceData`, `OnError`
- `OnTouchStart`, `OnTouchEnd`, `OnTouchMove`, `OnTouchCancel` — use `MapTouchEvent`
- `OnWheel`, `OnRender`, `OnStyleImageMissing`, `OnDragStart`, `OnDrag`, `OnDragEnd`
- `OnStyleDataLoading`, `OnSourceDataLoading` — loading-phase data events
- `OnCooperativeGesturePrevented`, `OnProjectionTransition`, `OnTerrain`, `OnSourceDataAbort`

## Event model reference

| Event | Model | Convenience API | Layer filter |
|-------|-------|-----------------|--------------|
| `click`, `mousemove`, mouse events | `MapMouseEvent` | `OnClick`, `OnMouseMove` | Yes |
| `touchstart`, `touchmove`, `touchend`, `touchcancel` | `MapTouchEvent` | `OnTouch*` | Yes |
| `wheel` | `MapWheelEvent` | `OnWheel` | No |
| `moveend`, camera/drag | `MapMoveEvent` / `MapEvent` | `OnMoveEnd`, `OnDrag*` | No |
| `data`, `sourcedata`, `sourcedataabort`, `styledataloading`, `sourcedataloading` | `MapDataEvent` | `OnData`, `OnSourceData`, `OnSourceDataAbort`, `OnStyleDataLoading`, `OnSourceDataLoading` | No |
| `error` | `MapErrorEvent` | `OnError` | No |
| `styleimagemissing` | `MapStyleImageMissingEvent` | `OnStyleImageMissing` (observe only in MapLibre 6+; use `SetMissingStyleImageResolver` to supply images) | No |
| `render`, `idle` | `MapEvent` | `OnRender`, `OnIdle` | No |
| `cooperativegestureprevented` | `MapCooperativeGestureEvent` | `OnCooperativeGesturePrevented` | No |
| `projectiontransition` | `MapProjectionEvent` | `OnProjectionTransition` | No |
| `terrain` | `MapTerrainEvent` | `OnTerrain` | No |

Aliases (MapLibre 6 naming): `MapSourceDataEvent` / `MapStyleDataEvent` (data events), `MapMovementEvent` (camera), `MapBoxZoomEvent` (boxzoom).

Compact interop DTO includes `dataType`, `sourceId`, `sourceDataType`, `isSourceLoaded`, `tile`, `newProjection`, and missing-image `id` in addition to `type` / `point` / `lngLat` / `features`.

## Pitfalls

- Always remove listeners when re-subscribing (e.g. before adding a duplicate handler).
- `MapMouseEvent.Features` is `LayerFeatureFeature[]` — use the same shape as `QueryRenderedLayerFeatures`.
- Layer-scoped events require the layer to exist before subscribing.
- **`preventDefault()` is not available from C#.** MapLibre requires calling `preventDefault()` synchronously in the JavaScript event handler. Because Blazor invokes .NET callbacks asynchronously after `JSON.stringify`, you cannot block default map gestures from C#. Use `MapOptions` instead (`CooperativeGestures`, `DragPan`, `ScrollZoom`, etc.) or handle gestures in custom JavaScript.

## Marker and Popup handles

- `AddMarker` returns `MapMarker` — `SetLngLat`, `SetRotation`, `SetDraggable`, `SetPopup`, `TogglePopup`, `OnClick`, `OnDrag*`
- `AddPopup` returns `MapPopup` — `SetHtml`, `SetText`, `TrackPointer`, `IsOpen`, `OnOpen`, `OnClose`
- `CreatePopup` remains as a legacy wrapper around `AddPopup`
