using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Event;

public class MapErrorEvent : MapEvent
{
    [JsonPropertyName("error")]
    public MapLibreError? Error { get; set; }

    // Additional context that helps distinguish between style-load vs source/tile-load errors.
    // MapLibre ErrorEvent may include some of these fields depending on the failing resource.
    [JsonPropertyName("resourceType")]
    public string? ResourceType { get; set; }

    [JsonPropertyName("sourceId")]
    public string? SourceId { get; set; }

    [JsonPropertyName("dataType")]
    public string? DataType { get; set; }
}
