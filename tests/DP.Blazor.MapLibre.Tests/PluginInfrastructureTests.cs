using System.Reflection;
using System.Text.Json.Nodes;
using System.Text.Json;
using DP.Blazor.MapLibre;
using DP.Blazor.MapLibre.GeoGridPlugin;
using DP.Blazor.MapLibre.ProjPlugin;
using DP.Blazor.MapLibre.StarfieldPlugin;
using DP.Blazor.MapLibre.TerraDrawPlugin;
using FluentAssertions;
using Microsoft.JSInterop;
using Xunit;

namespace DP.Blazor.MapLibre.Tests;

/// <summary>
/// Lifecycle and JavaScript contract of <see cref="MapLibreJsPlugin"/> and
/// <see cref="MapLibreControlPlugin{TOptions}"/>, exercised with a recording runtime instead of a browser.
/// </summary>
public class PluginInfrastructureTests
{
    internal sealed class RecordingRuntime : IJSRuntime
    {
        private readonly Dictionary<string, RecordingModule> _modules = new(StringComparer.Ordinal);

        public List<string> ImportedPaths { get; } = [];

        public RecordingModule ModuleFor(string path)
        {
            if (!_modules.TryGetValue(path, out var module))
            {
                module = new RecordingModule(path);
                _modules[path] = module;
            }

            return module;
        }

        public ValueTask<TValue> InvokeAsync<TValue>(string identifier, object?[]? args) =>
            InvokeAsync<TValue>(identifier, CancellationToken.None, args);

        public ValueTask<TValue> InvokeAsync<TValue>(
            string identifier,
            CancellationToken cancellationToken,
            object?[]? args)
        {
            if (identifier == "import")
            {
                var path = (string)args![0]!;
                ImportedPaths.Add(path);
                return ValueTask.FromResult((TValue)(object)ModuleFor(path));
            }

            return ValueTask.FromResult(default(TValue)!);
        }
    }

    internal sealed class RecordingModule(string path) : IJSObjectReference
    {
        public string Path { get; } = path;
        public List<(string Identifier, object?[] Args)> Calls { get; } = [];
        public Dictionary<string, object?> Results { get; } = new(StringComparer.Ordinal);
        public bool Disposed { get; private set; }

        public object?[]? LastArgs(string identifier) =>
            Calls.LastOrDefault(call => call.Identifier == identifier).Args;

        public bool WasCalled(string identifier) =>
            Calls.Any(call => call.Identifier == identifier);

        public ValueTask DisposeAsync()
        {
            Disposed = true;
            return ValueTask.CompletedTask;
        }

        public ValueTask<TValue> InvokeAsync<TValue>(string identifier, object?[]? args)
        {
            Calls.Add((identifier, args ?? []));
            return ResultFor<TValue>(identifier);
        }

        public ValueTask<TValue> InvokeAsync<TValue>(
            string identifier,
            CancellationToken cancellationToken,
            object?[]? args)
        {
            Calls.Add((identifier, args ?? []));
            return ResultFor<TValue>(identifier);
        }

        private ValueTask<TValue> ResultFor<TValue>(string identifier) =>
            Results.TryGetValue(identifier, out var value)
                ? ValueTask.FromResult((TValue)value!)
                : ValueTask.FromResult(default(TValue)!);
    }

    private sealed class TestOptions
    {
        public string? Value { get; init; }
    }

    private sealed class TestJsPlugin : MapLibreJsPlugin
    {
        public TaskCompletionSource<bool>? Gate { get; set; }
        public int InitializeCount { get; private set; }
        public bool DetachCalled { get; private set; }
        public bool DisposingCalled { get; private set; }
        public IJSObjectReference? BoundMap { get; private set; }

        protected override string ModulePath => "./test/Test.js";

        public IJSObjectReference ExposedModule => Module;

        protected override async ValueTask OnModuleLoadedAsync(
            IJSObjectReference map,
            CancellationToken cancellationToken)
        {
            InitializeCount++;
            BoundMap = map;
            if (Gate is not null)
            {
                await Gate.Task;
            }

            await base.OnModuleLoadedAsync(map, cancellationToken);
        }

