using System.Text.Json;
using DP.Blazor.MapLibre.Models;
using DP.Blazor.MapLibre.Models.Camera;
using DP.Blazor.MapLibre.Models.Layers;
using DP.Blazor.MapLibre.Models.Sources;
using DP.Blazor.MapLibre.Models.Style;
using OneOf;
using Xunit;

namespace DP.Blazor.MapLibre.Tests;

/// <summary>
/// Contract tests for APIs added in MapLibre GL JS 6.5-6.11:
/// <c>font-faces</c>, <c>getStyleUrl</c>, <c>calculateAnchoredCameraOptions</c>,
/// <c>ImageSource.setWarp</c>, and the new layer layout properties.
/// </summary>
public class MapLibre611ContractTests
{
    [Fact]
    public void FontFaceValue_Url_SerializesAsString_AndRoundTrips()
    {
        var value = FontFaceValue.FromUrl("https://example.com/Noto.woff2");

        // Interop uses the default serializer; the converter is attached to the type.
        var json = JsonSerializer.Serialize(value);

        Assert.Equal("\"https://example.com/Noto.woff2\"", json);

        var restored = JsonSerializer.Deserialize<FontFaceValue>(json);
        Assert.NotNull(restored);
        Assert.Equal("https://example.com/Noto.woff2", restored!.Url);
        Assert.Null(restored.Faces);
    }

    [Fact]
    public void FontFaceValue_Faces_SerializesAsArray_AndRoundTrips()
    {
        var value = FontFaceValue.FromFaces(new[]
        {
            new FontFace { Url = "https://example.com/Deva.woff2", UnicodeRange = ["U+0900-097F"] },
            new FontFace { Url = "https://example.com/Fallback.woff2" },
        });

        var json = JsonSerializer.Serialize(value);

        Assert.Contains("\"url\":\"https://example.com/Deva.woff2\"", json);

        // System.Text.Json escapes '+' as \u002B; verify the decoded value instead of the raw substring.
        var root = JsonDocument.Parse(json).RootElement;
        Assert.Equal("U+0900-097F", root[0].GetProperty("unicode-range")[0].GetString());

        var restored = JsonSerializer.Deserialize<FontFaceValue>(json);
        Assert.NotNull(restored);
        Assert.NotNull(restored!.Faces);
        Assert.Equal(2, restored.Faces!.Count);
        Assert.Equal("U+0900-097F", restored.Faces[0].UnicodeRange![0]);
        Assert.Null(restored.Faces[1].UnicodeRange);
    }

    [Fact]
    public void FontFaceValue_ImplicitConversions_ProduceBothShapes()
    {
        FontFaceValue url = "https://example.com/Unifont.woff2";
        FontFaceValue faces = new List<FontFace> { new() { Url = "https://example.com/a.woff2" } };

        Assert.Equal("https://example.com/Unifont.woff2", url.Url);
        Assert.Single(faces.Faces!);
    }

    [Fact]
    public void StyleSpecification_FontFaces_SerializesBothValueShapes()
    {
        var style = new StyleSpecification
        {
            FontFaces = new Dictionary<string, FontFaceValue>
            {
                ["Unifont"] = "https://example.com/Unifont.woff2",
                ["Noto Sans"] = FontFaceValue.FromFaces(
                [
                    new FontFace { Url = "https://example.com/Noto.woff2", UnicodeRange = ["U+0900-097F"] },
                ]),
            },
        };

        var styleNode = style.ToJsonObject();

        Assert.True(styleNode.ContainsKey("font-faces"));
        var fontFaces = styleNode["font-faces"]!.AsObject();
        Assert.Equal("https://example.com/Unifont.woff2", fontFaces["Unifont"]!.GetValue<string>());

        var noto = fontFaces["Noto Sans"]!.AsArray();
        Assert.Single(noto);
        var notoFace = noto[0]!.AsObject();
        Assert.Equal("https://example.com/Noto.woff2", notoFace["url"]!.GetValue<string>());
        Assert.Equal("U+0900-097F", notoFace["unicode-range"]!.AsArray()[0]!.GetValue<string>());

        var json = styleNode.ToJsonString();
        var restored = JsonSerializer.Deserialize<StyleSpecification>(json, MapLibreJsonSerializer.Options);
        Assert.NotNull(restored?.FontFaces);
        Assert.Equal("https://example.com/Unifont.woff2", restored!.FontFaces!["Unifont"].Url);
        Assert.Single(restored.FontFaces["Noto Sans"].Faces!);
    }

    [Fact]
    public void AnchorCameraOptions_SerializesMapLibreShape_AndOmitsNullZoom()
    {
        var options = new AnchoredCameraOptions
        {
            AnchorLocation = new LngLat(12.5, 41.9),
            AnchorScreenPoint = new PointLike(100, 50),
        };

        var root = JsonDocument.Parse(JsonSerializer.Serialize(options)).RootElement;

        Assert.Equal(12.5, root.GetProperty("anchorLocation").GetProperty("lng").GetDouble());
        Assert.Equal(41.9, root.GetProperty("anchorLocation").GetProperty("lat").GetDouble());
        Assert.Equal(100, root.GetProperty("anchorScreenPoint").GetProperty("x").GetDouble());
        Assert.Equal(50, root.GetProperty("anchorScreenPoint").GetProperty("y").GetDouble());
        Assert.False(root.TryGetProperty("zoom", out _));
    }

    [Theory]
    [InlineData(ImageSourceWarp.Auto, "auto")]
    [InlineData(ImageSourceWarp.Perspective, "perspective")]
    [InlineData(ImageSourceWarp.Flat, "flat")]
    public void ImageSourceWarp_SerializesMapLibreEnumStrings(ImageSourceWarp warp, string expected)
    {
        Assert.Equal($"\"{expected}\"", JsonSerializer.Serialize(warp));

        var restored = JsonSerializer.Deserialize<ImageSourceWarp>($"\"{expected}\"");
        Assert.Equal(warp, restored);
    }

    [Fact]
    public void FillExtrusionLayer_RoundedCornerDistance_SerializesUnderLayout()
    {
        var layer = new FillExtrusionLayer
        {
            Id = "buildings",
            Source = "buildings",
            Layout = new FillExtrusionLayerLayout
            {
                FillExtrusionRoundedCornerDistance = OneOf<double, System.Text.Json.Nodes.JsonArray>.FromT0(10),
            },
        };

        var json = JsonSerializer.Serialize(layer).Replace(" ", string.Empty);

        Assert.Contains("\"layout\":{\"fill-extrusion-rounded-corner-distance\":10}", json);
    }

    [Fact]
    public void SymbolLayer_HeightOffsetAndAnchor_SerializeUnderLayout()
    {
        var layer = new SymbolLayer
        {
            Id = "labels",
            Source = "points",
            Layout = new SymbolLayerLayout
            {
                SymbolHeightOffset = OneOf<double, System.Text.Json.Nodes.JsonArray>.FromT0(30),
                SymbolHeightAnchor = OneOf<string, System.Text.Json.Nodes.JsonArray>.FromT0("absolute"),
            },
        };

        var json = JsonSerializer.Serialize(layer).Replace(" ", string.Empty);

        Assert.Contains("\"symbol-height-offset\":30", json);
        Assert.Contains("\"symbol-height-anchor\":\"absolute\"", json);
    }
}
