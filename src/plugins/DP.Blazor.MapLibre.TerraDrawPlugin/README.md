# DP.Blazor.MapLibre.TerraDrawPlugin

Interactive **drawing and geometry editing** plugin for [DP.Blazor.MapLibre](https://github.com/DenisPolagaev/DP.Blazor.MapLibre), wrapping [@watergis/maplibre-gl-terradraw](https://github.com/watergis/maplibre-gl-terradraw) on top of [Terra Draw](https://github.com/JamesLMilner/terra-draw).

Includes the built-in toolbar controls for draw, measure and Valhalla workflows. The plugin loads `maplibre-gl-terradraw` and its stylesheet automatically during initialization.

## Install

```bash
dotnet add package DP.Blazor.MapLibre.TerraDrawPlugin
```

The core `DP.Blazor.MapLibre` package is referenced automatically.

## Quick start

Register the plugin on the `MapLibre` component in `OnAfterRenderAsync` (`firstRender`) so the `@ref` to the map is available, then add a control once the map is loaded:

```razor
@using DP.Blazor.MapLibre.TerraDrawPlugin
@using DP.Blazor.MapLibre.Models.Control

<MapLibre @ref="_map" Options="_options" OnLoad="OnMapLoad" />

@code {
    private MapLibre _map = new();
    private readonly TerraDrawPlugin _terraDraw = new();

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
            await _map.RegisterPlugin(_terraDraw);
    }

    private async Task OnMapLoad(EventArgs _) =>
        await _terraDraw.AddDrawControlAsync(new TerradrawControlOptions
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
```

Each `Add*ControlAsync` method returns a `controlId`, so several controls (draw / measure / Valhalla) can coexist on the same map.

## Documentation

- [Terra Draw plugin guide](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/blob/main/docs/content/plugins/terra-draw-plugin.md)
- [Documentation site](https://denispolagaev.github.io/DP.Blazor.MapLibre/)

## License

Targets .NET 8, 9, 10 and 11. Released under the [Unlicense](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/blob/main/UNLICENSE).
