using System.Collections.Concurrent;
using DP.Blazor.MapLibre;
using Microsoft.Extensions.Logging;
using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre.ComparePlugin;

/// <summary>
/// Wraps <a href="https://github.com/maplibre/maplibre-gl-compare">maplibre-gl-compare</a>
/// to swipe and sync between two MapLibre maps.
/// </summary>
/// <remarks>
/// <para>
/// Register the plugin with the <b>before</b> map: <c>await beforeMap.RegisterPlugin(plugin)</c>.
/// The map supplies the JavaScript runtime, and it detaches and disposes the plugin when the plugin is
/// unregistered or the map is disposed. The <b>after</b> map is addressed by id in
/// <see cref="CreateAsync(string,string,string,CompareOptions?)"/>.
/// </para>
/// </remarks>
public sealed class ComparePlugin : MapLibreJsPlugin
{
    #region Fields

    /// <summary>Distinguishes JavaScript state of plugin instances that share one map.</summary>
    private readonly string _instanceKey = Guid.NewGuid().ToString("N");

    /// <summary>Slide-end subscriptions of the current attachment, keyed by the JavaScript listener id.</summary>
    private readonly ConcurrentDictionary<string, CallbackHandler> _listeners = new(StringComparer.Ordinal);

    /// <summary>Before-map id whose JavaScript state this instance has created; null before the first create.</summary>
    private string? _controlMapId;

    #endregion

    #region Protected Overrides

    /// <inheritdoc />
    protected override string ModulePath => "./_content/MapComparePlugin/ComparePlugin.js";

    /// <inheritdoc />
    protected override ValueTask OnDetachModuleAsync(CancellationToken cancellationToken) =>
        DetachControlAsync(cancellationToken);

    /// <inheritdoc />
    protected override async ValueTask OnModuleDisposingAsync()
    {
        try
        {
            if (_controlMapId is not null)
            {
                await Module.InvokeVoidAsync("dispose", _controlMapId, _instanceKey);
            }
        }
        finally
        {
            _controlMapId = null;
            await ReleaseListenersAsync();
        }
    }

    #endregion

    #region Public API

    /// <summary>
    /// Returns true when both map instances are registered in MapLibre.razor.js.
    /// The plugin must be registered with the before map first.
    /// </summary>
    public async Task<bool> MapsReadyAsync(string beforeMapId, string afterMapId)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(beforeMapId);
        ArgumentException.ThrowIfNullOrWhiteSpace(afterMapId);
        EnsureInitialized();

