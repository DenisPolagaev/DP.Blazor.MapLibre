using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre;

/// <summary>
/// Loads plugin JavaScript modules after making sure the MapLibre GL JS bundle is available.
/// </summary>
public static class MapLibrePluginModules
{
    /// <summary>Static asset path of the core interop module, which owns <c>prepareMapLibreGl</c>.</summary>
    public const string CoreModulePath = "./_content/DP.Blazor.MapLibre/MapLibre.razor.js";

    /// <summary>Static asset path of the shared plugin helpers (per-map state, asset loading).</summary>
    public const string RuntimeModulePath = "./_content/DP.Blazor.MapLibre/PluginRuntime.js";

    /// <summary>
    /// Ensures <c>globalThis.maplibregl</c> is ready (idempotent), then imports the plugin module at
    /// <paramref name="modulePath"/>.
    /// </summary>
    public static async Task<IJSObjectReference> ImportAsync(IJSRuntime runtime, string modulePath)
    {
        ArgumentNullException.ThrowIfNull(runtime);
        ArgumentException.ThrowIfNullOrWhiteSpace(modulePath);

        await using (var core = await runtime.InvokeAsync<IJSObjectReference>("import", CoreModulePath))
        {
            await core.InvokeVoidAsync("prepareMapLibreGl", MapLibreGl.Version);
        }

        return await runtime.InvokeAsync<IJSObjectReference>("import", modulePath);
    }
}
