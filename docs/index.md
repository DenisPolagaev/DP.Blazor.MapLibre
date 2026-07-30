# DP.Blazor.MapLibre

## About

Blazor wrapper around MapLibre GL JS. This project **started as a fork** of [Yet-another-solution/Blazor.MapLibre](https://github.com/Yet-another-solution/Blazor.MapLibre) and is maintained independently as **DP.Blazor.MapLibre**.

## Getting Started

### Prerequisites

The library and plugins target .NET 8, 9, and 10. Examples and this documentation site use .NET 10 — install the [.NET 10 SDK](https://dotnet.microsoft.com/download) or newer to build and run them.

### Installation

```bash
dotnet add package DP.Blazor.MapLibre
```

Add this to the head of your app to load the map CSS:

```html
<link href="_content/DP.Blazor.MapLibre/maplibre-gl/dist/maplibre-gl.css" rel="stylesheet" />
```

## Usage

```csharp
<MapLibre />
```

With options:

```csharp
<MapLibre Options="_mapOptions"></MapLibre>

@code
{
    private readonly MapOptions _mapOptions = new MapOptions();
}
```
