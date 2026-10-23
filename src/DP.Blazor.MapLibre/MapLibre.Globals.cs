using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre;

public partial class MapLibre
{
    /// <summary>
    /// Registers the right-to-left text plugin used to shape Arabic and Hebrew labels. The plugin is page-wide:
    /// register it once, before right-to-left labels are rendered. MapLibre allows a single registration per page.
    /// </summary>
    /// <param name="url">URL of the RTL text plugin script.</param>
    /// <param name="lazy">When true, the plugin loads only when right-to-left text is first rendered.</param>
    public ValueTask SetRtlTextPlugin(string url, bool lazy = false)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(url);
        return InvokeMapJsVoidAsync("setRtlTextPlugin", url, lazy);
    }

    /// <summary>
    /// Returns the RTL text plugin status: <c>unavailable</c>, <c>deferred</c>, <c>requested</c>, <c>loading</c>,
    /// <c>loaded</c> or <c>error</c>.
    /// </summary>
    public ValueTask<string> GetRtlTextPluginStatus() =>
        InvokeMapJsAsync<string>("getRtlTextPluginStatus");
}