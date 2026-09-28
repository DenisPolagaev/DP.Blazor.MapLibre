using System.Text.Json.Nodes;
using DP.Blazor.MapLibre;
using DP.Blazor.MapLibre.Models;
using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre.ProjPlugin;

/// <summary>
/// MapLibre plugin that renders a map in any coordinate reference system by wrapping
/// <see href="https://www.npmjs.com/package/maplibre-proj">maplibre-proj</see> (backed by
/// <see href="https://www.npmjs.com/package/backproj">backproj</see>, PROJ 9 via
/// <c>proj-wasm</c> and JTS via <c>@wcohen/wasmts</c>).
/// </summary>
/// <remarks>
/// The map must be created with <see cref="MapOptions.RenderWorldCopies"/> set to <c>false</c>;
/// <c>reprojectStyle</c> forces <c>projection: mercator</c> and the fake coordinate space does not tile.
/// Handler methods require <see cref="MapLibre.RegisterPlugin"/> to have completed.
/// </remarks>
public sealed class ProjPlugin : MapLibrePluginBase
{
    #region Fields

    private IJSObjectReference _mapObject = null!;
    private IJSObjectReference _pluginJsModule = null!;
    private bool _tileWorkersShutdown;

    #endregion

    #region Lifecycle Overrides

    protected override async Task OnInitializeAsync(
        IJSObjectReference map,
        IJSRuntime runtime,
        CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(map);
        _mapObject = map;
        _pluginJsModule = await runtime.InvokeAsync<IJSObjectReference>(
            "import",
            cancellationToken,
            "./_content/ProjPlugin/ProjPlugin.js");
        await _pluginJsModule.InvokeVoidAsync("initialize", cancellationToken, _mapObject);
    }

    protected override ValueTask OnDetachAsync(CancellationToken cancellationToken) =>
        ValueTask.CompletedTask;

    protected override async ValueTask OnDisposeAsync()
    {
        var pluginModule = _pluginJsModule;
        if (pluginModule is null)
        {
            _mapObject = null!;
            return;
        }

        try
        {
            await pluginModule.InvokeVoidAsync("dispose");
            await pluginModule.DisposeAsync();
        }
        finally
        {
            _pluginJsModule = null!;
            _mapObject = null!;
        }
    }

    #endregion

    #region Projection

    /// <summary>
    /// Reprojects a style into <see cref="ProjReprojectOptions.Crs"/> and returns the rewritten
    /// style, fake bounds and transformer id. The map is not modified; call
    /// <see cref="ApplyReprojectionAsync"/> to apply the result, or use
    /// <c>MapLibre.SetStyle</c> with <see cref="ProjReprojectResult.Style"/> yourself.
    /// </summary>
    public async Task<ProjReprojectResult> ReprojectStyleAsync(
        ProjReprojectOptions options,
        CancellationToken cancellationToken = default)
    {
        EnsureInitialized();
        ArgumentNullException.ThrowIfNull(options);
        return await _pluginJsModule.InvokeAsync<ProjReprojectResult>(
            "reprojectStyle",
            cancellationToken,
            options);
    }

    /// <summary>
    /// Reprojects a style and applies it to the map: <c>setStyle</c>, optional
    /// <c>setMaxBounds</c> and <c>fitBounds</c> with the fake bounds.
    /// </summary>
    public async Task<ProjReprojectResult> ApplyReprojectionAsync(
        ProjReprojectOptions options,
        CancellationToken cancellationToken = default)
    {
        EnsureInitialized();
        ArgumentNullException.ThrowIfNull(options);
        _tileWorkersShutdown = false;
        return await _pluginJsModule.InvokeAsync<ProjReprojectResult>(
            "applyReprojection",
            cancellationToken,
            options);
    }

    /// <summary>
    /// Reprojects the map's <b>current</b> style in place. Vector sources declared via
    /// TileJSON (<c>url</c>) are expanded to explicit <c>tiles</c>, and raster sources/layers
    /// are dropped (maplibre-proj cannot reproject them).
    /// </summary>
    public async Task<ProjReprojectResult> ApplyCurrentStyleProjectionAsync(
        ProjMapProjectionOptions options,
        CancellationToken cancellationToken = default)
    {
        EnsureInitialized();
        ArgumentNullException.ThrowIfNull(options);
        _tileWorkersShutdown = false;
        return await _pluginJsModule.InvokeAsync<ProjReprojectResult>(
            "reprojectCurrentStyle",
            cancellationToken,
            options);
    }

