using System.Text.Json;
using DP.Blazor.MapLibre.Models;
using DP.Blazor.MapLibre.Models.Clustering;
using DP.Blazor.MapLibre.Models.Feature;
using FluentAssertions;
using Xunit;

namespace DP.Blazor.MapLibre.Tests;

public class RuntimeImprovementTests
{
    [Fact]
    public void Expr_InterpolateZoom_Builds_Linear_Zoom_Expression()
    {
        var expression = Expr.InterpolateZoom(8, 1.0, 14, 4.0);
        expression[0].Should().Be("interpolate");
        expression[2].Should().BeEquivalentTo(Expr.Zoom);
        expression[3].Should().Be(8);
        expression[6].Should().Be(4.0);
    }

    [Fact]
    public void MapStyle_OpenFreeMap_And_Wms_Payloads()
    {
        MapStyle.OpenFreeMap.Liberty.ToStylePayload().Should().Be("https://tiles.openfreemap.org/styles/liberty");

        var wms = MapStyle.FromWmsUrl("https://example.test/wms", "layer1", "© test");
        var payload = wms.ToStylePayload();
        JsonSerializer.Serialize(payload).Should().Contain("GetMap");
    }

    [Fact]
    public void BulkTransactionCoalescer_Keeps_Latest_SetSourceData()
    {
        var transaction = new BulkTransaction();
        BulkTransactionCoalescer.Enqueue(transaction, "setSourceData", "src", "one");
        BulkTransactionCoalescer.Enqueue(transaction, "addLayer", "layer");
        BulkTransactionCoalescer.Enqueue(transaction, "setSourceData", "src", "two");

        transaction.Transactions.Should().HaveCount(2);
        transaction.Transactions[1].Event.Should().Be("setSourceData");
        transaction.Transactions[1].Data![1].Should().Be("two");
    }

    [Fact]
    public void BulkTransactionCoalescer_Enqueue_Matches_Append_Then_Coalesce()
    {
        var enqueued = new BulkTransaction();
        var appended = new BulkTransaction();

        var sequence = new (string Event, object?[] Data)[]
        {
            ("setSourceData", ["a", "1"]),
            ("addLayer", ["layer-b"]),
            ("setSourceData", ["c", "1"]),
            ("setSourceData", ["b", "2"]),
            ("setSourceData", ["a", "3"]),
            ("setPaintProperty", ["layer-b", "icon-opacity", 0.5]),
        };

        foreach (var (eventName, data) in sequence)
        {
            BulkTransactionCoalescer.Enqueue(enqueued, eventName, data);
            appended.Add(eventName, data);
        }

        BulkTransactionCoalescer.Coalesce(appended);

        var enqueuedKeys = enqueued.Transactions.Select(item => $"{item.Event}:{item.Data![0]}").ToArray();
        var appendedKeys = appended.Transactions.Select(item => $"{item.Event}:{item.Data![0]}").ToArray();

        enqueuedKeys.Should().Equal(appendedKeys);
    }

    [Fact]
    public void ClusterLayerSet_Creates_Cluster_And_Point_Layers()
    {
        var collection = new FeatureCollection
        {
            Features =
            [
                new FeatureFeature
                {
                    Geometry = new PointGeometry { Coordinates = [30.0, 55.0] }
                }
            ]
        };

        var set = ClusterLayerSet.Create(collection, new ClusterLayerSetOptions { SourceId = "stations" });
        set.Clusters.Id.Should().Be("stations-clusters");
        set.ClusterCount.Id.Should().Be("stations-cluster-count");
        set.Unclustered.Id.Should().Be("stations-unclustered");
        set.Source.Cluster.Should().BeTrue();
        set.LayerIds.Should().HaveCount(3);
    }

    [Fact]
    public void MapStyles_OpenStreetMap_Uses_Typed_Factory()
    {
        MapStyles.OpenStreetMap.Should().NotBeNull();
        MapStyles.OpenFreeMapLiberty.Should().Be("https://tiles.openfreemap.org/styles/liberty");
    }
}
