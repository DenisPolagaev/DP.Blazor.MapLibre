using System.Text.Json;
using DP.Blazor.MapLibre.Models.Request;
using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre;

internal sealed class TransformRequestCallbackHandler(Func<TransformRequestInput, TransformRequestResult> handler)
{
    [JSInvokable]
    public string Invoke(string requestJson)
    {
        var input = JsonSerializer.Deserialize<TransformRequestInput>(requestJson, MapLibreJsonSerializer.TransformRequestOptions)
                    ?? new TransformRequestInput();
        var output = handler(input);

        if (string.IsNullOrWhiteSpace(output.Url))
        {
            output.Url = input.Url;
        }

        return JsonSerializer.Serialize(output, MapLibreJsonSerializer.TransformRequestOptions);
    }
}
