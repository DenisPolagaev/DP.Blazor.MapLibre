using System.IO;
using System.Runtime.CompilerServices;
using Xunit;

namespace DP.Blazor.MapLibre.Tests;

/// <summary>
/// Guards the bundled MapLibre GL JS version: the embedded value must match the
/// single source of truth (<c>maplibre-gl.version</c>), the LibMan manifest and
/// the TypeScript dependency, and the committed bundle files must exist.
/// </summary>
public class MapLibreGlVersionTests
{
    private static string ProjectDirectory([CallerFilePath] string callerFilePath = "")
    {
        // tests/DP.Blazor.MapLibre.Tests/MapLibreGlVersionTests.cs -> src/DP.Blazor.MapLibre
        var repoRoot = Path.GetFullPath(Path.Combine(Path.GetDirectoryName(callerFilePath)!, "..", ".."));
        return Path.Combine(repoRoot, "src", "DP.Blazor.MapLibre");
    }

    [Fact]
    public void EmbeddedVersion_MatchesSourceOfTruth_AndManifests()
    {
        var projectDir = ProjectDirectory();
        var version = MapLibreGl.Version.Trim();

        Assert.False(string.IsNullOrWhiteSpace(version), "MapLibreGl.Version must not be empty.");

        var versionFile = Path.Combine(projectDir, "maplibre-gl.version");
        Assert.True(File.Exists(versionFile), $"Expected {versionFile} to exist.");
        Assert.Equal(version, File.ReadAllText(versionFile).Trim());

        var libman = File.ReadAllText(Path.Combine(projectDir, "libman.json"));
        Assert.Contains($"\"maplibre-gl@{version}\"", libman);

        var tsPackage = File.ReadAllText(Path.Combine(projectDir, "ts", "package.json"));
        Assert.Contains($"\"maplibre-gl\": \"{version}\"", tsPackage);
    }

    [Theory]
    [InlineData("maplibre-gl.mjs")]
    [InlineData("maplibre-gl-worker.mjs")]
    [InlineData("maplibre-gl-shared.mjs")]
    [InlineData("maplibre-gl.css")]
    public void BundleArtifact_IsCommitted(string fileName)
    {
        var artifact = Path.Combine(ProjectDirectory(), "wwwroot", "maplibre-gl", "dist", fileName);
        Assert.True(File.Exists(artifact), $"Expected bundled MapLibre GL JS artifact {artifact} to be committed.");
    }
}
