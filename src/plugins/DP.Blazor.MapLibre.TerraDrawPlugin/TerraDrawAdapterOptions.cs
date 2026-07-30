using System.Text.Json;
using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

/// <summary>
/// MapLibre GL adapter options for terra-draw controls.
/// </summary>
public sealed class TerraDrawAdapterOptions
{
    [JsonPropertyName("renderBelowLayerId")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? RenderBelowLayerId { get; set; }

    [JsonPropertyName("prefixId")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? PrefixId { get; set; }
}
