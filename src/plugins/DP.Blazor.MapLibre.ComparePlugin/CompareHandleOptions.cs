namespace DP.Blazor.MapLibre.ComparePlugin;

/// <summary>
/// Visual options for the compare slider handle and divider line.
/// </summary>
public sealed record CompareHandleOptions(
    string? CssClass = null,
    double Size = 36,
    string? BackgroundColor = null,
    string? BorderColor = null,
    double? BorderWidth = null,
    string? BorderRadius = null,
    string? BoxShadow = null,
    string? LineColor = null,
    double? LineWidth = null,
    CompareHandleIcon Icon = CompareHandleIcon.Chevrons,
    string? CustomIconHtml = null);
