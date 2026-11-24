import { expect, test } from '@playwright/test';

// proj_create_crs_to_crs honours the declared axis order of a CRS, and several EPSG CRS list northing before
// easting: EPSG:3035 (LAEA Europe) and EPSG:3034 (LCC Europe) are (Y, X), EPSG:3414 (SVY21) is (N, E). The pipeline
// needs (easting, northing) on the projected side, so createProjection normalises both operations for visualisation.
//
// A transposed projection still round-trips (both directions use the same wrong convention), which is why the rest
// of the suite did not catch it: a fake *longitude* was driven by northing and a fake *latitude* by easting, so the
// map was rotated by 90 degrees. These assertions pin the direction of the mapping instead.
test('projected CRS with northing/easting axes are not transposed', async ({ page }) => {
  test.setTimeout(300_000);
  await page.goto('/proj.html');
  await page.waitForFunction(() => (window as any).__projReady || (window as any).__projError);
  expect(await page.evaluate(() => (window as any).__projError ?? null)).toBeFalsy();

  const results = await page.evaluate(async () => {
    const plugin = (window as any).__proj;
    // Installs the plugin's import map, which the pipeline needs for its own bare specifiers.
    await plugin.reprojectStyle({ style: { version: 8, sources: {}, layers: [] }, crs: 'ESRI:54030' });
    const pipeline: any = await import('/_content/ProjPlugin/proj-pipeline.js');

    const cases = [
      { crs: 'EPSG:3035', area: [-35, 20, 70, 85] },
      { crs: 'EPSG:3034', area: [-30, 25, 60, 75] },
      { crs: 'EPSG:3414', area: [103, 1, 104.5, 2] },
    ];

    const out: any[] = [];
    for (const { crs, area } of cases) {
      const projection = await pipeline.createProjection(crs, area);
      const [west, south, east, north] = area;
      const centerLon = (west + east) / 2;
      const centerLat = (south + north) / 2;
      const [base, northward, eastward] = await projection.toFake([
        [centerLon, centerLat],
        [centerLon, centerLat + (north - south) / 4],
        [centerLon + (east - west) / 4, centerLat],
      ]);

      out.push({
        crs,
        base,
        dLat: [northward[0] - base[0], northward[1] - base[1]],
        dLon: [eastward[0] - base[0], eastward[1] - base[1]],
      });
    }
    return out;
  });

  for (const item of results) {
    console.log(item.crs, JSON.stringify(item));

    // Going north must move the fake latitude more than the fake longitude, and vice versa. The factor is modest
    // on purpose: an oblique conic also tilts the grid, so a large eastward step legitimately changes the northing.
    // Transposed axes invert these two, which fails by a wide margin.
    expect(Math.abs(item.dLat[1]), `${item.crs} latitude axis`).toBeGreaterThan(Math.abs(item.dLat[0]) * 1.5);
    expect(Math.abs(item.dLon[0]), `${item.crs} longitude axis`).toBeGreaterThan(Math.abs(item.dLon[1]) * 1.5);

    // And with the right sign: north is up, east is right.
    expect(item.dLat[1], `${item.crs} north is up`).toBeGreaterThan(0);
    expect(item.dLon[0], `${item.crs} east is right`).toBeGreaterThan(0);
  }
});
