using System.Text.Json.Serialization;
using DP.Blazor.MapLibre.Converter;

namespace DP.Blazor.MapLibre.Models.Style;

/// <summary>
/// A single font face declaration inside the MapLibre <c>font-faces</c> style property.
/// </summary>
public sealed class FontFace
{
    /// <summary>
    /// The URL of the font file.
    /// </summary>
    [JsonPropertyName("url")]
    public required string Url { get; set; }

    /// <summary>
    /// Optional Unicode ranges (for example <c>U+0900-097F</c>) this font file covers.
    /// When omitted, the file is used for every character.
    /// </summary>
    [JsonPropertyName("unicode-range")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string[]? UnicodeRange { get; set; }
}

/// <summary>
/// A value of the MapLibre <c>font-faces</c> map: either a single font URL string or a list of
/// <see cref="FontFace"/> declarations.
/// </summary>
[JsonConverter(typeof(FontFaceValueConverter))]
public sealed class FontFaceValue
{
    /// <summary>
    /// A single font URL, when the value is specified as a string.
    /// </summary>
    public string? Url { get; private init; }

    /// <summary>
    /// Font face declarations, when the value is specified as an array.
    /// </summary>
    public List<FontFace>? Faces { get; private init; }

    public static FontFaceValue FromUrl(string url) => new() { Url = url };

    public static FontFaceValue FromFaces(IEnumerable<FontFace> faces) => new() { Faces = [.. faces] };

    public static implicit operator FontFaceValue(string url) => FromUrl(url);

    public static implicit operator FontFaceValue(FontFace[] faces) => FromFaces(faces);

    public static implicit operator FontFaceValue(List<FontFace> faces) => FromFaces(faces);
}
