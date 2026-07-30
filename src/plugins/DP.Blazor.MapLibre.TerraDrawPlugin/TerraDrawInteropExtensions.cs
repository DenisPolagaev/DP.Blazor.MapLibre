using DP.Blazor.MapLibre.Models.Control;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

internal static class TerraDrawInteropExtensions
{
    public static string ToControlName(this TerraDrawControlType controlType) =>
        controlType switch
        {
            TerraDrawControlType.Measure => "measure",
            TerraDrawControlType.Valhalla => "valhalla",
            _ => "draw",
        };

    public static string ToEventName(this TerraDrawEventType eventType) =>
        eventType switch
        {
            TerraDrawEventType.ModeChanged => "mode-changed",
            TerraDrawEventType.FeatureDeleted => "feature-deleted",
            TerraDrawEventType.SettingChanged => "setting-changed",
            TerraDrawEventType.Expanded => "expanded",
            TerraDrawEventType.Collapsed => "collapsed",
            _ => throw new ArgumentOutOfRangeException(nameof(eventType), eventType, null),
        };

    public static string ToEventName(this TerraDrawInstanceEventType eventType) =>
        eventType switch
        {
            TerraDrawInstanceEventType.Change => "change",
            TerraDrawInstanceEventType.Finish => "finish",
            TerraDrawInstanceEventType.Select => "select",
            TerraDrawInstanceEventType.Deselect => "deselect",
            _ => throw new ArgumentOutOfRangeException(nameof(eventType), eventType, null),
        };

    public static string ToControlPosition(ControlPosition position) =>
        position switch
        {
            ControlPosition.TopLeft => "top-left",
            ControlPosition.TopRight => "top-right",
            ControlPosition.BottomLeft => "bottom-left",
            ControlPosition.BottomRight => "bottom-right",
            _ => "top-left",
        };
}
