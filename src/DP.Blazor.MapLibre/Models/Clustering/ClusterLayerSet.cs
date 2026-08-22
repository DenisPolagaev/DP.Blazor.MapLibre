using System.Text.Json;
using System.Text.Json.Nodes;
using DP.Blazor.MapLibre.Models.Feature;
using DP.Blazor.MapLibre.Models.Layers;
using DP.Blazor.MapLibre.Models.Sources;
using OneOf;

namespace DP.Blazor.MapLibre.Models.Clustering;

/// <summary>
/// Appearance for the default clustered-point layer set (clusters + count + unclustered circles).
/// </summary>
public sealed class ClusterLayerAppearance
{
    public string ClusterColor { get; set; } = "#51bbd6";
    public string ClusterStrokeColor { get; set; } = "#ffffff";
    public double ClusterStrokeWidth { get; set; } = 1;
    public string CountColor { get; set; } = "#ffffff";
    public double CountSize { get; set; } = 12;
    public string PointColor { get; set; } = "#11b4da";
    public double PointRadius { get; set; } = 6;
    public string PointStrokeColor { get; set; } = "#ffffff";
    public double PointStrokeWidth { get; set; } = 1;
}

/// <summary>
/// Ids and clustering parameters for <see cref="ClusterLayerSet"/>.
/// </summary>
public sealed class ClusterLayerSetOptions
{
    public required string SourceId { get; set; }
    public string ClusterLayerId { get; set; } = "";
    public string ClusterCountLayerId { get; set; } = "";
    public string UnclusteredLayerId { get; set; } = "";
    public bool Cluster { get; set; } = true;
    public float ClusterRadius { get; set; } = 50;
    public float? ClusterMaxZoom { get; set; }
    public int ClusterMinPoints { get; set; } = 2;
    public ClusterLayerAppearance Appearance { get; set; } = new();

    public string ResolvedClusterLayerId =>
        string.IsNullOrWhiteSpace(ClusterLayerId) ? $"{SourceId}-clusters" : ClusterLayerId;

    public string ResolvedClusterCountLayerId =>
        string.IsNullOrWhiteSpace(ClusterCountLayerId) ? $"{SourceId}-cluster-count" : ClusterCountLayerId;

    public string ResolvedUnclusteredLayerId =>
        string.IsNullOrWhiteSpace(UnclusteredLayerId) ? $"{SourceId}-unclustered" : UnclusteredLayerId;
}

/// <summary>
/// Ready-made GeoJSON source + circle/symbol layers for clustered point features.
/// </summary>
public sealed class ClusterLayerSet
{
    public required GeoJsonSource Source { get; init; }
    public required CircleLayer Clusters { get; init; }
    public required SymbolLayer ClusterCount { get; init; }
    public required CircleLayer Unclustered { get; init; }

    public IReadOnlyList<string> LayerIds =>
        [Clusters.Id, ClusterCount.Id, Unclustered.Id];

    public static ClusterLayerSet Create(IFeature data, ClusterLayerSetOptions options)
    {
        ArgumentNullException.ThrowIfNull(data);
        ArgumentNullException.ThrowIfNull(options);
        ArgumentException.ThrowIfNullOrWhiteSpace(options.SourceId);

        var appearance = options.Appearance ?? new ClusterLayerAppearance();
        var source = new GeoJsonSource
        {
            Data = OneOf<IFeature, string>.FromT0(data),
            Cluster = options.Cluster,
            ClusterRadius = options.ClusterRadius,
            ClusterMaxZoom = options.ClusterMaxZoom,
            ClusterMinPoints = options.ClusterMinPoints,
        };

        var clusters = new CircleLayer
        {
            Id = options.ResolvedClusterLayerId,
            Source = options.SourceId,
            Filter = new object[] { "has", "point_count" },
            Paint = new CircleLayerPaint
            {
                CircleColor = appearance.ClusterColor,
                CircleRadius = ToJsonArray(Expr.Step("point_count", 18, 10, 24, 50, 32)),
                CircleStrokeColor = appearance.ClusterStrokeColor,
                CircleStrokeWidth = appearance.ClusterStrokeWidth,
            },
        };

        var count = new SymbolLayer
        {
            Id = options.ResolvedClusterCountLayerId,
            Source = options.SourceId,
            Filter = new object[] { "has", "point_count" },
            Layout = new SymbolLayerLayout
            {
                TextField = ToJsonArray(Expr.Get("point_count_abbreviated")),
                TextSize = appearance.CountSize,
            },
            Paint = new SymbolLayerPaint
            {
                TextColor = appearance.CountColor,
            },
        };

        var unclustered = new CircleLayer
        {
            Id = options.ResolvedUnclusteredLayerId,
            Source = options.SourceId,
            Filter = new object[] { "!", new object[] { "has", "point_count" } },
            Paint = new CircleLayerPaint
            {
                CircleColor = appearance.PointColor,
                CircleRadius = appearance.PointRadius,
                CircleStrokeColor = appearance.PointStrokeColor,
                CircleStrokeWidth = appearance.PointStrokeWidth,
            },
        };

        return new ClusterLayerSet
        {
            Source = source,
            Clusters = clusters,
            ClusterCount = count,
            Unclustered = unclustered,
        };
    }

    private static JsonArray ToJsonArray(object[] expression) =>
        JsonSerializer.SerializeToNode(expression)!.AsArray();
}
