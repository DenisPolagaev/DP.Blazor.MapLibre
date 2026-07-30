# Plugins

`DP.Blazor.MapLibre` extends the core map through optional **plugins** — separate Razor Class Library projects that implement `IMapLibrePlugin` and register with the `MapLibre` component.

Plugins keep the core library free of optional dependencies while still giving you a typed C# API and isolated JavaScript modules.

## Create your own

Start with [Creating a plugin](./create-a-plugin.md) for the full walkthrough (RCL setup, JavaScript interop, registration, and disposal).

For architecture context, see [Key concepts — Plugin system](../getting-started/key-concepts.md#plugin-system).

## Available plugins

| Plugin | Package / project | Description |
| --- | --- | --- |
| [Terra Draw](./terra-draw-plugin.md) | `DP.Blazor.MapLibre.TerraDrawPlugin` | Draw, measure, and Valhalla toolbars via [maplibre-gl-terradraw](https://github.com/watergis/maplibre-gl-terradraw) |
| [Map Compare](./map-compare-plugin.md) | `DP.Blazor.MapLibre.ComparePlugin` | Swipe slider to compare two maps with [maplibre-gl-compare](https://github.com/maplibre/maplibre-gl-compare) |
| [Minimap](./minimap-plugin.md) | `DP.Blazor.MapLibre.MinimapPlugin` | Overview map with viewport rectangle ([mapboxgl-minimap](https://github.com/aesqe/mapboxgl-minimap)) |
| [Frame rate](./framerate-plugin.md) | `DP.Blazor.MapLibre.FrameratePlugin` | Live FPS overlay while the map moves ([mapbox-gl-framerate](https://github.com/mapbox/mapbox-gl-framerate)) |
| [Geo grid](./geogrid-plugin.md) | `DP.Blazor.MapLibre.GeoGridPlugin` | Geographic graticule with coordinate labels ([geogrid-maplibre-gl](https://github.com/falseinput/geogrid-maplibre-gl)) |
| [Mapbox GL Draw](./mapbox-gl-draw-plugin.md) | `DP.Blazor.MapLibre.Examples.MapboxGlPlugin` | Reference plugin using [Mapbox GL Draw](https://github.com/mapbox/mapbox-gl-draw) (examples project) |

## Live examples

Interactive demos for each plugin are under [Plugin examples](./examples/index.md).
