using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Style;

public sealed class TerrainSpecification
{
    [JsonPropertyName("source")]
    public required string Source { get; set; }

    [JsonPropertyName("exaggeration")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? Exaggeration { get; set; }
}
