import { expect, test } from '@playwright/test';

// Sweeps the projection catalog and reports CRS whose transformer build crashes the PROJ
// WASM worker ("memory access out of bounds") instead of failing cleanly.
test('every catalog CRS builds a transformer without crashing PROJ', async ({ page }) => {
  test.setTimeout(600_000);
  await page.goto('/proj.html');
  await page.waitForFunction(() => (window as any).__projReady || (window as any).__projError);
  const readyError = await page.evaluate(() => (window as any).__projError as string | undefined);
  expect(readyError, readyError).toBeFalsy();

  const codes = [
    'ESRI:54030', 'ESRI:54009', 'ESRI:54012', 'ESRI:54013', 'ESRI:54008',
    'ESRI:54032', 'ESRI:54029', 'ESRI:54016', 'ESRI:54034', 'ESRI:54010',
    'ESRI:54042', 'ESRI:54024', 'ESRI:54003', 'ESRI:54004', 'ESRI:54017',
    'EPSG:3035', 'EPSG:3034', 'EPSG:3395', 'EPSG:25832',
    'EPSG:25833', 'EPSG:25834', 'EPSG:5070', 'EPSG:2163', 'ESRI:102008',
    'ESRI:102003', 'ESRI:102010', 'EPSG:3832', 'EPSG:3414', 'EPSG:3577',
    'EPSG:3112', 'EPSG:32637',
    'EPSG:27700', 'EPSG:2154', 'EPSG:28992', 'EPSG:5514',
    'EPSG:2056', 'EPSG:32632',
  ];

  const results = await page.evaluate(async (crsCodes) => {
    const plugin = (window as any).__proj;
    const style = {
      version: 8,
      sources: {
        vec: {
          type: 'vector',
          tiles: ['http://127.0.0.1:4173/tiles/{z}/{x}/{y}.pbf'],
        },
        pts: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-77, 38.9] } },
            ],
          },
        },
      },
      layers: [
        { id: 'vec', type: 'line', source: 'vec', 'source-layer': 'layer0' },
        { id: 'pts', type: 'circle', source: 'pts' },
      ],
    };

    const out: { code: string; ok: boolean; error?: string }[] = [];
    for (const crs of crsCodes) {
      try {
        await Promise.race([
          plugin.reprojectStyle({ style, crs }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 15000)),
        ]);
        out.push({ code: crs, ok: true });
      } catch (e: any) {
        out.push({ code: crs, ok: false, error: String((e && (e.stack || e.message)) || e).slice(0, 200) });
      }
    }
    return out;
  }, codes);

  const failed = results.filter((r) => !r.ok);
  console.log('CATALOG RESULTS');
  console.log(JSON.stringify(failed, null, 2));
  expect(failed, JSON.stringify(failed, null, 2)).toEqual([]);
});
