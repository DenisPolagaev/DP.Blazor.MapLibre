using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.GeoGridPlugin;

/// <summary>
/// Preset coordinate label formats for <see cref="GeoGrid"/>.
/// </summary>
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum GeoGridLabelFormat
{
    /// <summary>Default DMS format from geogrid-maplibre-gl.</summary>
    Default,

    /// <summary>Whole degrees with degree sign, e.g. <c>45°</c>.</summary>
    DegreesOnly,

    /// <summary>Rounded integer degrees without symbols.</summary>
    IntegerDegrees,
}
