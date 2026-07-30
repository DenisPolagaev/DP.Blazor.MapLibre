using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models;

/// <summary>
/// Options passed to <see cref="MapLibre.SetStyle"/>.
/// </summary>
public sealed class SetStyleOptions
{
    /// <summary>
    /// When <c>true</c>, the new style is diffed against the current style and only changed
    /// properties are updated. Requires a style JSON object (not a URL).
    /// MapLibre emits <c>style.load</c> when the diff is applied (5.16+).
    /// </summary>
    [JsonPropertyName("diff")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Diff { get; set; }

    /// <summary>
    /// Whether to validate the style against the MapLibre Style Specification.
    /// </summary>
    [JsonPropertyName("validate")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Validate { get; set; }

    /// <summary>
    /// Defines a CSS font-family for locally overriding generation of glyphs in the
    /// <c>CJK Unified Ideographs</c> and <c>Hangul Syllables</c> ranges.
    /// </summary>
    [JsonPropertyName("localIdeographFontFamily")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? LocalIdeographFontFamily { get; set; }
}
