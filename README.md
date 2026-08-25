<a id="readme-top"></a>

<div align="center">

[![NuGet](https://img.shields.io/nuget/v/DP.Blazor.MapLibre.svg?style=flat-square)](https://www.nuget.org/packages/DP.Blazor.MapLibre)
[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg?style=flat-square)](UNLICENSE)
[![Build](https://img.shields.io/github/actions/workflow/status/DenisPolagaev/DP.Blazor.MapLibre/build-deploy-publish.yml?branch=main&style=flat-square)](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/actions)

<img src="https://maplibre.org/_astro/maplibre-logo.wyLiUNdu_Zcg5mX.svg" alt="MapLibre" width="280" />

# DP.Blazor.MapLibre

C# / Blazor wrapper around [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/).

[Demo & docs](https://denispolagaev.github.io/DP.Blazor.MapLibre/) ·
[Report bug](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/issues/new?labels=bug&template=bug_report.yml) ·
[Request feature](https://github.com/DenisPolagaev/DP.Blazor.MapLibre/issues/new?labels=enhancement&template=feature_request.yml)

</div>

## Origin

This repository **started as a fork** of [Yet-another-solution/Blazor.MapLibre](https://github.com/Yet-another-solution/Blazor.MapLibre) (`Community.Blazor.MapLibre`). It is now maintained independently under the **DP.Blazor.MapLibre** name and package identity.

## Install

```bash
dotnet add package DP.Blazor.MapLibre
```

Optional plugins (separate NuGet packages):

```bash
dotnet add package DP.Blazor.MapLibre.TerraDrawPlugin
dotnet add package DP.Blazor.MapLibre.ComparePlugin
dotnet add package DP.Blazor.MapLibre.MinimapPlugin
dotnet add package DP.Blazor.MapLibre.FrameratePlugin
dotnet add package DP.Blazor.MapLibre.GeoGridPlugin
dotnet add package DP.Blazor.MapLibre.StarfieldPlugin
```

Add MapLibre CSS in your app:

```html
<link href="_content/DP.Blazor.MapLibre/maplibre-gl/dist/maplibre-gl.css" rel="stylesheet" />
```

The JS bundle is ESM (`maplibre-gl.mjs` + worker) and is loaded by the component via `prepareMapLibreGl`. Do not use a classic `<script src="…/maplibre-gl.js">` tag.

Targets: **.NET 8 / 9 / 10**. Bundled MapLibre GL JS: **6.6.0** (ESM: `maplibre-gl.mjs` + worker, restored via LibMan).

## Typed interop facade

TypeScript sources live under `src/DP.Blazor.MapLibre/ts`. Build with:

```bash
cd src/DP.Blazor.MapLibre/ts
npm ci
npm run build
```

This typechecks the runtime modules (skip cache, overlay replay, transaction coalesce) and emits `wwwroot/js/runtime/`.

## Browser lifecycle tests

```bash
cd tests/browser
npm ci
npx playwright install chromium
npm test
```

```razor
<MapLibre Options="_mapOptions" />

@code {
    private readonly MapOptions _mapOptions = new();
}
```

See the [documentation site](https://denispolagaev.github.io/DP.Blazor.MapLibre/) for API notes, plugins, and live examples.

## Publishing NuGet packages

Packages are published from CI when you push a version tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

Requires repository secret `NUGET_USER` (nuget.org profile username, not email) and a Trusted Publishing policy on nuget.org pointing at this repo + `build-deploy-publish.yml`.

You can also run the **Build, Test, and Publish** workflow manually (`workflow_dispatch`).

## Documentation site (GitHub Pages)

On every push to `main`, CI builds the DocFX + examples site and deploys it via GitHub Actions.

1. Repo **Settings → Pages → Source: GitHub Actions**
2. Site URL: `https://denispolagaev.github.io/DP.Blazor.MapLibre/`

## License

Released under the [Unlicense](UNLICENSE). MapLibre GL JS itself is under the BSD-3-Clause license — see [MapLibre GL JS LICENSE](https://github.com/maplibre/maplibre-gl-js/blob/main/LICENSE.txt).

Use of this library is at your own risk; it is provided as-is without warranty.
