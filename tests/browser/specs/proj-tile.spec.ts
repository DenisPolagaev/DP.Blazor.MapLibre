import { expect, test } from '@playwright/test';

// End-to-end: fetch a real MVT tile, reproject it for several CRS (incl. polar), decode the
// produced PBF and check it contains features.
test('reprojects real vector tiles end-to-end across CRS', async ({ page }) => {
  test.setTimeout(600_000);
  await page.goto('/proj.html');
  await page.waitForFunction(() => (window as any).__projReady || (window as any).__projError);
  expect(await page.evaluate(() => (window as any).__projError ?? null)).toBeFalsy();

  const crsList = [
    { crs: 'ESRI:54030' },
    { crs: 'EPSG:5070', area: [-130, 20, -60, 55] },
    { crs: 'EPSG:3413', area: [-180, 45, 180, 90] },
    { crs: 'EPSG:3576', area: [-180, 45, 180, 90] },
    { crs: 'EPSG:3995', area: [-180, 45, 180, 90] },
    { crs: 'EPSG:3031', area: [-180, -90, 180, -45] },
  ];

  const results = await page.evaluate(async (crsCodes) => {
    const plugin = (window as any).__proj;
    await plugin.reprojectStyle({ style: { version: 8, sources: {}, layers: [] }, crs: 'ESRI:54030' });

    const pipeline: any = await import('/_content/ProjPlugin/proj-pipeline.js');
    const { VectorTile } = await import('@mapbox/vector-tile');
    const Pbf = (await import('pbf')).default;
    const template = 'https://demotiles.maplibre.org/tiles/{z}/{x}/{y}.pbf';

    const out: any[] = [];
    for (const item of crsCodes) {
      const { crs, area } = item;
      try {
        const projection = await pipeline.createProjection(crs, area);
        const reprojectTile = pipeline.createTileReprojector(projection, [template]);
        const bytes = await reprojectTile('reproj://https://demotiles.maplibre.org/tiles/0/0/0.pbf');
        const tile = new VectorTile(new Pbf(new Uint8Array(bytes)));
        const total = Object.keys(tile.layers).reduce((sum, name) => sum + tile.layers[name].length, 0);
        out.push({ crs, bytes: bytes.byteLength, features: total, bounds: projection.bounds });
      } catch (e: any) {
        out.push({ crs, error: String((e && (e.stack || e.message)) || e).slice(0, 200) });
      }
    }
    return out;
  }, crsList);

  console.log('TILES', JSON.stringify(results, null, 1));
  for (const r of results) {
    expect(r.error, JSON.stringify(r)).toBeFalsy();
    expect(r.bytes, JSON.stringify(r)).toBeGreaterThan(100);
    expect(r.features, JSON.stringify(r)).toBeGreaterThan(0);
  }
});
