using System.Text.Json.Serialization;
using DP.Blazor.MapLibre.Models;

namespace DP.Blazor.MapLibre.MinimapPlugin;

/// <summary>
/// Zoom level mapping used by the minimap control.
/// When parent zoom is greater than or equal to <see cref="ParentZoom"/>,
/// and minimap zoom is greater than or equal to <see cref="MinimapZoom"/>,
/// the minimap zoom is set to <see cref="TargetZoom"/>.
/// </summary>
public sealed record MinimapZoomLevel(int ParentZoom, int MinimapZoom, int TargetZoom);

/// <summary>
/// Configuration options for the MapLibre minimap control
/// (<see href="https://github.com/aesqe/mapboxgl-minimap">mapboxgl-minimap</see>).
/// </summary>
public sealed record MinimapControlOptions
{
    /// <summary>DOM id of the minimap container.</summary>
    [JsonPropertyName("id")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Id { get; init; }

    /// <summary>CSS width of the minimap (for example <c>320px</c>).</summary>
    [JsonPropertyName("width")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Width { get; init; }

    /// <summary>CSS height of the minimap (for example <c>180px</c>).</summary>
    [JsonPropertyName("height")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Height { get; init; }

    /// <summary>Map style URL or JSON for the minimap.</summary>
    [JsonPropertyName("style")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? Style { get; init; }

    /// <summary>Initial center of the minimap.</summary>
    [JsonPropertyName("center")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public LngLat? Center { get; init; }

    /// <summary>Initial zoom of the minimap.</summary>
    [JsonPropertyName("zoom")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? Zoom { get; init; }

    /// <summary>Optional max bounds for the minimap.</summary>
    [JsonPropertyName("maxBounds")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public LngLatBounds? MaxBounds { get; init; }

    /// <summary>Optional bounds used when resetting zoom.</summary>
    [JsonPropertyName("bounds")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public LngLatBounds? Bounds { get; init; }

    /// <summary>Parent/minimap zoom level mapping rules.</summary>
    [JsonPropertyName("zoomLevels")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IReadOnlyList<MinimapZoomLevel>? ZoomLevels { get; init; }

    /// <summary>Outline color of the viewport rectangle.</summary>
    [JsonPropertyName("lineColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? LineColor { get; init; }

    /// <summary>Outline width of the viewport rectangle.</summary>
    [JsonPropertyName("lineWidth")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? LineWidth { get; init; }

    /// <summary>Outline opacity of the viewport rectangle.</summary>
    [JsonPropertyName("lineOpacity")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? LineOpacity { get; init; }

    /// <summary>Fill color of the viewport rectangle.</summary>
    [JsonPropertyName("fillColor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? FillColor { get; init; }

    /// <summary>Fill opacity of the viewport rectangle.</summary>
    [JsonPropertyName("fillOpacity")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? FillOpacity { get; init; }

    /// <summary>Enable drag pan on the minimap.</summary>
    [JsonPropertyName("dragPan")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? DragPan { get; init; }

    /// <summary>Enable scroll zoom on the minimap.</summary>
    [JsonPropertyName("scrollZoom")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? ScrollZoom { get; init; }

    /// <summary>Enable box zoom on the minimap.</summary>
    [JsonPropertyName("boxZoom")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? BoxZoom { get; init; }

    /// <summary>Enable drag rotate on the minimap.</summary>
    [JsonPropertyName("dragRotate")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? DragRotate { get; init; }

    /// <summary>Enable keyboard interaction on the minimap.</summary>
    [JsonPropertyName("keyboard")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Keyboard { get; init; }

    /// <summary>Enable double-click zoom on the minimap.</summary>
    [JsonPropertyName("doubleClickZoom")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? DoubleClickZoom { get; init; }

    /// <summary>Enable touch zoom/rotate on the minimap.</summary>
    [JsonPropertyName("touchZoomRotate")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? TouchZoomRotate { get; init; }
}
