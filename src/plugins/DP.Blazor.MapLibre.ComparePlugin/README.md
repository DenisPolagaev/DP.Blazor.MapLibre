# DP.Blazor.MapLibre.ComparePlugin

Swipe-slider **map compare** plugin for [DP.Blazor.MapLibre](https://github.com/DenisPolagaev/DP.Blazor.MapLibre), wrapping [maplibre-gl-compare](https://github.com/maplibre/maplibre-gl-compare).

Compare two `MapLibre` maps side by side and drag the divider to reveal one over the other.

## Install

```bash
dotnet add package DP.Blazor.MapLibre.ComparePlugin
```

The core `DP.Blazor.MapLibre` package is referenced automatically.

## Quick start

The plugin is registered with the **before** map. The map supplies the JavaScript runtime, so no `IJSRuntime` injection is needed. The **after** map is addressed by its id.

```razor
@using DP.Blazor.MapLibre
@using DP.Blazor.MapLibre.ComparePlugin

<div id="comparison-container" class="comparison-container">
    <MapLibre @ref="_beforeMap" MapId="before" Options="_beforeOptions" OnLoad="OnMapLoaded" Class="map" Height="100%" />
    <MapLibre MapId="after" Options="_afterOptions" OnLoad="OnMapLoaded" Class="map" Height="100%" />
</div>

@code {
    private readonly ComparePlugin _compare = new();
    private MapLibre? _beforeMap;
    private int _mapsLoaded;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender && _beforeMap is not null)
        {
            // Plugins registered before the map is ready are initialized together with the map.
            await _beforeMap.RegisterPlugin(_compare);
        }
    }

    private async Task OnMapLoaded(EventArgs _)
    {
        if (Interlocked.Increment(ref _mapsLoaded) < 2 || !_compare.IsInitialized)
        {
            return;
        }

        await _compare.CreateAsync("before", "after", "#comparison-container");
    }
}
```

Both maps must be `position: absolute` and fill the container. Add the MapLibre stylesheet in your host page:

```html
<link href="_content/DP.Blazor.MapLibre/maplibre-gl/dist/maplibre-gl.css" rel="stylesheet" />
```

## Options

```csharp
await _compare.CreateAsync("before", "after", "#comparison-container", new CompareOptions(
    MouseMove: true,
    Orientation: CompareOrientation.Vertical,
    Handle: new CompareHandleOptions(
        Size: 40,
        Icon: CompareHandleIcon.Grip,
        LineColor: "#ffffff",
        LineWidth: 2)));
```

## Slide-end events

```csharp
var listener = await _compare.AddSlideEndListener<SlideEndEvent>(e =>
    Console.WriteLine($"Position: {e.CurrentPosition}"));

// Unsubscribe:
await listener.Remove();
```

`AddSlideEndListener` requires an attached control: call it after `CreateAsync` has completed, otherwise it throws `InvalidOperationException`. Subscriptions are dropped by `RemoveAsync` and by disposal, so subscribe again after re-creating the control.

## Lifecycle and disposal

- **Registered (recommended):** the before map initializes the plugin, and it calls `DetachAsync` and `DisposeAsync` when the plugin is unregistered or the map is disposed. Do not dispose the plugin yourself.
- `RemoveAsync()` removes the compare control and its slide-end subscriptions. The plugin stays usable, and `CreateAsync` can be called again.

## Custom handle icons

`CompareHandleOptions.CustomIconHtml` is inserted into the handle as HTML. It is treated as developer-supplied, trusted markup, so pass only markup you control and never user input. Before insertion, `<script>` elements, `on*` attributes and `javascript:` URLs are removed as a safety net.

## Documentation

- [Map Compare plugin guide](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/blob/main/docs/content/plugins/map-compare-plugin.md)
- [Documentation site](https://denispolagaev.github.io/DP.Blazor.MapLibre/)

## License

Targets .NET 8, 9, 10 and 11. Released under the [Unlicense](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/blob/main/UNLICENSE).
The vendored `maplibre-gl-compare` files in `wwwroot/maplibre-gl-compare/dist` are third-party; see the notice header in each file.
