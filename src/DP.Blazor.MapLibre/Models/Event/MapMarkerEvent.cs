using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Event;

/// <summary>
/// Event payload for <see cref="MapMarker"/> and <see cref="MapPopup"/> listeners.
/// </summary>
public class MapMarkerEvent : MapEvent
{
    [JsonPropertyName("lngLat")]
    public LngLat? LngLat { get; set; }
}
