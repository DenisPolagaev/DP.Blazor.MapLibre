using DP.Blazor.MapLibre.Models.Control;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

public sealed partial class TerraDrawPlugin
{
    #region Public API

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
        await CallVoidAsync("setActiveControl", controlId);

    public async ValueTask<string?> GetActiveControlIdAsync() =>
        await CallAsync<string?>("getActiveControlId");

    public async ValueTask<string[]> GetControlIdsAsync() =>
        await CallAsync<string[]>("getControlIds");

    public async ValueTask<string> GetControlTypeAsync(string? controlId = null) =>
        await CallAsync<string>("getControlType", controlId);

    public async ValueTask RemoveControlAsync(string? controlId = null)
    {
        EnsureInitialized();
        var id = controlId ?? await CallAsync<string?>("getActiveControlId");
        try
        {
            // JavaScript removes the control's listeners first; the .NET references follow in finally.
            await CallVoidAsync("removeControl", id);
        }
        finally
        {
            if (id is not null)
            {
                ReleaseListeners(registration => registration.ControlId == id);
            }
        }

        var remaining = await CallAsync<string[]>("getControlIds");
        if (remaining.Length == 0)
        {
            MarkDetached();
        }
    }

    public async ValueTask RemoveAllControlsAsync()
    {
        EnsureInitialized();
        try
        {
            await CallVoidAsync("removeAllControls");
        }
        finally
        {
            ReleaseListeners(_ => true);
        }

        MarkDetached();
    }

    public async ValueTask ActivateControlAsync(string? controlId = null) =>
        await CallVoidAsync("activateControl", controlId);

    public async ValueTask DeactivateControlAsync(string? controlId = null) =>
        await CallVoidAsync("deactivateControl", controlId);

    public async ValueTask SetControlExpandedAsync(bool expanded, string? controlId = null) =>
        await CallVoidAsync("setControlExpanded", expanded, controlId);

    public async ValueTask<bool> GetControlExpandedAsync(string? controlId = null) =>
        await CallAsync<bool>("getControlExpanded", controlId);

    public async ValueTask SetShowDeleteConfirmationAsync(bool value, string? controlId = null) =>
        await CallVoidAsync("setShowDeleteConfirmation", value, controlId);

    public async ValueTask<bool> GetShowDeleteConfirmationAsync(string? controlId = null) =>
        await CallAsync<bool>("getShowDeleteConfirmation", controlId);

    public async ValueTask ResetActiveModeAsync(string? controlId = null) =>
        await CallVoidAsync("resetActiveMode", controlId);

    public async ValueTask RecalcAsync(string? controlId = null) =>
        await CallVoidAsync("recalc", controlId);

    public async ValueTask<string> CleanControlStyleAsync(
        string styleJson,
        CleanStyleOptions? options = null,
        string? controlId = null) =>
        await CallAsync<string>("cleanControlStyle", styleJson, options, controlId);

    #endregion

    #region Private Helpers

    private async ValueTask<string> AddControlInternalAsync(
        TerraDrawControlType controlType,
        object? options,
        ControlPosition position,
        string? controlId)
    {
        EnsureInitialized();
        var id = await CallAsync<string>(
            "addControl",
            controlType.ToControlName(),
            options,
            TerraDrawInteropExtensions.ToControlPosition(position),
            controlId);

        // addControl replaces a control with the same id, which removes that control's JavaScript listeners.
        ReleaseListeners(registration => registration.ControlId == id);
        MarkAttached();
        return id;
    }

    #endregion
}
