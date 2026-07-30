using System.Collections.Concurrent;
using DP.Blazor.MapLibre;
using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre.ComparePlugin;

/// <summary>
/// Wraps <a href="https://github.com/maplibre/maplibre-gl-compare">maplibre-gl-compare</a>
/// to swipe and sync between two MapLibre maps.
/// Cross-map plugin: owned by the host, not registered via <see cref="MapLibre.RegisterPlugin"/>.
/// </summary>
public sealed class ComparePlugin : IAsyncDisposable
{
    #region Fields

    private IJSObjectReference? _pluginJsModule;
    private MapLibrePluginLifecycleState _state = MapLibrePluginLifecycleState.Created;
    private readonly ConcurrentDictionary<Guid, DotNetObjectReference<CallbackHandler>> _references = new();

    #endregion

    #region Properties

    /// <summary>Current lifecycle stage.</summary>
    public MapLibrePluginLifecycleState State => _state;

    /// <summary>Whether JS initialize completed.</summary>
    public bool IsInitialized =>
        _state is MapLibrePluginLifecycleState.Initialized or MapLibrePluginLifecycleState.Attached;

    /// <summary>Whether the compare control is currently attached.</summary>
    public bool IsAttached => _state is MapLibrePluginLifecycleState.Attached;

    #endregion

    #region Public API

    public async Task InitializeAsync(IJSRuntime runtime, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(runtime);
        if (_state is MapLibrePluginLifecycleState.Disposed)
        {
            throw new ObjectDisposedException(nameof(ComparePlugin));
        }

        if (IsInitialized)
        {
            return;
        }

        _pluginJsModule = await runtime.InvokeAsync<IJSObjectReference>(
            "import",
            cancellationToken,
            "./_content/MapComparePlugin/ComparePlugin.js");
        await _pluginJsModule.InvokeVoidAsync("initialize", cancellationToken);
        _state = MapLibrePluginLifecycleState.Initialized;
    }

    /// <summary>
    /// Returns true when both map instances are registered in MapLibre.razor.js.
    /// </summary>
    public async Task<bool> MapsReadyAsync(string beforeMapId, string afterMapId)
    {
        EnsureInitialized();
        return await _pluginJsModule!.InvokeAsync<bool>("mapsReady", beforeMapId, afterMapId);
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
        await _pluginJsModule!.InvokeAsync<double>(
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
        _state = MapLibrePluginLifecycleState.Attached;
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
        return await _pluginJsModule!.InvokeAsync<double>("getCurrentPosition");
    }

    public async ValueTask<CompareSliderState> GetSliderStateAsync()
    {
        EnsureInitialized();
        return await _pluginJsModule!.InvokeAsync<CompareSliderState>("getSliderState");
    }

    public async Task SetSliderAsync(double position)
    {
        EnsureInitialized();
        await _pluginJsModule!.InvokeVoidAsync("setSlider", position);
    }

    public async Task<Listener> AddSlideEndListener<T>(Action<T> handler)
    {
        EnsureInitialized();

        var callback = new CallbackHandler(_pluginJsModule!, "slideend", handler, typeof(T));
        var reference = DotNetObjectReference.Create(callback);
        _references.TryAdd(Guid.NewGuid(), reference);

        await _pluginJsModule!.InvokeVoidAsync("onSlideEnd", reference);

        return new Listener(callback);
    }

    public async Task RemoveAsync()
    {
        if (_state is not MapLibrePluginLifecycleState.Attached || _pluginJsModule is null)
        {
            if (_state is MapLibrePluginLifecycleState.Attached)
            {
                _state = MapLibrePluginLifecycleState.Initialized;
            }

            return;
        }

        try
        {
            await _pluginJsModule.InvokeVoidAsync("remove");
        }
        catch (JSDisconnectedException)
        {
        }
        catch (ObjectDisposedException)
        {
        }
        catch (JSException)
        {
        }
        finally
        {
            if (_state is MapLibrePluginLifecycleState.Attached)
            {
                _state = MapLibrePluginLifecycleState.Initialized;
            }
        }
    }

    public async ValueTask DisposeAsync()
    {
        if (_state is MapLibrePluginLifecycleState.Disposed)
        {
            return;
        }

        foreach (var reference in _references.Values)
        {
            reference.Dispose();
        }

        _references.Clear();

        try
        {
            if (_state is MapLibrePluginLifecycleState.Attached && _pluginJsModule is not null)
            {
                await _pluginJsModule.InvokeVoidAsync("remove");
            }

            if (_pluginJsModule is not null)
            {
                await _pluginJsModule.InvokeVoidAsync("dispose");
                await _pluginJsModule.DisposeAsync();
            }
        }
        catch (JSDisconnectedException)
        {
        }
        catch (ObjectDisposedException)
        {
        }
        catch (JSException)
        {
        }
        finally
        {
            _pluginJsModule = null;
            _state = MapLibrePluginLifecycleState.Disposed;
        }
    }

    #endregion

    #region Private Helpers

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

    private void EnsureInitialized()
    {
        if (_state is MapLibrePluginLifecycleState.Disposed)
        {
            throw new ObjectDisposedException(nameof(ComparePlugin));
        }

        if (!IsInitialized)
        {
            throw new InvalidOperationException("Call InitializeAsync(IJSRuntime) before using the compare plugin.");
        }
    }

    #endregion
}
