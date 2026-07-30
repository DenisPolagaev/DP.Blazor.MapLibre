using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre;

/// <summary>
/// Optional lifecycle surface for plugins that support attach/detach and idempotent teardown.
/// Existing <see cref="IMapLibrePlugin.Initialize"/> remains the compatibility entry point.
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
