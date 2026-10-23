using DP.Blazor.MapLibre;
using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre.PmtilesPlugin;

/// <summary>
/// Registers the <c>pmtiles://</c> protocol on MapLibre GL JS
/// (<see href="https://github.com/protomaps/PMTiles">protomaps/PMTiles</see>).
/// Register with the map before adding sources whose URL starts with <c>pmtiles://</c>.
/// The protocol is page-global: it is shared by all maps and removed only when the last initialized
/// <see cref="PmtilesPlugin"/> instance is disposed.
/// </summary>
public sealed class PmtilesPlugin : MapLibreJsPlugin
{
    #region Fields

    // Set only after the JavaScript protocol reference was acquired, so dispose pairs with initialize.
    private bool _protocolAcquired;

    #endregion

    #region Properties

    /// <summary>Static asset path of the plugin module.</summary>
    protected override string ModulePath => "./_content/PmtilesPlugin/PmtilesPlugin.js";

    #endregion

    #region Lifecycle Overrides

    /// <summary>Registers the protocol. The protocol takes no map argument.</summary>
    protected override async ValueTask OnModuleLoadedAsync(IJSObjectReference map, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        await Module.InvokeVoidAsync("initialize");
        _protocolAcquired = true;
    }

    /// <inheritdoc />
    protected override async ValueTask OnModuleDisposingAsync()
    {
        if (!_protocolAcquired)
        {
            return;
        }

        _protocolAcquired = false;
        await Module.InvokeVoidAsync("dispose");
    }

    #endregion
}
