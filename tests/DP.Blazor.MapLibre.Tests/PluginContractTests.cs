using System.Text.Json;
using DP.Blazor.MapLibre;
using DP.Blazor.MapLibre.ComparePlugin;
using DP.Blazor.MapLibre.FrameratePlugin;
using DP.Blazor.MapLibre.GeoGridPlugin;
using DP.Blazor.MapLibre.MinimapPlugin;
using DP.Blazor.MapLibre.Models;
using DP.Blazor.MapLibre.Models.Control;
using DP.Blazor.MapLibre.PmtilesPlugin;
using DP.Blazor.MapLibre.ProjPlugin;
using DP.Blazor.MapLibre.StarfieldPlugin;
using DP.Blazor.MapLibre.TerraDrawPlugin;
using FluentAssertions;
using Microsoft.JSInterop;
using Xunit;

namespace DP.Blazor.MapLibre.Tests;

/// <summary>
/// Per-plugin C# to JavaScript contract: every public entry point must call the export the module provides,
/// with the map, options and position in the expected order.
/// </summary>
public class PluginContractTests
{
    private static (PluginInfrastructureTests.RecordingRuntime Runtime, IJSObjectReference Map) CreateEnvironment() =>
        (new PluginInfrastructureTests.RecordingRuntime(), new PluginInfrastructureTests.RecordingModule("map"));

    private static object?[] ArgsOf(PluginInfrastructureTests.RecordingModule module, string identifier) =>
        module.LastArgs(identifier) ?? throw new InvalidOperationException($"JS '{identifier}' was not called.");

    [Fact]
    public async Task Framerate_Adds_And_Removes_The_Control_At_The_Default_Position()
    {
        var (runtime, map) = CreateEnvironment();
        var plugin = new FrameratePlugin.FrameratePlugin();
        await plugin.InitializeAsync(map, runtime);
        var options = new FramerateControlOptions { BarWidth = 4 };

        await plugin.AddFramerateControlAsync(options);
        await plugin.RemoveFramerateControlAsync();

        var module = runtime.ModuleFor("./_content/FrameratePlugin/FrameratePlugin.js");
        ArgsOf(module, "addControl").Should().HaveCount(3);
        ArgsOf(module, "addControl")[0].Should().BeSameAs(map);
        ArgsOf(module, "addControl")[1].Should().BeSameAs(options);
        ArgsOf(module, "addControl")[2].Should().Be("top-right");
        ArgsOf(module, "removeControl")[0].Should().BeSameAs(map);
    }

    [Fact]
    public async Task Framerate_Uses_An_Explicit_Position()
    {
        var (runtime, map) = CreateEnvironment();
        var plugin = new FrameratePlugin.FrameratePlugin();
        await plugin.InitializeAsync(map, runtime);

        await plugin.AddFramerateControlAsync(null, ControlPosition.BottomLeft);

        var module = runtime.ModuleFor("./_content/FrameratePlugin/FrameratePlugin.js");
        ArgsOf(module, "addControl")[2].Should().Be("bottom-left");
    }

    [Fact]
    public async Task Minimap_Adds_And_Removes_The_Control_At_The_Default_Position()
    {
        var (runtime, map) = CreateEnvironment();
        var plugin = new MinimapPlugin.MinimapPlugin();
        await plugin.InitializeAsync(map, runtime);
        var options = new MinimapControlOptions { Width = "120px", ZoomLevels = [new MinimapZoomLevel(5, 1, 10)] };

        await plugin.AddMinimapControlAsync(options);
        await plugin.RemoveMinimapControlAsync();

        var module = runtime.ModuleFor("./_content/MinimapPlugin/MinimapPlugin.js");
        ArgsOf(module, "addControl")[0].Should().BeSameAs(map);
        ArgsOf(module, "addControl")[1].Should().BeSameAs(options);
        ArgsOf(module, "addControl")[2].Should().Be("bottom-left");
        ArgsOf(module, "removeControl")[0].Should().BeSameAs(map);
    }

    [Fact]
    public async Task GeoGrid_Adds_Reuses_And_Removes_The_Grid()
    {
        var (runtime, map) = CreateEnvironment();
        var plugin = new GeoGridPlugin.GeoGridPlugin();
        await plugin.InitializeAsync(map, runtime);
        var options = new GeoGridOptions { GridDensityDegrees = 5 };

        await plugin.AddGeoGridAsync(options);
        await plugin.ShowGeoGridAsync();
        await plugin.RemoveGeoGridAsync();

        var module = runtime.ModuleFor("./_content/GeoGridPlugin/GeoGridPlugin.js");
        module.Calls.Count(call => call.Identifier == "add").Should().Be(2);
        ArgsOf(module, "add")[0].Should().BeSameAs(map);
        ArgsOf(module, "add")[1].Should().BeSameAs(options, "re-show reuses the stored options");
        ArgsOf(module, "remove")[0].Should().BeSameAs(map);
    }

