using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models;

/// <summary>
/// Snapshot of whether each interaction handler is currently enabled.
/// </summary>
public sealed class MapInteractionHandlersState
{
    [JsonPropertyName("dragPan")]
    public bool DragPan { get; set; }

    [JsonPropertyName("dragRotate")]
    public bool DragRotate { get; set; }

    [JsonPropertyName("scrollZoom")]
    public bool ScrollZoom { get; set; }

    [JsonPropertyName("boxZoom")]
    public bool BoxZoom { get; set; }

    [JsonPropertyName("doubleClickZoom")]
    public bool DoubleClickZoom { get; set; }

    [JsonPropertyName("keyboard")]
    public bool Keyboard { get; set; }

    [JsonPropertyName("touchZoomRotate")]
    public bool TouchZoomRotate { get; set; }

    [JsonPropertyName("touchPitch")]
    public bool TouchPitch { get; set; }

    [JsonPropertyName("cooperativeGestures")]
    public bool CooperativeGestures { get; set; }
}
