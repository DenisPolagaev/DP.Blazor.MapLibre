using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

/// <summary>
/// Options for <see cref="TerraDrawPlugin.AddDrawControlAsync"/>.
/// Mirrors <c>TerradrawControlOptions</c> from maplibre-gl-terradraw.
/// </summary>
public sealed class TerradrawControlOptions : TerraDrawControlOptionsBase
{
    [JsonPropertyName("undoRedo")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public TerraDrawUndoRedoOptions? UndoRedo { get; init; }
}
