# Projection plugin

The **Projection plugin** renders a `MapLibre` map in any coordinate reference system. It is built directly on [proj-wasm](https://www.npmjs.com/package/proj-wasm) (PROJ 9 compiled to WebAssembly) and runs a self-contained, **main-thread** reprojection pipeline for GeoJSON and vector tiles — no Web Workers, no `maplibre-proj`/`backproj`.

The plugin project lives at `src/plugins/DP.Blazor.MapLibre.ProjPlugin`. The whole runtime dependency graph is vendored under `wwwroot/vendor` (~28 MB of WebAssembly plus `proj.db`) and regenerated with `node scripts/vendor-proj.mjs`.

## Installation

```shell
dotnet add reference ../../src/plugins/DP.Blazor.MapLibre.ProjPlugin/DP.Blazor.MapLibre.ProjPlugin.csproj
```

## Requirements

- MapLibre GL JS must be loaded (the core `MapLibre` component handles this).
- The map **must** be created with `RenderWorldCopies = false` (see `MapOptions.RenderWorldCopies`): the fake coordinate space does not tile.
- The plugin forces `projection: { type: "mercator" }` on the reprojected style.
- Geographic CRS (for example `EPSG:4326`) and interrupted projections (for example Goode Homolosine) are not supported.

## Register the plugin

```csharp
@using DP.Blazor.MapLibre.ProjPlugin

<MapLibre @ref="_map" Options="_options" OnLoad="OnMapLoad" />

@code {
    private MapLibre _map = new();
    private ProjPlugin _proj = new();

    private readonly MapOptions _options = new()
    {
        Center = new LngLat(0, 0),
        Zoom = 1,
        RenderWorldCopies = false,
    };

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await _map.RegisterPlugin(_proj);
        }
    }

    private async Task OnMapLoad(EventArgs _)
    {
        // Reproject and apply in one call (setStyle + setMaxBounds + fitBounds).
        var result = await _proj.ApplyReprojectionAsync(new ProjReprojectOptions
        {
            Style = _yourStyleJsonObject,
            Crs = "ESRI:54030", // Robinson
        });

        // Keep the transformer id to skip rebuilding on later reprojections.
        _transformerId = result.TransformerId;
    }
}
```

## Reproject without applying

`ReprojectStyleAsync` returns the rewritten style, the fake bounds and the transformer id without touching the map:

```csharp
var result = await _proj.ReprojectStyleAsync(new ProjReprojectOptions
{
    Style = style,
    Crs = "EPSG:5070", // NAD83 / Conus Albers
    TileBoundaries = true,
});

await _map.SetStyle(result.Style);
await _map.FitBounds(result.Bounds);
if (result.MaxBounds is not null)
{
    // Regional CRS expose a padded area of use.
}
```

## CRS formats

`Crs` accepts anything PROJ understands: `EPSG:5070`, `EPSG:2249`, `EPSG:32632`, `ESRI:54030`, `ESRI:54009`, a WKT/WKT2/ESRI WKT string, PROJJSON or a PROJ string.

## Reusing transformers

Building a transformer samples the projection to compute scale factors. Pass the previously returned id back to skip the rebuild:

```csharp
var result = await _proj.ReprojectStyleAsync(new ProjReprojectOptions
{
    Style = newStyle,
    Crs = "EPSG:5070",
    TransformerId = _transformerId, // reuse
});
```

Call `ReleaseTransformerAsync(id)` to drop a handle, or `ShutdownTileWorkersAsync()` to terminate the shared worker pool (transformers become invalid; the next reprojection recreates the pool).

## Coordinates

MapLibre's collision detection and `queryRenderedFeatures` operate in the fake coordinate space. Convert between real and fake coordinates:

```csharp
// queryRenderedFeatures returns fake lon/lat -> recover the real ones
var real = await _proj.InverseTransformCoordsAsync(fakeCoords, _transformerId);

// position a marker: real lon/lat -> fake
var fake = await _proj.TransformPointAsync(new LngLat(-77.0, 38.9), _transformerId);
```

## Vector tiles

Vector tile sources in the style are rewritten to a custom protocol handler automatically. The handler fetches the input Mercator tiles, reprojects them through a worker pool and returns reprojected PBF data. No extra configuration is required, but the vendored `@wcohen/wasmts` WebAssembly must be reachable (it is part of the package).

## Browser support and import maps

The vendored packages use bare ES module specifiers (`backproj`, `proj-wasm`, ...). On first use the plugin registers a page import map that resolves them to `_content/ProjPlugin/vendor/...`.

- Chromium-based browsers (Edge/Chrome 132+) allow the dynamically added import map and need no extra setup.
- Firefox/Safari hosts should copy the entries from `GetImportMapAsync()` into a static `<script type="importmap">` **before** Blazor starts. The host can also provide its own import map containing a `backproj` entry, in which case the plugin leaves it untouched.

## Diagnostics

```csharp
var manifest = await _proj.GetVendorManifestAsync(); // package versions
var importMap = await _proj.GetImportMapAsync();      // resolved specifier -> _content URL
```

## Known limitations

- **Labels/symbols**: MapLibre's collision detection assumes Mercator, so text placement is slightly wrong in distorted areas.
- **`queryRenderedFeatures`** returns fake lon/lat — use `InverseTransformCoordsAsync`.
- **Dynamic sources**: `ReprojectStyleAsync` reprojects the sources present in the style you pass. Sources added later (for example by the layer services) are not reprojected automatically.
- The vendored package tree is updated manually via `scripts/vendor-proj.mjs`; `0.0.x`/alpha upstream versions may change their module layout.

## Related topics

- [Projection example](./examples/proj.md) — live demo
- [Create a plugin](./create-a-plugin.md) — build your own plugin from scratch
- [Key concepts](../getting-started/key-concepts.md#plugin-system) — plugin architecture overview
