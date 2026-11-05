import { expect, test } from '@playwright/test';

// End-to-end through the tile enumeration path: the output tile at z=1 pulls four input tiles, merges
// their layers and returns a decodable MapLibre Tile.
test('reprojects several input MLT tiles into one output tile', async ({ page }) => {
  test.setTimeout(300_000);
  await page.goto('/proj.html');
  await page.waitForFunction(() => (window as any).__projReady || (window as any).__projError);
  expect(await page.evaluate(() => (window as any).__projError ?? null)).toBeFalsy();

  const result = await page.evaluate(async () => {
    // Installing the plugin's import map is a precondition: it resolves '@maplibre/mlt' for the pipeline.
    await (window as any).__proj.reprojectStyle({ style: { version: 8, sources: {}, layers: [] }, crs: 'ESRI:54030' });
    const pipeline: any = await import('/_content/ProjPlugin/proj-pipeline.js');
    const mlt: any = await import('@maplibre/mlt');
    const projection = await pipeline.createProjection('ESRI:54030', null);
    const reprojectTile = pipeline.createTileReprojector(
      projection,
      ['http://127.0.0.1:4173/tiles/weather/{z}/{x}/{y}.mlt'],
      { sourceId: 'weather' });

    const output = await reprojectTile('reproj://http://127.0.0.1:4173/tiles/weather/1/0/0.mlt');
    const tables = mlt.decodeTile(output);
    const features = tables.flatMap((table: any) => table.getFeatures());
    return {
      bytes: output.byteLength,
      layers: tables.map((table: any) => table.name),
      features: features.length,
      finite: features.every((feature: any) => feature.geometry.coordinates
        .every((ring: any) => ring.every((p: any) => Number.isFinite(p.x) && Number.isFinite(p.y)))),
    };
  });

  expect(result.bytes).toBeGreaterThan(100);
  expect(result.layers).toEqual(['weather_grid_hourly']);
  expect(result.features).toBeGreaterThan(0);
  expect(result.finite).toBe(true);
});
