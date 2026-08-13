using DP.Blazor.MapLibre;
using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre.StarfieldPlugin;

/// <summary>
/// MapLibre plugin that adds an SVG starfield and atmospheric glow behind a globe map
/// (<see href="https://github.com/markmclaren/maplibre-gl-starfield">maplibre-gl-starfield</see>).
/// Register with the map in <c>OnAfterRenderAsync</c>, then call <see cref="AttachAsync"/>
/// after the map is ready (guard with <see cref="IsInitialized"/> if using <c>OnLoad</c> / <c>OnStyleLoad</c>).
/// </summary>
public sealed class StarfieldPlugin : MapLibrePluginBase
{
    #region Fields

    private IJSObjectReference? _mapObject;
    private IJSObjectReference? _pluginJsModule;

    #endregion

    #region Public API

    /// <summary>
    /// Attaches the starfield and globe glow. Creates backdrop layers behind the map unless
    /// <see cref="StarfieldOptions.StarfieldContainerId"/> and <see cref="StarfieldOptions.GlowContainerId"/> are set.
    /// </summary>
    public async ValueTask AttachAsync(StarfieldOptions? options = null)
    {
        EnsureInitialized();
        await _pluginJsModule!.InvokeVoidAsync("attach", options);
        MarkAttached();
    }

    /// <summary>
    /// Updates glow / star settings on an already attached backdrop.
    /// </summary>
    public async ValueTask UpdateConfigAsync(StarfieldOptions options)
    {
        EnsureInitialized();
        ArgumentNullException.ThrowIfNull(options);
        await _pluginJsModule!.InvokeVoidAsync("updateConfig", options);
    }

    /// <summary>
    /// Detaches listeners and removes plugin-owned backdrop DOM nodes.
    /// </summary>
    public async ValueTask DetachAsync()
    {
        if (!IsInitialized || !IsAttached)
        {
            MarkDetached();
            return;
        }

        await _pluginJsModule!.InvokeVoidAsync("detach");
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
            "./_content/StarfieldPlugin/StarfieldPlugin.js");
        await _pluginJsModule.InvokeVoidAsync("initialize", cancellationToken, _mapObject);
    }

    protected override async ValueTask OnDetachAsync(CancellationToken cancellationToken)
    {
        if (_pluginJsModule is null || !IsAttached)
        {
            return;
        }

        await _pluginJsModule.InvokeVoidAsync("detach", cancellationToken);
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
