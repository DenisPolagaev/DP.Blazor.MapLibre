using DP.Blazor.MapLibre.Examples;
using DP.Blazor.MapLibre.Examples.Examples;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;

var builder = WebAssemblyHostBuilder.CreateDefault(args);

builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

// Register custom elements for the MapLibre examples
builder.RootComponents.RegisterCustomElement<AddMarker>("add-marker");
builder.RootComponents.RegisterCustomElement<AddListener>("add-listener");
builder.RootComponents.RegisterCustomElement<AddPopup>("add-popup");
builder.RootComponents.RegisterCustomElement<FitBounds>("fit-bounds");
builder.RootComponents.RegisterCustomElement<LoadGeoJson>("load-geojson");
builder.RootComponents.RegisterCustomElement<MapboxGlDraw>("mapbox-gl-draw");
builder.RootComponents.RegisterCustomElement<TerraDraw>("terra-draw");
builder.RootComponents.RegisterCustomElement<MapCompare>("map-compare");
builder.RootComponents.RegisterCustomElement<MultipleMaps>("multiple-maps");
builder.RootComponents.RegisterCustomElement<RenderGlobe>("render-globe");
builder.RootComponents.RegisterCustomElement<UpdateGeoJsonDiff>("update-geojson-diff");
builder.RootComponents.RegisterCustomElement<GlobalStateVisibility>("global-state-visibility");
builder.RootComponents.RegisterCustomElement<LineLayerExample>("line-layer");
builder.RootComponents.RegisterCustomElement<CircleLayerExample>("circle-layer");
builder.RootComponents.RegisterCustomElement<RasterStyling>("raster-styling");
builder.RootComponents.RegisterCustomElement<HillshadeTerrain>("hillshade-terrain");
builder.RootComponents.RegisterCustomElement<FillExtrusion>("fill-extrusion");
builder.RootComponents.RegisterCustomElement<MapEvents>("map-events");
builder.RootComponents.RegisterCustomElement<SymbolLabels>("symbol-labels");
builder.RootComponents.RegisterCustomElement<SkyFogTerrain>("sky-fog-terrain");
builder.RootComponents.RegisterCustomElement<GlobeAtmosphere>("globe-atmosphere");
builder.RootComponents.RegisterCustomElement<ColorReliefTerrain>("color-relief-terrain");
builder.RootComponents.RegisterCustomElement<Minimap>("map-minimap");
builder.RootComponents.RegisterCustomElement<Framerate>("map-framerate");
builder.RootComponents.RegisterCustomElement<GeoGrid>("map-geogrid");
builder.RootComponents.RegisterCustomElement<Starfield>("map-starfield");

await builder.Build().RunAsync();
