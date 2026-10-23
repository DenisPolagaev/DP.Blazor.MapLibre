using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre;

/// <summary>
/// Shared lifecycle helpers for single-map plugins: idempotent initialize/detach/dispose.
/// </summary>
public abstract class MapLibrePluginBase : IMapLibrePluginLifecycle
{
    #region Fields

    private MapLibrePluginLifecycleState _state = MapLibrePluginLifecycleState.Created;
    private readonly SemaphoreSlim _initializeLock = new(1, 1);

    #endregion

    #region Properties

    /// <summary>
    /// Logger used for non-fatal plugin failures. The hosting <see cref="MapLibre"/> component assigns its logger
    /// when the plugin is registered; it defaults to a no-op logger.
    /// </summary>
    public ILogger Logger { get; set; } = NullLogger.Instance;

    /// <inheritdoc />
    public MapLibrePluginLifecycleState State => _state;

    /// <summary>Whether initialize completed and the plugin is not disposed.</summary>
    public bool IsInitialized =>
        _state is MapLibrePluginLifecycleState.Initialized or MapLibrePluginLifecycleState.Attached;

    /// <inheritdoc />
    public bool IsAttached => _state is MapLibrePluginLifecycleState.Attached;

    #endregion

    #region Lifecycle

    /// <inheritdoc />
    public Task Initialize(IJSObjectReference map, IJSRuntime runtime) =>
        InitializeAsync(map, runtime);

    /// <inheritdoc />
    public async Task InitializeAsync(
        IJSObjectReference map,
        IJSRuntime runtime,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(map);
        ArgumentNullException.ThrowIfNull(runtime);
        ThrowIfDisposed();

        if (IsInitialized)
        {
            return;
        }

        // Concurrent callers wait for the first initialization instead of running OnInitializeAsync twice.
        await _initializeLock.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            ThrowIfDisposed();
            if (IsInitialized)
            {
                return;
            }

            cancellationToken.ThrowIfCancellationRequested();
            await OnInitializeAsync(map, runtime, cancellationToken).ConfigureAwait(false);
            _state = MapLibrePluginLifecycleState.Initialized;
        }
        finally
        {
            _initializeLock.Release();
        }
    }

    /// <inheritdoc />
    public async ValueTask DetachAsync(CancellationToken cancellationToken = default)
    {
        if (_state is not MapLibrePluginLifecycleState.Attached)
        {
            return;
        }

        try
        {
            cancellationToken.ThrowIfCancellationRequested();
            await OnDetachAsync(cancellationToken).ConfigureAwait(false);
        }
        catch (JSDisconnectedException)
        {
        }
        catch (ObjectDisposedException)
        {
        }
        catch (JSException ex)
        {
            Logger.LogWarning(ex, "Detach failed.");
        }
        finally
        {
            if (_state is MapLibrePluginLifecycleState.Attached)
            {
                _state = MapLibrePluginLifecycleState.Initialized;
            }
        }
    }

    /// <inheritdoc />
    public async ValueTask DisposeAsync()
    {
        if (_state is MapLibrePluginLifecycleState.Disposed)
        {
            return;
        }

        try
        {
            if (_state is MapLibrePluginLifecycleState.Attached)
            {
                await OnDetachAsync(CancellationToken.None).ConfigureAwait(false);
            }

            await OnDisposeAsync().ConfigureAwait(false);
        }
        catch (JSDisconnectedException)
        {
        }
        catch (ObjectDisposedException)
        {
        }
        catch (JSException ex)
        {
            Logger.LogWarning(ex, "Dispose failed.");
        }
        finally
        {
            _state = MapLibrePluginLifecycleState.Disposed;
        }
    }

    #endregion

    #region Protected Hooks

    /// <summary>Load the JS module and bind to the map.</summary>
    protected abstract Task OnInitializeAsync(
        IJSObjectReference map,
        IJSRuntime runtime,
        CancellationToken cancellationToken);

    /// <summary>Remove visible side-effects; keep the module for re-attach.</summary>
    protected abstract ValueTask OnDetachAsync(CancellationToken cancellationToken);

    /// <summary>Release JS module references and other native resources.</summary>
    protected abstract ValueTask OnDisposeAsync();

    /// <summary>Marks the plugin as attached after a successful domain attach/sync call.</summary>
    protected void MarkAttached()
    {
        ThrowIfDisposed();
        if (!IsInitialized)
        {
            throw new InvalidOperationException(
                $"{GetType().Name} is not initialized. Register it with the map before attaching.");
        }

        _state = MapLibrePluginLifecycleState.Attached;
    }

    /// <summary>Marks the plugin as initialized (detached) after a domain remove/stop call.</summary>
    protected void MarkDetached()
    {
        if (_state is MapLibrePluginLifecycleState.Attached)
        {
            _state = MapLibrePluginLifecycleState.Initialized;
        }
    }

    /// <summary>Throws when the plugin has not been initialized or was disposed.</summary>
    protected void EnsureInitialized()
    {
        ThrowIfDisposed();
        if (!IsInitialized)
        {
            throw new InvalidOperationException(
                $"{GetType().Name} is not initialized. Call MapLibre.RegisterPlugin before using the plugin.");
        }
    }

    #endregion

    #region Private Helpers

    private void ThrowIfDisposed()
    {
        if (_state is MapLibrePluginLifecycleState.Disposed)
        {
            throw new ObjectDisposedException(GetType().Name);
        }
    }

    #endregion
}
