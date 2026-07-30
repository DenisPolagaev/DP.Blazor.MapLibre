using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Style;

/// <summary>
/// Transition options for paint property animations (MapLibre style spec *-transition).
/// </summary>
public class StyleTransition
{
    [JsonPropertyName("duration")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? Duration { get; set; }

    [JsonPropertyName("delay")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? Delay { get; set; }
}
