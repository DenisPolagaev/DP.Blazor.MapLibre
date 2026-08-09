using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Sources;

/// <summary>
/// Options for <see cref="MapLibre.SetClusterOptionsAsync"/> / <see cref="MapLibre.GetClusterOptionsAsync"/>.
/// Matches MapLibre <c>SetClusterOptions</c> / <c>GetClusterOptions</c> (cluster, clusterMaxZoom, clusterRadius).
/// </summary>
public sealed class SetClusterOptions
{
    [JsonPropertyName("cluster")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Cluster { get; set; }

    [JsonPropertyName("clusterRadius")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? ClusterRadius { get; set; }

    [JsonPropertyName("clusterMaxZoom")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? ClusterMaxZoom { get; set; }
}
