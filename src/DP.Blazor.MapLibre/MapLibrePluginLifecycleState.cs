namespace DP.Blazor.MapLibre;

/// <summary>
/// Lifecycle stages for a single-map MapLibre plugin.
/// </summary>
public enum MapLibrePluginLifecycleState
{
    /// <summary>Plugin instance created; JS module not loaded.</summary>
    Created = 0,

    /// <summary>JS module loaded and bound to a map; no visible side-effects required.</summary>
    Initialized = 1,

    /// <summary>Visible effect attached (control, grid, animation, etc.).</summary>
    Attached = 2,

    /// <summary>Torn down; instance must not be reused.</summary>
    Disposed = 3
}
