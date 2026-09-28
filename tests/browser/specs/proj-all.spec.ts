import { expect, test } from '@playwright/test';

// Every catalog projection: builds a transform, produces usable fake bounds, and round-trips
// a real coordinate through real -> fake -> real.
const catalog = [
  { code: 'ESRI:54030' }, { code: 'ESRI:54009' }, { code: 'ESRI:54012' }, { code: 'ESRI:54013' },
  { code: 'ESRI:54008' }, { code: 'ESRI:54032' }, { code: 'ESRI:54029' }, { code: 'ESRI:54016' },
  { code: 'ESRI:54034' }, { code: 'ESRI:54010' }, { code: 'ESRI:54042' }, { code: 'ESRI:54024' },
  { code: 'ESRI:54003' }, { code: 'ESRI:54004' }, { code: 'ESRI:54017' },
  { code: 'EPSG:3035', area: [-35, 20, 70, 85] }, { code: 'EPSG:3034', area: [-30, 25, 60, 75] },
  { code: 'EPSG:3395' }, { code: 'EPSG:25832', area: [6, 30, 12, 84] },
  { code: 'EPSG:25833', area: [12, 30, 18, 84] }, { code: 'EPSG:25834', area: [18, 30, 24, 84] },
  { code: 'EPSG:5070', area: [-130, 20, -60, 55] }, { code: 'EPSG:2163', area: [-180, 10, -50, 75] },
  { code: 'ESRI:102008', area: [-180, 10, -40, 85] }, { code: 'ESRI:102003', area: [-130, 20, -60, 55] },
  { code: 'ESRI:102010', area: [-180, 10, -40, 85] },
  { code: 'EPSG:3832' }, { code: 'EPSG:3414', area: [103, 1, 104.5, 2] },
  { code: 'EPSG:3577', area: [112, -44, 154, -10] }, { code: 'EPSG:3112', area: [112, -44, 154, -10] },
  { code: 'EPSG:32637', area: [33, 0, 39, 84] },
  { code: 'EPSG:3413', area: [-180, 45, 180, 90] }, { code: 'EPSG:3576', area: [-180, 45, 180, 90] },
  { code: 'EPSG:3995', area: [-180, 45, 180, 90] }, { code: 'EPSG:3031', area: [-180, -90, 180, -45] },
  { code: 'EPSG:27700', area: [-8, 49, 2, 61] }, { code: 'EPSG:2154', area: [-10, 41, 10, 52] },
  { code: 'EPSG:28992', area: [3, 50, 8, 54] }, { code: 'EPSG:5514', area: [12, 48, 19, 51] },
  { code: 'EPSG:2056', area: [5, 45, 11, 48] }, { code: 'EPSG:32632', area: [6, 0, 12, 84] },
];

test('every catalog projection builds, bounds are usable, and round-trips', async ({ page }) => {
  test.setTimeout(600_000);
  await page.goto('/proj.html');
  await page.waitForFunction(() => (window as any).__projReady || (window as any).__projError);
  expect(await page.evaluate(() => (window as any).__projError ?? null)).toBeFalsy();

  const results = await page.evaluate(async (items) => {
    const plugin = (window as any).__proj;
    await plugin.reprojectStyle({ style: { version: 8, sources: {}, layers: [] }, crs: 'ESRI:54030' });
    const pipeline: any = await import('/_content/ProjPlugin/proj-pipeline.js');
    const { VectorTile } = await import('@mapbox/vector-tile');
    const Pbf = (await import('pbf')).default;
    const template = 'https://demotiles.maplibre.org/tiles/{z}/{x}/{y}.pbf';

    const out: any[] = [];
    for (const item of items) {
      const { code, area } = item;
      try {
        const projection = await pipeline.createProjection(code, area);
        const bounds = projection.bounds;
        const width = bounds ? Math.abs(bounds[1][0] - bounds[0][0]) : 0;
        const height = bounds ? Math.abs(bounds[1][1] - bounds[0][1]) : 0;

        const point = area
          ? [(area[0] + area[2]) / 2, (area[1] + area[3]) / 2]
          : [20, 30];
        const fake = await projection.toFake([point]);
        const real = await projection.toReal(fake);
        const roundTrip = {
          dLon: Math.abs(((real[0][0] - point[0] + 540) % 360) - 180),
          dLat: Math.abs(real[0][1] - point[1]),
        };

        // Reproject a real tile; must not throw (feature count depends on data coverage).
        const reprojectTile = pipeline.createTileReprojector(projection, [template]);
        const bytes = await reprojectTile('reproj://https://demotiles.maplibre.org/tiles/1/0/0.pbf');
        let features = 0;
        try {
          const tile = new VectorTile(new Pbf(new Uint8Array(bytes)));
          features = Object.keys(tile.layers).reduce((sum, name) => sum + tile.layers[name].length, 0);
        } catch {
          features = -1;
        }

        out.push({
          code,
          ok: true,
          boundsOk: width > 1e-6 && height > 1e-6,
          fake: fake[0],
          roundTrip,
          features,
        });
      } catch (e: any) {
        out.push({ code, ok: false, error: String((e && (e.stack || e.message)) || e).slice(0, 160) });
      }
    }
    return out;
  }, catalog);

  const failures = results.filter((r) => !r.ok || !r.boundsOk || r.roundTrip.dLon > 0.05 || r.roundTrip.dLat > 0.05);
  console.log('ALLPROJ', JSON.stringify(failures, null, 1));
  expect(failures, JSON.stringify(failures, null, 1)).toEqual([]);
});
