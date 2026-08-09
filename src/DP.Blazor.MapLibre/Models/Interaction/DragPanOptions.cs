using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Interaction;

/// <summary>
/// Options for MapLibre <c>DragPanHandler</c> / <c>MapOptions.dragPan</c>.
/// </summary>
public sealed class DragPanOptions
{
    [JsonPropertyName("linearity")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? Linearity { get; set; }

    [JsonPropertyName("deceleration")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? Deceleration { get; set; }

    [JsonPropertyName("maxSpeed")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? MaxSpeed { get; set; }
}
