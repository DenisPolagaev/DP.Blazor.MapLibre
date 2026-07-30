using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Event;

public class MapErrorEvent : MapEvent
{
    [JsonPropertyName("error")]
    public MapLibreError? Error { get; set; }
}
