import { expect, test } from '@playwright/test';

// The whole chain through MapLibre: an MLT source (encoding: "mlt") is reprojected by the protocol
// handler, decoded by MapLibre's own MLT decoder and rendered.
test('a reprojected MLT source renders', async ({ page }) => {
  test.setTimeout(300_000);
  await page.goto('/proj.html');
  await page.waitForFunction(() => (window as any).__projReady || (window as any).__projError);
  expect(await page.evaluate(() => (window as any).__projError ?? null)).toBeFalsy();

  const result = await page.evaluate(async () => {
    const plugin = (window as any).__proj;
    const map = (window as any).__map;

    const style = {
      version: 8,
      sources: {
        weather: {
          type: 'vector',
          encoding: 'mlt',
          tiles: ['http://127.0.0.1:4173/tiles/weather/{z}/{x}/{y}.mlt'],
          minzoom: 0,
          maxzoom: 2,
        },
      },
      layers: [
        {
          id: 'weather-fill',
          type: 'fill',
          source: 'weather',
          'source-layer': 'weather_grid_hourly',
          filter: ['==', ['geometry-type'], 'Polygon'],
          paint: { 'fill-color': '#3b82f6', 'fill-opacity': 0.6 },
        },
      ],
    };

    await plugin.applyReprojection({ style, crs: 'ESRI:54030' });
    await new Promise((resolve) => {
      if (map.loaded() && map.isStyleLoaded()) resolve(null);
      else map.once('idle', () => resolve(null));
    });

    const sourceFeatures = map.querySourceFeatures('weather', { sourceLayer: 'weather_grid_hourly' });
    const rendered = map.queryRenderedFeatures({ layers: ['weather-fill'] });
    return {
      sourceTiles: map.getStyle().sources.weather.tiles,
      encoding: map.getStyle().sources.weather.encoding,
      sourceFeatures: sourceFeatures.length,
      rendered: rendered.length,
      sourceLayer: rendered[0]?.sourceLayer ?? null,
      geometryTypes: [...new Set(rendered.map((feature: any) => feature.geometry?.type))],
    };
  });

  expect(result.encoding).toBe('mlt');
  expect(result.sourceTiles[0]).toMatch(/^reproj-/);
  expect(result.sourceFeatures).toBeGreaterThan(0);
  expect(result.rendered).toBeGreaterThan(0);
  expect(result.sourceLayer).toBe('weather_grid_hourly');
  expect(result.geometryTypes.every((type: string) => type === 'Polygon' || type === 'MultiPolygon')).toBe(true);
});
