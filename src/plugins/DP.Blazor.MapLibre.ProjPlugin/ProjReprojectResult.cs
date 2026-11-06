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
    /// Reserved for the area-of-use bounds intended for <c>map.setMaxBounds</c>. The current pipeline never populates
    /// it, so it is always <c>null</c>.
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

    /// <summary>
    /// Ids of the style sources that could not be reprojected and were removed together with their layers — in
    /// practice raster sources (imagery, hillshade), which have no vector representation. The plugin also logs a
    /// warning per source; the list lets the host report the loss through its own logging and UI.
    /// </summary>
    [JsonPropertyName("droppedSources")]
    public string[] DroppedSources { get; set; } = [];
}
