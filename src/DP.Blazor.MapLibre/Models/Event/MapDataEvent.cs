using System.Text.Json.Serialization;
using DP.Blazor.MapLibre.Models;

namespace DP.Blazor.MapLibre.Models.Event;

public class MapDataEvent : MapEvent
{
    [JsonPropertyName("dataType")]
    public string? DataType { get; set; }

    [JsonPropertyName("isSourceLoaded")]
    public bool? IsSourceLoaded { get; set; }

    [JsonPropertyName("sourceId")]
    public string? SourceId { get; set; }

    [JsonPropertyName("sourceDataType")]
    public string? SourceDataType { get; set; }

    [JsonPropertyName("sourceDataChanged")]
    public bool? SourceDataChanged { get; set; }

    [JsonPropertyName("source")]
    public object? Source { get; set; }

    [JsonPropertyName("tile")]
    public TileId? Tile { get; set; }
}
