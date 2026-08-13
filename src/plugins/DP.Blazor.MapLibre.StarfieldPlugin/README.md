# DP.Blazor.MapLibre.StarfieldPlugin

Blazor wrapper for [markmclaren/maplibre-gl-starfield](https://github.com/markmclaren/maplibre-gl-starfield): SVG starfield + atmospheric glow behind a MapLibre **globe** map.

```bash
dotnet add package DP.Blazor.MapLibre.StarfieldPlugin
```

```csharp
await _map.RegisterPlugin(_starfield);
await _map.SetProjection(new ProjectionSpecification { Type = "globe" });
await _starfield.AttachAsync(new StarfieldOptions
{
    StarCount = 1000,
    GlowIntensity = 1.0,
});
```

See the MapLibre docs site: **Plugins → Starfield**.
