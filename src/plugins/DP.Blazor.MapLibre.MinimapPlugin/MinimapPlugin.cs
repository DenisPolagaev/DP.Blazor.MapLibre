using System.Text.Json;
using DP.Blazor.MapLibre.Models.Control;

namespace DP.Blazor.MapLibre.MinimapPlugin;

/// <summary>
/// MapLibre plugin that adds a minimap overview control. The control is adapted from
/// <see href="https://github.com/aesqe/mapboxgl-minimap">mapboxgl-minimap</see> (MIT).
/// Register with the map in <c>OnAfterRenderAsync</c>, then call <see cref="AddMinimapControlAsync"/>
/// after the map is ready (guard with <see cref="MapLibrePluginBase.IsInitialized"/> if using <c>OnLoad</c>).
/// </summary>
public sealed class MinimapPlugin : MapLibreControlPlugin<MinimapControlOptions>
{
    /// <inheritdoc />
    protected override string ModulePath => "./_content/MinimapPlugin/MinimapPlugin.js";

    /// <summary>
    /// Adds the minimap control to the map. Replaces a control added earlier by this plugin.
    /// </summary>
    public async ValueTask AddMinimapControlAsync(
        MinimapControlOptions? options = null,
        ControlPosition position = ControlPosition.BottomLeft)
    {
        await AddControlCoreAsync(options, ToPositionName(position));
    }

    /// <summary>
    /// Removes the minimap control from the map. Does nothing when no control was added.
    /// </summary>
    public async ValueTask RemoveMinimapControlAsync()
    {
        await RemoveControlCoreAsync();
    }

    // The JS side expects the MapLibre position name ("bottom-left"); the enum already carries that name
    // through its JSON converter, so the same serializer keeps both representations in sync.
    private static string ToPositionName(ControlPosition position) =>
        JsonSerializer.Serialize(position).Trim('"');
}
