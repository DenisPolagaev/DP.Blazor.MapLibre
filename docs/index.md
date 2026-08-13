# DP.Blazor.MapLibre

C# / Blazor wrapper around [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/). Drop a typed `<MapLibre>` component into a Blazor app, call map APIs from C#, and keep optional features in separate plugin packages.

Live site: [denispolagaev.github.io/DP.Blazor.MapLibre](https://denispolagaev.github.io/DP.Blazor.MapLibre/) · NuGet: [DP.Blazor.MapLibre](https://www.nuget.org/packages/DP.Blazor.MapLibre)

## What it is

MapLibre GL JS renders interactive maps with WebGL (vector tiles, custom styles, terrain, globe, and more). **DP.Blazor.MapLibre** bridges that stack to Blazor:

- Declarative `<MapLibre>` component with `Options`, size, and load callbacks
- Strongly typed models for sources, layers, camera, controls, markers, and popups
- Async C# methods that mirror MapLibre GL JS (style, terrain, GeoJSON, query, custom layers, …)
- `NativeMap` escape hatch — raw `maplibregl.Map` JS handle when a method is not wrapped yet
- Plugin system (`IMapLibrePlugin`) so draw, compare, minimap, and similar stay optional NuGet packages

The project **started as a fork** of [Yet-another-solution/Blazor.MapLibre](https://github.com/Yet-another-solution/Blazor.MapLibre) (`Community.Blazor.MapLibre`) and is maintained independently under the **DP.Blazor.MapLibre** name and package identity.

## Requirements

| Item | Detail |
| --- | --- |
| .NET | Library and plugins target **.NET 8 / 9 / 10**. Examples and this DocFX site use **.NET 10**. |
| Browser | **WebGL2** required (MapLibre GL JS 6 dropped the WebGL1 path). |
| Bundled MapLibre | **6.2.0** as ESM (`maplibre-gl.mjs` + worker), loaded by the component via `prepareMapLibreGl`. |

Do **not** add a classic `<script src="…/maplibre-gl.js">` tag — the component owns JS loading.

## Install

```bash
dotnet add package DP.Blazor.MapLibre
```

Optional plugins (separate packages):

```bash
dotnet add package DP.Blazor.MapLibre.TerraDrawPlugin
dotnet add package DP.Blazor.MapLibre.ComparePlugin
dotnet add package DP.Blazor.MapLibre.MinimapPlugin
dotnet add package DP.Blazor.MapLibre.FrameratePlugin
dotnet add package DP.Blazor.MapLibre.GeoGridPlugin
dotnet add package DP.Blazor.MapLibre.StarfieldPlugin
```

Add MapLibre CSS in your app head (or layout):

```html
<link href="_content/DP.Blazor.MapLibre/maplibre-gl/dist/maplibre-gl.css" rel="stylesheet" />
```

## Quick start

Minimal map:

```razor
<MapLibre />
```

With options and a load callback:

```razor
<MapLibre Options="_mapOptions"
          Width="100%"
          Height="500px"
          OnLoad="OnMapLoad" />

@code {
    private readonly MapOptions _mapOptions = new()
    {
        // Default style is MapStyles.OpenStreetMap (OSM raster).
        // Center = new LngLat(37.618423, 55.751244),
        // Zoom = 10,
    };

    private Task OnMapLoad()
    {
        // Map is ready — add sources, layers, listeners, plugins, …
        return Task.CompletedTask;
    }
}
```

`MapOptions.Style` defaults to `MapStyles.OpenStreetMap`. Override it for vector basemaps or your own style URL/JSON.

## What you can build

| Area | Examples in this docs site |
| --- | --- |
| Data & layers | GeoJSON, circle / line / fill / symbol / heatmap / fill-extrusion, raster styling |
| Terrain & 3D | Hillshade, color relief, sky/fog, globe and atmosphere |
| Interaction | Markers, popups, map events, listeners, fit bounds |
| Advanced | Multiple maps, GeoJSON diff updates, global state visibility, MLT vector tiles |

Browse [Examples](content/examples/load-geojson.md) in the sidebar and [Map API methods](content/api/map/methods.md) for the C# surface (terrain, style diff, custom layers, transform request, time control, and more).

## Plugins

Core stays lean; specialized UI and tools live in plugins that implement `IMapLibrePlugin` and register on the map.

| Plugin | Package |
| --- | --- |
| Terra Draw | `DP.Blazor.MapLibre.TerraDrawPlugin` |
| Map Compare | `DP.Blazor.MapLibre.ComparePlugin` |
| Minimap | `DP.Blazor.MapLibre.MinimapPlugin` |
| Frame rate | `DP.Blazor.MapLibre.FrameratePlugin` |
| Geo grid | `DP.Blazor.MapLibre.GeoGridPlugin` |
| Starfield | `DP.Blazor.MapLibre.StarfieldPlugin` |

Details, lifecycle notes, and how to write your own: [Plugins](content/plugins/index.md).

## Documentation map

| Section | Start here if you want to… |
| --- | --- |
| [Introduction](content/getting-started/introduction.md) | Walk through first install and mental model |
| [Key concepts](content/getting-started/key-concepts.md) | Understand wrapper, component, layers, plugins |
| [Examples](content/examples/load-geojson.md) | Copy a working snippet for a concrete feature |
| [API](content/api/index.md) | Look up map methods, layers, events, handlers |
| [Plugins](content/plugins/index.md) | Add or build map extensions |
| [Contributing](content/getting-started/contributing.md) | Build and preview this DocFX site locally |

## License

Released under the [Unlicense](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/blob/main/UNLICENSE). MapLibre GL JS is BSD-3-Clause. Use at your own risk; provided as-is without warranty.
