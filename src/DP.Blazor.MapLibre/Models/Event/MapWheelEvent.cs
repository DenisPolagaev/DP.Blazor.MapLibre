using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Event;

public class MapWheelEvent : MapEvent
{
    [JsonPropertyName("deltaY")]
    public double? DeltaY { get; set; }

    [JsonPropertyName("deltaX")]
    public double? DeltaX { get; set; }

    [JsonPropertyName("_defaultPrevented")]
    public bool? DefaultPrevented { get; set; }
}
