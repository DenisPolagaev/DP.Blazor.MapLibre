using DP.Blazor.MapLibre.Models.Event;
using Xunit;

namespace DP.Blazor.MapLibre.Tests;

public class MapEventNamesTests
{
    [Theory]
    [InlineData(nameof(MapEventNames.Load), "load")]
    [InlineData(nameof(MapEventNames.MoveEnd), "moveend")]
    [InlineData(nameof(MapEventNames.StyleLoad), "style.load")]
    [InlineData(nameof(MapEventNames.SourceData), "sourcedata")]
    [InlineData(nameof(MapEventNames.StyleDataLoading), "styledataloading")]
    [InlineData(nameof(MapEventNames.SourceDataLoading), "sourcedataloading")]
    [InlineData(nameof(MapEventNames.SourceDataAbort), "sourcedataabort")]
    [InlineData(nameof(MapEventNames.CooperativeGesturePrevented), "cooperativegestureprevented")]
    [InlineData(nameof(MapEventNames.ProjectionTransition), "projectiontransition")]
    [InlineData(nameof(MapEventNames.Terrain), "terrain")]
    [InlineData(nameof(MapEventNames.WebGlContextLost), "webglcontextlost")]
    public void MapEventNames_MatchMapLibreValues(string propertyName, string expected)
    {
        var value = typeof(MapEventNames).GetField(propertyName)!.GetValue(null) as string;
        Assert.Equal(expected, value);
        Assert.False(string.IsNullOrWhiteSpace(value));
    }
}
