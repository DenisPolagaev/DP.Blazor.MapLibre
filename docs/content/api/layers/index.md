# Layers overview

DP.Blazor.MapLibre provides typed C# models for [MapLibre style layers](https://maplibre.org/maplibre-style-spec/layers/).

| Spec type | C# class | Typical source |
|-----------|----------|----------------|
| `background` | `BackgroundLayer` | — |
| `fill` | `FillLayer` | `GeoJsonSource`, `VectorTileSource` |
| `line` | `LineLayer` | `GeoJsonSource`, `VectorTileSource` |
| `circle` | `CircleLayer` | `GeoJsonSource`, `VectorTileSource` |
| `symbol` | `SymbolLayer` | `GeoJsonSource`, `VectorTileSource` |
| `raster` | `RasterLayer` | `RasterTileSource` |
| `heatmap` | `HeatMapLayer` | `GeoJsonSource`, `VectorTileSource` |
| `hillshade` | `HillShadeLayer` | `RasterDEMTileSource` |
| `fill-extrusion` | `FillExtrusionLayer` | `GeoJsonSource`, `VectorTileSource` |
| `color-relief` | `ColorReliefLayer` | `RasterDEMTileSource` |

Add layers with `AddLayer(Layer layer)` after adding the required source.

## Custom layers

Runtime WebGL custom layers use `AddCustomLayer(string layerId, CustomLayerOptions options, CustomLayerHandler handler)` — they are **not** part of the `Layer` JSON polymorphic hierarchy.

See [fill layer](fill.md), [line layer](line.md), and the [examples](../../examples/line-layer.md).
