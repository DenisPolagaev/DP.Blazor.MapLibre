using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.TerraDrawPlugin;

/// <summary>
/// Payload of the Terra Draw <c>change</c> event, used by the change and delete listeners and by
/// <c>AddTerraDrawInstanceEventListener</c> for <see cref="TerraDrawInstanceEventType.Change"/>.
/// </summary>
public sealed class TerraDrawChangeEventArgs
{
    /// <summary>Ids of the features that changed.</summary>
    [JsonPropertyName("ids")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object[]? Ids { get; set; }

    /// <summary>Change type reported by Terra Draw (for example <c>create</c>, <c>update</c>, <c>delete</c>).</summary>
    [JsonPropertyName("type")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Type { get; set; }

    /// <summary>Snapshot of the features after the change.</summary>
    [JsonPropertyName("features")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object[]? Features { get; set; }
}
