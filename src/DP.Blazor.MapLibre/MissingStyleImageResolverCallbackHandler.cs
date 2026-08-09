using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre;

internal sealed class MissingStyleImageResolverCallbackHandler(Func<string, Task> handler)
{
    [JSInvokable]
    public Task Invoke(string id) => handler(id);
}
