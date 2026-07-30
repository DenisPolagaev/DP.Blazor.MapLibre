# Mapbox GL Draw plugin

The **Mapbox GL Draw plugin** is a reference implementation in the examples solution. It integrates [Mapbox GL Draw](https://github.com/mapbox/mapbox-gl-draw) for drawing and editing features on a MapLibre map.

The plugin project lives at `examples/DP.Blazor.MapLibre.Examples.MapboxGlPlugin`. Use it as a starting point for plugins that depend on third-party JavaScript libraries loaded as ES modules.

## Installation

Add a project reference from your Blazor app:

```shell
dotnet add reference ../../examples/DP.Blazor.MapLibre.Examples.MapboxGlPlugin/DP.Blazor.MapLibre.Examples.MapboxGlPlugin.csproj
```

Include the Mapbox GL Draw stylesheet on your host page:

```html
<link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.5.0/mapbox-gl-draw.css" />
```

## Register the plugin

```csharp
@using DP.Blazor.MapLibre.Examples.MapboxGlPlugin

<MapLibre @ref="_map" Options="_options" OnLoad="OnMapLoad" />

@code {
    private MapLibre _map = new();
    private MapboxGlDrawPlugin _draw = new();

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        _draw.OnDrawUpdate = async update =>
        {
            // FeatureCollection and map status from the draw control
        };

        if (firstRender)
        {
            await _map.RegisterPlugin(_draw);
        }
    }

    private async Task OnMapLoad(EventArgs _)
    {
        await _draw.AddControl(new
        {
            displayControlsDefault = false,
            controls = new { point = true, polygon = true, trash = true },
            defaultMode = "draw_polygon"
        });
    }
}
```

## API overview

| Member | Description |
| --- | --- |
| `AddControl(object drawControl)` | Attaches Mapbox GL Draw with the given options object. |
| `AddFeature(FeatureFeature feature)` | Adds a feature to the draw control. |
| `OnDrawUpdate` | Callback when features or draw mode change. |
| `DisposeAsync()` | Removes the draw control and releases JS module references. |

## Live example

See the [Mapbox GL Draw example](./examples/mapbox-gl-draw.md).

## Related topics

- [Create a plugin](./create-a-plugin.md)
- [Terra Draw plugin](./terra-draw-plugin.md) — maintained drawing plugin in `src/plugins`
