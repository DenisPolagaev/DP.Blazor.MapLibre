using System.Text.Json;
using System.Text.Json.Serialization;

namespace DP.Blazor.MapLibre.Models.Style;

/// <summary>
/// MapLibre style-spec filter expression. Serializes as a JSON array
/// (e.g. <c>["==", ["get", "type"], "fire"]</c>).
/// </summary>
[JsonConverter(typeof(FilterSpecificationJsonConverter))]
public sealed class FilterSpecification
{
    public FilterSpecification(params object[] expression)
    {
        ArgumentNullException.ThrowIfNull(expression);
        Expression = expression;
    }

    public object[] Expression { get; }

    public static FilterSpecification Of(params object[] expression) => new(expression);

    public static FilterSpecification Eq(string property, object value) =>
        Of("==", new object[] { "get", property }, value);

    public static FilterSpecification Neq(string property, object value) =>
        Of("!=", new object[] { "get", property }, value);

    public static FilterSpecification Has(string property) =>
        Of("has", property);

    public static FilterSpecification All(params FilterSpecification[] filters)
    {
        var expression = new object[filters.Length + 1];
        expression[0] = "all";
        for (var i = 0; i < filters.Length; i++)
        {
            expression[i + 1] = filters[i].Expression;
        }

        return new FilterSpecification(expression);
    }

    public static FilterSpecification Any(params FilterSpecification[] filters)
    {
        var expression = new object[filters.Length + 1];
        expression[0] = "any";
        for (var i = 0; i < filters.Length; i++)
        {
            expression[i + 1] = filters[i].Expression;
        }

        return new FilterSpecification(expression);
    }
}

internal sealed class FilterSpecificationJsonConverter : JsonConverter<FilterSpecification>
{
    public override FilterSpecification Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var element = JsonElement.ParseValue(ref reader);
        if (element.ValueKind != JsonValueKind.Array)
        {
            throw new JsonException("FilterSpecification must be a JSON array.");
        }

        var list = new List<object?>();
        foreach (var item in element.EnumerateArray())
        {
            list.Add(JsonSerializer.Deserialize<object>(item.GetRawText(), options));
        }

        return new FilterSpecification(list.Cast<object>().ToArray());
    }

    public override void Write(Utf8JsonWriter writer, FilterSpecification value, JsonSerializerOptions options) =>
        JsonSerializer.Serialize(writer, value.Expression, options);
}
