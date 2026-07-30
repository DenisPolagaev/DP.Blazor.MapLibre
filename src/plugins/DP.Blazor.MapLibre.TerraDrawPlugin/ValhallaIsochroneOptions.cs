using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

public sealed class ValhallaIsochroneOptions
{
    [JsonPropertyName("timeCostingModel")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? TimeCostingModel { get; set; }

    [JsonPropertyName("distanceCostingModel")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? DistanceCostingModel { get; set; }

    [JsonPropertyName("contours")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IList<ValhallaContour>? Contours { get; set; }
}
