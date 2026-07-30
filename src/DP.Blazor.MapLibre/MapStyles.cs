namespace DP.Blazor.MapLibre;

/// <summary>
/// Built-in map style definitions.
/// </summary>
public static class MapStyles
{
    /// <summary>
    /// OpenStreetMap raster tiles as a MapLibre style JSON object.
    /// </summary>
    public static object OpenStreetMap { get; } = new
    {
        version = 8,
        sources = new Dictionary<string, object>
        {
            ["osm"] = new
            {
                type = "raster",
                tiles = new[] { "https://tile.openstreetmap.org/{z}/{x}/{y}.png" },
                tileSize = 256,
                attribution = "© OpenStreetMap contributors",
                maxzoom = 19,
            },
        },
        layers = new[]
        {
            new
            {
                id = "osm",
                type = "raster",
                source = "osm",
            },
        },
    };
}
