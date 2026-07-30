using System.Text.Json.Serialization;
using DP.Blazor.MapLibre.Models;

namespace DP.Blazor.MapLibre.Models.Camera;

/// <summary>
/// Transform state passed to <see cref="MapLibre.SetTransformConstrain"/>.
/// </summary>
public sealed class TransformConstrainState
{
    [JsonPropertyName("center")]
    public LngLat? Center { get; set; }

    [JsonPropertyName("zoom")]
    public double? Zoom { get; set; }

    [JsonPropertyName("bearing")]
    public double? Bearing { get; set; }

    [JsonPropertyName("pitch")]
    public double? Pitch { get; set; }

    [JsonPropertyName("roll")]
    public double? Roll { get; set; }

    [JsonPropertyName("elevation")]
    public double? Elevation { get; set; }
}
