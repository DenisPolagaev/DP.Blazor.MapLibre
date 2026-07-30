using DP.Blazor.MapLibre;
using DP.Blazor.MapLibre.Models.Control;
using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre.FrameratePlugin;

/// <summary>
/// MapLibre plugin that adds a frame rate performance control
/// (<see href="https://github.com/mapbox/mapbox-gl-framerate">mapbox-gl-framerate</see>).
/// </summary>
public sealed class FrameratePlugin : IMapLibrePlugin
{
    private IJSObjectReference _mapObject = null!;
    private IJSObjectReference _pluginJsModule = null!;

    public async Task Initialize(IJSObjectReference map, IJSRuntime runtime)
    {
        _mapObject = map;
        _pluginJsModule = await runtime.InvokeAsync<IJSObjectReference>(
            "import", "/_content/FrameratePlugin/FrameratePlugin.js");
        await _pluginJsModule.InvokeVoidAsync("initialize", _mapObject);
    }

    /// <summary>
    /// Adds the frame rate control to the map.
    /// </summary>
    /// <param name="options">Optional FPS graph configuration.</param>
    /// <param name="position">Corner position on the map.</param>
    public async ValueTask AddFramerateControlAsync(
        FramerateControlOptions? options = null,
        ControlPosition position = ControlPosition.TopRight) =>
        await _pluginJsModule.InvokeVoidAsync("addControl", options, position);

    /// <summary>
    /// Removes the frame rate control from the map.
    /// </summary>
    public async ValueTask RemoveFramerateControlAsync() =>
        await _pluginJsModule.InvokeVoidAsync("removeControl");

    public async ValueTask DisposeAsync()
    {
        try
        {
            await _pluginJsModule.InvokeVoidAsync("dispose");
            await _pluginJsModule.DisposeAsync();
        }
        catch (JSDisconnectedException) { }
        catch (ObjectDisposedException) { }
    }
}
