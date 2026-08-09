using System.Text.Json;
using DP.Blazor.MapLibre.Models;
using DP.Blazor.MapLibre.Models.Camera;
using DP.Blazor.MapLibre.Models.Control;
using DP.Blazor.MapLibre.Models.Event;
using DP.Blazor.MapLibre.Models.Feature;
using DP.Blazor.MapLibre.Models.Interaction;
using DP.Blazor.MapLibre.Models.Layers;
using DP.Blazor.MapLibre.Models.Marker;
using DP.Blazor.MapLibre.Models.Request;
using DP.Blazor.MapLibre.Models.Sources;
using DP.Blazor.MapLibre.Models.Style;
using OneOf;
using Xunit;

namespace DP.Blazor.MapLibre.Tests;

/// <summary>
/// Contract tests: C# JSON property names and shapes must match MapLibre GL JS 6.2
/// (<c>MapOptions</c>, sources, controls, RequestParameters, compact event DTOs).
/// </summary>
public class MapLibreV6ContractSerializationTests
{
    private static JsonElement SerializeToElement<T>(T value, JsonSerializerOptions? options = null)
    {
        var json = JsonSerializer.Serialize(value, options ?? MapLibreJsonSerializer.Options);
        return JsonDocument.Parse(json).RootElement.Clone();
    }

