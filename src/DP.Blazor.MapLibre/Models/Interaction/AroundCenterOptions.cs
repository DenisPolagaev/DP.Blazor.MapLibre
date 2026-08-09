using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Interaction;

/// <summary>
/// Options for scroll/touch zoom and pitch handlers (<c>around: "center"</c>).
/// </summary>
public sealed class AroundCenterOptions
{
    /// <summary>
    /// Must be <c>"center"</c> for MapLibre to zoom/pitch around the map center.
    /// </summary>
    [JsonPropertyName("around")]
    public string Around { get; set; } = "center";
}
