using DP.Blazor.MapLibre;
using Microsoft.JSInterop;
using Xunit;

namespace DP.Blazor.MapLibre.Tests;

public class PluginLifecycleTests
{
    [Fact]
    public async Task Dispose_BeforeInitialize_IsIdempotent()
    {
        var plugin = new FakeLifecyclePlugin();

        await plugin.DisposeAsync();
        await plugin.DisposeAsync();

        Assert.Equal(MapLibrePluginLifecycleState.Disposed, plugin.State);
        Assert.Equal(0, plugin.InitializeCount);
        Assert.Equal(0, plugin.DetachCount);
        Assert.Equal(1, plugin.DisposeCount);
    }

    [Fact]
    public async Task Initialize_IsIdempotent_WhileInitialized()
    {
        var plugin = new FakeLifecyclePlugin();
        var map = new FakeJsObject();
        var runtime = new FakeJsRuntime();

        await plugin.InitializeAsync(map, runtime);
        await plugin.InitializeAsync(map, runtime);

        Assert.Equal(MapLibrePluginLifecycleState.Initialized, plugin.State);
        Assert.Equal(1, plugin.InitializeCount);
    }

    [Fact]
    public async Task Detach_BeforeAttach_IsNoOp()
    {
        var plugin = new FakeLifecyclePlugin();
        await plugin.InitializeAsync(new FakeJsObject(), new FakeJsRuntime());

        await plugin.DetachAsync();

        Assert.Equal(MapLibrePluginLifecycleState.Initialized, plugin.State);
        Assert.Equal(0, plugin.DetachCount);
    }

    [Fact]
    public async Task Detach_ThenDispose_RunsInOrder()
    {
        var plugin = new FakeLifecyclePlugin();
        await plugin.InitializeAsync(new FakeJsObject(), new FakeJsRuntime());
        plugin.AttachForTest();

        await plugin.DetachAsync();
        Assert.Equal(MapLibrePluginLifecycleState.Initialized, plugin.State);
        Assert.Equal(1, plugin.DetachCount);

        await plugin.DisposeAsync();
        Assert.Equal(MapLibrePluginLifecycleState.Disposed, plugin.State);
        Assert.Equal(1, plugin.DisposeCount);
        Assert.Equal(1, plugin.DetachCount);
    }

    [Fact]
    public async Task Dispose_WhileAttached_DetachesFirst()
    {
        var plugin = new FakeLifecyclePlugin();
        await plugin.InitializeAsync(new FakeJsObject(), new FakeJsRuntime());
        plugin.AttachForTest();

        await plugin.DisposeAsync();

        Assert.Equal(MapLibrePluginLifecycleState.Disposed, plugin.State);
        Assert.Equal(1, plugin.DetachCount);
        Assert.Equal(1, plugin.DisposeCount);
        Assert.True(plugin.DetachBeforeDispose);
    }

    private sealed class FakeLifecyclePlugin : MapLibrePluginBase
    {
        public int InitializeCount { get; private set; }
        public int DetachCount { get; private set; }
        public int DisposeCount { get; private set; }
        public bool DetachBeforeDispose { get; private set; }

        public void AttachForTest() => MarkAttached();

        protected override Task OnInitializeAsync(
            IJSObjectReference map,
            IJSRuntime runtime,
            CancellationToken cancellationToken)
        {
            InitializeCount++;
            return Task.CompletedTask;
        }

        protected override ValueTask OnDetachAsync(CancellationToken cancellationToken)
        {
            DetachCount++;
            if (DisposeCount == 0)
            {
                DetachBeforeDispose = true;
            }

            return ValueTask.CompletedTask;
        }

        protected override ValueTask OnDisposeAsync()
        {
            DisposeCount++;
            return ValueTask.CompletedTask;
        }
    }

    private sealed class FakeJsObject : IJSObjectReference
    {
        public ValueTask DisposeAsync() => ValueTask.CompletedTask;

        public ValueTask<TValue> InvokeAsync<TValue>(string identifier, object?[]? args) =>
            throw new NotSupportedException();

        public ValueTask<TValue> InvokeAsync<TValue>(string identifier, CancellationToken cancellationToken, object?[]? args) =>
            throw new NotSupportedException();
    }

    private sealed class FakeJsRuntime : IJSRuntime
    {
        public ValueTask<TValue> InvokeAsync<TValue>(string identifier, object?[]? args) =>
            throw new NotSupportedException();

        public ValueTask<TValue> InvokeAsync<TValue>(string identifier, CancellationToken cancellationToken, object?[]? args) =>
            throw new NotSupportedException();
    }
}
