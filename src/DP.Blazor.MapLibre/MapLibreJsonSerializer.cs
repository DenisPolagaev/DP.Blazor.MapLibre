using System.Text.Json;
using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre;

/// <summary>
/// Shared JSON serializer options for MapLibre interop and event deserialization.
/// </summary>
public static class MapLibreJsonSerializer
{
    public static JsonSerializerOptions Options { get; } = CreateOptions();

    /// <summary>
    /// Serializer options for <see cref="Models.Request.TransformRequestResult"/>.
    /// Omits unset optional fields so MapLibre receives a valid <c>RequestParameters</c> object.
    /// </summary>
    public static JsonSerializerOptions TransformRequestOptions { get; } = new()
    {
        PropertyNameCaseInsensitive = true,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        Converters = { new MapLibreJsonStringEnumConverter() },
    };

    private static JsonSerializerOptions CreateOptions()
    {
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
        };

#if NET9_0_OR_GREATER
        options.AllowOutOfOrderMetadataProperties = true;
#endif

        return options;
    }
}
