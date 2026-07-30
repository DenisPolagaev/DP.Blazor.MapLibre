using System.Text.Json.Nodes;
using System.Text.Json.Serialization;
using DP.Blazor.MapLibre.Converter;
using DP.Blazor.MapLibre.Models.Style;
using OneOf;

namespace DP.Blazor.MapLibre.Models.Layers;

public class CircleLayer : Layer<CircleLayerLayout, CircleLayerPaint>
{
    /// <summary>
    /// Gets or sets the name of the source to be used for this layer.
    /// </summary>
    [JsonPropertyName("source")]
    public required string Source { get; set; }
}

public class CircleLayerLayout
{
    /// <summary>
    /// Sorts features in ascending order based on this value. Features with a higher sort key appear above features with a lower sort key.
    /// </summary>
    [JsonPropertyName("circle-sort-key")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<double>))]
    public OneOf<double, JsonArray>? CircleSortKey { get; set; }

    /// <summary>
    /// Controls whether this layer is displayed.
    /// </summary>
    [JsonPropertyName("visibility")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<string>))]
    public OneOf<string, JsonArray>? Visibility { get; set; }
}

public class CircleLayerPaint
{
    [JsonPropertyName("circle-radius")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<double>))]
    public OneOf<double, JsonArray>? CircleRadius { get; set; }

    [JsonPropertyName("circle-color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<string>))]
    public OneOf<string, JsonArray>? CircleColor { get; set; }

    [JsonPropertyName("circle-blur")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<double>))]
    public OneOf<double, JsonArray>? CircleBlur { get; set; }

    [JsonPropertyName("circle-opacity")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<double>))]
    public OneOf<double, JsonArray>? CircleOpacity { get; set; }

    [JsonPropertyName("circle-translate")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<double[]>))]
    public OneOf<double[], JsonArray>? CircleTranslate { get; set; }

    [JsonPropertyName("circle-translate-anchor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<MapViewport>))]
    public OneOf<MapViewport, JsonArray>? CircleTranslateAnchor { get; set; }

    [JsonPropertyName("circle-pitch-scale")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<MapViewport>))]
    public OneOf<MapViewport, JsonArray>? CirclePitchScale { get; set; }

    [JsonPropertyName("circle-pitch-alignment")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<MapViewport>))]
    public OneOf<MapViewport, JsonArray>? CirclePitchAlignment { get; set; }

    [JsonPropertyName("circle-stroke-width")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<double>))]
    public OneOf<double, JsonArray>? CircleStrokeWidth { get; set; }

    [JsonPropertyName("circle-stroke-color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<string>))]
    public OneOf<string, JsonArray>? CircleStrokeColor { get; set; }

    [JsonPropertyName("circle-stroke-opacity")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<double>))]
    public OneOf<double, JsonArray>? CircleStrokeOpacity { get; set; }

    /// <summary>
    /// Mapbox-style extension; may be ignored by MapLibre GL JS. Controls emissive light intensity on source features.
    /// </summary>
    [JsonPropertyName("circle-emissive-strength")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<double>))]
    public OneOf<double, JsonArray>? CircleEmissiveStrength { get; set; }

    [JsonPropertyName("circle-radius-transition")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public StyleTransition? CircleRadiusTransition { get; set; }

    [JsonPropertyName("circle-color-transition")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public StyleTransition? CircleColorTransition { get; set; }

    [JsonPropertyName("circle-blur-transition")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public StyleTransition? CircleBlurTransition { get; set; }

    [JsonPropertyName("circle-opacity-transition")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public StyleTransition? CircleOpacityTransition { get; set; }

    [JsonPropertyName("circle-translate-transition")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public StyleTransition? CircleTranslateTransition { get; set; }

    [JsonPropertyName("circle-stroke-width-transition")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public StyleTransition? CircleStrokeWidthTransition { get; set; }

    [JsonPropertyName("circle-stroke-color-transition")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public StyleTransition? CircleStrokeColorTransition { get; set; }

    [JsonPropertyName("circle-stroke-opacity-transition")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public StyleTransition? CircleStrokeOpacityTransition { get; set; }
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum MapViewport
{
    [JsonStringEnumMemberName("map")]
    Map,

    [JsonStringEnumMemberName("viewport")]
    Viewport
}
