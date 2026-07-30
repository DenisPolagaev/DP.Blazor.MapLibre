using System.Text.Json.Serialization;
using DP.Blazor.MapLibre.Models.Feature;

namespace DP.Blazor.MapLibre.Models.Sources;

/// <summary>
/// Incremental update payload for <see cref="MapLibre.UpdateSourceData"/>.
/// Operations are applied in order: remove, add, update.
/// </summary>
public sealed class GeoJsonSourceDiff
{
    [JsonPropertyName("add")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IReadOnlyList<FeatureFeature>? Add { get; set; }

    [JsonPropertyName("remove")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IReadOnlyList<object>? Remove { get; set; }

    [JsonPropertyName("removeAll")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? RemoveAll { get; set; }

    [JsonPropertyName("update")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IReadOnlyList<GeoJsonFeatureDiff>? Update { get; set; }
}

/// <summary>
/// Describes changes to a single GeoJSON feature in a source diff.
/// </summary>
public sealed class GeoJsonFeatureDiff
{
    [JsonPropertyName("id")]
    public required object Id { get; set; }

    [JsonPropertyName("newGeometry")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IGeometry? NewGeometry { get; set; }

    [JsonPropertyName("addOrUpdateProperties")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IReadOnlyList<GeoJsonPropertyUpdate>? AddOrUpdateProperties { get; set; }

    [JsonPropertyName("removeProperties")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IReadOnlyList<string>? RemoveProperties { get; set; }
}

/// <summary>
/// A property to add or update on a feature during a GeoJSON source diff.
/// </summary>
public sealed class GeoJsonPropertyUpdate
{
    [JsonPropertyName("key")]
    public required string Key { get; set; }

    [JsonPropertyName("value")]
    public object? Value { get; set; }
}
