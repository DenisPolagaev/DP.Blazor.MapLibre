using Microsoft.JSInterop;
using System.Text.Json;

namespace DP.Blazor.MapLibre;

/// <summary>
/// Represents a callback action to handle JavaScript events in C#.
/// </summary>
public class CallbackHandler
{
    private readonly IJSObjectReference _jsModule;
    private readonly string _mapId;
    private readonly string _eventType;
    private readonly Delegate _callbackDelegate;
    private readonly Type? _argumentType;
    private readonly string? _removeMethod;
    private string? _listenerId;
    private DotNetObjectReference<CallbackHandler>? _dotNetReference;
    private Action<string>? _onRemoved;
    private bool _removed;

    /// <summary>
    /// The MapLibre event name this handler is registered for.
    /// </summary>
    public string EventType => _eventType;

    /// <summary>
    /// Constructor for plugin modules that manage their own JavaScript listeners.
    /// </summary>
    public CallbackHandler(
        IJSObjectReference jsModule,
        string eventType,
        Delegate callbackDelegate,
        Type argumentType)
        : this(jsModule, string.Empty, eventType, callbackDelegate, argumentType)
    {
    }

    /// <summary>
    /// Constructor for initializing a callback handler with arguments.
    /// </summary>
    public CallbackHandler(
        IJSObjectReference jsModule,
        string mapId,
        string eventType,
        Delegate callbackDelegate,
        Type argumentType,
        string? removeMethod = null)
    {
        _jsModule = jsModule;
        _mapId = mapId;
        _eventType = eventType;
        _callbackDelegate = callbackDelegate;
        _argumentType = argumentType;
        _removeMethod = removeMethod;
    }

    /// <summary>
    /// Attaches the .NET reference and listener id returned from JavaScript registration.
    /// </summary>
    public void Attach(DotNetObjectReference<CallbackHandler> dotNetReference, string listenerId, Action<string>? onRemoved = null)
    {
        _dotNetReference = dotNetReference;
        _listenerId = listenerId;
        _onRemoved = onRemoved;
    }

    /// <summary>
    /// Removes the event listener in JavaScript and disposes the .NET reference.
    /// </summary>
    public async Task RemoveAsync()
    {
        if (_removed)
        {
            return;
        }

        _removed = true;

        if (_listenerId is not null)
        {
            var removedId = _listenerId;
            if (_removeMethod is not null)
            {
                await _jsModule.InvokeVoidAsync(_removeMethod, removedId);
            }
            else
            {
                await _jsModule.InvokeVoidAsync("off", _mapId, removedId);
            }
            _onRemoved?.Invoke(removedId);
            _listenerId = null;
        }

        _dotNetReference?.Dispose();
        _dotNetReference = null;
    }

    /// <summary>
    /// Invokes the callback with arguments from JavaScript.
    /// </summary>
    [JSInvokable]
    public async ValueTask Invoke(string args)
    {
        if (string.IsNullOrWhiteSpace(args) || _argumentType is null)
        {
            var returnObject = _callbackDelegate.DynamicInvoke();

            if (returnObject is Task task)
            {
                await task;
            }

            return;
        }

        object? deserializedArgs;
        if (_argumentType == typeof(string))
        {
            deserializedArgs = args;
        }
        else
        {
            deserializedArgs = JsonSerializer.Deserialize(args, _argumentType, MapLibreJsonSerializer.Options);
        }

        var returnObjectWithArgs = _callbackDelegate.DynamicInvoke(deserializedArgs);
        if (returnObjectWithArgs is Task callbackTaskWithArgs)
        {
            await callbackTaskWithArgs;
        }
    }
}
