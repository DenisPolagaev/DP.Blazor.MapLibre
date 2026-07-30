using DP.Blazor.MapLibre.Converter;
using DP.Blazor.MapLibre.Models.Style;
using OneOf;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Layers;

public class HeatMapLayer : Layer<HeatMapLayerLayout, HeatMapLayerPaint>
{
    /// <summary>
    /// Gets or sets the name of the source to be used for this layer.
    /// </summary>
    [JsonPropertyName("source")]
    public required string Source { get; set; }
}

public class HeatMapLayerLayout
{
    [JsonPropertyName("visibility")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<string>))]
    public OneOf<string, JsonArray>? Visibility { get; set; }
}
public class HeatMapLayerPaint
{
    /// <summary>
    /// Optional number in range [1, ∞). Units in pixels. Defaults to 30. Supports feature-state and interpolate expressions. Transitionable.
    /// Radius of influence of one heatmap point in pixels. Increasing the value makes the heatmap smoother, but less detailed.
    /// </summary>
    [JsonPropertyName("heatmap-radius")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<double>))]
    public OneOf<double, JsonArray>? HeatmapRadius { get; set; }

    /// <summary>
    /// Optional number in range [0, ∞). Defaults to 1. Supports feature-state and interpolate expressions.
    /// A measure of how much an individual point contributes to the heatmap. A value of 10 would be equivalent to having 10 points of weight 1 in the same spot. Especially useful when combined with clustering
    /// </summary>
    [JsonPropertyName("heatmap-weight")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<double>))]
    public OneOf<double, JsonArray>? HeatmapWeight { get; set; }

    /// <summary>
    ///  Optional number in range [0, ∞). Defaults to 1. Supports interpolate expressions. Transitionable.
    ///  Similar to heatmap-weight but controls the intensity of the heatmap globally. 
    ///  Primarily used for adjusting the heatmap based on zoom level.
    /// </summary>
    [JsonPropertyName("heatmap-intensity")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<double>))]
    public OneOf<double, JsonArray>? HeatmapIntensity { get; set; }

    /// <summary>
    /// Optional color. Defaults to ["interpolate",["linear"],["heatmap-density"],0,"rgba(0, 0, 255, 0)",0.1,"royalblue",0.3,"cyan",0.5,"lime",0.7,"yellow",1,"red"].
    /// Supports interpolate expressions.
    /// Defines the color of each pixel based on its density value in a heatmap. Should be an expression that uses ["heatmap-density"] as input.
    /// </summary>
    [JsonPropertyName("heatmap-color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<string>))]
    public OneOf<string, JsonArray>? HeatmapColor { get; set; }

    /// <summary>
    /// Optional number in range [0, 1]. Defaults to 1. Supports interpolate expressions. Transitionable.
    /// The global opacity at which the heatmap layer will be drawn.
    /// </summary>
    [JsonPropertyName("heatmap-opacity")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(OneOfJsonConverter<double>))]
    public OneOf<double, JsonArray>? HeatmapOpacity { get; set; }

    [JsonPropertyName("heatmap-radius-transition")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public StyleTransition? HeatmapRadiusTransition { get; set; }

    [JsonPropertyName("heatmap-intensity-transition")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public StyleTransition? HeatmapIntensityTransition { get; set; }

    [JsonPropertyName("heatmap-opacity-transition")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public StyleTransition? HeatmapOpacityTransition { get; set; }
}
