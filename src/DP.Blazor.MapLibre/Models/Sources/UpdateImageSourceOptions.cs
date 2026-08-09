using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Sources;

/// <summary>
/// Options for <see cref="MapLibre.UpdateImageSourceAsync"/>.
/// Prefer URL for network images, or <see cref="MapLibre.UpdateImageSourceWithImageAsync"/> for decoded bitmaps.
/// </summary>
public sealed class UpdateImageSourceOptions
{
    /// <summary>
    /// New image URL. Required unless updating via <see cref="MapLibre.UpdateImageSourceWithImageAsync"/>.
    /// </summary>
    [JsonPropertyName("url")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Url { get; set; }

    /// <summary>
    /// Optional new corner coordinates (TL, TR, BR, BL), each <c>[lng, lat]</c>.
    /// </summary>
    [JsonPropertyName("coordinates")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IReadOnlyList<IReadOnlyList<double>>? Coordinates { get; set; }
}
