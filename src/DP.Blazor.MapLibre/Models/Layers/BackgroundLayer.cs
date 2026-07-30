using System.Text.Json.Nodes;
using System.Text.Json.Serialization;
using DP.Blazor.MapLibre.Converter;
using DP.Blazor.MapLibre.Models.Style;
using OneOf;

namespace DP.Blazor.MapLibre.Models.Layers;

public class BackgroundLayer : Layer<BackgroundLayerLayout, BackgroundLayerPaint>;

public class BackgroundLayerLayout
{
    [JsonPropertyName("visibility")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<string>))]
    public OneOf<string, JsonArray>? Visibility { get; set; }
}

public class BackgroundLayerPaint
{
    [JsonPropertyName("background-color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<string>))]
    public OneOf<string, JsonArray>? BackgroundColor { get; set; }

    [JsonPropertyName("background-pattern")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<object>))]
    public OneOf<object, JsonArray>? BackgroundPattern { get; set; }

    [JsonPropertyName("background-opacity")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<double>))]
    public OneOf<double, JsonArray>? BackgroundOpacity { get; set; }

    [JsonPropertyName("background-color-transition")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public StyleTransition? BackgroundColorTransition { get; set; }

    [JsonPropertyName("background-pattern-transition")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public StyleTransition? BackgroundPatternTransition { get; set; }

    [JsonPropertyName("background-opacity-transition")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public StyleTransition? BackgroundOpacityTransition { get; set; }
}
