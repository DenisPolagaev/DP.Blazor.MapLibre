namespace DP.Blazor.MapLibre.TerraDrawPlugin;

/// <summary>
/// Valhalla costing models offered by the maplibre-gl-terradraw Valhalla control (1.13.2). For other Valhalla
/// costing names use the string overloads.
/// </summary>
public enum TerraDrawCostingModel
{
    /// <summary>Pedestrian routing.</summary>
    Pedestrian,

    /// <summary>Bicycle routing.</summary>
    Bicycle,

    /// <summary>Car routing.</summary>
    Auto,
}
