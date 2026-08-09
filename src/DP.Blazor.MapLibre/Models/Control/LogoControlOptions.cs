using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Control;

/// <summary>
/// Options for MapLibre <c>LogoControl</c>.
/// </summary>
public sealed class LogoControlOptions
{
    [JsonPropertyName("compact")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Compact { get; set; }
}
