using System.Collections;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using DP.Blazor.MapLibre;
using DP.Blazor.MapLibre.Models;
using DP.Blazor.MapLibre.Models.Camera;
using DP.Blazor.MapLibre.Models.Event;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace DP.Blazor.MapLibre.Tests;

public class BulkTransactionMergeTests
{
    private static Dictionary<string, object> Bag(params (string Key, object Value)[] pairs) =>
        pairs.ToDictionary(p => p.Key, p => p.Value, StringComparer.Ordinal);

    private static IDictionary PropertiesOf(Transaction transaction) =>
        (IDictionary)transaction.Data![1]!;

    [Fact]
    public void Enqueue_Merges_Paint_Property_Bags_For_The_Same_Layer()
    {
        var transaction = new BulkTransaction();
        BulkTransactionCoalescer.Enqueue(transaction, "setPaintProperties", "roads", Bag(("line-color", "red"), ("line-width", 1)), null);
        BulkTransactionCoalescer.Enqueue(transaction, "setPaintProperties", "roads", Bag(("line-width", 3)), null);

        transaction.Transactions.Should().HaveCount(1);
        var properties = PropertiesOf(transaction.Transactions[0]);
        properties["line-color"].Should().Be("red");
        properties["line-width"].Should().Be(3);
    }

    [Fact]
    public void Enqueue_Does_Not_Merge_Property_Bags_Across_A_Layer_Recreation()
    {
        var transaction = new BulkTransaction();
        BulkTransactionCoalescer.Enqueue(transaction, "setPaintProperties", "roads", Bag(("line-color", "red")), null);
        BulkTransactionCoalescer.Enqueue(transaction, "removeLayer", "roads");
        BulkTransactionCoalescer.Enqueue(transaction, "addLayer", "roads");
        BulkTransactionCoalescer.Enqueue(transaction, "setPaintProperties", "roads", Bag(("line-width", 2)), null);

        transaction.Transactions.Select(t => t.Event).Should().Equal(
            "setPaintProperties", "removeLayer", "addLayer", "setPaintProperties");
        PropertiesOf(transaction.Transactions[0])["line-color"].Should().Be("red");
        PropertiesOf(transaction.Transactions[3])["line-width"].Should().Be(2);
    }

    [Fact]
    public void Coalesce_Merges_Duplicate_Bags_Added_Directly_Within_One_Segment()
    {
        var transaction = new BulkTransaction();
        transaction.Add("setLayoutProperties", "labels", Bag(("text-size", 10)), null);
        transaction.Add("setLayoutProperties", "labels", Bag(("text-font", "Regular")), null);
        transaction.Add("setLayoutProperties", "labels", Bag(("text-size", 14)), null);

        BulkTransactionCoalescer.Coalesce(transaction);

        transaction.Transactions.Should().HaveCount(1);
        var properties = PropertiesOf(transaction.Transactions[0]);
        properties["text-size"].Should().Be(14);
        properties["text-font"].Should().Be("Regular");
    }

    [Fact]
    public void Coalesce_Keeps_Bags_Separated_By_A_Lifecycle_Change()
    {
        var transaction = new BulkTransaction();
        transaction.Add("setPaintProperties", "roads", Bag(("line-color", "red")), null);
        transaction.Add("addLayer", "roads", null);
        transaction.Add("setPaintProperties", "roads", Bag(("line-width", 2)), null);

        BulkTransactionCoalescer.Coalesce(transaction);

        transaction.Transactions.Should().HaveCount(3);
        PropertiesOf(transaction.Transactions[0])["line-color"].Should().Be("red");
        PropertiesOf(transaction.Transactions[2])["line-width"].Should().Be(2);
    }

    [Fact]
    public void Coalesce_Keeps_Only_The_Latest_Filter_For_A_Layer()
    {
        var transaction = new BulkTransaction();
        transaction.Add("setFilter", "roads", "first", null);
        transaction.Add("setFilter", "roads", "second", null);

        BulkTransactionCoalescer.Coalesce(transaction);

        transaction.Transactions.Should().HaveCount(1);
        transaction.Transactions[0].Data![1].Should().Be("second");
    }

