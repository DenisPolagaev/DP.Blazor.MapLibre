using System.Text.Json;
using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

/// <summary>
/// Options for <see cref="TerraDrawPlugin.AddDrawControlAsync"/>.
/// Mirrors <c>TerradrawControlOptions</c> from maplibre-gl-terradraw.
/// </summary>
public sealed class TerradrawControlOptions
{
    [JsonPropertyName("modes")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IList<string>? Modes { get; set; }

    [JsonPropertyName("open")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Open { get; set; }

    [JsonPropertyName("showDeleteConfirmation")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? ShowDeleteConfirmation { get; set; }

    [JsonPropertyName("modeOptions")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public TerraDrawModeOptions? ModeOptions { get; set; }

    [JsonPropertyName("adapterOptions")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public TerraDrawAdapterOptions? AdapterOptions { get; set; }

    [JsonPropertyName("undoRedo")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public TerraDrawUndoRedoOptions? UndoRedo { get; set; }
}
