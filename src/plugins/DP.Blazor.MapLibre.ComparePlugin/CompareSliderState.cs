namespace DP.Blazor.MapLibre.ComparePlugin;

/// <summary>
/// Current swiper position relative to the compare container bounds.
/// </summary>
public sealed record CompareSliderState(
    double Position,
    double Width,
    double Height,
    double Ratio);
