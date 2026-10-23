namespace DP.Blazor.MapLibre.TerraDrawPlugin;

/// <summary>
/// Control events emitted by maplibre-gl-terradraw. The wire names are defined once in
/// <c>TerraDrawInteropExtensions.ToEventName</c>.
/// </summary>
public enum TerraDrawEventType
{
    ModeChanged,
    FeatureDeleted,
    SettingChanged,
    Expanded,
    Collapsed,
}
