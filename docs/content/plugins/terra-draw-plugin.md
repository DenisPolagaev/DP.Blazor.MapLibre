# Terra Draw plugin

The **Terra Draw plugin** adds interactive drawing and geometry editing to a `MapLibre` map. It wraps [@watergis/maplibre-gl-terradraw](https://github.com/watergis/maplibre-gl-terradraw) on top of [Terra Draw](https://github.com/JamesLMilner/terra-draw), including the built-in toolbar controls for draw, measure, and Valhalla workflows.

The plugin project lives at `src/plugins/DP.Blazor.MapLibre.TerraDrawPlugin`.

## Installation

Add a project reference to the Terra Draw plugin Razor Class Library:

```shell
dotnet add reference ../../src/plugins/DP.Blazor.MapLibre.TerraDrawPlugin/DP.Blazor.MapLibre.TerraDrawPlugin.csproj
```

## Register the plugin

Register the plugin on the `MapLibre` component in `OnAfterRenderAsync` with `firstRender` so the `@ref` to the map is available:

```csharp
@using DP.Blazor.MapLibre.TerraDrawPlugin
@using DP.Blazor.MapLibre.Models.Control

<MapLibre @ref="_map" Options="_options" OnLoad="OnMapLoad" />

@code {
    private MapLibre _map = new();
    private TerraDrawPlugin _terraDraw = new();
    private string? _drawControlId;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await _map.RegisterPlugin(_terraDraw);
        }
    }

    private async Task OnMapLoad(EventArgs _)
    {
        _drawControlId = await _terraDraw.AddDrawControlAsync(new TerradrawControlOptions
        {
            Open = true,
            Modes =
            [
                TerradrawModes.Point,
                TerradrawModes.Polygon,
                TerradrawModes.Select,
                TerradrawModes.Delete,
            ],
        }, ControlPosition.TopLeft);
    }
}
```

The plugin loads `maplibre-gl-terradraw` and its stylesheet automatically during `Initialize`. MapLibre GL JS must already be loaded on the page (the core `MapLibre` component handles this).

## Multiple controls

Each `Add*ControlAsync` method returns a `controlId`. You can add several controls to the same map and target a specific one by passing `controlId` to other methods. When omitted, the active control is used.

```csharp
var drawId = await _terraDraw.AddDrawControlAsync();
var measureId = await _terraDraw.AddMeasureControlAsync();
await _terraDraw.SetActiveControlAsync(measureId);
await _terraDraw.RecalcAsync(measureId);
```

| Method | Description |
| --- | --- |
| `AddDrawControlAsync(options?, position?, controlId?)` | Standard Terra Draw toolbar (`MaplibreTerradrawControl`). Returns `controlId`. |
| `AddMeasureControlAsync(options?, position?, controlId?)` | Distance, area, and elevation measure toolbar. |
| `AddValhallaControlAsync(options?, position?, controlId?)` | Valhalla routing and isochrone toolbar. |
| `SetActiveControlAsync(controlId)` | Sets the default control for methods that accept optional `controlId`. |
| `GetActiveControlIdAsync()` / `GetControlIdsAsync()` | Inspect registered controls. |
| `GetControlTypeAsync(controlId?)` | Returns `draw`, `measure`, or `valhalla`. |
| `RemoveControlAsync(controlId?)` / `RemoveAllControlsAsync()` | Remove one or all controls. |

Use `TerradrawControlOptions`, `MeasureControlOptions`, and `ValhallaControlOptions` to configure modes, adapter settings, measure units, layer specs, terrain sources, and Valhalla API options.

## Drawing modes

Built-in mode names are available on `TerradrawModes`:

| Constant | Description |
| --- | --- |
| `TerradrawModes.Point` | Draw point features |
| `TerradrawModes.LineString` | Draw line features |
| `TerradrawModes.Polygon` | Draw polygon features |
| `TerradrawModes.Rectangle` | Draw rectangles |
| `TerradrawModes.Circle` | Draw circles |
| `TerradrawModes.Freehand` | Freehand drawing |
| `TerradrawModes.Select` | Select and drag coordinates |
| `TerradrawModes.Delete` | Delete features |
| `TerradrawModes.Render` | Read-only render mode |

Valhalla-specific modes are on `TerradrawValhallaModes`.

## Control API

| Method | Description |
| --- | --- |
| `ActivateControlAsync(controlId?)` / `DeactivateControlAsync(controlId?)` | Show or hide a control. |
| `SetControlExpandedAsync(expanded, controlId?)` / `GetControlExpandedAsync(controlId?)` | Expand or collapse the toolbar. |
| `SetShowDeleteConfirmationAsync(value, controlId?)` / `GetShowDeleteConfirmationAsync(controlId?)` | Toggle delete confirmation dialog. |
| `ResetActiveModeAsync(controlId?)` | Reset the active drawing mode. |
| `RecalcAsync(controlId?)` | Recalculate measure labels (measure control only). |
| `CleanControlStyleAsync(styleJson, options?, controlId?)` | Remove Terra Draw layers from a style via the control instance. |

## Terra Draw instance API

| Method | Description |
| --- | --- |
| `SetModeAsync(mode, controlId?)` / `GetModeAsync(controlId?)` | Change or read the Terra Draw mode. |
| `GetFeaturesAsync(onlySelected, controlId?)` | Read features from the control GeoJSON store. |
| `GetSnapshotAsync(controlId?)` | Current Terra Draw snapshot (helper points filtered). |
| `AddFeaturesAsync(geoJson, controlId?)` | Add a GeoJSON Feature or FeatureCollection. |
| `RemoveFeaturesAsync(ids, controlId?)` / `ClearFeaturesAsync(controlId?)` | Remove features programmatically. |
| `StartDrawingAsync(controlId?)` / `StopDrawingAsync(controlId?)` | Start or stop the Terra Draw instance. |
| `IsDrawingEnabledAsync(controlId?)` | Whether drawing is currently enabled. |
| `SelectFeatureAsync(featureId, controlId?)` | Select a feature by id. |
| `UpdateModeOptionsAsync(mode, options, controlId?)` | Update per-mode Terra Draw options at runtime. |
| `EditTerraDrawFeatureAsync(featureJson, mode, controlId?)` | Load an existing feature and enter select mode. |
| `FinishGeometryAsync()` | Finish the current geometry (simulates Enter). |
| `DisableMapZoomGesturesAsync()` / `EnableMapZoomGesturesAsync()` | Toggle conflicting map zoom gestures. |

Legacy helpers `AddTerraDrawToolAsync`, `SetTerraDrawModeAsync`, `StopTerraDrawAsync`, and `GetTerraDrawGeometriesAsync` remain available (marked `[Obsolete]`) and delegate to the control API.

## Measure control runtime properties

Available when the target control is a `MaplibreMeasureControl`:

| Getter / setter pair | Description |
| --- | --- |
| `GetMeasureUnitTypeAsync` / `SetMeasureUnitTypeAsync` | `metric` or `imperial`. |
| `GetDistancePrecisionAsync` / `SetDistancePrecisionAsync` | Decimal places for distance labels. |
| `GetDistanceUnitAsync` / `SetDistanceUnitAsync` | Distance unit override. |
| `GetAreaPrecisionAsync` / `SetAreaPrecisionAsync` | Decimal places for area labels. |
| `GetAreaUnitAsync` / `SetAreaUnitAsync` | Area unit override. |
| `GetMeasureUnitSymbolsAsync` / `SetMeasureUnitSymbolsAsync` | Custom unit symbols. |
| `GetComputeElevationAsync` / `SetComputeElevationAsync` | Enable elevation along lines. |
| `GetFontGlyphsAsync` / `SetFontGlyphsAsync` | Font stack used by measure labels. |

## Valhalla control runtime properties

Available when the target control is a `MaplibreValhallaControl`:

| Getter / setter pair | Description |
| --- | --- |
| `GetValhallaUrlAsync` / `SetValhallaUrlAsync` | Valhalla API base URL. |
| `GetRoutingCostingModelAsync` / `SetRoutingCostingModelAsync` | Routing costing model. |
| `GetRoutingDistanceUnitAsync` / `SetRoutingDistanceUnitAsync` | Routing distance unit. |
| `GetTimeIsochroneCostingModelAsync` / `SetTimeIsochroneCostingModelAsync` | Time isochrone costing model. |
| `GetDistanceIsochroneCostingModelAsync` / `SetDistanceIsochroneCostingModelAsync` | Distance isochrone costing model. |
| `GetIsochroneContoursAsync` / `SetIsochroneContoursAsync` | Isochrone contour definitions. |

## Library helpers

Static helpers exported by maplibre-gl-terradraw:

| Method | Description |
| --- | --- |
| `GetDefaultControlOptionsAsync` | Default `TerradrawControlOptions`. |
| `GetDefaultMeasureControlOptionsAsync` | Default `MeasureControlOptions`. |
| `GetDefaultValhallaControlOptionsAsync` | Default `ValhallaControlOptions`. |
| `GetDefaultMeasureUnitSymbolsAsync` | Default measure unit symbols. |
| `GetDefaultModeOptionsAsync` | Default per-mode Terra Draw options. |
| `GetTerradrawSourceIdsAsync` | Terra Draw layer source ids. |
| `GetMeasureSourceIdsAsync` | Measure control source ids. |
| `GetValhallaSourceIdsAsync` | Valhalla control source ids. |
| `GetAwsElevationTilesAsync` / `GetMapterhornTilesAsync` | Built-in terrain tile presets. |
| `CleanLibraryStyleAsync(styleJson, options?, sourceIds?, prefixId?)` | Remove Terra Draw layers from a style via the library helper. |
| `CalcAreaAsync` / `CalcDistanceAsync` | Compute labels for a GeoJSON feature. |
| `ConvertAreaAsync` / `ConvertDistanceAsync` / `ConvertElevationAsync` | Unit conversion helpers. |

## Control events

Subscribe to maplibre-gl-terradraw control events:

```csharp
await _terraDraw.AddControlEventListener<TerraDrawEventArgs>(
    TerraDrawEventType.ModeChanged,
    args => Console.WriteLine($"Mode: {args.Mode}"),
    controlId: _drawControlId);
```

| Event | Description |
| --- | --- |
| `ModeChanged` | Active drawing mode changed |
| `FeatureDeleted` | Features were deleted |
| `SettingChanged` | Control settings changed |
| `Expanded` / `Collapsed` | Toolbar expanded or collapsed |

## Terra Draw instance events

```csharp
_finishListener = await _terraDraw.AddTerraDrawInstanceEventListener<TerraDrawFinishEventArgs>(
    TerraDrawInstanceEventType.Finish,
    args => Console.WriteLine($"Finished feature {args.Id}"),
  controlId: _drawControlId);

_changeListener = await _terraDraw.AddTerraDrawChangeListener<string>(
    geoJson => { _snapshot = geoJson; StateHasChanged(); },
    throttleTime: 200,
    controlId: _drawControlId);
```

| Listener method | Fires when |
| --- | --- |
| `AddTerraDrawInstanceEventListener<T>` | Terra Draw `change`, `finish`, `select`, or `deselect` (optional throttle for `change`) |
| `AddTerraDrawFinishListener<T>` | A draw or coordinate drag finishes |
| `AddTerraDrawDeleteListener<T>` | Features are deleted |
| `AddTerraDrawChangeListener<T>` | Features are created, updated, or deleted (throttled) |

Use `TerraDrawFinishEventArgs` and `TerraDrawChangeEventArgs` for strongly typed instance event payloads.

## Related topics

- [Create a plugin](../getting-started/create-a-plugin.md) — build your own plugin from scratch
- [Key concepts](../getting-started/key-concepts.md#plugin-system) — plugin architecture overview
- [Terra Draw example](./examples/terra-draw.md) — live demo
