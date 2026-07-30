using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Visibility
{
    [JsonStringEnumMemberName("visible")]
    Visible,

    [JsonStringEnumMemberName("none")]
    None
}