    /// <summary>
    /// Reprojects a single source (vector tile or GeoJSON) and returns the rewritten source.
    /// Used for data layers added after the basemap style was reprojected.
    /// </summary>
    public async Task<ProjSourceReprojectResult> ReprojectSourceAsync(
        ProjSourceReprojectOptions options,
        CancellationToken cancellationToken = default)
    {
        EnsureInitialized();
        ArgumentNullException.ThrowIfNull(options);
        _tileWorkersShutdown = false;
        return await _pluginJsModule.InvokeAsync<ProjSourceReprojectResult>(
            "reprojectSource",
            cancellationToken,
            options);
    }

    #endregion

    #region Coordinates

    /// <summary>
    /// Recovers real lon/lat from fake coordinates produced by the reprojected map
    /// (for example from <c>queryRenderedFeatures</c>).
    /// </summary>
    public async Task<IReadOnlyList<LngLat>> InverseTransformCoordsAsync(
        IEnumerable<LngLat> coordinates,
        string transformerId,
        CancellationToken cancellationToken = default)
    {
        EnsureInitialized();
        ArgumentNullException.ThrowIfNull(coordinates);
        ArgumentException.ThrowIfNullOrWhiteSpace(transformerId);

        var payload = coordinates as IReadOnlyCollection<LngLat> ?? coordinates.ToList();
        var result = await _pluginJsModule.InvokeAsync<List<LngLat>>(
            "inverseTransformCoords",
            cancellationToken,
            payload,
            transformerId);
        return result;
    }

    /// <summary>
    /// Transforms a real lon/lat into the fake coordinate space used by the reprojected map,
    /// for example to position a marker.
    /// </summary>
    public async Task<LngLat> TransformPointAsync(
        LngLat coordinate,
        string transformerId,
        CancellationToken cancellationToken = default)
    {
        EnsureInitialized();
        ArgumentNullException.ThrowIfNull(coordinate);
        ArgumentException.ThrowIfNullOrWhiteSpace(transformerId);

        return await _pluginJsModule.InvokeAsync<LngLat>(
            "transformPoint",
            cancellationToken,
            coordinate,
            transformerId);
    }

    /// <summary>Drops a transformer handle returned by a previous reprojection.</summary>
    public async Task ReleaseTransformerAsync(
        string transformerId,
        CancellationToken cancellationToken = default)
    {
        EnsureInitialized();
        ArgumentException.ThrowIfNullOrWhiteSpace(transformerId);
        await _pluginJsModule.InvokeVoidAsync("releaseTransformer", cancellationToken, transformerId);
    }

    #endregion

    #region Diagnostics

    /// <summary>
    /// Terminates the shared reprojection worker pool. Transformers returned earlier become
    /// invalid; the next reprojection recreates the pool.
    /// </summary>
    public async Task ShutdownTileWorkersAsync(CancellationToken cancellationToken = default)
    {
        EnsureInitialized();
        await _pluginJsModule.InvokeVoidAsync("shutdownTileWorkers", cancellationToken);
        _tileWorkersShutdown = true;
    }

    /// <summary>Whether <see cref="ShutdownTileWorkersAsync"/> was called since the last apply.</summary>
    public bool TileWorkersShutdown => _tileWorkersShutdown;

    /// <summary>
    /// Returns the import map entries the plugin uses to resolve its vendored modules.
    /// Hosts without dynamic import map support (Firefox/Safari) can copy these into a static
    /// <c>&lt;script type="importmap"&gt;</c> before Blazor starts.
    /// </summary>
    public async Task<JsonObject> GetImportMapAsync(CancellationToken cancellationToken = default)
    {
        EnsureInitialized();
        return await _pluginJsModule.InvokeAsync<JsonObject>("getImportMap", cancellationToken);
    }

    /// <summary>Returns the vendored dependency manifest (package names and versions).</summary>
    public async Task<JsonObject?> GetVendorManifestAsync(CancellationToken cancellationToken = default)
    {
        EnsureInitialized();
        return await _pluginJsModule.InvokeAsync<JsonObject?>("getVendorManifest", cancellationToken);
    }

    #endregion
}
