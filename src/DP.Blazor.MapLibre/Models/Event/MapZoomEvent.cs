using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Event;

/// <summary>
/// Box-zoom events (<c>boxzoomstart</c>, <c>boxzoomend</c>, <c>boxzoomcancel</c>).
/// MapLibre GL JS 6 names this <c>MapBoxZoomEvent</c> (see <see cref="MapBoxZoomEvent"/>).
/// </summary>
public class MapZoomEvent : MapEvent
{
    /// <summary>
    /// Not populated by MapLibre GL JS 6 event payloads; retained for binary compatibility.
    /// </summary>
    [Obsolete("MapLibre MapBoxZoomEvent does not include boxZoomBounds; this property stays unused.")]
    [JsonPropertyName("boxZoomBounds")]
    public object? BoxZoomBounds { get; set; }
}
