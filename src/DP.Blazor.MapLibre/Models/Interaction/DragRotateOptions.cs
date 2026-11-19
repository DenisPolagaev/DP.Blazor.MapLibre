using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Interaction;

/// <summary>
/// Options for the MapLibre <c>DragRotateHandler</c> / <c>MapOptions.dragRotate</c> (MapLibre 6.15+),
/// which replaced the deprecated <c>aroundCenter</c> option.
/// </summary>
public sealed class DragRotateOptions
{
    /// <summary>
    /// The point the map turns and tilts around: <c>"pointer"</c> (the point under the cursor) or
    /// <c>"center"</c> (the map center).
    /// </summary>
    [JsonPropertyName("around")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Around { get; set; }

    /// <summary>
    /// How the camera moves while rotating around the center: <c>"circular"</c> (default) or <c>"linear"</c>.
    /// Ignored when <see cref="Around"/> is <c>"pointer"</c>.
    /// </summary>
    [JsonPropertyName("movement")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Movement { get; set; }
}
