using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre;

/// <summary>
/// Base class for Blazor-driven MapLibre custom layers.
/// </summary>
public abstract class CustomLayerHandler
{
    /// <summary>
    /// Whether a WebGL context is available for this custom layer.
    /// </summary>
    protected bool HasWebGlContext { get; private set; }

    [JSInvokable]
    public Task OnAdd(bool hasWebGlContext)
    {
        HasWebGlContext = hasWebGlContext;
        return OnAddAsync();
    }

    [JSInvokable]
    public Task OnRemove() => OnRemoveAsync();

    [JSInvokable]
    public Task OnPrerender(float[] matrix) => OnPrerenderAsync(matrix);

    [JSInvokable]
    public Task OnRender(float[] matrix) => OnRenderAsync(matrix);

    protected virtual Task OnAddAsync() => Task.CompletedTask;

    protected virtual Task OnRemoveAsync() => Task.CompletedTask;

    /// <summary>
    /// Called before the layer is rendered. Receives the 4x4 transformation matrix as a 16-element array.
    /// </summary>
    protected virtual Task OnPrerenderAsync(float[] matrix) => Task.CompletedTask;

    /// <summary>
    /// Called when the layer is rendered. Receives the 4x4 transformation matrix as a 16-element array.
    /// WebGL drawing must be performed from JavaScript; use the matrix for coordinate transforms in .NET logic.
    /// </summary>
    protected virtual Task OnRenderAsync(float[] matrix) => Task.CompletedTask;
}
