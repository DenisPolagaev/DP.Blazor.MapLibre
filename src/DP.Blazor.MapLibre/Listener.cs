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

    public async ValueTask DisposeAsync()
    {
        await action.RemoveAsync();
    }
}
