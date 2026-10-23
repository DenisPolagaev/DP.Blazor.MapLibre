using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

/// <summary>
/// Options shared by every maplibre-gl-terradraw control (draw, measure and Valhalla).
/// </summary>
public abstract class TerraDrawControlOptionsBase
{
    [JsonPropertyName("modes")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IList<string>? Modes { get; init; }

    [JsonPropertyName("open")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Open { get; init; }

    [JsonPropertyName("showDeleteConfirmation")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? ShowDeleteConfirmation { get; init; }

    [JsonPropertyName("modeOptions")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public TerraDrawModeOptions? ModeOptions { get; init; }

    [JsonPropertyName("adapterOptions")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public TerraDrawAdapterOptions? AdapterOptions { get; init; }
}
