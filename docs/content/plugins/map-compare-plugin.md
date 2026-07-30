# Map Compare plugin

The **Map Compare plugin** adds a swipe slider to compare two `MapLibre` maps side by side (or top and bottom). It wraps [maplibre-gl-compare](https://github.com/maplibre/maplibre-gl-compare) from the MapLibre project.

The plugin project lives at `src/plugins/DP.Blazor.MapLibre.ComparePlugin`.

## Installation

```shell
dotnet add reference ../../src/plugins/DP.Blazor.MapLibre.ComparePlugin/DP.Blazor.MapLibre.ComparePlugin.csproj
```

Add maplibre-gl and maplibre-gl-compare to your host page **before** Blazor starts, as described in the [maplibre-gl-compare README](https://github.com/maplibre/maplibre-gl-compare):

```html
<link href="_content/DP.Blazor.MapLibre/maplibre-gl/dist/maplibre-gl.css" rel="stylesheet" />
<link href="_content/MapComparePlugin/maplibre-gl-compare/dist/maplibre-gl-compare.css" rel="stylesheet" />
<script src="_content/DP.Blazor.MapLibre/maplibre-gl/dist/maplibre-gl.js"></script>
<script src="_content/MapComparePlugin/maplibre-gl-compare/dist/maplibre-gl-compare.js"></script>
```

The plugin can also load these assets dynamically via `InitializeAsync`, but the script-tag order above matches the official compare examples.

## Usage

Place two `MapLibre` components inside a shared container (both maps must use `position: absolute` and fill the container), then create the compare control after both maps have loaded:

```csharp
@using DP.Blazor.MapLibre.ComparePlugin

<div id="comparison-container" class="comparison-container">
    <MapLibre MapId="before" Options="_beforeOptions" OnLoad="OnMapsReady" Class="map" Height="100%" />
    <MapLibre MapId="after" Options="_afterOptions" OnLoad="OnMapsReady" Class="map" Height="100%" />
</div>

@code {
    private ComparePlugin _compare = new();
    private int _mapsLoaded;

    private async Task OnMapsReady(EventArgs _)
    {
        if (Interlocked.Increment(ref _mapsLoaded) < 2)
        {
            return;
        }

        await _compare.InitializeAsync(JsRuntime);
        await _compare.CreateAsync("before", "after", "#comparison-container");
    }
}
```

The container CSS should position both maps absolutely so they overlap. See `examples/DP.Blazor.MapLibre.Examples/Examples/MapCompare.razor` for a full example.

## API

| Method | Description |
|--------|-------------|
| `InitializeAsync(IJSRuntime)` | Load maplibre-gl-compare assets. |
| `CreateAsync(beforeMap, afterMap, containerSelector, options?)` | Attach the compare slider. |
| `GetCurrentPositionAsync()` | Current slider position in pixels. |
| `SetSliderAsync(position)` | Set slider position in pixels. |
| `AddSlideEndListener<T>` | Fires when the user finishes dragging the slider. |
| `RemoveAsync()` | Remove the compare control. |

### Options

| Property | Description |
|----------|-------------|
| `MouseMove` | When `true`, the slider follows the cursor. |
| `Orientation` | `Vertical` (default) or `Horizontal`. |
| `Handle` | Optional slider handle and divider styling (see below). |

### Handle options

By default the plugin applies a compact modern handle (36px, white circle with chevrons). Override via `CompareHandleOptions`:

| Property | Description |
|----------|-------------|
| `Size` | Handle diameter in pixels (default `36`). |
| `BackgroundColor` | Handle background color. |
| `BorderColor` | Handle border color. |
| `BorderWidth` | Handle border width in pixels. |
| `BorderRadius` | CSS border radius (default pill/circle). |
| `BoxShadow` | CSS box shadow. |
| `LineColor` | Divider line color. |
| `LineWidth` | Divider line width in pixels. |
| `Icon` | `Chevrons` (default), `Grip`, or `None`. |
| `CustomIconHtml` | Custom inner HTML for the handle (overrides `Icon`). |
| `CssClass` | Extra CSS class on the compare container. |

```csharp
await _compare.CreateAsync("before", "after", "#comparison-container", new CompareOptions(
    Handle: new CompareHandleOptions(
        Size: 32,
        BackgroundColor: "#111827",
        BorderColor: "transparent",
        Icon: CompareHandleIcon.Grip)));
```

## Live demo

Run the examples site and open **Map Compare**, or see the [Map Compare example](./examples/map-compare.md) on the documentation site.
