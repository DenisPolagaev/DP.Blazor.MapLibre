using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

public sealed class CleanStyleOptions
{
    [JsonPropertyName("excludeTerraDrawLayers")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? ExcludeTerraDrawLayers { get; set; }

    [JsonPropertyName("onlyTerraDrawLayers")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? OnlyTerraDrawLayers { get; set; }

    [JsonPropertyName("sourceIds")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IList<string>? SourceIds { get; set; }

    [JsonPropertyName("prefixId")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? PrefixId { get; set; }
}
