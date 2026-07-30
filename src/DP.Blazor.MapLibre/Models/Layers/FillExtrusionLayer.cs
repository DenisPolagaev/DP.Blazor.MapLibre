using System.Text.Json.Nodes;
using System.Text.Json.Serialization;
using DP.Blazor.MapLibre.Converter;
using DP.Blazor.MapLibre.Models.Style;
using OneOf;

namespace DP.Blazor.MapLibre.Models.Layers;

public class FillExtrusionLayer : Layer<FillExtrusionLayerLayout, FillExtrusionLayerPaint>
{
    [JsonPropertyName("source")]
    public required string Source { get; set; }
}

public class FillExtrusionLayerLayout
{
    [JsonPropertyName("visibility")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<string>))]
    public OneOf<string, JsonArray>? Visibility { get; set; }
}

public class FillExtrusionLayerPaint
{
    [JsonPropertyName("fill-extrusion-opacity")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<double>))]
    public OneOf<double, JsonArray>? FillExtrusionOpacity { get; set; }

    [JsonPropertyName("fill-extrusion-color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<string>))]
    public OneOf<string, JsonArray>? FillExtrusionColor { get; set; }

    [JsonPropertyName("fill-extrusion-translate")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<double[]>))]
    public OneOf<double[], JsonArray>? FillExtrusionTranslate { get; set; }

    [JsonPropertyName("fill-extrusion-translate-anchor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<string>))]
    public OneOf<string, JsonArray>? FillExtrusionTranslateAnchor { get; set; }

    [JsonPropertyName("fill-extrusion-pattern")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<object>))]
    public OneOf<object, JsonArray>? FillExtrusionPattern { get; set; }

    [JsonPropertyName("fill-extrusion-height")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<double>))]
    public OneOf<double, JsonArray>? FillExtrusionHeight { get; set; }

    [JsonPropertyName("fill-extrusion-base")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<double>))]
    public OneOf<double, JsonArray>? FillExtrusionBase { get; set; }

    [JsonPropertyName("fill-extrusion-vertical-gradient")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<bool>))]
    public OneOf<bool, JsonArray>? FillExtrusionVerticalGradient { get; set; }

    [JsonPropertyName("fill-extrusion-opacity-transition")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public StyleTransition? FillExtrusionOpacityTransition { get; set; }

    [JsonPropertyName("fill-extrusion-color-transition")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public StyleTransition? FillExtrusionColorTransition { get; set; }

    [JsonPropertyName("fill-extrusion-translate-transition")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public StyleTransition? FillExtrusionTranslateTransition { get; set; }

    [JsonPropertyName("fill-extrusion-pattern-transition")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public StyleTransition? FillExtrusionPatternTransition { get; set; }

    [JsonPropertyName("fill-extrusion-height-transition")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public StyleTransition? FillExtrusionHeightTransition { get; set; }

    [JsonPropertyName("fill-extrusion-base-transition")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public StyleTransition? FillExtrusionBaseTransition { get; set; }
}
