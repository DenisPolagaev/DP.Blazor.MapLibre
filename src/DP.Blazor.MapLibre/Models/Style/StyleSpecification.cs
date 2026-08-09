using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;
using DP.Blazor.MapLibre.Models.Layers;
using DP.Blazor.MapLibre.Models.Sources;

namespace DP.Blazor.MapLibre.Models.Style;

/// <summary>
/// Root MapLibre style document (<c>StyleSpecification</c>).
/// Use with <see cref="MapLibre.SetStyle(StyleSpecification, SetStyleOptions?)"/> or <see cref="MapOptions.Style"/>.
/// </summary>
public sealed class StyleSpecification
{
    [JsonPropertyName("version")]
    public int Version { get; set; } = 8;

    [JsonPropertyName("name")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Name { get; set; }

    [JsonPropertyName("glyphs")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Glyphs { get; set; }

    [JsonPropertyName("sprite")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Sprite { get; set; }

    [JsonPropertyName("sources")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Dictionary<string, ISource>? Sources { get; set; }

    [JsonPropertyName("layers")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public List<Layer>? Layers { get; set; }

    [JsonPropertyName("center")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double[]? Center { get; set; }

    [JsonPropertyName("zoom")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? Zoom { get; set; }

    [JsonPropertyName("bearing")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? Bearing { get; set; }

    [JsonPropertyName("pitch")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? Pitch { get; set; }

    [JsonPropertyName("light")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public LightSpecification? Light { get; set; }

    [JsonPropertyName("sky")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public SkySpecification? Sky { get; set; }

    [JsonPropertyName("terrain")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public TerrainSpecification? Terrain { get; set; }

    [JsonPropertyName("projection")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public ProjectionSpecification? Projection { get; set; }

    /// <summary>
    /// Serializes to a <see cref="JsonObject"/> suitable for <see cref="MapLibre.SetStyle"/>.
    /// </summary>
    public JsonObject ToJsonObject(JsonSerializerOptions? options = null)
    {
        var node = JsonSerializer.SerializeToNode(this, options ?? MapLibreJsonSerializer.Options);
        return node as JsonObject
            ?? throw new InvalidOperationException("StyleSpecification did not serialize to a JSON object.");
    }
}
