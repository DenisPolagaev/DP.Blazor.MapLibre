using System.Collections.Concurrent;
using DP.Blazor.MapLibre;
using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

/// <summary>
/// MapLibre plugin wrapping <see href="https://github.com/watergis/maplibre-gl-terradraw">maplibre-gl-terradraw</see>.
/// </summary>
/// <remarks>
/// All JavaScript calls go through the private <c>Call*</c> helpers, which check the initialized state
/// (EnsureInitialized) and pass the map reference as the first argument. The JavaScript module keeps its state per map.
/// </remarks>
public sealed partial class TerraDrawPlugin : MapLibreJsPlugin
{
    #region Fields

    private IJSObjectReference? _map;

    // Listener id -> .NET callback reference. Entries are released when the owning control is removed,
    // when the plugin is detached and when it is disposed.
    private readonly ConcurrentDictionary<string, ListenerRegistration> _references = new();

    #endregion

    #region Lifecycle Overrides

    /// <inheritdoc />
    protected override string ModulePath => "./_content/TerraDrawPlugin/TerraDrawPlugin.js";

    /// <inheritdoc />
    protected override ValueTask OnModuleLoadedAsync(IJSObjectReference map, CancellationToken cancellationToken)
    {
        _map = map;
        return base.OnModuleLoadedAsync(map, cancellationToken);
    }

    /// <inheritdoc />
    protected override async ValueTask OnDetachModuleAsync(CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        try
        {
            await CallVoidAsync("removeAllControls");
        }
        finally
        {
            // JS listeners are removed by removeAllControls; only now release the .NET references.
            ReleaseListeners(_ => true);
        }
    }

    /// <inheritdoc />
    protected override async ValueTask OnModuleDisposingAsync()
    {
        var map = _map;
        try
        {
            if (map is not null)
            {
                await Module.InvokeVoidAsync("dispose", map);
            }
        }
        finally
        {
            ReleaseListeners(_ => true);
            _map = null;
        }
    }

    #endregion

    #region Private Helpers

    private IJSObjectReference MapReference =>
        _map ?? throw new InvalidOperationException(
            $"{nameof(TerraDrawPlugin)} has no map reference. Register the plugin with a map first.");

    /// <summary>Calls a map-bound JavaScript function that returns nothing. Throws when not initialized.</summary>
    private ValueTask CallVoidAsync(string method, params object?[] args)
    {
        EnsureInitialized();
        return Module.InvokeVoidAsync(method, WithMap(args));
    }

    /// <summary>Calls a map-bound JavaScript function. Throws when not initialized.</summary>
    private ValueTask<T> CallAsync<T>(string method, params object?[] args)
    {
        EnsureInitialized();
        return Module.InvokeAsync<T>(method, WithMap(args));
    }

    /// <summary>Calls a JavaScript function that only uses the loaded library (no map state).</summary>
    private ValueTask<T> CallLibraryAsync<T>(string method, params object?[] args)
    {
        EnsureInitialized();
        return Module.InvokeAsync<T>(method, args);
    }

    private object?[] WithMap(object?[] args)
    {
        var withMap = new object?[args.Length + 1];
        withMap[0] = MapReference;
        args.CopyTo(withMap, 1);
        return withMap;
    }

    /// <summary>
    /// Registers a JavaScript listener and keeps the .NET callback reference until the listener's control is
    /// removed or the plugin is detached or disposed.
    /// </summary>
    /// <param name="method">JavaScript function to call.</param>
    /// <param name="handler">User handler, adapted to the wire argument type.</param>
    /// <param name="argumentType">Type the JavaScript payload is deserialized to.</param>
    /// <param name="controlId">Control to attach to; the active control when null.</param>
    /// <param name="eventName">Optional event name placed before the callback reference.</param>
    /// <param name="throttleTime">Optional throttle interval placed after the control id.</param>
    private async Task<Listener> RegisterListenerAsync(
        string method,
        Delegate handler,
        Type argumentType,
        string? controlId,
        string? eventName = null,
        int? throttleTime = null)
    {
        EnsureInitialized();

        // The owner is resolved now, so a later setActiveControl does not change where the listener belongs.
        var ownerId = controlId ?? await CallAsync<string?>("getActiveControlId");
        var callback = new CallbackHandler(Module, string.Empty, method, handler, argumentType, "offListener");
        var reference = DotNetObjectReference.Create(callback);

        try
        {
            var args = new List<object?>(4);
            if (eventName is not null)
            {
                args.Add(eventName);
            }

            args.Add(reference);
            args.Add(ownerId);
            if (throttleTime is not null)
            {
                args.Add(throttleTime.Value);
            }

            var listenerId = await CallAsync<string>(method, args.ToArray());
            callback.Attach(reference, listenerId, id => _references.TryRemove(id, out _));
            _references[listenerId] = new ListenerRegistration(ownerId, reference);
            return new Listener(callback);
        }
        catch
        {
            reference.Dispose();
            throw;
        }
    }

    private void ReleaseListeners(Func<ListenerRegistration, bool> predicate)
    {
        foreach (var (listenerId, registration) in _references.ToArray())
        {
            if (predicate(registration) && _references.TryRemove(listenerId, out var removed))
            {
                removed.Reference.Dispose();
            }
        }
    }

    private sealed record ListenerRegistration(string? ControlId, DotNetObjectReference<CallbackHandler> Reference);

    #endregion
}
