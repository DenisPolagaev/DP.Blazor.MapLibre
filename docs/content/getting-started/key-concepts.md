# Key concepts

**DP.Blazor.MapLibre** is a Blazor component library: a typed C# wrapper around [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/). You configure maps with familiar Blazor parameters and call map APIs from .NET instead of wiring every JS interop call by hand.

## MapLibre GL JS wrapper

Under the hood the library talks to MapLibre GL JS, which is:

- An open-source JavaScript library for interactive, customizable maps
- Capable of rendering vector tiles and custom styling
- Highly performant with WebGL2 rendering
- A community-maintained fork of Mapbox GL JS

The wrapper serializes options and style objects, loads the ESM bundle + worker, and exposes async C# methods that map to the JS API. When a call is not wrapped yet, use `NativeMap` for a raw `maplibregl.Map` handle.

## Blazor component

The main entry point is the `MapLibre` component:

- Encapsulates map lifetime (init, style load, dispose) in one Razor component
- Provides strong typing and IntelliSense for sources, layers, camera, and related models
- Integrates with Blazor rendering and `IAsyncDisposable`
- Supports declarative setup via parameters (`Options`, `Width` / `Height`, `OnLoad`, `OnStyleLoad`, …)

## Default map style

`MapOptions.Style` defaults to `MapStyles.OpenStreetMap` (OSM raster tiles). Override it when you need vector styles or custom tile servers.

See [Map API methods](../api/map/methods.md) for wrappers such as terrain, GeoJSON diff, time control, and custom layers.

## Layers and events

Typed layer models mirror the [MapLibre style spec](https://maplibre.org/maplibre-style-spec/layers/). See [Layers overview](../api/layers/index.md) and [Events overview](../api/events/index.md).

## Plugin system

Optional features ship as separate packages that implement `IMapLibrePlugin` (or inherit `MapLibrePluginBase`):

- Modular extension without bloating the core NuGet package
- Standard register / attach / detach / dispose lifecycle on the map
- Clean split between core library and draw, compare, minimap, and similar tools

See [Plugins](../plugins/index.md), [Creating a plugin](../plugins/create-a-plugin.md), and the built-in packages (Terra Draw, Map Compare, Minimap, Frame rate, Geo grid, Starfield, plus the Mapbox GL Draw reference in the examples project).
