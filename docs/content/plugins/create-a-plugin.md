# Creating a plugin

`DP.Blazor.MapLibre` is a wrapper library around the core [MapLibre GL JS JavaScript API](https://maplibre.org/maplibre-gl-js/docs/API/). You may want to interop with the MapLibre map in ways that cannot be achieved using the wrapper library, and for this, you can add a plugin.

At a high-level, a plugin can, but not exclusively:

- Maintain a reference to the MapLibre map object created by the core library.
- Import other JavaScript modules, kept separate from the core library.
- Use the MapLibre map object reference in its own JavaScript module(s).
- Expose a type-safe API similar to the core library.

## Quick escape hatch - no plugin project needed

If all you need is to call one MapLibre GL JS method that the wrapper library hasn't caught up
to yet, a full plugin project is more ceremony than the job needs. `MapLibre.NativeMap` exposes
the underlying `maplibregl.Map` JS object directly, and `IJSObjectReference.InvokeAsync`/
`InvokeVoidAsync` call methods on it with no `.js` file required:

```csharp
// Equivalent to calling a native map method, without writing any JavaScript.
await _map.NativeMap.InvokeVoidAsync("rotateTo", bearing, new { duration = 0 });
```

Reach for a full plugin (below) instead when you need real custom JS logic - helper functions,
an external library, or several coordinated calls with your own state - not just one more native
map method.

## Steps

1. Create a **Razor Class Library** project.

    ```shell
    dotnet new razorclasslib --name MyMapLibreRotationPlugin
    ```

    _The existing files in the project are not relevant here and can be ignored/delete later._

2. Add a reference to the `DP.Blazor.MapLibre` NuGet package.

    _From the directory containing the project (`.csproj` file)._

    ```shell
    dotnet add package DP.Blazor.MapLibre
    ```

3. Create a plugin JavaScript module.

    A core rationale for creating a plugin is to interop with the MapLibre object that was initialised in the core libraries JavaScript module. This map object can be passed into our JavaScript module if we design it to receive it.

    Create a file named `MyMapLibreRotationPlugin.js` in the `/wwwroot` folder as below.

    ```javascript
    import { getMapState } from '../DP.Blazor.MapLibre/PluginRuntime.js';

    // Keep state per map (never in module-level variables): several maps can host this plugin.
    export function initialize(map) {
        getMapState(map, 'MyMapLibreRotationPlugin', () => ({}));
    }

    // See https://maplibre.org/maplibre-gl-js/docs/examples/animate-camera-around-point/
    export function rotate(map, duration) {
        const rotate = (startTime) => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            const degrees = progress * 360;
            map.rotateTo(degrees % 360, { duration: 0 });
            if (elapsed < duration) {
                requestAnimationFrame(() => rotate(startTime));
            }
        };
        rotate(Date.now());
    }
    ```

    If the JavaScript module needs to call back into the plugin class, pass a `DotNetObjectReference` from the plugin by overriding `OnModuleLoadedAsync` and calling `initialize(map, dotnetReference)` yourself. See [Call .NET methods from JavaScript functions in ASP.NET Core Blazor](https://learn.microsoft.com/en-us/aspnet/core/blazor/javascript-interoperability/call-dotnet-from-javascript?view=aspnetcore-9.0).

4. Create a plugin class.

    Derive from `MapLibreJsPlugin`. The base class loads the module (after making sure the MapLibre GL JS bundle is ready), calls `initialize(map)`, handles detach and disposal, and releases the module reference. Override `ModulePath`, and override the other hooks only when you need them.

    ```csharp
    public sealed class MyMapLibreRotationPlugin : MapLibreJsPlugin
    {
        private IJSObjectReference? _map;

        protected override string ModulePath => "./_content/MyMapLibreRotationPlugin/MyMapLibreRotationPlugin.js";

        protected override ValueTask OnModuleLoadedAsync(IJSObjectReference map, CancellationToken cancellationToken)
        {
            _map = map;
            return base.OnModuleLoadedAsync(map, cancellationToken);
        }

        public ValueTask Rotate(int duration) => Module.InvokeVoidAsync("rotate", _map, duration);
    }
    ```

    - `Module` is available after initialization. Calling it before the plugin is initialized throws `InvalidOperationException`.
    - Use `OnDetachModuleAsync` to remove visible effects (for example a control) and `OnModuleDisposingAsync` for JavaScript teardown. The base class disposes the module reference; do not dispose `Module` yourself.
    - Log through `Logger` (provided by the map), not `Debug.WriteLine`.
    - Controls: derive from `MapLibreControlPlugin<TOptions>` instead. It adds and removes the control through the module's `addControl(map, options, position)` and `removeControl(map)` exports.
   - Since the JavaScript module is being loaded from a Razor Class Library, use a base-relative path `./_content/{NAMESPACE}/{MODULE_FILE_NAME}.js` (works with `<base href>` on GitHub Pages and similar hosts).
   - The plugin is not responsible for disposing the `MapObject` since a that reference was provided to it by the core `MapLibre` component during initialization.

5. Add a reference to your plugin **Razor Class Library** project.

    ```shell
    dotnet reference add MyMapLibreRotationPlugin.csproj --project MyBlazorProject.csproj
    ```

6. Register your plugin with the MapLibre component.

    The recommended way is dependency injection. Each map gets its own plugin instance, so one plugin type can be used on several maps.

    ```csharp
    // Program.cs
    builder.Services.AddMapLibrePlugin<MyMapLibreRotationPlugin>();
    ```

    ```razor
    <MapLibre UseRegisteredPlugins="true" ... />
    ```

    To use a specific instance instead, pass it through the `Plugins` parameter, or call `RegisterPlugin` (for example in `OnAfterRenderAsync`). Either way the map owns the plugin and disposes it.

    ```csharp
    private readonly MyMapLibreRotationPlugin _myMapLibreRotationPlugin = new();

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await _map.RegisterPlugin(_myMapLibreRotationPlugin);
        }
    }
    ```
7. Use the capabilities exposed by your plugin.

    For example, in the `OnMapLoad` call back for the `MapLibre` component, you can use your plugin to invoke the capabilities it exposes.

    ```csharp
    private async Task OnMapLoad(EventArgs args)
    {
        await _myMapLibreRotationPlugin.Rotate(2000);
    }
    ```

## Reference implementations

The repository includes plugin projects you can use as starting points:

- [Terra Draw plugin](./terra-draw-plugin.md) вЂ” drawing and geometry editing with Terra Draw
- [Map Compare plugin](./map-compare-plugin.md) вЂ” swipe and sync between two maps with [maplibre-gl-compare](https://github.com/maplibre/maplibre-gl-compare)
- [Minimap plugin](./minimap-plugin.md) вЂ” overview minimap control ([mapboxgl-minimap](https://github.com/aesqe/mapboxgl-minimap))
- [Frame rate plugin](./framerate-plugin.md) вЂ” rendering performance overlay ([mapbox-gl-framerate](https://github.com/mapbox/mapbox-gl-framerate))
- [Geo grid plugin](./geogrid-plugin.md) вЂ” geographic graticule with labels ([geogrid-maplibre-gl](https://github.com/falseinput/geogrid-maplibre-gl))
- [Mapbox GL Draw plugin](./mapbox-gl-draw-plugin.md) вЂ” reference plugin in the examples solution
