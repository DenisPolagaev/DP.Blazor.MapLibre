using System.Text.Json.Nodes;
using System.Text.Json.Serialization;
using DP.Blazor.MapLibre.Converter;
using DP.Blazor.MapLibre.Models.Style;
using OneOf;

namespace DP.Blazor.MapLibre.Models.Layers;

public class HillShadeLayer : Layer<HillShadeLayerLayout, HillShadeLayerPaint>
{
    [JsonPropertyName("source")]
    public required string Source { get; set; }
}

public class HillShadeLayerLayout
{
    [JsonPropertyName("visibility")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<string>))]
    public OneOf<string, JsonArray>? Visibility { get; set; }
}

public class HillShadeLayerPaint
{
    [JsonPropertyName("hillshade-illumination-direction")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<double>))]
    public OneOf<double, JsonArray>? HillshadeIlluminationDirection { get; set; }

    [JsonPropertyName("hillshade-illumination-anchor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<string>))]
    public OneOf<string, JsonArray>? HillshadeIlluminationAnchor { get; set; }

    [JsonPropertyName("hillshade-exaggeration")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<double>))]
    public OneOf<double, JsonArray>? HillshadeExaggeration { get; set; }

    [JsonPropertyName("hillshade-shadow-color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<string>))]
    public OneOf<string, JsonArray>? HillshadeShadowColor { get; set; }

    [JsonPropertyName("hillshade-highlight-color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<string>))]
    public OneOf<string, JsonArray>? HillshadeHighlightColor { get; set; }

    [JsonPropertyName("hillshade-accent-color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<string>))]
    public OneOf<string, JsonArray>? HillshadeAccentColor { get; set; }

    [JsonPropertyName("hillshade-method")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<string>))]
    public OneOf<string, JsonArray>? HillshadeMethod { get; set; }

    [JsonPropertyName("hillshade-illumination-altitude")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<double>))]
    public OneOf<double, JsonArray>? HillshadeIlluminationAltitude { get; set; }

    [JsonPropertyName("resampling")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<string>))]
    public OneOf<string, JsonArray>? Resampling { get; set; }

    [JsonPropertyName("hillshade-exaggeration-transition")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public StyleTransition? HillshadeExaggerationTransition { get; set; }

    [JsonPropertyName("hillshade-shadow-color-transition")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public StyleTransition? HillshadeShadowColorTransition { get; set; }

    [JsonPropertyName("hillshade-highlight-color-transition")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public StyleTransition? HillshadeHighlightColorTransition { get; set; }

    [JsonPropertyName("hillshade-accent-color-transition")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public StyleTransition? HillshadeAccentColorTransition { get; set; }
}
