using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre;

/// <summary>
/// Lifecycle surface for plugins that support attach/detach and idempotent teardown.
/// <see cref="IMapLibrePlugin.Initialize"/> is the single entry point the map calls; plugins normally derive
/// from <see cref="MapLibrePluginBase"/> or <see cref="MapLibreJsPlugin"/> instead of implementing this directly.
/// </summary>
public interface IMapLibrePluginLifecycle : IMapLibrePlugin
{
    /// <summary>Current lifecycle stage.</summary>
    MapLibrePluginLifecycleState State { get; }

    /// <summary>True when the plugin has a visible effect attached to the map.</summary>
    bool IsAttached { get; }

    /// <summary>
    /// Loads the JS module and binds to the map. Must be idempotent while already initialized.
    /// </summary>
    Task InitializeAsync(
        IJSObjectReference map,
        IJSRuntime runtime,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Removes map-visible effects but keeps the module ready for re-attach.
    /// </summary>
    ValueTask DetachAsync(CancellationToken cancellationToken = default);
}
