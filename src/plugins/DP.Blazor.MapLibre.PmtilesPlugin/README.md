# DP.Blazor.MapLibre.PmtilesPlugin

**PMTiles** protocol plugin for [DP.Blazor.MapLibre](https://github.com/DenisPolagaev/DP.Blazor.MapLibre), registering the `pmtiles://` protocol on MapLibre GL JS using [protomaps/PMTiles](https://github.com/protomaps/PMTiles).

Once registered, any source whose URL starts with `pmtiles://` (for example `pmtiles://https://host/archive.pmtiles`) is served over HTTP Range requests.

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

## Shared protocol and lifetime

The `pmtiles` protocol is registered on `maplibregl` for the whole page, not per map:

- Registration is memoized: several plugin instances (or several maps) initializing at the same time register the protocol once.
- The plugin keeps a reference count of the instances that initialized successfully. Disposing an instance releases its reference.
- The protocol is removed with `maplibregl.removeProtocol('pmtiles')` only when the last reference is released. While another initialized instance is alive, `pmtiles://` sources on other maps keep working.
- Once the protocol is removed, a new initialization registers it again.

Keep at least one `PmtilesPlugin` instance alive for as long as any map on the page uses `pmtiles://` sources.

## Error handling

Tile requests return an empty tile only when the archive answers HTTP `404` or `204` (no tile at that position). Every other failure is rethrown, so MapLibre emits an `error` event instead of showing blank tiles. This covers HTTP 5xx responses, network failures, invalid archives, TileJSON failures and aborted requests.

Limitation: the vendored PMTiles library does not separate an archive that is missing (HTTP 404 on the header) from a missing tile, so a `404` for the archive also produces empty tiles. Check the archive URL when a source renders blank.

## Documentation

- [Documentation site](https://denispolagaev.github.io/DP.Blazor.MapLibre/)
- [Plugin sources](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/tree/main/src/plugins/DP.Blazor.MapLibre.PmtilesPlugin)

## Vendored PMTiles library

`wwwroot/pmtiles/pmtiles.mjs` is a single-file ESM bundle of [`pmtiles`](https://github.com/protomaps/PMTiles) **4.5.0** (fflate inlined, esbuild). The version is recorded in the bundle banner.

- Rebuild after bumping the pin: `node scripts/vendor-pmtiles.mjs` (optionally `node scripts/vendor-pmtiles.mjs <version>`), then update `THIRD-PARTY-NOTICES.txt` and re-run `../DP.Blazor.MapLibre.ProjPlugin/scripts/vendor-proj.mjs`, which copies this exact file into the ProjPlugin vendor tree.
- 4.4.0+ understands `TileType.Mlt` (`tileTypeExt` → `.mlt`) and treats an empty MLT tile like an empty MVT tile, so `pmtiles://` archives holding MapLibre Tiles no longer fall into the raster branch. MapLibre GL JS still decides how to decode a tile from the style source: an MLT source needs `"encoding": "mlt"` (`mvt` is the default).

## License

Targets .NET 8, 9, 10 and 11. The plugin code is released under the [Unlicense](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/blob/main/UNLICENSE).

The vendored `wwwroot/pmtiles/pmtiles.mjs` is third-party code under the BSD-3-Clause license (Protomaps LLC). See [THIRD-PARTY-NOTICES.txt](THIRD-PARTY-NOTICES.txt).