        protected override ValueTask OnDetachModuleAsync(CancellationToken cancellationToken)
        {
            DetachCalled = true;
            return ValueTask.CompletedTask;
        }

        protected override ValueTask OnModuleDisposingAsync()
        {
            DisposingCalled = true;
            return ValueTask.CompletedTask;
        }
    }

    private sealed class TestControlPlugin : MapLibreControlPlugin<TestOptions>
    {
        protected override string ModulePath => "./test/Control.js";

        public Task AddAsync(TestOptions? options, string? position) => AddControlCoreAsync(options, position);

        public Task RemoveAsync() => RemoveControlCoreAsync();
    }

    private static (RecordingRuntime Runtime, IJSObjectReference Map) CreateEnvironment() =>
        (new RecordingRuntime(), new RecordingModule("map"));

    [Fact]
    public async Task Initialize_Imports_Core_Then_Plugin_And_Calls_Initialize()
    {
        var (runtime, map) = CreateEnvironment();
        var plugin = new TestJsPlugin();

        await plugin.InitializeAsync(map, runtime);

        runtime.ImportedPaths.Should().Equal(
            MapLibrePluginModules.CoreModulePath,
            "./test/Test.js");

        var pluginModule = runtime.ModuleFor("./test/Test.js");
        pluginModule.WasCalled("initialize").Should().BeTrue();
        pluginModule.LastArgs("initialize")![0].Should().BeSameAs(map);

        runtime.ModuleFor(MapLibrePluginModules.CoreModulePath).Disposed.Should().BeTrue();
        plugin.IsInitialized.Should().BeTrue();
        plugin.InitializeCount.Should().Be(1);
    }

    [Fact]
    public async Task Concurrent_Initialize_Invokes_The_Hook_Once()
    {
        var (runtime, map) = CreateEnvironment();
        var gate = new TaskCompletionSource<bool>(TaskCreationOptions.RunContinuationsAsynchronously);
        var plugin = new TestJsPlugin { Gate = gate };

        var first = plugin.InitializeAsync(map, runtime);
        var second = plugin.InitializeAsync(map, runtime);
        gate.SetResult(true);
        await Task.WhenAll(first, second);

        plugin.InitializeCount.Should().Be(1);
        plugin.State.Should().Be(MapLibrePluginLifecycleState.Initialized);
    }

    [Fact]
    public void Module_Before_Initialize_Throws()
    {
        var plugin = new TestJsPlugin();

        var act = () => plugin.ExposedModule;

        act.Should().Throw<InvalidOperationException>().WithMessage("*not loaded*");
    }

    [Fact]
    public async Task Control_Plugin_Adds_And_Removes_The_Control()
    {
        var (runtime, map) = CreateEnvironment();
        var plugin = new TestControlPlugin();
        await plugin.InitializeAsync(map, runtime);
        var module = runtime.ModuleFor("./test/Control.js");
        var options = new TestOptions { Value = "x" };

        await plugin.AddAsync(options, "top-left");

        module.LastArgs("addControl").Should().HaveCount(3);
        module.LastArgs("addControl")![0].Should().BeSameAs(map);
        module.LastArgs("addControl")![1].Should().BeSameAs(options);
        module.LastArgs("addControl")![2].Should().Be("top-left");
        plugin.IsAttached.Should().BeTrue();

        await plugin.RemoveAsync();

        module.WasCalled("removeControl").Should().BeTrue();
        module.LastArgs("removeControl")![0].Should().BeSameAs(map);
        plugin.IsAttached.Should().BeFalse();
    }

    [Fact]
    public async Task Detach_Removes_The_Control_And_Allows_Reattach()
    {
        var (runtime, map) = CreateEnvironment();
        var plugin = new TestControlPlugin();
        await plugin.InitializeAsync(map, runtime);
        var module = runtime.ModuleFor("./test/Control.js");

        await plugin.AddAsync(null, null);
        await plugin.DetachAsync();
        plugin.IsAttached.Should().BeFalse();
        module.WasCalled("removeControl").Should().BeTrue();

        await plugin.AddAsync(null, null);
        plugin.IsAttached.Should().BeTrue();
    }

