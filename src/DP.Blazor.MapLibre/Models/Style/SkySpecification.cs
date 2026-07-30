using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Style;

public sealed class SkySpecification
{
    [JsonPropertyName("sky-color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? SkyColor { get; set; }

    [JsonPropertyName("sky-horizon-blend")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? SkyHorizonBlend { get; set; }

    [JsonPropertyName("horizon-color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? HorizonColor { get; set; }

    [JsonPropertyName("horizon-fog-blend")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? HorizonFogBlend { get; set; }

    [JsonPropertyName("fog-color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? FogColor { get; set; }

    [JsonPropertyName("fog-ground-blend")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? FogGroundBlend { get; set; }

    [JsonPropertyName("atmosphere-blend")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? AtmosphereBlend { get; set; }
}
