using DP.Blazor.MapLibre.Models.Control;
using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

public sealed partial class TerraDrawPlugin
{
    public async ValueTask<string> AddDrawControlAsync(
        TerradrawControlOptions? options = null,
        ControlPosition position = ControlPosition.TopLeft,
        string? controlId = null) =>
        await AddControlInternalAsync(TerraDrawControlType.Draw, options, position, controlId);

    public async ValueTask<string> AddMeasureControlAsync(
        MeasureControlOptions? options = null,
        ControlPosition position = ControlPosition.TopLeft,
        string? controlId = null) =>
        await AddControlInternalAsync(TerraDrawControlType.Measure, options, position, controlId);

    public async ValueTask<string> AddValhallaControlAsync(
        ValhallaControlOptions? options = null,
        ControlPosition position = ControlPosition.TopLeft,
        string? controlId = null) =>
        await AddControlInternalAsync(TerraDrawControlType.Valhalla, options, position, controlId);

    public async ValueTask SetActiveControlAsync(string controlId) =>
        await _pluginJsModule.InvokeVoidAsync("setActiveControl", controlId);

    public async ValueTask<string?> GetActiveControlIdAsync() =>
        await _pluginJsModule.InvokeAsync<string?>("getActiveControlId");

    public async ValueTask<string[]> GetControlIdsAsync() =>
        await _pluginJsModule.InvokeAsync<string[]>("getControlIds");

    public async ValueTask<string> GetControlTypeAsync(string? controlId = null) =>
        await _pluginJsModule.InvokeAsync<string>("getControlType", controlId);

    public async ValueTask RemoveControlAsync(string? controlId = null) =>
        await _pluginJsModule.InvokeVoidAsync("removeControl", controlId);

    public async ValueTask RemoveAllControlsAsync() =>
        await _pluginJsModule.InvokeVoidAsync("removeAllControls");

    public async ValueTask ActivateControlAsync(string? controlId = null) =>
        await _pluginJsModule.InvokeVoidAsync("activateControl", controlId);

    public async ValueTask DeactivateControlAsync(string? controlId = null) =>
        await _pluginJsModule.InvokeVoidAsync("deactivateControl", controlId);

    public async ValueTask SetControlExpandedAsync(bool expanded, string? controlId = null) =>
        await _pluginJsModule.InvokeVoidAsync("setControlExpanded", expanded, controlId);

    public async ValueTask<bool> GetControlExpandedAsync(string? controlId = null) =>
        await _pluginJsModule.InvokeAsync<bool>("getControlExpanded", controlId);

    public async ValueTask SetShowDeleteConfirmationAsync(bool value, string? controlId = null) =>
        await _pluginJsModule.InvokeVoidAsync("setShowDeleteConfirmation", value, controlId);

    public async ValueTask<bool> GetShowDeleteConfirmationAsync(string? controlId = null) =>
        await _pluginJsModule.InvokeAsync<bool>("getShowDeleteConfirmation", controlId);

    public async ValueTask ResetActiveModeAsync(string? controlId = null) =>
        await _pluginJsModule.InvokeVoidAsync("resetActiveMode", controlId);

    public async ValueTask RecalcAsync(string? controlId = null) =>
        await _pluginJsModule.InvokeVoidAsync("recalc", controlId);

    public async ValueTask<string> CleanControlStyleAsync(
        string styleJson,
        CleanStyleOptions? options = null,
        string? controlId = null) =>
        await _pluginJsModule.InvokeAsync<string>("cleanControlStyle", styleJson, options, controlId);

    private async ValueTask<string> AddControlInternalAsync(
        TerraDrawControlType controlType,
        object? options,
        ControlPosition position,
        string? controlId)
    {
        return await _pluginJsModule.InvokeAsync<string>(
            "addControl",
            controlType.ToControlName(),
            options,
            TerraDrawInteropExtensions.ToControlPosition(position),
            controlId);
    }
}
