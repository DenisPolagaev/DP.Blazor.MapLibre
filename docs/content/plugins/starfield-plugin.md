# Starfield plugin

The **Starfield plugin** adds an SVG starfield and a subtle atmospheric glow behind a MapLibre **globe** map. It wraps [maplibre-gl-starfield](https://github.com/markmclaren/maplibre-gl-starfield) (Mark McLaren, MIT).

The plugin project lives at `src/plugins/DP.Blazor.MapLibre.StarfieldPlugin`.

## Installation

```shell
dotnet add package DP.Blazor.MapLibre.StarfieldPlugin
```

Or a project reference:

```shell
dotnet add reference ../../src/plugins/DP.Blazor.MapLibre.StarfieldPlugin/DP.Blazor.MapLibre.StarfieldPlugin.csproj
```

## Register the plugin

Use **globe** projection and a dark host background so stars show around the Earth. The plugin creates backdrop layers behind the map container unless you pass existing element ids.

```csharp
@using DP.Blazor.MapLibre.StarfieldPlugin
@using DP.Blazor.MapLibre.Models.Style

<MapLibre @ref="_map" Options="_options" OnStyleLoad="OnStyleLoad" />

@code {
    private MapLibre _map = new();
    private readonly StarfieldPlugin _starfield = new();

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await _map.RegisterPlugin(_starfield);
        }
    }

    private async Task OnStyleLoad(EventArgs _)
    {
        await _map.SetProjection(new ProjectionSpecification { Type = "globe" });

        if (!_starfield.IsInitialized)
        {
            return;
        }

        await _starfield.AttachAsync(new StarfieldOptions
        {
            StarCount = 1000,
            GlowIntensity = 1.0,
        });
    }
}
```

## API overview

| Method | Description |
| --- | --- |
| `AttachAsync(options?)` | Creates (or uses) backdrop layers and starts parallax / glow updates. |
| `UpdateConfigAsync(options)` | Updates glow intensity, colors, or star count on an attached backdrop. |
| `DetachAsync()` | Stops listeners and removes plugin-owned DOM layers. |

## Options

`StarfieldOptions`:

| Property | Description |
| --- | --- |
| `StarCount` | Number of SVG stars. |
| `GlowIntensity` | Glow opacity multiplier (`0`–`1`). |
| `GlowColors` | Optional `Inner` / `Middle` / `Outer` / `Fade` rgba stops. |
| `StarfieldContainerId` / `GlowContainerId` | Optional existing DOM ids (both required together). When omitted, layers are auto-created. |

## Notes

- Intended for **globe** view aesthetics — stars are randomized, not an accurate sky catalogue.
- Performance: stars are drawn on a **Canvas** (typed-array parallax + one paint per frame), glow SVG geometry is updated in place (no per-frame DOM rebuild), updates are **rAF-coalesced**, and the backdrop **auto-pauses** when the globe disk covers the viewport (typical mid/high zoom) so pan/zoom stay smooth.
- Upstream glow sizing uses MapLibre transform internals; keep MapLibre GL JS current with the core package.
- Third-party notice for the vendored script is packed as `THIRD-PARTY-NOTICES.txt`.

## Live example

See the [Starfield example](./examples/starfield.md).
