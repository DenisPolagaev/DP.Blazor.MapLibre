using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Camera;

/// <summary>
/// Options for <see cref="MapLibre.CalculateAnchoredCameraOptions"/> (MapLibre <c>AnchoredCameraOptions</c>, 6.11+).
/// Places a geographic anchor at a screen position without moving the map.
/// </summary>
public sealed class AnchoredCameraOptions
{
    /// <summary>
    /// Geographic location to anchor.
    /// </summary>
    [JsonPropertyName("anchorLocation")]
    public required LngLat AnchorLocation { get; set; }

    /// <summary>
    /// Screen position for the anchor.
    /// </summary>
    [JsonPropertyName("anchorScreenPoint")]
    public required PointLike AnchorScreenPoint { get; set; }

    /// <summary>
    /// Desired zoom level.
    /// </summary>
    [JsonPropertyName("zoom")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? Zoom { get; set; }
}