        return await Module.InvokeAsync<bool>("mapsReady", beforeMapId, afterMapId);
    }

    /// <summary>
    /// Creates the compare control between two maps inside the given container. An existing control of this plugin
    /// is replaced. Slide-end subscriptions survive re-creation on the same before map.
    /// </summary>
    /// <param name="beforeMapId">Id of the map that is swiped away (the bound map).</param>
    /// <param name="afterMapId">Id of the map revealed by the slider.</param>
    /// <param name="containerSelector">CSS selector of the container that holds both maps.</param>
    /// <param name="options">Optional control and handle options.</param>
    public async Task CreateAsync(
        string beforeMapId,
        string afterMapId,
        string containerSelector,
        CompareOptions? options = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(beforeMapId);
        ArgumentException.ThrowIfNullOrWhiteSpace(afterMapId);
        ArgumentException.ThrowIfNullOrWhiteSpace(containerSelector);

        EnsureInitialized();

        if (_controlMapId is not null && !string.Equals(_controlMapId, beforeMapId, StringComparison.Ordinal))
        {
            // The JavaScript state belongs to another before map: release it before switching maps.
            await RemoveAsync();
            await Module.InvokeVoidAsync("dispose", _controlMapId, _instanceKey);
            _controlMapId = null;
        }

        options ??= new CompareOptions();
        await Module.InvokeAsync<double>(
            "createCompare",
            beforeMapId,
            afterMapId,
            _instanceKey,
            containerSelector,
            new
            {
                mousemove = options.MouseMove,
                orientation = options.Orientation.ToString().ToLowerInvariant(),
                handle = BuildHandlePayload(options.Handle),
            });

        _controlMapId = beforeMapId;
        MarkAttached();
    }

    /// <summary>Creates the compare control between two <see cref="MapLibre"/> components.</summary>
    public Task CreateAsync(
        MapLibre beforeMap,
        MapLibre afterMap,
        string containerSelector,
        CompareOptions? options = null) =>
        CreateAsync(beforeMap.MapId, afterMap.MapId, containerSelector, options);

    /// <summary>Returns the current slider position in pixels, or 0 when no control was created.</summary>
    public async ValueTask<double> GetCurrentPositionAsync()
    {
        EnsureInitialized();
        if (_controlMapId is null)
        {
            return 0;
        }

        return await Module.InvokeAsync<double>("getCurrentPosition", _controlMapId, _instanceKey);
    }

    /// <summary>Returns the slider state, or a default state when no control was created.</summary>
    public async ValueTask<CompareSliderState> GetSliderStateAsync()
    {
        EnsureInitialized();
        if (_controlMapId is null)
        {
            return new CompareSliderState(0, 0, 0, 0.5);
        }

        return await Module.InvokeAsync<CompareSliderState>("getSliderState", _controlMapId, _instanceKey);
    }

    /// <summary>Moves the slider to the given position in pixels. No-op when no control was created.</summary>
    public async Task SetSliderAsync(double position)
    {
        EnsureInitialized();
        if (_controlMapId is null)
        {
            return;
        }

        await Module.InvokeVoidAsync("setSlider", _controlMapId, _instanceKey, position);
    }

    /// <summary>
    /// Subscribes to the compare control's <c>slideend</c> event.
    /// </summary>
    /// <remarks>
    /// Requires an attached compare control: <see cref="CreateAsync(string,string,string,CompareOptions?)"/> must have
    /// completed, otherwise <see cref="InvalidOperationException"/> is thrown. Subscriptions are dropped by
    /// <see cref="RemoveAsync"/> and by disposal, so subscribe again after re-creating the control on another map.
    /// Dispose the returned <see cref="Listener"/> (or call <see cref="Listener.Remove"/>) to unsubscribe.
    /// </remarks>
    /// <typeparam name="T">Event payload type, deserialized from the JavaScript event (for example <see cref="SlideEndEvent"/>).</typeparam>
    /// <param name="handler">Callback invoked on every slide end.</param>
    public async Task<Listener> AddSlideEndListener<T>(Action<T> handler)
    {
        ArgumentNullException.ThrowIfNull(handler);
        EnsureInitialized();

        if (!IsAttached || _controlMapId is null)
        {
            throw new InvalidOperationException(
                "Create the compare control with CreateAsync before subscribing to slide-end events.");
        }

        var callback = new CallbackHandler(Module, _controlMapId, "slideend", handler, typeof(T));
        var reference = DotNetObjectReference.Create(callback);
        var listenerId = await Module.InvokeAsync<string>("onSlideEnd", _controlMapId, _instanceKey, reference);

        callback.Attach(reference, listenerId, id => _listeners.TryRemove(id, out _));
        _listeners[listenerId] = callback;

        return new Listener(callback);
    }

    /// <summary>
    /// Removes the compare control and its slide-end subscriptions. The plugin stays initialized and can create a
    /// control again. Safe to call when nothing is attached.
    /// </summary>
    public async Task RemoveAsync() => await DetachAsync();

    #endregion

    #region Private Helpers

    /// <summary>
    /// Removes the control in JavaScript first (which also detaches the slide-end listeners), then releases the
    /// .NET callback references.
    /// </summary>
    private async ValueTask DetachControlAsync(CancellationToken cancellationToken)
    {
        try
        {
            if (_controlMapId is not null)
            {
                await Module.InvokeVoidAsync("remove", cancellationToken, _controlMapId, _instanceKey);
            }
        }
        finally
        {
            await ReleaseListenersAsync();
        }
    }

    /// <summary>
    /// Disposes the .NET callback references. Call only after the JavaScript listeners were removed.
    /// Handles that are still held by callers become no-ops after this point.
    /// </summary>
    private async Task ReleaseListenersAsync()
    {
        foreach (var callback in _listeners.Values.ToArray())
        {
            try
            {
                await callback.RemoveAsync();
            }
            catch (JSDisconnectedException)
            {
            }
            catch (ObjectDisposedException)
            {
            }
            catch (JSException ex)
            {
                Logger.LogWarning(ex, "Removing a compare slide-end listener failed.");
            }
        }

        _listeners.Clear();
    }

    private void EnsureNotDisposed()
    {
        if (State is MapLibrePluginLifecycleState.Disposed)
        {
            throw new ObjectDisposedException(nameof(ComparePlugin));
        }
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

    #endregion
}
