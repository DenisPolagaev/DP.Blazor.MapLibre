# Minimap plugin

The **Minimap plugin** adds an overview map with a draggable viewport rectangle. It wraps [mapboxgl-minimap](https://github.com/aesqe/mapboxgl-minimap) as an optional plugin for MapLibre GL JS.

The plugin project lives at `src/plugins/DP.Blazor.MapLibre.MinimapPlugin`.

## Installation

```shell
dotnet add reference ../../src/plugins/DP.Blazor.MapLibre.MinimapPlugin/DP.Blazor.MapLibre.MinimapPlugin.csproj
```

## Register the plugin

```csharp
@using DP.Blazor.MapLibre.MinimapPlugin
@using DP.Blazor.MapLibre.Models.Control

<MapLibre @ref="_map" Options="_options" OnLoad="OnMapLoad" />

@code {
    private MapLibre _map = new();
    private MinimapPlugin _minimap = new();

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await _map.RegisterPlugin(_minimap);
        }
    }

    private async Task OnMapLoad(EventArgs _)
    {
        await _minimap.AddMinimapControlAsync(new MinimapControlOptions
        {
            Width = "220px",
            Height = "140px",
            Style = ExampleMapStyles.OpenStreetMap,
        }, ControlPosition.BottomRight);
    }
}
```

## API overview

| Method | Description |
| --- | --- |
| `AddMinimapControlAsync(options?, position?)` | Adds the minimap control to the map. |
| `RemoveMinimapControlAsync()` | Removes the minimap control. |

## Options

`MinimapControlOptions` mirrors the upstream control options:

| Property | Description |
| --- | --- |
| `Id` | DOM id of the minimap container. |
| `Width`, `Height` | CSS dimensions (for example `320px`, `180px`). |
| `Style` | Map style for the minimap. |
| `Center`, `Zoom` | Initial view of the minimap. |
| `MaxBounds`, `Bounds` | Optional bounds constraints. |
| `ZoomLevels` | Parent/minimap zoom mapping rules (`MinimapZoomLevel` or `[parent, minimap, target]` arrays). |
| `LineColor`, `LineWidth`, `LineOpacity` | Viewport rectangle outline. |
| `FillColor`, `FillOpacity` | Viewport rectangle fill. |
| `DragPan`, `ScrollZoom`, `BoxZoom`, `DragRotate`, `Keyboard`, `DoubleClickZoom`, `TouchZoomRotate` | Minimap interaction toggles. |

Dispose the plugin when the page is torn down:

```csharp
public async ValueTask DisposeAsync() => await _minimap.DisposeAsync();
```

## Live example

See the [Minimap example](./examples/minimap.md).
