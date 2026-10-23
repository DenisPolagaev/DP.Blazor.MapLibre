namespace DP.Blazor.MapLibre.TerraDrawPlugin;

public sealed partial class TerraDrawPlugin
{
    public async ValueTask SetModeAsync(string mode, string? controlId = null) =>
        await CallVoidAsync("setMode", mode, controlId);

    public async ValueTask<string> GetModeAsync(string? controlId = null) =>
        await CallAsync<string>("getMode", controlId);

    public async ValueTask<object[]> GetFeaturesAsync(bool onlySelected = false, string? controlId = null) =>
        await CallAsync<object[]>("getFeatures", onlySelected, controlId);

    public async ValueTask<object[]> GetSnapshotAsync(string? controlId = null) =>
        await CallAsync<object[]>("getSnapshot", controlId);

    public async ValueTask AddFeaturesAsync(string featuresJson, string? controlId = null) =>
        await CallVoidAsync("addFeatures", featuresJson, controlId);

    public async ValueTask RemoveFeaturesAsync(IEnumerable<object> featureIds, string? controlId = null) =>
        await CallVoidAsync("removeFeatures", featureIds.ToArray(), controlId);

    public async ValueTask ClearFeaturesAsync(string? controlId = null) =>
        await CallVoidAsync("clearFeatures", controlId);

    public async ValueTask StartDrawingAsync(string? controlId = null) =>
        await CallVoidAsync("startDrawing", controlId);

    public async ValueTask StopDrawingAsync(string? controlId = null) =>
        await CallVoidAsync("stopDrawing", controlId);

    public async ValueTask<bool> IsDrawingEnabledAsync(string? controlId = null) =>
        await CallAsync<bool>("isDrawingEnabled", controlId);

    public async ValueTask SelectFeatureAsync(object featureId, string? controlId = null) =>
        await CallVoidAsync("selectFeature", featureId, controlId);

    public async ValueTask UpdateModeOptionsAsync(string mode, object options, string? controlId = null) =>
        await CallVoidAsync("updateModeOptions", mode, options, controlId);

    public async ValueTask EditTerraDrawFeatureAsync(string featureJson, string mode, string? controlId = null) =>
        await CallVoidAsync("editFeature", featureJson, mode, controlId);

    /// <summary>
    /// Finishes the current geometry by dispatching a synthetic Enter keyup on the map canvas. The canvas is shared
    /// by all controls of the map, and the API cannot target a control: the active control is used for validation only.
    /// </summary>
    public async ValueTask FinishGeometryAsync() =>
        await CallVoidAsync("finishGeometry");

    /// <summary>Disables double-click zoom and tap-drag zoom. Restored by <see cref="EnableMapZoomGesturesAsync"/>,
    /// when a control is removed, or when the plugin is detached or disposed.</summary>
    public async ValueTask DisableMapZoomGesturesAsync() =>
        await CallVoidAsync("disableMapZoomGestures");

    public async ValueTask EnableMapZoomGesturesAsync() =>
        await CallVoidAsync("enableMapZoomGestures");
}
