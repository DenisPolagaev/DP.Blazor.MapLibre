using System.Text.Json;
using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre;

/// <summary>
/// Shared JSON serializer options for MapLibre interop and event deserialization.
/// </summary>
public static class MapLibreJsonSerializer
{
    public static JsonSerializerOptions Options { get; } = new()
    {
        AllowOutOfOrderMetadataProperties = true,
        PropertyNameCaseInsensitive = true,
    };

    /// <summary>
    /// Serializer options for <see cref="Models.Request.TransformRequestResult"/>.
    /// Omits unset optional fields so MapLibre receives a valid <c>RequestParameters</c> object.
    /// </summary>
    public static JsonSerializerOptions TransformRequestOptions { get; } = new()
    {
        PropertyNameCaseInsensitive = true,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        Converters = { new JsonStringEnumConverter() },
    };
}
