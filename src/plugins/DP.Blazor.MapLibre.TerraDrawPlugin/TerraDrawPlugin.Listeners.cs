using System.Text.Json;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

public sealed partial class TerraDrawPlugin
{
    /// <summary>
    /// Subscribes to a toolbar control event. The payload is the event args, or an empty object when the library
    /// dispatches none.
    /// </summary>
    public async Task<Listener> AddControlEventListener<T>(
        TerraDrawEventType eventType,
        Action<T> handler,
        string? controlId = null) =>
        await RegisterListenerAsync(
            "onControlEvent",
            handler,
            typeof(T),
            controlId,
            eventName: eventType.ToEventName());

    /// <summary>
    /// Subscribes to a Terra Draw instance event. For <c>change</c> the payload is
    /// <see cref="TerraDrawChangeEventArgs"/>; for <c>finish</c> it is <see cref="TerraDrawFinishEventArgs"/>;
    /// other events receive <c>{ args, features }</c>.
    /// </summary>
    public async Task<Listener> AddTerraDrawInstanceEventListener<T>(
        TerraDrawInstanceEventType eventType,
        Action<T> handler,
        string? controlId = null,
        int? throttleTime = null) =>
        await RegisterListenerAsync(
            "onTerraDrawEvent",
            handler,
            typeof(T),
            controlId,
            eventName: eventType.ToEventName(),
            throttleTime: throttleTime);

    /// <summary>Subscribes to the finish event. The payload is <see cref="TerraDrawFinishEventArgs"/>.</summary>
    public async Task<Listener> AddTerraDrawFinishListener<T>(
        Action<T> handler,
        string? controlId = null) =>
        await RegisterListenerAsync("onTerraDrawFinish", handler, typeof(T), controlId);

    /// <summary>
    /// Subscribes to deleted features. The library sends <see cref="TerraDrawChangeEventArgs"/>; it is converted
    /// to <typeparamref name="T"/>: the whole args for <see cref="TerraDrawChangeEventArgs"/>, the features as a JSON
    /// array for <see cref="string"/>, and otherwise the features deserialized to <typeparamref name="T"/>.
    /// </summary>
    public async Task<Listener> AddTerraDrawDeleteListener<T>(
        Action<T> handler,
        string? controlId = null) =>
        await RegisterListenerAsync(
            "onTerraDrawDelete",
            AdaptChangeHandler(handler),
            typeof(TerraDrawChangeEventArgs),
            controlId);

    /// <summary>
    /// Subscribes to throttled feature changes. The library sends <see cref="TerraDrawChangeEventArgs"/>; the
    /// payload is converted to <typeparamref name="T"/> as described in <see cref="AddTerraDrawDeleteListener{T}"/>.
    /// </summary>
    public async Task<Listener> AddTerraDrawChangeListener<T>(
        Action<T> handler,
        int throttleTime,
        string? controlId = null) =>
        await RegisterListenerAsync(
            "onTerraDrawChange",
            AdaptChangeHandler(handler),
            typeof(TerraDrawChangeEventArgs),
            controlId,
            throttleTime: throttleTime);

    private static Action<TerraDrawChangeEventArgs> AdaptChangeHandler<T>(Action<T> handler)
    {
        if (typeof(T) == typeof(TerraDrawChangeEventArgs))
        {
            return args => handler((T)(object)args);
        }

        return args => handler(ConvertChangePayload<T>(args));
    }

    private static T ConvertChangePayload<T>(TerraDrawChangeEventArgs args)
    {
        var featuresJson = JsonSerializer.Serialize(args.Features ?? Array.Empty<object>(), MapLibreJsonSerializer.Options);
        if (typeof(T) == typeof(string))
        {
            return (T)(object)featuresJson;
        }

        return JsonSerializer.Deserialize<T>(featuresJson, MapLibreJsonSerializer.Options)!;
    }
}
