namespace DP.Blazor.MapLibre.Examples;

public static class ExampleMapStyles
{
    public static object OpenStreetMap => MapStyles.OpenStreetMap;

    /// <summary>
    /// Sentinel-2 cloudless satellite imagery (EOX) for globe/atmosphere demos.
    /// </summary>
    public static object GlobeSatellite => new
    {
        version = 8,
        sources = new Dictionary<string, object>
        {
            ["satellite"] = new
            {
                type = "raster",
                tiles = new[] { "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg" },
                tileSize = 256,
                maxzoom = 19,
                attribution = "Sentinel-2 cloudless © EOX IT Services",
            },
        },
        layers = new[]
        {
            new
            {
                id = "satellite",
                type = "raster",
                source = "satellite",
            },
        },
    };
}
