using System.Text.Json;
using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

/// <summary>
/// Undo/redo configuration for terra-draw controls.
/// </summary>
public sealed class TerraDrawUndoRedoOptions
{
    [JsonPropertyName("modeLevel")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public JsonElement? ModeLevel { get; set; }

    [JsonPropertyName("sessionLevel")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public JsonElement? SessionLevel { get; set; }

    [JsonPropertyName("keyboardShortcuts")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public JsonElement? KeyboardShortcuts { get; set; }
}
