namespace DP.Blazor.MapLibre.TerraDrawPlugin;

public sealed partial class TerraDrawPlugin
{
    public async ValueTask<string> GetMeasureUnitTypeAsync(string? controlId = null) =>
        await CallAsync<string>("getMeasureUnitType", controlId);

    public async ValueTask SetMeasureUnitTypeAsync(string value, string? controlId = null) =>
        await CallVoidAsync("setMeasureUnitType", value, controlId);

    public async ValueTask SetMeasureUnitTypeAsync(TerraDrawMeasureUnit value, string? controlId = null) =>
        await SetMeasureUnitTypeAsync(value.ToWireName(), controlId);

    public async ValueTask<int> GetDistancePrecisionAsync(string? controlId = null) =>
        await CallAsync<int>("getDistancePrecision", controlId);

    public async ValueTask SetDistancePrecisionAsync(int value, string? controlId = null) =>
        await CallVoidAsync("setDistancePrecision", value, controlId);

    public async ValueTask<string?> GetDistanceUnitAsync(string? controlId = null) =>
        await CallAsync<string?>("getDistanceUnit", controlId);

    public async ValueTask SetDistanceUnitAsync(string? value, string? controlId = null) =>
        await CallVoidAsync("setDistanceUnit", value, controlId);

    public async ValueTask<int> GetAreaPrecisionAsync(string? controlId = null) =>
        await CallAsync<int>("getAreaPrecision", controlId);

    public async ValueTask SetAreaPrecisionAsync(int value, string? controlId = null) =>
        await CallVoidAsync("setAreaPrecision", value, controlId);

    public async ValueTask<string?> GetAreaUnitAsync(string? controlId = null) =>
        await CallAsync<string?>("getAreaUnit", controlId);

    public async ValueTask SetAreaUnitAsync(string? value, string? controlId = null) =>
        await CallVoidAsync("setAreaUnit", value, controlId);

    public async ValueTask<Dictionary<string, string>> GetMeasureUnitSymbolsAsync(string? controlId = null) =>
        await CallAsync<Dictionary<string, string>>("getMeasureUnitSymbols", controlId);

    public async ValueTask SetMeasureUnitSymbolsAsync(
        Dictionary<string, string> value,
        string? controlId = null) =>
        await CallVoidAsync("setMeasureUnitSymbols", value, controlId);

    public async ValueTask<bool> GetComputeElevationAsync(string? controlId = null) =>
        await CallAsync<bool>("getComputeElevation", controlId);

    public async ValueTask SetComputeElevationAsync(bool value, string? controlId = null) =>
        await CallVoidAsync("setComputeElevation", value, controlId);

    public async ValueTask<string[]> GetFontGlyphsAsync(string? controlId = null) =>
        await CallAsync<string[]>("getFontGlyphs", controlId);

    public async ValueTask SetFontGlyphsAsync(IEnumerable<string> fontGlyphs, string? controlId = null) =>
        await CallVoidAsync("setFontGlyphs", fontGlyphs.ToArray(), controlId);
}
