#if NET8_0
global using MapLibreJsonStringEnumConverter =
    DP.Blazor.MapLibre.Converter.JsonStringEnumMemberConverter;
#else
global using MapLibreJsonStringEnumConverter =
    System.Text.Json.Serialization.JsonStringEnumConverter;
#endif
