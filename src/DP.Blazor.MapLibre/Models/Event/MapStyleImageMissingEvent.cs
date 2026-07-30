using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Event;

public class MapStyleImageMissingEvent : MapEvent
{
    [JsonPropertyName("id")]
    public string? Id { get; set; }
}
