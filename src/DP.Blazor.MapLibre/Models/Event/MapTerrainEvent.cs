using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Event;

public class MapTerrainEvent : MapEvent
{
    [JsonPropertyName("terrain")]
    public object? Terrain { get; set; }
}
