#if NET8_0
using System.Reflection;
using System.Runtime.Serialization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Converter;

/// <summary>
/// net8 replacement for <see cref="JsonStringEnumConverter"/> that honours
/// <c>JsonStringEnumMemberNameAttribute</c> (STJ 9+) and <see cref="EnumMemberAttribute"/>.
/// net9+ uses the in-box converter and this type is not compiled.
/// </summary>
public sealed class JsonStringEnumMemberConverter : JsonConverterFactory
{
    public override bool CanConvert(Type typeToConvert) => typeToConvert.IsEnum;

    public override JsonConverter CreateConverter(Type typeToConvert, JsonSerializerOptions options) =>
        (JsonConverter)Activator.CreateInstance(
            typeof(EnumConverter<>).MakeGenericType(typeToConvert))!;

    private sealed class EnumConverter<TEnum> : JsonConverter<TEnum>
        where TEnum : struct, Enum
    {
        private static readonly Dictionary<TEnum, string> ToWire = BuildToWire();
        private static readonly Dictionary<string, TEnum> FromWire = ToWire
            .ToDictionary(pair => pair.Value, pair => pair.Key, StringComparer.Ordinal);

        public override TEnum Read(
            ref Utf8JsonReader reader,
            Type typeToConvert,
            JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.String)
            {
                var raw = reader.GetString();
                if (raw is not null && FromWire.TryGetValue(raw, out var mapped))
                {
                    return mapped;
                }

                if (raw is not null && Enum.TryParse<TEnum>(raw, ignoreCase: true, out var parsed))
                {
                    return parsed;
                }
            }
            else if (reader.TokenType == JsonTokenType.Number && reader.TryGetInt64(out var numeric))
            {
                return (TEnum)Enum.ToObject(typeof(TEnum), numeric);
            }

            throw new JsonException($"Unable to convert JSON token to {typeof(TEnum).Name}.");
        }

        public override void Write(
            Utf8JsonWriter writer,
            TEnum value,
            JsonSerializerOptions options) =>
            writer.WriteStringValue(
                ToWire.TryGetValue(value, out var wire) ? wire : value.ToString());

        private static Dictionary<TEnum, string> BuildToWire()
        {
            var map = new Dictionary<TEnum, string>();

            foreach (var field in typeof(TEnum).GetFields(BindingFlags.Public | BindingFlags.Static))
            {
                var wireName = field.GetCustomAttribute<JsonStringEnumMemberNameAttribute>()?.Name
                    ?? field.GetCustomAttribute<EnumMemberAttribute>()?.Value
                    ?? field.Name;
                map[(TEnum)field.GetValue(null)!] = wireName;
            }

            return map;
        }
    }
}
#endif
