using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

/// <summary>
/// Event payload from maplibre-gl-terradraw controls.
/// </summary>
public sealed class TerraDrawEventArgs
{
    [JsonPropertyName("mode")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Mode { get; set; }

    [JsonPropertyName("feature")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object[]? Feature { get; set; }

    [JsonPropertyName("deletedIds")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object[]? DeletedIds { get; set; }
}
