# Geo grid plugin

The **Geo grid plugin** adds a geographic graticule (meridians and parallels) with coordinate labels on the map edges. It wraps [geogrid-maplibre-gl](https://github.com/falseinput/geogrid-maplibre-gl) for MapLibre GL JS.

The plugin project lives at `src/plugins/DP.Blazor.MapLibre.GeoGridPlugin`.

## Installation

```shell
dotnet add reference ../../src/plugins/DP.Blazor.MapLibre.GeoGridPlugin/DP.Blazor.MapLibre.GeoGridPlugin.csproj
```

## Stylesheet

The plugin does **not** inject CSS at runtime. Grid lines are MapLibre layers and render without extra styles, but **edge labels** need the bundled stylesheet for correct positioning (`transform` offsets).

Add this to your app host page or layout (for example in `App.razor`, `index.html`, or a `.razor` page that uses the plugin):

```html
<link rel="stylesheet" href="_content/GeoGridPlugin/geogrid/geogrid.css" />
```

You can omit the stylesheet if you do not need labels, or if you provide equivalent CSS for the `.geogrid` and `.geogrid__label` classes yourself.

## Register the plugin

Register the plugin with the `MapLibre` component in `OnAfterRenderAsync`, then call `AddGeoGridAsync` when the map is ready. The plugin does not subscribe to map events — **you** choose when to add the grid (typically from `OnLoad` or `OnStyleLoad`).

Because `OnStyleLoad` can fire before the parent page registers the plugin, either use `OnLoad` (as in the example below) or defer adding until after `RegisterPlugin` completes.

```csharp
@using DP.Blazor.MapLibre.GeoGridPlugin

<link rel="stylesheet" href="_content/GeoGridPlugin/geogrid/geogrid.css" />

<MapLibre @ref="_map"
          Options="_options"
          OnLoad="OnMapLoad" />

@code {
    private MapLibre _map = new();
    private readonly GeoGridPlugin _geoGrid = new();
    private bool _pendingGeoGridAdd;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await _map.RegisterPlugin(_geoGrid);

            if (_pendingGeoGridAdd)
            {
                await _geoGrid.AddGeoGridAsync(new GeoGridOptions { ZoomLevelRange = [0, 14] });
            }
        }
    }

    private async Task OnMapLoad(EventArgs _)
    {
        if (!_geoGrid.IsInitialized)
        {
            _pendingGeoGridAdd = true;
            return;
        }

        await _geoGrid.AddGeoGridAsync(new GeoGridOptions
        {
            GridStyle = new GeoGridLineStyle
            {
                Color = "rgba(15, 23, 42, 0.25)",
                Width = 1,
            },
            LabelStyle = new GeoGridLabelStyle
            {
                Color = "rgba(15, 23, 42, 0.8)",
                FontSize = "12px",
            },
            ZoomLevelRange = [0, 14],
        });
    }
}
```

Use `OnStyleLoad` when the grid must be added as soon as the style is available. Apply the same `_pendingGeoGridAdd` guard if `OnStyleLoad` may run before `RegisterPlugin`.

## API overview

| Member | Description |
| --- | --- |
| `IsActive` | Whether the grid is currently on the map. |
| `IsInitialized` | Whether `Initialize` completed. |
| `AddGeoGridAsync(options)` | Adds or replaces the grid. Call after the style is loaded. |
| `RemoveGeoGridAsync()` | Removes layers, sources, and labels from the map. |
| `ShowGeoGridAsync()` | Re-attaches the grid using the last options from `AddGeoGridAsync`. |
| `DisposeAsync()` | Removes the grid and disposes the JavaScript module. |

## Options

`GeoGridOptions` mirrors the upstream [geogrid-maplibre-gl](https://github.com/falseinput/geogrid-maplibre-gl) options:

| Property | Description |
| --- | --- |
| `BeforeLayerId` | Insert grid layers below this layer id. When omitted, layers are added on top. |
| `GridStyle` | Line color, width, and optional dash array for meridians and parallels. |
| `LabelStyle` | Inline label appearance: `Color`, `FontSize`, `FontFamily`, `TextShadow`. |
| `ZoomLevelRange` | Visible zoom range as `[minZoom, maxZoom]`. |
| `GridDensityDegrees` | Fixed spacing between lines in degrees. |
| `GridDensityByZoom` | Zoom-dependent density steps (`GeoGridDensityStep` with `Zoom` and `DensityDegrees`). |
| `LabelFormat` | Preset label format: `Default` (DMS), `DegreesOnly`, or `IntegerDegrees`. |

When neither `GridDensityDegrees` nor `GridDensityByZoom` is set, the upstream default density curve is used.

## Toggle visibility

To hide and show the grid without losing options:

```csharp
await _geoGrid.RemoveGeoGridAsync();
// ...
await _geoGrid.ShowGeoGridAsync();
```

Dispose the plugin when the page is torn down:

```csharp
@implements IAsyncDisposable

public async ValueTask DisposeAsync() => await _geoGrid.DisposeAsync();
```

## Live example

See the [Geo grid example](./examples/geogrid.md).
