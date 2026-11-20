using System.Text.Json.Serialization;
using DP.Blazor.MapLibre.Models.Camera;

namespace DP.Blazor.MapLibre.Models.Control;

public class GeolocateControlOptions
{
    [JsonPropertyName("positionOptions")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public PositionOptions? PositionOptions { get; set; }

    [JsonPropertyName("fitBoundsOptions")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public FitBoundOptions? FitBoundsOptions { get; set; }

    [JsonPropertyName("trackUserLocation")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? TrackUserLocation { get; set; }

    [JsonPropertyName("showAccuracyCircle")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? ShowAccuracyCircle { get; set; }

    [JsonPropertyName("showUserLocation")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? ShowUserLocation { get; set; }

    /// <summary>
    /// How far to zoom to the accuracy of the reported position while <see cref="TrackUserLocation"/> is on
    /// (MapLibre 6.12+). Default is <c>true</c>.
    /// </summary>
    [JsonPropertyName("zoomToUserAccuracy")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? ZoomToUserAccuracy { get; set; }
}

public class PositionOptions
{
    [JsonPropertyName("maximumAge")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public long? MaximumAge { get; set; }

    [JsonPropertyName("timeout")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public long? Timeout { get; set; }

    [JsonPropertyName("enableHighAccuracy")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? EnableHighAccuracy { get; set; }
}
