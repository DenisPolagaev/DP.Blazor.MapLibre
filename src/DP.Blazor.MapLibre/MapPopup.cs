using DP.Blazor.MapLibre.Models;
using DP.Blazor.MapLibre.Models.Event;
using DP.Blazor.MapLibre.Models.Padding;

namespace DP.Blazor.MapLibre;

/// <summary>
/// Handle for a MapLibre GL JS <c>Popup</c> instance.
/// </summary>
public sealed class MapPopup
{
    private readonly MapLibre _map;

    internal MapPopup(MapLibre map, Guid id)
    {
        _map = map;
        Id = id;
    }

    public Guid Id { get; }

    public async ValueTask<LngLat> GetLngLatAsync()
    {
        var result = await _map.InvokePopupAsync<LngLat>(Id, "getLngLat");
        return result ?? throw new InvalidOperationException($"Popup {Id} returned no coordinates.");
    }

    public ValueTask SetLngLatAsync(LngLat position) => _map.InvokePopupVoidAsync(Id, "setLngLat", position);

    public ValueTask SetHtmlAsync(string html) => _map.InvokePopupVoidAsync(Id, "setHTML", html);

    public ValueTask SetLngLatAndHtmlAsync(LngLat position, string? html) =>
        _map.InvokePopupVoidAsync(Id, "setLngLatAndHTML", position, html);

    public ValueTask SetTextAsync(string text) => _map.InvokePopupVoidAsync(Id, "setText", text);

    public ValueTask SetMaxWidthAsync(string maxWidth) => _map.InvokePopupVoidAsync(Id, "setMaxWidth", maxWidth);

    public async ValueTask<string> GetMaxWidthAsync()
    {
        var result = await _map.InvokePopupAsync<string>(Id, "getMaxWidth");
        return result ?? string.Empty;
    }

    public ValueTask SetOffsetAsync(object? offset) => _map.InvokePopupVoidAsync(Id, "setOffset", offset);

    public ValueTask SetPaddingAsync(PaddingOptions? padding) => _map.InvokePopupVoidAsync(Id, "setPadding", padding);

    public ValueTask SetSubpixelPositioningAsync(bool value) =>
        _map.InvokePopupVoidAsync(Id, "setSubpixelPositioning", value);

    public ValueTask<bool> IsOpenAsync() => _map.InvokePopupAsync<bool>(Id, "isOpen");

    public ValueTask TrackPointerAsync() => _map.InvokePopupVoidAsync(Id, "trackPointer");

    public ValueTask AddClassNameAsync(string className) => _map.InvokePopupVoidAsync(Id, "addClassName", className);

    public ValueTask RemoveClassNameAsync(string className) => _map.InvokePopupVoidAsync(Id, "removeClassName", className);

    public ValueTask<bool> ToggleClassNameAsync(string className) =>
        _map.InvokePopupAsync<bool>(Id, "toggleClassName", className);

    public ValueTask AddToMapAsync() => _map.InvokePopupVoidAsync(Id, "addTo", _map.InteropContainerId);

    public ValueTask RemoveAsync() => _map.RemovePopupInternalAsync(Id);

    public Task<Listener> OnOpen(Action<MapMarkerEvent> handler) =>
        _map.AddPopupListenerAsync(Id, PopupEventNames.Open, handler);

    public Task<Listener> OnOpen(Func<MapMarkerEvent, Task> handler) =>
        _map.AddPopupAsyncListenerAsync(Id, PopupEventNames.Open, handler);

    public Task<Listener> OnClose(Action<MapMarkerEvent> handler) =>
        _map.AddPopupListenerAsync(Id, PopupEventNames.Close, handler);

    public Task<Listener> OnClose(Func<MapMarkerEvent, Task> handler) =>
        _map.AddPopupAsyncListenerAsync(Id, PopupEventNames.Close, handler);
}
