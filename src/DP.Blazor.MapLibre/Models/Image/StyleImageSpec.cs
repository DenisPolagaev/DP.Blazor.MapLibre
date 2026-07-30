using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Image;

/// <summary>
/// Describes an image to ensure on the style (id + url + optional metadata).
/// </summary>
public sealed class StyleImageSpec
{
    [JsonPropertyName("id")]
    public required string Id { get; init; }

    [JsonPropertyName("url")]
    public required string Url { get; init; }

    [JsonPropertyName("options")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public StyleImageMetadata? Options { get; init; }
}
