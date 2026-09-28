using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.ProjPlugin;

/// <summary>
/// Options for <see cref="ProjPlugin.ReprojectSourceAsync"/>: reprojects a single source
/// (vector tile or GeoJSON) for the active CRS instead of a whole style document.
/// </summary>
public sealed class ProjSourceReprojectOptions
{
    /// <summary>The source specification to reproject (e.g. a vector or GeoJSON source object).</summary>
    [JsonPropertyName("source")]
    public required JsonObject Source { get; set; }

    /// <summary>
    /// Optional source id. Keeps each layer's reprojection protocol handler distinct and
    /// stable across updates.
    /// </summary>
    [JsonPropertyName("sourceId")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? SourceId { get; set; }

    /// <summary>Target PROJ CRS code.</summary>
    [JsonPropertyName("crs")]
    public required string Crs { get; set; }

    /// <summary>Optional real-world area of use [west, south, east, north] degrees.</summary>
    [JsonPropertyName("areaOfUse")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double[]? AreaOfUse { get; set; }

    /// <summary>Optional transformer id from a previous reprojection of the same CRS.</summary>
    [JsonPropertyName("transformerId")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? TransformerId { get; set; }
}

/// <summary>Result of <see cref="ProjPlugin.ReprojectSourceAsync"/>.</summary>
public sealed class ProjSourceReprojectResult
{
    /// <summary>The rewritten source (vector tiles point at a reprojection protocol).</summary>
    [JsonPropertyName("source")]
    public JsonObject Source { get; set; } = [];

    /// <summary>Transformer handle for reuse and coordinate conversion.</summary>
    [JsonPropertyName("transformerId")]
    public string? TransformerId { get; set; }
}
