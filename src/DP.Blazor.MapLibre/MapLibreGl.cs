namespace DP.Blazor.MapLibre;

/// <summary>
/// Metadata about the MapLibre GL JS build bundled with this package.
/// </summary>
public static class MapLibreGl
{
    /// <summary>
    /// Version of the MapLibre GL JS bundle shipped in <c>wwwroot/maplibre-gl/dist</c>
    /// (for example <c>6.11.2</c>). It is appended to the ESM import as a cache-busting
    /// query so hosts that cache static content immutably still pick up new bundles.
    /// </summary>
    public static string Version { get; } = ReadVersion();

    private static string ReadVersion()
    {
        var assembly = typeof(MapLibreGl).Assembly;
        using var stream = assembly.GetManifestResourceStream("DP.Blazor.MapLibre.MapLibreGlVersion")
            ?? throw new InvalidOperationException(
                "The bundled MapLibre GL JS version resource is missing from the assembly.");
        using var reader = new StreamReader(stream);
        return reader.ReadToEnd().Trim();
    }
}
