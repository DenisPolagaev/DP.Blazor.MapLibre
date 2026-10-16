# DP.Blazor.MapLibre.GeoGridPlugin

Geographic **graticule** (meridians and parallels with coordinate labels) plugin for [DP.Blazor.MapLibre](https://github.com/DenisPolagaev/DP.Blazor.MapLibre), wrapping [geogrid-maplibre-gl](https://github.com/falseinput/geogrid-maplibre-gl).

## Install

```bash
dotnet add package DP.Blazor.MapLibre.GeoGridPlugin
```

The core `DP.Blazor.MapLibre` package is referenced automatically.

## Quick start

Edge labels need the bundled stylesheet. Add it to your host page or layout:

```html
<link rel="stylesheet" href="_content/GeoGridPlugin/geogrid/geogrid.css" />
```

Register the plugin, then add the grid once the map is ready (`OnLoad`, or `OnStyleLoad` with the pending guard):

```razor
@using DP.Blazor.MapLibre.GeoGridPlugin

<MapLibre @ref="_map" Options="_options" OnLoad="OnMapLoad" />

@code {
    private MapLibre _map = new();
    private readonly GeoGridPlugin _geoGrid = new();

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
            await _map.RegisterPlugin(_geoGrid);
    }

    private async Task OnMapLoad(EventArgs _) =>
        await _geoGrid.AddGeoGridAsync(new GeoGridOptions { ZoomLevelRange = [0, 14] });
}
```

## Documentation

- [Geo grid plugin guide](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/blob/main/docs/content/plugins/geogrid-plugin.md)
- [Documentation site](https://denispolagaev.github.io/DP.Blazor.MapLibre/)

## License

Targets .NET 8, 9, 10 and 11. Released under the [Unlicense](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/blob/main/UNLICENSE).
