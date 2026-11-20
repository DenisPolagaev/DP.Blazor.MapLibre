using System.Text.Json;
using DP.Blazor.MapLibre.Models;
using DP.Blazor.MapLibre.Models.Camera;
using DP.Blazor.MapLibre.Models.Control;
using DP.Blazor.MapLibre.Models.Interaction;
using DP.Blazor.MapLibre.Models.Layers;
using DP.Blazor.MapLibre.Models.Sources;
using DP.Blazor.MapLibre.Models.Style;
using Xunit;

namespace DP.Blazor.MapLibre.Tests;

/// <summary>
/// Contract tests for APIs added in MapLibre GL JS 6.12-6.19:
/// <c>absolutePadding</c>, <c>zoomToUserAccuracy</c>, <c>dragRotate</c> options, <c>globalState</c>,
/// <c>sparse</c> vector sources, the <c>*-layer-blend</c> paint properties, Oklab/Oklch
/// interpolation, <c>addProjection</c> CRS definitions and Trusted Types.
/// </summary>
public class MapLibre619ContractTests
{
    [Fact]
    public void DragRotateOptions_SerializeAroundAndMovement()
    {
        var options = new MapOptions
        {
            DragRotate = new DragRotateOptions { Around = "pointer" },
        };

        var root = JsonDocument.Parse(JsonSerializer.Serialize(options)).RootElement;

        Assert.Equal("pointer", root.GetProperty("dragRotate").GetProperty("around").GetString());
        Assert.False(root.GetProperty("dragRotate").TryGetProperty("movement", out _));
    }

    [Fact]
    public void DragRotate_Bool_StillSerializesAsBoolean()
    {
        var options = new MapOptions { DragRotate = false };

        var root = JsonDocument.Parse(JsonSerializer.Serialize(options)).RootElement;

        Assert.False(root.GetProperty("dragRotate").GetBoolean());
    }

    [Fact]
    public void MapOptions_GlobalState_SerializesAsCamelCaseObject()
    {
        var options = new MapOptions
        {
            GlobalState = new Dictionary<string, object?>
            {
                ["chargerType"] = new[] { "CCS", "Type2" },
                ["minPreferredChargingSpeed"] = 50,
            },
        };

        var root = JsonDocument.Parse(JsonSerializer.Serialize(options)).RootElement;
        var state = root.GetProperty("globalState");

        Assert.Equal("CCS", state.GetProperty("chargerType")[0].GetString());
        Assert.Equal(50, state.GetProperty("minPreferredChargingSpeed").GetInt32());
    }

    [Fact]
    public void SetStyleOptions_GlobalState_Serializes()
    {
        var options = new SetStyleOptions
        {
            GlobalState = new Dictionary<string, object?> { ["mode"] = "dark" },
        };

        var root = JsonDocument.Parse(JsonSerializer.Serialize(options)).RootElement;

        Assert.Equal("dark", root.GetProperty("globalState").GetProperty("mode").GetString());
    }

    [Fact]
    public void StyleSpecification_State_SerializesStyleDefaults()
    {
        var style = new StyleSpecification
        {
            State = new Dictionary<string, object?>
            {
                ["chargerType"] = new Dictionary<string, object?> { ["default"] = new[] { "CCS" } },
            },
        };

        var node = style.ToJsonObject();
        var state = node["state"]!.AsObject();

        Assert.Equal("CCS", state["chargerType"]!["default"]![0]!.GetValue<string>());
    }

    [Fact]
    public void VectorTileSource_Sparse_Serializes()
    {
        var source = new VectorTileSource
        {
            Tiles = ["https://example.com/{z}/{x}/{y}.mlt"],
            Sparse = true,
        };

        var root = JsonDocument.Parse(JsonSerializer.Serialize(source)).RootElement;

        Assert.True(root.GetProperty("sparse").GetBoolean());
    }

    [Fact]
    public void RasterLayer_Blend_SerializesUnderPaint()
    {
        var layer = new RasterLayer
        {
            Id = "imagery",
            Source = "imagery",
            Paint = new RasterLayerPaint { RasterLayerBlend = "multiply" },
        };

        var json = JsonSerializer.Serialize(layer).Replace(" ", string.Empty);

        Assert.Contains("\"paint\":{\"raster-layer-blend\":\"multiply\"}", json);
    }

    [Fact]
    public void LineLayer_Blend_SerializesUnderPaint()
    {
        var layer = new LineLayer
        {
            Id = "contours",
            Source = "grid",
            Paint = new LineLayerPaint { LineLayerBlend = "screen" },
        };

        var json = JsonSerializer.Serialize(layer).Replace(" ", string.Empty);

        Assert.Contains("\"line-layer-blend\":\"screen\"", json);
    }

