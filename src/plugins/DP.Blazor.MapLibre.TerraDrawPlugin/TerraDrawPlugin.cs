using System.Collections.Concurrent;
using DP.Blazor.MapLibre;
using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

/// <summary>
/// MapLibre plugin wrapping <see href="https://github.com/watergis/maplibre-gl-terradraw">maplibre-gl-terradraw</see>.
/// </summary>
public sealed partial class TerraDrawPlugin : MapLibrePluginBase
{
    #region Fields

    private IJSObjectReference _mapObject = null!;
    private IJSObjectReference _pluginJsModule = null!;
    private readonly ConcurrentDictionary<string, DotNetObjectReference<CallbackHandler>> _references = new();

    #endregion

    #region Lifecycle Overrides

    protected override async Task OnInitializeAsync(
        IJSObjectReference map,
        IJSRuntime runtime,
        CancellationToken cancellationToken)
    {
        _mapObject = map;
        _pluginJsModule = await runtime.InvokeAsync<IJSObjectReference>(
            "import",
            cancellationToken,
            "./_content/TerraDrawPlugin/TerraDrawPlugin.js");
        await _pluginJsModule.InvokeVoidAsync("initialize", cancellationToken, _mapObject);
    }

    protected override async ValueTask OnDetachAsync(CancellationToken cancellationToken)
    {
        if (_pluginJsModule is null || !IsAttached)
        {
            return;
        }

        await _pluginJsModule.InvokeVoidAsync("removeAllControls", cancellationToken);
    }

    protected override async ValueTask OnDisposeAsync()
    {
        foreach (var reference in _references.Values)
        {
            reference.Dispose();
        }

        _references.Clear();

        var pluginModule = _pluginJsModule;
        if (pluginModule is null)
        {
            _mapObject = null!;
            return;
        }

        try
        {
            await pluginModule.InvokeVoidAsync("dispose");
            await pluginModule.DisposeAsync();
        }
        finally
        {
            _pluginJsModule = null!;
            _mapObject = null!;
        }
    }

    #endregion

    #region Private Helpers

    private async Task<Listener> AddListenerAsync<T>(
        string method,
        Action<T> handler,
        string? controlId = null,
        int? throttleTime = null,
        params object?[] extraArgs)
    {
        EnsureInitialized();

        var callback = new CallbackHandler(
            _pluginJsModule,
            string.Empty,
            method,
            handler,
            typeof(T),
            "offListener");
        var reference = DotNetObjectReference.Create(callback);

        object?[] args = method switch
        {
            "onTerraDrawEvent" when throttleTime.HasValue =>
                [..extraArgs, reference, controlId, throttleTime.Value],
            "onTerraDrawEvent" =>
                [..extraArgs, reference, controlId],
            _ when throttleTime.HasValue =>
                [..extraArgs, reference, throttleTime.Value, controlId],
            _ =>
                [..extraArgs, reference, controlId],
        };

        var listenerId = await _pluginJsModule.InvokeAsync<string>(method, args);
        callback.Attach(reference, listenerId, id => _references.TryRemove(id, out _));
        _references.TryAdd(listenerId, reference);
        return new Listener(callback);
    }

    #endregion
}
