using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.GeoGridPlugin;

/// <summary>
/// Line style for geographic grid meridians and parallels.
/// </summary>
public sealed class GeoGridLineStyle
{
    [JsonPropertyName("color")]
    public string? Color { get; init; }

    [JsonPropertyName("width")]
    public double? Width { get; init; }

    [JsonPropertyName("dasharray")]
    public double[]? DashArray { get; init; }
}

/// <summary>
/// Label style for geographic grid edge coordinates.
/// </summary>
public sealed class GeoGridLabelStyle
{
    [JsonPropertyName("color")]
    public string? Color { get; init; }

    [JsonPropertyName("fontSize")]
    public string? FontSize { get; init; }

    [JsonPropertyName("fontFamily")]
    public string? FontFamily { get; init; }

    [JsonPropertyName("textShadow")]
    public string? TextShadow { get; init; }
}

/// <summary>
/// Zoom-dependent grid density step (degrees between lines).
/// </summary>
public sealed class GeoGridDensityStep
{
    [JsonPropertyName("zoom")]
    public int Zoom { get; init; }

    [JsonPropertyName("densityDegrees")]
    public double DensityDegrees { get; init; }
}

/// <summary>
/// Configuration for <see cref="GeoGridPlugin"/>.
/// Mirrors <see href="https://github.com/falseinput/geogrid-maplibre-gl">geogrid-maplibre-gl</see> options.
/// </summary>
public sealed class GeoGridOptions
{
    /// <summary>
    /// Layer id inserted below this layer. When omitted, grid is added on top.
    /// </summary>
    [JsonPropertyName("beforeLayerId")]
    public string? BeforeLayerId { get; init; }

    [JsonPropertyName("gridStyle")]
    public GeoGridLineStyle? GridStyle { get; init; }

    [JsonPropertyName("labelStyle")]
    public GeoGridLabelStyle? LabelStyle { get; init; }

    /// <summary>Visible zoom range as <c>[minZoom, maxZoom]</c>.</summary>
    [JsonPropertyName("zoomLevelRange")]
    public double[]? ZoomLevelRange { get; init; }

    /// <summary>Fixed spacing between grid lines in degrees.</summary>
    [JsonPropertyName("gridDensityDegrees")]
    public double? GridDensityDegrees { get; init; }

    /// <summary>Zoom-dependent grid density. Closest step with zoom less than or equal to current zoom is used.</summary>
    [JsonPropertyName("gridDensityByZoom")]
    public IReadOnlyList<GeoGridDensityStep>? GridDensityByZoom { get; init; }

    [JsonPropertyName("labelFormat")]
    public GeoGridLabelFormat LabelFormat { get; init; } = GeoGridLabelFormat.Default;
}
