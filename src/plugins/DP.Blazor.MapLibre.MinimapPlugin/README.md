# DP.Blazor.MapLibre.MinimapPlugin

Overview **minimap** control with a draggable viewport rectangle for [DP.Blazor.MapLibre](https://github.com/DenisPolagaev/DP.Blazor.MapLibre), wrapping [mapboxgl-minimap](https://github.com/aesqe/mapboxgl-minimap).

## Install

```bash
dotnet add package DP.Blazor.MapLibre.MinimapPlugin
```

The core `DP.Blazor.MapLibre` package is referenced automatically.

## Quick start

```razor
@using DP.Blazor.MapLibre.MinimapPlugin
@using DP.Blazor.MapLibre.Models.Control

<MapLibre @ref="_map" Options="_options" OnLoad="OnMapLoad" />

@code {
    private MapLibre _map = new();
    private readonly MinimapPlugin _minimap = new();

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
            await _map.RegisterPlugin(_minimap);
    }

    private async Task OnMapLoad(EventArgs _) =>
        await _minimap.AddMinimapControlAsync(
            new MinimapControlOptions { Width = "220px", Height = "140px" },
            ControlPosition.BottomRight);
}
```

## Documentation

- [Minimap plugin guide](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/blob/main/docs/content/plugins/minimap-plugin.md)
- [Documentation site](https://denispolagaev.github.io/DP.Blazor.MapLibre/)

## License

Targets .NET 8, 9, 10 and 11. Released under the [Unlicense](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/blob/main/UNLICENSE).
