# DP.Blazor.MapLibre.FrameratePlugin

Live **frame rate** overlay plugin for [DP.Blazor.MapLibre](https://github.com/DenisPolagaev/DP.Blazor.MapLibre).
The FPS control is adapted from [mapbox-gl-framerate](https://github.com/mapbox/mapbox-gl-framerate) (ISC) for MapLibre GL JS;
see [THIRD-PARTY-NOTICES.txt](./THIRD-PARTY-NOTICES.txt).

Shows live and average FPS while the map is moving.

## Install

```bash
dotnet add package DP.Blazor.MapLibre.FrameratePlugin
```

The core `DP.Blazor.MapLibre` package is referenced automatically.

## Quick start

```razor
@using DP.Blazor.MapLibre.FrameratePlugin
@using DP.Blazor.MapLibre.Models.Control

<MapLibre @ref="_map" OnLoad="OnMapLoad" />

@code {
    private MapLibre _map = new();
    private readonly FrameratePlugin _framerate = new();

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
            await _map.RegisterPlugin(_framerate);
    }

    private async Task OnMapLoad(EventArgs _) =>
        await _framerate.AddFramerateControlAsync(
            new FramerateControlOptions { Color = "#7cf859" },
            ControlPosition.TopRight);
}
```

## API

| Method | Description |
| --- | --- |
| `AddFramerateControlAsync(options?, position?)` | Adds the control. Replaces a control this plugin added earlier. |
| `RemoveFramerateControlAsync()` | Removes the control. Does nothing when no control was added. |

`FramerateControlOptions` properties that are left unset keep the upstream defaults.

## Documentation

- [Frame rate plugin guide](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/blob/main/docs/content/plugins/framerate-plugin.md)
- [Documentation site](https://denispolagaev.github.io/DP.Blazor.MapLibre/)

## License

Plugin code is released under the [Unlicense](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/blob/main/UNLICENSE).
The adapted mapbox-gl-framerate code is licensed under ISC; its notice is in [THIRD-PARTY-NOTICES.txt](./THIRD-PARTY-NOTICES.txt).

Targets .NET 8, 9, 10 and 11.
