using System.Text.Json;
using DP.Blazor.MapLibre.Models.Request;
using Xunit;

namespace DP.Blazor.MapLibre.Tests;

public class TransformRequestModelTests
{
    [Fact]
    public void TransformRequestInput_DeserializesFromJson()
    {
        const string json = """
            {
              "url": "https://example.com/tile/1/2/3",
              "resourceType": "Tile"
            }
            """;

        var input = JsonSerializer.Deserialize<TransformRequestInput>(json, MapLibreJsonSerializer.TransformRequestOptions);

        Assert.NotNull(input);
        Assert.Equal("https://example.com/tile/1/2/3", input!.Url);
        Assert.Equal("Tile", input.ResourceType);
        Assert.Equal(MapLibreResourceType.Tile, input.GetResourceType());
    }

    [Fact]
    public void TransformRequestResult_SerializesOnlyDefinedRequestParameters()
    {
        var result = new TransformRequestResult
        {
            Url = "https://example.com/tile/1/2/3",
            Headers = new Dictionary<string, string> { ["Authorization"] = "Bearer token" },
            Method = RequestMethod.Get,
        };

        var json = JsonSerializer.Serialize(result, MapLibreJsonSerializer.TransformRequestOptions);
        using var document = JsonDocument.Parse(json);
        var root = document.RootElement;

        Assert.Equal("https://example.com/tile/1/2/3", root.GetProperty("url").GetString());
        Assert.Equal("Bearer token", root.GetProperty("headers").GetProperty("Authorization").GetString());
        Assert.Equal("GET", root.GetProperty("method").GetString());
        Assert.False(root.TryGetProperty("credentials", out _));
        Assert.False(root.TryGetProperty("body", out _));
        Assert.False(root.TryGetProperty("collectResourceTiming", out _));
    }

    [Fact]
    public void TransformRequestResult_SerializesCredentialsUsingMapLibreValues()
    {
        var result = new TransformRequestResult
        {
            Url = "https://example.com/tile/1/2/3",
            Credentials = RequestCredentials.Include,
        };

        var json = JsonSerializer.Serialize(result, MapLibreJsonSerializer.TransformRequestOptions);
        using var document = JsonDocument.Parse(json);

        Assert.Equal("include", document.RootElement.GetProperty("credentials").GetString());
    }

    [Fact]
    public void TransformRequestResult_FromUrl_SerializesMinimalPayload()
    {
        var json = JsonSerializer.Serialize(
            TransformRequestResult.FromUrl("/icons/fire.svg"),
            MapLibreJsonSerializer.TransformRequestOptions);

        using var document = JsonDocument.Parse(json);

        Assert.Equal("/icons/fire.svg", document.RootElement.GetProperty("url").GetString());
        Assert.Single(document.RootElement.EnumerateObject());
    }

    [Theory]
    [InlineData(RequestMethod.Get, "GET")]
    [InlineData(RequestMethod.Post, "POST")]
    [InlineData(RequestMethod.Put, "PUT")]
    public void TransformRequestResult_Method_UsesMapLibreHttpVerbs(RequestMethod method, string expected)
    {
        var json = JsonSerializer.Serialize(
            new TransformRequestResult { Url = "https://x", Method = method },
            MapLibreJsonSerializer.TransformRequestOptions);
        using var document = JsonDocument.Parse(json);
        Assert.Equal(expected, document.RootElement.GetProperty("method").GetString());
    }

    [Theory]
    [InlineData(ResponseBodyType.String, "string")]
    [InlineData(ResponseBodyType.Json, "json")]
    [InlineData(ResponseBodyType.ArrayBuffer, "arrayBuffer")]
    [InlineData(ResponseBodyType.Image, "image")]
    public void TransformRequestResult_Type_UsesMapLibreAjaxValues(ResponseBodyType type, string expected)
    {
        var json = JsonSerializer.Serialize(
            new TransformRequestResult { Url = "https://x", Type = type },
            MapLibreJsonSerializer.TransformRequestOptions);
        using var document = JsonDocument.Parse(json);
        Assert.Equal(expected, document.RootElement.GetProperty("type").GetString());
    }

    [Fact]
    public void TransformRequestResult_RoundTripsFullRequestParametersShape()
    {
        const string json = """
            {
              "url": "https://tiles.example/1/2/3.pbf",
              "headers": { "Authorization": "Bearer x" },
              "method": "GET",
              "body": null,
              "type": "arrayBuffer",
              "credentials": "include",
              "collectResourceTiming": true,
              "cache": "no-store",
              "referrerPolicy": "origin"
            }
            """;

        var restored = JsonSerializer.Deserialize<TransformRequestResult>(json, MapLibreJsonSerializer.TransformRequestOptions);
        Assert.NotNull(restored);
        Assert.Equal("https://tiles.example/1/2/3.pbf", restored!.Url);
        Assert.Equal(RequestMethod.Get, restored.Method);
        Assert.Equal(ResponseBodyType.ArrayBuffer, restored.Type);
        Assert.Equal(RequestCredentials.Include, restored.Credentials);
        Assert.Equal("origin", restored.ReferrerPolicy);
        Assert.Equal("no-store", restored.Cache);
        Assert.True(restored.CollectResourceTiming);
        Assert.Equal("Bearer x", restored.Headers!["Authorization"]);
    }
}
