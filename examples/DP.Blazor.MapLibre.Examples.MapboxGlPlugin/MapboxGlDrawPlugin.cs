using DP.Blazor.MapLibre.Models.Feature;
using DP.Blazor.MapLibre.Models.Feature.Dto;
using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre.Examples.MapboxGlPlugin;

/// <summary>
/// Reference plugin showing how to wrap a third-party MapLibre GL JS library.
/// The <see cref="MapLibre"/> component loads the module, calls <c>initialize</c> and disposes it.
/// </summary>
public sealed class MapboxGlDrawPlugin : MapLibreJsPlugin
{
    private IJSObjectReference? _map;
    private DotNetObjectReference<MapboxGlDrawPlugin>? _dotNetReference;

    /// <inheritdoc />
    protected override string ModulePath => "./_content/MapboxGlDrawPlugin/MapboxGlDrawPlugin.js";

    /// <summary>
    /// Triggered when a draw-related update occurs on the map.
    /// </summary>
    public Func<(FeatureCollection FeatureData, string MapStatus), Task>? OnDrawUpdate { get; set; }

    /// <inheritdoc />
    protected override async ValueTask OnModuleLoadedAsync(
        IJSObjectReference map,
        CancellationToken cancellationToken)
    {
        _map = map;
        _dotNetReference = DotNetObjectReference.Create(this);
        cancellationToken.ThrowIfCancellationRequested();
        await Module.InvokeVoidAsync("initialize", map, _dotNetReference);
    }

    /// <inheritdoc />
    protected override async ValueTask OnDetachModuleAsync(CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        if (_map is not null)
        {
            await Module.InvokeVoidAsync("removeControl", _map);
        }
    }

    /// <inheritdoc />
    protected override ValueTask OnModuleDisposingAsync()
    {
        _dotNetReference?.Dispose();
        _dotNetReference = null;
        _map = null;
        return ValueTask.CompletedTask;
    }

    [JSInvokable]
    public async Task OnDrawUpdateCallback(JsFeatureCollection jsFeatureCollection, string mapStatus)
    {
        if (OnDrawUpdate is not null)
        {
            await OnDrawUpdate((jsFeatureCollection.ToFeatureCollection(), mapStatus));
        }
    }

    /// <summary>Adds the Mapbox Draw control to the map.</summary>
    public ValueTask AddControl(object drawOptions)
    {
        EnsureInitialized();
        return Module.InvokeVoidAsync("addControl", MapReference, drawOptions);
    }

    /// <summary>Removes the Mapbox Draw control from the map.</summary>
    public ValueTask RemoveControl()
    {
        EnsureInitialized();
        return Module.InvokeVoidAsync("removeControl", MapReference);
    }

    /// <summary>Adds a feature to the draw control.</summary>
    public ValueTask AddFeature(FeatureFeature feature)
    {
        EnsureInitialized();
        return Module.InvokeVoidAsync("addFeature", MapReference, feature);
    }

    private IJSObjectReference MapReference =>
        _map ?? throw new InvalidOperationException($"{nameof(MapboxGlDrawPlugin)} is not bound to a map.");
}
