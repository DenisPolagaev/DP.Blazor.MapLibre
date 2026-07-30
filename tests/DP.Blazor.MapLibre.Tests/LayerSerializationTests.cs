using System.Text.Json;
using DP.Blazor.MapLibre.Models.Layers;
using OneOf;
using Xunit;

namespace DP.Blazor.MapLibre.Tests;

public class LayerSerializationTests
{
    [Fact]
    public void CircleLayer_LayoutProperties_NestedUnderLayout()
    {
        var layer = new CircleLayer
        {
            Id = "circles",
            Source = "points",
            Layout = new CircleLayerLayout
            {
                CircleSortKey = OneOf<double, System.Text.Json.Nodes.JsonArray>.FromT0(1.5),
                Visibility = OneOf<string, System.Text.Json.Nodes.JsonArray>.FromT0("visible"),
            },
            Paint = new CircleLayerPaint { CircleRadius = 6 },
        };

        var json = JsonSerializer.Serialize(layer);

        Assert.Contains("\"layout\":", json);
        Assert.Contains("\"circle-sort-key\":1.5", json);
        Assert.Contains("\"visibility\":\"visible\"", json);
        Assert.DoesNotContain("\"source\":\"points\",\"circle-sort-key\"", json.Replace(" ", string.Empty));
    }

    [Fact]
    public void CircleLayer_DoesNotSerializeLayoutOnRoot()
    {
        var layer = new CircleLayer
        {
            Id = "c",
            Source = "s",
            Layout = new CircleLayerLayout { Visibility = OneOf<string, System.Text.Json.Nodes.JsonArray>.FromT0("none") },
        };

        var json = JsonSerializer.Serialize(layer);

        Assert.Contains("\"layout\":{\"visibility\":\"none\"}", json.Replace(" ", string.Empty));
    }

    [Fact]
    public void BackgroundLayer_SerializesPaintProperties()
    {
        Layer layer = new BackgroundLayer
        {
            Id = "bg",
            Paint = new BackgroundLayerPaint
            {
                BackgroundColor = "#112233",
                BackgroundOpacity = 0.5,
            },
        };

        var json = JsonSerializer.Serialize(layer);

        Assert.Contains("\"type\":\"background\"", json);
        Assert.Contains("\"background-color\":\"#112233\"", json);
        Assert.Contains("\"background-opacity\":0.5", json);
    }

    [Fact]
    public void RasterLayer_SerializesRasterOpacity()
    {
        var layer = new RasterLayer
        {
            Id = "r",
            Source = "osm",
            Paint = new RasterLayerPaint { RasterOpacity = 0.75, RasterContrast = 0.2 },
        };

        var json = JsonSerializer.Serialize(layer);

        Assert.Contains("\"raster-opacity\":0.75", json);
        Assert.Contains("\"raster-contrast\":0.2", json);
    }

    [Fact]
    public void HillShadeLayer_SerializesPaintProperties()
    {
        var layer = new HillShadeLayer
        {
            Id = "h",
            Source = "dem",
            Paint = new HillShadeLayerPaint { HillshadeExaggeration = 0.5 },
        };

        var json = JsonSerializer.Serialize(layer);

        Assert.Contains("\"hillshade-exaggeration\":0.5", json);
    }

    [Fact]
    public void FillExtrusionLayer_SerializesHeight()
    {
        var layer = new FillExtrusionLayer
        {
            Id = "b",
            Source = "buildings",
            Paint = new FillExtrusionLayerPaint { FillExtrusionHeight = 40 },
        };

        var json = JsonSerializer.Serialize(layer);

        Assert.Contains("\"fill-extrusion-height\":40", json);
    }

    [Fact]
    public void ColorReliefLayer_SerializesDiscriminator()
    {
        Layer layer = new ColorReliefLayer
        {
            Id = "relief",
            Source = "dem",
            Paint = new ColorReliefLayerPaint { ColorReliefOpacity = 1 },
        };

        var json = JsonSerializer.Serialize(layer);

        Assert.Contains("\"type\":\"color-relief\"", json);
        Assert.Contains("\"color-relief-opacity\":1", json);
    }

    [Fact]
    public void FillLayer_SerializesLayerOpacityAndEmissive()
    {
        var layer = new FillLayer
        {
            Id = "f",
            Source = "g",
            Paint = new FillLayerPaint
            {
                FillLayerOpacity = 0.9,
                FillEmissiveStrength = 0.5,
            },
        };

        var json = JsonSerializer.Serialize(layer);

        Assert.Contains("\"fill-layer-opacity\":0.9", json);
        Assert.Contains("\"fill-emissive-strength\":0.5", json);
    }

    [Fact]
    public void LineLayer_SerializesLineLayerOpacity()
    {
        var layer = new LineLayer
        {
            Id = "l",
            Source = "route",
            Paint = new LineLayerPaint { LineLayerOpacity = 0.8 },
        };

        var json = JsonSerializer.Serialize(layer);

        Assert.Contains("\"line-layer-opacity\":0.8", json);
    }

    [Fact]
    public void Layer_SerializesMetadata()
    {
        var layer = new FillLayer
        {
            Id = "f",
            Source = "g",
            Metadata = new { group = "test" },
        };

        var json = JsonSerializer.Serialize(layer);

        Assert.Contains("\"metadata\":", json);
        Assert.Contains("\"group\":\"test\"", json);
    }

    [Fact]
    public void CustomLayer_SerializesTypeDiscriminator()
    {
        var layer = new CustomLayer
        {
            Id = "threejs",
            RenderingMode = "3d",
            Slot = "bottom",
        };

        var json = JsonSerializer.Serialize<Layer>(layer);

        Assert.Contains("\"type\":\"custom\"", json);
        Assert.Contains("\"renderingMode\":\"3d\"", json);
        Assert.Contains("\"slot\":\"bottom\"", json);
    }

    [Fact]
    public void FillLayer_SerializesSourceLayerOnBaseClass()
    {
        var layer = new FillLayer
        {
            Id = "f",
            Source = "geo",
            SourceLayer = "buildings",
        };

        var json = JsonSerializer.Serialize(layer);

        Assert.Contains("\"source-layer\":\"buildings\"", json);
    }
}
