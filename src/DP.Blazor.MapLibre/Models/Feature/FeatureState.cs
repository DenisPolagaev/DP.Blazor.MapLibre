using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Feature;

/// <summary>
/// Per-feature runtime state for MapLibre <c>setFeatureState</c> / expressions like
/// <c>["feature-state", "selected"]</c>.
/// </summary>
public sealed class FeatureState : Dictionary<string, object?>
{
    public FeatureState()
        : base(StringComparer.Ordinal)
    {
    }

    public FeatureState(IDictionary<string, object?> values)
        : base(values, StringComparer.Ordinal)
    {
    }

    /// <summary>Common Geoportal selection flag.</summary>
    public static FeatureState Selected(bool selected = true) =>
        new() { ["selected"] = selected };

    public FeatureState With(string key, object? value)
    {
        this[key] = value;
        return this;
    }
}
