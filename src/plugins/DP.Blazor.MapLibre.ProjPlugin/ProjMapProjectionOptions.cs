using System.Text.Json.Serialization;
using DP.Blazor.MapLibre.Models;
using DP.Blazor.MapLibre.Models.Camera;

namespace DP.Blazor.MapLibre.ProjPlugin;

/// <summary>
/// Options for <see cref="ProjPlugin.ApplyCurrentStyleProjectionAsync"/>: reprojects the
/// map's current style in place instead of a caller-supplied style document.
/// </summary>
public sealed class ProjMapProjectionOptions
{
    /// <summary>
    /// Target coordinate reference system understood by PROJ, for example
    /// <c>EPSG:5070</c>, <c>ESRI:54030</c>, a WKT/PROJJSON string or a PROJ string.
    /// Geographic CRS and interrupted projections are unsupported.
    /// </summary>
    [JsonPropertyName("crs")]
    public required string Crs { get; set; }

    /// <summary>Optional transformer id from a previous reprojection of the same CRS.</summary>
    [JsonPropertyName("transformerId")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? TransformerId { get; set; }

    /// <summary>When <c>true</c>, adds debug tile-border layers.</summary>
    [JsonPropertyName("tileBoundaries")]
    public bool TileBoundaries { get; set; }

    /// <summary>
    /// For polar CRS, <c>north</c> or <c>south</c>. The plugin frames the map by sampling that
    /// hemisphere because maplibre-proj returns degenerate world bounds for polar projections.
    /// </summary>
    [JsonPropertyName("polarHemisphere")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? PolarHemisphere { get; set; }

    /// <summary>
    /// Optional real-world area of use <c>[west, south, east, north]</c> degrees. Used to derive
    /// the fake-space scale for regional/polar CRS.
    /// </summary>
    [JsonPropertyName("areaOfUse")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double[]? AreaOfUse { get; set; }

    /// <summary>When <c>false</c>, skips <c>fitBounds</c>. Defaults to <c>true</c>.</summary>
    [JsonPropertyName("fitBounds")]
    public bool FitBounds { get; set; } = true;

    /// <summary>Options passed to <c>map.setStyle</c>.</summary>
    [JsonPropertyName("setStyleOptions")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public SetStyleOptions? SetStyleOptions { get; set; }

    /// <summary>Options passed to <c>map.fitBounds</c>.</summary>
    [JsonPropertyName("fitBoundsOptions")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public FitBoundOptions? FitBoundsOptions { get; set; }
}
