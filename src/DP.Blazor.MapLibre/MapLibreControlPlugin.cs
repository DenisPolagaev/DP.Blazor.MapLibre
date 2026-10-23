using Microsoft.Extensions.Logging;
using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre;

/// <summary>
/// Base class for plugins that add a single MapLibre control to the map. Adds and removes the control through the
/// module's <see cref="AddControlFunction"/> and <see cref="RemoveControlFunction"/> exports, removes it on detach
/// and on dispose, and keeps the lifecycle state in sync.
/// </summary>
/// <typeparam name="TOptions">Options object passed to the JavaScript control factory.</typeparam>
public abstract class MapLibreControlPlugin<TOptions> : MapLibreJsPlugin where TOptions : class
{
    private IJSObjectReference? _map;
    private bool _controlAdded;

    /// <summary>JavaScript export that creates the control: <c>addControl(map, options, position)</c>.</summary>
    protected virtual string AddControlFunction => "addControl";

    /// <summary>JavaScript export that removes the control: <c>removeControl(map)</c>.</summary>
    protected virtual string RemoveControlFunction => "removeControl";

    /// <summary>The MapLibre map this plugin is bound to.</summary>
    protected IJSObjectReference Map =>
        _map ?? throw new InvalidOperationException($"{GetType().Name} is not bound to a map.");

    /// <summary>Whether the control is currently added to the map.</summary>
    protected bool ControlAdded => _controlAdded;

    /// <inheritdoc />
    protected override ValueTask OnModuleLoadedAsync(IJSObjectReference map, CancellationToken cancellationToken)
    {
        _map = map;
        return base.OnModuleLoadedAsync(map, cancellationToken);
    }

    /// <summary>Adds the control to the map. Replaces a control this plugin already added.</summary>
    protected async Task AddControlCoreAsync(TOptions? options, string? position)
    {
        EnsureInitialized();
        await Module.InvokeVoidAsync(AddControlFunction, Map, options, position);
        _controlAdded = true;
        MarkAttached();
    }

    /// <summary>Removes the control if it was added. Safe to call repeatedly.</summary>
    protected async Task RemoveControlCoreAsync()
    {
        if (!_controlAdded)
        {
            return;
        }

        await Module.InvokeVoidAsync(RemoveControlFunction, Map);
        _controlAdded = false;
        MarkDetached();
    }

    /// <inheritdoc />
    protected override async ValueTask OnDetachModuleAsync(CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        await RemoveControlCoreAsync();
    }

    /// <inheritdoc />
    protected override async ValueTask OnModuleDisposingAsync()
    {
        if (!_controlAdded)
        {
            return;
        }

        try
        {
            await Module.InvokeVoidAsync(RemoveControlFunction, Map);
        }
        catch (Microsoft.JSInterop.JSException ex)
        {
            Logger.LogWarning(ex, "Removing control of {Plugin} failed during dispose.", GetType().Name);
        }
        finally
        {
            _controlAdded = false;
            _map = null;
        }
    }
}
