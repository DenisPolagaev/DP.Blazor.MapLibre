using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.StarfieldPlugin;

/// <summary>
/// Configuration for the starfield / globe-glow backdrop
/// (<see href="https://github.com/markmclaren/maplibre-gl-starfield">maplibre-gl-starfield</see>).
/// </summary>
public sealed record StarfieldOptions
{
    /// <summary>Number of SVG stars (default 1500 upstream).</summary>
    [JsonPropertyName("starCount")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? StarCount { get; init; }

    /// <summary>Atmospheric glow opacity multiplier (0–1).</summary>
    [JsonPropertyName("glowIntensity")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? GlowIntensity { get; init; }

    /// <summary>
    /// Outer glow disk as a multiple of the globe radius (default ~1.12).
    /// Color is concentrated at the limb; thickness ≈ <c>(GlowExtent - 1) × R</c>.
    /// </summary>
    [JsonPropertyName("glowExtent")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? GlowExtent { get; init; }

    /// <summary>
    /// Optional DOM id for an existing starfield container.
    /// When omitted with <see cref="GlowContainerId"/>, the plugin creates layers behind the map.
    /// </summary>
    [JsonPropertyName("starfieldContainerId")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? StarfieldContainerId { get; init; }

    /// <summary>
    /// Optional DOM id for an existing glow container.
    /// When omitted with <see cref="StarfieldContainerId"/>, the plugin creates layers behind the map.
    /// </summary>
    [JsonPropertyName("glowContainerId")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? GlowContainerId { get; init; }

    /// <summary>Optional override for the radial glow palette.</summary>
    [JsonPropertyName("glowColors")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public StarfieldGlowColors? GlowColors { get; init; }
}

/// <summary>Radial gradient stops for the globe atmospheric glow.</summary>
public sealed record StarfieldGlowColors
{
    [JsonPropertyName("inner")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Inner { get; init; }

    [JsonPropertyName("middle")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Middle { get; init; }

    [JsonPropertyName("outer")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Outer { get; init; }

    [JsonPropertyName("fade")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Fade { get; init; }
}
