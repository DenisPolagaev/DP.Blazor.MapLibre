using System.Text.Json;
using DP.Blazor.MapLibre.Models.Control;
using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

public sealed partial class TerraDrawPlugin
{
    [Obsolete("Use AddDrawControlAsync instead.")]
    public async Task<string> AddTerraDrawToolAsync(bool singleFeature = false)
    {
        TerradrawControlOptions? options = null;
        if (singleFeature)
        {
            using var document = JsonDocument.Parse(
                """
                {
                  "polygon": { "pointerDistance": -1 },
                  "linestring": { "pointerDistance": -1 }
                }
                """);
            options = new TerradrawControlOptions
            {
                Open = true,
                ModeOptions = JsonSerializer.Deserialize<TerraDrawModeOptions>(document.RootElement.GetRawText()),
            };
        }

        return await AddDrawControlAsync(options);
    }

    [Obsolete("Use StopDrawingAsync instead.")]
    public async Task StopTerraDrawAsync(string? controlId = null) => await StopDrawingAsync(controlId);

    [Obsolete("Use SetModeAsync instead.")]
    public async Task SetTerraDrawModeAsync(string mode, string? controlId = null) =>
        await SetModeAsync(mode, controlId);

    [Obsolete("Use GetSnapshotAsync instead.")]
    public async ValueTask<object[]> GetTerraDrawGeometriesAsync(string? controlId = null) =>
        await GetSnapshotAsync(controlId);
}
