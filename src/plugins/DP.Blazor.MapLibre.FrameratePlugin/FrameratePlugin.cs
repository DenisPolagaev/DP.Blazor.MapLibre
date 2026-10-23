using System.Text.Json;
using DP.Blazor.MapLibre.Models.Control;

namespace DP.Blazor.MapLibre.FrameratePlugin;

/// <summary>
/// MapLibre plugin that adds a frame rate performance control. The control is adapted from
/// <see href="https://github.com/mapbox/mapbox-gl-framerate">mapbox-gl-framerate</see> (ISC).
/// Register with the map in <c>OnAfterRenderAsync</c>, then call <see cref="AddFramerateControlAsync"/>
/// after the map is ready (guard with <see cref="MapLibrePluginBase.IsInitialized"/> if using <c>OnLoad</c>).
/// </summary>
public sealed class FrameratePlugin : MapLibreControlPlugin<FramerateControlOptions>
{
    /// <inheritdoc />
    protected override string ModulePath => "./_content/FrameratePlugin/FrameratePlugin.js";

    /// <summary>
    /// Adds the frame rate control to the map. Replaces a control added earlier by this plugin.
    /// </summary>
    public async ValueTask AddFramerateControlAsync(
        FramerateControlOptions? options = null,
        ControlPosition position = ControlPosition.TopRight)
    {
        await AddControlCoreAsync(options, ToPositionName(position));
    }

    /// <summary>
    /// Removes the frame rate control from the map. Does nothing when no control was added.
    /// </summary>
    public async ValueTask RemoveFramerateControlAsync()
    {
        await RemoveControlCoreAsync();
    }

    // The JS side expects the MapLibre position name ("top-right"); the enum already carries that name
    // through its JSON converter, so the same serializer keeps both representations in sync.
    private static string ToPositionName(ControlPosition position) =>
        JsonSerializer.Serialize(position).Trim('"');
}
