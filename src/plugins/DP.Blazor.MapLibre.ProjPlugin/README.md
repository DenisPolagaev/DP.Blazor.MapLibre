# DP.Blazor.MapLibre.ProjPlugin

**Any-projection** plugin for [DP.Blazor.MapLibre](https://github.com/DenisPolagaev/DP.Blazor.MapLibre): render a map in any coordinate reference system (CRS) with [proj-wasm](https://www.npmjs.com/package/proj-wasm) (PROJ 9 compiled to WebAssembly).

The plugin runs a self-contained reprojection pipeline for GeoJSON and vector tiles. The PROJ maths runs in `proj-wasm`'s own module workers; the per-tile work around it (decode, densify, clip, simplify, encode) runs on the map's main thread. It does not use `maplibre-proj` or `backproj`.

The vendored runtime lives under `_content/ProjPlugin/vendor` and is about 15.0 MB on disk (14.3 MiB):

| Package | Size on disk | Notes |
|---|---|---|
| `proj-wasm` | 14.2 MB | includes `proj.db` (10.1 MB) and the PROJ module `proj-emscripten.wasm` (3.5 MB) |
| `ffi-wasm` | 0.1 MB | platform, dispatch, worker and WASM helpers that `proj-wasm` imports |
| `@maplibre/mlt` | 0.4 MB | MapLibre Tile decoder and encoder used by the vector tile pipeline |
| everything else | about 0.3 MB | JavaScript helpers |

## Install

```bash
dotnet add package DP.Blazor.MapLibre.ProjPlugin
```

The core `DP.Blazor.MapLibre` package is referenced automatically.

## Requirements

- The map **must** be created with `RenderWorldCopies = false`. The fake coordinate space does not tile.
- Register the plugin with `MapLibre.RegisterPlugin` before calling its members.
- Declare the import map entries from `GetImportMapAsync()` in a static `<script type="importmap">` before the Blazor framework script (see [Import map](#import-map)). This is required for Firefox and Safari and recommended for every browser.
- A style this plugin already reprojected is **not** a valid input for another apply: its sources point at the plugin's own `reproj-…://` protocol. Load the style again first; `ApplyCurrentStyleProjectionAsync` throws with the offending source ids instead of silently dropping them.

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
    "ffi-wasm": "_content/ProjPlugin/vendor/ffi-wasm/dist/ffi-wasm.mjs"
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

- **The input format is declared per source.** Our archives are MapLibre Tiles (`encoding: "mlt"`); a third-party style keeps its MVT tiles (`encoding: "mvt"`, the OpenFreeMap basemap the Map API serves). The handler reads either and always answers with MLT, so the rewritten source is forced to `encoding: "mlt"`.
- **Only the first tile URL template of a vector source is used.** A warning is logged for a source with several templates.
- **Input tiles per output tile are capped** by `MaxInputTiles` (default 16). The same budget decides the input zoom, so raising it sharpens the edges of a projection at the cost of more requests; when a tile still needs more, the output tile is incomplete and a warning names the source. The input tiles are fetched concurrently.
- **Sources that cannot be reprojected are removed with their layers**, and a warning names each one. These are raster sources, vector sources without http(s) tile URLs, and sources that the plugin already reprojected.
- **HTTP 204 and 404 for an input tile** mean "no data here" and are treated as empty. Other HTTP errors fail the output tile, so MapLibre emits an error event. Failed loads are not cached.
- **`TileBoundaries`** is reserved. The value is sent to the pipeline, but debug layers are not implemented yet.
- **Projections** are computed per CRS and area of use and cached process-wide. `ReleaseProjectionResourcesAsync` clears that cache.
- **Axis order is normalised.** `proj_create_crs_to_crs` honours the CRS's declared axes, and EPSG:3035/EPSG:3034 for example are (northing, easting). The pipeline reads the axes once per CRS and works in (easting, northing), so such a CRS is not drawn transposed. Oblique polar axes are left as they are.
- **One operation per CRS, both directions.** The forward transform is `PJ_FWD` and the inverse is the same pipeline in `PJ_INV`; a separately built reverse operation may pick a different transformation (EPSG:5070 sent it into a datum grid that this runtime cannot load).
- **PROJ network lookups are off.** The runtime ships `proj.db` but no datum grids, and a lookup that waits for a grid download blocks the browser; PROJ falls back to a ballpark/Helmert transformation instead.
- **The sampling area comes from the CRS.** When the caller gives no area of use, the plugin reads `proj_get_area_of_use` and samples that — feeding a regional CRS the whole world is what made some datum transformations misbehave.
- Geometry is densified in real space, clipped per output tile and simplified (Douglas–Peucker, sub-pixel) before encoding.

## Options

- `MaxInputTiles` (`ProjReprojectOptions`, `ProjMapProjectionOptions`, `ProjSourceReprojectOptions`): integer, at least 1, default 16.
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
