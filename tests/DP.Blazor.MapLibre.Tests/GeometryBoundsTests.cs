using DP.Blazor.MapLibre.Models.Feature;
using Xunit;

namespace DP.Blazor.MapLibre.Tests;

public class GeometryBoundsTests
{
    [Fact]
    public void MultiPointGeometry_GetBounds_ReturnsExpectedBounds()
    {
        var geometry = new MultiPointGeometry
        {
            Coordinates =
            [
                [-70.0, 44.0],
                [-68.0, 46.0],
            ],
        };

        var bounds = geometry.GetBounds();

        Assert.Equal(-70.0, bounds.Southwest.Longitude);
        Assert.Equal(44.0, bounds.Southwest.Latitude);
        Assert.Equal(-68.0, bounds.Northeast.Longitude);
        Assert.Equal(46.0, bounds.Northeast.Latitude);
    }

    [Fact]
    public void MultiLineGeometry_GetBounds_ReturnsExpectedBounds()
    {
        var geometry = new MultiLineGeometry
        {
            Coordinates =
            [
                [
                    [-71.0, 43.0],
                    [-69.0, 45.0],
                ],
                [
                    [-68.0, 44.0],
                    [-67.0, 46.0],
                ],
            ],
        };

        var bounds = geometry.GetBounds();

        Assert.Equal(-71.0, bounds.Southwest.Longitude);
        Assert.Equal(43.0, bounds.Southwest.Latitude);
        Assert.Equal(-67.0, bounds.Northeast.Longitude);
        Assert.Equal(46.0, bounds.Northeast.Latitude);
    }

    [Fact]
    public void MultiPolygonGeometry_GetBounds_ReturnsExpectedBounds()
    {
        var geometry = new MultiPolygonGeometry
        {
            Coordinates =
            [
                [
                    [
                        [-71.0, 43.0],
                        [-69.0, 43.0],
                        [-69.0, 45.0],
                        [-71.0, 45.0],
                        [-71.0, 43.0],
                    ],
                ],
                [
                    [
                        [-68.0, 44.0],
                        [-67.0, 44.0],
                        [-67.0, 46.0],
                        [-68.0, 46.0],
                        [-68.0, 44.0],
                    ],
                ],
            ],
        };

        var bounds = geometry.GetBounds();

        Assert.Equal(-71.0, bounds.Southwest.Longitude);
        Assert.Equal(43.0, bounds.Southwest.Latitude);
        Assert.Equal(-67.0, bounds.Northeast.Longitude);
        Assert.Equal(46.0, bounds.Northeast.Latitude);
    }
}
