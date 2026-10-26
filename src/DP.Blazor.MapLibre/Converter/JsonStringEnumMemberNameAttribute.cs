#if NET8_0
namespace System.Text.Json.Serialization;

/// <summary>
/// net8 polyfill for the STJ 9+ <c>JsonStringEnumMemberNameAttribute</c>. The attribute is
/// consumed by <see cref="DP.Blazor.MapLibre.Converter.JsonStringEnumMemberConverter"/>.
/// </summary>
[AttributeUsage(AttributeTargets.Field, AllowMultiple = false)]
internal sealed class JsonStringEnumMemberNameAttribute : Attribute
{
    public JsonStringEnumMemberNameAttribute(string name) => Name = name;

    public string Name { get; }
}
#endif
