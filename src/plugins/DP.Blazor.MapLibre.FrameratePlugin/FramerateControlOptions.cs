using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.FrameratePlugin;

/// <summary>
/// Configuration options for the frame rate control
/// (<see href="https://github.com/mapbox/mapbox-gl-framerate">mapbox-gl-framerate</see>).
/// </summary>
public sealed record FramerateControlOptions
{
    /// <summary>Background color of the FPS graph container.</summary>
    [JsonPropertyName("background")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Background { get; init; }

    /// <summary>Width of each performance bar in device pixels.</summary>
    [JsonPropertyName("barWidth")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? BarWidth { get; init; }

    /// <summary>Bar and text color.</summary>
    [JsonPropertyName("color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Color { get; init; }

    /// <summary>Comma-separated font family list for the FPS text.</summary>
    [JsonPropertyName("font")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Font { get; init; }

    /// <summary>Graph height in device pixels.</summary>
    [JsonPropertyName("graphHeight")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? GraphHeight { get; init; }

    /// <summary>Graph width in device pixels.</summary>
    [JsonPropertyName("graphWidth")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? GraphWidth { get; init; }

    /// <summary>Top offset of the graph in device pixels.</summary>
    [JsonPropertyName("graphTop")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? GraphTop { get; init; }

    /// <summary>Right offset of the graph in device pixels.</summary>
    [JsonPropertyName("graphRight")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? GraphRight { get; init; }

    /// <summary>Container width in device pixels.</summary>
    [JsonPropertyName("width")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? Width { get; init; }
}
