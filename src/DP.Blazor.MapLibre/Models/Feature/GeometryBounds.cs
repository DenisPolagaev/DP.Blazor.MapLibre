namespace DP.Blazor.MapLibre.Models.Feature;

internal static class GeometryBounds
{
    public static LngLatBounds FromPositions(IEnumerable<double[]> positions)
    {
        var minLng = double.MaxValue;
        var minLat = double.MaxValue;
        var maxLng = double.MinValue;
        var maxLat = double.MinValue;
        var hasPoint = false;

        foreach (var coordinate in positions)
        {
            if (coordinate.Length < 2)
            {
                continue;
            }

            hasPoint = true;
            minLng = Math.Min(minLng, coordinate[0]);
            minLat = Math.Min(minLat, coordinate[1]);
            maxLng = Math.Max(maxLng, coordinate[0]);
            maxLat = Math.Max(maxLat, coordinate[1]);
        }

        if (!hasPoint)
        {
            return new LngLatBounds
            {
                Southwest = new LngLat(0, 0),
                Northeast = new LngLat(0, 0),
            };
        }

        return new LngLatBounds
        {
            Southwest = new LngLat(minLng, minLat),
            Northeast = new LngLat(maxLng, maxLat),
        };
    }
}
