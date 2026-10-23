using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre;

/// <summary>
/// Base class for plugins backed by a JavaScript module. Handles module loading (including the MapLibre GL JS
/// bundle), module disposal and the lifecycle state machine from <see cref="MapLibrePluginBase"/>.
/// </summary>
/// <remarks>
/// Derived plugins implement <see cref="ModulePath"/> and, where needed, <see cref="OnModuleLoadedAsync"/>,
/// <see cref="OnDetachModuleAsync"/> and <see cref="OnModuleDisposingAsync"/>. The module reference is
/// released by this base class; derived code must not dispose <see cref="Module"/> itself.
/// </remarks>
public abstract class MapLibreJsPlugin : MapLibrePluginBase
{
    private IJSObjectReference? _module;

    /// <summary>Static asset path of the plugin module, e.g. <c>./_content/FrameratePlugin/FrameratePlugin.js</c>.</summary>
    protected abstract string ModulePath { get; }

    /// <summary>The loaded plugin module. Throws if the plugin has not been initialized.</summary>
    protected IJSObjectReference Module =>
        _module ?? throw new InvalidOperationException($"{GetType().Name} JavaScript module is not loaded.");

    /// <summary>
    /// Called after the module has been imported. The default calls the module's <c>initialize(map)</c> export;
    /// override when the module needs a different entry point or extra arguments.
    /// </summary>
    protected virtual ValueTask OnModuleLoadedAsync(IJSObjectReference map, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        return Module.InvokeVoidAsync("initialize", map);
    }

    /// <summary>Removes visible effects from the map. Default: nothing to detach.</summary>
    protected virtual ValueTask OnDetachModuleAsync(CancellationToken cancellationToken) => ValueTask.CompletedTask;

    /// <summary>Runs JavaScript teardown before the module reference is released. Default: nothing to do.</summary>
    protected virtual ValueTask OnModuleDisposingAsync() => ValueTask.CompletedTask;

    /// <inheritdoc />
    protected sealed override async Task OnInitializeAsync(
        IJSObjectReference map,
        IJSRuntime runtime,
        CancellationToken cancellationToken)
    {
        _module = await MapLibrePluginModules.ImportAsync(runtime, ModulePath);
        await OnModuleLoadedAsync(map, cancellationToken);
    }

    /// <inheritdoc />
    protected sealed override ValueTask OnDetachAsync(CancellationToken cancellationToken) =>
        OnDetachModuleAsync(cancellationToken);

    /// <inheritdoc />
    protected sealed override async ValueTask OnDisposeAsync()
    {
        try
        {
            if (_module is not null)
            {
                await OnModuleDisposingAsync();
            }
        }
        finally
        {
            if (_module is not null)
            {
                var module = _module;
                _module = null;
                await module.DisposeAsync();
            }
        }
    }
}
