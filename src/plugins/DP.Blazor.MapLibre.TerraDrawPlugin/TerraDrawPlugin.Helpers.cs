using System.Text.Json;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

public sealed partial class TerraDrawPlugin
{
    #region Library helpers

    public async ValueTask<JsonElement> GetDefaultControlOptionsAsync() =>
        await CallLibraryAsync<JsonElement>("getDefaultControlOptions");

    public async ValueTask<JsonElement> GetDefaultMeasureControlOptionsAsync() =>
        await CallLibraryAsync<JsonElement>("getDefaultMeasureControlOptions");

    public async ValueTask<JsonElement> GetDefaultValhallaControlOptionsAsync() =>
        await CallLibraryAsync<JsonElement>("getDefaultValhallaControlOptions");

    public async ValueTask<JsonElement> GetDefaultMeasureUnitSymbolsAsync() =>
        await CallLibraryAsync<JsonElement>("getDefaultMeasureUnitSymbols");

    public async ValueTask<JsonElement> GetDefaultModeOptionsAsync() =>
        await CallLibraryAsync<JsonElement>("getDefaultModeOptions");

    public async ValueTask<string[]> GetTerradrawSourceIdsAsync() =>
        await CallLibraryAsync<string[]>("getTerradrawSourceIds");

    public async ValueTask<string[]> GetMeasureSourceIdsAsync() =>
        await CallLibraryAsync<string[]>("getMeasureSourceIds");

    public async ValueTask<string[]> GetValhallaSourceIdsAsync() =>
        await CallLibraryAsync<string[]>("getValhallaSourceIds");

    public async ValueTask<TerrainSource> GetAwsElevationTilesAsync() =>
        await CallLibraryAsync<TerrainSource>("getAwsElevationTiles");

    public async ValueTask<TerrainSource> GetMapterhornTilesAsync() =>
        await CallLibraryAsync<TerrainSource>("getMapterhornTiles");

    public async ValueTask<string> CleanLibraryStyleAsync(
        string styleJson,
        CleanStyleOptions? options = null,
        IList<string>? sourceIds = null,
        string? prefixId = null) =>
        await CallLibraryAsync<string>(
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
        await CallLibraryAsync<string>(
            "calcArea",
            featureJson,
            measureUnitType,
            areaPrecision,
            areaUnit,
            measureUnitSymbols);

    public async ValueTask<string> CalcAreaAsync(
        string featureJson,
        TerraDrawMeasureUnit measureUnitType,
        int areaPrecision,
        string? areaUnit = null,
        Dictionary<string, string>? measureUnitSymbols = null) =>
        await CalcAreaAsync(featureJson, measureUnitType.ToWireName(), areaPrecision, areaUnit, measureUnitSymbols);

    public async ValueTask<string> CalcDistanceAsync(
        string featureJson,
        string measureUnitType,
        int distancePrecision,
        string? distanceUnit = null,
        Dictionary<string, string>? measureUnitSymbols = null) =>
        await CallLibraryAsync<string>(
            "calcDistance",
            featureJson,
            measureUnitType,
            distancePrecision,
            distanceUnit,
            measureUnitSymbols);

    public async ValueTask<string> CalcDistanceAsync(
        string featureJson,
        TerraDrawMeasureUnit measureUnitType,
        int distancePrecision,
        string? distanceUnit = null,
        Dictionary<string, string>? measureUnitSymbols = null) =>
        await CalcDistanceAsync(featureJson, measureUnitType.ToWireName(), distancePrecision, distanceUnit, measureUnitSymbols);

    public async ValueTask<double> ConvertAreaAsync(double valueInSquareMeters, string unit) =>
        await CallLibraryAsync<double>("convertArea", valueInSquareMeters, unit);

    public async ValueTask<double> ConvertDistanceAsync(double valueInMeters, string unit) =>
        await CallLibraryAsync<double>("convertDistance", valueInMeters, unit);

    public async ValueTask<double> ConvertElevationAsync(double valueInMeters, string unit) =>
        await CallLibraryAsync<double>("convertElevation", valueInMeters, unit);

    #endregion
}
