# DP.Blazor.MapLibre.FrameratePlugin

Live **frame rate** overlay plugin for [DP.Blazor.MapLibre](https://github.com/DenisPolagaev/DP.Blazor.MapLibre), wrapping [mapbox-gl-framerate](https://github.com/mapbox/mapbox-gl-framerate).

Shows live and average FPS while the map is moving.

## Install

```bash
dotnet add package DP.Blazor.MapLibre.FrameratePlugin
```

The core `DP.Blazor.MapLibre` package is referenced automatically.

## Quick start

```razor
@using DP.Blazor.MapLibre.FrameratePlugin
@using DP.Blazor.MapLibre.Models.Control

<MapLibre @ref="_map" Options="_options" OnLoad="OnMapLoad" />

@code {
    private MapLibre _map = new();
    private readonly FrameratePlugin _framerate = new();

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
            await _map.RegisterPlugin(_framerate);
    }

    private async Task OnMapLoad(EventArgs _) =>
        await _framerate.AddFramerateControlAsync(
            new FramerateControlOptions { Color = "#7cf859" },
            ControlPosition.TopRight);
}
```

## Documentation

- [Frame rate plugin guide](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/blob/main/docs/content/plugins/framerate-plugin.md)
- [Documentation site](https://denispolagaev.github.io/DP.Blazor.MapLibre/)

## License

Targets .NET 8, 9, 10 and 11. Released under the [Unlicense](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/blob/main/UNLICENSE).
