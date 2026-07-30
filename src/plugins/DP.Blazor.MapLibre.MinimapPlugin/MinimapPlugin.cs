using System.Text.Json.Serialization;
using DP.Blazor.MapLibre;
using DP.Blazor.MapLibre.Models.Control;
using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre.MinimapPlugin;

/// <summary>
/// MapLibre plugin that adds a minimap overview control
/// (<see href="https://github.com/aesqe/mapboxgl-minimap">mapboxgl-minimap</see>).
/// </summary>
public sealed class MinimapPlugin : IMapLibrePlugin
{
    private IJSObjectReference _mapObject = null!;
    private IJSObjectReference _pluginJsModule = null!;

    public async Task Initialize(IJSObjectReference map, IJSRuntime runtime)
    {
        _mapObject = map;
        _pluginJsModule = await runtime.InvokeAsync<IJSObjectReference>(
            "import", "/_content/MinimapPlugin/MinimapPlugin.js");
        await _pluginJsModule.InvokeVoidAsync("initialize", _mapObject);
    }

    /// <summary>
    /// Adds the minimap control to the map.
    /// </summary>
    /// <param name="options">Optional minimap configuration.</param>
    /// <param name="position">Corner position on the parent map.</param>
    public async ValueTask AddMinimapControlAsync(
        MinimapControlOptions? options = null,
        ControlPosition position = ControlPosition.BottomLeft) =>
        await _pluginJsModule.InvokeVoidAsync("addControl", options, position);

    /// <summary>
    /// Removes the minimap control from the map.
    /// </summary>
    public async ValueTask RemoveMinimapControlAsync() =>
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
