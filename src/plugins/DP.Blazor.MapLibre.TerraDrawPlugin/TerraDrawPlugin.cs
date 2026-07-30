using System.Collections.Concurrent;
using DP.Blazor.MapLibre;
using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

/// <summary>
/// MapLibre plugin wrapping <see href="https://github.com/watergis/maplibre-gl-terradraw">maplibre-gl-terradraw</see>.
/// </summary>
public sealed partial class TerraDrawPlugin : IMapLibrePlugin
{
    private IJSObjectReference _mapObject = null!;
    private IJSObjectReference _pluginJsModule = null!;
    private readonly ConcurrentDictionary<string, DotNetObjectReference<CallbackHandler>> _references = new();

    public async Task Initialize(IJSObjectReference map, IJSRuntime runtime)
    {
        _mapObject = map;
        _pluginJsModule = await runtime.InvokeAsync<IJSObjectReference>(
            "import", "./_content/TerraDrawPlugin/TerraDrawPlugin.js");
        await _pluginJsModule.InvokeVoidAsync("initialize", _mapObject);
    }

    public async ValueTask DisposeAsync()
    {
        foreach (var reference in _references.Values)
        {
            reference.Dispose();
        }

        _references.Clear();

        try
        {
            if (_pluginJsModule is not null)
            {
                await _pluginJsModule.InvokeVoidAsync("dispose");
                await _pluginJsModule.DisposeAsync();
            }
        }
        catch (JSDisconnectedException) { }
        catch (ObjectDisposedException) { }
    }

    private async Task<Listener> AddListenerAsync<T>(
        string method,
        Action<T> handler,
        string? controlId = null,
        int? throttleTime = null,
        params object?[] extraArgs)
    {
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
}
