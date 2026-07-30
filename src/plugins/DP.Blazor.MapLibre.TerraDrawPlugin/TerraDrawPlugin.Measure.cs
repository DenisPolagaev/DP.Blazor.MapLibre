using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

public sealed partial class TerraDrawPlugin
{
    public async ValueTask<string> GetMeasureUnitTypeAsync(string? controlId = null) =>
        await _pluginJsModule.InvokeAsync<string>("getMeasureUnitType", controlId);

    public async ValueTask SetMeasureUnitTypeAsync(string value, string? controlId = null) =>
        await _pluginJsModule.InvokeVoidAsync("setMeasureUnitType", value, controlId);

    public async ValueTask<int> GetDistancePrecisionAsync(string? controlId = null) =>
        await _pluginJsModule.InvokeAsync<int>("getDistancePrecision", controlId);

    public async ValueTask SetDistancePrecisionAsync(int value, string? controlId = null) =>
        await _pluginJsModule.InvokeVoidAsync("setDistancePrecision", value, controlId);

    public async ValueTask<string?> GetDistanceUnitAsync(string? controlId = null) =>
        await _pluginJsModule.InvokeAsync<string?>("getDistanceUnit", controlId);

    public async ValueTask SetDistanceUnitAsync(string? value, string? controlId = null) =>
        await _pluginJsModule.InvokeVoidAsync("setDistanceUnit", value, controlId);

    public async ValueTask<int> GetAreaPrecisionAsync(string? controlId = null) =>
        await _pluginJsModule.InvokeAsync<int>("getAreaPrecision", controlId);

    public async ValueTask SetAreaPrecisionAsync(int value, string? controlId = null) =>
        await _pluginJsModule.InvokeVoidAsync("setAreaPrecision", value, controlId);

    public async ValueTask<string?> GetAreaUnitAsync(string? controlId = null) =>
        await _pluginJsModule.InvokeAsync<string?>("getAreaUnit", controlId);

    public async ValueTask SetAreaUnitAsync(string? value, string? controlId = null) =>
        await _pluginJsModule.InvokeVoidAsync("setAreaUnit", value, controlId);

    public async ValueTask<Dictionary<string, string>> GetMeasureUnitSymbolsAsync(string? controlId = null) =>
        await _pluginJsModule.InvokeAsync<Dictionary<string, string>>("getMeasureUnitSymbols", controlId);

    public async ValueTask SetMeasureUnitSymbolsAsync(
        Dictionary<string, string> value,
        string? controlId = null) =>
        await _pluginJsModule.InvokeVoidAsync("setMeasureUnitSymbols", value, controlId);

    public async ValueTask<bool> GetComputeElevationAsync(string? controlId = null) =>
        await _pluginJsModule.InvokeAsync<bool>("getComputeElevation", controlId);

    public async ValueTask SetComputeElevationAsync(bool value, string? controlId = null) =>
        await _pluginJsModule.InvokeVoidAsync("setComputeElevation", value, controlId);

    public async ValueTask<string[]> GetFontGlyphsAsync(string? controlId = null) =>
        await _pluginJsModule.InvokeAsync<string[]>("getFontGlyphs", controlId);

    public async ValueTask SetFontGlyphsAsync(IEnumerable<string> fontGlyphs, string? controlId = null) =>
        await _pluginJsModule.InvokeVoidAsync("setFontGlyphs", fontGlyphs.ToArray(), controlId);
}
