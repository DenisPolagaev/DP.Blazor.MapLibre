using System.Text.Json.Serialization;
using DP.Blazor.MapLibre.Converter;
using DP.Blazor.MapLibre.Models.Padding;
using OneOf;

namespace DP.Blazor.MapLibre.Models.Camera;

public class CameraForBoundsOptions : CameraOptions
{
    /// <summary>
    /// The maximum zoom level to allow when the camera would transition to the specified bounds.
    /// </summary>
    [JsonPropertyName("maxZoom")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public decimal? MaxZoom { get; set; }
    /// <summary>
    /// The center of the given bounds relative to the map's center, measured in pixels.
    /// </summary>
    [JsonPropertyName("offset")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public PointLike? Offset { get; set; }
    /// <summary>
    /// The amount of padding in pixels to add to the given bounds.
    /// </summary>
    [JsonPropertyName("padding")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<decimal, PaddingOptions>))]
    public OneOf<decimal, PaddingOptions>? Padding { get; set; }

    /// <summary>
    /// When <c>true</c>, <see cref="Padding"/> is the map's total padding: the camera is fitted into the padded
    /// viewport instead of the padding being added to the one the map already has (MapLibre 6.12+).
    /// </summary>
    [JsonPropertyName("absolutePadding")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? AbsolutePadding { get; set; }
}
