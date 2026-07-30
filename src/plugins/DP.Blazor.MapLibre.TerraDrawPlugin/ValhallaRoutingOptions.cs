using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

public sealed class ValhallaRoutingOptions
{
    [JsonPropertyName("costingModel")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? CostingModel { get; set; }

    [JsonPropertyName("distanceUnit")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? DistanceUnit { get; set; }
}
