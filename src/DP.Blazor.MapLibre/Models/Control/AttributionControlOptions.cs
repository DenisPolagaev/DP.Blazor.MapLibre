using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Control;

/// <summary>
/// Options for MapLibre <c>AttributionControl</c>.
/// </summary>
public sealed class AttributionControlOptions
{
    /// <summary>
    /// When true, attribution collapses while the map moves (typically on narrow viewports).
    /// </summary>
    [JsonPropertyName("compact")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Compact { get; set; }

    /// <summary>
    /// Extra attribution text (string or list of strings).
    /// </summary>
    [JsonPropertyName("customAttribution")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? CustomAttribution { get; set; }
}
