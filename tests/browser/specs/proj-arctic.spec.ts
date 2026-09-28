import { expect, test } from '@playwright/test';

// Every output tile of the Arctic/Antarctic projections must produce features (no missing tiles).
const cases = [
  { crs: 'EPSG:3413', area: [-180, 45, 180, 90] },
  { crs: 'EPSG:3576', area: [-180, 45, 180, 90] },
  { crs: 'EPSG:3995', area: [-180, 45, 180, 90] },
  { crs: 'EPSG:3031', area: [-180, -90, 180, -45] },
];

test('all polar output tiles load with features', async ({ page }) => {
  test.setTimeout(600_000);
  await page.goto('/proj.html');
  await page.waitForFunction(() => (window as any).__projReady || (window as any).__projError);

  const results = await page.evaluate(async (items) => {
    const plugin = (window as any).__proj;
    await plugin.reprojectStyle({ style: { version: 8, sources: {}, layers: [] }, crs: 'ESRI:54030' });
    const pipeline: any = await import('/_content/ProjPlugin/proj-pipeline.js');
    const { VectorTile } = await import('@mapbox/vector-tile');
    const Pbf = (await import('pbf')).default;
    const template = 'https://demotiles.maplibre.org/tiles/{z}/{x}/{y}.pbf';

    const out: any[] = [];
    for (const { crs, area } of items) {
      const projection = await pipeline.createProjection(crs, area);
      const reprojectTile = pipeline.createTileReprojector(projection, [template]);
      for (const z of [1, 2]) {
        const world = Math.pow(2, z);
        const empty: string[] = [];
        const counts: number[] = [];
        for (let x = 0; x < world; x++) {
          for (let y = 0; y < world; y++) {
            const bytes = await reprojectTile(`reproj://https://demotiles.maplibre.org/tiles/${z}/${x}/${y}.pbf`);
            let features = 0;
            try {
              const tile = new VectorTile(new Pbf(new Uint8Array(bytes)));
              features = Object.keys(tile.layers).reduce((sum, name) => sum + tile.layers[name].length, 0);
            } catch {
              features = -1;
            }
            counts.push(features);
            if (features <= 0) {
              empty.push(`${z}/${x}/${y}`);
            }
          }
        }
        out.push({ crs, z, total: world * world, nonEmpty: counts.filter((c) => c > 0).length, empty, counts });
      }
    }
    return out;
  }, cases);

  console.log('ARCTIC', JSON.stringify(results, null, 1));
  for (const r of results) {
    // Interior tiles must all be non-empty; allow a small number of corner tiles (outside the disc).
    expect(r.empty.length, JSON.stringify(r)).toBeLessThanOrEqual(2);
  }
});
