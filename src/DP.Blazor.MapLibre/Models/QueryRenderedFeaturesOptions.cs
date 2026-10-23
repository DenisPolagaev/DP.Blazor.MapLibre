using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models;

/// <summary>
/// Options for <see cref="MapLibre.QueryRenderedFeatures"/> / <c>queryRenderedFeatures</c>.
/// </summary>
public sealed class QueryRenderedFeaturesOptions
{
    /// <summary>
    /// Style layer IDs to inspect. Omit to query all layers.
    /// </summary>
    [JsonPropertyName("layers")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string[]? Layers { get; set; }

    /// <summary>
    /// Style-spec filter expression limiting results.
    /// </summary>
    [JsonPropertyName("filter")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? Filter { get; set; }

    [JsonPropertyName("availableImages")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string[]? AvailableImages { get; set; }

    /// <summary>
    /// When true, each returned feature includes its geometry. Defaults to false: MapLibre expands vector-tile geometry
    /// on access, so geometry is only crossed to .NET on request.
    /// </summary>
    [JsonPropertyName("includeGeometry")]
    public bool IncludeGeometry { get; set; }

    [JsonPropertyName("validate")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Validate { get; set; }
}
