using System.Text.Json.Nodes;
using System.Text.Json.Serialization;
using DP.Blazor.MapLibre.Models;
using DP.Blazor.MapLibre.Models.Camera;

namespace DP.Blazor.MapLibre.ProjPlugin;

/// <summary>
/// Options for <see cref="ProjPlugin.ReprojectStyleAsync"/> and
/// <see cref="ProjPlugin.ApplyReprojectionAsync"/>.
/// Mirrors the <c>reprojectStyle(options)</c> contract from maplibre-proj.
/// </summary>
public sealed class ProjReprojectOptions
{
    /// <summary>
    /// The MapLibre style to reproject. A deep copy is returned; the input is not mutated.
    /// </summary>
    [JsonPropertyName("style")]
    public required JsonObject Style { get; set; }

    /// <summary>
    /// Target coordinate reference system understood by PROJ, for example
    /// <c>EPSG:5070</c>, <c>ESRI:54030</c>, a WKT/PROJJSON string or a PROJ string.
    /// Geographic CRS (e.g. <c>EPSG:4326</c>) and interrupted projections are unsupported.
    /// </summary>
    [JsonPropertyName("crs")]
    public required string Crs { get; set; }

    /// <summary>
    /// Optional transformer id returned by a previous reprojection ({crs} must match) to
    /// skip rebuilding the projection scale factors.
    /// </summary>
    [JsonPropertyName("transformerId")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? TransformerId { get; set; }

    /// <summary>
    /// When <c>true</c>, debug layers are added showing output/input tile borders and labels.
    /// </summary>
    [JsonPropertyName("tileBoundaries")]
    public bool TileBoundaries { get; set; }

    /// <summary>
    /// Options passed to <c>MapLibre.SetStyle</c> when applying via
    /// <see cref="ProjPlugin.ApplyReprojectionAsync"/>. Ignored by
    /// <see cref="ProjPlugin.ReprojectStyleAsync"/>.
    /// </summary>
    [JsonPropertyName("setStyleOptions")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public SetStyleOptions? SetStyleOptions { get; set; }

    /// <summary>
    /// Options passed to <c>map.fitBounds</c> when applying via
    /// <see cref="ProjPlugin.ApplyReprojectionAsync"/>.
    /// </summary>
    [JsonPropertyName("fitBoundsOptions")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public FitBoundOptions? FitBoundsOptions { get; set; }

    /// <summary>
    /// When <c>false</c>, <see cref="ProjPlugin.ApplyReprojectionAsync"/> skips <c>fitBounds</c>.
    /// Defaults to <c>true</c>.
    /// </summary>
    [JsonPropertyName("fitBounds")]
    public bool FitBounds { get; set; } = true;
}
