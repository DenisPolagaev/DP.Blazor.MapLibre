import { expect, test } from '@playwright/test';

// Polar projections have degenerate library world bounds; the plugin frames them by sampling
// the hemisphere. Verifies the camera ends up finite and not zoomed into a point.
test('polar CRS are framed by hemisphere sampling', async ({ page }) => {
  test.setTimeout(300_000);
  await page.goto('/proj.html');
  await page.waitForFunction(() => (window as any).__projReady || (window as any).__projError);
  expect(await page.evaluate(() => (window as any).__projError ?? null)).toBeFalsy();

  const cases = [
    { crs: 'EPSG:3413', area: [-180, 45, 180, 90] },
    { crs: 'EPSG:3576', area: [-180, 45, 180, 90] },
    { crs: 'EPSG:3995', area: [-180, 45, 180, 90] },
    { crs: 'EPSG:3031', area: [-180, -90, 180, -45] },
  ];

  for (const testCase of cases) {
    const info = await page.evaluate(async ({ crs, area }) => {
      const plugin = (window as any).__proj;
      const map = (window as any).__map;
      const style = {
        version: 8,
        sources: {
          vec: { type: 'vector', tiles: ['http://127.0.0.1:4173/tiles/{z}/{x}/{y}.pbf'] },
          pts: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-40, 80] } },
              ],
            },
          },
        },
        layers: [
          { id: 'vec', type: 'line', source: 'vec', 'source-layer': 'layer0' },
          { id: 'pts', type: 'circle', source: 'pts' },
        ],
      };

      try {
        const r = await plugin.applyReprojection({ style, crs, areaOfUse: area });
        await new Promise((resolve) => {
          if (map.isStyleLoaded()) resolve(null);
          else map.once('idle', () => resolve(null));
        });
        const center = map.getCenter();
        return {
          crs,
          ok: true,
          bounds: r.bounds,
          zoom: map.getZoom(),
          center: { lng: center.lng, lat: center.lat },
        };
      } catch (e: any) {
        return { crs, ok: false, error: String((e && (e.stack || e.message)) || e) };
      }
    }, testCase);

    console.log('POLAR', JSON.stringify(info));
    expect(info.ok, JSON.stringify(info)).toBe(true);

    const bounds = (info as any).bounds;
    const width = Math.abs(bounds._ne.lng - bounds._sw.lng);
    const height = Math.abs(bounds._ne.lat - bounds._sw.lat);
    expect(width).toBeGreaterThan(1e-3);
    expect(height).toBeGreaterThan(1e-3);
    expect(Number.isFinite((info as any).zoom)).toBe(true);
    expect((info as any).zoom).toBeLessThan(15);
    expect(Number.isFinite((info as any).center.lng)).toBe(true);
    expect(Number.isFinite((info as any).center.lat)).toBe(true);
  }
});
