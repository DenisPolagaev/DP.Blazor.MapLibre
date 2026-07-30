using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

/// <summary>
/// Control events emitted by maplibre-gl-terradraw.
/// </summary>
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum TerraDrawEventType
{
    [JsonStringEnumMemberName("mode-changed")]
    ModeChanged,

    [JsonStringEnumMemberName("feature-deleted")]
    FeatureDeleted,

    [JsonStringEnumMemberName("setting-changed")]
    SettingChanged,

    [JsonStringEnumMemberName("expanded")]
    Expanded,

    [JsonStringEnumMemberName("collapsed")]
    Collapsed,
}
