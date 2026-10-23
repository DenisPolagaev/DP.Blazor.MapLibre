using Microsoft.Extensions.DependencyInjection;

namespace DP.Blazor.MapLibre;

/// <summary>
/// Plugin types registered in the dependency injection container. The <see cref="MapLibre"/> component creates
/// one instance of each type per map when <see cref="MapLibre.UseRegisteredPlugins"/> is enabled.
/// </summary>
public sealed class MapLibrePluginRegistry
{
    private readonly List<Type> _pluginTypes = [];

    /// <summary>Registered plugin types, in registration order.</summary>
    public IReadOnlyList<Type> PluginTypes => _pluginTypes;

    internal void Add(Type pluginType)
    {
        if (!_pluginTypes.Contains(pluginType))
        {
            _pluginTypes.Add(pluginType);
        }
    }
}

/// <summary>
/// Registration helpers for MapLibre plugins.
/// </summary>
public static class MapLibreServiceCollectionExtensions
{
    /// <summary>
    /// Registers a plugin type so that maps with <see cref="MapLibre.UseRegisteredPlugins"/> enabled create and
    /// register an instance of it. Plugins are stateful and bound to a single map, so each map gets its own
    /// instance; the plugin type is registered as transient and resolved from a scope owned by that map.
    /// </summary>
    /// <typeparam name="TPlugin">The plugin type.</typeparam>
    public static IServiceCollection AddMapLibrePlugin<TPlugin>(this IServiceCollection services)
        where TPlugin : class, IMapLibrePlugin
    {
        ArgumentNullException.ThrowIfNull(services);

        services.AddTransient<TPlugin>();

        var registry = services
            .LastOrDefault(d => d.ServiceType == typeof(MapLibrePluginRegistry))?
            .ImplementationInstance as MapLibrePluginRegistry;

        if (registry is null)
        {
            registry = new MapLibrePluginRegistry();
            services.AddSingleton(registry);
        }

        registry.Add(typeof(TPlugin));
        return services;
    }
}
