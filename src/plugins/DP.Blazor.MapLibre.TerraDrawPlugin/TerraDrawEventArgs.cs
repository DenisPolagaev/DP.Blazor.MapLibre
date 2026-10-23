using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

/// <summary>
/// Event payload from maplibre-gl-terradraw controls. The library 1.13.2 sends <c>deletedIds</c> with
/// <c>feature-deleted</c> and no payload for the other control events, so <see cref="Mode"/> and
/// <see cref="Feature"/> are null unless the library sends them.
/// </summary>
public sealed class TerraDrawEventArgs
{
    /// <summary>Mode name, when the library includes it in the event.</summary>
    [JsonPropertyName("mode")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Mode { get; set; }

    /// <summary>Feature payload, when the library includes it in the event.</summary>
    [JsonPropertyName("feature")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object[]? Feature { get; set; }

    /// <summary>Ids of the features removed by a <c>feature-deleted</c> event.</summary>
    [JsonPropertyName("deletedIds")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object[]? DeletedIds { get; set; }
}
