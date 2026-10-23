using System.Text.Json;
using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

/// <summary>
/// Options for <see cref="TerraDrawPlugin.AddValhallaControlAsync"/>.
/// Mirrors <c>ValhallaControlOptions</c> from maplibre-gl-terradraw.
/// </summary>
public sealed class ValhallaControlOptions : TerraDrawControlOptionsBase
{
    [JsonPropertyName("valhallaOptions")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public ValhallaOptions? ValhallaOptions { get; init; }

    [JsonPropertyName("routingLineLayerNodeLabelSpec")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public JsonElement? RoutingLineLayerNodeLabelSpec { get; init; }

    [JsonPropertyName("routingLineLayerNodeSpec")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public JsonElement? RoutingLineLayerNodeSpec { get; init; }

    [JsonPropertyName("timeIsochronePolygonLayerSpec")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public JsonElement? TimeIsochronePolygonLayerSpec { get; init; }

    [JsonPropertyName("timeIsochroneLineLayerSpec")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public JsonElement? TimeIsochroneLineLayerSpec { get; init; }

    [JsonPropertyName("timeIsochroneLabelLayerSpec")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public JsonElement? TimeIsochroneLabelLayerSpec { get; init; }

    [JsonPropertyName("distanceIsochronePolygonLayerSpec")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public JsonElement? DistanceIsochronePolygonLayerSpec { get; init; }

    [JsonPropertyName("distanceIsochroneLineLayerSpec")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public JsonElement? DistanceIsochroneLineLayerSpec { get; init; }

    [JsonPropertyName("distanceIsochroneLabelLayerSpec")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public JsonElement? DistanceIsochroneLabelLayerSpec { get; init; }
}
