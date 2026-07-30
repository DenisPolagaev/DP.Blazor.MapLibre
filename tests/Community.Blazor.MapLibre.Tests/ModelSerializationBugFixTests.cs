using System.Text.Json;
using System.Text.Json.Serialization;
using Community.Blazor.MapLibre.Models;
using Community.Blazor.MapLibre.Models.Camera;
using Community.Blazor.MapLibre.Models.Control;
using Community.Blazor.MapLibre.Models.Marker;
using Community.Blazor.MapLibre.Models.Padding;
using FluentAssertions;
using Xunit;

namespace Community.Blazor.MapLibre.Tests;

/// <summary>
/// Guards serialization fixes ported from upstream (CameraForBounds/EaseTo padding,
/// enum string names, marker anchor kebab-case).
/// </summary>
public class ModelSerializationBugfixTests
{
    private static readonly JsonSerializerOptions Options = new()
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    [Fact]
    public void CameraForBoundsOptions_WithNullPadding_SerializesWithoutThrowing()
    {
        var json = JsonSerializer.Serialize(new CameraForBoundsOptions(), Options);

        json.Should().NotContain("padding");
    }

    [Fact]
    public void CameraForBoundsOptions_WithNumericPadding_SerializesAsNumber()
    {
        var options = new CameraForBoundsOptions { Padding = 24m };

        var json = JsonSerializer.Serialize(options, Options);

        json.Should().Contain("\"padding\":24");
    }

    [Fact]
    public void CameraForBoundsOptions_WithPaddingObject_SerializesAsObject()
    {
        var options = new CameraForBoundsOptions
        {
            Padding = new PaddingOptions { Top = 10, Bottom = 20, Left = 5, Right = 5 }
        };

        var json = JsonSerializer.Serialize(options, Options);

        json.Should().Contain("\"padding\":{");
        json.Should().Contain("\"top\":10");
    }

    [Fact]
    public void EaseToOptions_CenterZoomBearing_UseCamelCasePropertyNames()
    {
        var options = new EaseToOptions
        {
            Center = new LngLat(10, 20),
            Zoom = 12,
            Bearing = 45,
            Padding = 8
        };

        var json = JsonSerializer.Serialize(options, Options);

        json.Should().Contain("\"center\":");
        json.Should().Contain("\"zoom\":12");
        json.Should().Contain("\"bearing\":45");
        json.Should().Contain("\"padding\":8");
        json.Should().NotContain("\"Center\"");
        json.Should().NotContain("\"Zoom\"");
        json.Should().NotContain("\"Bearing\"");
    }

    [Theory]
    [InlineData(MarkerAnchor.BottomLeft, "bottom-left")]
    [InlineData(MarkerAnchor.TopRight, "top-right")]
    public void MarkerAnchor_SerializesAsMapLibreKebabCase(MarkerAnchor value, string expected)
    {
        var json = JsonSerializer.Serialize(value);

        json.Should().Be($"\"{expected}\"");
    }

    [Fact]
    public void MarkerAlignment_SerializesAsMapLibreString()
    {
        var json = JsonSerializer.Serialize(MarkerAlignment.Viewport);

        json.Should().Be("\"viewport\"");
    }

    [Theory]
    [InlineData(ControlPosition.TopLeft, "top-left")]
    public void ControlPosition_SerializesAsMapLibreString(ControlPosition value, string expected)
    {
        var json = JsonSerializer.Serialize(value);

        json.Should().Be($"\"{expected}\"");
    }

    [Fact]
    public void Visibility_SerializesAsMapLibreString()
    {
        JsonSerializer.Serialize(Visibility.None).Should().Be("\"none\"");
    }

    [Fact]
    public void PositionAnchor_SerializesAsMapLibreString()
    {
        JsonSerializer.Serialize(PositionAnchor.BottomRight).Should().Be("\"bottom-right\"");
    }

    [Fact]
    public void TextFit_SerializesAsMapLibreString()
    {
        JsonSerializer.Serialize(TextFit.StretchOnly).Should().Be("\"stretchOnly\"");
    }
}
