using System.Text.Json;
using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

/// <summary>
/// Valhalla API settings for <see cref="TerraDrawPlugin.AddValhallaControlAsync"/>.
/// </summary>
public sealed class ValhallaOptions
{
    [JsonPropertyName("url")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Url { get; set; }

    [JsonPropertyName("routingOptions")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public ValhallaRoutingOptions? RoutingOptions { get; set; }

    [JsonPropertyName("isochroneOptions")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public ValhallaIsochroneOptions? IsochroneOptions { get; set; }
}
