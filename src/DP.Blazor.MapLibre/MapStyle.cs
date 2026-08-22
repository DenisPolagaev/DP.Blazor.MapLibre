using DP.Blazor.MapLibre.Models;

namespace DP.Blazor.MapLibre;

/// <summary>
/// Typed map style: a MapLibre style URL, raster XYZ template, WMS, WMTS, or ArcGIS MapServer.
/// </summary>
public sealed record MapStyle
{
    private MapStyle(
        string? id,
        string? url,
        RasterTileStyleSource? rasterSource,
        WmsTileStyleSource? wmsSource)
    {
        Id = id;
        Url = url;
        RasterSource = rasterSource;
        WmsSource = wmsSource;
    }

    /// <summary>Stable identifier when composing multiple styles.</summary>
    public string? Id { get; init; }

    /// <summary>MapLibre style JSON URL.</summary>
    public string? Url { get; }

    /// <summary>Raster XYZ source, when not using a style URL.</summary>
    public RasterTileStyleSource? RasterSource { get; }

    /// <summary>WMS source, when not using a style URL.</summary>
    public WmsTileStyleSource? WmsSource { get; }

    /// <summary>Returns a copy with a stable identifier.</summary>
    public MapStyle WithId(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            throw new ArgumentException("Map style ID must not be empty.", nameof(id));
        }

        return this with { Id = id };
    }

    /// <summary>Creates a style from a MapLibre style specification URL.</summary>
    public static MapStyle FromUrl(string url)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(url);
        return new(null, url, null, null);
    }

    /// <summary>Creates a style from a raster tile URL template (<c>{z}/{x}/{y}</c>).</summary>
    public static MapStyle FromRasterUrl(string urlTemplate, string attribution, int tileSize = 256)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(urlTemplate);
        return new(null, null, new RasterTileStyleSource(urlTemplate, attribution, tileSize), null);
    }

    /// <summary>Creates a style from a WMS 1.1.1/1.3.0 endpoint.</summary>
    public static MapStyle FromWmsUrl(
        string baseUrl,
        string layers,
        string attribution,
        string format = "image/png",
        bool transparent = false,
        string version = "1.1.1",
        int tileSize = 256)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(baseUrl);
        ArgumentException.ThrowIfNullOrWhiteSpace(layers);
        return new(
            null,
            null,
            null,
            new WmsTileStyleSource(baseUrl, layers, attribution, format, transparent, version, tileSize));
    }

    /// <summary>Creates a style from a WMTS tile template (ArcGIS cached services).</summary>
    public static MapStyle FromWmtsUrl(
        string baseUrl,
        string layer,
        string attribution,
        string tileMatrixSet = "default028mm",
        string style = "default",
        string format = "png",
        int tileSize = 256)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(baseUrl);
        ArgumentException.ThrowIfNullOrWhiteSpace(layer);
        var urlTemplate =
            $"{baseUrl.TrimEnd('/')}/tile/1.0.0/{layer}/{style}/{tileMatrixSet}/{{z}}/{{y}}/{{x}}.{format}";
        return FromRasterUrl(urlTemplate, attribution, tileSize);
    }

    /// <summary>Creates a style from an ArcGIS MapServer <c>/tile/{{z}}/{{y}}/{{x}}</c> endpoint.</summary>
    public static MapStyle FromArcGisMapServer(string mapServerUrl, string attribution, int tileSize = 256)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(mapServerUrl);
        var urlTemplate = $"{mapServerUrl.TrimEnd('/')}/tile/{{z}}/{{y}}/{{x}}";
        return FromRasterUrl(urlTemplate, attribution, tileSize);
    }

    /// <summary>Value for <see cref="MapOptions.Style"/>: URL string or inline style JSON object.</summary>
    public object ToStylePayload()
    {
        if (Url is not null)
        {
            return Url;
        }

        if (RasterSource is not null)
        {
            return BuildRasterStyle(RasterSource.UrlTemplate, RasterSource.Attribution, RasterSource.TileSize);
        }

        if (WmsSource is not null)
        {
            var query = WmsSource.Version.StartsWith("1.3", StringComparison.Ordinal)
                ? $"{WmsSource.BaseUrl.TrimEnd('/')}?SERVICE=WMS&VERSION={Uri.EscapeDataString(WmsSource.Version)}&REQUEST=GetMap&LAYERS={Uri.EscapeDataString(WmsSource.Layers)}&STYLES=&CRS=EPSG:3857&BBOX={{bbox-epsg-3857}}&WIDTH={WmsSource.TileSize}&HEIGHT={WmsSource.TileSize}&FORMAT={Uri.EscapeDataString(WmsSource.Format)}{(WmsSource.Transparent ? "&TRANSPARENT=TRUE" : string.Empty)}"
                : $"{WmsSource.BaseUrl.TrimEnd('/')}?SERVICE=WMS&VERSION={Uri.EscapeDataString(WmsSource.Version)}&REQUEST=GetMap&LAYERS={Uri.EscapeDataString(WmsSource.Layers)}&STYLES=&SRS=EPSG:3857&BBOX={{bbox-epsg-3857}}&WIDTH={WmsSource.TileSize}&HEIGHT={WmsSource.TileSize}&FORMAT={Uri.EscapeDataString(WmsSource.Format)}{(WmsSource.Transparent ? "&TRANSPARENT=TRUE" : string.Empty)}";
            return BuildRasterStyle(query, WmsSource.Attribution, WmsSource.TileSize);
        }

        throw new InvalidOperationException("MapStyle has no URL, raster, or WMS source.");
    }

    private static object BuildRasterStyle(string tileUrl, string attribution, int tileSize) =>
        new
        {
            version = 8,
            sources = new Dictionary<string, object>
            {
                ["raster"] = new
                {
                    type = "raster",
                    tiles = new[] { tileUrl },
                    tileSize,
                    attribution,
                },
            },
            layers = new[]
            {
                new
                {
                    id = "raster",
                    type = "raster",
                    source = "raster",
                },
            },
        };

    /// <summary>OpenFreeMap vector styles (no API key).</summary>
    public static class OpenFreeMap
    {
        public static MapStyle Liberty =>
            FromUrl("https://tiles.openfreemap.org/styles/liberty").WithId("openfreemap-liberty");

        public static MapStyle Bright =>
            FromUrl("https://tiles.openfreemap.org/styles/bright").WithId("openfreemap-bright");

        public static MapStyle Positron =>
            FromUrl("https://tiles.openfreemap.org/styles/positron").WithId("openfreemap-positron");
    }

    /// <summary>OpenStreetMap raster tiles.</summary>
    public static class OpenStreetMap
    {
        public static MapStyle Standard =>
            FromRasterUrl(
                    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
                    "© OpenStreetMap contributors")
                .WithId("openstreetmap-standard");
    }
}

/// <summary>Raster XYZ tile source used by <see cref="MapStyle"/>.</summary>
public sealed record RasterTileStyleSource(string UrlTemplate, string Attribution, int TileSize);

/// <summary>WMS tile source used by <see cref="MapStyle"/>.</summary>
public sealed record WmsTileStyleSource(
    string BaseUrl,
    string Layers,
    string Attribution,
    string Format,
    bool Transparent,
    string Version,
    int TileSize);
