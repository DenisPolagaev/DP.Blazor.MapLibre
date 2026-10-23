using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre.StarfieldPlugin;

/// <summary>
/// MapLibre plugin that adds an SVG starfield and atmospheric glow behind a globe map
/// (<see href="https://github.com/markmclaren/maplibre-gl-starfield">maplibre-gl-starfield</see>, DP fork).
/// Register with the map in <c>OnAfterRenderAsync</c>, then call <see cref="AttachAsync(StarfieldOptions?)"/>
/// after the map is ready (guard with <see cref="MapLibrePluginBase.IsInitialized"/> if using <c>OnLoad</c> / <c>OnStyleLoad</c>).
/// <see cref="DetachAsync()"/> and disposal remove the backdrop and restore the host and map styles that attach changed.
/// </summary>
public sealed class StarfieldPlugin : MapLibreJsPlugin
{
    #region Fields

    private IJSObjectReference? _mapReference;

    #endregion

    #region Properties

    /// <inheritdoc />
    protected override string ModulePath => "./_content/StarfieldPlugin/StarfieldPlugin.js";

    /// <summary>JS handle of the map this plugin is bound to. Available after initialization.</summary>
    private IJSObjectReference MapReference =>
        _mapReference ?? throw new InvalidOperationException($"{nameof(StarfieldPlugin)} is not bound to a map.");

    #endregion

    #region Public API

    /// <summary>
    /// Attaches the starfield and globe glow. Creates backdrop layers behind the map unless
    /// <see cref="StarfieldOptions.StarfieldContainerId"/> and <see cref="StarfieldOptions.GlowContainerId"/> are set.
    /// Calling without <paramref name="options"/> uses the upstream defaults.
    /// Attaching again replaces the current backdrop.
    /// </summary>
    public async ValueTask AttachAsync(StarfieldOptions? options = null)
    {
        EnsureInitialized();
        await Module.InvokeVoidAsync("attach", MapReference, options ?? new StarfieldOptions());
        MarkAttached();
    }

    /// <summary>
    /// Updates glow / star settings on an already attached backdrop. Does nothing when the plugin is not attached.
    /// </summary>
    public async ValueTask UpdateConfigAsync(StarfieldOptions options)
    {
        EnsureInitialized();
        ArgumentNullException.ThrowIfNull(options);
        await Module.InvokeVoidAsync("updateConfig", MapReference, options);
    }

    /// <summary>
    /// Removes the backdrop and restores the host and map styles changed by <see cref="AttachAsync(StarfieldOptions?)"/>.
    /// Same as <c>DetachAsync(CancellationToken.None)</c>.
    /// </summary>
    public ValueTask DetachAsync() => DetachAsync(CancellationToken.None);

    #endregion

    #region Lifecycle Overrides

    /// <inheritdoc />
    protected override ValueTask OnModuleLoadedAsync(IJSObjectReference map, CancellationToken cancellationToken)
    {
        // The JS module keeps no map-level state of its own; every call receives the map handle.
        _mapReference = map;
        return base.OnModuleLoadedAsync(map, cancellationToken);
    }

    /// <inheritdoc />
    protected override ValueTask OnDetachModuleAsync(CancellationToken cancellationToken) =>
        Module.InvokeVoidAsync("detach", cancellationToken, MapReference);

    /// <inheritdoc />
    protected override ValueTask OnModuleDisposingAsync()
    {
        var map = _mapReference;
        _mapReference = null;
        return map is null
            ? ValueTask.CompletedTask
            : Module.InvokeVoidAsync("dispose", map);
    }

    #endregion
}
