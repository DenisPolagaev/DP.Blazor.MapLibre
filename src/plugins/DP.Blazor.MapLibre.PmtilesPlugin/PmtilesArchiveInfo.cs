using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.PmtilesPlugin;

/// <summary>
/// Metadata read from a PMTiles archive header. <see cref="Encoding"/> is the value a MapLibre vector source needs to
/// decode the archive's tiles (<c>mlt</c> / <c>mvt</c>), or <c>null</c> when the archive does not hold vector tiles.
/// </summary>
public sealed class PmtilesArchiveInfo
{
    /// <summary>Raw PMTiles tile type id (1 = MVT, 2/3/4/5 = raster, 6 = MLT).</summary>
    [JsonPropertyName("tileType")]
    public int TileType { get; set; }

    /// <summary>MapLibre source encoding, or <c>null</c> for a raster archive.</summary>
    [JsonPropertyName("encoding")]
    public string? Encoding { get; set; }

    [JsonPropertyName("minZoom")]
    public int MinZoom { get; set; }

    [JsonPropertyName("maxZoom")]
    public int MaxZoom { get; set; }
}
