# DP.Blazor.MapLibre.ComparePlugin

Swipe-slider **map compare** plugin for [DP.Blazor.MapLibre](https://github.com/DenisPolagaev/DP.Blazor.MapLibre), wrapping [maplibre-gl-compare](https://github.com/maplibre/maplibre-gl-compare).

Compare two `MapLibre` maps side by side and drag the divider to reveal one over the other.

## Install

```bash
dotnet add package DP.Blazor.MapLibre.ComparePlugin
```

The core `DP.Blazor.MapLibre` package is referenced automatically.

## Quick start

Place two maps in a shared, relatively-positioned container and create the compare control once **both** maps have loaded:

```razor
@using DP.Blazor.MapLibre.ComparePlugin

<div id="comparison-container" class="comparison-container">
    <MapLibre MapId="before" Options="_beforeOptions" OnLoad="OnMapsReady" Class="map" Height="100%" />
    <MapLibre MapId="after" Options="_afterOptions" OnLoad="OnMapsReady" Class="map" Height="100%" />
</div>

@code {
    private readonly ComparePlugin _compare = new();
    private int _mapsLoaded;

    private async Task OnMapsReady(EventArgs _)
    {
        if (Interlocked.Increment(ref _mapsLoaded) < 2)
            return;

        await _compare.InitializeAsync(JsRuntime);
        await _compare.CreateAsync("before", "after", "#comparison-container");
    }
}
```

Both maps must be `position: absolute` and fill the container. Add the MapLibre stylesheet in your host page:

```html
<link href="_content/DP.Blazor.MapLibre/maplibre-gl/dist/maplibre-gl.css" rel="stylesheet" />
```

## Documentation

- [Map Compare plugin guide](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/blob/main/docs/content/plugins/map-compare-plugin.md)
- [Documentation site](https://denispolagaev.github.io/DP.Blazor.MapLibre/)

## License

Targets .NET 8, 9, 10 and 11. Released under the [Unlicense](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/blob/main/UNLICENSE).
