using System.Text.Json;
using DP.Blazor.MapLibre.Models.Event;
using DP.Blazor.MapLibre.Models.LayerFeatures;
using Xunit;

namespace DP.Blazor.MapLibre.Tests;

public class EventModelTests
{
  private const string ClickEventJson = """
    {
      "type": "click",
      "point": { "x": 10, "y": 20 },
      "lngLat": { "lng": 1.5, "lat": 2.5 },
      "features": [
        {
          "type": "Feature",
          "source": "maine",
          "geometry": { "type": "Point", "coordinates": [1, 2] },
          "properties": {},
          "layer": { "id": "GeoJsonLayerId" }
        }
      ]
    }
    """;

    [Fact]
    public void MapMouseEvent_DeserializesFeaturesAsLayerFeatureFeature()
    {
        var evt = JsonSerializer.Deserialize<MapMouseEvent>(ClickEventJson, MapLibreJsonSerializer.Options);

        Assert.NotNull(evt);
        Assert.Equal(EventType.Click, evt!.Type);
        Assert.Single(evt.Features);
        Assert.Equal("maine", evt.Features[0].Source);
        Assert.NotNull(evt.Features[0].Layer);
    }

    [Fact]
    public void MapDataEvent_DeserializesSourceFields()
    {
        const string json = """
            {
              "type": "sourcedata",
              "dataType": "source",
              "isSourceLoaded": true,
              "sourceId": "maine"
            }
            """;

        var evt = JsonSerializer.Deserialize<MapDataEvent>(json, MapLibreJsonSerializer.Options);

        Assert.NotNull(evt);
        Assert.Equal(EventType.SourceData, evt!.Type);
        Assert.Equal("source", evt.DataType);
        Assert.True(evt.IsSourceLoaded);
        Assert.Equal("maine", evt.SourceId);
    }

    [Fact]
    public void MapErrorEvent_DeserializesError()
    {
        const string json = """{ "type": "error", "error": { "message": "test" } }""";

        var evt = JsonSerializer.Deserialize<MapErrorEvent>(json, MapLibreJsonSerializer.Options);

        Assert.NotNull(evt);
        Assert.Equal(EventType.Error, evt!.Type);
        Assert.NotNull(evt.Error);
        Assert.Equal("test", evt.Error!.Message);
    }

    [Fact]
    public void MapTouchEvent_DeserializesMultiTouchPoints()
    {
        const string json = """
            {
              "type": "touchstart",
              "point": { "x": 1, "y": 2 },
              "lngLat": { "lng": 10, "lat": 20 },
              "points": [{ "x": 1, "y": 2 }, { "x": 3, "y": 4 }],
              "lngLats": [{ "lng": 10, "lat": 20 }, { "lng": 11, "lat": 21 }]
            }
            """;

        var evt = JsonSerializer.Deserialize<MapTouchEvent>(json, MapLibreJsonSerializer.Options);

        Assert.NotNull(evt);
        Assert.Equal(EventType.TouchStart, evt!.Type);
        Assert.Equal(2, evt.Points.Length);
        Assert.Equal(2, evt.LngLats.Length);
    }

    [Fact]
    public void MapWheelEvent_DeserializesWithoutPoint()
    {
        const string json = """{ "type": "wheel", "deltaY": -120, "deltaX": 0 }""";

        var evt = JsonSerializer.Deserialize<MapWheelEvent>(json, MapLibreJsonSerializer.Options);

        Assert.NotNull(evt);
        Assert.Equal(EventType.Wheel, evt!.Type);
        Assert.Equal(-120, evt.DeltaY);
    }

    [Fact]
    public void MapDataEvent_DeserializesSourceDataChanged()
    {
        const string json = """
            {
              "type": "sourcedata",
              "dataType": "source",
              "sourceId": "terrain",
              "sourceDataChanged": true,
              "tile": { "x": 1, "y": 2, "z": 3 }
            }
            """;

        var evt = JsonSerializer.Deserialize<MapDataEvent>(json, MapLibreJsonSerializer.Options);

        Assert.NotNull(evt);
        Assert.True(evt!.SourceDataChanged);
        Assert.NotNull(evt.Tile);
        Assert.Equal(3u, evt.Tile!.Z);
    }

    [Fact]
    public void MapDomEvent_DeserializesFromOriginalEvent()
    {
        const string json = """
            {
              "type": "click",
              "point": { "x": 1, "y": 2 },
              "lngLat": { "lng": 10, "lat": 20 },
              "originalEvent": {
                "type": "click",
                "button": 0,
                "ctrlKey": true,
                "clientX": 100,
                "clientY": 200
              }
            }
            """;

        var evt = JsonSerializer.Deserialize<MapMouseEvent>(json, MapLibreJsonSerializer.Options);

        Assert.NotNull(evt);
        var dom = evt!.GetOriginalDomEvent();
        Assert.NotNull(dom);
        Assert.Equal(0, dom!.Button);
        Assert.True(dom.CtrlKey);
        Assert.Equal(100, dom.ClientX);
    }

    [Fact]
    public void MapZoomEvent_DeserializesBoxZoom()
    {
        const string json = """{ "type": "boxzoomend" }""";

        var evt = JsonSerializer.Deserialize<MapZoomEvent>(json, MapLibreJsonSerializer.Options);

        Assert.NotNull(evt);
        Assert.Equal(EventType.BoxZoomEnd, evt!.Type);
    }

    [Fact]
    public void CompactMapEventDto_MatchesMapLibreRazorJsFieldNames()
    {
        // Keys emitted by createCompactMapEventDto in MapLibre.razor.js / ts/src/events.ts
        const string json = """
            {
              "type": "sourcedata",
              "point": null,
              "lngLat": null,
              "originalEvent": null,
              "layerId": null,
              "features": null,
              "dataType": "source",
              "isSourceLoaded": true,
              "sourceId": "points",
              "sourceDataType": "metadata",
              "sourceDataChanged": false,
              "tile": { "z": 1, "x": 2, "y": 3 },
              "newProjection": null,
              "id": null
            }
            """;

        var evt = JsonSerializer.Deserialize<MapDataEvent>(json, MapLibreJsonSerializer.Options);
        Assert.NotNull(evt);
        Assert.Equal("metadata", evt!.SourceDataType);
        Assert.Equal("points", evt.SourceId);
        Assert.False(evt.SourceDataChanged);
        Assert.Equal(1u, evt.Tile!.Z);
    }

    [Fact]
    public void MapStyleImageMissingEvent_AndProjection_DeserializeFromCompactDto()
    {
        var missing = JsonSerializer.Deserialize<MapStyleImageMissingEvent>(
            """{ "type": "styleimagemissing", "id": "pin" }""",
            MapLibreJsonSerializer.Options);
        Assert.Equal("pin", missing!.Id);

        var projection = JsonSerializer.Deserialize<MapProjectionEvent>(
            """{ "type": "projectiontransition", "newProjection": { "type": "mercator" } }""",
            MapLibreJsonSerializer.Options);
        Assert.NotNull(projection!.NewProjection);
    }
}
