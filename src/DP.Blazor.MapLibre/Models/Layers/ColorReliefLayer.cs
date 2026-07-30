using System.Text.Json.Nodes;
using System.Text.Json.Serialization;
using DP.Blazor.MapLibre.Converter;
using DP.Blazor.MapLibre.Models.Style;
using OneOf;

namespace DP.Blazor.MapLibre.Models.Layers;

public class ColorReliefLayer : Layer<ColorReliefLayerLayout, ColorReliefLayerPaint>
{
    [JsonPropertyName("source")]
    public required string Source { get; set; }
}

public class ColorReliefLayerLayout
{
    [JsonPropertyName("visibility")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<string>))]
    public OneOf<string, JsonArray>? Visibility { get; set; }
}

public class ColorReliefLayerPaint
{
    [JsonPropertyName("color-relief-color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<object>))]
    public OneOf<object, JsonArray>? ColorReliefColor { get; set; }

    [JsonPropertyName("color-relief-opacity")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<double>))]
    public OneOf<double, JsonArray>? ColorReliefOpacity { get; set; }

    [JsonPropertyName("resampling")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<string>))]
    public OneOf<string, JsonArray>? Resampling { get; set; }

    [JsonPropertyName("color-relief-opacity-transition")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public StyleTransition? ColorReliefOpacityTransition { get; set; }
}
