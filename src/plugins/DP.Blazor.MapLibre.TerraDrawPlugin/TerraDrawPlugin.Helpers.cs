using System.Text.Json;
using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

public sealed partial class TerraDrawPlugin
{
    public async ValueTask<JsonElement> GetDefaultControlOptionsAsync() =>
        await _pluginJsModule.InvokeAsync<JsonElement>("getDefaultControlOptions");

    public async ValueTask<JsonElement> GetDefaultMeasureControlOptionsAsync() =>
        await _pluginJsModule.InvokeAsync<JsonElement>("getDefaultMeasureControlOptions");

    public async ValueTask<JsonElement> GetDefaultValhallaControlOptionsAsync() =>
        await _pluginJsModule.InvokeAsync<JsonElement>("getDefaultValhallaControlOptions");

    public async ValueTask<JsonElement> GetDefaultMeasureUnitSymbolsAsync() =>
        await _pluginJsModule.InvokeAsync<JsonElement>("getDefaultMeasureUnitSymbols");

    public async ValueTask<JsonElement> GetDefaultModeOptionsAsync() =>
        await _pluginJsModule.InvokeAsync<JsonElement>("getDefaultModeOptions");

    public async ValueTask<string[]> GetTerradrawSourceIdsAsync() =>
        await _pluginJsModule.InvokeAsync<string[]>("getTerradrawSourceIds");

    public async ValueTask<string[]> GetMeasureSourceIdsAsync() =>
        await _pluginJsModule.InvokeAsync<string[]>("getMeasureSourceIds");

    public async ValueTask<string[]> GetValhallaSourceIdsAsync() =>
        await _pluginJsModule.InvokeAsync<string[]>("getValhallaSourceIds");

    public async ValueTask<TerrainSource> GetAwsElevationTilesAsync() =>
        await _pluginJsModule.InvokeAsync<TerrainSource>("getAwsElevationTiles");

    public async ValueTask<TerrainSource> GetMapterhornTilesAsync() =>
        await _pluginJsModule.InvokeAsync<TerrainSource>("getMapterhornTiles");

    public async ValueTask<string> CleanLibraryStyleAsync(
        string styleJson,
        CleanStyleOptions? options = null,
        IList<string>? sourceIds = null,
        string? prefixId = null) =>
        await _pluginJsModule.InvokeAsync<string>(
            "cleanLibraryStyle",
            styleJson,
            options,
            sourceIds?.ToArray(),
            prefixId);

    public async ValueTask<string> CalcAreaAsync(
        string featureJson,
        string measureUnitType,
        int areaPrecision,
        string? areaUnit = null,
        Dictionary<string, string>? measureUnitSymbols = null) =>
        await _pluginJsModule.InvokeAsync<string>(
            "calcArea",
            featureJson,
            measureUnitType,
            areaPrecision,
            areaUnit,
            measureUnitSymbols);

    public async ValueTask<string> CalcDistanceAsync(
        string featureJson,
        string measureUnitType,
        int distancePrecision,
        string? distanceUnit = null,
        Dictionary<string, string>? measureUnitSymbols = null) =>
        await _pluginJsModule.InvokeAsync<string>(
            "calcDistance",
            featureJson,
            measureUnitType,
            distancePrecision,
            distanceUnit,
            measureUnitSymbols);

    public async ValueTask<double> ConvertAreaAsync(double valueInSquareMeters, string unit) =>
        await _pluginJsModule.InvokeAsync<double>("convertArea", valueInSquareMeters, unit);

    public async ValueTask<double> ConvertDistanceAsync(double valueInMeters, string unit) =>
        await _pluginJsModule.InvokeAsync<double>("convertDistance", valueInMeters, unit);

    public async ValueTask<double> ConvertElevationAsync(double valueInMeters, string unit) =>
        await _pluginJsModule.InvokeAsync<double>("convertElevation", valueInMeters, unit);
}
