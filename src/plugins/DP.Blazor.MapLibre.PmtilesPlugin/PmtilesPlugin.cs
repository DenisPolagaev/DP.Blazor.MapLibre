using DP.Blazor.MapLibre;
using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre.PmtilesPlugin;

/// <summary>
/// Registers the <c>pmtiles://</c> protocol on MapLibre GL JS
/// (<see href="https://github.com/protomaps/PMTiles">protomaps/PMTiles</see>).
/// Register with the map before adding sources whose URL starts with <c>pmtiles://</c>.
/// The protocol is process-global; one successful initialize is enough for every map on the page.
/// </summary>
public sealed class PmtilesPlugin : MapLibrePluginBase
{
    #region Fields

    private IJSObjectReference? _pluginJsModule;

    #endregion

    #region Lifecycle Overrides

    protected override async Task OnInitializeAsync(
        IJSObjectReference map,
        IJSRuntime runtime,
        CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(map);
        _pluginJsModule = await runtime.InvokeAsync<IJSObjectReference>(
            "import",
            cancellationToken,
            "./_content/PmtilesPlugin/PmtilesPlugin.js");
        await _pluginJsModule.InvokeVoidAsync("initialize", cancellationToken);
    }

    protected override ValueTask OnDetachAsync(CancellationToken cancellationToken) =>
        ValueTask.CompletedTask;

    protected override async ValueTask OnDisposeAsync()
    {
        var pluginModule = _pluginJsModule;
        if (pluginModule is null)
        {
            return;
        }

        try
        {
            await pluginModule.InvokeVoidAsync("dispose");
            await pluginModule.DisposeAsync();
        }
        finally
        {
            _pluginJsModule = null;
        }
    }

    #endregion
}
