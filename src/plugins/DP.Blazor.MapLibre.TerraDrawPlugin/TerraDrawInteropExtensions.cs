using DP.Blazor.MapLibre.Models.Control;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

/// <summary>
/// The single place that maps C# enum members to the wire strings used by maplibre-gl-terradraw.
/// </summary>
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

    public static string ToWireName(this TerraDrawMeasureUnit unit) =>
        unit switch
        {
            TerraDrawMeasureUnit.Metric => "metric",
            TerraDrawMeasureUnit.Imperial => "imperial",
            _ => throw new ArgumentOutOfRangeException(nameof(unit), unit, null),
        };

    public static string ToWireName(this TerraDrawCostingModel model) =>
        model switch
        {
            TerraDrawCostingModel.Pedestrian => "pedestrian",
            TerraDrawCostingModel.Bicycle => "bicycle",
            TerraDrawCostingModel.Auto => "auto",
            _ => throw new ArgumentOutOfRangeException(nameof(model), model, null),
        };

    public static string ToWireName(this TerraDrawRoutingDistanceUnit unit) =>
        unit switch
        {
            TerraDrawRoutingDistanceUnit.Kilometers => "kilometers",
            TerraDrawRoutingDistanceUnit.Miles => "miles",
            _ => throw new ArgumentOutOfRangeException(nameof(unit), unit, null),
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
