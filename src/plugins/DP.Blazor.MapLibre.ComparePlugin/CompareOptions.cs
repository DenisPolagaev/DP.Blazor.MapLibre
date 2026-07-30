namespace DP.Blazor.MapLibre.ComparePlugin;

public sealed record CompareOptions(
    bool MouseMove = false,
    CompareOrientation Orientation = CompareOrientation.Vertical,
    CompareHandleOptions? Handle = null);
