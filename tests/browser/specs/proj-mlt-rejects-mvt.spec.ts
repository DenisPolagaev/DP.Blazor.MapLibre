import { expect, test } from '@playwright/test';

// Vector tiles are MLT only: an MVT source must be rejected instead of being decoded as garbage.
test('reprojectStyle drops an MVT vector source with a warning', async ({ page }) => {
  await page.goto('/proj.html');
  await page.waitForFunction(() => (window as any).__projReady || (window as any).__projError);

  const warnings: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'warning') warnings.push(message.text());
  });

  const result = await page.evaluate(async () => {
    const plugin = (window as any).__proj;
    const style = {
      version: 8,
      sources: {
        mvt: { type: 'vector', tiles: ['http://127.0.0.1:4173/tiles/{z}/{x}/{y}.pbf'] },
        explicit: { type: 'vector', encoding: 'mvt', tiles: ['http://127.0.0.1:4173/tiles/{z}/{x}/{y}.pbf'] },
        mlt: { type: 'vector', encoding: 'mlt', tiles: ['http://127.0.0.1:4173/tiles/weather/{z}/{x}/{y}.mlt'] },
      },
      layers: [
        { id: 'mvt-layer', type: 'line', source: 'mvt', 'source-layer': 'layer0' },
        { id: 'explicit-layer', type: 'line', source: 'explicit', 'source-layer': 'layer0' },
        { id: 'mlt-layer', type: 'fill', source: 'mlt', 'source-layer': 'weather_grid_hourly' },
      ],
    };

    const reprojected = await plugin.reprojectStyle({ style, crs: 'ESRI:54030' });
    return {
      sourceIds: Object.keys(reprojected.style.sources),
      layerIds: reprojected.style.layers.map((layer: any) => layer.id),
      mltTiles: reprojected.style.sources.mlt?.tiles ?? null,
      mltEncoding: reprojected.style.sources.mlt?.encoding ?? null,
    };
  });

  expect(result.sourceIds).toEqual(['mlt']);
  expect(result.layerIds).toEqual(['mlt-layer']);
  expect(result.mltTiles[0]).toMatch(/^reproj-/);
  expect(result.mltEncoding).toBe('mlt');
  expect(warnings.join('\n')).toContain('only MapLibre Tile ("mlt") sources can be reprojected');
});

test('reprojectSource rejects an MVT source', async ({ page }) => {
  await page.goto('/proj.html');
  await page.waitForFunction(() => (window as any).__projReady || (window as any).__projError);

  const error = await page.evaluate(async () => {
    const plugin = (window as any).__proj;
    try {
      await plugin.reprojectSource({
        sourceId: 'mvt',
        source: { type: 'vector', tiles: ['http://127.0.0.1:4173/tiles/{z}/{x}/{y}.pbf'] },
        crs: 'ESRI:54030',
      });
      return null;
    } catch (e: any) {
      return String((e && e.message) || e);
    }
  });

  expect(error).toBeTruthy();
  expect(error).toContain('MapLibre Tile');
});