    [Fact]
    public async Task Starfield_Attach_Sends_Defaults_And_Detach_Releases_The_Backdrop()
    {
        var (runtime, map) = CreateEnvironment();
        var plugin = new StarfieldPlugin.StarfieldPlugin();
        await plugin.InitializeAsync(map, runtime);

        await plugin.AttachAsync();
        var attachedOptions = ArgsOf(runtime.ModuleFor("./_content/StarfieldPlugin/StarfieldPlugin.js"), "attach")[1];

        await plugin.UpdateConfigAsync(new StarfieldOptions { StarCount = 10 });
        await plugin.DetachAsync();

        var module = runtime.ModuleFor("./_content/StarfieldPlugin/StarfieldPlugin.js");
        module.WasCalled("attach").Should().BeTrue();
        attachedOptions.Should().BeOfType<StarfieldOptions>();
        ArgsOf(module, "attach")[0].Should().BeSameAs(map);
        ArgsOf(module, "updateConfig")[1].Should().BeOfType<StarfieldOptions>();
        ArgsOf(module, "detach")[0].Should().BeSameAs(map);
    }

    [Fact]
    public async Task TerraDraw_Adds_And_Removes_A_Control_With_Its_Wire_Name()
    {
        var (runtime, map) = CreateEnvironment();
        var plugin = new TerraDrawPlugin.TerraDrawPlugin();
        await plugin.InitializeAsync(map, runtime);
        var module = runtime.ModuleFor("./_content/TerraDrawPlugin/TerraDrawPlugin.js");
        module.Results["addControl"] = "control-1";
        module.Results["getControlIds"] = Array.Empty<string>();

        var controlId = await plugin.AddDrawControlAsync(controlId: "control-1");
        await plugin.RemoveControlAsync("control-1");

        controlId.Should().Be("control-1");
        ArgsOf(module, "addControl")[0].Should().BeSameAs(map);
        ArgsOf(module, "addControl")[1].Should().Be("draw");
        ArgsOf(module, "addControl")[3].Should().Be("top-left");
        ArgsOf(module, "addControl")[4].Should().Be("control-1");
        ArgsOf(module, "removeControl")[0].Should().BeSameAs(map);
        ArgsOf(module, "removeControl")[1].Should().Be("control-1");
    }

    [Fact]
    public async Task TerraDraw_Enum_Overloads_Send_Wire_Strings()
    {
        var (runtime, map) = CreateEnvironment();
        var plugin = new TerraDrawPlugin.TerraDrawPlugin();
        await plugin.InitializeAsync(map, runtime);
        var module = runtime.ModuleFor("./_content/TerraDrawPlugin/TerraDrawPlugin.js");

        await plugin.SetMeasureUnitTypeAsync(TerraDrawMeasureUnit.Imperial);
        await plugin.SetRoutingCostingModelAsync(TerraDrawCostingModel.Bicycle);

        ArgsOf(module, "setMeasureUnitType")[1].Should().Be("imperial");
        ArgsOf(module, "setRoutingCostingModel")[1].Should().Be("bicycle");
    }

    [Fact]
    public async Task Compare_Creates_The_Slider_And_Removes_It()
    {
        var (runtime, map) = CreateEnvironment();
        var plugin = new ComparePlugin.ComparePlugin();
        await plugin.InitializeAsync(map, runtime);
        var module = runtime.ModuleFor("./_content/MapComparePlugin/ComparePlugin.js");
        module.Results["mapsReady"] = true;

        (await plugin.MapsReadyAsync("before", "after")).Should().BeTrue();
        await plugin.CreateAsync(
            "before",
            "after",
            "#comparison",
            new CompareOptions(
                MouseMove: true,
                Orientation: CompareOrientation.Horizontal,
                Handle: new CompareHandleOptions(CssClass: "custom-handle")));

        ArgsOf(module, "mapsReady").Should().Equal("before", "after");
        var createArgs = ArgsOf(module, "createCompare");
        createArgs[0].Should().Be("before");
        createArgs[1].Should().Be("after");
        createArgs[3].Should().Be("#comparison");

        var options = JsonSerializer.Serialize(createArgs[4]);
        options.Should().Contain("\"mousemove\":true");
        options.Should().Contain("\"orientation\":\"horizontal\"");
        options.Should().Contain("\"cssClass\":\"custom-handle\"");
        options.Should().Contain("\"icon\":\"chevrons\"");

        await plugin.RemoveAsync();
        ArgsOf(module, "remove")[0].Should().Be("before");
    }

    [Fact]
    public async Task Compare_SlideEnd_Listener_Subscribes_And_Unsubscribes()
    {
        var (runtime, map) = CreateEnvironment();
        var plugin = new ComparePlugin.ComparePlugin();
        await plugin.InitializeAsync(map, runtime);
        var module = runtime.ModuleFor("./_content/MapComparePlugin/ComparePlugin.js");
        module.Results["onSlideEnd"] = "listener-1";

        await plugin.CreateAsync("before", "after", "#comparison");
        var listener = await plugin.AddSlideEndListener<SlideEndEvent>(_ => { });

        await listener.DisposeAsync();

        ArgsOf(module, "onSlideEnd")[0].Should().Be("before");
        ArgsOf(module, "off").Should().Equal("before", "listener-1");
    }

