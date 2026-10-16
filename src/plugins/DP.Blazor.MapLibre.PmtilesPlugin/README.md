# DP.Blazor.MapLibre.PmtilesPlugin

**PMTiles** protocol plugin for [DP.Blazor.MapLibre](https://github.com/DenisPolagaev/DP.Blazor.MapLibre), registering the `pmtiles://` protocol on MapLibre GL JS using [protomaps/PMTiles](https://github.com/protomaps/PMTiles).

Once registered, any source whose URL starts with `pmtiles://` (for example `pmtiles://https://host/archive.pmtiles`) is served over HTTP Range requests. The protocol is process-global — one successful initialization covers every map on the page.

## Install

```bash
dotnet add package DP.Blazor.MapLibre.PmtilesPlugin
```

The core `DP.Blazor.MapLibre` package is referenced automatically.

## Quick start

Register the plugin **before** adding sources with `pmtiles://` URLs:

```razor
@using DP.Blazor.MapLibre.PmtilesPlugin

<MapLibre @ref="_map" Options="_options" OnLoad="OnMapLoad" />

@code {
    private MapLibre _map = new();
    private readonly PmtilesPlugin _pmtiles = new();

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
            await _map.RegisterPlugin(_pmtiles);
    }

    private async Task OnMapLoad(EventArgs _)
    {
        // Sources may now use archive URLs such as:
        //   pmtiles://https://example.com/tiles/planet.pmtiles
    }
}
```

## Documentation

- [Documentation site](https://denispolagaev.github.io/DP.Blazor.MapLibre/)
- [Plugin sources](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/tree/main/src/plugins/DP.Blazor.MapLibre.PmtilesPlugin)

## License

Targets .NET 8, 9, 10 and 11. Released under the [Unlicense](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/blob/main/UNLICENSE).
