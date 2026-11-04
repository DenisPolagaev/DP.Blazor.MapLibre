using Bunit;
using DP.Blazor.MapLibre;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.JSInterop;
using Xunit;

namespace DP.Blazor.MapLibre.Tests;

/// <summary>
/// Component-level plugin wiring: the <see cref="MapLibre.Plugins"/> parameter,
/// <c>UseRegisteredPlugins</c>, rollback of failing plugins and ownership on dispose.
/// </summary>
public class MapComponentPluginTests
{
    public sealed class RecordingPlugin : MapLibrePluginBase
    {
        /// <summary>Most recently created instance, so dependency-injected instances can be inspected.</summary>
        public static RecordingPlugin? LastCreated { get; set; }

        public RecordingPlugin()
            : this(failOnInitialize: false)
        {
        }

        public RecordingPlugin(bool failOnInitialize)
        {
            FailOnInitialize = failOnInitialize;
            LastCreated = this;
        }

        public bool FailOnInitialize { get; }
        public int InitializeCount { get; private set; }
        public int DisposeCount { get; private set; }

        protected override Task OnInitializeAsync(
            IJSObjectReference map,
            IJSRuntime runtime,
            CancellationToken cancellationToken)
        {
            InitializeCount++;
            return FailOnInitialize
                ? Task.FromException(new InvalidOperationException("plugin failure"))
                : Task.CompletedTask;
        }

        protected override ValueTask OnDetachAsync(CancellationToken cancellationToken) => ValueTask.CompletedTask;

        protected override ValueTask OnDisposeAsync()
        {
            DisposeCount++;
            return ValueTask.CompletedTask;
        }
    }

    private static TestContext CreateContext()
    {
        RecordingPlugin.LastCreated = null;

        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        context.Services.AddSingleton<IJSRuntime>(new FakeJsRuntime());
        return context;
    }


    [Fact]
    public void Plugins_Parameter_Is_Initialized_On_First_Render()
    {
        using var context = CreateContext();
        var plugin = new RecordingPlugin();

        var cut = context.RenderComponent<MapLibre>(parameters => parameters
            .Add(component => component.Plugins, new[] { plugin }));

        plugin.InitializeCount.Should().Be(1);
        plugin.IsInitialized.Should().BeTrue();
        cut.Instance.NativeMap.Should().NotBeNull();
    }

    [Fact]
    public void Duplicate_Plugins_Are_Ignored()
    {
        using var context = CreateContext();
        var plugin = new RecordingPlugin();

        context.RenderComponent<MapLibre>(parameters => parameters
            .Add(component => component.Plugins, new[] { plugin, plugin }));

        plugin.InitializeCount.Should().Be(1);
    }

    [Fact]
    public void Failing_Plugin_Is_Removed_And_Disposed_Without_Failing_The_Map()
    {
        using var context = CreateContext();
        var failing = new RecordingPlugin(failOnInitialize: true);
        var healthy = new RecordingPlugin();
        RecordingPlugin.LastCreated = healthy;

        var cut = context.RenderComponent<MapLibre>(parameters => parameters
            .Add(component => component.Plugins, new[] { failing, healthy }));

        failing.InitializeCount.Should().Be(1);
        failing.State.Should().Be(MapLibrePluginLifecycleState.Disposed);
        healthy.InitializeCount.Should().Be(1);
        healthy.IsInitialized.Should().BeTrue();
        cut.Instance.NativeMap.Should().NotBeNull();
    }

    [Fact]
    public async Task RegisterPlugin_After_Render_Initializes_Immediately()
    {
        using var context = CreateContext();
        var cut = context.RenderComponent<MapLibre>();
        var plugin = new RecordingPlugin();

        await cut.Instance.RegisterPlugin(plugin);

        plugin.InitializeCount.Should().Be(1);
        plugin.IsInitialized.Should().BeTrue();
    }

    /// <summary>
    /// Parks the setup loop inside its initialization until the test releases it, and reports that it
    /// is parked: that is the window between "map created" and "plugin queue drained".
    /// </summary>
    public sealed class GatedPlugin : MapLibrePluginBase
    {
        private readonly TaskCompletionSource _entered = new(TaskCreationOptions.RunContinuationsAsynchronously);
        private readonly TaskCompletionSource _release = new(TaskCreationOptions.RunContinuationsAsynchronously);

        public Task Entered => _entered.Task;

        public void Release() => _release.TrySetResult();

        protected override async Task OnInitializeAsync(
            IJSObjectReference map,
            IJSRuntime runtime,
            CancellationToken cancellationToken)
        {
            _entered.TrySetResult();
            await _release.Task;
        }

        protected override ValueTask OnDetachAsync(CancellationToken cancellationToken) => ValueTask.CompletedTask;

        protected override ValueTask OnDisposeAsync() => ValueTask.CompletedTask;
    }

