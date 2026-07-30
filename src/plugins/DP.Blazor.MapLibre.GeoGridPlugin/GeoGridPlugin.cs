using DP.Blazor.MapLibre;
using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre.GeoGridPlugin;

/// <summary>
/// MapLibre plugin that adds a geographic graticule grid
/// (<see href="https://github.com/falseinput/geogrid-maplibre-gl">geogrid-maplibre-gl</see>).
/// Register with the map in <c>OnAfterRenderAsync</c>, then call <see cref="AddGeoGridAsync"/>
/// from <c>OnLoad</c> or <c>OnStyleLoad</c> after the map is ready.
/// Include <c>./_content/GeoGridPlugin/geogrid/geogrid.css</c> in your app for label positioning.
/// </summary>
public sealed class GeoGridPlugin : MapLibrePluginBase
{
    #region Fields

    private IJSObjectReference? _mapObject;
    private IJSObjectReference? _pluginJsModule;
    private GeoGridOptions? _activeOptions;

    #endregion

    #region Properties

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
        await _pluginJsModule!.InvokeVoidAsync("add", _mapObject, _activeOptions);
        MarkAttached();
    }

    /// <summary>
    /// Removes the grid from the map.
    /// </summary>
    public async ValueTask RemoveGeoGridAsync()
    {
        if (!IsInitialized || !IsAttached)
        {
            MarkDetached();
            return;
        }

        await _pluginJsModule!.InvokeVoidAsync("remove", _mapObject);
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

    protected override async Task OnInitializeAsync(
        IJSObjectReference map,
        IJSRuntime runtime,
        CancellationToken cancellationToken)
    {
        _mapObject = map;
        _pluginJsModule = await runtime.InvokeAsync<IJSObjectReference>(
            "import",
            cancellationToken,
            "./_content/GeoGridPlugin/GeoGridPlugin.js");
    }

    protected override async ValueTask OnDetachAsync(CancellationToken cancellationToken)
    {
        if (_pluginJsModule is null || _mapObject is null || !IsAttached)
        {
            return;
        }

        await _pluginJsModule.InvokeVoidAsync("remove", cancellationToken, _mapObject);
    }

    protected override async ValueTask OnDisposeAsync()
    {
        var pluginModule = _pluginJsModule;
        if (pluginModule is null)
        {
            _mapObject = null;
            return;
        }

        try
        {
            if (_mapObject is not null)
            {
                await pluginModule.InvokeVoidAsync("dispose", _mapObject);
            }

            await pluginModule.DisposeAsync();
        }
        finally
        {
            _pluginJsModule = null;
            _mapObject = null;
            _activeOptions = null;
        }
    }

    #endregion
}
