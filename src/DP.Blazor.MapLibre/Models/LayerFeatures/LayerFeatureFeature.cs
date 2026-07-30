using System.Text.Json.Serialization;
using DP.Blazor.MapLibre.Converter;
using DP.Blazor.MapLibre.Models.Feature;

namespace DP.Blazor.MapLibre.Models.LayerFeatures;

public class LayerFeatureFeature : LayerFeature
{
	[JsonPropertyName("id")]
	[JsonConverter(typeof(StringOrNumberConverter))]
	public string? Id { get; set; }

	[JsonPropertyName("geometry")]
	public required IGeometry Geometry { get; set; }

	[JsonPropertyName("properties")]
	public Dictionary<string, object>? Properties { get; set; }

	[JsonPropertyName("layer")]
	public Dictionary<string, object>? Layer { get; set; }
	
	/// <summary>
	/// <inheritdoc/>
	/// </summary>
	public override LngLatBounds GetBounds() => Geometry.GetBounds();
}