    /// <summary>Signals that the setup loop reached it, i.e. that it has passed every plugin before it.</summary>
    public sealed class SignalPlugin : MapLibrePluginBase
    {
        private readonly TaskCompletionSource _entered = new(TaskCreationOptions.RunContinuationsAsynchronously);

        public Task Entered => _entered.Task;

        protected override Task OnInitializeAsync(
            IJSObjectReference map,
            IJSRuntime runtime,
            CancellationToken cancellationToken)
        {
            _entered.TrySetResult();
            return Task.CompletedTask;
        }

        protected override ValueTask OnDetachAsync(CancellationToken cancellationToken) => ValueTask.CompletedTask;

        protected override ValueTask OnDisposeAsync() => ValueTask.CompletedTask;
    }

    [Fact]
    public async Task RegisterPlugin_During_Setup_Initializes_Immediately()
    {
        using var context = CreateContext();
        var gated = new GatedPlugin();
        var sentinel = new SignalPlugin();
        var cut = context.RenderComponent<MapLibre>(parameters => parameters
            .Add(component => component.Plugins, new IMapLibrePlugin[] { gated, sentinel }));

        // Every step below waits for a signal instead of a deadline: the loop reports entering the gated
        // plugin, and the sentinel reports that the loop has passed it.
        await gated.Entered;

        var plugin = new RecordingPlugin();
        await cut.Instance.RegisterPlugin(plugin);

        // Registered inside the setup window: initialized by the registration itself, not later by the loop.
        plugin.InitializeCount.Should().Be(1);
        plugin.IsInitialized.Should().BeTrue();

        gated.Release();
        await sentinel.Entered;

        // The loop has drained the registry by now and must not initialize the plugin a second time.
        plugin.InitializeCount.Should().Be(1);
    }

    [Fact]
    public async Task Dispose_Disposes_Registered_Plugins()
    {
        using var context = CreateContext();
        var plugin = new RecordingPlugin();
        var cut = context.RenderComponent<MapLibre>(parameters => parameters
            .Add(component => component.Plugins, new[] { plugin }));

        await cut.Instance.DisposeAsync();

        plugin.State.Should().Be(MapLibrePluginLifecycleState.Disposed);
        plugin.DisposeCount.Should().Be(1);
    }

    [Fact]
    public void UseRegisteredPlugins_Creates_One_Instance_Per_Map()
    {
        using var context = CreateContext();
        context.Services.AddMapLibrePlugin<RecordingPlugin>();

        context.RenderComponent<MapLibre>(parameters => parameters
            .Add(component => component.UseRegisteredPlugins, true));

        RecordingPlugin.LastCreated.Should().NotBeNull();
        RecordingPlugin.LastCreated!.InitializeCount.Should().Be(1);
        RecordingPlugin.LastCreated.IsInitialized.Should().BeTrue();

        var registry = context.Services.GetRequiredService<MapLibrePluginRegistry>();
        registry.PluginTypes.Should().ContainSingle().Which.Should().Be(typeof(RecordingPlugin));
    }

    [Fact]
    public async Task UseRegisteredPlugins_Disposes_The_Resolved_Instance_With_The_Map()
    {
        using var context = CreateContext();
        context.Services.AddMapLibrePlugin<RecordingPlugin>();

        var cut = context.RenderComponent<MapLibre>(parameters => parameters
            .Add(component => component.UseRegisteredPlugins, true));

        await cut.Instance.DisposeAsync();

        RecordingPlugin.LastCreated!.State.Should().Be(MapLibrePluginLifecycleState.Disposed);
        RecordingPlugin.LastCreated.DisposeCount.Should().Be(1);
    }

    private sealed class FakeJsRuntime : IJSRuntime
    {
        public ValueTask<TValue> InvokeAsync<TValue>(string identifier, object?[]? args) =>
            InvokeAsync<TValue>(identifier, CancellationToken.None, args);

        public ValueTask<TValue> InvokeAsync<TValue>(
            string identifier,
            CancellationToken cancellationToken,
            object?[]? args) => FakeJsObject.ResultFor<TValue>();
    }

    private sealed class FakeJsObject : IJSObjectReference
    {
        public ValueTask DisposeAsync() => ValueTask.CompletedTask;

        public ValueTask<TValue> InvokeAsync<TValue>(string identifier, object?[]? args) =>
            ResultFor<TValue>();

        public ValueTask<TValue> InvokeAsync<TValue>(
            string identifier,
            CancellationToken cancellationToken,
            object?[]? args) => ResultFor<TValue>();

        /// <summary>Every JS object-returning call gets a new fake object reference.</summary>
        internal static ValueTask<TValue> ResultFor<TValue>() =>
            typeof(TValue) == typeof(IJSObjectReference)
                ? ValueTask.FromResult((TValue)(object)new FakeJsObject())
                : ValueTask.FromResult(default(TValue)!);
    }
}
