using System.Text.Json;
using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

/// <summary>
/// Options for <see cref="TerraDrawPlugin.AddMeasureControlAsync"/>.
/// Mirrors <c>MeasureControlOptions</c> from maplibre-gl-terradraw.
/// </summary>
public sealed class MeasureControlOptions : TerraDrawControlOptionsBase
{
    [JsonPropertyName("undoRedo")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public TerraDrawUndoRedoOptions? UndoRedo { get; init; }

    [JsonPropertyName("pointLayerLabelSpec")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public JsonElement? PointLayerLabelSpec { get; init; }

    [JsonPropertyName("lineLayerLabelSpec")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public JsonElement? LineLayerLabelSpec { get; init; }

    [JsonPropertyName("routingLineLayerNodeSpec")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public JsonElement? RoutingLineLayerNodeSpec { get; init; }

    [JsonPropertyName("polygonLayerSpec")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public JsonElement? PolygonLayerSpec { get; init; }

    /// <summary>Unit system: <c>metric</c> or <c>imperial</c> (see <see cref="TerraDrawMeasureUnit"/>).</summary>
    [JsonPropertyName("measureUnitType")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? MeasureUnitType { get; init; }

    [JsonPropertyName("distancePrecision")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? DistancePrecision { get; init; }

    [JsonPropertyName("distanceUnit")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? DistanceUnit { get; init; }

    [JsonPropertyName("areaPrecision")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? AreaPrecision { get; init; }

    [JsonPropertyName("areaUnit")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? AreaUnit { get; init; }

    [JsonPropertyName("measureUnitSymbols")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Dictionary<string, string>? MeasureUnitSymbols { get; init; }

    [JsonPropertyName("computeElevation")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? ComputeElevation { get; init; }

    [JsonPropertyName("terrainSource")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public TerrainSource? TerrainSource { get; init; }

    [JsonPropertyName("elevationCacheConfig")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public ElevationCacheConfig? ElevationCacheConfig { get; init; }
}
