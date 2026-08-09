namespace DP.Blazor.MapLibre.Models.Event;

/// <summary>
/// Alias for MapLibre GL JS 6 <c>MapSourceDataEvent</c> / <c>MapStyleDataEvent</c> payloads.
/// Prefer this name in new code; <see cref="MapDataEvent"/> remains for compatibility.
/// </summary>
public class MapSourceDataEvent : MapDataEvent;

/// <summary>
/// Alias for style-data events. Same wire shape as <see cref="MapDataEvent"/>.
/// </summary>
public class MapStyleDataEvent : MapDataEvent;

/// <summary>
/// Alias for MapLibre GL JS 6 <c>MapMovementEvent</c> (move/zoom/rotate/pitch/roll/drag).
/// </summary>
public class MapMovementEvent : MapMoveEvent;

/// <summary>
/// Alias for MapLibre GL JS 6 <c>MapBoxZoomEvent</c> (boxzoom*).
/// </summary>
public class MapBoxZoomEvent : MapZoomEvent;
