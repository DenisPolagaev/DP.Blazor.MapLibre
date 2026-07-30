using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Request;

/// <summary>
/// MapLibre resource types passed to <see cref="MapLibre.SetTransformRequest"/>.
/// Matches <c>ResourceType</c> in maplibre-gl-js <c>request_manager.ts</c>.
/// </summary>
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum MapLibreResourceType
{
    Glyphs,
    Image,
    Source,
    SpriteImage,
    SpriteJSON,
    Style,
    Tile,
    Unknown
}

/// <summary>
/// Supported HTTP methods for MapLibre <c>RequestParameters</c>.
/// </summary>
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum RequestMethod
{
    [JsonStringEnumMemberName("GET")]
    Get,

    [JsonStringEnumMemberName("POST")]
    Post,

    [JsonStringEnumMemberName("PUT")]
    Put
}

/// <summary>
/// Supported credentials values for MapLibre <c>RequestParameters</c>.
/// MapLibre only accepts <c>same-origin</c> or <c>include</c>.
/// </summary>
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum RequestCredentials
{
    [JsonStringEnumMemberName("same-origin")]
    SameOrigin,

    [JsonStringEnumMemberName("include")]
    Include
}

/// <summary>
/// Supported response body types for MapLibre <c>RequestParameters</c>.
/// </summary>
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ResponseBodyType
{
    [JsonStringEnumMemberName("string")]
    String,

    [JsonStringEnumMemberName("json")]
    Json,

    [JsonStringEnumMemberName("arrayBuffer")]
    ArrayBuffer,

    [JsonStringEnumMemberName("image")]
    Image
}

/// <summary>
/// Input passed to <see cref="MapLibre.SetTransformRequest"/>.
/// </summary>
public sealed class TransformRequestInput
{
    [JsonPropertyName("url")]
    public string Url { get; set; } = string.Empty;

    [JsonPropertyName("resourceType")]
    public string ResourceType { get; set; } = string.Empty;

    /// <summary>
    /// Parses <see cref="ResourceType"/> when MapLibre sends a known value.
    /// </summary>
    public MapLibreResourceType GetResourceType() =>
        Enum.TryParse<MapLibreResourceType>(ResourceType, ignoreCase: true, out var parsed)
            ? parsed
            : MapLibreResourceType.Unknown;
}

/// <summary>
/// Result returned from a transform request callback.
/// Mirrors MapLibre GL JS <c>RequestParameters</c> from <c>ajax.ts</c>.
/// Only set properties you intend to override; unset optional properties are omitted from JSON.
/// </summary>
public sealed class TransformRequestResult
{
    [JsonPropertyName("url")]
    public required string Url { get; set; }

    [JsonPropertyName("headers")]
    public Dictionary<string, string>? Headers { get; set; }

    [JsonPropertyName("method")]
    public RequestMethod? Method { get; set; }

    [JsonPropertyName("body")]
    public string? Body { get; set; }

    [JsonPropertyName("type")]
    public ResponseBodyType? Type { get; set; }

    [JsonPropertyName("credentials")]
    public RequestCredentials? Credentials { get; set; }

    [JsonPropertyName("collectResourceTiming")]
    public bool? CollectResourceTiming { get; set; }

    [JsonPropertyName("cache")]
    public string? Cache { get; set; }

    [JsonPropertyName("referrerPolicy")]
    public string? ReferrerPolicy { get; set; }

    /// <summary>
    /// Returns a MapLibre-compatible result that only overrides the request URL.
    /// </summary>
    public static TransformRequestResult FromUrl(string url) => new() { Url = url };

    /// <summary>
    /// Returns a MapLibre-compatible result with custom headers.
    /// </summary>
    public static TransformRequestResult WithHeaders(string url, IDictionary<string, string> headers) =>
        new()
        {
            Url = url,
            Headers = new Dictionary<string, string>(headers)
        };
}
