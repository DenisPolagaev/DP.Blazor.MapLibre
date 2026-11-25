using Microsoft.JSInterop;
using System.Reflection;
using System.Runtime.ExceptionServices;
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
    private readonly Func<object?, bool, ValueTask>? _typedInvoker;
    private string? _listenerId;
    private DotNetObjectReference<CallbackHandler>? _dotNetReference;
    private Action<string>? _onRemoved;
    private bool _removed;

    /// <summary>
    /// False for marker and popup listeners, which are removed with their marker or popup rather than by
    /// <c>RemoveAllListeners</c> on the map.
    /// </summary>
    internal bool IsMapScoped { get; set; } = true;

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
        string? removeMethod = null,
        Func<object?, bool, ValueTask>? typedInvoker = null)
    {
        _jsModule = jsModule;
        _mapId = mapId;
        _eventType = eventType;
        _callbackDelegate = callbackDelegate;
        _argumentType = argumentType;
        _removeMethod = removeMethod;
        _typedInvoker = typedInvoker;
    }

    /// <summary>
    /// Creates a direct invoker for the delegate shapes used by map listeners. Build this once when
    /// registering a listener rather than using <see cref="Delegate.DynamicInvoke(object?[])"/> on
    /// every JavaScript event.
    /// </summary>
    public static Func<object?, bool, ValueTask> CreateTypedInvoker<T>(Delegate callbackDelegate)
    {
        ArgumentNullException.ThrowIfNull(callbackDelegate);

        return callbackDelegate switch
        {
            Action<T> action => (value, hasArgument) =>
            {
                EnsureArgument(hasArgument, callbackDelegate);
                action((T)value!);
                return ValueTask.CompletedTask;
            },
            Func<T, Task> asyncAction => async (value, hasArgument) =>
            {
                EnsureArgument(hasArgument, callbackDelegate);
                await asyncAction((T)value!).ConfigureAwait(false);
            },
            Func<T, ValueTask> asyncAction => (value, hasArgument) =>
            {
                EnsureArgument(hasArgument, callbackDelegate);
                return asyncAction((T)value!);
            },
            Action action => (_, hasArgument) =>
            {
                EnsureNoArgument(hasArgument, callbackDelegate);
                action();
                return ValueTask.CompletedTask;
            },
            Func<Task> asyncAction => async (_, hasArgument) =>
            {
                EnsureNoArgument(hasArgument, callbackDelegate);
                await asyncAction().ConfigureAwait(false);
            },
            Func<ValueTask> asyncAction => (_, hasArgument) =>
            {
                EnsureNoArgument(hasArgument, callbackDelegate);
                return asyncAction();
            },
            _ => throw new ArgumentException(
                $"Unsupported callback delegate type: {callbackDelegate.GetType().FullName}.",
                nameof(callbackDelegate))
        };
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

    public Task UpdateLayerIdsAsync(IReadOnlyList<string> layerIds)
    {
        ArgumentNullException.ThrowIfNull(layerIds);
        return _listenerId is { } listenerId
            ? _jsModule.InvokeVoidAsync("updateListenerLayerIds", _mapId, listenerId, layerIds).AsTask()
            : Task.CompletedTask;
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

        try
        {
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
        }
        finally
        {
            // Release the .NET reference even when the JS side fails or the circuit is already gone.
            _dotNetReference?.Dispose();
            _dotNetReference = null;
        }
    }

    /// <summary>
    /// Invokes the callback with arguments from JavaScript.
    /// </summary>
    [JSInvokable]
    public async ValueTask Invoke(string args)
    {
        if (string.IsNullOrWhiteSpace(args) || _argumentType is null)
        {
            await InvokeDelegateAsync(null, hasArgument: false);
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

        await InvokeDelegateAsync(deserializedArgs, hasArgument: true);
    }

    private async ValueTask InvokeDelegateAsync(object? argument, bool hasArgument)
    {
        if (_typedInvoker is not null)
        {
            await _typedInvoker(argument, hasArgument);
            return;
        }

        var returnObject = hasArgument
            ? InvokeDelegate(argument)
            : InvokeDelegate();
        switch (returnObject)
        {
            case Task task:
                await task;
                break;
            case ValueTask valueTask:
                await valueTask;
                break;
        }
    }

    /// <summary>
    /// Calls the user delegate. <see cref="Delegate.DynamicInvoke(object?[])"/> wraps handler exceptions in
    /// <see cref="TargetInvocationException"/>; the original exception is rethrown so callers see the real failure.
    /// </summary>
    private object? InvokeDelegate(params object?[]? arguments)
    {
        try
        {
            return _callbackDelegate.DynamicInvoke(arguments);
        }
        catch (TargetInvocationException ex) when (ex.InnerException is not null)
        {
            ExceptionDispatchInfo.Capture(ex.InnerException).Throw();
            throw;
        }
    }

    private static void EnsureArgument(bool hasArgument, Delegate callbackDelegate)
    {
        if (!hasArgument)
        {
            throw new TargetParameterCountException(
                $"Callback {callbackDelegate.Method.Name} requires an event argument.");
        }
    }

    private static void EnsureNoArgument(bool hasArgument, Delegate callbackDelegate)
    {
        if (hasArgument)
        {
            throw new TargetParameterCountException(
                $"Callback {callbackDelegate.Method.Name} does not accept an event argument.");
        }
    }
}
