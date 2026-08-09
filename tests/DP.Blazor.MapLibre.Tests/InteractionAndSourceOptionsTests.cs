using System.Text.Json;
using DP.Blazor.MapLibre;
using DP.Blazor.MapLibre.Models;
using DP.Blazor.MapLibre.Models.Sources;
using Xunit;

namespace DP.Blazor.MapLibre.Tests;

public class InteractionAndSourceOptionsTests
{
    [Fact]
    public void SetClusterOptions_SerializesSparseFields()
    {
        var options = new SetClusterOptions
        {
            Cluster = true,
            ClusterRadius = 60,
            ClusterMaxZoom = 14
        };

        var json = JsonSerializer.Serialize(options, MapLibreJsonSerializer.Options);

        Assert.Contains("\"cluster\":true", json);
        Assert.Contains("\"clusterRadius\":60", json);
        Assert.DoesNotContain("clusterMinPoints", json);
    }

    [Fact]
    public void UpdateImageSourceOptions_SerializesUrl()
    {
        var options = new UpdateImageSourceOptions
        {
            Url = "https://example.com/radar.png",
            Coordinates =
            [
                [0, 1],
                [1, 1],
                [1, 0],
                [0, 0]
            ]
        };

        var json = JsonSerializer.Serialize(options, MapLibreJsonSerializer.Options);
        var restored = JsonSerializer.Deserialize<UpdateImageSourceOptions>(json, MapLibreJsonSerializer.Options);

        Assert.NotNull(restored);
        Assert.Equal(options.Url, restored!.Url);
        Assert.NotNull(restored.Coordinates);
        Assert.Equal(4, restored.Coordinates!.Count);
    }

    [Fact]
    public void MapOptions_SerializesZoomLevelsToOverscale()
    {
        var options = new MapOptions
        {
            ZoomLevelsToOverscale = 4,
            RotateSpeed = 0.8,
            PitchSpeed = -0.5,
            AnisotropicFilterPitch = 20,
            TerrainSkirtLength = "auto",
            AroundCenter = true
        };

        var json = JsonSerializer.Serialize(options, MapLibreJsonSerializer.Options);

        Assert.Contains("\"zoomLevelsToOverscale\":4", json);
        Assert.DoesNotContain("experimentalZoomLevelsToOverscale", json);
        Assert.Contains("\"rotateSpeed\":0.8", json);
        Assert.Contains("\"pitchSpeed\":-0.5", json);
        Assert.Contains("\"anisotropicFilterPitch\":20", json);
        Assert.Contains("\"terrainSkirtLength\":\"auto\"", json);
        Assert.Contains("\"aroundCenter\":true", json);
    }

    [Fact]
    public void MapInteractionHandlersState_RoundTrips()
    {
        var state = new MapInteractionHandlersState
        {
            DragPan = true,
            ScrollZoom = false,
            CooperativeGestures = true
        };

        var json = JsonSerializer.Serialize(state, MapLibreJsonSerializer.Options);
        var restored = JsonSerializer.Deserialize<MapInteractionHandlersState>(json, MapLibreJsonSerializer.Options);

        Assert.NotNull(restored);
        Assert.True(restored!.DragPan);
        Assert.False(restored.ScrollZoom);
        Assert.True(restored.CooperativeGestures);
    }
}
