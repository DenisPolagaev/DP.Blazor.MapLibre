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
public sealed class MinimapPlugin : MapLibrePluginBase
{
    #region Fields

    private IJSObjectReference? _mapObject;
    private IJSObjectReference? _pluginJsModule;

    #endregion

    #region Public API

    /// <summary>
    /// Adds the minimap control to the map.
    /// </summary>
    public async ValueTask AddMinimapControlAsync(
        MinimapControlOptions? options = null,
        ControlPosition position = ControlPosition.BottomLeft)
    {
        EnsureInitialized();
        await _pluginJsModule!.InvokeVoidAsync("addControl", options, position);
        MarkAttached();
    }

    /// <summary>
    /// Removes the minimap control from the map.
    /// </summary>
    public async ValueTask RemoveMinimapControlAsync()
    {
        if (!IsInitialized || !IsAttached)
        {
            MarkDetached();
            return;
        }

        await _pluginJsModule!.InvokeVoidAsync("removeControl");
        MarkDetached();
    }

    #endregion

    #region Lifecycle Overrides

    protected override async Task OnInitializeAsync(
        IJSObjectReference map,
        IJSRuntime runtime,
        CancellationToken cancellationToken)
    {
        _mapObject = map;
        _pluginJsModule = await runtime.InvokeAsync<IJSObjectReference>(
            "import",
            cancellationToken,
            "./_content/MinimapPlugin/MinimapPlugin.js");
        await _pluginJsModule.InvokeVoidAsync("initialize", cancellationToken, _mapObject);
    }

    protected override async ValueTask OnDetachAsync(CancellationToken cancellationToken)
    {
        if (_pluginJsModule is null || !IsAttached)
        {
            return;
        }

        await _pluginJsModule.InvokeVoidAsync("removeControl", cancellationToken);
    }

    protected override async ValueTask OnDisposeAsync()
    {
        var pluginModule = _pluginJsModule;
        if (pluginModule is null)
        {
            _mapObject = null;
            return;
        }

        try
        {
            await pluginModule.InvokeVoidAsync("dispose");
            await pluginModule.DisposeAsync();
        }
        finally
        {
            _pluginJsModule = null;
            _mapObject = null;
        }
    }

    #endregion
}
