using DP.Blazor.MapLibre;
using DP.Blazor.MapLibre.Models.Control;
using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre.MinimapPlugin;

/// <summary>
/// MapLibre plugin that adds a minimap overview control
/// (<see href="https://github.com/aesqe/mapboxgl-minimap">mapboxgl-minimap</see>).
/// Register with the map in <c>OnAfterRenderAsync</c>, then call <see cref="AddMinimapControlAsync"/>
/// after the map is ready (guard with <see cref="IsInitialized"/> if using <c>OnLoad</c>).
/// </summary>
public sealed class MinimapPlugin : IMapLibrePlugin
{
    private IJSObjectReference? _mapObject;
    private IJSObjectReference? _pluginJsModule;

    /// <summary>Whether <see cref="Initialize"/> completed successfully.</summary>
    public bool IsInitialized => _pluginJsModule is not null;

    public async Task Initialize(IJSObjectReference map, IJSRuntime runtime)
    {
        ArgumentNullException.ThrowIfNull(map);
        ArgumentNullException.ThrowIfNull(runtime);

        _mapObject = map;
        _pluginJsModule = await runtime.InvokeAsync<IJSObjectReference>(
            "import", "./_content/MinimapPlugin/MinimapPlugin.js");
        await _pluginJsModule.InvokeVoidAsync("initialize", _mapObject);
    }

    /// <summary>
    /// Adds the minimap control to the map.
    /// </summary>
    /// <param name="options">Optional minimap configuration.</param>
    /// <param name="position">Corner position on the parent map.</param>
    public async ValueTask AddMinimapControlAsync(
        MinimapControlOptions? options = null,
        ControlPosition position = ControlPosition.BottomLeft)
    {
        EnsureInitialized();
        await _pluginJsModule!.InvokeVoidAsync("addControl", options, position);
    }

    /// <summary>
    /// Removes the minimap control from the map.
    /// </summary>
    public async ValueTask RemoveMinimapControlAsync()
    {
        EnsureInitialized();
        await _pluginJsModule!.InvokeVoidAsync("removeControl");
    }

    public async ValueTask DisposeAsync()
    {
        if (_pluginJsModule is null)
        {
            return;
        }

        try
        {
            await _pluginJsModule.InvokeVoidAsync("dispose");
            await _pluginJsModule.DisposeAsync();
        }
        catch (JSDisconnectedException) { }
        catch (ObjectDisposedException) { }
    }

    private void EnsureInitialized()
    {
        if (!IsInitialized)
        {
            throw new InvalidOperationException(
                "MinimapPlugin is not initialized. Call MapLibre.RegisterPlugin before using the plugin.");
        }
    }
}
