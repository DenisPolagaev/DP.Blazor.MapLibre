using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Event;

public class MapLibreError
{
    [JsonPropertyName("message")]
    public string? Message { get; set; }

    [JsonPropertyName("status")]
    public int? Status { get; set; }
}