    private static void AssertExactKeys(JsonElement root, params string[] expectedKeys)
    {
        var actual = root.EnumerateObject().Select(p => p.Name).OrderBy(x => x).ToArray();
        var expected = expectedKeys.OrderBy(x => x).ToArray();
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void MapOptions_V6Properties_UseMapLibreJsonNames_AndRoundTrip()
    {
        var options = new MapOptions
        {
            Zoom = 3,
            ZoomSnap = 1,
            ZoomLevelsToOverscale = 4,
            RotateSpeed = 0.8,
            PitchSpeed = -0.5,
            AnisotropicFilterPitch = 20,
            TerrainSkirtLength = "auto",
            AroundCenter = true,
            ReduceMotion = false,
            ValidateStyle = true,
        };

#pragma warning disable CS0618
        Assert.Equal(4, options.ExperimentalZoomLevelsToOverscale);
#pragma warning restore CS0618

        var root = SerializeToElement(options);
        Assert.Equal(4, root.GetProperty("zoomLevelsToOverscale").GetInt32());
        Assert.Equal(0.8, root.GetProperty("rotateSpeed").GetDouble());
        Assert.Equal(-0.5, root.GetProperty("pitchSpeed").GetDouble());
        Assert.Equal(20, root.GetProperty("anisotropicFilterPitch").GetDouble());
        Assert.Equal("auto", root.GetProperty("terrainSkirtLength").GetString());
        Assert.True(root.GetProperty("aroundCenter").GetBoolean());
        Assert.False(root.TryGetProperty("experimentalZoomLevelsToOverscale", out _));

        var restored = JsonSerializer.Deserialize<MapOptions>(root.GetRawText(), MapLibreJsonSerializer.Options);
        Assert.NotNull(restored);
        Assert.Equal(4, restored!.ZoomLevelsToOverscale);
        Assert.Equal(0.8, restored.RotateSpeed);
        Assert.Equal(-0.5, restored.PitchSpeed);
        Assert.Equal(20, restored.AnisotropicFilterPitch);
        Assert.Equal("auto", restored.TerrainSkirtLength);
        Assert.True(restored.AroundCenter);
    }

    [Theory]
    [InlineData("auto")]
    [InlineData("none")]
    public void MapOptions_TerrainSkirtLength_AcceptsMapLibreEnumStrings(string value)
    {
        var options = new MapOptions { TerrainSkirtLength = value };
        var root = SerializeToElement(options);
        Assert.Equal(value, root.GetProperty("terrainSkirtLength").GetString());
    }

    [Fact]
    public void MapOptions_OmitsUnsetOptionalFields()
    {
        var options = new MapOptions { Zoom = 2 };
        var root = SerializeToElement(options);

        Assert.Equal(2, root.GetProperty("zoom").GetDouble());
        Assert.False(root.TryGetProperty("zoomLevelsToOverscale", out _));
        Assert.False(root.TryGetProperty("rotateSpeed", out _));
        Assert.False(root.TryGetProperty("pitchSpeed", out _));
        Assert.False(root.TryGetProperty("anisotropicFilterPitch", out _));
        Assert.False(root.TryGetProperty("terrainSkirtLength", out _));
        Assert.False(root.TryGetProperty("aroundCenter", out _));
    }

    [Fact]
    public void SetClusterOptions_MatchesMapLibreSetClusterOptionsShape()
    {
        // MapLibre SetClusterOptions: cluster?, clusterMaxZoom?, clusterRadius? only.
        var options = new SetClusterOptions
        {
            Cluster = true,
            ClusterMaxZoom = 14.4,
            ClusterRadius = 50
        };

        var root = SerializeToElement(options);
        AssertExactKeys(root, "cluster", "clusterMaxZoom", "clusterRadius");
        Assert.True(root.GetProperty("cluster").GetBoolean());
        Assert.Equal(14.4, root.GetProperty("clusterMaxZoom").GetDouble());
        Assert.Equal(50, root.GetProperty("clusterRadius").GetDouble());

        const string getClusterOptionsJson = """
            { "cluster": true, "clusterMaxZoom": 14, "clusterRadius": 50 }
            """;
        var restored = JsonSerializer.Deserialize<SetClusterOptions>(getClusterOptionsJson, MapLibreJsonSerializer.Options);
        Assert.NotNull(restored);
        Assert.True(restored!.Cluster);
        Assert.Equal(14, restored.ClusterMaxZoom);
        Assert.Equal(50, restored.ClusterRadius);
    }

    [Fact]
    public void UpdateImageSourceOptions_UrlPath_MatchesMapLibreUpdateImageOptions()
    {
        var options = new UpdateImageSourceOptions
        {
            Url = "https://example.com/radar.png",
            Coordinates =
            [
                [-80, 40],
                [-70, 40],
                [-70, 30],
                [-80, 30]
            ]
        };

        var root = SerializeToElement(options);
        Assert.Equal("https://example.com/radar.png", root.GetProperty("url").GetString());
        Assert.Equal(JsonValueKind.Array, root.GetProperty("coordinates").ValueKind);
        Assert.Equal(4, root.GetProperty("coordinates").GetArrayLength());
        Assert.False(root.TryGetProperty("image", out _));

        var restored = JsonSerializer.Deserialize<UpdateImageSourceOptions>(root.GetRawText(), MapLibreJsonSerializer.Options);
        Assert.Equal(options.Url, restored!.Url);
        Assert.Equal(4, restored.Coordinates!.Count);
    }

    [Fact]
    public void UpdateImageSourceOptions_CoordinatesOnly_OmitsNullUrl()
    {
        var options = new UpdateImageSourceOptions
        {
            Coordinates =
            [
                [0, 1],
                [1, 1],
                [1, 0],
                [0, 0]
            ]
        };

        var root = SerializeToElement(options);
        Assert.False(root.TryGetProperty("url", out _));
        Assert.True(root.TryGetProperty("coordinates", out _));
    }

    [Fact]
    public void FullscreenControlOptions_MatchesMapLibreJsonNames()
    {
        var options = new FullscreenControlOptions { Pseudo = true, Container = "map-host" };
        var root = SerializeToElement(options);
        AssertExactKeys(root, "container", "pseudo");
        Assert.True(root.GetProperty("pseudo").GetBoolean());
        Assert.Equal("map-host", root.GetProperty("container").GetString());
    }

    [Fact]
    public void GeolocateControlOptions_MatchesMapLibreJsonNames_IncludingFitBoundsOptions()
    {
        var options = new GeolocateControlOptions
        {
            TrackUserLocation = true,
            ShowAccuracyCircle = false,
            ShowUserLocation = true,
            PositionOptions = new PositionOptions
            {
                EnableHighAccuracy = true,
                Timeout = 6000,
                MaximumAge = 0
            },
            FitBoundsOptions = new FitBoundOptions { MaxZoom = 15 }
        };

        var root = SerializeToElement(options);
        Assert.True(root.GetProperty("trackUserLocation").GetBoolean());
        Assert.False(root.GetProperty("showAccuracyCircle").GetBoolean());
        Assert.True(root.GetProperty("showUserLocation").GetBoolean());
        Assert.True(root.GetProperty("positionOptions").GetProperty("enableHighAccuracy").GetBoolean());
        Assert.Equal(6000, root.GetProperty("positionOptions").GetProperty("timeout").GetInt64());
        Assert.Equal(15, root.GetProperty("fitBoundsOptions").GetProperty("maxZoom").GetDouble());
    }

    [Theory]
    [InlineData(0.5)]
    [InlineData("0.75")]
    public void MarkerOptions_Opacity_AcceptsNumberOrString_LikeMapLibre(object opacity)
    {
        var options = new MarkerOptions
        {
            Opacity = opacity,
            OpacityWhenCovered = 0.2
        };

        var root = SerializeToElement(options);
        Assert.True(root.TryGetProperty("opacity", out var opacityEl));
        Assert.True(root.TryGetProperty("opacityWhenCovered", out var coveredEl));
        Assert.Equal(JsonValueKind.Number, coveredEl.ValueKind);
        Assert.Equal(0.2, coveredEl.GetDouble());

        if (opacity is double d)
        {
            Assert.Equal(JsonValueKind.Number, opacityEl.ValueKind);
            Assert.Equal(d, opacityEl.GetDouble());
        }
        else
        {
            Assert.Equal(JsonValueKind.String, opacityEl.ValueKind);
            Assert.Equal((string)opacity, opacityEl.GetString());
        }
    }

    [Fact]
    public void TransformRequestResult_IncludesReferrerPolicy_MatchingRequestParameters()
    {
        var result = new TransformRequestResult
        {
            Url = "https://tiles.example/1/2/3.pbf",
            ReferrerPolicy = "no-referrer",
            Type = ResponseBodyType.ArrayBuffer,
            Cache = "no-store",
            CollectResourceTiming = true,
            Method = RequestMethod.Get,
            Credentials = RequestCredentials.SameOrigin,
        };

        var root = SerializeToElement(result, MapLibreJsonSerializer.TransformRequestOptions);
        Assert.Equal("https://tiles.example/1/2/3.pbf", root.GetProperty("url").GetString());
        Assert.Equal("no-referrer", root.GetProperty("referrerPolicy").GetString());
        Assert.Equal("arrayBuffer", root.GetProperty("type").GetString());
        Assert.Equal("no-store", root.GetProperty("cache").GetString());
        Assert.True(root.GetProperty("collectResourceTiming").GetBoolean());
        Assert.Equal("GET", root.GetProperty("method").GetString());
        Assert.Equal("same-origin", root.GetProperty("credentials").GetString());
    }

    [Fact]
    public void LngLatBounds_DeserializesGetGeoJsonBoundsPayload()
    {
        // Shape produced by MapLibre.razor.js getGeoJsonBounds helper.
        const string json = """
            {
              "_sw": { "lng": 10.1, "lat": 20.2 },
              "_ne": { "lng": 30.3, "lat": 40.4 }
            }
            """;

        var bounds = JsonSerializer.Deserialize<LngLatBounds>(json, MapLibreJsonSerializer.Options);
        Assert.NotNull(bounds);
        Assert.Equal(10.1, bounds!.Southwest.Longitude);
        Assert.Equal(20.2, bounds.Southwest.Latitude);
        Assert.Equal(30.3, bounds.Northeast.Longitude);
        Assert.Equal(40.4, bounds.Northeast.Latitude);
    }

    [Fact]
    public void CompactSourceDataEvent_DeserializesFullMapLibre6Fields()
    {
        const string json = """
            {
              "type": "sourcedata",
              "dataType": "source",
              "isSourceLoaded": true,
              "sourceId": "weather",
              "sourceDataType": "content",
              "sourceDataChanged": true,
              "tile": { "z": 5, "x": 10, "y": 12 },
              "point": null,
              "lngLat": null,
              "features": null
            }
            """;

        var asData = JsonSerializer.Deserialize<MapDataEvent>(json, MapLibreJsonSerializer.Options);
        var asSource = JsonSerializer.Deserialize<MapSourceDataEvent>(json, MapLibreJsonSerializer.Options);

        Assert.NotNull(asData);
        Assert.Equal(EventType.SourceData, asData!.Type);
        Assert.Equal("weather", asData.SourceId);
        Assert.Equal("content", asData.SourceDataType);
        Assert.True(asData.IsSourceLoaded);
        Assert.True(asData.SourceDataChanged);
        Assert.NotNull(asData.Tile);
        Assert.Equal(5u, asData.Tile!.Z);
        Assert.Equal(10u, asData.Tile.X);
        Assert.Equal(12u, asData.Tile.Y);

        Assert.NotNull(asSource);
        Assert.Equal("weather", asSource!.SourceId);
        Assert.IsAssignableFrom<MapDataEvent>(asSource);
    }

    [Fact]
    public void CompactProjectionAndMissingImageEvents_RoundTrip()
    {
        const string projectionJson = """
            {
              "type": "projectiontransition",
              "newProjection": { "type": "globe" }
            }
            """;
        var projection = JsonSerializer.Deserialize<MapProjectionEvent>(projectionJson, MapLibreJsonSerializer.Options);
        Assert.NotNull(projection);
        Assert.Equal(EventType.ProjectionTransition, projection!.Type);
        Assert.NotNull(projection.NewProjection);

        const string missingJson = """{ "type": "styleimagemissing", "id": "icon-fire" }""";
        var missing = JsonSerializer.Deserialize<MapStyleImageMissingEvent>(missingJson, MapLibreJsonSerializer.Options);
        Assert.NotNull(missing);
        Assert.Equal(EventType.StyleImageMissing, missing!.Type);
        Assert.Equal("icon-fire", missing.Id);
    }

    [Fact]
    public void EventAliases_DeserializeSamePayloads()
    {
        const string moveJson = """{ "type": "moveend" }""";
        Assert.NotNull(JsonSerializer.Deserialize<MapMoveEvent>(moveJson, MapLibreJsonSerializer.Options));
        Assert.NotNull(JsonSerializer.Deserialize<MapMovementEvent>(moveJson, MapLibreJsonSerializer.Options));

        const string boxJson = """{ "type": "boxzoomstart" }""";
        Assert.NotNull(JsonSerializer.Deserialize<MapZoomEvent>(boxJson, MapLibreJsonSerializer.Options));
        Assert.NotNull(JsonSerializer.Deserialize<MapBoxZoomEvent>(boxJson, MapLibreJsonSerializer.Options));

        const string styleJson = """{ "type": "styledata", "dataType": "style" }""";
        Assert.NotNull(JsonSerializer.Deserialize<MapStyleDataEvent>(styleJson, MapLibreJsonSerializer.Options));
    }

    [Fact]
    public void ControlType_EnumNames_MatchMapLibreConstructors()
    {
        // addControl in MapLibre.razor.js indexes maplibregl[ControlTypeName]
        var names = Enum.GetNames<ControlType>();
        Assert.Contains("FullscreenControl", names);
        Assert.Contains("GeolocateControl", names);
        Assert.Contains("NavigationControl", names);
        Assert.Contains("ScaleControl", names);
        Assert.Contains("GlobeControl", names);
        Assert.Contains("TerrainControl", names);
        Assert.Contains("AttributionControl", names);
        Assert.Contains("LogoControl", names);
    }

    [Fact]
    public void CircleLayer_RoundTripsStyleSpecPropertyNames()
    {
        Layer layer = new CircleLayer
        {
            Id = "points-circle",
            Source = "points",
            MinZoom = 0,
            MaxZoom = 22,
            Paint = new CircleLayerPaint
            {
                CircleRadius = 6,
                CircleColor = "#088"
            }
        };

        var root = SerializeToElement(layer);
        Assert.Equal("circle", root.GetProperty("type").GetString());
        Assert.Equal("points-circle", root.GetProperty("id").GetString());
        Assert.Equal("points", root.GetProperty("source").GetString());
        Assert.Equal(6, root.GetProperty("paint").GetProperty("circle-radius").GetDouble());
        Assert.Equal("#088", root.GetProperty("paint").GetProperty("circle-color").GetString());

        var restored = JsonSerializer.Deserialize<Layer>(root.GetRawText(), MapLibreJsonSerializer.Options);
        var circle = Assert.IsType<CircleLayer>(restored);
        Assert.Equal("points", circle.Source);
    }

    [Fact]
    public void LngLatBounds_SerializesPrivateMapLibreCorners()
    {
        var bounds = new LngLatBounds
        {
            Southwest = new LngLat(10, 20),
            Northeast = new LngLat(30, 40)
        };

        var root = SerializeToElement(bounds);
        AssertExactKeys(root, "_ne", "_sw");
        Assert.Equal(10, root.GetProperty("_sw").GetProperty("lng").GetDouble());
        Assert.Equal(20, root.GetProperty("_sw").GetProperty("lat").GetDouble());
        Assert.Equal(30, root.GetProperty("_ne").GetProperty("lng").GetDouble());
        Assert.Equal(40, root.GetProperty("_ne").GetProperty("lat").GetDouble());
    }

    [Fact]
    public void VectorTileSource_UsesStyleSpecJsonNames_WhenSerializedAsISource()
    {
        ISource source = new VectorTileSource
        {
            Tiles = ["https://example/{z}/{x}/{y}.pbf"],
            MinZoom = 0,
            MaxZoom = 5,
            Attribution = "© Test"
        };

        var root = SerializeToElement(source);
        Assert.Equal("vector", root.GetProperty("type").GetString());
        Assert.Equal(0, root.GetProperty("minzoom").GetDouble());
        Assert.Equal(5, root.GetProperty("maxzoom").GetDouble());
        Assert.Equal(JsonValueKind.Array, root.GetProperty("tiles").ValueKind);

        var restored = JsonSerializer.Deserialize<ISource>(root.GetRawText(), MapLibreJsonSerializer.Options);
        Assert.IsType<VectorTileSource>(restored);
    }

    [Fact]
    public void GeoJsonSource_RoundTripsAsISource_WithMapLibreTypeDiscriminator()
    {
        ISource source = new GeoJsonSource
        {
            Data = "https://example.com/data.geojson",
            Cluster = true,
            ClusterMaxZoom = 14,
            ClusterRadius = 50
        };

        var root = SerializeToElement(source);
        Assert.Equal("geojson", root.GetProperty("type").GetString());
        Assert.Equal("https://example.com/data.geojson", root.GetProperty("data").GetString());
        Assert.True(root.GetProperty("cluster").GetBoolean());
        Assert.Equal(14, root.GetProperty("clusterMaxZoom").GetDouble());
        Assert.Equal(50, root.GetProperty("clusterRadius").GetDouble());

        var restored = JsonSerializer.Deserialize<ISource>(root.GetRawText(), MapLibreJsonSerializer.Options);
        var geo = Assert.IsType<GeoJsonSource>(restored);
        Assert.True(geo.Cluster);
    }

    [Fact]
    public void ImageSource_RasterSources_UseStyleSpecDiscriminators()
    {
        ISource image = new ImageSource
        {
            Url = "https://example.com/img.png",
            Coordinates =
            [
                [-80.425, 46.437],
                [-71.516, 46.437],
                [-71.516, 37.936],
                [-80.425, 37.936]
            ]
        };
        Assert.Equal("image", SerializeToElement(image).GetProperty("type").GetString());

        ISource raster = new RasterTileSource
        {
            Tiles = ["https://example.com/{z}/{x}/{y}.png"],
            TileSize = 256
        };
        var rasterRoot = SerializeToElement(raster);
        Assert.Equal("raster", rasterRoot.GetProperty("type").GetString());
        Assert.Equal(256, rasterRoot.GetProperty("tileSize").GetInt32());

        ISource dem = new RasterDEMTileSource
        {
            Tiles = ["https://example.com/{z}/{x}/{y}.png"],
            Encoding = "mapbox"
        };
        Assert.Equal("raster-dem", SerializeToElement(dem).GetProperty("type").GetString());
    }

    [Fact]
    public void MapOptions_AttributionControl_AcceptsBoolOrOptions()
    {
        var disabled = new MapOptions { AttributionControl = false };
        Assert.Equal("false", SerializeToElement(disabled).GetProperty("attributionControl").GetRawText());

        var custom = new MapOptions
        {
            AttributionControl = new AttributionControlOptions
            {
                Compact = true,
                CustomAttribution = "© Test"
            }
        };
        var root = SerializeToElement(custom).GetProperty("attributionControl");
        Assert.True(root.GetProperty("compact").GetBoolean());
        Assert.Equal("© Test", root.GetProperty("customAttribution").GetString());
    }

    [Fact]
    public void MapOptions_InteractionNests_SerializeTypedUnions()
    {
        var options = new MapOptions
        {
            DragPan = new DragPanOptions { MaxSpeed = 1200 },
            ScrollZoom = new AroundCenterOptions(),
            CooperativeGestures = true,
            FitBoundsOptions = new FitBoundOptions { MaxZoom = 12 }
        };

        var root = SerializeToElement(options);
        Assert.Equal(1200, root.GetProperty("dragPan").GetProperty("maxSpeed").GetDouble());
        Assert.Equal("center", root.GetProperty("scrollZoom").GetProperty("around").GetString());
        Assert.True(root.GetProperty("cooperativeGestures").GetBoolean());
        Assert.Equal(12, root.GetProperty("fitBoundsOptions").GetProperty("maxZoom").GetDouble());
    }

    [Fact]
    public void StyleSpecification_SerializesSourcesLayersSkyProjection()
    {
        var style = new StyleSpecification
        {
            Version = 8,
            Sources = new Dictionary<string, ISource>
            {
                ["basemap"] = new RasterTileSource
                {
                    Tiles = ["https://example/{z}/{x}/{y}.png"],
                    TileSize = 256
                }
            },
            Layers =
            [
                new BackgroundLayer
                {
                    Id = "background",
                    Paint = new BackgroundLayerPaint { BackgroundColor = "#000" }
                },
                new RasterLayer { Id = "basemap", Source = "basemap" }
            ],
            Sky = new SkySpecification { AtmosphereBlend = 1 },
            Projection = new ProjectionSpecification { Type = "globe" }
        };

        var root = style.ToJsonObject();
        Assert.Equal(8, root["version"]!.GetValue<int>());
        Assert.Equal("raster", root["sources"]!["basemap"]!["type"]!.GetValue<string>());
        Assert.Equal("background", root["layers"]![0]!["type"]!.GetValue<string>());
        Assert.Equal("globe", root["projection"]!["type"]!.GetValue<string>());
        Assert.Equal(1, root["sky"]!["atmosphere-blend"]!.GetValue<double>());
    }

    [Fact]
    public void FilterSpecification_SerializesAsStyleSpecArray()
    {
        var filter = FilterSpecification.Eq("type", "fire");
        var json = JsonSerializer.Serialize(filter, MapLibreJsonSerializer.Options);
        using var doc = JsonDocument.Parse(json);
        Assert.Equal(JsonValueKind.Array, doc.RootElement.ValueKind);
        Assert.Equal("==", doc.RootElement[0].GetString());
    }

    [Fact]
    public void FeatureState_Selected_SerializesFlag()
    {
        var state = FeatureState.Selected();
        var root = SerializeToElement(state);
        Assert.True(root.GetProperty("selected").GetBoolean());
    }

    [Fact]
    public void QueryRenderedFeaturesOptions_UsesMapLibreNames()
    {
        var options = new QueryRenderedFeaturesOptions
        {
            Layers = ["points-circle"],
            Filter = FilterSpecification.Has("id").Expression,
            Validate = false
        };

        var root = SerializeToElement(options);
        Assert.Equal("points-circle", root.GetProperty("layers")[0].GetString());
        Assert.False(root.GetProperty("validate").GetBoolean());
        Assert.Equal(JsonValueKind.Array, root.GetProperty("filter").ValueKind);
    }
}
