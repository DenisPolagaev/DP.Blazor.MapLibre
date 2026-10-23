# DP.Blazor.MapLibre.GeoGridPlugin

Geographic **graticule** (meridians and parallels with coordinate labels) plugin for [DP.Blazor.MapLibre](https://github.com/DenisPolagaev/DP.Blazor.MapLibre), wrapping [geogrid-maplibre-gl](https://github.com/falseinput/geogrid-maplibre-gl).

## Install

```bash
dotnet add package DP.Blazor.MapLibre.GeoGridPlugin
```

The core `DP.Blazor.MapLibre` package is referenced automatically.

## Quick start

No manual stylesheet link is needed: the plugin loads its `geogrid.css` (used for edge label positioning) itself when it is registered.

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

### Grid density

Use one of the two forms (when both are set, `GridDensityDegrees` wins):

- `GridDensityDegrees`: fixed spacing in degrees at every zoom level.
- `GridDensityByZoom`: a list of `GeoGridDensityStep { Zoom, DensityDegrees }`. The step with the greatest `Zoom` that is less than or equal to the current zoom is used; zoom levels below the first step use the first step's density.

Unset optional properties are omitted from the options sent to JavaScript.

## Documentation

- [Geo grid plugin guide](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/blob/main/docs/content/plugins/geogrid-plugin.md)
- [Documentation site](https://denispolagaev.github.io/DP.Blazor.MapLibre/)

## License

Targets .NET 8, 9, 10 and 11. The plugin code is released under the [Unlicense](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/blob/main/UNLICENSE).

The vendored file `wwwroot/geogrid/index.js` is third-party code from geogrid-maplibre-gl. Its version and license are **not recorded in this repository**; verify them against the upstream project before redistribution. The file header states this as well.
