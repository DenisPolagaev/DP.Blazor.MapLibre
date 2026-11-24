import { expect, test } from '@playwright/test';

// CRS whose transformation wants a datum grid (NADCON for NAD83, OSTN15 for OSGB36, CHENyx06 for CH1903+) used to
// hang the map: PROJ 9 enables network lookups by default, the WASM build cannot fetch a grid, and the pending fetch
// blocked the main thread forever — for EPSG:5070 even a single coordinate was enough. The pipeline disables the
// network on its context, which leaves PROJ on the ballpark/Helmert fallback. A regression here is a freeze of the
// whole tab, hence the explicit budget.
const CASES = [
  { crs: 'EPSG:5070', point: [-77, 38.9], area: [-124.79, 24.41, -66.91, 49.38] },
  { crs: 'EPSG:27700', point: [-0.12, 51.5], area: [-8, 49, 2, 61] },
  { crs: 'EPSG:2056', point: [7.44, 46.95], area: [5, 45, 11, 48] },
];

test('datum-grid CRS project without blocking the main thread', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/proj.html');
  await page.waitForFunction(() => (window as any).__projReady || (window as any).__projError);
  expect(await page.evaluate(() => (window as any).__projError ?? null)).toBeFalsy();

  const results = await page.evaluate(async (cases) => {
    const plugin = (window as any).__proj;
    // Installs the plugin's import map, which the pipeline needs for its own bare specifiers.
    await plugin.reprojectStyle({ style: { version: 8, sources: {}, layers: [] }, crs: 'ESRI:54030' });
    const pipeline: any = await import('/_content/ProjPlugin/proj-pipeline.js');

    const out: any[] = [];
    for (const item of cases) {
      const projection = await pipeline.createProjection(item.crs, item.area);
      const fake = await projection.toFake([item.point]);
      const real = await projection.toReal(fake);
      out.push({
        crs: item.crs,
        finite: fake[0].every((value: number) => Number.isFinite(value)),
        dLon: Math.abs(real[0][0] - item.point[0]),
        dLat: Math.abs(real[0][1] - item.point[1]),
      });
    }
    return out;
  }, CASES);

  for (const result of results) {
    console.log(result.crs, JSON.stringify(result));
    expect(result.finite, `${result.crs} produced a finite fake coordinate`).toBe(true);
    // The reverse of the forward pipeline: a few centimetres of a ballpark datum shift, never a wild value.
    expect(result.dLon, `${result.crs} round-trip longitude`).toBeLessThan(0.01);
    expect(result.dLat, `${result.crs} round-trip latitude`).toBeLessThan(0.01);
  }
});
