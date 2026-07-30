using System.Text.Json;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

/// <summary>
/// Per-mode terra-draw constructor options keyed by mode name.
/// </summary>
public sealed class TerraDrawModeOptions : Dictionary<string, JsonElement>
{
}
