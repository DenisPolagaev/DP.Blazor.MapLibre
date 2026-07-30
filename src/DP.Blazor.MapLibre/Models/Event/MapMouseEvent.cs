using System.Text.Json.Serialization;
using DP.Blazor.MapLibre.Models.LayerFeatures;

namespace DP.Blazor.MapLibre.Models.Event;

public class MapMouseEvent : MapEvent
{
    [JsonPropertyName("point")]
    public required PointLike Point { get; set; }

    [JsonPropertyName("lngLat")]
    public required LngLat LngLat { get; set; }

    [JsonPropertyName("_defaultPrevented")]
    public bool? DefaultPrevented { get; set; }

    [JsonPropertyName("features")]
    public LayerFeatureFeature[] Features { get; set; } = [];
}
