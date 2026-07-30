using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

public sealed partial class TerraDrawPlugin
{
    public async Task<Listener> AddControlEventListener<T>(
        TerraDrawEventType eventType,
        Action<T> handler,
        string? controlId = null) =>
        await AddListenerAsync("onControlEvent", handler, controlId, extraArgs: [eventType.ToEventName()]);

    public async Task<Listener> AddTerraDrawInstanceEventListener<T>(
        TerraDrawInstanceEventType eventType,
        Action<T> handler,
        string? controlId = null,
        int? throttleTime = null) =>
        await AddListenerAsync(
            "onTerraDrawEvent",
            handler,
            controlId,
            throttleTime,
            eventType.ToEventName());

    public async Task<Listener> AddTerraDrawFinishListener<T>(
        Action<T> handler,
        string? controlId = null) =>
        await AddListenerAsync("onTerraDrawFinish", handler, controlId);

    public async Task<Listener> AddTerraDrawDeleteListener<T>(
        Action<T> handler,
        string? controlId = null) =>
        await AddListenerAsync("onTerraDrawDelete", handler, controlId);

    public async Task<Listener> AddTerraDrawChangeListener<T>(
        Action<T> handler,
        int throttleTime,
        string? controlId = null) =>
        await AddListenerAsync("onTerraDrawChange", handler, controlId, throttleTime);
}
