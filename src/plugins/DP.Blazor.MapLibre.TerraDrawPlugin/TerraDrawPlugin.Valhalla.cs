namespace DP.Blazor.MapLibre.TerraDrawPlugin;

public sealed partial class TerraDrawPlugin
{
    public async ValueTask<string> GetValhallaUrlAsync(string? controlId = null) =>
        await CallAsync<string>("getValhallaUrl", controlId);

    public async ValueTask SetValhallaUrlAsync(string value, string? controlId = null) =>
        await CallVoidAsync("setValhallaUrl", value, controlId);

    public async ValueTask<string> GetRoutingCostingModelAsync(string? controlId = null) =>
        await CallAsync<string>("getRoutingCostingModel", controlId);

    public async ValueTask SetRoutingCostingModelAsync(string value, string? controlId = null) =>
        await CallVoidAsync("setRoutingCostingModel", value, controlId);

    public async ValueTask SetRoutingCostingModelAsync(TerraDrawCostingModel value, string? controlId = null) =>
        await SetRoutingCostingModelAsync(value.ToWireName(), controlId);

    public async ValueTask<string> GetRoutingDistanceUnitAsync(string? controlId = null) =>
        await CallAsync<string>("getRoutingDistanceUnit", controlId);

    public async ValueTask SetRoutingDistanceUnitAsync(string value, string? controlId = null) =>
        await CallVoidAsync("setRoutingDistanceUnit", value, controlId);

    public async ValueTask SetRoutingDistanceUnitAsync(TerraDrawRoutingDistanceUnit value, string? controlId = null) =>
        await SetRoutingDistanceUnitAsync(value.ToWireName(), controlId);

    public async ValueTask<string> GetTimeIsochroneCostingModelAsync(string? controlId = null) =>
        await CallAsync<string>("getTimeIsochroneCostingModel", controlId);

    public async ValueTask SetTimeIsochroneCostingModelAsync(string value, string? controlId = null) =>
        await CallVoidAsync("setTimeIsochroneCostingModel", value, controlId);

    public async ValueTask SetTimeIsochroneCostingModelAsync(TerraDrawCostingModel value, string? controlId = null) =>
        await SetTimeIsochroneCostingModelAsync(value.ToWireName(), controlId);

    public async ValueTask<string> GetDistanceIsochroneCostingModelAsync(string? controlId = null) =>
        await CallAsync<string>("getDistanceIsochroneCostingModel", controlId);

    public async ValueTask SetDistanceIsochroneCostingModelAsync(string value, string? controlId = null) =>
        await CallVoidAsync("setDistanceIsochroneCostingModel", value, controlId);

    public async ValueTask SetDistanceIsochroneCostingModelAsync(TerraDrawCostingModel value, string? controlId = null) =>
        await SetDistanceIsochroneCostingModelAsync(value.ToWireName(), controlId);

    public async ValueTask<ValhallaContour[]> GetIsochroneContoursAsync(string? controlId = null) =>
        await CallAsync<ValhallaContour[]>("getIsochroneContours", controlId);

    public async ValueTask SetIsochroneContoursAsync(
        IEnumerable<ValhallaContour> contours,
        string? controlId = null) =>
        await CallVoidAsync("setIsochroneContours", contours.ToArray(), controlId);
}
