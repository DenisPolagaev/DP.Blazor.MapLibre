using System.Text.Json.Nodes;
using DP.Blazor.MapLibre;
using DP.Blazor.MapLibre.Models;
using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre.ProjPlugin;

/// <summary>
/// MapLibre plugin that renders a map in an arbitrary coordinate reference system (CRS). Reprojection runs on the
/// browser main thread with the vendored <c>proj-wasm</c> (PROJ 9) runtime. The
/// plugin does not use <c>maplibre-proj</c> or <c>backproj</c>.
/// </summary>
/// <remarks>
/// <para>
/// <b>Requirements.</b> Create the map with <see cref="MapOptions.RenderWorldCopies"/> set to <c>false</c>: the
/// reprojected style uses a fake Mercator coordinate space that does not tile. Register the plugin with
/// <see cref="MapLibre.RegisterPlugin"/> before calling any member; members throw otherwise.
/// </para>
/// <para>
/// <b>Detach and dispose.</b> <c>DetachAsync</c> releases the protocol handlers and transformers that this
/// plugin created for the map. It does <b>not</b> restore the original style, camera or bounds. The reprojected style
/// stays on the map, and its reprojected vector sources stop loading until the host sets a style again (for example
/// with <c>MapLibre.SetStyle</c>). Detach has an effect only after an apply or <see cref="ReprojectSourceAsync"/>
/// call has attached the plugin. Dispose releases the same resources regardless of attachment.
/// </para>
/// <para>
/// <b>Limitations.</b> Only the first tile URL template of a vector source is used; a warning is logged when a source
/// has more. Raster sources and layers are dropped. At most <see cref="ProjReprojectOptions.MaxInputTiles"/> input
/// tiles are read per output tile; beyond that the output tile is incomplete and a warning is logged. Re-running
/// <see cref="ApplyCurrentStyleProjectionAsync"/> on a style that this plugin already reprojected is not supported.
/// </para>
/// <para>
/// <b>Import map.</b> The vendored modules are resolved through an import map. Browsers read import maps only before
/// the first module loads. Declare the entries from <see cref="GetImportMapAsync"/> in a static
/// <c>&lt;script type="importmap"&gt;</c> before the Blazor framework script. Without them the plugin adds the
/// entries at runtime and logs a warning when the browser does not honour them.
/// </para>
/// </remarks>
public sealed class ProjPlugin : MapLibreJsPlugin
{
    #region Fields

    private IJSObjectReference? _map;
    private bool _projectionResourcesReleased;

    #endregion

    #region Module

    /// <inheritdoc />
    protected override string ModulePath => "./_content/ProjPlugin/ProjPlugin.js";

    /// <summary>
    /// Stores the map reference. Every JavaScript call passes it so that the module keeps its state per map.
    /// </summary>
    /// <inheritdoc />
    protected override ValueTask OnModuleLoadedAsync(IJSObjectReference map, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(map);
        _map = map;
        return base.OnModuleLoadedAsync(map, cancellationToken);
    }

    /// <summary>
    /// Releases the protocol handlers and transformers of this map. The reprojected style is not restored.
    /// See the remarks of <see cref="ProjPlugin"/>.
    /// </summary>
    /// <inheritdoc />
    protected override async ValueTask OnDetachModuleAsync(CancellationToken cancellationToken)
    {
        if (_map is null)
        {
            return;
        }

        await Module.InvokeVoidAsync("detach", cancellationToken, _map);
    }

    /// <summary>Releases the protocol handlers and transformers of this map before the module is disposed.</summary>
    /// <inheritdoc />
    protected override async ValueTask OnModuleDisposingAsync()
    {
        if (_map is null)
        {
            return;
        }

        try
        {
            await Module.InvokeVoidAsync("dispose", _map);
        }
        finally
        {
            _map = null;
        }
    }

    private IJSObjectReference MapReference =>
        _map ?? throw new InvalidOperationException(
            $"{nameof(ProjPlugin)} has no map reference. Call MapLibre.RegisterPlugin before using the plugin.");

    #endregion

    #region Projection

    /// <summary>
    /// Reprojects a style and returns the rewritten style, fake bounds and transformer id. The map is not modified.
    /// Vector protocol handlers created here stay registered for the map until the next apply on this map, a detach,
    /// or dispose. Call <see cref="ApplyReprojectionAsync"/>, or pass <see cref="ProjReprojectResult.Style"/> to
    /// <c>MapLibre.SetStyle</c> yourself.
    /// </summary>
    public async Task<ProjReprojectResult> ReprojectStyleAsync(
        ProjReprojectOptions options,
        CancellationToken cancellationToken = default)
    {
        EnsureInitialized();
        ArgumentNullException.ThrowIfNull(options);
        return await Module.InvokeAsync<ProjReprojectResult>(
            "reprojectStyle",
            cancellationToken,
            options,
            MapReference);
    }

