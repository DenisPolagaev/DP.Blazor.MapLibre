# DP.Blazor.MapLibre.StarfieldPlugin

SVG **starfield** and atmospheric glow backdrop plugin for [DP.Blazor.MapLibre](https://github.com/DenisPolagaev/DP.Blazor.MapLibre). It is a DP fork of the idea behind [maplibre-gl-starfield](https://github.com/markmclaren/maplibre-gl-starfield).

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

To use the defaults, call `await _starfield.AttachAsync();` without arguments.

## Attach, detach and dispose

- **`AttachAsync(StarfieldOptions? options = null)`** creates two layers behind the map and starts the starfield and glow. Calling it again replaces the current backdrop. Calling it without arguments uses the upstream defaults.
- **`UpdateConfigAsync(StarfieldOptions options)`** changes glow and star settings on an attached backdrop. It does nothing when the plugin is not attached.
- **`DetachAsync()`** stops the animation and listeners, removes the layers it created and restores the styles that attach changed (see below).
- **Disposing the plugin** (`DisposeAsync`) does the same as detach and then releases the JavaScript module.

Attach changes the following styles. Detach and dispose restore the values that were in place before the first attach:

- the host element of the map: `position: relative` when it was `static`, plus the class `maplibre-starfield-host` (removed again);
- the map container: `position: relative` when it was `static`, `z-index: 3` when no z-index was set, and a transparent background;
- the map canvas and its canvas container: transparent background;
- the starfield and glow containers, when you pass your own container ids.

If attach fails (for example, a container id is not found in the DOM), the exception is thrown, nothing it changed is left behind, and the plugin stays initialized so you can try again.

Several maps can each have their own plugin instance. Each map keeps its own backdrop state.

## Options (`StarfieldOptions`)

| Property | Default | Description |
| --- | --- | --- |
| `StarCount` | `1500` | Number of stars. |
| `GlowIntensity` | `1.0` | Glow opacity multiplier (0 to 1). |
| `GlowExtent` | `1.12` | Outer glow disk as a multiple of the globe radius. |
| `CoronaExtent` | `1.02` | Inner white corona ring as a multiple of the globe radius (clamped to at least `1.005`). |
| `StarfieldContainerId` | none | DOM id of an existing star layer. Use together with `GlowContainerId`. |
| `GlowContainerId` | none | DOM id of an existing glow layer. Use together with `StarfieldContainerId`. |
| `GlowColors` | built-in palette | `StarfieldGlowColors` with `Inner`, `Middle`, `Outer` and `Fade` CSS colors. |

When you omit one of the container ids, the plugin creates both layers behind the map.

## Documentation

- [Starfield plugin guide](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/blob/main/docs/content/plugins/starfield-plugin.md)
- [Documentation site](https://denispolagaev.github.io/DP.Blazor.MapLibre/)

## License

Targets .NET 8, 9, 10 and 11. Released under the [Unlicense](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/blob/main/UNLICENSE).

The JavaScript under `wwwroot/` includes code derived from the maplibre-gl-starfield idea. See [THIRD-PARTY-NOTICES.txt](THIRD-PARTY-NOTICES.txt).
