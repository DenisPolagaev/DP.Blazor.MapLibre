namespace DP.Blazor.MapLibre;

/// <summary>
/// Helpers for MapLibre style expressions (JSON arrays).
/// </summary>
public static class Expr
{
    /// <summary>Access a feature property by name.</summary>
    public static object[] Get(string property) => ["get", property];

    /// <summary>The current map zoom level.</summary>
    public static object[] Zoom { get; } = ["zoom"];

    /// <summary>Equality: property == value.</summary>
    public static object[] Eq(string property, object value) => ["==", Get(property), value];

    /// <summary>Inequality: property != value.</summary>
    public static object[] Neq(string property, object value) => ["!=", Get(property), value];

    /// <summary>Greater than.</summary>
    public static object[] Gt(string property, object value) => [">", Get(property), value];

    /// <summary>Less than.</summary>
    public static object[] Lt(string property, object value) => ["<", Get(property), value];

    /// <summary>Greater than or equal.</summary>
    public static object[] Gte(string property, object value) => [">=", Get(property), value];

    /// <summary>Less than or equal.</summary>
    public static object[] Lte(string property, object value) => ["<=", Get(property), value];

    /// <summary>Logical AND.</summary>
    public static object[] All(params object[] conditions)
    {
        var result = new object[conditions.Length + 1];
        result[0] = "all";
        Array.Copy(conditions, 0, result, 1, conditions.Length);
        return result;
    }

    /// <summary>Logical OR.</summary>
    public static object[] Any(params object[] conditions)
    {
        var result = new object[conditions.Length + 1];
        result[0] = "any";
        Array.Copy(conditions, 0, result, 1, conditions.Length);
        return result;
    }

    /// <summary>Logical NOT.</summary>
    public static object[] Not(object condition) => ["!", condition];

    /// <summary>Whether a feature has a property.</summary>
    public static object[] Has(string property) => ["has", property];

    /// <summary>
    /// Match a property against cases. Pairs are value1, result1, ..., fallback.
    /// </summary>
    public static object[] Match(string property, params object[] casesAndFallback)
    {
        var result = new object[casesAndFallback.Length + 2];
        result[0] = "match";
        result[1] = Get(property);
        Array.Copy(casesAndFallback, 0, result, 2, casesAndFallback.Length);
        return result;
    }

    /// <summary>
    /// Step function on a property. Stops are threshold1, value1, threshold2, value2, ...
    /// </summary>
    public static object[] Step(string property, object defaultValue, params object[] stops)
    {
        var result = new object[stops.Length + 3];
        result[0] = "step";
        result[1] = Get(property);
        result[2] = defaultValue;
        Array.Copy(stops, 0, result, 3, stops.Length);
        return result;
    }

    /// <summary>Linear interpolation on a feature property.</summary>
    public static object[] Interpolate(string property, params object[] stops)
    {
        var result = new object[stops.Length + 3];
        result[0] = "interpolate";
        result[1] = new object[] { "linear" };
        result[2] = Get(property);
        Array.Copy(stops, 0, result, 3, stops.Length);
        return result;
    }

    /// <summary>Linear interpolation based on zoom. Stops are zoom1, value1, zoom2, value2, ...</summary>
    public static object[] InterpolateZoom(params object[] stops)
    {
        var result = new object[stops.Length + 3];
        result[0] = "interpolate";
        result[1] = new object[] { "linear" };
        result[2] = Zoom;
        Array.Copy(stops, 0, result, 3, stops.Length);
        return result;
    }
}
