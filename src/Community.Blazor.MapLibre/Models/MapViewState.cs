using System.Text.Json.Serialization;

namespace Community.Blazor.MapLibre.Models;

/// <summary>
/// Snapshot of the map camera in a single round-trip.
/// </summary>
public sealed class MapViewState
{
    [JsonPropertyName("center")]
    public LngLat Center { get; set; } = new();

    [JsonPropertyName("zoom")]
    public double Zoom { get; set; }

    [JsonPropertyName("bearing")]
    public double Bearing { get; set; }

    [JsonPropertyName("pitch")]
    public double Pitch { get; set; }
}
