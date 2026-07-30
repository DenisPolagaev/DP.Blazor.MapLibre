using System.Text.Json;
using DP.Blazor.MapLibre.Models.Event;
using Xunit;

namespace DP.Blazor.MapLibre.Tests;

public class MapMarkerPopupTests
{
    [Fact]
    public void MapMarkerEvent_DeserializesLngLat()
    {
        const string json = """
            {
              "type": "drag",
              "lngLat": { "lng": 10.5, "lat": 20.5 }
            }
            """;

        var evt = JsonSerializer.Deserialize<MapMarkerEvent>(json, MapLibreJsonSerializer.Options);

        Assert.NotNull(evt);
        Assert.Equal(EventType.Drag, evt!.Type);
        Assert.NotNull(evt.LngLat);
        Assert.Equal(10.5, evt.LngLat!.Longitude);
        Assert.Equal(20.5, evt.LngLat.Latitude);
    }

    [Theory]
    [InlineData("click")]
    [InlineData("dragstart")]
    [InlineData("drag")]
    [InlineData("dragend")]
    public void MarkerEventNames_AreStable(string expected)
    {
        Assert.Contains(expected, typeof(Models.Marker.MarkerEventNames)
            .GetFields()
            .Select(f => f.GetValue(null) as string));
    }

    [Theory]
    [InlineData("open")]
    [InlineData("close")]
    public void PopupEventNames_AreStable(string expected)
    {
        Assert.Contains(expected, typeof(Models.PopupEventNames)
            .GetFields()
            .Select(f => f.GetValue(null) as string));
    }
}
