using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Sources;

/// <summary>
/// Warp mode for an image source (MapLibre <c>ImageSource.setWarp</c>, 6.5+).
/// </summary>
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ImageSourceWarp
{
    /// <summary>Automatically picks the best warp for the current projection.</summary>
    [JsonStringEnumMemberName("auto")]
    Auto,

    /// <summary>Projects the image with a full perspective transform.</summary>
    [JsonStringEnumMemberName("perspective")]
    Perspective,

    /// <summary>Projects the image as a flat, affine quad.</summary>
    [JsonStringEnumMemberName("flat")]
    Flat,
}
