using System.Text.Json;
using DP.Blazor.MapLibre.FrameratePlugin;
using DP.Blazor.MapLibre.MinimapPlugin;
using DP.Blazor.MapLibre.Models;
using DP.Blazor.MapLibre.TerraDrawPlugin;
using Xunit;

namespace DP.Blazor.MapLibre.Tests;

public sealed class PluginControlOptionsTests
{
    [Fact]
    public void MinimapControlOptions_SerializesExpectedJsonShape()
    {
        var options = new MinimapControlOptions
        {
            Id = "overview",
            Width = "200px",
            Height = "120px",
            Center = new LngLat(-73.99, 40.75),
            Zoom = 8,
            ZoomLevels =
            [
                new MinimapZoomLevel(18, 14, 16),
                new MinimapZoomLevel(10, 6, 8),
            ],
            LineColor = "#08F",
            FillOpacity = 0.25,
            DragPan = false,
        };

        var json = JsonSerializer.Serialize(options);

        Assert.Contains("\"id\":\"overview\"", json);
        Assert.Contains("\"width\":\"200px\"", json);
        Assert.Contains("\"height\":\"120px\"", json);
        Assert.Contains("\"center\":", json);
        Assert.Contains("\"zoomLevels\":", json);
        Assert.Contains("\"lineColor\":\"#08F\"", json);
        Assert.Contains("\"dragPan\":false", json);
    }

    [Fact]
    public void FramerateControlOptions_SerializesExpectedJsonShape()
    {
        var options = new FramerateControlOptions
        {
            Background = "rgba(0,0,0,0.9)",
            Color = "#7cf859",
            Font = "Monaco, Consolas, Courier, monospace",
            GraphHeight = 60,
            GraphWidth = 90,
            Width = 100,
        };

        var json = JsonSerializer.Serialize(options);

        Assert.Contains("\"background\":\"rgba(0,0,0,0.9)\"", json);
        Assert.Contains("\"color\":\"#7cf859\"", json);
        Assert.Contains("\"font\":\"Monaco, Consolas, Courier, monospace\"", json);
        Assert.Contains("\"graphHeight\":60", json);
        Assert.Contains("\"graphWidth\":90", json);
        Assert.Contains("\"width\":100", json);
    }

    [Fact]
    public void TerradrawControlOptions_SerializesExpectedJsonShape()
    {
        var options = new TerradrawControlOptions
        {
            Open = true,
            ShowDeleteConfirmation = false,
            Modes =
            [
                TerradrawModes.Point,
                TerradrawModes.Polygon,
                TerradrawModes.Select,
            ],
            AdapterOptions = new TerraDrawAdapterOptions
            {
                PrefixId = "draw",
            },
        };

        var json = JsonSerializer.Serialize(options);

        Assert.Contains("\"open\":true", json);
        Assert.Contains("\"showDeleteConfirmation\":false", json);
        Assert.Contains("\"modes\":", json);
        Assert.Contains("\"point\"", json);
        Assert.Contains("\"adapterOptions\":", json);
        Assert.Contains("\"prefixId\":\"draw\"", json);
    }

    [Fact]
    public void MeasureControlOptions_SerializesExpectedJsonShape()
    {
        var options = new MeasureControlOptions
        {
            Open = true,
            MeasureUnitType = "metric",
            DistancePrecision = 2,
            DistanceUnit = "kilometer",
            ComputeElevation = true,
            TerrainSource = new TerrainSource
            {
                Url = "https://example.com/{z}/{x}/{y}.png",
                Encoding = "mapbox",
                TileSize = 256,
            },
            ElevationCacheConfig = new ElevationCacheConfig
            {
                MaxSize = 128,
            },
        };

        var json = JsonSerializer.Serialize(options);

        Assert.Contains("\"measureUnitType\":\"metric\"", json);
        Assert.Contains("\"distancePrecision\":2", json);
        Assert.Contains("\"distanceUnit\":\"kilometer\"", json);
        Assert.Contains("\"computeElevation\":true", json);
        Assert.Contains("\"terrainSource\":", json);
        Assert.Contains("\"elevationCacheConfig\":", json);
    }

    [Fact]
    public void ValhallaControlOptions_SerializesExpectedJsonShape()
    {
        var options = new ValhallaControlOptions
        {
            Open = true,
            ValhallaOptions = new ValhallaOptions
            {
                Url = "https://valhalla.example.org",
                RoutingOptions = new ValhallaRoutingOptions
                {
                    CostingModel = "auto",
                    DistanceUnit = "kilometers",
                },
                IsochroneOptions = new ValhallaIsochroneOptions
                {
                    TimeCostingModel = "pedestrian",
                    Contours =
                    [
                        new ValhallaContour { Time = 15, Color = "#ff0000" },
                    ],
                },
            },
        };

        var json = JsonSerializer.Serialize(options);

        Assert.Contains("\"valhallaOptions\":", json);
        Assert.Contains("\"url\":\"https://valhalla.example.org\"", json);
        Assert.Contains("\"routingOptions\":", json);
        Assert.Contains("\"isochroneOptions\":", json);
        Assert.Contains("\"contours\":", json);
    }

    [Fact]
    public void CleanStyleOptions_SerializesExpectedJsonShape()
    {
        var options = new CleanStyleOptions
        {
            ExcludeTerraDrawLayers = true,
            OnlyTerraDrawLayers = false,
            SourceIds = ["td-line", "td-point"],
            PrefixId = "draw",
        };

        var json = JsonSerializer.Serialize(options);

        Assert.Contains("\"excludeTerraDrawLayers\":true", json);
        Assert.Contains("\"onlyTerraDrawLayers\":false", json);
        Assert.Contains("\"sourceIds\":", json);
        Assert.Contains("\"prefixId\":\"draw\"", json);
    }
}
