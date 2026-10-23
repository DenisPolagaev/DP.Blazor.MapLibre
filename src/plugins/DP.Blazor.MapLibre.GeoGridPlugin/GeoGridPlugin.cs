using DP.Blazor.MapLibre;
using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre.GeoGridPlugin;

/// <summary>
/// MapLibre plugin that adds a geographic graticule grid
/// (<see href="https://github.com/falseinput/geogrid-maplibre-gl">geogrid-maplibre-gl</see>).
/// Register with the map in <c>OnAfterRenderAsync</c>, then call <see cref="AddGeoGridAsync"/>
/// from <c>OnLoad</c> or <c>OnStyleLoad</c> after the map is ready.
/// The stylesheet that positions the edge labels is loaded by the plugin itself during initialization;
/// no manual stylesheet link is required.
/// </summary>
public sealed class GeoGridPlugin : MapLibreJsPlugin
{
    #region Fields

    private IJSObjectReference? _map;
    private GeoGridOptions? _activeOptions;

    #endregion

    #region Properties

    /// <summary>Static asset path of the plugin module.</summary>
    protected override string ModulePath => "./_content/GeoGridPlugin/GeoGridPlugin.js";

    /// <summary>Whether the grid is currently attached to the map.</summary>
    public bool IsActive => IsAttached;

    #endregion

    #region Public API

    /// <summary>
    /// Adds the geographic grid to the map. Replaces any existing grid instance.
    /// Call when the map style is loaded (for example from <c>OnStyleLoad</c> or <c>OnLoad</c>).
    /// </summary>
    public async ValueTask AddGeoGridAsync(GeoGridOptions options)
    {
        ArgumentNullException.ThrowIfNull(options);
        EnsureInitialized();

        _activeOptions = options;
        await Module.InvokeVoidAsync("add", RequireMap(), _activeOptions);
        MarkAttached();
    }

    /// <summary>
    /// Removes the grid from the map.
    /// </summary>
    public async ValueTask RemoveGeoGridAsync()
    {
        if (!IsAttached)
        {
            return;
        }

        await Module.InvokeVoidAsync("remove", RequireMap());
        MarkDetached();
    }

    /// <summary>
    /// Re-attaches the grid after <see cref="RemoveGeoGridAsync"/> using the last options,
    /// or the supplied options when the grid has not been added yet.
    /// </summary>
    public async ValueTask ShowGeoGridAsync(GeoGridOptions? options = null)
    {
        var resolvedOptions = options ?? _activeOptions;
        if (resolvedOptions is null)
        {
            throw new InvalidOperationException(
                "GeoGrid has not been added yet. Call AddGeoGridAsync first or pass options to ShowGeoGridAsync.");
        }

        await AddGeoGridAsync(resolvedOptions);
    }

    #endregion

    #region Lifecycle Overrides

    /// <summary>
    /// Keeps the map reference that every grid call needs, then runs the default <c>initialize</c> call,
    /// which loads <c>geogrid.css</c> from the plugin module.
    /// </summary>
    protected override ValueTask OnModuleLoadedAsync(IJSObjectReference map, CancellationToken cancellationToken)
    {
        _map = map;
        return base.OnModuleLoadedAsync(map, cancellationToken);
    }

    /// <inheritdoc />
    protected override ValueTask OnDetachModuleAsync(CancellationToken cancellationToken) =>
        Module.InvokeVoidAsync("remove", cancellationToken, RequireMap());

    /// <inheritdoc />
    protected override async ValueTask OnModuleDisposingAsync()
    {
        try
        {
            if (_map is not null)
            {
                await Module.InvokeVoidAsync("dispose", _map);
            }
        }
        finally
        {
            _map = null;
            _activeOptions = null;
        }
    }

    #endregion

    #region Private Helpers

    private IJSObjectReference RequireMap() =>
        _map ?? throw new InvalidOperationException("GeoGridPlugin has no map reference. Initialize the plugin first.");

    #endregion
}
