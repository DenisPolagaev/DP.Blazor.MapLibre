using System.Text.Json;
using DP.Blazor.MapLibre.Models;
using DP.Blazor.MapLibre.Models.Event;
using DP.Blazor.MapLibre.Models.Padding;
using Xunit;

namespace DP.Blazor.MapLibre.Tests;

public class MapViewStateAndCompactEventTests
{
    [Fact]
    public void MapViewState_RoundTripsWithPadding()
    {
        var state = new MapViewState
        {
            Center = new LngLat(37.6, 55.7),
            Zoom = 8.5,
            Bearing = 12,
            Pitch = 30,
            Padding = new PaddingOptions { Top = 10, Bottom = 20, Left = 5, Right = 5 }
        };

        var json = JsonSerializer.Serialize(state, MapLibreJsonSerializer.Options);
        var restored = JsonSerializer.Deserialize<MapViewState>(json, MapLibreJsonSerializer.Options);

        Assert.NotNull(restored);
        Assert.Equal(37.6, restored!.Center.Longitude, 5);
        Assert.Equal(55.7, restored.Center.Latitude, 5);
        Assert.Equal(8.5, restored.Zoom);
        Assert.Equal(12, restored.Bearing);
        Assert.Equal(30, restored.Pitch);
        Assert.NotNull(restored.Padding);
        Assert.Equal(10, restored.Padding!.Top);
    }

    [Fact]
    public void CompactMouseEvent_DeserializesWithoutFullGeometryCoordinates()
    {
        const string json = """
            {
              "type": "click",
              "point": { "x": 12, "y": 34 },
              "lngLat": { "lng": 1.1, "lat": 2.2 },
              "layerId": "points-circle",
              "features": [
                {
                  "type": "Feature",
                  "id": "42",
                  "source": "points",
                  "sourceLayer": "points",
                  "layer": { "id": "points-circle" },
                  "properties": { "name": "A", "cluster_id": 7, "point_count": 12 },
                  "geometry": { "type": "Point", "coordinates": [] }
                }
              ]
            }
            """;

        var evt = JsonSerializer.Deserialize<MapMouseEvent>(json, MapLibreJsonSerializer.Options);

        Assert.NotNull(evt);
        Assert.Equal("points-circle", evt!.LayerId);
        Assert.Single(evt.Features);
        Assert.Equal("points", evt.Features[0].Source);
        Assert.Equal("42", evt.Features[0].Id);
        Assert.NotNull(evt.Features[0].Properties);
        Assert.True(evt.Features[0].Properties!.ContainsKey("cluster_id"));
    }
}
