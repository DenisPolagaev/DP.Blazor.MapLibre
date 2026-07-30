using System.Text.Json;
using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

/// <summary>
/// Options for <see cref="TerraDrawPlugin.AddMeasureControlAsync"/>.
/// Mirrors <c>MeasureControlOptions</c> from maplibre-gl-terradraw.
/// </summary>
public sealed class MeasureControlOptions
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

    [JsonPropertyName("undoRedo")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public TerraDrawUndoRedoOptions? UndoRedo { get; set; }

    [JsonPropertyName("pointLayerLabelSpec")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public JsonElement? PointLayerLabelSpec { get; set; }

    [JsonPropertyName("lineLayerLabelSpec")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public JsonElement? LineLayerLabelSpec { get; set; }

    [JsonPropertyName("routingLineLayerNodeSpec")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public JsonElement? RoutingLineLayerNodeSpec { get; set; }

    [JsonPropertyName("polygonLayerSpec")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public JsonElement? PolygonLayerSpec { get; set; }

    [JsonPropertyName("measureUnitType")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? MeasureUnitType { get; set; }

    [JsonPropertyName("distancePrecision")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? DistancePrecision { get; set; }

    [JsonPropertyName("distanceUnit")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? DistanceUnit { get; set; }

    [JsonPropertyName("areaPrecision")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? AreaPrecision { get; set; }

    [JsonPropertyName("areaUnit")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? AreaUnit { get; set; }

    [JsonPropertyName("measureUnitSymbols")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Dictionary<string, string>? MeasureUnitSymbols { get; set; }

    [JsonPropertyName("computeElevation")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? ComputeElevation { get; set; }

    [JsonPropertyName("terrainSource")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public TerrainSource? TerrainSource { get; set; }

    [JsonPropertyName("elevationCacheConfig")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public ElevationCacheConfig? ElevationCacheConfig { get; set; }
}
