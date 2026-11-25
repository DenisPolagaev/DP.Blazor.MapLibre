namespace DP.Blazor.MapLibre;

/// <summary>
/// Represents a listener that handles the removal of a registered event listener.
/// </summary>
public sealed class Listener(CallbackHandler action) : IAsyncDisposable
{
    public async Task Remove()
    {
        await action.RemoveAsync();
    }

    /// <summary>
    /// Updates the rendered-layer filter for a map listener without replacing its callback.
    /// </summary>
    public Task UpdateLayerIdsAsync(IReadOnlyList<string> layerIds) =>
        action.UpdateLayerIdsAsync(layerIds);

    public async ValueTask DisposeAsync()
    {
        await action.RemoveAsync();
    }
}