    [Fact]
    public void FillLayer_Blend_SerializesUnderPaint()
    {
        var layer = new FillLayer
        {
            Id = "bands",
            Source = "grid",
            Paint = new FillLayerPaint { FillLayerBlend = "overlay" },
        };

        var json = JsonSerializer.Serialize(layer).Replace(" ", string.Empty);

        Assert.Contains("\"fill-layer-blend\":\"overlay\"", json);
    }

    [Fact]
    public void FitBoundOptions_AbsolutePadding_Serializes()
    {
        var options = new FitBoundOptions { AbsolutePadding = true };

        var root = JsonDocument.Parse(JsonSerializer.Serialize(options)).RootElement;

        Assert.True(root.GetProperty("absolutePadding").GetBoolean());
    }

    [Fact]
    public void CameraForBoundsOptions_AbsolutePadding_Serializes()
    {
        var options = new CameraForBoundsOptions { AbsolutePadding = true, Padding = 20m };

        var root = JsonDocument.Parse(JsonSerializer.Serialize(options)).RootElement;

        Assert.True(root.GetProperty("absolutePadding").GetBoolean());
        Assert.Equal(20, root.GetProperty("padding").GetInt32());
    }

    [Fact]
    public void GeolocateControlOptions_ZoomToUserAccuracy_Serializes()
    {
        var options = new GeolocateControlOptions { ZoomToUserAccuracy = false };

        var root = JsonDocument.Parse(JsonSerializer.Serialize(options)).RootElement;

        Assert.False(root.GetProperty("zoomToUserAccuracy").GetBoolean());
    }

    [Fact]
    public void Expr_OklabInterpolation_MatchesStyleSpecShape()
    {
        var expression = Expr.InterpolateZoomOklch(0, "#ffffff", 10, "#000000");

        var root = JsonDocument.Parse(JsonSerializer.Serialize(expression)).RootElement;

        Assert.Equal("interpolate", root[0].GetString());
        Assert.Equal("oklch", root[1][0].GetString());
        Assert.Equal("zoom", root[2][0].GetString());
        Assert.Equal(0, root[3].GetDouble());
        Assert.Equal("#ffffff", root[4].GetString());
    }

    [Fact]
    public void Expr_OklabOnProperty_ReadsTheProperty()
    {
        var expression = Expr.InterpolateOklab("ndvi", 0, "#ff0000", 1, "#00ff00");

        var root = JsonDocument.Parse(JsonSerializer.Serialize(expression)).RootElement;

        Assert.Equal("oklab", root[1][0].GetString());
        Assert.Equal("get", root[2][0].GetString());
        Assert.Equal("ndvi", root[2][1].GetString());
    }

    [Fact]
    public void Expr_GlobalState_ReadsTheStateName()
    {
        var expression = Expr.GlobalState("theme");

        var root = JsonDocument.Parse(JsonSerializer.Serialize(expression)).RootElement;

        Assert.Equal("global-state", root[0].GetString());
        Assert.Equal("theme", root[1].GetString());
    }

    [Fact]
    public void ProjectionCrs_SerializesTheMapLibreCrsShape()
    {
        var crs = new ProjectionCrs
        {
            Name = "EPSG:2193",
            ForwardFunction = "app.proj.forward",
            InverseFunction = "app.proj.inverse",
            Definition = "+proj=tmerc +lat_0=0 +lon_0=173",
            TileMatrixSet = new ProjectionTileMatrixSet
            {
                Origin = [-3260586.7284, 10438190.1652],
                ExtentAtZoom0 = 10018754.1714,
            },
        };

        var json = JsonSerializer.Serialize(crs);
        var root = JsonDocument.Parse(json).RootElement;

        Assert.Equal("EPSG:2193", root.GetProperty("name").GetString());
        Assert.Equal("app.proj.forward", root.GetProperty("forwardFunction").GetString());
        Assert.Equal("app.proj.inverse", root.GetProperty("inverseFunction").GetString());
        Assert.Equal(10018754.1714, root.GetProperty("tileMatrixSet").GetProperty("extentAtZoom0").GetDouble());
        Assert.Equal(-3260586.7284, root.GetProperty("tileMatrixSet").GetProperty("origin")[0].GetDouble());

        // The JS bridge reads these camelCase names; a rename silently breaks addProjection.
        Assert.Contains("\"tileMatrixSet\"", json);
        Assert.Contains("\"forwardFunction\"", json);
    }

    [Fact]
    public void ProjectionCrs_WithoutInverse_OmitsTheFunction()
    {
        var crs = new ProjectionCrs
        {
            Name = "custom:floor-plan",
            ForwardFunction = "app.proj.forward",
            TileMatrixSet = new ProjectionTileMatrixSet { Origin = [0, 100], ExtentAtZoom0 = 100 },
        };

        var root = JsonDocument.Parse(JsonSerializer.Serialize(crs)).RootElement;

        Assert.False(root.TryGetProperty("inverseFunction", out _));
        Assert.False(root.TryGetProperty("definition", out _));
    }
}
