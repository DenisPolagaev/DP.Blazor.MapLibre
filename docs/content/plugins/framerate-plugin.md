# Frame rate plugin

The **Frame rate plugin** adds a performance overlay that shows live and average FPS while the map is moving. It wraps [mapbox-gl-framerate](https://github.com/mapbox/mapbox-gl-framerate) for MapLibre GL JS.

The plugin project lives at `src/plugins/DP.Blazor.MapLibre.FrameratePlugin`.

## Installation

```shell
dotnet add reference ../../src/plugins/DP.Blazor.MapLibre.FrameratePlugin/DP.Blazor.MapLibre.FrameratePlugin.csproj
```

## Register the plugin

```csharp
@using DP.Blazor.MapLibre.FrameratePlugin
@using DP.Blazor.MapLibre.Models.Control

<MapLibre @ref="_map" Options="_options" OnLoad="OnMapLoad" />

@code {
    private MapLibre _map = new();
    private FrameratePlugin _framerate = new();

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await _map.RegisterPlugin(_framerate);
        }
    }

    private async Task OnMapLoad(EventArgs _)
    {
        await _framerate.AddFramerateControlAsync(new FramerateControlOptions
        {
            Color = "#7cf859",
            Background = "rgba(0, 0, 0, 0.85)",
        }, ControlPosition.TopRight);
    }
}
```

## API overview

| Method | Description |
| --- | --- |
| `AddFramerateControlAsync(options?, position?)` | Adds the FPS graph control. |
| `RemoveFramerateControlAsync()` | Removes the FPS graph control. |

## Options

`FramerateControlOptions` exposes all upstream graph settings:

| Property | Description |
| --- | --- |
| `Background` | Container background color. |
| `BarWidth` | Width of each performance bar (device pixels). |
| `Color` | Bar and text color. |
| `Font` | Font family list for the FPS label. |
| `GraphHeight`, `GraphWidth` | Graph size in device pixels. |
| `GraphTop`, `GraphRight` | Graph offsets in device pixels. |
| `Width` | Container width in device pixels. |

Dispose the plugin when the page is torn down:

```csharp
public async ValueTask DisposeAsync() => await _framerate.DisposeAsync();
```

## Live example

See the [Frame rate example](./examples/framerate.md).
