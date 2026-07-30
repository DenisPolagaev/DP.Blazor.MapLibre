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
	public IGeometry? Geometry { get; set; }

	[JsonPropertyName("properties")]
	public Dictionary<string, object>? Properties { get; set; }

	[JsonPropertyName("layer")]
	public Dictionary<string, object>? Layer { get; set; }
	
	/// <summary>
	/// <inheritdoc/>
	/// </summary>
	public override LngLatBounds GetBounds() =>
		Geometry?.GetBounds()
		?? new LngLatBounds
		{
			Southwest = new LngLat(0, 0),
			Northeast = new LngLat(0, 0)
		};
}