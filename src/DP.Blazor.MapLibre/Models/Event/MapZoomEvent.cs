using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Event;

/// <summary>
/// Box-zoom events (<c>boxzoomstart</c>, <c>boxzoomend</c>, <c>boxzoomcancel</c>).
/// </summary>
public class MapZoomEvent : MapEvent
{
    [JsonPropertyName("boxZoomBounds")]
    public object? BoxZoomBounds { get; set; }
}
