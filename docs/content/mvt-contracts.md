# Backend MLT / REST tile contracts (Geoportal)

Operational layers expose MapLibre Tiles (MLT) — the Geoportal has no MVT path — and should provide:

- **Versioned tile URL** — e.g. `/api/v1/.../tiles/{z}/{x}/{y}.mlt`, served together with
  `"encoding": "mlt"` on the style source (MapLibre defaults to `mvt`)
- **`source-layer`** — stable name matching StyleConfig `sourceLayer`
- **`promoteId`** — stable feature id property (default `id`) for `setFeatureState`
- **Cache** — `ETag` / `Cache-Control` appropriate for tile churn
- **Auth** — cookie session or signed URL; never require a Blazor sync callback per tile
- **Detail-on-demand** — identify by stable id, fetch attributes via REST when tooltip needs more than tile properties
