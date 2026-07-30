using System.Text.Json.Serialization;
using DP.Blazor.MapLibre.Models.LayerFeatures;

namespace DP.Blazor.MapLibre.Models.Event;

public class MapTouchEvent : MapEvent
{
    [JsonPropertyName("point")]
    public PointLike? Point { get; set; }

    [JsonPropertyName("lngLat")]
    public LngLat? LngLat { get; set; }

    [JsonPropertyName("points")]
    public PointLike[] Points { get; set; } = [];

    [JsonPropertyName("lngLats")]
    public LngLat[] LngLats { get; set; } = [];

    [JsonPropertyName("features")]
    public LayerFeatureFeature[] Features { get; set; } = [];

    [JsonPropertyName("_defaultPrevented")]
    public bool? DefaultPrevented { get; set; }
}
