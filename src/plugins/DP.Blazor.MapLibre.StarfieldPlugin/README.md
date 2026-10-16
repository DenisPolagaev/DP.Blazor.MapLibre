# DP.Blazor.MapLibre.StarfieldPlugin

SVG **starfield** and atmospheric glow backdrop plugin for [DP.Blazor.MapLibre](https://github.com/DenisPolagaev/DP.Blazor.MapLibre), wrapping [maplibre-gl-starfield](https://github.com/markmclaren/maplibre-gl-starfield).

Intended for **globe** view aesthetics.

## Install

```bash
dotnet add package DP.Blazor.MapLibre.StarfieldPlugin
```

The core `DP.Blazor.MapLibre` package is referenced automatically.

## Quick start

Use the **globe** projection and a dark host background so stars show around the Earth:

```razor
@using DP.Blazor.MapLibre.StarfieldPlugin
@using DP.Blazor.MapLibre.Models.Style

<MapLibre @ref="_map" Options="_options" OnStyleLoad="OnStyleLoad" />

@code {
    private MapLibre _map = new();
    private readonly StarfieldPlugin _starfield = new();

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
            await _map.RegisterPlugin(_starfield);
    }

    private async Task OnStyleLoad(EventArgs _)
    {
        await _map.SetProjection(new ProjectionSpecification { Type = "globe" });

        if (_starfield.IsInitialized)
            await _starfield.AttachAsync(new StarfieldOptions { StarCount = 1000 });
    }
}
```

## Documentation

- [Starfield plugin guide](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/blob/main/docs/content/plugins/starfield-plugin.md)
- [Documentation site](https://denispolagaev.github.io/DP.Blazor.MapLibre/)

## License

Targets .NET 8, 9, 10 and 11. Released under the [Unlicense](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/blob/main/UNLICENSE).
