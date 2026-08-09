using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Control;

/// <summary>
/// Options for MapLibre <c>FullscreenControl</c>.
/// </summary>
public sealed class FullscreenControlOptions
{
    /// <summary>
    /// When true, uses CSS-based fullscreen instead of the native Fullscreen API.
    /// </summary>
    [JsonPropertyName("pseudo")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Pseudo { get; set; }

    /// <summary>
    /// Optional container element id for fullscreen.
    /// </summary>
    [JsonPropertyName("container")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Container { get; set; }
}
