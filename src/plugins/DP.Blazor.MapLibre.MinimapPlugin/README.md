# DP.Blazor.MapLibre.MinimapPlugin

Overview **minimap** control with a draggable viewport rectangle for [DP.Blazor.MapLibre](https://github.com/DenisPolagaev/DP.Blazor.MapLibre).
The control is adapted from [mapboxgl-minimap](https://github.com/aesqe/mapboxgl-minimap) (MIT) for MapLibre GL JS;
see [THIRD-PARTY-NOTICES.txt](./THIRD-PARTY-NOTICES.txt).

## Install

```bash
dotnet add package DP.Blazor.MapLibre.MinimapPlugin
```

The core `DP.Blazor.MapLibre` package is referenced automatically.

## Quick start

```razor
@using DP.Blazor.MapLibre.MinimapPlugin
@using DP.Blazor.MapLibre.Models.Control

<MapLibre @ref="_map" OnLoad="OnMapLoad" />

@code {
    private MapLibre _map = new();
    private readonly MinimapPlugin _minimap = new();

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
            await _map.RegisterPlugin(_minimap);
    }

    private async Task OnMapLoad(EventArgs _) =>
        await _minimap.AddMinimapControlAsync(
            new MinimapControlOptions { Width = "220px", Height = "140px" },
            ControlPosition.BottomRight);
}
```

## API

| Method | Description |
| --- | --- |
| `AddMinimapControlAsync(options?, position?)` | Adds the control. Replaces a control this plugin added earlier. |
| `RemoveMinimapControlAsync()` | Removes the control. Does nothing when no control was added. |

## Options

`MinimapControlOptions` maps to the upstream control options. Unset properties keep the upstream defaults.

- `Style` accepts either a style URL (`string`) or a MapLibre style document (an object that serializes to the style JSON).
  The value is passed unchanged to the minimap map. When omitted, the MapLibre demo style is used.
- `ZoomLevels` accepts `MinimapZoomLevel` values or `[parentZoom, minimapZoom, targetZoom]` arrays.

## Documentation

- [Minimap plugin guide](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/blob/main/docs/content/plugins/minimap-plugin.md)
- [Documentation site](https://denispolagaev.github.io/DP.Blazor.MapLibre/)

## License

Plugin code is released under the [Unlicense](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/blob/main/UNLICENSE).
The adapted mapboxgl-minimap code is licensed under MIT; its notice is in [THIRD-PARTY-NOTICES.txt](./THIRD-PARTY-NOTICES.txt).

Targets .NET 8, 9, 10 and 11.
