using System.Text.Json.Nodes;
using System.Text.Json.Serialization;
using DP.Blazor.MapLibre.Models;

namespace DP.Blazor.MapLibre.ProjPlugin;

/// <summary>
/// Result of <see cref="ProjPlugin.ReprojectStyleAsync"/> and
/// <see cref="ProjPlugin.ApplyReprojectionAsync"/>.
/// </summary>
public sealed class ProjReprojectResult
{
    /// <summary>
    /// The reprojected style with rewritten sources and <c>projection: mercator</c>.
    /// </summary>
    [JsonPropertyName("style")]
    public JsonObject Style { get; set; } = [];

    /// <summary>
    /// Fake bounds in the reprojected coordinate space, intended for <c>map.fitBounds</c>.
    /// </summary>
    [JsonPropertyName("bounds")]
    public required LngLatBounds Bounds { get; set; }

    /// <summary>
    /// Padded area-of-use for regional CRS, intended for <c>map.setMaxBounds</c>.
    /// <c>null</c> for global projections.
    /// </summary>
    [JsonPropertyName("maxBounds")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public LngLatBounds? MaxBounds { get; set; }

    /// <summary>
    /// Handle for the compiled transformer. Pass back via
    /// <see cref="ProjReprojectOptions.TransformerId"/> or to the transform helpers.
    /// </summary>
    [JsonPropertyName("transformerId")]
    public string? TransformerId { get; set; }
}