    [Fact]
    public void Coalesce_Result_Matches_Enqueue_For_Property_Bags()
    {
        var enqueued = new BulkTransaction();
        BulkTransactionCoalescer.Enqueue(enqueued, "setLayoutProperties", "a", Bag(("visibility", "none")), null);
        BulkTransactionCoalescer.Enqueue(enqueued, "setLayoutProperties", "a", Bag(("text-size", 12)), null);

        var appended = new BulkTransaction();
        appended.Add("setLayoutProperties", "a", Bag(("visibility", "none")), null);
        appended.Add("setLayoutProperties", "a", Bag(("text-size", 12)), null);
        BulkTransactionCoalescer.Coalesce(appended);

        enqueued.Transactions.Should().HaveCount(1);
        appended.Transactions.Should().HaveCount(1);
        PropertiesOf(enqueued.Transactions[0]).Keys.Cast<string>().Should().BeEquivalentTo("visibility", "text-size");
        PropertiesOf(appended.Transactions[0]).Keys.Cast<string>().Should().BeEquivalentTo("visibility", "text-size");
    }
}

public class PluginRegistryTests
{
    public sealed class FirstPlugin : MapLibrePluginBase
    {
        protected override Task OnInitializeAsync(
            Microsoft.JSInterop.IJSObjectReference map,
            Microsoft.JSInterop.IJSRuntime runtime,
            CancellationToken cancellationToken) => Task.CompletedTask;

        protected override ValueTask OnDetachAsync(CancellationToken cancellationToken) => ValueTask.CompletedTask;

        protected override ValueTask OnDisposeAsync() => ValueTask.CompletedTask;
    }

    public sealed class SecondPlugin : MapLibrePluginBase
    {
        protected override Task OnInitializeAsync(
            Microsoft.JSInterop.IJSObjectReference map,
            Microsoft.JSInterop.IJSRuntime runtime,
            CancellationToken cancellationToken) => Task.CompletedTask;

        protected override ValueTask OnDetachAsync(CancellationToken cancellationToken) => ValueTask.CompletedTask;

        protected override ValueTask OnDisposeAsync() => ValueTask.CompletedTask;
    }

    [Fact]
    public void AddMapLibrePlugin_Records_Each_Type_Once_In_Registration_Order()
    {
        var services = new ServiceCollection();

        services.AddMapLibrePlugin<FirstPlugin>();
        services.AddMapLibrePlugin<SecondPlugin>();
        services.AddMapLibrePlugin<FirstPlugin>();

        using var provider = services.BuildServiceProvider();
        var registry = provider.GetRequiredService<MapLibrePluginRegistry>();
        registry.PluginTypes.Should().Equal(typeof(FirstPlugin), typeof(SecondPlugin));
    }

    [Fact]
    public async Task AddMapLibrePlugin_Resolves_A_New_Instance_Per_Scope()
    {
        var services = new ServiceCollection();
        services.AddMapLibrePlugin<FirstPlugin>();

        await using var provider = services.BuildServiceProvider();
        await using var scopeA = provider.CreateAsyncScope();
        await using var scopeB = provider.CreateAsyncScope();

        var a = scopeA.ServiceProvider.GetRequiredService<FirstPlugin>();
        var b = scopeB.ServiceProvider.GetRequiredService<FirstPlugin>();
        a.Should().NotBeSameAs(b);
    }

    [Fact]
    public void Registry_Is_Absent_Without_Registrations()
    {
        var services = new ServiceCollection();
        using var provider = services.BuildServiceProvider();

        provider.GetService<MapLibrePluginRegistry>().Should().BeNull();
    }
}

/// <summary>
/// Conformance checks applied to every concrete plugin with a parameterless constructor, across all plugin
/// assemblies referenced by this test project. A new plugin is covered automatically.
/// </summary>
public class PluginConformanceTests
{
    public static IEnumerable<object[]> PluginTypes()
    {
        // Referencing the types forces their assemblies to load; AppDomain only lists loaded assemblies.
        var assemblies = new[]
        {
            typeof(MapLibrePluginBase).Assembly,
            typeof(DP.Blazor.MapLibre.ComparePlugin.ComparePlugin).Assembly,
            typeof(DP.Blazor.MapLibre.FrameratePlugin.FrameratePlugin).Assembly,
            typeof(DP.Blazor.MapLibre.MinimapPlugin.MinimapPlugin).Assembly,
            typeof(DP.Blazor.MapLibre.GeoGridPlugin.GeoGridPlugin).Assembly,
            typeof(DP.Blazor.MapLibre.PmtilesPlugin.PmtilesPlugin).Assembly,
            typeof(DP.Blazor.MapLibre.ProjPlugin.ProjPlugin).Assembly,
            typeof(DP.Blazor.MapLibre.StarfieldPlugin.StarfieldPlugin).Assembly,
            typeof(DP.Blazor.MapLibre.TerraDrawPlugin.TerraDrawPlugin).Assembly,
        };

        var types = assemblies
            .SelectMany(a => a.GetTypes())
            .Where(t => t is { IsClass: true, IsAbstract: false }
                        && typeof(MapLibrePluginBase).IsAssignableFrom(t)
                        && t.GetConstructor(Type.EmptyTypes) is not null)
            .OrderBy(t => t.FullName, StringComparer.Ordinal)
            .ToArray();

        return types.Select(t => new object[] { t });
    }

