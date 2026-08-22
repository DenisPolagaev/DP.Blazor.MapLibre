namespace DP.Blazor.MapLibre;

/// <summary>
/// Built-in map style definitions.
/// </summary>
public static class MapStyles
{
    /// <summary>
    /// OpenStreetMap raster tiles as a MapLibre style JSON object.
    /// </summary>
    public static object OpenStreetMap { get; } = MapStyle.OpenStreetMap.Standard.ToStylePayload();

    /// <summary>OpenFreeMap Liberty vector style URL.</summary>
    public static object OpenFreeMapLiberty { get; } = MapStyle.OpenFreeMap.Liberty.ToStylePayload();

    /// <summary>OpenFreeMap Positron vector style URL.</summary>
    public static object OpenFreeMapPositron { get; } = MapStyle.OpenFreeMap.Positron.ToStylePayload();
}
