# DP.Blazor.MapLibre.ProjPlugin

**Any-projection** plugin for [DP.Blazor.MapLibre](https://github.com/DenisPolagaev/DP.Blazor.MapLibre): render a map in any coordinate reference system via [proj-wasm](https://www.npmjs.com/package/proj-wasm) (PROJ 9 compiled to WebAssembly).

The plugin runs a self-contained, main-thread reprojection pipeline for GeoJSON and vector tiles — no Web Workers, no `maplibre-proj`/`backproj`. The runtime (about 28 MB of WebAssembly plus `proj.db`) ships inside the package under `_content/ProjPlugin/vendor`.

## Install

```bash
dotnet add package DP.Blazor.MapLibre.ProjPlugin
```

The core `DP.Blazor.MapLibre` package is referenced automatically.

## Requirements

- The map **must** be created with `RenderWorldCopies = false` (the fake coordinate space does not tile).
- Chromium-based hosts need no extra setup; Firefox/Safari hosts must add the import map from `GetImportMapAsync()` (see the guide).

## Quick start

```razor
@using DP.Blazor.MapLibre.ProjPlugin

<MapLibre @ref="_map" Options="_options" OnLoad="OnMapLoad" />

@code {
    private MapLibre _map = new();
    private readonly ProjPlugin _proj = new();

    private readonly MapOptions _options = new() { RenderWorldCopies = false };

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
            await _map.RegisterPlugin(_proj);
    }

    private async Task OnMapLoad(EventArgs _) =>
        await _proj.ApplyReprojectionAsync(new ProjReprojectOptions
        {
            Style = styleJson,
            Crs = "ESRI:54030", // Robinson
        });
}
```

## Documentation

- [Projection plugin guide](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/blob/main/docs/content/plugins/proj-plugin.md)
- [Documentation site](https://denispolagaev.github.io/DP.Blazor.MapLibre/)

## License

Targets .NET 8, 9, 10 and 11. Released under the [Unlicense](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/blob/main/UNLICENSE).
