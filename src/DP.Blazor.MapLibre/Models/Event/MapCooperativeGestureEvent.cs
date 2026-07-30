using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Event;

public class MapCooperativeGestureEvent : MapEvent
{
    [JsonPropertyName("gestureType")]
    public string? GestureType { get; set; }
}
