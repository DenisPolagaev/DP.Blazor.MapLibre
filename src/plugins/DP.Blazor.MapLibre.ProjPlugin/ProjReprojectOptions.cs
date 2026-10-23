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
    /// Optional transformer id returned by a previous reprojection. Its CRS must equal <see cref="Crs"/>, otherwise
    /// the call fails. When the id is known, its projection is reused and <see cref="AreaOfUse"/> is ignored.
    /// </summary>
    [JsonPropertyName("transformerId")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? TransformerId { get; set; }

    /// <summary>
    /// Reserved. Debug tile-border layers are not implemented yet; the value is sent to the pipeline and ignored.
    /// </summary>
    [JsonPropertyName("tileBoundaries")]
    public bool TileBoundaries { get; set; }

    /// <summary>
    /// Optional real-world area of use <c>[west, south, east, north]</c> degrees. Derives the fake-space scale for
    /// regional and polar CRS, as in <see cref="ProjMapProjectionOptions.AreaOfUse"/>.
    /// </summary>
    [JsonPropertyName("areaOfUse")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double[]? AreaOfUse { get; set; }

    /// <summary>
    /// Hemisphere to frame when <see cref="AreaOfUse"/> is not set. <c>null</c> samples all latitudes.
    /// </summary>
    [JsonPropertyName("polarHemisphere")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public ProjPolarHemisphere? PolarHemisphere { get; set; }

    /// <summary>
    /// Upper bound on the input tiles read for one output tile of a vector source. When a tile needs more, the output
    /// tile is incomplete and a warning names the source. Must be at least 1. Default: 64.
    /// </summary>
    [JsonPropertyName("maxInputTiles")]
    public int MaxInputTiles { get; set; } = 64;

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