    [Fact]
    public async Task Compare_SlideEnd_Requires_An_Attached_Control()
    {
        var (runtime, map) = CreateEnvironment();
        var plugin = new ComparePlugin.ComparePlugin();
        await plugin.InitializeAsync(map, runtime);

        var act = async () => await plugin.AddSlideEndListener<SlideEndEvent>(_ => { });

        await act.Should().ThrowAsync<InvalidOperationException>();
    }

    [Fact]
    public async Task Pmtiles_Initializes_Once_And_Releases_The_Protocol_Once()
    {
        var (runtime, map) = CreateEnvironment();
        var plugin = new PmtilesPlugin.PmtilesPlugin();
        await plugin.InitializeAsync(map, runtime);

        await plugin.DisposeAsync();
        await plugin.DisposeAsync();

        var module = runtime.ModuleFor("./_content/PmtilesPlugin/PmtilesPlugin.js");
        module.Calls.Count(call => call.Identifier == "initialize").Should().Be(1);
        module.Calls.Count(call => call.Identifier == "dispose").Should().Be(1);
    }

    [Fact]
    public async Task Proj_Releases_Projection_Resources_For_The_Map()
    {
        var (runtime, map) = CreateEnvironment();
        var plugin = new ProjPlugin.ProjPlugin();
        await plugin.InitializeAsync(map, runtime);

        await plugin.ReleaseProjectionResourcesAsync();

        var module = runtime.ModuleFor("./_content/ProjPlugin/ProjPlugin.js");
        ArgsOf(module, "releaseProjectionResources")[0].Should().BeSameAs(map);
        plugin.ProjectionResourcesReleased.Should().BeTrue();
    }

    [Fact]
    public async Task Proj_Returns_The_Import_Map_From_JavaScript()
    {
        var (runtime, map) = CreateEnvironment();
        var plugin = new ProjPlugin.ProjPlugin();
        await plugin.InitializeAsync(map, runtime);
        runtime.ModuleFor("./_content/ProjPlugin/ProjPlugin.js").Results["getImportMap"] =
            new System.Text.Json.Nodes.JsonObject { ["imports"] = new System.Text.Json.Nodes.JsonObject() };

        var importMap = await plugin.GetImportMapAsync();

        importMap["imports"].Should().NotBeNull();
    }
}

/// <summary>
/// Wire contract for the remaining plugin option types.
/// </summary>
public class PluginOptionWireCoverageTests
{
    private static string Serialize<T>(T value) =>
        JsonSerializer.Serialize(value, MapLibreJsonSerializer.Options);

    [Fact]
    public void Framerate_Options_Use_CamelCase_And_Omit_Nulls()
    {
        var json = Serialize(new FramerateControlOptions { BarWidth = 4, GraphHeight = 30 });

        using var document = JsonDocument.Parse(json);
        document.RootElement.GetProperty("barWidth").GetDouble().Should().Be(4);
        document.RootElement.GetProperty("graphHeight").GetDouble().Should().Be(30);
        document.RootElement.TryGetProperty("color", out _).Should().BeFalse();
    }

    [Fact]
    public void Minimap_Options_Use_CamelCase_And_Omit_Nulls()
    {
        var json = Serialize(new MinimapControlOptions
        {
            Width = "120px",
            LineColor = "#ff0000",
            ZoomLevels = [new MinimapZoomLevel(5, 1, 10)],
        });

        using var document = JsonDocument.Parse(json);
        document.RootElement.GetProperty("width").GetString().Should().Be("120px");
        document.RootElement.GetProperty("lineColor").GetString().Should().Be("#ff0000");
        document.RootElement.GetProperty("zoomLevels")[0].GetProperty("parentZoom").GetInt32().Should().Be(5);
        document.RootElement.TryGetProperty("height", out _).Should().BeFalse();
    }

    [Fact]
    public void GeoGrid_LabelFormat_Is_A_String_On_The_Wire()
    {
        var json = Serialize(new GeoGridOptions { LabelFormat = GeoGridLabelFormat.IntegerDegrees });

        using var document = JsonDocument.Parse(json);
        document.RootElement.GetProperty("labelFormat").GetString().Should().Be("IntegerDegrees");
    }

    [Fact]
    public void Proj_Reproject_Options_Send_Style_And_Crs()
    {
        var json = Serialize(new ProjReprojectOptions
        {
            Style = new System.Text.Json.Nodes.JsonObject { ["version"] = 8 },
            Crs = "EPSG:3413",
        });

        using var document = JsonDocument.Parse(json);
        document.RootElement.GetProperty("style").GetProperty("version").GetInt32().Should().Be(8);
        document.RootElement.GetProperty("crs").GetString().Should().Be("EPSG:3413");
        document.RootElement.TryGetProperty("transformerId", out _).Should().BeFalse();
    }
}