    [Fact]
    public void Plugin_Set_Is_Not_Empty()
    {
        PluginTypes().Count().Should().BeGreaterThanOrEqualTo(6);
    }

    [Theory]
    [MemberData(nameof(PluginTypes))]
    public async Task Plugin_Disposes_Without_Initialization(Type pluginType)
    {
        var plugin = (MapLibrePluginBase)Activator.CreateInstance(pluginType)!;

        var act = async () => await plugin.DisposeAsync();

        await act.Should().NotThrowAsync();
        plugin.State.Should().Be(MapLibrePluginLifecycleState.Disposed);
    }

    [Theory]
    [MemberData(nameof(PluginTypes))]
    public async Task Plugin_Detach_Before_Attach_Is_A_No_Op(Type pluginType)
    {
        var plugin = (MapLibrePluginBase)Activator.CreateInstance(pluginType)!;

        var act = async () => await plugin.DetachAsync();

        await act.Should().NotThrowAsync();
        plugin.IsAttached.Should().BeFalse();
        await plugin.DisposeAsync();
    }

    [Theory]
    [MemberData(nameof(PluginTypes))]
    public void Plugin_Is_Not_Attached_Before_Initialization(Type pluginType)
    {
        var plugin = (MapLibrePluginBase)Activator.CreateInstance(pluginType)!;

        plugin.State.Should().Be(MapLibrePluginLifecycleState.Created);
        plugin.IsInitialized.Should().BeFalse();
    }
}

/// <summary>
/// Keeps the two sources of MapLibre event names in sync: the string constants used for registration
/// (<see cref="MapEventNames"/>) and the enum used for typed events (<see cref="EventType"/>).
/// </summary>
public class MapEventNameSyncTests
{
    [Fact]
    public void MapEventNames_And_EventType_Describe_The_Same_Wire_Names()
    {
        var constantNames = typeof(MapEventNames)
            .GetFields(BindingFlags.Public | BindingFlags.Static)
            .Where(f => f.IsLiteral && f.FieldType == typeof(string))
            .Select(f => (string)f.GetRawConstantValue()!)
            .ToArray();

        var enumNames = typeof(EventType)
            .GetFields(BindingFlags.Public | BindingFlags.Static)
            .Select(f => f.GetCustomAttribute<JsonStringEnumMemberNameAttribute>()?.Name
                         ?? throw new InvalidOperationException($"EventType.{f.Name} has no wire name."))
            .ToArray();

        constantNames.Should().OnlyHaveUniqueItems();
        enumNames.Should().OnlyHaveUniqueItems();
        constantNames.Should().BeEquivalentTo(enumNames);
    }
}
public class CameraAndQueryOptionsTests
{
    [Fact]
    public void EasingCurve_Samples_Both_Ends_And_Intermediate_Points()
    {
        var samples = EasingCurve.Sample(t => t * t, 4);

        samples.Should().Equal(0.0, 0.0625, 0.25, 0.5625, 1.0);
    }

    [Fact]
    public void EasingCurve_Rejects_Non_Finite_Values()
    {
        var act = () => EasingCurve.Sample(_ => double.NaN);

        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void FlyToOptions_Serialize_Easing_As_Sampled_Curve_Not_Delegate()
    {
        var options = new FlyToOptions { Duration = 800, Easing = t => t };

        var json = JsonSerializer.Serialize(options, MapLibreJsonSerializer.Options);

        using var document = JsonDocument.Parse(json);
        document.RootElement.TryGetProperty("easing", out _).Should().BeFalse();
        document.RootElement.GetProperty("easingCurve").GetArrayLength().Should().Be(EasingCurve.DefaultSampleCount + 1);
        document.RootElement.GetProperty("duration").GetDouble().Should().Be(800);
    }

    [Fact]
    public void EaseToOptions_Without_Easing_Omit_Curve()
    {
        var json = JsonSerializer.Serialize(new EaseToOptions { Duration = 300 }, MapLibreJsonSerializer.Options);

        json.Should().NotContain("easingCurve");
        json.Should().NotContain("easing");
    }

    [Fact]
    public void QueryRenderedFeaturesOptions_Send_IncludeGeometry_Flag()
    {
        var json = JsonSerializer.Serialize(new QueryRenderedFeaturesOptions { IncludeGeometry = true }, MapLibreJsonSerializer.Options);

        using var document = JsonDocument.Parse(json);
        document.RootElement.GetProperty("includeGeometry").GetBoolean().Should().BeTrue();
    }
}