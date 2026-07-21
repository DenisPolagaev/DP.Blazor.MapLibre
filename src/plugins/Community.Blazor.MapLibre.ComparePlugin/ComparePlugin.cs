using System.Collections.Concurrent;
using Community.Blazor.MapLibre;
using Microsoft.JSInterop;

namespace Community.Blazor.MapLibre.ComparePlugin;

/// <summary>
/// Wraps <a href="https://github.com/maplibre/maplibre-gl-compare">maplibre-gl-compare</a>
/// to swipe and sync between two MapLibre maps.
/// </summary>
public sealed class ComparePlugin : IAsyncDisposable
{
    private IJSObjectReference _pluginJsModule = null!;
    private bool _initialized;
    private readonly ConcurrentDictionary<Guid, DotNetObjectReference<CallbackHandler>> _references = new();

    public async Task InitializeAsync(IJSRuntime runtime)
    {
        if (_initialized)
        {
            return;
        }

        _pluginJsModule = await runtime.InvokeAsync<IJSObjectReference>(
            "import", "./_content/MapComparePlugin/ComparePlugin.js");
        await _pluginJsModule.InvokeVoidAsync("initialize");
        _initialized = true;
    }

    /// <summary>
    /// Returns true when both map instances are registered in MapLibre.razor.js.
    /// </summary>
    public async Task<bool> MapsReadyAsync(string beforeMapId, string afterMapId)
    {
        EnsureInitialized();
        return await _pluginJsModule.InvokeAsync<bool>("mapsReady", beforeMapId, afterMapId);
    }

    /// <summary>
    /// Creates a compare control between two maps inside the given container.
    /// </summary>
    public async Task CreateAsync(
        string beforeMapId,
        string afterMapId,
        string containerSelector,
        CompareOptions? options = null)
    {
        EnsureInitialized();

        options ??= new CompareOptions();
        await _pluginJsModule.InvokeAsync<double>(
            "createCompare",
            beforeMapId,
            afterMapId,
            containerSelector,
            new
            {
                mousemove = options.MouseMove,
                orientation = options.Orientation.ToString().ToLowerInvariant(),
                handle = BuildHandlePayload(options.Handle),
            });
    }

    private static object BuildHandlePayload(CompareHandleOptions? handle)
    {
        handle ??= new CompareHandleOptions();

        return new
        {
            cssClass = handle.CssClass,
            size = handle.Size,
            backgroundColor = handle.BackgroundColor,
            borderColor = handle.BorderColor,
            borderWidth = handle.BorderWidth,
            borderRadius = handle.BorderRadius,
            boxShadow = handle.BoxShadow,
            lineColor = handle.LineColor,
            lineWidth = handle.LineWidth,
            icon = handle.Icon.ToString().ToLowerInvariant(),
            customIconHtml = handle.CustomIconHtml,
        };
    }

    public Task CreateAsync(
        MapLibre beforeMap,
        MapLibre afterMap,
        string containerSelector,
        CompareOptions? options = null) =>
        CreateAsync(beforeMap.MapId, afterMap.MapId, containerSelector, options);

    public async ValueTask<double> GetCurrentPositionAsync()
    {
        EnsureInitialized();
        return await _pluginJsModule.InvokeAsync<double>("getCurrentPosition");
    }

    public async ValueTask<CompareSliderState> GetSliderStateAsync()
    {
        EnsureInitialized();
        return await _pluginJsModule.InvokeAsync<CompareSliderState>("getSliderState");
    }

    public async Task SetSliderAsync(double position)
    {
        EnsureInitialized();
        await _pluginJsModule.InvokeVoidAsync("setSlider", position);
    }

    public async Task<Listener> AddSlideEndListener<T>(Action<T> handler)
    {
        EnsureInitialized();

        var callback = new CallbackHandler(_pluginJsModule, "slideend", handler, typeof(T));
        var reference = DotNetObjectReference.Create(callback);
        _references.TryAdd(Guid.NewGuid(), reference);

        await _pluginJsModule.InvokeVoidAsync("onSlideEnd", reference);

        return new Listener(callback);
    }

    public async Task RemoveAsync()
    {
        if (!_initialized)
        {
            return;
        }

        await _pluginJsModule.InvokeVoidAsync("remove");
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

        _initialized = false;
    }

    private void EnsureInitialized()
    {
        if (!_initialized)
        {
            throw new InvalidOperationException("Call InitializeAsync(IJSRuntime) before using the compare plugin.");
        }
    }
}
