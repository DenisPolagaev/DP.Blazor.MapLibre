namespace DP.Blazor.MapLibre.Models.Event;

/// <summary>
/// MapLibre GL JS map event name constants (see MapEventType).
/// </summary>
public static class MapEventNames
{
    public const string Load = "load";
    public const string Idle = "idle";
    public const string Remove = "remove";
    public const string Render = "render";
    public const string Resize = "resize";
    public const string Error = "error";

    public const string StyleLoad = "style.load";
    public const string StyleData = "styledata";
    public const string StyleDataLoading = "styledataloading";
    public const string SourceData = "sourcedata";
    public const string SourceDataLoading = "sourcedataloading";
    public const string SourceDataAbort = "sourcedataabort";
    public const string DataLoading = "dataloading";
    public const string Data = "data";
    public const string DataAbort = "dataabort";
    public const string StyleImageMissing = "styleimagemissing";

    public const string MoveStart = "movestart";
    public const string Move = "move";
    public const string MoveEnd = "moveend";
    public const string DragStart = "dragstart";
    public const string Drag = "drag";
    public const string DragEnd = "dragend";
    public const string ZoomStart = "zoomstart";
    public const string Zoom = "zoom";
    public const string ZoomEnd = "zoomend";
    public const string RotateStart = "rotatestart";
    public const string Rotate = "rotate";
    public const string RotateEnd = "rotateend";
    public const string PitchStart = "pitchstart";
    public const string Pitch = "pitch";
    public const string PitchEnd = "pitchend";
    public const string RollStart = "rollstart";
    public const string Roll = "roll";
    public const string RollEnd = "rollend";

    public const string Click = "click";
    public const string ContextMenu = "contextmenu";
    public const string DblClick = "dblclick";
    public const string MouseDown = "mousedown";
    public const string MouseUp = "mouseup";
    public const string MouseMove = "mousemove";
    public const string MouseOver = "mouseover";
    public const string MouseOut = "mouseout";
    public const string MouseEnter = "mouseenter";
    public const string MouseLeave = "mouseleave";

    public const string TouchStart = "touchstart";
    public const string TouchEnd = "touchend";
    public const string TouchMove = "touchmove";
    public const string TouchCancel = "touchcancel";

    public const string Wheel = "wheel";
    public const string BoxZoomStart = "boxzoomstart";
    public const string BoxZoomEnd = "boxzoomend";
    public const string BoxZoomCancel = "boxzoomcancel";

    public const string WebGlContextLost = "webglcontextlost";
    public const string WebGlContextRestored = "webglcontextrestored";

    public const string CooperativeGesturePrevented = "cooperativegestureprevented";
    public const string ProjectionTransition = "projectiontransition";
    public const string Terrain = "terrain";
}
