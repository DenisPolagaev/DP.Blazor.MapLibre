using DP.Blazor.MapLibre.Models;
using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre;

public partial class MapLibre
{
    /// <summary>
    /// Registers the right-to-left text plugin used to shape Arabic and Hebrew labels. The plugin is page-wide:
    /// register it once, before right-to-left labels are rendered. MapLibre allows a single registration per page.
    /// </summary>
    /// <remarks>
    /// Deprecated by MapLibre GL JS 6.9: the engine shapes Arabic and Hebrew itself and no plugin is needed.
    /// Kept for hosts that still ship the plugin.
    /// </remarks>
    /// <param name="url">URL of the RTL text plugin script.</param>
    /// <param name="lazy">When true, the plugin loads only when right-to-left text is first rendered.</param>
    [Obsolete("MapLibre GL JS 6.9 shapes right-to-left text without a plugin; setRTLTextPlugin is deprecated and will be removed in the next major version.")]
    public ValueTask SetRtlTextPlugin(string url, bool lazy = false)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(url);
        return InvokeMapJsVoidAsync("setRtlTextPlugin", url, lazy);
    }

    /// <summary>
    /// Returns the RTL text plugin status: <c>unavailable</c>, <c>deferred</c>, <c>requested</c>, <c>loading</c>,
    /// <c>loaded</c> or <c>error</c>.
    /// </summary>
    [Obsolete("MapLibre GL JS 6.9 shapes right-to-left text without a plugin; getRTLTextPluginStatus is deprecated and will be removed in the next major version.")]
    public ValueTask<string> GetRtlTextPluginStatus() =>
        InvokeMapJsAsync<string>("getRtlTextPluginStatus");

    /// <summary>
    /// Registers a pass-through Trusted Types policy with MapLibre, so the library can keep creating DOM nodes on
    /// a page that enforces Trusted Types (MapLibre 6.19+). Page-wide, like the RTL plugin.
    /// </summary>
    /// <remarks>
    /// The policy name must be allowed by the page's <c>Content-Security-Policy: trusted-types &lt;name&gt;</c>
    /// directive. The call is idempotent for the same name. Pass <c>null</c> to detach the policy.
    /// </remarks>
    /// <param name="policyName">The Trusted Types policy name, or <c>null</c> to detach.</param>
    public ValueTask SetTrustedTypesPolicy(string? policyName) =>
        InvokeMapJsVoidAsync("setTrustedTypesPolicy", policyName);

    /// <summary>
    /// Registers a planar CRS with its own quad tile grid, so a style can select it by name
    /// (<c>projection: { type: "EPSG:2193" }</c>) — MapLibre 6.15+, experimental.
    /// </summary>
    /// <remarks>
    /// MapLibre does not reproject tile content for a registered CRS: every tile source of such a map must already
    /// be cut in the registered grid. The coordinate converter is a pair of JavaScript functions, so
    /// <see cref="ProjectionCrs.ForwardFunction"/> names functions registered on <c>globalThis</c>.
    /// </remarks>
    public ValueTask AddProjection(ProjectionCrs crs)
    {
        ArgumentNullException.ThrowIfNull(crs);
        return InvokeMapJsVoidAsync("addProjection", crs);
    }

    /// <summary>
    /// Removes a projection registered with <see cref="AddProjection"/> (MapLibre 6.15+, experimental). Maps that
    /// already use it keep working until their projection changes. Built-in names (no colon) cannot be removed.
    /// </summary>
    public ValueTask RemoveProjection(string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        return InvokeMapJsVoidAsync("removeProjection", name);
    }
}
