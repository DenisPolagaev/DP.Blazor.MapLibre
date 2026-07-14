using Community.Blazor.MapLibre.Models;
using Community.Blazor.MapLibre.Models.Camera;
using Community.Blazor.MapLibre.Models.Control;
using Community.Blazor.MapLibre.Models.Event;
using Community.Blazor.MapLibre.Models.Feature;
using Community.Blazor.MapLibre.Models.Image;
using Community.Blazor.MapLibre.Models.Layers;
using Community.Blazor.MapLibre.Models.Request;
using Community.Blazor.MapLibre.Models.Padding;
using Community.Blazor.MapLibre.Models.Sources;
using Community.Blazor.MapLibre.Models.Sprite;
using Community.Blazor.MapLibre.Models.LayerFeatures;
using Community.Blazor.MapLibre.Models.Marker;
using Community.Blazor.MapLibre.Models.Style;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using System.Collections.Concurrent;
using System.Text.Json;

namespace Community.Blazor.MapLibre;

public partial class MapLibre : ComponentBase, IAsyncDisposable
{
    private BulkTransaction? _bulkTransaction;

    /// <summary>
    /// Provides access to the JavaScript runtime environment for executing interop calls.
    /// Used to interact with JavaScript modules and invoke JavaScript functions.
    /// </summary>
    [Inject]
    private IJSRuntime JsRuntime { get; set; } = null!;

    /// <summary>
    /// Represents the JavaScript module reference used to interact with the MapLibre map instance in the Blazor component.
    /// This is dynamically loaded and utilized to invoke JavaScript functions for map initialization and operations.
    /// </summary>
    private IJSObjectReference _jsModule = null!;

    /// <summary>
    /// Active event listeners registered on this map instance, keyed by listener id.
    /// </summary>
    private readonly ConcurrentDictionary<string, CallbackHandler> _listeners = new();

    /// <summary>
    /// Encapsulates a reference to the current .NET instance of the Map component, enabling JavaScript interop calls
    /// to invoke methods on the .NET object.
    /// Used to facilitate communication between JavaScript and the .NET component.
    /// </summary>
    private DotNetObjectReference<MapLibre> _dotNetObjectReference = null!;

    /// <summary>
    /// A collection of custom plugins that extend the functionality of the MapLibre map.
    /// </summary>
    private readonly List<IMapLibrePlugin> _plugins = new();

    /// <summary>
    /// Represents the MapLibre map object instance that is created and managed by this component.
    /// </summary>
    private IJSObjectReference _mapObject = null!;

    private DotNetObjectReference<TransformConstrainCallbackHandler>? _transformConstrainReference;

    private DotNetObjectReference<TransformRequestCallbackHandler>? _transformRequestReference;

    private readonly ConcurrentDictionary<string, DotNetObjectReference<CustomLayerHandler>> _customLayerHandlers = new();

    private readonly ConcurrentDictionary<Guid, MapMarker> _markers = new();
    private readonly ConcurrentDictionary<Guid, MapPopup> _popups = new();

    private string? _mapContainerId;

    /// <summary>
    /// JavaScript interop container key (set during initialization).
    /// </summary>
    private string JsContainerId => _mapContainerId ?? MapId;

    internal string InteropContainerId => JsContainerId;

    private static JsonSerializerOptions LayerFeatureSerializer => MapLibreJsonSerializer.Options;

    #region Parameters

    /// <summary>
    /// The HTML element in which MapLibre GL JS will render the map, or the element's string id.
    /// The specified element must have no children.
    /// MapLibre 5.17+ also accepts an <c>HTMLElement</c> from another window (for example an iframe document).
    /// </summary>
    [Parameter]
    public string MapId { get; set; } = $"map-{Guid.NewGuid()}";

    /// <summary>
    /// Specifies the width of the map component. Can be set using valid CSS width values (e.g., "100%", "500px").
    /// Defaults to "100%".
    /// </summary>
    [Parameter]
    public string Width { get; set; } = "100%";

    /// <summary>
    /// Specifies the height of the map component.
    /// Accepts values in CSS units (e.g., "500px", "100%") to determine the vertical size of the map.
    /// </summary>
    [Parameter]
    public string Height { get; set; } = "500px";

    /// <summary>
    /// Represents the configuration options used to initialize a MapLibre map.
    /// These options allow customization of various map properties such as style, zoom, center, and interactions.
    /// </summary>
    [Parameter]
    public MapOptions Options { get; set; } = new();

    /// <summary>
    /// Optional transform constraint applied during map initialization (MapLibre 5.10+).
    /// </summary>
    [Parameter]
    public Func<TransformConstrainState, TransformConstrainState>? TransformConstrain { get; set; }

    /// <summary>
    /// Optional CSS class names. If given, these will be included in the class attribute of the component.
    /// </summary>
    [Parameter]
    public virtual string? Class { get; set; } = null;

    /// <summary>
    /// Callback event that is triggered when the map completes loading.
    /// Allows users to execute custom logic upon the successful initialization of the map.
    /// </summary>
    [Parameter]
    public EventCallback<EventArgs> OnLoad { get; set; }

    /// <summary>
    /// Callback event that is triggered when the map style completes loading.
    /// Also fires after <see cref="SetStyle"/> applies a JSON style diff (<c>diff: true</c>) (MapLibre 5.16+).
    /// </summary>
    [Parameter]
    public EventCallback<EventArgs> OnStyleLoad { get; set; }

    #endregion

    /// <summary>
    /// Invokes the OnStyleLoad event callback when the map style has been loaded.
    /// </summary>
    [JSInvokable]
    public async Task OnStyleLoadCallback()
    {
        await OnStyleLoad.InvokeAsync(EventArgs.Empty);
    }


    /// <summary>
    /// Invokes the OnLoad event callback when the map component has fully loaded.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation.</returns>
    [JSInvokable]
    public async Task OnLoadCallback()
    {
        await WaitForMapInstanceAsync();
        await OnLoad.InvokeAsync(EventArgs.Empty);
    }

    private async Task WaitForMapInstanceAsync()
    {
        if (_jsModule is null)
        {
            throw new InvalidOperationException("Map JavaScript module is not initialized.");
        }

        for (var attempt = 0; attempt < 100; attempt++)
        {
            if (await _jsModule.InvokeAsync<bool>("hasMap", JsContainerId))
            {
                return;
            }

            await Task.Delay(10);
        }

        throw new InvalidOperationException(
            $"Map instance for container '{JsContainerId}' is not registered. Ensure the map finished initializing before handling OnLoad.");
    }

    #region Setup

    private bool _mapInitialized;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await JsRuntime.InvokeAsync<IJSObjectReference>("import",
                "./_content/Community.Blazor.MapLibre/maplibre-gl/dist/maplibre-gl.js");

            _jsModule = await JsRuntime.InvokeAsync<IJSObjectReference>("import",
                "./_content/Community.Blazor.MapLibre/MapLibre.razor.js");

            _dotNetObjectReference = DotNetObjectReference.Create(this);

            // Each component's DOM id is MapId; reset string containers so shared MapOptions instances work.
            if (Options.Container is null or string)
            {
                Options.Container = MapId;
            }

            _mapContainerId = Options.Container as string ?? MapId;

            if (TransformConstrain is not null)
            {
                _transformConstrainReference =
                    DotNetObjectReference.Create(new TransformConstrainCallbackHandler(TransformConstrain));
            }

            _mapObject = await _jsModule.InvokeAsync<IJSObjectReference>(
                "initializeMap", Options, _dotNetObjectReference, _transformConstrainReference);

            // Load the plugins after the map has been initialized
            foreach (var plugin in _plugins)
            {
                await plugin.Initialize(_mapObject, JsRuntime);
            }

