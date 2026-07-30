using DP.Blazor.MapLibre;
using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre.GeoGridPlugin;

/// <summary>
/// MapLibre plugin that adds a geographic graticule grid
/// (<see href="https://github.com/falseinput/geogrid-maplibre-gl">geogrid-maplibre-gl</see>).
/// Register with the map in <c>OnAfterRenderAsync</c>, then call <see cref="AddGeoGridAsync"/>
/// from <c>OnLoad</c> or <c>OnStyleLoad</c> after the map is ready.
/// Include <c>/_content/GeoGridPlugin/geogrid/geogrid.css</c> in your app for label positioning.
/// </summary>
public sealed class GeoGridPlugin : IMapLibrePlugin
{
    private IJSObjectReference? _mapObject;
    private IJSObjectReference? _pluginJsModule;
    private GeoGridOptions? _activeOptions;

    /// <summary>Whether the grid is currently attached to the map.</summary>
    public bool IsActive { get; private set; }

    /// <summary>Whether <see cref="Initialize"/> completed successfully.</summary>
    public bool IsInitialized => _pluginJsModule is not null;

    public async Task Initialize(IJSObjectReference map, IJSRuntime runtime)
    {
        ArgumentNullException.ThrowIfNull(map);
        ArgumentNullException.ThrowIfNull(runtime);

        _mapObject = map;
        _pluginJsModule = await runtime.InvokeAsync<IJSObjectReference>(
            "import", "./_content/GeoGridPlugin/GeoGridPlugin.js");
    }

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
        IsActive = true;
    }

    /// <summary>
    /// Removes the grid from the map.
    /// </summary>
    public async ValueTask RemoveGeoGridAsync()
    {
        if (!IsInitialized || !IsActive)
        {
            IsActive = false;
            return;
        }

        await _pluginJsModule!.InvokeVoidAsync("remove", _mapObject);
        IsActive = false;
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

    public async ValueTask DisposeAsync()
    {
        var pluginModule = _pluginJsModule;
        if (pluginModule is null)
        {
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
        catch (JSDisconnectedException) { }
        catch (ObjectDisposedException) { }
        catch (JSException) { }
        finally
        {
            _pluginJsModule = null;
            _mapObject = null;
            IsActive = false;
        }
    }

    private void EnsureInitialized()
    {
        if (!IsInitialized)
        {
            throw new InvalidOperationException(
                "GeoGrid plugin is not initialized. Register it with the map before calling this method.");
        }
    }
}