    [Fact]
    public async Task Dispose_Runs_The_Module_Hook_And_Releases_The_Module()
    {
        var (runtime, map) = CreateEnvironment();
        var plugin = new TestJsPlugin();
        await plugin.InitializeAsync(map, runtime);

        await plugin.DisposeAsync();
        await plugin.DisposeAsync();

        plugin.DisposingCalled.Should().BeTrue();
        runtime.ModuleFor("./test/Test.js").Disposed.Should().BeTrue();
        plugin.State.Should().Be(MapLibrePluginLifecycleState.Disposed);
    }

    [Fact]
    public async Task Initialize_After_Dispose_Throws_ObjectDisposed()
    {
        var (runtime, map) = CreateEnvironment();
        var plugin = new TestJsPlugin();
        await plugin.InitializeAsync(map, runtime);
        await plugin.DisposeAsync();

        var act = async () => await plugin.InitializeAsync(map, runtime);

        await act.Should().ThrowAsync<ObjectDisposedException>();
    }

    [Fact]
    public async Task Detach_Of_Disposed_Plugin_Is_A_NoOp()
    {
        var (runtime, map) = CreateEnvironment();
        var plugin = new TestJsPlugin();
        await plugin.InitializeAsync(map, runtime);
        await plugin.DisposeAsync();

        var act = async () => await plugin.DetachAsync();

        await act.Should().NotThrowAsync();
    }
}

/// <summary>
/// <see cref="CallbackHandler"/> contract: JavaScript unsubscription, reference release and exception transparency.
/// </summary>
public class CallbackHandlerTests
{
    private sealed class RecordingModule : IJSObjectReference
    {
        public List<(string Identifier, object?[] Args)> Calls { get; } = [];
        public Dictionary<string, object?> Results { get; } = new(StringComparer.Ordinal);

        public ValueTask DisposeAsync() => ValueTask.CompletedTask;

        public ValueTask<TValue> InvokeAsync<TValue>(string identifier, object?[]? args)
        {
            Calls.Add((identifier, args ?? []));
            return ResultFor<TValue>(identifier);
        }

        public ValueTask<TValue> InvokeAsync<TValue>(
            string identifier,
            CancellationToken cancellationToken,
            object?[]? args)
        {
            Calls.Add((identifier, args ?? []));
            return ResultFor<TValue>(identifier);
        }

        private ValueTask<TValue> ResultFor<TValue>(string identifier) =>
            Results.TryGetValue(identifier, out var value)
                ? ValueTask.FromResult((TValue)value!)
                : ValueTask.FromResult(default(TValue)!);
    }

    private sealed class Probe
    {
        public int Calls { get; private set; }
        public string? LastValue { get; private set; }

        public void Handle(string value)
        {
            Calls++;
            LastValue = value;
        }

        public void HandleWithoutArguments() => Calls++;

        public void Throw(string value) => throw new InvalidOperationException("handler boom");
    }

    [Fact]
    public async Task Remove_Unsubscribes_And_Releases_The_Reference()
    {
        var module = new RecordingModule();
        var probe = new Probe();
        var handler = new CallbackHandler(module, "map-1", "click", (Action<string>)probe.Handle, typeof(string));
        var reference = DotNetObjectReference.Create(handler);
        handler.Attach(reference, "listener-1");

        await handler.RemoveAsync();
        await handler.RemoveAsync();

        module.Calls.Should().ContainSingle();
        module.Calls[0].Identifier.Should().Be("off");
        module.Calls[0].Args.Should().Equal("map-1", "listener-1");
    }

    [Fact]
    public async Task Remove_Uses_The_Configured_Remove_Method()
    {
        var module = new RecordingModule();
        var probe = new Probe();
        var handler = new CallbackHandler(
            module, "", "drag", (Action<string>)probe.Handle, typeof(string), "markerOff");
        handler.Attach(DotNetObjectReference.Create(handler), "listener-2");

        await handler.RemoveAsync();

        module.Calls.Should().ContainSingle().Which.Identifier.Should().Be("markerOff");
        module.Calls[0].Args.Should().Equal("listener-2");
    }

