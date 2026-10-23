# DP.Blazor.MapLibre.ProjPlugin

**Any-projection** plugin for [DP.Blazor.MapLibre](https://github.com/DenisPolagaev/DP.Blazor.MapLibre): render a map in any coordinate reference system (CRS) with [proj-wasm](https://www.npmjs.com/package/proj-wasm) (PROJ 9 compiled to WebAssembly) and [@wcohen/wasmts](https://www.npmjs.com/package/@wcohen/wasmts) (JTS).

The plugin runs a self-contained reprojection pipeline on the browser main thread for GeoJSON and vector tiles. It has no Web Workers and does not use `maplibre-proj` or `backproj`.

The vendored runtime lives under `_content/ProjPlugin/vendor` and is about 29.6 MB on disk (28.2 MiB):

| Package | Size on disk | Notes |
|---|---|---|
| `proj-wasm` | 14.6 MB | includes `proj.db` (10.2 MB) and the PROJ module `proj-emscripten.wasm` (3.6 MB) |
| `@wcohen/wasmts` | 14.2 MB | includes `wasmts.js.wasm` (13.9 MB) |
| everything else | about 0.8 MB | JavaScript helpers |

## Install

```bash
dotnet add package DP.Blazor.MapLibre.ProjPlugin
```

The core `DP.Blazor.MapLibre` package is referenced automatically.

## Requirements

- The map **must** be created with `RenderWorldCopies = false`. The fake coordinate space does not tile.
- Register the plugin with `MapLibre.RegisterPlugin` before calling its members.
- Declare the import map entries from `GetImportMapAsync()` in a static `<script type="importmap">` before the Blazor framework script (see [Import map](#import-map)). This is required for Firefox and Safari and recommended for every browser.

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

## Main members

| Member | Effect on the map |
|---|---|
| `ReprojectStyleAsync(ProjReprojectOptions)` | none; returns the reprojected style |
| `ApplyReprojectionAsync(ProjReprojectOptions)` | `setStyle`, then `fitBounds` (unless `FitBounds = false`) |
| `ApplyCurrentStyleProjectionAsync(ProjMapProjectionOptions)` | reprojects the map's current style and applies it |
| `ReprojectSourceAsync(ProjSourceReprojectOptions)` | none; rewrites one source for a layer added later |
| `TransformPointAsync` / `InverseTransformCoordsAsync` | none; converts between real and fake coordinates |
| `GetImportMapAsync()` / `GetVendorManifestAsync()` | none; diagnostics |

## Import map

The vendored modules are resolved through an import map. Browsers read an import map only before the first module script loads. Put the entries in the host page before the Blazor framework script:

```html
<script type="importmap">
{
  "imports": {
    "proj-wasm": "_content/ProjPlugin/vendor/proj-wasm/dist/proj.mjs",
    "@wcohen/wasmts": "_content/ProjPlugin/vendor/wcohen-wasmts/dist/wasmts.js"
  }
}
</script>
```

Copy the complete `imports` object returned by `GetImportMapAsync()`; the sample above is abbreviated. If the host does not declare the entries, the plugin inserts them at runtime. When the browser ignores that insertion, the plugin logs a `console.warn` that names the fix. The page then fails to load the pipeline with `Failed to resolve module specifier` until the static entries are added.

## Detach and dispose

- `DetachAsync()` releases the protocol handlers and transformers that the plugin created for the map. It has an effect only after an apply or `ReprojectSourceAsync` call has attached the plugin.
- Dispose releases the same resources.
- **Detach does not restore the map.** The original style, camera and bounds are not rolled back. The reprojected style stays on the map, and its reprojected vector sources stop loading because their handlers are gone. Call `MapLibre.SetStyle` with your own style to restore the map.

## Behaviour to know about

- **Only the first tile URL template of a vector source is used.** A warning is logged for a source with several templates.
- **Input tiles per output tile are capped** by `MaxInputTiles` (default 64). When a tile needs more, the output tile is incomplete and a warning names the source.
- **Sources that cannot be reprojected are removed with their layers**, and a warning names each one. These are raster sources, vector sources without http(s) tile URLs, and sources that the plugin already reprojected.
- **HTTP 204 and 404 for an input tile** mean "no data here" and are treated as empty. Other HTTP errors fail the output tile, so MapLibre emits an error event. Failed loads are not cached.
- **Re-running** `ApplyCurrentStyleProjectionAsync` on a style that the plugin already reprojected is not supported.
- **`TileBoundaries`** is reserved. The value is sent to the pipeline, but debug layers are not implemented yet.
- **Projections** are computed per CRS and area of use and cached process-wide. `ReleaseProjectionResourcesAsync` clears that cache.
- Geometry is densified in real space and clipped per output tile. Cross-tile feature stitching and polygon repair are not implemented.

## Options

- `MaxInputTiles` (`ProjReprojectOptions`, `ProjMapProjectionOptions`, `ProjSourceReprojectOptions`): integer, at least 1, default 64.
- `PolarHemisphere` (`ProjReprojectOptions`, `ProjMapProjectionOptions`): `ProjPolarHemisphere.North` or `ProjPolarHemisphere.South`. Used only when no `AreaOfUse` is given; restricts the sampling to that hemisphere.
- `TransformerId`: must match the CRS of the call; a mismatch throws.

## Regenerating the vendored runtime

```bash
node scripts/vendor-proj.mjs
```

The script rebuilds `wwwroot/vendor` from pinned unpkg packages and copies `pmtiles` from `DP.Blazor.MapLibre.PmtilesPlugin`. It deletes the output directory first.

## Documentation

- [Projection plugin guide](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/blob/main/docs/content/plugins/proj-plugin.md)
- [Documentation site](https://denispolagaev.github.io/DP.Blazor.MapLibre/)

## License

Targets .NET 8, 9, 10 and 11. Released under the [Unlicense](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/blob/main/UNLICENSE). Vendored third-party files keep their own licenses; see `THIRD-PARTY-NOTICES.txt`.
