using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Feature;

public class MultiLineGeometry : IGeometry
{
    [JsonPropertyName("coordinates")]
    public required double[][][] Coordinates { get; set; }

    public LngLatBounds GetBounds() =>
        GeometryBounds.FromPositions(Coordinates.SelectMany(line => line));
}