    [Fact]
    public async Task Invoke_Deserializes_And_Calls_The_Handler()
    {
        var module = new RecordingModule();
        var probe = new Probe();
        var handler = new CallbackHandler(module, "map-1", "click", (Action<string>)probe.Handle, typeof(string));

        await handler.Invoke("{\"type\":\"click\"}");

        probe.Calls.Should().Be(1);
        probe.LastValue.Should().Be("{\"type\":\"click\"}");
    }

    [Fact]
    public async Task Invoke_Without_Arguments_Calls_A_Parameterless_Handler()
    {
        var module = new RecordingModule();
        var probe = new Probe();
        var handler = new CallbackHandler(module, "map-1", "load", (Action)probe.HandleWithoutArguments, typeof(object));

        await handler.Invoke(string.Empty);

        probe.Calls.Should().Be(1);
    }

    [Fact]
    public async Task Invoke_Rethrows_The_Handler_Exception()
    {
        var module = new RecordingModule();
        var probe = new Probe();
        var handler = new CallbackHandler(module, "map-1", "click", (Action<string>)probe.Throw, typeof(string));

        var act = async () => await handler.Invoke("\"value\"");

        await act.Should().ThrowAsync<InvalidOperationException>().WithMessage("handler boom");
    }
}

/// <summary>
/// Wire contract of plugin option types: property names and null omission must match the JavaScript side.
/// </summary>
public class PluginOptionsWireTests
{
    private static string Serialize<T>(T value) =>
        JsonSerializer.Serialize(value, MapLibreJsonSerializer.Options);

    [Fact]
    public void StarfieldOptions_Send_CoronaExtent_And_Omit_Nulls()
    {
        var json = Serialize(new StarfieldOptions { CoronaExtent = 1.5, StarCount = 42 });

        using var document = JsonDocument.Parse(json);
        document.RootElement.GetProperty("coronaExtent").GetDouble().Should().Be(1.5);
        document.RootElement.GetProperty("starCount").GetInt32().Should().Be(42);
        document.RootElement.TryGetProperty("glowIntensity", out _).Should().BeFalse();
        document.RootElement.TryGetProperty("starfieldContainerId", out _).Should().BeFalse();
    }

    [Fact]
    public void GeoGridOptions_Omit_Unset_Values()
    {
        var json = Serialize(new GeoGridOptions { GridDensityDegrees = 5 });

        using var document = JsonDocument.Parse(json);
        document.RootElement.GetProperty("gridDensityDegrees").GetDouble().Should().Be(5);
        document.RootElement.TryGetProperty("beforeLayerId", out _).Should().BeFalse();
        document.RootElement.TryGetProperty("gridStyle", out _).Should().BeFalse();
    }

    [Fact]
    public void ProjOptions_Send_PolarHemisphere_As_Wire_String()
    {
        var json = Serialize(new ProjMapProjectionOptions
        {
            Crs = "EPSG:3413",
            PolarHemisphere = ProjPolarHemisphere.North,
        });

        using var document = JsonDocument.Parse(json);
        document.RootElement.GetProperty("polarHemisphere").GetString().Should().Be("north");
        document.RootElement.GetProperty("crs").GetString().Should().Be("EPSG:3413");
        document.RootElement.TryGetProperty("transformerId", out _).Should().BeFalse();
    }

    [Fact]
    public void ProjOptions_Default_MaxInputTiles_Is_Sent()
    {
        var json = Serialize(new ProjMapProjectionOptions { Crs = "EPSG:4326" });

        using var document = JsonDocument.Parse(json);
        document.RootElement.GetProperty("maxInputTiles").GetInt32().Should().Be(64);
    }

    [Fact]
    public void MeasureControlOptions_Use_CamelCase_Wire_Names()
    {
        var json = Serialize(new MeasureControlOptions
        {
            MeasureUnitType = "metric",
            ComputeElevation = true,
        });

        using var document = JsonDocument.Parse(json);
        document.RootElement.GetProperty("measureUnitType").GetString().Should().Be("metric");
        document.RootElement.GetProperty("computeElevation").GetBoolean().Should().BeTrue();
        document.RootElement.TryGetProperty("undoRedo", out _).Should().BeFalse();
    }
}

