using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Sources;

/// <summary>
/// Options for <see cref="MapLibre.UpdateImageSourceAsync"/>.
/// </summary>
public sealed class UpdateImageSourceOptions
{
    /// <summary>
    /// New image URL.
    /// </summary>
    [JsonPropertyName("url")]
    public required string Url { get; set; }

    /// <summary>
    /// Optional new corner coordinates (TL, TR, BR, BL), each <c>[lng, lat]</c>.
    /// </summary>
    [JsonPropertyName("coordinates")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IReadOnlyList<IReadOnlyList<double>>? Coordinates { get; set; }
}
