using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Event;

public enum EventType
{
    [JsonStringEnumMemberName("click")]
    Click,

    [JsonStringEnumMemberName("contextmenu")]
    ContextMenu,

    [JsonStringEnumMemberName("dblclick")]
    DblClick,

    [JsonStringEnumMemberName("mousedown")]
    MouseDown,

    [JsonStringEnumMemberName("mouseenter")]
    MouseEnter,

    [JsonStringEnumMemberName("mouseleave")]
    MouseLeave,

    [JsonStringEnumMemberName("mousemove")]
    MouseMove,

    [JsonStringEnumMemberName("mouseout")]
    MouseOut,

    [JsonStringEnumMemberName("mouseover")]
    MouseOver,

    [JsonStringEnumMemberName("mouseup")]
    MouseUp,

    [JsonStringEnumMemberName("zoom")]
    Zoom,

    [JsonStringEnumMemberName("zoomstart")]
    ZoomStart,

    [JsonStringEnumMemberName("zoomend")]
    ZoomEnd,

    [JsonStringEnumMemberName("move")]
    Move,

    [JsonStringEnumMemberName("movestart")]
    MoveStart,

    [JsonStringEnumMemberName("moveend")]
    MoveEnd,

    [JsonStringEnumMemberName("drag")]
    Drag,

    [JsonStringEnumMemberName("dragstart")]
    DragStart,

    [JsonStringEnumMemberName("dragend")]
    DragEnd,

    [JsonStringEnumMemberName("rotate")]
    Rotate,

    [JsonStringEnumMemberName("rotatestart")]
    RotateStart,

    [JsonStringEnumMemberName("rotateend")]
    RotateEnd,

    [JsonStringEnumMemberName("pitch")]
    Pitch,

    [JsonStringEnumMemberName("pitchstart")]
    PitchStart,

    [JsonStringEnumMemberName("pitchend")]
    PitchEnd,

    [JsonStringEnumMemberName("roll")]
    Roll,

    [JsonStringEnumMemberName("rollstart")]
    RollStart,

    [JsonStringEnumMemberName("rollend")]
    RollEnd,

    [JsonStringEnumMemberName("load")]
    Load,

    [JsonStringEnumMemberName("idle")]
    Idle,

    [JsonStringEnumMemberName("remove")]
    Remove,

    [JsonStringEnumMemberName("render")]
    Render,

    [JsonStringEnumMemberName("resize")]
    Resize,

    [JsonStringEnumMemberName("error")]
    Error,

    [JsonStringEnumMemberName("style.load")]
    StyleLoad,

    [JsonStringEnumMemberName("styledata")]
    StyleData,

    [JsonStringEnumMemberName("styledataloading")]
    StyleDataLoading,

    [JsonStringEnumMemberName("sourcedata")]
    SourceData,

    [JsonStringEnumMemberName("sourcedataloading")]
    SourceDataLoading,

    [JsonStringEnumMemberName("sourcedataabort")]
    SourceDataAbort,

    [JsonStringEnumMemberName("dataloading")]
    DataLoading,

    [JsonStringEnumMemberName("data")]
    Data,

    [JsonStringEnumMemberName("dataabort")]
    DataAbort,

    [JsonStringEnumMemberName("styleimagemissing")]
    StyleImageMissing,

    [JsonStringEnumMemberName("touchstart")]
    TouchStart,

    [JsonStringEnumMemberName("touchend")]
    TouchEnd,

    [JsonStringEnumMemberName("touchmove")]
    TouchMove,

    [JsonStringEnumMemberName("touchcancel")]
    TouchCancel,

    [JsonStringEnumMemberName("wheel")]
    Wheel,

    [JsonStringEnumMemberName("boxzoomstart")]
    BoxZoomStart,

    [JsonStringEnumMemberName("boxzoomend")]
    BoxZoomEnd,

    [JsonStringEnumMemberName("boxzoomcancel")]
    BoxZoomCancel,

    [JsonStringEnumMemberName("webglcontextlost")]
    WebGlContextLost,

    [JsonStringEnumMemberName("webglcontextrestored")]
    WebGlContextRestored,

    [JsonStringEnumMemberName("cooperativegestureprevented")]
    CooperativeGesturePrevented,

    [JsonStringEnumMemberName("projectiontransition")]
    ProjectionTransition,

    [JsonStringEnumMemberName("terrain")]
    Terrain,

    [JsonStringEnumMemberName("open")]
    Open,

    [JsonStringEnumMemberName("close")]
    Close,
}