            _mapInitialized = true;
        }
    }

    public async Task RegisterPlugin(IMapLibrePlugin plugin)
    {
        ArgumentNullException.ThrowIfNull(plugin, nameof(plugin));

        if (_plugins.Contains(plugin))
        {
            return;
        }

        _plugins.Add(plugin);

        if (_mapInitialized)
        {
            await plugin.Initialize(_mapObject, JsRuntime);
        }
    }

    /// <summary>
    /// Sets the map container to a DOM element (for example from an iframe document). MapLibre 5.17+.
    /// Call before the first render.
    /// </summary>
    public void SetContainer(object containerElement) => Options.Container = containerElement;

    /// <summary>
    /// Returns a reference to the underlying MapLibre GL JS map instance.
    /// </summary>
    public async ValueTask<IJSObjectReference> GetMapAsync() =>
        await _jsModule.InvokeAsync<IJSObjectReference>("getMap", JsContainerId);

    public async ValueTask DisposeAsync()
    {
        foreach (var listener in _listeners.Values)
        {
            await listener.RemoveAsync();
        }

        _listeners.Clear();

        foreach (var value in _customLayerHandlers.Values)
        {
            value.Dispose();
        }

        _transformConstrainReference?.Dispose();
        _transformRequestReference?.Dispose();

        try
        {
            // ReSharper disable once ConditionIsAlwaysTrueOrFalseAccordingToNullableAPIContract
            if (_jsModule is not null)
            {
                await Remove();
                await _jsModule.DisposeAsync();
            }
        }
        catch (JSDisconnectedException)
        {
            // Ignore
            // https://learn.microsoft.com/en-us/aspnet/core/blazor/javascript-interoperability/?view=aspnetcore-8.0#javascript-interop-calls-without-a-circuit
        }
        catch (ObjectDisposedException)
        {
            // JS module may already be disposed when parent and child both participate in teardown.
        }
    }

    #endregion

    #region Events

    /// <summary>
    /// Registers a synchronous event listener for a specified event on the map, optionally scoped to a specific layer.
    /// </summary>
    /// <typeparam name="T">The type of the event payload.</typeparam>
    /// <param name="eventName">The name of the event to listen for (e.g., "click", "mousemove").</param>
    /// <param name="handler">The synchronous callback action to execute when the event occurs.</param>
    /// <param name="layer">The optional layer ID where the event listener should be applied.</param>
    /// <param name="throttleMs">Optional throttle interval in milliseconds (useful for mousemove).</param>
    /// <returns>A <see cref="Listener"/> instance that allows removal of the registered listener.</returns>
    public Task<Listener> AddListener<T>(string eventName, Action<T> handler, object? layer = null, int? throttleMs = null) =>
        AddListenerInternal<T>(eventName, handler, layer, throttleMs);

    /// <summary>
    /// Registers an asynchronous event listener for a specified event on the map, optionally scoped to a specific layer.
    /// </summary>
    /// <typeparam name="T">The type of the event payload.</typeparam>
    /// <param name="eventName">The name of the event to listen for (e.g., "click", "mousemove").</param>
    /// <param name="handler">The asynchronous callback action to execute when the event occurs.</param>
    /// <param name="layer">The optional layer ID where the event listener should be applied.</param>
    /// <param name="throttleMs">Optional throttle interval in milliseconds (useful for mousemove).</param>
    /// <returns>A <see cref="Listener"/> instance that allows removal of the registered listener.</returns>
    public Task<Listener> AddAsyncListener<T>(string eventName, Func<T, Task> handler, object? layer = null, int? throttleMs = null) =>
        AddListenerInternal<T>(eventName, handler, layer, throttleMs);

    public Task<Listener> AddListener<T>(string eventName, Action<T> handler, int? throttleMs, params string[] layerIds) =>
        AddListenerInternal<T>(eventName, handler, layerIds.Length > 0 ? layerIds : null, throttleMs);

    public Task<Listener> AddAsyncListener<T>(string eventName, Func<T, Task> handler, int? throttleMs, params string[] layerIds) =>
        AddListenerInternal<T>(eventName, handler, layerIds.Length > 0 ? layerIds : null, throttleMs);

    public Task<Listener> AddListener<T>(string eventName, Action<T> handler, params string[] layerIds) =>
        AddListenerInternal<T>(eventName, handler, layerIds.Length > 0 ? layerIds : null);

    public Task<Listener> AddAsyncListener<T>(string eventName, Func<T, Task> handler, params string[] layerIds) =>
        AddListenerInternal<T>(eventName, handler, layerIds.Length > 0 ? layerIds : null);

    private async Task<Listener> AddListenerInternal<T>(string eventName, Delegate handler, object? layer = null, int? throttleMs = null)
    {
        var callback = new CallbackHandler(_jsModule, JsContainerId, eventName, handler, typeof(T));
        var reference = DotNetObjectReference.Create(callback);
        var listenerId = await _jsModule.InvokeAsync<string>("on", JsContainerId, eventName, reference, layer, throttleMs);
        callback.Attach(reference, listenerId, id => _listeners.TryRemove(id, out _));
        _listeners[listenerId] = callback;

        return new Listener(callback);
    }

    private async Task<Listener> AddOnceListenerInternal<T>(string eventName, Delegate handler, object? layer = null, int? throttleMs = null)
    {
        var callback = new CallbackHandler(_jsModule, JsContainerId, eventName, handler, typeof(T));
        var reference = DotNetObjectReference.Create(callback);
        var listenerId = await _jsModule.InvokeAsync<string>("once", JsContainerId, eventName, reference, layer, throttleMs);
        callback.Attach(reference, listenerId, id => _listeners.TryRemove(id, out _));
        _listeners[listenerId] = callback;

        return new Listener(callback);
    }

    public Task<Listener> AddOnceListener<T>(string eventName, Action<T> handler, object? layer = null, int? throttleMs = null) =>
        AddOnceListenerInternal<T>(eventName, handler, layer, throttleMs);

    public Task<Listener> AddOnceAsyncListener<T>(string eventName, Func<T, Task> handler, object? layer = null, int? throttleMs = null) =>
        AddOnceListenerInternal<T>(eventName, handler, layer, throttleMs);

    public Task<Listener> AddOnceListener<T>(string eventName, Action<T> handler, int? throttleMs, params string[] layerIds) =>
        AddOnceListenerInternal<T>(eventName, handler, layerIds.Length > 0 ? layerIds : null, throttleMs);

    public Task<Listener> AddOnceAsyncListener<T>(string eventName, Func<T, Task> handler, int? throttleMs, params string[] layerIds) =>
        AddOnceListenerInternal<T>(eventName, handler, layerIds.Length > 0 ? layerIds : null, throttleMs);

    /// <summary>
    /// Removes all event listeners registered on this map, optionally filtered by event name.
    /// </summary>
    public async ValueTask RemoveAllListeners(string? eventName = null)
    {
        var toRemove = _listeners
            .Where(pair => eventName is null || pair.Value.EventType == eventName)
            .Select(pair => pair.Value)
            .ToList();

        foreach (var callback in toRemove)
        {
            await callback.RemoveAsync();
        }
    }

    /// <summary>
    /// Registers a synchronous click event listener for the map or specific layer(s).
    /// </summary>
    public Task<Listener> OnClick(string? layerId, Action<MapMouseEvent> handler) =>
        AddListenerInternal<MapMouseEvent>(MapEventNames.Click, handler, layerId);

    public Task<Listener> OnClick(string? layerId, Func<MapMouseEvent, Task> handler) =>
        AddListenerInternal<MapMouseEvent>(MapEventNames.Click, handler, layerId);

    public Task<Listener> OnClick(Action<MapMouseEvent> handler, params string[] layerIds) =>
        AddListenerInternal<MapMouseEvent>(MapEventNames.Click, handler, layerIds.Length > 0 ? layerIds : null);

    public Task<Listener> OnClick(Func<MapMouseEvent, Task> handler, params string[] layerIds) =>
        AddListenerInternal<MapMouseEvent>(MapEventNames.Click, handler, layerIds.Length > 0 ? layerIds : null);

    public Task<Listener> OnZoomChange(Action<MapEvent> handler) =>
        AddListener(MapEventNames.Zoom, handler);

    public Task<Listener> OnZoomChange(Func<MapEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.Zoom, handler);

    public Task<Listener> OnMoveEnd(Action<MapMoveEvent> handler) =>
        AddListener(MapEventNames.MoveEnd, handler);

    public Task<Listener> OnMoveEnd(Func<MapMoveEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.MoveEnd, handler);

    public Task<Listener> OnIdle(Action<MapEvent> handler) =>
        AddListener(MapEventNames.Idle, handler);

    public Task<Listener> OnIdle(Func<MapEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.Idle, handler);

    public Task<Listener> OnMouseMove(string? layerId, Action<MapMouseEvent> handler) =>
        AddListenerInternal<MapMouseEvent>(MapEventNames.MouseMove, handler, layerId);

    public Task<Listener> OnMouseMove(string? layerId, Func<MapMouseEvent, Task> handler) =>
        AddListenerInternal<MapMouseEvent>(MapEventNames.MouseMove, handler, layerId);

    public Task<Listener> OnMouseMove(Action<MapMouseEvent> handler, int throttleMs, string? layerId = null) =>
        AddListenerInternal<MapMouseEvent>(MapEventNames.MouseMove, handler, layerId, throttleMs);

    public Task<Listener> OnMouseMove(Func<MapMouseEvent, Task> handler, int throttleMs, string? layerId = null) =>
        AddListenerInternal<MapMouseEvent>(MapEventNames.MouseMove, handler, layerId, throttleMs);

    public Task<Listener> OnMouseMove(Action<MapMouseEvent> handler, params string[] layerIds) =>
        AddListenerInternal<MapMouseEvent>(MapEventNames.MouseMove, handler, layerIds.Length > 0 ? layerIds : null);

    public Task<Listener> OnMouseMove(Func<MapMouseEvent, Task> handler, params string[] layerIds) =>
        AddListenerInternal<MapMouseEvent>(MapEventNames.MouseMove, handler, layerIds.Length > 0 ? layerIds : null);

    public Task<Listener> OnData(Action<MapDataEvent> handler) =>
        AddListener(MapEventNames.Data, handler);

    public Task<Listener> OnData(Func<MapDataEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.Data, handler);

    public Task<Listener> OnSourceData(Action<MapDataEvent> handler) =>
        AddListener(MapEventNames.SourceData, handler);

    public Task<Listener> OnSourceData(Func<MapDataEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.SourceData, handler);

    public Task<Listener> OnError(Action<MapErrorEvent> handler) =>
        AddListener(MapEventNames.Error, handler);

    public Task<Listener> OnError(Func<MapErrorEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.Error, handler);

    public Task<Listener> OnTouchStart(string? layerId, Action<MapTouchEvent> handler) =>
        AddListenerInternal<MapTouchEvent>(MapEventNames.TouchStart, handler, layerId);

    public Task<Listener> OnTouchStart(string? layerId, Func<MapTouchEvent, Task> handler) =>
        AddListenerInternal<MapTouchEvent>(MapEventNames.TouchStart, handler, layerId);

    public Task<Listener> OnTouchStart(Action<MapTouchEvent> handler, params string[] layerIds) =>
        AddListenerInternal<MapTouchEvent>(MapEventNames.TouchStart, handler, layerIds.Length > 0 ? layerIds : null);

    public Task<Listener> OnTouchEnd(string? layerId, Action<MapTouchEvent> handler) =>
        AddListenerInternal<MapTouchEvent>(MapEventNames.TouchEnd, handler, layerId);

    public Task<Listener> OnTouchEnd(string? layerId, Func<MapTouchEvent, Task> handler) =>
        AddListenerInternal<MapTouchEvent>(MapEventNames.TouchEnd, handler, layerId);

    public Task<Listener> OnTouchMove(string? layerId, Action<MapTouchEvent> handler) =>
        AddListenerInternal<MapTouchEvent>(MapEventNames.TouchMove, handler, layerId);

    public Task<Listener> OnTouchMove(string? layerId, Func<MapTouchEvent, Task> handler) =>
        AddListenerInternal<MapTouchEvent>(MapEventNames.TouchMove, handler, layerId);

    public Task<Listener> OnTouchCancel(Action<MapTouchEvent> handler) =>
        AddListener(MapEventNames.TouchCancel, handler);

    public Task<Listener> OnTouchCancel(Func<MapTouchEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.TouchCancel, handler);

    public Task<Listener> OnWheel(Action<MapWheelEvent> handler) =>
        AddListener(MapEventNames.Wheel, handler);

    public Task<Listener> OnWheel(Func<MapWheelEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.Wheel, handler);

    public Task<Listener> OnRender(Action<MapEvent> handler) =>
        AddListener(MapEventNames.Render, handler);

    public Task<Listener> OnRender(Func<MapEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.Render, handler);

    public Task<Listener> OnStyleImageMissing(Action<MapStyleImageMissingEvent> handler) =>
        AddListener(MapEventNames.StyleImageMissing, handler);

    public Task<Listener> OnStyleImageMissing(Func<MapStyleImageMissingEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.StyleImageMissing, handler);

    public Task<Listener> OnDragStart(Action<MapEvent> handler) =>
        AddListener(MapEventNames.DragStart, handler);

    public Task<Listener> OnDragStart(Func<MapEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.DragStart, handler);

    public Task<Listener> OnDrag(Action<MapEvent> handler) =>
        AddListener(MapEventNames.Drag, handler);

    public Task<Listener> OnDrag(Func<MapEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.Drag, handler);

    public Task<Listener> OnDragEnd(Action<MapEvent> handler) =>
        AddListener(MapEventNames.DragEnd, handler);

    public Task<Listener> OnDragEnd(Func<MapEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.DragEnd, handler);

    public Task<Listener> OnCooperativeGesturePrevented(Action<MapCooperativeGestureEvent> handler) =>
        AddListener(MapEventNames.CooperativeGesturePrevented, handler);

    public Task<Listener> OnCooperativeGesturePrevented(Func<MapCooperativeGestureEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.CooperativeGesturePrevented, handler);

    public Task<Listener> OnProjectionTransition(Action<MapProjectionEvent> handler) =>
        AddListener(MapEventNames.ProjectionTransition, handler);

    public Task<Listener> OnProjectionTransition(Func<MapProjectionEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.ProjectionTransition, handler);

    public Task<Listener> OnTerrain(Action<MapTerrainEvent> handler) =>
        AddListener(MapEventNames.Terrain, handler);

    public Task<Listener> OnTerrain(Func<MapTerrainEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.Terrain, handler);

    public Task<Listener> OnSourceDataAbort(Action<MapDataEvent> handler) =>
        AddListener(MapEventNames.SourceDataAbort, handler);

    public Task<Listener> OnSourceDataAbort(Func<MapDataEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.SourceDataAbort, handler);

    public Task<Listener> OnStyleLoadListener(Action<MapEvent> handler) =>
        AddListener(MapEventNames.StyleLoad, handler);

    public Task<Listener> OnStyleLoadListener(Func<MapEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.StyleLoad, handler);

    public Task<Listener> OnContextMenu(string? layerId, Action<MapMouseEvent> handler) =>
        AddListenerInternal<MapMouseEvent>(MapEventNames.ContextMenu, handler, layerId);

    public Task<Listener> OnContextMenu(string? layerId, Func<MapMouseEvent, Task> handler) =>
        AddListenerInternal<MapMouseEvent>(MapEventNames.ContextMenu, handler, layerId);

    public Task<Listener> OnDblClick(string? layerId, Action<MapMouseEvent> handler) =>
        AddListenerInternal<MapMouseEvent>(MapEventNames.DblClick, handler, layerId);

    public Task<Listener> OnDblClick(string? layerId, Func<MapMouseEvent, Task> handler) =>
        AddListenerInternal<MapMouseEvent>(MapEventNames.DblClick, handler, layerId);

    public Task<Listener> OnMouseDown(string? layerId, Action<MapMouseEvent> handler) =>
        AddListenerInternal<MapMouseEvent>(MapEventNames.MouseDown, handler, layerId);

    public Task<Listener> OnMouseDown(string? layerId, Func<MapMouseEvent, Task> handler) =>
        AddListenerInternal<MapMouseEvent>(MapEventNames.MouseDown, handler, layerId);

    public Task<Listener> OnMouseUp(string? layerId, Action<MapMouseEvent> handler) =>
        AddListenerInternal<MapMouseEvent>(MapEventNames.MouseUp, handler, layerId);

    public Task<Listener> OnMouseUp(string? layerId, Func<MapMouseEvent, Task> handler) =>
        AddListenerInternal<MapMouseEvent>(MapEventNames.MouseUp, handler, layerId);

    public Task<Listener> OnMouseEnter(string? layerId, Action<MapMouseEvent> handler) =>
        AddListenerInternal<MapMouseEvent>(MapEventNames.MouseEnter, handler, layerId);

    public Task<Listener> OnMouseEnter(string? layerId, Func<MapMouseEvent, Task> handler) =>
        AddListenerInternal<MapMouseEvent>(MapEventNames.MouseEnter, handler, layerId);

    public Task<Listener> OnMouseLeave(string? layerId, Action<MapMouseEvent> handler) =>
        AddListenerInternal<MapMouseEvent>(MapEventNames.MouseLeave, handler, layerId);

    public Task<Listener> OnMouseLeave(string? layerId, Func<MapMouseEvent, Task> handler) =>
        AddListenerInternal<MapMouseEvent>(MapEventNames.MouseLeave, handler, layerId);

    public Task<Listener> OnMouseOver(string? layerId, Action<MapMouseEvent> handler) =>
        AddListenerInternal<MapMouseEvent>(MapEventNames.MouseOver, handler, layerId);

    public Task<Listener> OnMouseOver(string? layerId, Func<MapMouseEvent, Task> handler) =>
        AddListenerInternal<MapMouseEvent>(MapEventNames.MouseOver, handler, layerId);

    public Task<Listener> OnMouseOut(string? layerId, Action<MapMouseEvent> handler) =>
        AddListenerInternal<MapMouseEvent>(MapEventNames.MouseOut, handler, layerId);

    public Task<Listener> OnMouseOut(string? layerId, Func<MapMouseEvent, Task> handler) =>
        AddListenerInternal<MapMouseEvent>(MapEventNames.MouseOut, handler, layerId);

    public Task<Listener> OnMoveStart(Action<MapMoveEvent> handler) =>
        AddListener(MapEventNames.MoveStart, handler);

    public Task<Listener> OnMoveStart(Func<MapMoveEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.MoveStart, handler);

    public Task<Listener> OnMove(Action<MapMoveEvent> handler) =>
        AddListener(MapEventNames.Move, handler);

    public Task<Listener> OnMove(Func<MapMoveEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.Move, handler);

    public Task<Listener> OnZoomStart(Action<MapEvent> handler) =>
        AddListener(MapEventNames.ZoomStart, handler);

    public Task<Listener> OnZoomStart(Func<MapEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.ZoomStart, handler);

    public Task<Listener> OnZoomEnd(Action<MapEvent> handler) =>
        AddListener(MapEventNames.ZoomEnd, handler);

    public Task<Listener> OnZoomEnd(Func<MapEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.ZoomEnd, handler);

    public Task<Listener> OnRotateStart(Action<MapEvent> handler) =>
        AddListener(MapEventNames.RotateStart, handler);

    public Task<Listener> OnRotateStart(Func<MapEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.RotateStart, handler);

    public Task<Listener> OnRotate(Action<MapEvent> handler) =>
        AddListener(MapEventNames.Rotate, handler);

    public Task<Listener> OnRotate(Func<MapEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.Rotate, handler);

    public Task<Listener> OnRotateEnd(Action<MapEvent> handler) =>
        AddListener(MapEventNames.RotateEnd, handler);

    public Task<Listener> OnRotateEnd(Func<MapEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.RotateEnd, handler);

    public Task<Listener> OnPitchStart(Action<MapEvent> handler) =>
        AddListener(MapEventNames.PitchStart, handler);

    public Task<Listener> OnPitchStart(Func<MapEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.PitchStart, handler);

    public Task<Listener> OnPitch(Action<MapEvent> handler) =>
        AddListener(MapEventNames.Pitch, handler);

    public Task<Listener> OnPitch(Func<MapEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.Pitch, handler);

    public Task<Listener> OnPitchEnd(Action<MapEvent> handler) =>
        AddListener(MapEventNames.PitchEnd, handler);

    public Task<Listener> OnPitchEnd(Func<MapEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.PitchEnd, handler);

    public Task<Listener> OnRollStart(Action<MapEvent> handler) =>
        AddListener(MapEventNames.RollStart, handler);

    public Task<Listener> OnRollStart(Func<MapEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.RollStart, handler);

    public Task<Listener> OnRoll(Action<MapEvent> handler) =>
        AddListener(MapEventNames.Roll, handler);

    public Task<Listener> OnRoll(Func<MapEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.Roll, handler);

    public Task<Listener> OnRollEnd(Action<MapEvent> handler) =>
        AddListener(MapEventNames.RollEnd, handler);

    public Task<Listener> OnRollEnd(Func<MapEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.RollEnd, handler);

    public Task<Listener> OnStyleData(Action<MapDataEvent> handler) =>
        AddListener(MapEventNames.StyleData, handler);

    public Task<Listener> OnStyleData(Func<MapDataEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.StyleData, handler);

    public Task<Listener> OnStyleDataLoading(Action<MapDataEvent> handler) =>
        AddListener(MapEventNames.StyleDataLoading, handler);

    public Task<Listener> OnStyleDataLoading(Func<MapDataEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.StyleDataLoading, handler);

    public Task<Listener> OnSourceDataLoading(Action<MapDataEvent> handler) =>
        AddListener(MapEventNames.SourceDataLoading, handler);

    public Task<Listener> OnSourceDataLoading(Func<MapDataEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.SourceDataLoading, handler);

    public Task<Listener> OnDataLoading(Action<MapDataEvent> handler) =>
        AddListener(MapEventNames.DataLoading, handler);

    public Task<Listener> OnDataLoading(Func<MapDataEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.DataLoading, handler);

    public Task<Listener> OnDataAbort(Action<MapDataEvent> handler) =>
        AddListener(MapEventNames.DataAbort, handler);

    public Task<Listener> OnDataAbort(Func<MapDataEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.DataAbort, handler);

    public Task<Listener> OnBoxZoomStart(Action<MapZoomEvent> handler) =>
        AddListener(MapEventNames.BoxZoomStart, handler);

    public Task<Listener> OnBoxZoomStart(Func<MapZoomEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.BoxZoomStart, handler);

    public Task<Listener> OnBoxZoomEnd(Action<MapZoomEvent> handler) =>
        AddListener(MapEventNames.BoxZoomEnd, handler);

    public Task<Listener> OnBoxZoomEnd(Func<MapZoomEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.BoxZoomEnd, handler);

    public Task<Listener> OnBoxZoomCancel(Action<MapZoomEvent> handler) =>
        AddListener(MapEventNames.BoxZoomCancel, handler);

    public Task<Listener> OnBoxZoomCancel(Func<MapZoomEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.BoxZoomCancel, handler);

    public Task<Listener> OnWebGlContextLost(Action<MapContextEvent> handler) =>
        AddListener(MapEventNames.WebGlContextLost, handler);

    public Task<Listener> OnWebGlContextLost(Func<MapContextEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.WebGlContextLost, handler);

    public Task<Listener> OnWebGlContextRestored(Action<MapContextEvent> handler) =>
        AddListener(MapEventNames.WebGlContextRestored, handler);

    public Task<Listener> OnWebGlContextRestored(Func<MapContextEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.WebGlContextRestored, handler);

    public Task<Listener> OnResize(Action<MapEvent> handler) =>
        AddListener(MapEventNames.Resize, handler);

    public Task<Listener> OnResize(Func<MapEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.Resize, handler);

    public Task<Listener> OnRemove(Action<MapEvent> handler) =>
        AddListener(MapEventNames.Remove, handler);

    public Task<Listener> OnRemove(Func<MapEvent, Task> handler) =>
        AddAsyncListener(MapEventNames.Remove, handler);
    #endregion

    #region Methods

    /// <summary>
    /// Adds a control to the map instance based on the specified control type and options.
    /// </summary>
    /// <param name="controlType">The type of control to be added to the map.</param>
    /// <param name="position">Optional settings or parameters specific to the control being added.</param>
    /// <returns>A task that represents the asynchronous operation of adding the control.</returns>
    public async ValueTask AddControl(ControlType controlType, ControlPosition? position = null)
    {
        if (_bulkTransaction is not null)
        {
            _bulkTransaction.Add("addControl", controlType.ToString(), position);
            return;
        }

        await _jsModule.InvokeVoidAsync("addControl", JsContainerId, controlType.ToString(), position);
    }

    /// <summary>
    /// Shows the tile boundaries for debug purposes.
    /// </summary>
    public async ValueTask ShowTileBoundaries(bool shouldShowTileBoundaries)
    {
        await _jsModule.InvokeVoidAsync("showTileBoundaries", JsContainerId, shouldShowTileBoundaries);
    }

    /// <summary>
    /// Adds a geolocate control to the given map container.
    /// </summary>
    public async ValueTask AddGeolocateControl(GeolocateControlOptions options, ControlPosition? position = null)
    {
        if (_bulkTransaction is not null)
        {
            _bulkTransaction.Add("addGeolocateControl", options, position);
            return;
        }

        await _jsModule.InvokeVoidAsync("addGeolocateControl", JsContainerId, options, position);
    }

    /// <summary>
    /// Adds a navigation control to the given map container.
    /// </summary>
    public async ValueTask AddNavigationControl(NavigationControlOptions options, ControlPosition? position = null)
    {
        if (_bulkTransaction is not null)
        {
            _bulkTransaction.Add("addNavigationControl", options, position);
            return;
        }

        await _jsModule.InvokeVoidAsync("addNavigationControl", JsContainerId, options, position);
    }

    /// <summary>
    /// Adds a scale control to the given map container.
    /// </summary>
    public async ValueTask AddScaleControl(ScaleControlOptions options, ControlPosition? position = null)
    {
        if (_bulkTransaction is not null)
        {
            _bulkTransaction.Add("addScaleControl", options, position);
            return;
        }

        await _jsModule.InvokeVoidAsync("addScaleControl", JsContainerId, options, position);
    }

    /// <summary>
    /// Updates the unit of the scale control.
    /// </summary>
    /// <param name="unit">The unit to set ("metric", "imperial", or "nautical").</param>
    public async ValueTask SetScaleControlUnit(string unit)
    {
        await _jsModule.InvokeVoidAsync("setScaleControlUnit", JsContainerId, unit);
    }

    /// <summary>
    /// Adds an image to the map for use in styling or layer configuration.
    /// Supports PNG/JPEG/WebP via MapLibre <c>loadImage</c> and SVG via HTMLImageElement fallback.
    /// </summary>
    /// <param name="id">The unique identifier for the image to be added to the map.</param>
    /// <param name="url">The URL pointing to the image resource to be added.</param>
    /// <param name="options">Optional parameters to configure the image, such as pixel ratio or content layout.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    public async ValueTask AddImage(string id, string url, StyleImageMetadata? options = null)
    {
        if (_bulkTransaction is not null)
        {
            _bulkTransaction.Add("addImage", id, url, options);
            return;
        }
        await _jsModule.InvokeVoidAsync("addImage", JsContainerId, id, url, options);
    }

    /// <summary>
    /// Adds a layer to the MapLibre map with the specified properties and an optional position before another layer.
    /// </summary>
    /// <param name="layer">The layer to be added, defining the rendering and customization options.</param>
    /// <param name="beforeId">An optional layer ID indicating the position before which the new layer should be added. If null, the layer is added to the end.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    public async ValueTask AddLayer(Layer layer, string? beforeId = null)
    {
        if (_bulkTransaction is not null)
        {
            _bulkTransaction.Add("addLayer", layer, beforeId);
            return;
        }
        await _jsModule.InvokeVoidAsync("addLayer", JsContainerId, layer, beforeId);
    }

    /// <summary>
    /// Adds a source to the map with the specified identifier and source object.
    /// </summary>
    /// <param name="id">A unique identifier for the source.</param>
    /// <param name="source">The source object to add to the map, implementing the <see cref="ISource"/> interface.</param>
    /// <returns>A task that represents the asynchronous operation of adding the source.</returns>
    public async ValueTask AddSource(string id, ISource source)
    {
        if (_bulkTransaction is not null)
        {
            _bulkTransaction.Add("addSource", id, source);
            return;
        }
        await _jsModule.InvokeVoidAsync("addSource", JsContainerId, id, source);
    }

    public async ValueTask SetSourceData(string id, GeoJsonSource source)
    {
        if (_bulkTransaction is not null)
        {
            source.Data.Switch( 
                feature =>  _bulkTransaction.Add("setSourceData", id, feature), 
                str => _bulkTransaction.Add("setSourceData", id, str));
            return;
        }
        await source.Data.Match(
            feature => _jsModule.InvokeVoidAsync("setSourceData", JsContainerId, id, feature),
            str => _jsModule.InvokeVoidAsync("setSourceData", JsContainerId, id, str));
    }

    public async ValueTask SetSourceDataAsJson(string id, string data)
    {
        if (_bulkTransaction is not null)
        {
            _bulkTransaction.Add("setSourceDataAsJson", id, data);
            return;
        }

        await _jsModule.InvokeVoidAsync("setSourceDataAsJson", JsContainerId, id, data);
    }

    /// <summary>
    /// Updates tile URLs for an existing vector tile source without removing dependent layers.
    /// </summary>
    /// <param name="id">The vector source id.</param>
    /// <param name="tiles">The new tile URL templates.</param>
    public async ValueTask SetVectorSourceTiles(string id, IReadOnlyList<string> tiles)
    {
        if (_bulkTransaction is not null)
        {
            _bulkTransaction.Add("setVectorSourceTiles", id, tiles);
            return;
        }

        await _jsModule.InvokeVoidAsync("setVectorSourceTiles", JsContainerId, id, tiles);
    }

    /// <summary>
    /// Applies an incremental diff to an existing GeoJSON source.
    /// Requires every feature in the source to have a unique id (or <c>promoteId</c> on the source).
    /// </summary>
    /// <param name="id">The GeoJSON source id.</param>
    /// <param name="diff">The diff to apply (remove, add, update).</param>
    public async ValueTask UpdateSourceData(string id, GeoJsonSourceDiff diff)
    {
        if (_bulkTransaction is not null)
        {
            _bulkTransaction.Add("updateSourceData", id, diff, false);
            return;
        }

        await _jsModule.InvokeVoidAsync("updateSourceData", JsContainerId, id, diff, false);
    }

    /// <summary>
    /// Applies an incremental diff to an existing GeoJSON source and waits until processing completes.
    /// </summary>
    /// <param name="id">The GeoJSON source id.</param>
    /// <param name="diff">The diff to apply (remove, add, update).</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    public async ValueTask UpdateSourceDataAsync(string id, GeoJsonSourceDiff diff, CancellationToken cancellationToken = default)
    {
        if (_bulkTransaction is not null)
        {
            _bulkTransaction.Add("updateSourceData", id, diff, true);
            return;
        }

        await _jsModule.InvokeVoidAsync("updateSourceData", cancellationToken, JsContainerId, id, diff, true);
    }

    /// <summary>
    /// Adds a sprite to the map using the specified sprite id, URL, and optional configuration.
    /// </summary>
    /// <param name="id">The unique identifier for the sprite to be added.</param>
    /// <param name="url">The URL of the sprite image to be loaded.</param>
    /// <param name="options">Optional parameters to configure the sprite.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    public async ValueTask AddSprite(string id, string url, StyleSetterOptions? options = null)
    {
        if (_bulkTransaction is not null)
        {
            _bulkTransaction.Add("addSprite", id, url, options);
            return;
        }
        await _jsModule.InvokeVoidAsync("addSprite", JsContainerId, id, url, options);
    }

    /// <summary>
    /// Determines whether all map tiles have been fully loaded.
    /// </summary>
    /// <returns>A task that resolves to a boolean indicating whether the tiles are completely loaded.</returns>
    public async ValueTask<bool> AreTilesLoaded()
    {
        return await _jsModule.InvokeAsync<bool>("areTilesLoaded", JsContainerId);
    }

    /// <summary>
    /// Calculates and returns camera options based on the provided longitude and latitude coordinates,
    /// altitude, and rotation parameters including bearing, pitch, and optional roll.
    /// </summary>
    /// <param name="cameraLngLat">The geographic longitude and latitude coordinates of the camera.</param>
    /// <param name="cameraAltitude">The altitude of the camera in meters.</param>
    /// <param name="bearing">The compass direction that the camera is facing, in degrees.</param>
    /// <param name="pitch">The tilt of the camera, in degrees from the horizontal plane.</param>
    /// <param name="roll">Optional roll angle of the camera, in degrees (rotation along the view vector).</param>
    /// <returns>A <see cref="CameraOptions"/> object containing the calculated camera options, including position, zoom, and rotation.</returns>
    public async ValueTask<CameraOptions> CalculateCameraOptionsFromCameraLngLatAltRotation(LngLat cameraLngLat,
        double cameraAltitude, double bearing, double pitch, double? roll = null)
    {
        return await _jsModule.InvokeAsync<CameraOptions>(
            "calculateCameraOptionsFromCameraLngLatAltRotation",
            JsContainerId, cameraLngLat, cameraAltitude, bearing, pitch, roll);
    }

    /// <summary>
    /// Calculates the camera options to transition from one location to another, considering their respective altitudes.
    /// </summary>
    /// <param name="from">The starting geographical coordinates.</param>
    /// <param name="altitudeFrom">The altitude at the starting location.</param>
    /// <param name="to">The destination geographical coordinates.</param>
    /// <param name="altitudeTo">The altitude at the destination location. This parameter is optional.</param>
    /// <returns>A task representing the asynchronous operation that provides the calculated CameraOptions.</returns>
    public async ValueTask<CameraOptions> CalculateCameraOptionsFromTo(LngLat from, double altitudeFrom, LngLat to,
        double? altitudeTo = null) =>
        await _jsModule.InvokeAsync<CameraOptions>("calculateCameraOptionsFromTo", JsContainerId, from, altitudeFrom,
            to, altitudeTo);

    /// <summary>
    /// Computes the required center, zoom, and bearing to fit the specified bounding box within the viewport.
    /// </summary>
    /// <param name="bounds">The geographical bounding box to be fitted.</param>
    /// <param name="options">Optional parameters to customize the calculation.</param>
    /// <returns>A task that represents the asynchronous operation, containing the resulting center, zoom, and bearing.</returns>
    public async ValueTask<CenterZoomBearing> CameraForBounds(LngLatBounds bounds, CameraForBoundsOptions? options = null) =>
        await _jsModule.InvokeAsync<CenterZoomBearing>("cameraForBounds", JsContainerId, bounds, options);

    /// <summary>
    /// Smoothly transitions the camera's view to the specified target, animating parameters such as
    /// center, zoom, bearing, pitch, roll, and padding. Any unspecified parameters will retain their current values.
    /// </summary>
    /// <remarks>
    /// The transition is animated unless the user has enabled the "reduced motion" accessibility feature
    /// in their operating system. This can be overridden by including <c>essential: true</c> in the options.
    /// </remarks>
    /// <param name="options">
    /// The options describing the destination and animation behavior. Accepts both camera and animation-related properties.
    /// </param>
    /// <param name="eventData">
    /// Additional data to be included in events triggered during the transition (e.g., move, zoom, rotate events).
    /// </param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    public async ValueTask EaseTo(EaseToOptions options, object? eventData = null) =>
        await _jsModule.InvokeVoidAsync("easeTo", JsContainerId, options, eventData);

    /// <summary>
    /// Pans and zooms the map to contain its visible area within the specified geographical bounds. This function will also reset the map's bearing to 0 if bearing is nonzero.
    /// </summary>
    /// <param name="bounds">The geographical bounds to fit within the viewport.</param>
    /// <param name="options">Options to customize the behavior of the fit bounds operation.</param>
    /// <param name="eventData">Additional event data associated with the operation, if any.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    public async ValueTask FitBounds(LngLatBounds bounds, FitBoundOptions? options = null, object? eventData = null) =>
        await _jsModule.InvokeVoidAsync("fitBounds", JsContainerId, bounds, options, eventData);

    /// <summary>
    /// Fits the map view to a style layer already added to the map.
    /// </summary>
    /// <remarks>
    /// This method first uses stable source bounds when available, such as GeoJSON source bounds,
    /// vector/raster source metadata bounds, or image/video coordinates. If no source bounds are
    /// available, it falls back to features currently loaded for the layer.
    /// </remarks>
    /// <param name="layerId">The style layer identifier.</param>
    /// <param name="options">Optional fit bounds options.</param>
    /// <returns><c>true</c> when bounds were applied; otherwise <c>false</c>.</returns>
    public async ValueTask<bool> FitToLayer(string layerId, FitBoundOptions? options = null) =>
        await _jsModule.InvokeAsync<bool>("fitToLayer", JsContainerId, layerId, options);

    /// <summary>
    /// Fits the map view to stable bounds declared or calculated by a source.
    /// </summary>
    /// <remarks>
    /// For vector and raster sources this uses the source <c>bounds</c> metadata when present.
    /// For GeoJSON sources this uses MapLibre's source bounds calculation.
    /// </remarks>
    /// <param name="sourceId">The source identifier.</param>
    /// <param name="options">Optional fit bounds options.</param>
    /// <returns><c>true</c> when bounds were applied; otherwise <c>false</c>.</returns>
    public async ValueTask<bool> FitToSourceBounds(string sourceId, FitBoundOptions? options = null) =>
        await _jsModule.InvokeAsync<bool>("fitToSourceBounds", JsContainerId, sourceId, options);

    /// <summary>
    /// Fits the map view to features currently loaded for a style layer.
    /// </summary>
    /// <remarks>
    /// This is useful for vector tile layers without source bounds metadata, but the result depends
    /// on the tiles currently loaded by MapLibre and may not cover the entire dataset.
    /// </remarks>
    /// <param name="layerId">The style layer identifier.</param>
    /// <param name="options">Optional fit bounds options.</param>
    /// <returns><c>true</c> when bounds were applied; otherwise <c>false</c>.</returns>
    public async ValueTask<bool> FitToLoadedLayerFeatures(string layerId, FitBoundOptions? options = null) =>
        await _jsModule.InvokeAsync<bool>("fitToLoadedLayerFeatures", JsContainerId, layerId, options);

    /// <summary>
    /// Sets or clears the map's geographical bounds.
    /// </summary>
    /// <param name="bounds">The maximum bounds to set, or null to remove the map's maximum bounds.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    /// <see href="https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#setmaxbounds">setMaxBounds</see>
    public async ValueTask SetMaxBounds(LngLatBounds? bounds) =>
        await _jsModule.InvokeVoidAsync("setMaxBounds", JsContainerId, bounds);

    /// <summary>
    /// Pans, rotates, and zooms the map to fit the bounding box formed by two given screen points
    /// after rotating the map to the specified bearing. If the current map bearing is passed, the map will
    /// zoom without rotating.
    /// </summary>
    /// <remarks>
    /// Triggers the following events during the animation lifecycle: <c>movestart</c>, <c>move</c>, <c>moveend</c>,
    /// <c>zoomstart</c>, <c>zoom</c>, <c>zoomend</c>, and <c>rotate</c>.
    /// </remarks>
    /// <param name="p0">The first screen point, specified in pixel coordinates.</param>
    /// <param name="p1">The second screen point, specified in pixel coordinates.</param>
    /// <param name="bearing">The desired final map bearing, in degrees, for the animation.</param>
    /// <param name="options">Optional parameters to customize the animation behavior and padding.</param>
    /// <param name="eventData">Additional data to include with the triggered animation events.</param>
    /// <example>
    /// <code>
    /// var p0 = new PointLike(220, 400);
    /// var p1 = new PointLike(500, 900);
    /// await map.FitScreenCoordinates(p0, p1, map.GetBearing(), new FitBoundOptions
    /// {
    ///     Padding = new PaddingOptions { Top = 10, Bottom = 25, Left = 15, Right = 5 }
    /// });
    /// </code>
    /// </example>
    public async ValueTask FitScreenCoordinates(PointLike p0, PointLike p1, double bearing,
        FitBoundOptions? options = null, object? eventData = null) =>
        await _jsModule.InvokeVoidAsync("fitScreenCoordinates", JsContainerId, p0, p1, bearing, options, eventData);

    /// <summary>
    /// Smoothly transitions the map by animating changes to the center, zoom, bearing, pitch, and roll properties.
    /// The animation follows a flight-like curve, incorporating zooming and panning to maintain orientation over large distances.
    /// </summary>
    /// <remarks>
    /// Triggers the following events during the animation lifecycle: <c>movestart</c>, <c>move</c>, <c>moveend</c>,
    /// <c>zoomstart</c>, <c>zoom</c>, <c>zoomend</c>, <c>pitchstart</c>, <c>pitch</c>, <c>pitchend</c>, <c>rollstart</c>,
    /// <c>roll</c>, <c>rollend</c>, and <c>rotate</c>. The animation will be skipped and instead transition
    /// immediately if the user’s operating system has the ‘reduced motion’ accessibility feature enabled, unless the
    /// <paramref name="options"/> object includes <c>essential: true</c>.
    /// </remarks>
    /// <param name="options">Describes the animation destination and transition behavior. Includes camera and animation properties.</param>
    /// <param name="eventData">Additional data to include with triggered animation events.</param>
    /// <example>
    /// <code>
    /// // Fly to a specific location with default duration and easing.
    /// await map.FlyTo(new FlyToOptions { Center = new LngLat(0, 0), Zoom = 9 });
    ///
    /// // Customize the flight animation with specific options.
    /// await map.FlyTo(new FlyToOptions
    /// {
    ///     Center = new LngLat(0, 0),
    ///     Zoom = 9,
    ///     Speed = 0.2,
    ///     Curve = 1,
    ///     Easing = t => t
    /// });
    /// </code>
    /// </example>
    public async ValueTask FlyTo(FlyToOptions options, object? eventData = null) =>
        await _jsModule.InvokeVoidAsync("flyTo", JsContainerId, options, eventData);

    /// <summary>
    /// Gets the bearing of the map's current view direction.
    /// </summary>
    /// <returns>Returns the map's current bearing, a value in degrees.</returns>
    public async ValueTask<double> GetBearing() =>
        await _jsModule.InvokeAsync<double>("getBearing", JsContainerId);

    /// <summary>
    /// Gets the geographical bounds visible in the current viewport.
    /// </summary>
    /// <returns>The <see cref="LngLatBounds"/> object representing the visible geographical bounds.</returns>
    public async ValueTask<LngLatBounds> GetBounds() =>
        await _jsModule.InvokeAsync<LngLatBounds>("getBounds", JsContainerId);

    /// <summary>
    /// Gets the elevation of the camera target with respect to the terrain.
    /// </summary>
    /// <returns>The elevation of the center point in meters.</returns>
    public async ValueTask<double> GetCameraTargetElevation() =>
        await _jsModule.InvokeAsync<double>("getCameraTargetElevation", JsContainerId);

    /// <summary>
    /// Gets a reference to the map's HTML canvas element.
    /// </summary>
    /// <returns>A JSObjectReference representing the canvas element.</returns>
    public async ValueTask<IJSObjectReference> GetCanvas() =>
        await _jsModule.InvokeAsync<IJSObjectReference>("getCanvas", JsContainerId);

    /// <summary>
    /// Sets the CSS cursor style on the map canvas.
    /// </summary>
    /// <param name="cursor">The CSS cursor value. Pass null or empty to restore the default.</param>
    public async ValueTask SetCanvasCursor(string? cursor) =>
        await _jsModule.InvokeVoidAsync("setCanvasCursor", JsContainerId, cursor ?? string.Empty);

    /// <summary>
    /// Gets the container of the map's canvas element.
    /// </summary>
    /// <returns>A JSObjectReference representing the canvas container.</returns>
    public async ValueTask<IJSObjectReference> GetCanvasContainer() =>
        await _jsModule.InvokeAsync<IJSObjectReference>("getCanvasContainer", JsContainerId);

    /// <summary>
    /// Gets the geographical center of the current map view.
    /// </summary>
    /// <returns>A <see cref="LngLat"/> representing the center of the viewport.</returns>
    public async ValueTask<LngLat> GetCenter() =>
        await _jsModule.InvokeAsync<LngLat>("getCenter", JsContainerId);

    /// <summary>
    /// Returns the value of centerClampedToGround.
    /// If true, the elevation of the center point will automatically be set to the terrain elevation (or zero if
    /// terrain is not enabled). If false, the elevation of the center point will default to sea level and will not
    /// automatically update. Defaults to true. Needs to be set to false to keep the camera above ground when pitch > 90 degrees.
    /// </summary>
    /// <returns></returns>
    public async ValueTask<bool> GetCenterClampedToGround() =>
        await _jsModule.InvokeAsync<bool>("getCenterClampedToGround", JsContainerId);

    /// <summary>
    /// Returns the elevation of the map's center point.
    /// </summary>
    /// <returns></returns>
    public async ValueTask<double> GetCenterElevation() =>
        await _jsModule.InvokeAsync<double>("getCenterElevation", JsContainerId);

    /// <summary>
    /// Returns the map's containing HTML element.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation, resulting in a JavaScript object reference to the container element.</returns>
    public async ValueTask<IJSObjectReference> GetContainer() =>
        await _jsModule.InvokeAsync<IJSObjectReference>("getContainer", JsContainerId);

    /// <summary>
    /// Gets the state of a feature. A feature's state is a set of user-defined key-value pairs that are assigned to a
    /// feature at runtime. Features are identified by their feature.id attribute, which can be any number or string.
    /// Note: To access the values in a feature's state object for the purposes of styling the feature, use the feature-state expression.
    /// </summary>
    /// <param name="feature">The feature whose state is to be retrieved.</param>
    /// <returns>A task representing the asynchronous operation, with the result containing the state of the feature as an object.</returns>
    public async ValueTask<object> GetFeatureState(FeatureIdentifier feature) =>
        await _jsModule.InvokeAsync<object>("getFeatureState", JsContainerId, feature);

    /// <summary>
    /// Returns the filter applied to the specified style layer.
    /// </summary>
    /// <param name="layerId"></param>
    /// <returns></returns>
    public async ValueTask<JsonElement?> GetFilter(string layerId) =>
        await _jsModule.InvokeAsync<JsonElement?>("getFilter", JsContainerId, layerId);

    /// <summary>
    /// Returns the value of the style's glyphs URL
    /// </summary>
    /// <returns></returns>
    public async ValueTask<string> GetGlyphs() =>
        await _jsModule.InvokeAsync<string>("getGlyphs", JsContainerId);

    /// <summary>
    /// Returns an image, specified by ID, currently available in the map. This includes both images from the style's
    /// original sprite and any images that have been added at runtime using Map#addImage.
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    public async ValueTask<string> GetImage(string id) =>
        await _jsModule.InvokeAsync<string>("getImage", JsContainerId, id);

    /// <summary>
    /// Returns the layer with the specified ID in the map's style.
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    public async ValueTask<object> GetLayer(string id) =>
        await _jsModule.InvokeAsync<object>("getLayer", JsContainerId, id);

    /// <summary>
    /// Returns the layer with the specified ID deserialized to a typed <see cref="Layer"/> model.
    /// </summary>
    public async ValueTask<Layer?> GetLayerAsLayer(string id)
    {
        var json = await _jsModule.InvokeAsync<JsonElement?>("getLayer", JsContainerId, id);
        if (json is null || json.Value.ValueKind is JsonValueKind.Null or JsonValueKind.Undefined)
        {
            return null;
        }

        return JsonSerializer.Deserialize<Layer>(json.Value.GetRawText(), MapLibreJsonSerializer.Options);
    }

    /// <summary>
    /// Checks if a layer exists in the map's style by its ID.
    /// </summary>
    /// <param name="id">The ID of the layer to check.</param>
    /// <returns>True if the layer exists, false otherwise.</returns>
    public async ValueTask<bool> HasLayer(string id) =>
        await _jsModule.InvokeAsync<bool>("hasLayer", JsContainerId, id);

    /// <summary>
    /// Return the ids of all layers currently in the style, including custom layers, in order.
    /// </summary>
    /// <returns></returns>
    public async ValueTask<string[]> GetLayersOrder() =>
        await _jsModule.InvokeAsync<string[]>("getLayersOrder", JsContainerId);

    /// <summary>
    /// Returns the value of a layout property in the specified style layer.
    /// </summary>
    /// <param name="layerId"></param>
    /// <param name="name"></param>
    /// <returns></returns>
    public async ValueTask<object> GetLayoutProperty(string layerId, string name) =>
        await _jsModule.InvokeAsync<object>("getLayoutProperty", JsContainerId, layerId, name);

    /// <summary>
    /// Retrieves the maximum geographical bounds the map is constrained to.
    /// </summary>
    /// <returns>An object representing the map's maximum bounds or null if not set.</returns>
    public async ValueTask<LngLatBounds?> GetMaxBounds() =>
        await _jsModule.InvokeAsync<LngLatBounds?>("getMaxBounds", JsContainerId);

    /// <summary>
    /// Retrieves the map's maximum allowable pitch.
    /// </summary>
    /// <returns>The maximum allowable pitch in degrees.</returns>
    public async ValueTask<double> GetMaxPitch() =>
        await _jsModule.InvokeAsync<double>("getMaxPitch", JsContainerId);

    /// <summary>
    /// Retrieves the map's maximum allowable zoom level.
    /// </summary>
    /// <returns>The maximum zoom level allowed by the map.</returns>
    public async ValueTask<double> GetMaxZoom() =>
        await _jsModule.InvokeAsync<double>("getMaxZoom", JsContainerId);

    /// <summary>
    /// Retrieves the map's minimum allowable pitch.
    /// </summary>
    /// <returns>The minimum allowable pitch in degrees.</returns>
    public async ValueTask<double> GetMinPitch() =>
        await _jsModule.InvokeAsync<double>("getMinPitch", JsContainerId);

    /// <summary>
    /// Retrieves the map's minimum allowable zoom level.
    /// </summary>
    /// <returns>The minimum zoom level allowed by the map.</returns>
    public async ValueTask<double> GetMinZoom() =>
        await _jsModule.InvokeAsync<double>("getMinZoom", JsContainerId);

    /// <summary>
    /// Retrieves the current padding applied to the map's viewport.
    /// </summary>
    /// <returns>An object representing padding options applied to the map.</returns>
    public async ValueTask<PaddingOptions> GetPadding() =>
        await _jsModule.InvokeAsync<PaddingOptions>("getPadding", JsContainerId);

    /// <summary>
    /// Retrieves the value of a specific paint property of a specified layer.
    /// </summary>
    /// <param name="layerId">The ID of the layer to get the paint property from.</param>
    /// <param name="name">The name of the paint property.</param>
    /// <returns>The value of the specified paint property.</returns>
    public async ValueTask<object?> GetPaintProperty(string layerId, string name) =>
        await _jsModule.InvokeAsync<object?>("getPaintProperty", JsContainerId, layerId, name);

    /// <summary>
    /// Retrieves the current pitch (tilt) of the map in degrees.
    /// </summary>
    /// <returns>The map's current pitch value.</returns>
    public async ValueTask<double> GetPitch() =>
        await _jsModule.InvokeAsync<double>("getPitch", JsContainerId);

    /// <summary>
    /// Retrieves the map's pixel ratio.
    /// </summary>
    /// <returns>The pixel ratio of the map.</returns>
    public async ValueTask<double> GetPixelRatio() =>
        await _jsModule.InvokeAsync<double>("getPixelRatio", JsContainerId);

    /// <summary>
    /// Retrieves the projection specification of the map.
    /// </summary>
    /// <returns>An object representing the map's projection specification.</returns>
    public async ValueTask<object> GetProjection() =>
        await _jsModule.InvokeAsync<object>("getProjection", JsContainerId);

    /// <summary>
    /// Returns the state of whether multiple world copies are rendered or not.
    /// </summary>
    /// <returns>True if multiple world copies are rendered; otherwise, false.</returns>
    public async ValueTask<bool> GetRenderWorldCopies() =>
        await _jsModule.InvokeAsync<bool>("getRenderWorldCopies", JsContainerId);

    /// <summary>
    /// Retrieves the current roll angle of the map in degrees.
    /// </summary>
    /// <returns>The current roll value of the map.</returns>
    public async ValueTask<double> GetRoll() =>
        await _jsModule.InvokeAsync<double>("getRoll", JsContainerId);

    /// <summary>
    /// Retrieves a source from the map's style by its ID.
    /// </summary>
    /// <param name="id">The ID of the source to retrieve.</param>
    /// <returns>The source object if found, or null if not found.</returns>
    public async ValueTask<ISource?> GetSource(string id) =>
        await _jsModule.InvokeAsync<ISource?>("getSource", JsContainerId, id);

    /// <summary>
    /// Returns the source with the specified ID deserialized to a typed <see cref="ISource"/> model.
    /// </summary>
    public async ValueTask<ISource?> GetSourceAsSource(string id)
    {
        var json = await _jsModule.InvokeAsync<JsonElement?>("getSource", JsContainerId, id);
        if (json is null || json.Value.ValueKind is JsonValueKind.Null or JsonValueKind.Undefined)
        {
            return null;
        }

        return JsonSerializer.Deserialize<ISource>(json.Value.GetRawText(), MapLibreJsonSerializer.Options);
    }

    /// <summary>
    /// Checks if a source exists in the map's style by its ID.
    /// </summary>
    /// <param name="id">The ID of the source to check.</param>
    /// <returns>True if the source exists, false otherwise.</returns>
    public async ValueTask<bool> HasSource(string id) =>
        await _jsModule.InvokeAsync<bool>("hasSource", JsContainerId, id);

    /// <summary>
    /// Returns the value of a global state property.
    /// </summary>
    public async ValueTask<object?> GetGlobalStateProperty(string propertyName) =>
        await _jsModule.InvokeAsync<object?>("getGlobalStateProperty", JsContainerId, propertyName);

    /// <summary>
    /// Retrieves the style's sprite as a list of objects.
    /// </summary>
    /// <returns>A list of objects representing the style's sprite.</returns>
    public async ValueTask<object[]> GetSprite() =>
        await _jsModule.InvokeAsync<object[]>("getSprite", JsContainerId);

    /// <summary>
    /// Retrieves the map's style specification.
    /// </summary>
    /// <returns>An object representing the style specification of the map.</returns>
    public async ValueTask<object> GetStyle() =>
        await _jsModule.InvokeAsync<object>("getStyle", JsContainerId);

    /// <summary>
    /// Retrieves the map's style specification as a <see cref="JsonElement"/>.
    /// </summary>
    public async ValueTask<JsonElement> GetStyleAsJsonElement() =>
        await _jsModule.InvokeAsync<JsonElement>("getStyle", JsContainerId);

    /// <summary>
    /// Retrieves the terrain options if terrain is loaded.
    /// </summary>
    /// <returns>An object representing terrain options, or null if not loaded.</returns>
    public async ValueTask<object?> GetTerrain() =>
        await _jsModule.InvokeAsync<object?>("getTerrain", JsContainerId);

    /// <summary>
    /// Enables 3D terrain using a raster-dem source.
    /// </summary>
    public async ValueTask SetTerrain(TerrainSpecification? terrain)
    {
        if (_bulkTransaction is not null)
        {
            _bulkTransaction.Add("setTerrain", terrain);
            return;
        }

        await _jsModule.InvokeVoidAsync("setTerrain", JsContainerId, terrain);
    }

    /// <summary>
    /// Retrieves the sky configuration of the map style.
    /// </summary>
    public async ValueTask<SkySpecification?> GetSky() =>
        await _jsModule.InvokeAsync<SkySpecification?>("getSky", JsContainerId);

    /// <summary>
    /// Sets the sky configuration of the map style.
    /// </summary>
    public async ValueTask SetSky(SkySpecification? sky)
    {
        if (_bulkTransaction is not null)
        {
            _bulkTransaction.Add("setSky", sky);
            return;
        }

        await _jsModule.InvokeVoidAsync("setSky", JsContainerId, sky);
    }

    /// <summary>
    /// Retrieves the light configuration of the map style.
    /// </summary>
    public async ValueTask<LightSpecification?> GetLight() =>
        await _jsModule.InvokeAsync<LightSpecification?>("getLight", JsContainerId);

    /// <summary>
    /// Sets the light configuration of the map style.
    /// </summary>
    public async ValueTask SetLight(LightSpecification? light)
    {
        if (_bulkTransaction is not null)
        {
            _bulkTransaction.Add("setLight", light);
            return;
        }

        await _jsModule.InvokeVoidAsync("setLight", JsContainerId, light);
    }

    /// <summary>
    /// Overrides the map transform constraint callback at runtime (MapLibre 5.10+).
    /// </summary>
    public async ValueTask SetTransformConstrain(Func<TransformConstrainState, TransformConstrainState> handler)
    {
        ArgumentNullException.ThrowIfNull(handler);

        _transformConstrainReference?.Dispose();
        _transformConstrainReference = DotNetObjectReference.Create(new TransformConstrainCallbackHandler(handler));
        await _jsModule.InvokeVoidAsync("setTransformConstrain", JsContainerId, _transformConstrainReference);
    }

    /// <summary>
    /// Sets a callback to customize HTTP requests for map resources (tiles, glyphs, sprites, etc.).
    /// The callback must return a MapLibre <c>RequestParameters</c> object: set only the fields you want
    /// to override. Optional fields such as <c>credentials</c> must be omitted when unused.
    /// Pass <c>null</c> to clear the callback.
    /// </summary>
    public async ValueTask SetTransformRequest(Func<TransformRequestInput, TransformRequestResult>? handler)
    {
        _transformRequestReference?.Dispose();
        _transformRequestReference = handler is null
            ? null
            : DotNetObjectReference.Create(new TransformRequestCallbackHandler(handler));
        await _jsModule.InvokeVoidAsync("setTransformRequest", JsContainerId, _transformRequestReference);
    }

    /// <summary>
    /// Sets the event parent to bubble events to another map instance, or clears the parent when <paramref name="parentMapId"/> is null.
    /// </summary>
    /// <param name="parentMapId">The <see cref="MapId"/> of the parent map, or null to clear.</param>
    /// <param name="data">Optional data passed with bubbled events.</param>
    public async ValueTask SetEventedParent(string? parentMapId, object? data = null) =>
        await _jsModule.InvokeVoidAsync("setEventedParent", JsContainerId, parentMapId, data);

    /// <summary>
    /// Adds a custom layer backed by .NET render callbacks.
    /// </summary>
    public async ValueTask AddCustomLayer(string layerId, CustomLayerOptions options, CustomLayerHandler handler, string? beforeId = null)
    {
        ArgumentNullException.ThrowIfNull(handler);

        if (_customLayerHandlers.TryRemove(layerId, out var existing))
        {
            existing.Dispose();
        }

        var reference = DotNetObjectReference.Create(handler);
        _customLayerHandlers[layerId] = reference;
        await _jsModule.InvokeVoidAsync("addCustomLayer", JsContainerId, layerId, options, reference, beforeId);
    }

    /// <summary>
    /// Freezes MapLibre's internal clock for deterministic rendering (MapLibre 5.10+).
    /// </summary>
    public async ValueTask TimeControlSetNow(double timestamp) =>
        await _jsModule.InvokeVoidAsync("timeControlSetNow", timestamp);

    /// <summary>
    /// Restores MapLibre's internal clock to real time (MapLibre 5.10+).
    /// </summary>
    public async ValueTask TimeControlRestoreNow() =>
        await _jsModule.InvokeVoidAsync("timeControlRestoreNow");

    /// <summary>
    /// Returns whether MapLibre time is frozen (MapLibre 5.10+).
    /// </summary>
    public async ValueTask<bool> TimeControlIsFrozen() =>
        await _jsModule.InvokeAsync<bool>("timeControlIsFrozen");

    /// <summary>
    /// Retrieves the map's current vertical field of view in degrees.
    /// </summary>
    /// <returns>The map's vertical field of view in degrees.</returns>
    public async ValueTask<double> GetVerticalFieldOfView() =>
        await _jsModule.InvokeAsync<double>("getVerticalFieldOfView", JsContainerId);

    /// <summary>
    /// Retrieves the map's current zoom level.
    /// </summary>
    /// <returns>The current zoom level of the map.</returns>
    public async ValueTask<double> GetZoom() =>
        await _jsModule.InvokeAsync<double>("getZoom", JsContainerId);

    /// <summary>
    /// Returns the zoom level at which a clustered GeoJSON source expands the given cluster.
    /// </summary>
    public async ValueTask<double> GetClusterExpansionZoom(string sourceId, int clusterId) =>
        await _jsModule.InvokeAsync<double>(
            "getClusterExpansionZoom",
            JsContainerId,
            sourceId,
            clusterId);

    /// <summary>
    /// Checks if a specific control exists on the map.
    /// </summary>
    /// <param name="control">The control instance to check for.</param>
    /// <returns>True if the control exists on the map; otherwise, false.</returns>
    public async ValueTask<bool> HasControl(object control) =>
        await _jsModule.InvokeAsync<bool>("hasControl", JsContainerId, control);

    /// <summary>
    /// Checks whether a specific image ID exists in the map's style.
    /// </summary>
    /// <param name="id">The image ID to check.</param>
    /// <returns>True if the image exists; otherwise, false.</returns>
    public async ValueTask<bool> HasImage(string id) =>
        await _jsModule.InvokeAsync<bool>("hasImage", JsContainerId, id);

    /// <summary>
    /// Determines if the map is currently moving.
    /// </summary>
    /// <returns>True if the map is moving; otherwise, false.</returns>
    public async ValueTask<bool> IsMoving() =>
        await _jsModule.InvokeAsync<bool>("isMoving", JsContainerId);

    /// <summary>
    /// Determines if the map is currently rotating.
    /// </summary>
    /// <returns>True if the map is rotating; otherwise, false.</returns>
    public async ValueTask<bool> IsRotating() =>
        await _jsModule.InvokeAsync<bool>("isRotating", JsContainerId);

    /// <summary>
    /// Determines if a source with the given ID is loaded in the map.
    /// </summary>
    /// <param name="id">The ID of the source to check.</param>
    /// <returns>True if the source is loaded; otherwise, false.</returns>
    public async ValueTask<bool> IsSourceLoaded(string id) =>
        await _jsModule.InvokeAsync<bool>("isSourceLoaded", JsContainerId, id);

    /// <summary>
    /// Determines if the map's style is fully loaded.
    /// </summary>
    /// <returns>True if the style is fully loaded; otherwise, false.</returns>
    public async ValueTask<bool> IsStyleLoaded() =>
        await _jsModule.InvokeAsync<bool>("isStyleLoaded", JsContainerId);

    /// <summary>
    /// Determines if the map is currently zooming.
    /// </summary>
    /// <returns>True if the map is zooming; otherwise, false.</returns>
    public async ValueTask<bool> IsZooming() =>
        await _jsModule.InvokeAsync<bool>("isZooming", JsContainerId);

    /// <summary>
    /// Instantly moves the map camera to a new location, zoom, bearing, pitch, or roll without animation.
    /// Unspecified properties in <paramref name="options"/> will retain their current values.
    /// </summary>
    /// <param name="options">
    /// An object specifying the new camera state, such as center, zoom, pitch, bearing, or roll.
    /// </param>
    /// <param name="eventData">
    /// Optional. Extra data to attach to any events triggered by this method.
    /// </param>
    public async ValueTask JumpTo(JumpToOptions options, object? eventData = null) =>
        await _jsModule.InvokeVoidAsync("jumpTo", JsContainerId, options, eventData);

    /// <summary>
    /// Determines if there are any registered listeners for a given event type on the map.
    /// </summary>
    /// <param name="type">The event type to check.</param>
    /// <returns>True if a listener exists for the given event type; otherwise, false.</returns>
    public async ValueTask<bool> Listens(string type) =>
        await _jsModule.InvokeAsync<bool>("listens", JsContainerId, type);

    /// <summary>
    /// Lists all image IDs available in the map's style.
    /// </summary>
    /// <returns>An array of image IDs available in the style.</returns>
    public async ValueTask<string[]> ListImages() =>
        await _jsModule.InvokeAsync<string[]>("listImages", JsContainerId);

    /// <summary>
    /// Checks if the map is fully loaded.
    /// </summary>
    /// <returns>True if the map is fully loaded; otherwise, false.</returns>
    public async ValueTask<bool> Loaded() =>
        await _jsModule.InvokeAsync<bool>("loaded", JsContainerId);

    /// <summary>
    /// Loads an image from an external URL and returns it.
    /// </summary>
    /// <param name="url">The URL of the image to load.</param>
    /// <returns>An object containing the loaded image.</returns>
    public async ValueTask<object> LoadImage(string url) =>
        await _jsModule.InvokeAsync<object>("loadImage", JsContainerId, url);

    /// <summary>
    /// Moves a layer to a different z-position in the style.
    /// </summary>
    /// <param name="id">The ID of the layer to move.</param>
    /// <param name="beforeId">The ID of the target layer to place the layer before.</param>
  public async ValueTask MoveLayer(string id, string? beforeId = null)
    {
        if (_bulkTransaction is not null)
        {
            _bulkTransaction.Add("moveLayer", id, beforeId);
            return;
        }

        await _jsModule.InvokeVoidAsync("moveLayer", JsContainerId, id, beforeId);
    }

    /// <summary>
    /// Pans the map by a specified offset.
    /// </summary>
    /// <param name="offset">The offset by which to pan the map, in pixels.</param>
    /// <param name="options">Additional pan options (e.g., animation parameters).</param>
    /// <param name="eventData">Optional event data associated with the operation.</param>
    public async ValueTask PanBy(PointLike offset, EaseToOptions? options = null, object? eventData = null) =>
        await _jsModule.InvokeVoidAsync("panBy", JsContainerId, offset, options, eventData);

    /// <summary>
    /// Pans the map to the given geographical location.
    /// </summary>
    /// <param name="lngLat">The target longitude and latitude to pan to.</param>
    /// <param name="options">Additional options (e.g., duration).</param>
    /// <param name="eventData">Optional event data.</param>
    public async ValueTask PanTo(LngLat lngLat, EaseToOptions? options = null, object? eventData = null) =>
        await _jsModule.InvokeVoidAsync("panTo", JsContainerId, lngLat, options, eventData);

    /// <summary>
    /// Projects geographical coordinates to pixel coordinates in the current map view.
    /// </summary>
    /// <param name="lngLat">The geographical coordinates to project.</param>
    /// <returns>The projected point as pixel coordinates.</returns>
    public async ValueTask<PointLike> Project(LngLat lngLat)
    {
        var result = await _jsModule.InvokeAsync<double[]>("project", JsContainerId, lngLat);
        return PointLike.FromArray(result);
    }

    /// <summary>
    /// Queries the map for rendered features within a specified geometry or options.
    /// </summary>
    /// <param name="query">The query geometry or options.</param>
    /// <param name="options">Additional query options (e.g., layer IDs).</param>
    /// <returns>An array of features matching the query.</returns>
    public async ValueTask<object[]> QueryRenderedFeatures(object query, object? options = null) =>
        await _jsModule.InvokeAsync<object[]>("queryRenderedFeatures", JsContainerId, query, options);

    public async ValueTask<object[]> QueryRenderedFeaturesWithoutGeometriesReturned(object query, object? options = null) =>
        await _jsModule.InvokeAsync<object[]>("queryRenderedFeaturesWithoutGeometriesReturned", JsContainerId, query, options);

    /// <summary>
    /// Queries rendered features and deserializes them as <see cref="LayerFeatureFeature"/> objects.
    /// </summary>
    public async ValueTask<LayerFeatureFeature[]> QueryRenderedLayerFeatures(object query, object? options = null)
    {
        var json = await _jsModule.InvokeAsync<string>("queryRenderedFeaturesJson", JsContainerId, query, options);
        return JsonSerializer.Deserialize<LayerFeatureFeature[]>(json, LayerFeatureSerializer) ?? [];
    }

    /// <summary>
    /// Returns an array of <see cref="SimpleFeature"/> objects representing features within the specified vector tile or GeoJSON source that satisfy the query parameters.
    /// </summary>
    /// <param name="sourceId">
    /// The ID of the vector tile or GeoJSON source to query.
    /// </param>
    /// <param name="parameters">
    /// (Optional) Additional options to filter source features, such as <c>sourceLayer</c> or <c>filter</c>.
    /// </param>
    /// <returns>
    /// An array of <see cref="SimpleFeature"/> objects. These include all features that match the query parameters,
    /// regardless of whether they are currently rendered by the style.
    /// </returns>
    /// <remarks>
    /// In contrast to <c>QueryRenderedFeatures</c>, this method includes all matching features from loaded tiles,
    /// whether or not they are visible. Note that features may be split or duplicated across tile boundaries.
    /// </remarks>
    /// <example>
    /// Find all features in the "your-source-layer" layer of a vector source:
    /// <code>
    /// var features = map.QuerySourceFeatures("your-source-id", new QuerySourceFeatureOptions {
    ///     SourceLayer = "your-source-layer"
    /// });
    /// </code>
    /// </example>
    public async ValueTask<IFeature[]> QuerySourceFeatures(string sourceId, QuerySourceFeatureOptions parameters) =>
        await _jsModule.InvokeAsync<IFeature[]>("querySourceFeatures", JsContainerId, sourceId, parameters);

    /// <summary>
    /// Gets the elevation at a given location, in meters above sea level.
    /// </summary>
    /// <param name="lngLat">
    /// A geographic coordinate representing the location to query. Can be a <c>LngLat</c> object or an array [longitude, latitude].
    /// </param>
    /// <returns>
    /// The elevation in meters above sea level at the specified location. Returns <c>null</c> if terrain is not enabled.
    /// If terrain exaggeration is applied, the returned elevation is multiplied accordingly.
    /// </returns>
    /// <remarks>
    /// This method is useful for accurately positioning custom 3D objects relative to terrain elevation.
    /// </remarks>
    public async ValueTask<double> QueryTerrainElevation(LngLat lngLat) =>
        await _jsModule.InvokeAsync<double>("queryTerrainElevation", JsContainerId, lngLat);

    /// <summary>
    /// Forces a redraw of the map.
    /// </summary>
    public async ValueTask Redraw() =>
        await _jsModule.InvokeVoidAsync("redraw", JsContainerId);

    /// <summary>
    /// Cleans up internal resources associated with the map and removes it.
    /// </summary>
    public async ValueTask Remove()
    {
        await _jsModule.InvokeVoidAsync("remove", JsContainerId);
    }

    /// <summary>
    /// Removes a control from the map.
    /// </summary>
    /// <param name="control">The control to remove.</param>
    public async ValueTask RemoveControl(object control)
    {
        if (_bulkTransaction is not null)
        {
            _bulkTransaction.Add("removeControl", control);
            return;
        }
        await _jsModule.InvokeVoidAsync("removeControl", JsContainerId, control);
    }

    /// <summary>
    /// Removes the state of a feature, setting it back to the default behavior.
    /// <list type="bullet">
    /// <item>If only <c>target.source</c> is specified, it will remove the state for all features from that source.</item>
    /// <item>If <c>target.id</c> is also specified, it removes all keys for that specific feature's state.</item>
    /// <item>If <paramref name="key"/> is also provided, only that key is removed from the feature's state.</item>
    /// </list>
    /// Features are identified by their <c>feature.id</c> attribute, which can be any number or string.
    /// </summary>
    /// <param name="target">
    /// Identifier of where to remove state. It can refer to a source, a specific feature, or a key of a feature.
    /// Feature objects returned from <c>QueryRenderedFeatures</c> or event handlers can be used.
    /// </param>
    /// <param name="key">
    /// (Optional) The key in the feature state to reset.
    /// </param>
    /// <returns>The current map instance.</returns>
    /// <example>
    /// Reset the entire state object for all features in the "my-source" source:
    /// <code>
    /// map.RemoveFeatureState(new FeatureIdentifier { Source = "my-source" });
    /// </code>
    /// </example>
    /// <example>
    /// Reset the entire state object for a specific feature:
    /// <code>
    /// map.RemoveFeatureState(new FeatureIdentifier {
    ///     Source = "my-source",
    ///     SourceLayer = "my-source-layer",
    ///     Id = featureId
    /// });
    /// </code>
    /// </example>
    /// <example>
    /// Reset only the "hover" key for a specific feature:
    /// <code>
    /// map.RemoveFeatureState(new FeatureIdentifier {
    ///     Source = "my-source",
    ///     SourceLayer = "my-source-layer",
    ///     Id = featureId
    /// }, "hover");
    /// </code>
    /// </example>
    public async ValueTask RemoveFeatureState(FeatureIdentifier target, string? key = null)
    {
        if (_bulkTransaction is not null)
        {
            _bulkTransaction.Add("removeFeatureState", target, key);
            return;
        }
        await _jsModule.InvokeVoidAsync("removeFeatureState", JsContainerId, target, key);
    }

    /// <summary>
    /// Removes an image from the map's style by ID.
    /// </summary>
    /// <param name="id">The ID of the image to remove.</param>
    public async ValueTask RemoveImage(string id)
    {
        if (_bulkTransaction is not null)
        {
            _bulkTransaction.Add("removeImage", id);
            return;
        }
        await _jsModule.InvokeVoidAsync("removeImage", JsContainerId, id);
    }

    /// <summary>
    /// Removes a layer from the map by its ID.
    /// </summary>
    /// <param name="id">The ID of the layer to remove.</param>
    public async ValueTask RemoveLayer(string id)
    {
        if (_bulkTransaction is not null)
        {
            _bulkTransaction.Add("removeLayer", id);
            return;
        }

        if (_customLayerHandlers.TryRemove(id, out var handler))
        {
            handler.Dispose();
        }

        await _jsModule.InvokeVoidAsync("removeLayer", JsContainerId, id);
    }

    /// <summary>
    /// Sets the zoom range of the specified style layer.
    /// </summary>
    public async ValueTask SetLayerZoomRange(string layerId, float minzoom, float maxzoom)
    {
        if (_bulkTransaction is not null)
        {
            _bulkTransaction.Add("setLayerZoomRange", layerId, minzoom, maxzoom);
            return;
        }

        await _jsModule.InvokeVoidAsync("setLayerZoomRange", JsContainerId, layerId, minzoom, maxzoom);
    }

    /// <summary>
    /// Removes a source from the map's style.
    /// </summary>
    /// <param name="id">The ID of the source to remove.</param>
    public async ValueTask RemoveSource(string id)
    {
        if (_bulkTransaction is not null)
        {
            _bulkTransaction.Add("removeSource", id);
            return;
        }
        await _jsModule.InvokeVoidAsync("removeSource", JsContainerId, id);
    }

    /// <summary>
    /// Removes the sprite from the map's style by ID.
    /// </summary>
    /// <param name="id">The ID of the sprite to remove.</param>
    public async ValueTask RemoveSprite(string id)
    {
        if (_bulkTransaction is not null)
        {
            _bulkTransaction.Add("removeSprite", id);
            return;
        }
        await _jsModule.InvokeVoidAsync("removeSprite", JsContainerId, id);
    }

    /// <summary>
    /// Rotates and pitches the map so that north is up (0° bearing) and pitch and roll are 0°, with an animated transition.
    /// <br/>
    /// Triggers the following events: movestart, moveend, and rotate.
    /// </summary>
    /// <param name="options">Animation options.</param>
    /// <param name="eventData">Optional event data.</param>
    public async ValueTask ResetNorth(AnimationOptions? options = null, object? eventData = null) =>
        await _jsModule.InvokeVoidAsync("resetNorth", JsContainerId, options, eventData);

    /// <summary>
    /// Resets the map’s north and pitch angles with an animated transition.
    /// <br/>
    /// Triggers the following events: movestart, move, moveend, pitchstart, pitch, pitchend, rollstart, roll, rollend, and rotate.
    /// </summary>
    /// <param name="options">Animation options.</param>
    /// <param name="eventData">Optional event data.</param>
    public async ValueTask ResetNorthPitch(AnimationOptions? options = null, object? eventData = null) =>
        await _jsModule.InvokeVoidAsync("resetNorthPitch", JsContainerId, options, eventData);

    /// <summary>
    /// Resizes the map to fit its container dimensions.
    /// Checks if the map container size changed and updates the map if it has changed.
    /// This method must be called after the map's container is resized programmatically or when the map is shown after being initially hidden with CSS.<br/>
    /// Triggers the following events: movestart, move, moveend, and resize.
    /// </summary>
    /// <param name="eventData">
    /// Additional properties to be passed to movestart, move, resize, and moveend events that get triggered as a result of resize.
    /// This can be useful for differentiating the source of an event (for example, user-initiated or programmatically-triggered events).
    /// </param>
    /// <param name="constrainTransform">Whether to constrain the transform.</param>
    public async ValueTask Resize(object? eventData = null, bool constrainTransform = true) =>
        await _jsModule.InvokeVoidAsync("resize", JsContainerId, eventData, constrainTransform);

    /// <summary>
    /// Rotates the map to the specified bearing.
    /// </summary>
    /// <param name="bearing">The target bearing.</param>
    /// <param name="options">Optional animation options.</param>
    /// <param name="eventData">Optional event data.</param>
    public async ValueTask RotateTo(double bearing, EaseToOptions? options = null, object? eventData = null) =>
        await _jsModule.InvokeVoidAsync("rotateTo", JsContainerId, bearing, options, eventData);

    /// <summary>
    /// Sets the map's bearing (rotation).
    /// </summary>
    /// <param name="bearing">The bearing in degrees.</param>
    /// <param name="eventData">Optional event data.</param>
    public async ValueTask SetBearing(double bearing, object? eventData = null) =>
        await _jsModule.InvokeVoidAsync("setBearing", JsContainerId, bearing, eventData);

    /// <summary>
    /// Sets the map's geographical center.
    /// </summary>
    /// <param name="center">The geographical center coordinates [longitude, latitude].</param>
    /// <param name="eventData">Optional event data.</param>
    public async ValueTask SetCenter(LngLat center, object? eventData = null) =>
        await _jsModule.InvokeVoidAsync("setCenter", JsContainerId, center, eventData);

    /// <summary>
    /// Sets whether the map's center is clamped to the ground.
    /// </summary>
    /// <param name="centerClampedToGround">Whether to clamp the map's center to the ground.</param>
    public async ValueTask SetCenterClampedToGround(bool centerClampedToGround) =>
        await _jsModule.InvokeVoidAsync("setCenterClampedToGround", JsContainerId, centerClampedToGround);

    /// <summary>
    /// Sets the elevation of the map's center point.
    /// </summary>
    /// <param name="elevation">The elevation in meters.</param>
    /// <param name="eventData">Optional event data.</param>
    public async ValueTask SetCenterElevation(double elevation, object? eventData = null) =>
        await _jsModule.InvokeVoidAsync("setCenterElevation", JsContainerId, elevation, eventData);

    /// <summary>
    /// Updates the state of a specific feature on the map.
    /// </summary>
    /// <param name="feature">The feature identifier object.</param>
    /// <param name="state">The state properties to apply to the feature.</param>
    public async ValueTask SetFeatureState(FeatureIdentifier feature, object state)
    {
        if (_bulkTransaction is not null)
        {
            _bulkTransaction.Add("setFeatureState", feature, state);
            return;
        }

        await _jsModule.InvokeVoidAsync("setFeatureState", JsContainerId, feature, state);
    }

    public async ValueTask SetGlobalStateProperty(string propertyName, object value) =>
        await _jsModule.InvokeVoidAsync("setGlobalStateProperty", JsContainerId, propertyName, value);

    /// <summary>
    /// Sets the filter for the specified style layer.
    /// </summary>
    /// <remarks>
    /// Filters control which features a style layer renders from its source.
    /// Any feature for which the filter expression evaluates to <c>true</c> will be rendered on the map.
    /// Those that are <c>false</c> will be hidden.
    /// Use <c>SetFilter</c> to show a subset of your source data.
    /// To clear the filter, pass <c>null</c> or omit the second parameter.
    /// </remarks>
    /// <param name="layerId">
    /// The ID of the layer to apply the filter to.
    /// </param>
    /// <param name="filter">
    /// The filter, conforming to the MapLibre Style Specification's filter definition.
    /// If <c>null</c> is provided, the function removes any existing filter from the layer.
    /// </param>
    /// <param name="options">
    /// Optional. An options object for configuring style setting behavior.
    /// </param>
    public async ValueTask SetFilter(string layerId, object filter, StyleSetterOptions options)
    {
        if (_bulkTransaction is not null)
        {
            _bulkTransaction.Add("setFilter", layerId, filter, options);
            return;
        }

        await _jsModule.InvokeVoidAsync("setFilter", JsContainerId, layerId, filter, options);
    }

    /// <summary>
    /// Sets the value of a layout property in the specified style layer.
    /// </summary>
    /// <param name="layerId">
    /// The ID of the layer to set the layout property in.</param>
    /// <param name="name">
    /// The name of the layout property to set.</param>
    /// <param name="value">
    /// The value of the layout property. Must be of a type appropriate for the property, as defined in the MapLibre Style Specification.</param>
    /// <param name="options"></param>
    /// Optional. An options object for configuring style setting behavior.
    public async ValueTask SetLayoutProperty(string layerId, string name, object value, StyleSetterOptions? options = null)
    {
        if (_bulkTransaction is not null)
        {
            _bulkTransaction.Add("setLayoutProperty", layerId, name, value, options);
            return;
        }

        await _jsModule.InvokeVoidAsync("setLayoutProperty", JsContainerId, layerId, name, value, options);
    }

    /// <summary>
    /// Sets the value of a paint property in the specified style layer.
    /// </summary>
    /// <param name="layerId">The ID of the layer to set the paint property in.</param>
    /// <param name="name">The name of the paint property to set.</param>
    /// <param name="value">The value of the paint property.</param>
    /// <param name="options">Optional style setter options.</param>
    public async ValueTask SetPaintProperty(string layerId, string name, object value, StyleSetterOptions? options = null)
    {
        if (_bulkTransaction is not null)
        {
            _bulkTransaction.Add("setPaintProperty", layerId, name, value, options);
            return;
        }

        await _jsModule.InvokeVoidAsync("setPaintProperty", JsContainerId, layerId, name, value, options);
    }

    /// <summary>
    /// Sets the map's projection configuration, which determines how geographic coordinates are projected to the screen.
    /// </summary>
    /// <param name="projection">
    /// The projection specification to apply. This can be a string (e.g., <c>"mercator"</c>),
    /// a dynamic expression (e.g., based on zoom), or a custom projection definition.
    /// </param>
    public async ValueTask SetProjection(ProjectionSpecification projection)
    {
        if (_bulkTransaction is not null)
        {
            _bulkTransaction.Add("setProjection", projection);
            return;
        }

        await _jsModule.InvokeVoidAsync("setProjection", JsContainerId, projection);
    }

    /// <summary>
    /// Sets a zoom level for the map.
    /// </summary>
    /// <param name="zoom">The desired zoom level (0–20).</param>
    /// <param name="eventData">Optional event data.</param>
    public async ValueTask SetZoom(double zoom, object? eventData = null) =>
        await _jsModule.InvokeVoidAsync("setZoom", JsContainerId, zoom, eventData);

    /// <summary>
    /// Sets the map's pitch angle in degrees.
    /// </summary>
    public async ValueTask SetPitch(double pitch, object? eventData = null) =>
        await _jsModule.InvokeVoidAsync("setPitch", JsContainerId, pitch, eventData);

    /// <summary>
    /// Sets the map's roll angle in degrees.
    /// </summary>
    public async ValueTask SetRoll(double roll, object? eventData = null) =>
        await _jsModule.InvokeVoidAsync("setRoll", JsContainerId, roll, eventData);

    /// <summary>
    /// Sets the padding in pixels around the viewport.
    /// </summary>
    public async ValueTask SetPadding(PaddingOptions padding, object? eventData = null) =>
        await _jsModule.InvokeVoidAsync("setPadding", JsContainerId, padding, eventData);

    /// <summary>
    /// Sets the map's maximum zoom level.
    /// </summary>
    public async ValueTask SetMaxZoom(double maxZoom) =>
        await _jsModule.InvokeVoidAsync("setMaxZoom", JsContainerId, maxZoom);

    /// <summary>
    /// Sets the map's minimum zoom level.
    /// </summary>
    public async ValueTask SetMinZoom(double minZoom) =>
        await _jsModule.InvokeVoidAsync("setMinZoom", JsContainerId, minZoom);

    /// <summary>
    /// Sets the map's maximum pitch angle.
    /// </summary>
    public async ValueTask SetMaxPitch(double maxPitch) =>
        await _jsModule.InvokeVoidAsync("setMaxPitch", JsContainerId, maxPitch);

    /// <summary>
    /// Sets the map's minimum pitch angle.
    /// </summary>
    public async ValueTask SetMinPitch(double minPitch) =>
        await _jsModule.InvokeVoidAsync("setMinPitch", JsContainerId, minPitch);

    /// <summary>
    /// Sets whether multiple copies of the world are rendered side by side.
    /// </summary>
    public async ValueTask SetRenderWorldCopies(bool renderWorldCopies) =>
        await _jsModule.InvokeVoidAsync("setRenderWorldCopies", JsContainerId, renderWorldCopies);

    /// <summary>
    /// Sets the map's vertical field of view in degrees.
    /// </summary>
    public async ValueTask SetVerticalFieldOfView(double fov, object? eventData = null) =>
        await _jsModule.InvokeVoidAsync("setVerticalFieldOfView", JsContainerId, fov, eventData);

    /// <summary>
    /// Sets the map's glyph source URL.
    /// </summary>
    public async ValueTask SetGlyphs(string glyphsUrl, StyleSetterOptions? options = null) =>
        await _jsModule.InvokeVoidAsync("setGlyphs", JsContainerId, glyphsUrl, options);

    /// <summary>
    /// Snaps the map so that north is up when bearing is close enough to north.
    /// </summary>
    public async ValueTask SnapToNorth(AnimationOptions? options = null, object? eventData = null) =>
        await _jsModule.InvokeVoidAsync("snapToNorth", JsContainerId, options, eventData);

    /// <summary>
    /// Triggers rendering of a single frame. Useful with custom layers.
    /// </summary>
    public async ValueTask TriggerRepaint() =>
        await _jsModule.InvokeVoidAsync("triggerRepaint", JsContainerId);

    /// <summary>
    /// Adjusts the map's style to a new configuration or URL.
    /// When <paramref name="options"/>.<see cref="SetStyleOptions.Diff"/> is <c>true</c> and
    /// <paramref name="style"/> is a JSON object, MapLibre diffs the style and emits <c>style.load</c>
    /// (see <see cref="OnStyleLoad"/>).
    /// </summary>
    /// <param name="style">The style configuration object or URL.</param>
    /// <param name="options">Optional parameters for the style application.</param>
    public async ValueTask SetStyle(object style, SetStyleOptions? options = null)
    {
        if (_bulkTransaction is not null)
        {
            _bulkTransaction.Add("setStyle", style, options);
            return;
        }

        await _jsModule.InvokeVoidAsync("setStyle", JsContainerId, style, options);
    }

    /// <summary>
    /// Stops any animated transition currently underway on the map.
    /// </summary>
    public async ValueTask Stop() =>
        await _jsModule.InvokeVoidAsync("stop", JsContainerId);

    /// <summary>
    /// Converts pixel coordinates to geographical coordinates.
    /// </summary>
    /// <param name="point">The pixel coordinates [x, y].</param>
    /// <returns>Geographical coordinates [longitude, latitude].</returns>
    public async ValueTask<object> Unproject(PointLike point) =>
        await _jsModule.InvokeAsync<object>("unproject", JsContainerId, point);

    /// <summary>
    /// Updates an existing image in the map's sprite.
    /// </summary>
    /// <param name="id">The image ID.</param>
    /// <param name="image">The new image data to update.</param>
    public async ValueTask UpdateImage(string id, object image)
    {
        await _jsModule.InvokeVoidAsync("updateImage", JsContainerId, id, image);
    }

    /// <summary>
    /// Increases the map's zoom level by 1.
    /// Triggers the following events: movestart, move, moveend, zoomstart, zoom, and zoomend
    /// </summary>
    /// <param name="options">Animation options object (optional).</param>
    /// <param name="eventData">Additional event data (optional).</param>
    public async ValueTask ZoomIn(AnimationOptions? options = null, object? eventData = null)
    {
        await _jsModule.InvokeVoidAsync("zoomIn", JsContainerId, options, eventData);
    }

    /// <summary>
    /// Decreases the map's zoom level by 1.
    /// </summary>
    /// <param name="options">Animation options object (optional).</param>
    /// <param name="eventData">Additional event data (optional).</param>
    public async ValueTask ZoomOut(AnimationOptions? options = null, object? eventData = null)
    {
        await _jsModule.InvokeVoidAsync("zoomOut", JsContainerId, options, eventData);
    }

    /// <summary>
    /// Zooms the map to a specific zoom level with animation.
    /// </summary>
    /// <param name="zoom">The target zoom level.</param>
    /// <param name="options">Animation options for duration, easing, etc. (optional).</param>
    /// <param name="eventData">Additional event data (optional).</param>
    public async ValueTask ZoomTo(double zoom, EaseToOptions? options = null, object? eventData = null)
    {
        await _jsModule.InvokeVoidAsync("zoomTo", JsContainerId, zoom, options, eventData);
    }

    public async Task CreatePopup(Popup popup, PopupOptions options)
    {
        await AddPopup(options, popup.Coordinates, new PopupContent { Html = popup.Content });
    }

    /// <summary>
    /// Creates a popup on the map and returns a handle for further manipulation.
    /// </summary>
    public async Task<MapPopup> AddPopup(PopupOptions options, LngLat lngLat, PopupContent content, Guid? popupId = null)
    {
        var id = popupId ?? Guid.NewGuid();
        await _jsModule.InvokeVoidAsync("createPopup", JsContainerId, id, options, lngLat, content);
        var handle = new MapPopup(this, id);
        _popups[id] = handle;
        return handle;
    }

    /// <summary>
    /// Creates a popup with HTML content at the given coordinates.
    /// </summary>
    public Task<MapPopup> AddPopup(PopupOptions options, LngLat lngLat, string html, Guid? popupId = null) =>
        AddPopup(options, lngLat, new PopupContent { Html = html }, popupId);

    /// <summary>
    /// Returns a previously created popup handle.
    /// </summary>
    public MapPopup? GetPopup(Guid popupId) =>
        _popups.GetValueOrDefault(popupId);

    /// <summary>
    /// Disables all rotation functionality.
    /// </summary>
    public async ValueTask DisableRotation()
    {
        await _jsModule.InvokeVoidAsync("disableRotation", JsContainerId);
    }

    /// <summary>
    /// Disables double-click/double-tap zoom and tap-then-drag-vertical zoom.
    /// Use while editing geometries with terra-draw so those gestures do not
    /// conflict with vertex dragging. Pinch and scroll-wheel zoom remain enabled.
    /// </summary>
    public async ValueTask DisableMapZoomGesturesAsync()
    {
        await _jsModule.InvokeVoidAsync("disableMapZoomGestures", JsContainerId);
    }

    /// <summary>
    /// Re-enables the zoom gestures disabled by <see cref="DisableMapZoomGesturesAsync"/>.
    /// </summary>
    public async ValueTask EnableMapZoomGesturesAsync()
    {
        await _jsModule.InvokeVoidAsync("enableMapZoomGestures", JsContainerId);
    }

    #endregion

    #region Marker and Popup

    /// <summary>
    /// Adds a new marker to the map and returns a handle for further manipulation.
    /// </summary>
    public async Task<MapMarker> AddMarker(MarkerOptions options, LngLat position, Guid? markerId = null)
    {
        var id = markerId ?? Guid.NewGuid();
        await _jsModule.InvokeVoidAsync("createMarker", JsContainerId, id, options, position);
        var marker = new MapMarker(this, id);
        _markers[id] = marker;
        return marker;
    }

    /// <summary>
    /// Returns a previously created marker handle.
    /// </summary>
    public MapMarker? GetMarker(Guid markerId) =>
        _markers.GetValueOrDefault(markerId);

    /// <summary>
    /// Removes a marker from the map by its unique identifier.
    /// </summary>
    public Task RemoveMarker(Guid markerId) =>
        RemoveMarkerInternalAsync(markerId).AsTask();

    internal async ValueTask RemoveMarkerInternalAsync(Guid markerId)
    {
        _markers.TryRemove(markerId, out _);
        await _jsModule.InvokeVoidAsync("removeMarker", markerId);
    }

    /// <summary>
    /// Moves a marker on the map.
    /// </summary>
    public async Task MoveMarker(Guid markerId, LngLat position) =>
        await _jsModule.InvokeVoidAsync("moveMarker", markerId, position);

    internal async ValueTask RemovePopupInternalAsync(Guid popupId)
    {
        _popups.TryRemove(popupId, out _);
        await _jsModule.InvokeVoidAsync("removePopup", popupId);
    }

    internal async ValueTask<T?> InvokeMarkerAsync<T>(Guid markerId, string method, params object?[] args) =>
        await _jsModule.InvokeAsync<T?>("invokeMarker", markerId.ToString(), method, args);

    internal async ValueTask InvokeMarkerVoidAsync(Guid markerId, string method, params object?[] args)
    {
        await _jsModule.InvokeVoidAsync("invokeMarker", markerId.ToString(), method, args);
    }

    internal async ValueTask<T?> InvokePopupAsync<T>(Guid popupId, string method, params object?[] args) =>
        await _jsModule.InvokeAsync<T?>("invokePopup", popupId.ToString(), method, args);

    internal async ValueTask InvokePopupVoidAsync(Guid popupId, string method, params object?[] args)
    {
        await _jsModule.InvokeVoidAsync("invokePopup", popupId.ToString(), method, args);
    }

    internal Task<Listener> AddMarkerListenerAsync(Guid markerId, string eventName, Action<MapMarkerEvent> handler) =>
        AddMarkerListenerInternal(markerId, eventName, handler);

    internal Task<Listener> AddMarkerAsyncListenerAsync(Guid markerId, string eventName, Func<MapMarkerEvent, Task> handler) =>
        AddMarkerListenerInternal(markerId, eventName, handler);

    internal Task<Listener> AddPopupListenerAsync(Guid popupId, string eventName, Action<MapMarkerEvent> handler) =>
        AddPopupListenerInternal(popupId, eventName, handler);

    internal Task<Listener> AddPopupAsyncListenerAsync(Guid popupId, string eventName, Func<MapMarkerEvent, Task> handler) =>
        AddPopupListenerInternal(popupId, eventName, handler);

    private async Task<Listener> AddMarkerListenerInternal(Guid markerId, string eventName, Delegate handler)
    {
        var callback = new CallbackHandler(_jsModule, string.Empty, eventName, handler, typeof(MapMarkerEvent), "markerOff");
        var reference = DotNetObjectReference.Create(callback);
        var listenerId = await _jsModule.InvokeAsync<string>("markerOn", markerId.ToString(), eventName, reference);
        callback.Attach(reference, listenerId, id => _listeners.TryRemove(id, out _));
        _listeners[listenerId] = callback;
        return new Listener(callback);
    }

    private async Task<Listener> AddPopupListenerInternal(Guid popupId, string eventName, Delegate handler)
    {
        var callback = new CallbackHandler(_jsModule, string.Empty, eventName, handler, typeof(MapMarkerEvent), "popupOff");
        var reference = DotNetObjectReference.Create(callback);
        var listenerId = await _jsModule.InvokeAsync<string>("popupOn", popupId.ToString(), eventName, reference);
        callback.Attach(reference, listenerId, id => _listeners.TryRemove(id, out _));
        _listeners[listenerId] = callback;
        return new Listener(callback);
    }

    public async Task CreateCurrentLocationMarker(MarkerOptions options, LngLat position) =>
        await _jsModule.InvokeVoidAsync("createCurrentLocationMarker", JsContainerId, options, position);

    public async Task MoveCurrentLocationMarker(LngLat position) =>
        await _jsModule.InvokeVoidAsync("moveCurrentLocationMarker", JsContainerId, position);

    public async Task RemoveCurrentLocationMarker() =>
        await _jsModule.InvokeVoidAsync("removeCurrentLocationMarker", JsContainerId);

    #endregion

    public async ValueTask RefreshTiles(string sourceId, TileId[]? tileIds = null)
    {
        if (tileIds is null)
        {
            await _jsModule.InvokeVoidAsync("refreshTiles", JsContainerId, sourceId);
        }
        else
        {
            await _jsModule.InvokeVoidAsync("refreshTileIDs", JsContainerId, sourceId, tileIds);
        }
    }

    #region Bulk Transaction

    /// <summary>
    /// Starts a bulk transaction to batch multiple operations together.
    /// There can only be one bulk transaction in progress at a time.
    /// </summary>
    /// <exception cref="InvalidOperationException"> If a bulk transaction is already in progress. </exception>
    public void StartTransaction()
    {
        if (_bulkTransaction is not null)
        {
            throw new InvalidOperationException("A bulk transaction is already in progress.");
        }

        _bulkTransaction = new BulkTransaction();
    }

    /// <summary>
    /// Commits the bulk transaction, applying all enqueued operations to the map.
    /// </summary>
    /// <exception cref="InvalidOperationException">If no bulk transaction is in progress. </exception>
    public async ValueTask Commit()
    {
        if (_bulkTransaction is null)
        {
            throw new InvalidOperationException("No bulk transaction is in progress.");
        }

        await _jsModule.InvokeVoidAsync("executeTransaction", JsContainerId, _bulkTransaction.Transactions);
        _bulkTransaction = null;
    }

    #endregion

}
