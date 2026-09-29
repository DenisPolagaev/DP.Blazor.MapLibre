using System.Text.Json;
using System.Text.Json.Serialization;
using DP.Blazor.MapLibre.Models.Style;

namespace DP.Blazor.MapLibre.Converter;

/// <summary>
/// Serializes the polymorphic MapLibre <c>font-faces</c> map value, which is either a single
/// font URL string or an array of <see cref="FontFace"/> objects.
/// </summary>
public sealed class FontFaceValueConverter : JsonConverter<FontFaceValue>
{
    public override FontFaceValue Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.String)
        {
            return FontFaceValue.FromUrl(reader.GetString() ?? string.Empty);
        }

        var faces = JsonSerializer.Deserialize<List<FontFace>>(ref reader, options) ?? [];
        return FontFaceValue.FromFaces(faces);
    }

    public override void Write(Utf8JsonWriter writer, FontFaceValue value, JsonSerializerOptions options)
    {
        if (value.Faces is not null)
        {
            JsonSerializer.Serialize(writer, value.Faces, options);
            return;
        }

        JsonSerializer.Serialize(writer, value.Url, options);
    }
}
