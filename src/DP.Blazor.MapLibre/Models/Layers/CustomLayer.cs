using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Layers;

/// <summary>
/// Style-spec custom layer entry (rendering is handled via <see cref="CustomLayerHandler"/> at runtime).
/// </summary>
public class CustomLayer : Layer
{
    [JsonPropertyName("renderingMode")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? RenderingMode { get; set; } = "2d";
}
