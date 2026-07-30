using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Feature;

public class MultiPointGeometry : IGeometry
{
    [JsonPropertyName("coordinates")]
    public required double[][] Coordinates { get; set; }

    public LngLatBounds GetBounds() => GeometryBounds.FromPositions(Coordinates);
}
