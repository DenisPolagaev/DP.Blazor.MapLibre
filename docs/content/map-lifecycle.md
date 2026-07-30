# MapLibre lifecycle ownership (Geoportal)

## Ownership

| Object | Owner | Notes |
|--------|-------|--------|
| Map instance / JS registries | `MapLibre` component | `remove()` calls `offAll`, clears markers/popups/options |
| Listeners created via `AddListener` / `OnClick` | Map + `Listener` handle | Dispose map or call `Listener.DisposeAsync` |
| Plugins via `RegisterPlugin` / `RegisterPluginAsync` | **Map** | App must not dispose them again after map teardown |
| Compare plugin | Host (`GeoportalMapHost`) | Cross-map; host calls `RemoveAsync` + `DisposeAsync` |
| GeoGrid / Measure / Wind pulse app handles | App services hold instances | On remount, drop handles and create fresh plugins; map already disposed registered ones |

## Single-map plugin lifecycle

```
Created → InitializeAsync → Initialized → Attach/Sync → Attached
Attached → DetachAsync → Initialized
Initialized|Attached → DisposeAsync → Disposed
```

- Implement `IMapLibrePluginLifecycle` (or inherit `MapLibrePluginBase`) for attach/detach + idempotent dispose.
- Domain APIs (`AddGeoGridAsync`, `SyncAsync`, control add/remove) mark attached/detached.
- Map teardown order: `DetachAsync` then `DisposeAsync` for every registered plugin.
- `UnregisterPluginAsync(plugin, dispose: true)` removes from the registry and optionally disposes.

## Sequence

1. **Primary mount** — map init → `RegisterPlugin` (GeoGrid, wind, measure) → style load → apply layers → attach interaction listeners.
2. **Compare mount** — second map load → host-owned `ComparePlugin.CreateAsync` → camera sync via `ApplyViewStateAsync`.
3. **Style reload** — rehydrate layers/listeners; recreate compare control if attached (`RemoveAsync` then `CreateAsync`).
4. **Host unmount** — host disposes compare; map `DisposeAsync` detaches+disposes registered plugins; runtime `DetachHostAsync` only resets service handles (no double-dispose).

## Auth for tiles

Do not use synchronous C# `SetTransformRequest` on every tile. Prefer cookies, signed URLs, or `setJsTransformRequestPolicy`.
