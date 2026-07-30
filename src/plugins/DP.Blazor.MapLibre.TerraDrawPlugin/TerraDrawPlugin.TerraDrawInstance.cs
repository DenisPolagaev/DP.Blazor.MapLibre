using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

public sealed partial class TerraDrawPlugin
{
    public async ValueTask SetModeAsync(string mode, string? controlId = null) =>
        await _pluginJsModule.InvokeVoidAsync("setMode", mode, controlId);

    public async ValueTask<string> GetModeAsync(string? controlId = null) =>
        await _pluginJsModule.InvokeAsync<string>("getMode", controlId);

    public async ValueTask<object[]> GetFeaturesAsync(bool onlySelected = false, string? controlId = null) =>
        await _pluginJsModule.InvokeAsync<object[]>("getFeatures", onlySelected, controlId);

    public async ValueTask<object[]> GetSnapshotAsync(string? controlId = null) =>
        await _pluginJsModule.InvokeAsync<object[]>("getSnapshot", controlId);

    public async ValueTask AddFeaturesAsync(string featuresJson, string? controlId = null) =>
        await _pluginJsModule.InvokeVoidAsync("addFeatures", featuresJson, controlId);

    public async ValueTask RemoveFeaturesAsync(IEnumerable<object> featureIds, string? controlId = null) =>
        await _pluginJsModule.InvokeVoidAsync("removeFeatures", featureIds.ToArray(), controlId);

    public async ValueTask ClearFeaturesAsync(string? controlId = null) =>
        await _pluginJsModule.InvokeVoidAsync("clearFeatures", controlId);

    public async ValueTask StartDrawingAsync(string? controlId = null) =>
        await _pluginJsModule.InvokeVoidAsync("startDrawing", controlId);

    public async ValueTask StopDrawingAsync(string? controlId = null) =>
        await _pluginJsModule.InvokeVoidAsync("stopDrawing", controlId);

    public async ValueTask<bool> IsDrawingEnabledAsync(string? controlId = null) =>
        await _pluginJsModule.InvokeAsync<bool>("isDrawingEnabled", controlId);

    public async ValueTask SelectFeatureAsync(object featureId, string? controlId = null) =>
        await _pluginJsModule.InvokeVoidAsync("selectFeature", featureId, controlId);

    public async ValueTask UpdateModeOptionsAsync(string mode, object options, string? controlId = null) =>
        await _pluginJsModule.InvokeVoidAsync("updateModeOptions", mode, options, controlId);

    public async ValueTask EditTerraDrawFeatureAsync(string featureJson, string mode, string? controlId = null) =>
        await _pluginJsModule.InvokeVoidAsync("editFeature", featureJson, mode, controlId);

    public async ValueTask FinishGeometryAsync() =>
        await _pluginJsModule.InvokeVoidAsync("finishGeometry");

    public async ValueTask DisableMapZoomGesturesAsync() =>
        await _pluginJsModule.InvokeVoidAsync("disableMapZoomGestures");

    public async ValueTask EnableMapZoomGesturesAsync() =>
        await _pluginJsModule.InvokeVoidAsync("enableMapZoomGestures");
}
