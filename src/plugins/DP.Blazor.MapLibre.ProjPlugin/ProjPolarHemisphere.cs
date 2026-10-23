using System.Text.Json;
using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.ProjPlugin;

/// <summary>
/// Hemisphere that frames a polar coordinate reference system when no area of use is given. Serialized as
/// <c>"north"</c> or <c>"south"</c>, the values the browser pipeline accepts.
/// </summary>
[JsonConverter(typeof(ProjPolarHemisphereJsonConverter))]
public enum ProjPolarHemisphere
{
    /// <summary>Frame the northern hemisphere (latitudes 0 to 80 degrees).</summary>
    North,

    /// <summary>Frame the southern hemisphere (latitudes -80 to 0 degrees).</summary>
    South,
}

/// <summary>Maps <see cref="ProjPolarHemisphere"/> to and from the JSON strings <c>north</c> and <c>south</c>.</summary>
internal sealed class ProjPolarHemisphereJsonConverter : JsonConverter<ProjPolarHemisphere>
{
    /// <inheritdoc />
    public override ProjPolarHemisphere Read(
        ref Utf8JsonReader reader,
        Type typeToConvert,
        JsonSerializerOptions options)
    {
        var value = reader.GetString();
        return value switch
        {
            "north" => ProjPolarHemisphere.North,
            "south" => ProjPolarHemisphere.South,
            _ => throw new JsonException($"Unknown polar hemisphere '{value}'. Expected 'north' or 'south'."),
        };
    }

    /// <inheritdoc />
    public override void Write(
        Utf8JsonWriter writer,
        ProjPolarHemisphere value,
        JsonSerializerOptions options)
    {
        var text = value switch
        {
            ProjPolarHemisphere.North => "north",
            ProjPolarHemisphere.South => "south",
            _ => throw new JsonException($"Unknown polar hemisphere value '{value}'."),
        };
        writer.WriteStringValue(text);
    }
}
