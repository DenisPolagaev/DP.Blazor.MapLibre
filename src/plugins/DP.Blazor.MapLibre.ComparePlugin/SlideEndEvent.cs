using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.ComparePlugin;

public sealed record SlideEndEvent(
    [property: JsonPropertyName("currentPosition")] double CurrentPosition);
