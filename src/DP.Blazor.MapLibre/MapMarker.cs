using DP.Blazor.MapLibre.Models;
using DP.Blazor.MapLibre.Models.Event;
using DP.Blazor.MapLibre.Models.Marker;

namespace DP.Blazor.MapLibre;

/// <summary>
/// Handle for a MapLibre GL JS <c>Marker</c> instance.
/// </summary>
public sealed class MapMarker
{
    private readonly MapLibre _map;

    internal MapMarker(MapLibre map, Guid id)
    {
        _map = map;
        Id = id;
    }

    public Guid Id { get; }

    public async ValueTask<LngLat> GetLngLatAsync()
    {
        var result = await _map.InvokeMarkerAsync<LngLat>(Id, "getLngLat");
        return result ?? throw new InvalidOperationException($"Marker {Id} returned no coordinates.");
    }

    public ValueTask SetLngLatAsync(LngLat position) => _map.InvokeMarkerVoidAsync(Id, "setLngLat", position);

    public ValueTask SetDraggableAsync(bool draggable) => _map.InvokeMarkerVoidAsync(Id, "setDraggable", draggable);

    public ValueTask<bool> IsDraggableAsync() => _map.InvokeMarkerAsync<bool>(Id, "isDraggable");

    public ValueTask SetRotationAsync(double? rotation = null) => _map.InvokeMarkerVoidAsync(Id, "setRotation", rotation);

    public ValueTask<double> GetRotationAsync() => _map.InvokeMarkerAsync<double>(Id, "getRotation");

    public ValueTask SetRotationAlignmentAsync(MarkerAlignment? alignment = null) =>
        _map.InvokeMarkerVoidAsync(Id, "setRotationAlignment", alignment?.ToString().ToLowerInvariant());

    public async ValueTask<MarkerAlignment?> GetRotationAlignmentAsync()
    {
        var value = await _map.InvokeMarkerAsync<string?>(Id, "getRotationAlignment");
        return ParseAlignment(value);
    }

    public ValueTask SetPitchAlignmentAsync(MarkerAlignment? alignment = null) =>
        _map.InvokeMarkerVoidAsync(Id, "setPitchAlignment", alignment?.ToString().ToLowerInvariant());

    public async ValueTask<MarkerAlignment?> GetPitchAlignmentAsync()
    {
        var value = await _map.InvokeMarkerAsync<string?>(Id, "getPitchAlignment");
        return ParseAlignment(value);
    }

    public ValueTask SetOffsetAsync(double[] offset) => _map.InvokeMarkerVoidAsync(Id, "setOffset", offset);

    public async ValueTask<double[]> GetOffsetAsync()
    {
        var result = await _map.InvokeMarkerAsync<double[]>(Id, "getOffset");
        return result ?? [];
    }

    public ValueTask SetOpacityAsync(object? opacity = null, object? opacityWhenCovered = null) =>
        _map.InvokeMarkerVoidAsync(Id, "setOpacity", opacity, opacityWhenCovered);

    public ValueTask SetSubpixelPositioningAsync(bool value) =>
        _map.InvokeMarkerVoidAsync(Id, "setSubpixelPositioning", value);

    public ValueTask SetPopupAsync(MapPopup? popup) =>
        _map.InvokeMarkerVoidAsync(Id, "setPopup", popup?.Id.ToString());

    public async ValueTask<MapPopup?> GetPopupAsync()
    {
        var popupId = await _map.InvokeMarkerAsync<string?>(Id, "getPopup");
        return popupId is null ? null : _map.GetPopup(Guid.Parse(popupId));
    }

    public ValueTask TogglePopupAsync() => _map.InvokeMarkerVoidAsync(Id, "togglePopup");

    public ValueTask AddClassNameAsync(string className) => _map.InvokeMarkerVoidAsync(Id, "addClassName", className);

    public ValueTask RemoveClassNameAsync(string className) => _map.InvokeMarkerVoidAsync(Id, "removeClassName", className);

    public ValueTask<bool> ToggleClassNameAsync(string className) =>
        _map.InvokeMarkerAsync<bool>(Id, "toggleClassName", className);

    public ValueTask AddToMapAsync() => _map.InvokeMarkerVoidAsync(Id, "addTo", _map.InteropContainerId);

    public ValueTask RemoveAsync() => _map.RemoveMarkerInternalAsync(Id);

    public Task<Listener> OnClick(Action<MapMarkerEvent> handler) =>
        _map.AddMarkerListenerAsync(Id, MarkerEventNames.Click, handler);

    public Task<Listener> OnClick(Func<MapMarkerEvent, Task> handler) =>
        _map.AddMarkerAsyncListenerAsync(Id, MarkerEventNames.Click, handler);

    public Task<Listener> OnDragStart(Action<MapMarkerEvent> handler) =>
        _map.AddMarkerListenerAsync(Id, MarkerEventNames.DragStart, handler);

    public Task<Listener> OnDragStart(Func<MapMarkerEvent, Task> handler) =>
        _map.AddMarkerAsyncListenerAsync(Id, MarkerEventNames.DragStart, handler);

    public Task<Listener> OnDrag(Action<MapMarkerEvent> handler) =>
        _map.AddMarkerListenerAsync(Id, MarkerEventNames.Drag, handler);

    public Task<Listener> OnDrag(Func<MapMarkerEvent, Task> handler) =>
        _map.AddMarkerAsyncListenerAsync(Id, MarkerEventNames.Drag, handler);

    public Task<Listener> OnDragEnd(Action<MapMarkerEvent> handler) =>
        _map.AddMarkerListenerAsync(Id, MarkerEventNames.DragEnd, handler);

    public Task<Listener> OnDragEnd(Func<MapMarkerEvent, Task> handler) =>
        _map.AddMarkerAsyncListenerAsync(Id, MarkerEventNames.DragEnd, handler);

    private static MarkerAlignment? ParseAlignment(string? value) =>
        value switch
        {
            null or "" => null,
            "map" => MarkerAlignment.Map,
            "viewport" => MarkerAlignment.Viewport,
            "auto" => MarkerAlignment.Auto,
            _ => Enum.TryParse<MarkerAlignment>(value, true, out var parsed) ? parsed : null,
        };
}
