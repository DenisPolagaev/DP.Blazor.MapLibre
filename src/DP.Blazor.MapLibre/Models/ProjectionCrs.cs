using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models;

/// <summary>
/// A planar coordinate reference system registered with <see cref="MapLibre.AddProjection"/>
/// (MapLibre <c>CRS</c>, 6.15+, experimental).
/// </summary>
/// <remarks>
/// MapLibre does not reproject tile content for such a map: every tile source must already be cut in
/// <see cref="TileMatrixSet"/>. Converting lng/lat to CRS coordinates happens on every pointer event, so the
/// converter is a JavaScript function pair passed by name (see <see cref="ForwardFunction"/>) — a .NET callback
/// would be invoked for every coordinate.
/// </remarks>
public sealed class ProjectionCrs
{
    /// <summary>
    /// Name used in <c>projection.type</c>, for example <c>EPSG:2193</c> or <c>custom:floor-plan</c>.
    /// It must contain a colon: names without one are reserved for built-in projections.
    /// </summary>
    [JsonPropertyName("name")]
    public required string Name { get; set; }

    /// <summary>
    /// The quad tile matrix set over the CRS plane.
    /// </summary>
    [JsonPropertyName("tileMatrixSet")]
    public required ProjectionTileMatrixSet TileMatrixSet { get; set; }

    /// <summary>
    /// Name of a JavaScript function on <c>globalThis</c> (<c>[lng, lat] =&gt; [x, y]</c>), for example
    /// <c>app.proj.forward</c> registered by a script that built a proj4 converter.
    /// </summary>
    [JsonPropertyName("forwardFunction")]
    public required string ForwardFunction { get; set; }

    /// <summary>
    /// Optional name of the inverse JavaScript function on <c>globalThis</c> (<c>[x, y] =&gt; [lng, lat]</c>).
    /// Without it the map only converts lng/lat to CRS coordinates.
    /// </summary>
    [JsonPropertyName("inverseFunction")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? InverseFunction { get; set; }

    /// <summary>
    /// The CRS as a string the workers' projection handler accepts (WKT or a PROJ string). GeoJSON sources
    /// need it, because their data is tiled in a worker where the converter function cannot go.
    /// </summary>
    [JsonPropertyName("definition")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Definition { get; set; }
}

/// <summary>
/// The square, power-of-two quad tile grid of a <see cref="ProjectionCrs"/>.
/// </summary>
public sealed class ProjectionTileMatrixSet
{
    /// <summary>
    /// CRS coordinates of the top-left corner of tile 0/0/0 (<c>[min x, max y]</c>), in the order the
    /// projection's forward function returns them.
    /// </summary>
    [JsonPropertyName("origin")]
    public required double[] Origin { get; set; }

    /// <summary>
    /// Width (= height) of tile 0/0/0 in CRS units.
    /// </summary>
    [JsonPropertyName("extentAtZoom0")]
    public required double ExtentAtZoom0 { get; set; }
}
