using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Event;

/// <summary>
/// Common DOM event fields from MapLibre <c>originalEvent</c> (mouse, touch, wheel).
/// </summary>
public class MapDomEvent
{
    [JsonPropertyName("type")]
    public string? Type { get; set; }

    [JsonPropertyName("button")]
    public int? Button { get; set; }

    [JsonPropertyName("buttons")]
    public int? Buttons { get; set; }

    [JsonPropertyName("ctrlKey")]
    public bool? CtrlKey { get; set; }

    [JsonPropertyName("shiftKey")]
    public bool? ShiftKey { get; set; }

    [JsonPropertyName("altKey")]
    public bool? AltKey { get; set; }

    [JsonPropertyName("metaKey")]
    public bool? MetaKey { get; set; }

    [JsonPropertyName("clientX")]
    public double? ClientX { get; set; }

    [JsonPropertyName("clientY")]
    public double? ClientY { get; set; }
}
