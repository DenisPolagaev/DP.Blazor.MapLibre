using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Layers;

public sealed class CustomLayerOptions
{
    [JsonPropertyName("renderingMode")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? RenderingMode { get; set; } = "2d";

    [JsonPropertyName("minzoom")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public float? MinZoom { get; set; }

    [JsonPropertyName("maxzoom")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public float? MaxZoom { get; set; }
}