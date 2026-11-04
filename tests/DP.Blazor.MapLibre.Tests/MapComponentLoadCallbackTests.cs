using Bunit;
using DP.Blazor.MapLibre;
using FluentAssertions;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.JSInterop;
using Xunit;

namespace DP.Blazor.MapLibre.Tests;

/// <summary>
/// The map's "load" notification reaches .NET from a JavaScript microtask, which can run before the
/// <c>initializeMap</c> promise delivers the map reference. The component waits for that reference
/// instead of polling the JavaScript side, so a callback arriving in that window still raises OnLoad.
/// </summary>
public class MapComponentLoadCallbackTests
{
    [Fact]
    public async Task Load_Callback_Arriving_Before_The_Map_Reference_Raises_OnLoad()
    {
        var loadCalls = 0;
        var runtime = new LoadRacingJsRuntime();
        using var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        context.Services.AddSingleton<IJSRuntime>(runtime);

        var cut = context.RenderComponent<MapLibre>(parameters => parameters
            .Add(component => component.OnLoad, EventCallback.Factory.Create<EventArgs>(this, _ => loadCalls++)));

        // Deterministic handshake: the module proxy reports when initializeMap is handled (the load
        // notification has been started), the callback task reports when it finished.
        await runtime.InitializeMapEntered;
        runtime.LoadCallback.Should().NotBeNull();
        await runtime.LoadCallback!;

        loadCalls.Should().Be(1);
        cut.Instance.NativeMap.Should().NotBeNull();
    }

    /// <summary>
    /// Serves the component's JavaScript module and, while <c>initializeMap</c> is being handled, invokes the
    /// component's load callback like <c>MapLibre.razor.js</c> does from a microtask - before the map
    /// reference crosses back to .NET.
    /// </summary>
    private sealed class LoadRacingJsRuntime : IJSRuntime
    {
        private readonly TaskCompletionSource _initializeMapEntered =
            new(TaskCreationOptions.RunContinuationsAsynchronously);

        private readonly ModuleProxy _module;

        public LoadRacingJsRuntime() => _module = new ModuleProxy(this);

        public Task InitializeMapEntered => _initializeMapEntered.Task;

        public Task? LoadCallback { get; private set; }

        public ValueTask<TValue> InvokeAsync<TValue>(string identifier, object?[]? args) =>
            InvokeAsync<TValue>(identifier, CancellationToken.None, args);

        /// <summary>Only the module import answers; the map calls go through <see cref="ModuleProxy"/>.</summary>
        public ValueTask<TValue> InvokeAsync<TValue>(
            string identifier,
            CancellationToken cancellationToken,
            object?[]? args) =>
            identifier == "import" && typeof(TValue) == typeof(IJSObjectReference)
                ? ValueTask.FromResult((TValue)(object)_module)
                : ValueTask.FromResult(default(TValue)!);

        internal void HandleInitializeMap(DotNetObjectReference<MapLibre> reference)
        {
            LoadCallback = reference.Value.OnLoadCallback();
            _initializeMapEntered.TrySetResult();
        }

        private sealed class ModuleProxy(LoadRacingJsRuntime owner) : IJSObjectReference
        {
            public ValueTask DisposeAsync() => ValueTask.CompletedTask;

            public ValueTask<TValue> InvokeAsync<TValue>(string identifier, object?[]? args) =>
                InvokeAsync<TValue>(identifier, CancellationToken.None, args);

            public ValueTask<TValue> InvokeAsync<TValue>(
                string identifier,
                CancellationToken cancellationToken,
                object?[]? args)
            {
                if (identifier == "initializeMap" && args?[1] is DotNetObjectReference<MapLibre> reference)
                {
                    owner.HandleInitializeMap(reference);
                }

                return typeof(TValue) == typeof(IJSObjectReference)
                    ? ValueTask.FromResult((TValue)(object)new ModuleProxy(owner))
                    : ValueTask.FromResult(default(TValue)!);
            }
        }
    }
}
