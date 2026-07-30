using System.Text.Json;
using System.Text.Json.Serialization;
using DP.Blazor.MapLibre;

namespace DP.Blazor.MapLibre.Models.Event;

public class MapEvent
{
    [JsonPropertyName("type")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public EventType Type { get; set; }

    [JsonPropertyName("originalEvent")]
    public JsonElement? OriginalEvent { get; set; }

    /// <summary>
    /// Deserializes <see cref="OriginalEvent"/> as a <see cref="MapDomEvent"/> when present.
    /// </summary>
    public MapDomEvent? GetOriginalDomEvent()
    {
        if (OriginalEvent is null || OriginalEvent.Value.ValueKind is JsonValueKind.Null or JsonValueKind.Undefined)
        {
            return null;
        }

        return JsonSerializer.Deserialize<MapDomEvent>(OriginalEvent.Value.GetRawText(), MapLibreJsonSerializer.Options);
    }
}
