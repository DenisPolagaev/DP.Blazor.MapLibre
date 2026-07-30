using System.Text.Json;
using DP.Blazor.MapLibre.Models.Camera;
using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre;

internal sealed class TransformConstrainCallbackHandler(Func<TransformConstrainState, TransformConstrainState> handler)
{
    private static readonly JsonSerializerOptions Serializer = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    [JSInvokable]
    public string Invoke(string transformJson)
    {
        var input = JsonSerializer.Deserialize<TransformConstrainState>(transformJson, Serializer)
                    ?? new TransformConstrainState();
        var output = handler(input);
        return JsonSerializer.Serialize(output, Serializer);
    }
}
