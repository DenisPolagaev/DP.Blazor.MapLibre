using System.Text.Json;
using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

/// <summary>
/// Options for <see cref="TerraDrawPlugin.AddValhallaControlAsync"/>.
/// Mirrors <c>ValhallaControlOptions</c> from maplibre-gl-terradraw.
/// </summary>
public sealed class ValhallaControlOptions
{
    [JsonPropertyName("modes")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IList<string>? Modes { get; set; }

    [JsonPropertyName("open")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Open { get; set; }

    [JsonPropertyName("showDeleteConfirmation")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? ShowDeleteConfirmation { get; set; }

    [JsonPropertyName("modeOptions")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public TerraDrawModeOptions? ModeOptions { get; set; }

    [JsonPropertyName("adapterOptions")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public TerraDrawAdapterOptions? AdapterOptions { get; set; }

    [JsonPropertyName("valhallaOptions")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public ValhallaOptions? ValhallaOptions { get; set; }

    [JsonPropertyName("routingLineLayerNodeLabelSpec")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public JsonElement? RoutingLineLayerNodeLabelSpec { get; set; }

    [JsonPropertyName("routingLineLayerNodeSpec")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public JsonElement? RoutingLineLayerNodeSpec { get; set; }

    [JsonPropertyName("timeIsochronePolygonLayerSpec")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public JsonElement? TimeIsochronePolygonLayerSpec { get; set; }

    [JsonPropertyName("timeIsochroneLineLayerSpec")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public JsonElement? TimeIsochroneLineLayerSpec { get; set; }

    [JsonPropertyName("timeIsochroneLabelLayerSpec")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public JsonElement? TimeIsochroneLabelLayerSpec { get; set; }

    [JsonPropertyName("distanceIsochronePolygonLayerSpec")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public JsonElement? DistanceIsochronePolygonLayerSpec { get; set; }

    [JsonPropertyName("distanceIsochroneLineLayerSpec")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public JsonElement? DistanceIsochroneLineLayerSpec { get; set; }

    [JsonPropertyName("distanceIsochroneLabelLayerSpec")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public JsonElement? DistanceIsochroneLabelLayerSpec { get; set; }
}