/// <summary>
/// Public plugin entry points must fail with a clear exception before the plugin is registered.
/// </summary>
public class PluginPreInitializeGuardTests
{
    private static async Task<Exception?> CaptureAsync(Func<Task> action)
    {
        try
        {
            await action();
            return null;
        }
        catch (Exception ex)
        {
            return ex;
        }
    }

    [Fact]
    public void Compare_MapsReady_Before_Initialize_Throws()
    {
        var plugin = new DP.Blazor.MapLibre.ComparePlugin.ComparePlugin();

        var act = () => plugin.MapsReadyAsync("before", "after");

        act.Should().ThrowAsync<InvalidOperationException>();
    }

    [Fact]
    public async Task Compare_Create_Before_Initialize_Throws()
    {
        var plugin = new DP.Blazor.MapLibre.ComparePlugin.ComparePlugin();

        var error = await CaptureAsync(() => plugin.CreateAsync("before", "after", "#container"));

        error.Should().BeOfType<InvalidOperationException>();
    }

    [Fact]
    public async Task GeoGrid_Add_Before_Initialize_Throws()
    {
        var plugin = new GeoGridPlugin.GeoGridPlugin();

        var error = await CaptureAsync(() => plugin.AddGeoGridAsync(new GeoGridOptions()).AsTask());

        error.Should().BeOfType<InvalidOperationException>();
    }

    [Fact]
    public async Task Starfield_Attach_Before_Initialize_Throws()
    {
        var plugin = new StarfieldPlugin.StarfieldPlugin();

        var error = await CaptureAsync(() => plugin.AttachAsync().AsTask());

        error.Should().BeOfType<InvalidOperationException>();
    }

    [Fact]
    public async Task TerraDraw_Snapshot_Before_Initialize_Throws()
    {
        var plugin = new TerraDrawPlugin.TerraDrawPlugin();

        var error = await CaptureAsync(() => plugin.GetSnapshotAsync().AsTask());

        error.Should().BeOfType<InvalidOperationException>();
    }

    [Fact]
    public async Task Proj_Reproject_Before_Initialize_Throws()
    {
        var plugin = new ProjPlugin.ProjPlugin();

        var error = await CaptureAsync(() => plugin.ReprojectStyleAsync(new ProjReprojectOptions
        {
            Style = new JsonObject { ["version"] = 8 },
            Crs = "EPSG:3413",
        }));

        error.Should().BeOfType<InvalidOperationException>();
    }

    [Fact]
    public void Every_Plugin_Type_Is_Covered_By_Conformance_Tests()
    {
        // Guards the reflection-driven conformance suite: all plugin assemblies must stay referenced.
        var pluginBase = typeof(MapLibrePluginBase);
        var assemblies = new[]
        {
            typeof(DP.Blazor.MapLibre.ComparePlugin.ComparePlugin).Assembly,
            typeof(DP.Blazor.MapLibre.FrameratePlugin.FrameratePlugin).Assembly,
            typeof(DP.Blazor.MapLibre.GeoGridPlugin.GeoGridPlugin).Assembly,
            typeof(DP.Blazor.MapLibre.MinimapPlugin.MinimapPlugin).Assembly,
            typeof(DP.Blazor.MapLibre.PmtilesPlugin.PmtilesPlugin).Assembly,
            typeof(DP.Blazor.MapLibre.ProjPlugin.ProjPlugin).Assembly,
            typeof(DP.Blazor.MapLibre.StarfieldPlugin.StarfieldPlugin).Assembly,
            typeof(DP.Blazor.MapLibre.TerraDrawPlugin.TerraDrawPlugin).Assembly,
        };

        assemblies.SelectMany(a => a.GetTypes())
            .Where(t => t is { IsClass: true, IsAbstract: false } && pluginBase.IsAssignableFrom(t))
            .Should().HaveCount(8);
    }
}
