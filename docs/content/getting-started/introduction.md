# Introduction

**DP.Blazor.MapLibre** lets you embed [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) maps in Blazor with C# types and component parameters instead of hand-written JS interop for every call.

This page is the short path from zero to a running map. For product shape and architecture, see [Key concepts](./key-concepts.md). For a fuller landing page (features, plugins, docs map), see [Overview](../../index.md).

## 1. Add the package

```bash
dotnet add package DP.Blazor.MapLibre
```

Targets: **.NET 8, 9, and 10**. Bundled engine: **MapLibre GL JS 6.2** (ESM + worker). Browsers need **WebGL2**.

## 2. Include CSS

In `App.razor`, `_Host.cshtml`, or your layout `<head>`:

```html
<link href="_content/DP.Blazor.MapLibre/maplibre-gl/dist/maplibre-gl.css" rel="stylesheet" />
```

The JS module is loaded by the component (`prepareMapLibreGl`). Do not add a classic `<script src="…/maplibre-gl.js">` tag.

## 3. Render the component

```razor
@using DP.Blazor.MapLibre
@using DP.Blazor.MapLibre.Models

<MapLibre Options="_options"
          Height="480px"
          OnLoad="OnMapReady" />

@code {
    private readonly MapOptions _options = new()
    {
        // Style defaults to MapStyles.OpenStreetMap
        Center = new LngLat(37.618423, 55.751244),
        Zoom = 9,
    };

    private Task OnMapReady() => Task.CompletedTask;
}
```

Use `@ref` when you call map methods after load:

```razor
<MapLibre @ref="_map" Options="_options" OnLoad="OnMapReady" Height="480px" />

@code {
    private MapLibre _map = default!;
    private readonly MapOptions _options = new();

    private async Task OnMapReady()
    {
        // await _map.AddSource(...);
        // await _map.AddLayer(...);
    }
}
```

## 4. Next steps

| Goal | Where |
| --- | --- |
| Mental model (wrapper, layers, plugins) | [Key concepts](./key-concepts.md) |
| Copy-paste feature samples | [Examples](../examples/load-geojson.md) |
| Method and type reference | [API](../api/index.md) · [Map methods](../api/map/methods.md) |
| Draw, compare, minimap, … | [Plugins](../plugins/index.md) |
| MLT tile sources | [MLT vector tiles](./mlt-vector-tiles.md) |
| Run this docs site locally | [Contributing](./contributing.md) |

Need an unwrapped MapLibre GL JS call? Use `NativeMap` on the component instance and invoke JS against the raw `maplibregl.Map` object.