    /// <summary>
    /// Reprojects a style and applies it to the map: <c>setStyle</c>, then <c>fitBounds</c> with the fake bounds
    /// unless <see cref="ProjReprojectOptions.FitBounds"/> is <c>false</c>. The protocol handlers of the previously
    /// applied style are released. Attaches the plugin, so <c>DetachAsync</c> has an effect afterwards.
    /// </summary>
    public async Task<ProjReprojectResult> ApplyReprojectionAsync(
        ProjReprojectOptions options,
        CancellationToken cancellationToken = default)
    {
        EnsureInitialized();
        ArgumentNullException.ThrowIfNull(options);
        _projectionResourcesReleased = false;
        var result = await Module.InvokeAsync<ProjReprojectResult>(
            "applyReprojection",
            cancellationToken,
            options,
            MapReference);
        MarkAttached();
        return result;
    }

    /// <summary>
    /// Reprojects the map's <b>current</b> style and sets the result on the map. Vector sources declared via TileJSON
    /// (<c>url</c>) are expanded to explicit <c>tiles</c>. Raster sources and layers are dropped, because the pipeline
    /// reprojects vector and GeoJSON sources only. The current style must not already be reprojected by this plugin.
    /// Attaches the plugin.
    /// </summary>
    public async Task<ProjReprojectResult> ApplyCurrentStyleProjectionAsync(
        ProjMapProjectionOptions options,
        CancellationToken cancellationToken = default)
    {
        EnsureInitialized();
        ArgumentNullException.ThrowIfNull(options);
        _projectionResourcesReleased = false;
        var result = await Module.InvokeAsync<ProjReprojectResult>(
            "reprojectCurrentStyle",
            cancellationToken,
            options,
            MapReference);
        MarkAttached();
        return result;
    }

    /// <summary>
    /// Reprojects a single source (vector tile or GeoJSON) and returns the rewritten source. Used for data layers added
    /// after the basemap style was reprojected. Repeating a call with the same
    /// <see cref="ProjSourceReprojectOptions.SourceId"/> replaces the earlier protocol handler of that source. Attaches
    /// the plugin.
    /// </summary>
    public async Task<ProjSourceReprojectResult> ReprojectSourceAsync(
        ProjSourceReprojectOptions options,
        CancellationToken cancellationToken = default)
    {
        EnsureInitialized();
        ArgumentNullException.ThrowIfNull(options);
        _projectionResourcesReleased = false;
        var result = await Module.InvokeAsync<ProjSourceReprojectResult>(
            "reprojectSource",
            cancellationToken,
            options,
            MapReference);
        MarkAttached();
        return result;
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
        var result = await Module.InvokeAsync<List<LngLat>>(
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

        return await Module.InvokeAsync<LngLat>(
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
        await Module.InvokeVoidAsync("releaseTransformer", cancellationToken, transformerId);
    }

    #endregion

    #region Diagnostics

    /// <summary>
    /// Clears the process-wide projection cache and releases the transformers created for this map. There are no worker threads: the pipeline runs on the main thread. Transformer ids
    /// returned earlier for this map become invalid; the next reprojection creates new ones. Protocol handlers still
    /// used by the map stay registered.
    /// </summary>
    public async Task ReleaseProjectionResourcesAsync(CancellationToken cancellationToken = default)
    {
        EnsureInitialized();
        await Module.InvokeVoidAsync("releaseProjectionResources", cancellationToken, MapReference);
        _projectionResourcesReleased = true;
    }

    /// <summary>Whether <see cref="ReleaseProjectionResourcesAsync"/> was called since the last apply.</summary>
    public bool ProjectionResourcesReleased => _projectionResourcesReleased;

    /// <summary>
    /// Returns the <c>imports</c> entries that the plugin uses to resolve its vendored modules. Browsers read import
    /// maps only before the first module script loads, so copy these entries into a static
    /// <c>&lt;script type="importmap"&gt;</c> in the host page <b>before</b> the Blazor framework script. Entries that
    /// the plugin adds at runtime are a fallback. The plugin logs a warning when the browser ignores them.
    /// </summary>
    public async Task<JsonObject> GetImportMapAsync(CancellationToken cancellationToken = default)
    {
        EnsureInitialized();
        return await Module.InvokeAsync<JsonObject>("getImportMap", cancellationToken);
    }

    /// <summary>Returns the vendored dependency manifest (package names and versions).</summary>
    public async Task<JsonObject?> GetVendorManifestAsync(CancellationToken cancellationToken = default)
    {
        EnsureInitialized();
        return await Module.InvokeAsync<JsonObject?>("getVendorManifest", cancellationToken);
    }

    #endregion
}
