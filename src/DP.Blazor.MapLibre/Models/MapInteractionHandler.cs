namespace DP.Blazor.MapLibre.Models;

/// <summary>
/// MapLibre interaction handlers exposed via enable/disable/isEnabled.
/// </summary>
public enum MapInteractionHandler
{
    DragPan,
    DragRotate,
    ScrollZoom,
    BoxZoom,
    DoubleClickZoom,
    Keyboard,
    TouchZoomRotate,
    TouchPitch,
    CooperativeGestures
}
