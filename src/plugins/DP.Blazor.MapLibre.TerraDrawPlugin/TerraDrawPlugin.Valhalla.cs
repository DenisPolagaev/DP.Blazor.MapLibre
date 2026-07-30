using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

public sealed partial class TerraDrawPlugin
{
    public async ValueTask<string> GetValhallaUrlAsync(string? controlId = null) =>
        await _pluginJsModule.InvokeAsync<string>("getValhallaUrl", controlId);

    public async ValueTask SetValhallaUrlAsync(string value, string? controlId = null) =>
        await _pluginJsModule.InvokeVoidAsync("setValhallaUrl", value, controlId);

    public async ValueTask<string> GetRoutingCostingModelAsync(string? controlId = null) =>
        await _pluginJsModule.InvokeAsync<string>("getRoutingCostingModel", controlId);

    public async ValueTask SetRoutingCostingModelAsync(string value, string? controlId = null) =>
        await _pluginJsModule.InvokeVoidAsync("setRoutingCostingModel", value, controlId);

    public async ValueTask<string> GetRoutingDistanceUnitAsync(string? controlId = null) =>
        await _pluginJsModule.InvokeAsync<string>("getRoutingDistanceUnit", controlId);

    public async ValueTask SetRoutingDistanceUnitAsync(string value, string? controlId = null) =>
        await _pluginJsModule.InvokeVoidAsync("setRoutingDistanceUnit", value, controlId);

    public async ValueTask<string> GetTimeIsochroneCostingModelAsync(string? controlId = null) =>
        await _pluginJsModule.InvokeAsync<string>("getTimeIsochroneCostingModel", controlId);

    public async ValueTask SetTimeIsochroneCostingModelAsync(string value, string? controlId = null) =>
        await _pluginJsModule.InvokeVoidAsync("setTimeIsochroneCostingModel", value, controlId);

    public async ValueTask<string> GetDistanceIsochroneCostingModelAsync(string? controlId = null) =>
        await _pluginJsModule.InvokeAsync<string>("getDistanceIsochroneCostingModel", controlId);

    public async ValueTask SetDistanceIsochroneCostingModelAsync(string value, string? controlId = null) =>
        await _pluginJsModule.InvokeVoidAsync("setDistanceIsochroneCostingModel", value, controlId);

    public async ValueTask<ValhallaContour[]> GetIsochroneContoursAsync(string? controlId = null) =>
        await _pluginJsModule.InvokeAsync<ValhallaContour[]>("getIsochroneContours", controlId);

    public async ValueTask SetIsochroneContoursAsync(
        IEnumerable<ValhallaContour> contours,
        string? controlId = null) =>
        await _pluginJsModule.InvokeVoidAsync("setIsochroneContours", contours.ToArray(), controlId);
}
