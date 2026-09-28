import { expect, test } from '@playwright/test';

const RAD = Math.PI / 180;
const R = 6378137;
const MERC_MAX = Math.PI * R;

function tileLocalToFake(z, x, y, px, py) {
  const size = (2 * MERC_MAX) / Math.pow(2, z);
  const mx = -MERC_MAX + x * size + (px / 4096) * size;
  const my = MERC_MAX - y * size - (py / 4096) * size;
  return [mx / R / RAD, (2 * Math.atan(Math.exp(my / R)) - Math.PI / 2) / RAD];
}

const radius = (p) => Math.hypot(p[0], p[1]);

test('Arctic projection geometry is correct', async ({ page }) => {
  test.setTimeout(300_000);
  await page.goto('/proj.html');
  await page.waitForFunction(() => (window as any).__projReady || (window as any).__projError);

  const geo = await page.evaluate(async () => {
    const plugin = (window as any).__proj;
    await plugin.reprojectStyle({ style: { version: 8, sources: {}, layers: [] }, crs: 'ESRI:54030' });
    const pipeline: any = await import('/_content/ProjPlugin/proj-pipeline.js');
    const projection = await pipeline.createProjection('EPSG:3413', [-180, 45, 180, 90]);

    const pole = (await projection.toFake([[0, 90]]))[0];
    const circle70 = await projection.toFake([[0, 70], [90, 70], [180, 70], [-90, 70]]);
    const r80 = (await projection.toFake([[0, 80]]))[0];
    const r60 = (await projection.toFake([[0, 60]]))[0];
    const edge45 = (await projection.toFake([[0, 45]]))[0];
    const outside = (await projection.toFake([[0, 40]]))[0];

    return {
      pole,
      radii70: circle70.map((p: number[]) => Math.hypot(p[0], p[1])),
      r80: Math.hypot(r80[0], r80[1]),
      r70: Math.hypot(circle70[0][0], circle70[0][1]),
      r60: Math.hypot(r60[0], r60[1]),
      r45: Math.hypot(edge45[0], edge45[1]),
      r40: Math.hypot(outside[0], outside[1]),
      outside,
    };
  });

  console.log('GEOM', JSON.stringify(geo));

  // Pole maps to the fake-space origin (center of the disc).
  expect(Math.abs(geo.pole[0])).toBeLessThan(0.5);
  expect(Math.abs(geo.pole[1])).toBeLessThan(0.5);

  // Parallels are circles around the pole: equal radius across longitudes.
  const rMin = Math.min(...geo.radii70);
  const rMax = Math.max(...geo.radii70);
  expect((rMax - rMin) / rMax).toBeLessThan(0.02);

  // Radius grows away from the pole.
  expect(geo.r80).toBeLessThan(geo.r70);
  expect(geo.r70).toBeLessThan(geo.r60);

  // Points south of the area of use are framed beyond the area edge.
  expect(geo.r40).toBeGreaterThan(geo.r45);
});

test('adjacent output tiles share edges consistently', async ({ page }) => {
  test.setTimeout(300_000);
  await page.goto('/proj.html');
  await page.waitForFunction(() => (window as any).__projReady || (window as any).__projError);

  const result = await page.evaluate(async () => {
    const plugin = (window as any).__proj;
    await plugin.reprojectStyle({ style: { version: 8, sources: {}, layers: [] }, crs: 'ESRI:54030' });
    const pipeline: any = await import('/_content/ProjPlugin/proj-pipeline.js');
    const projection = await pipeline.createProjection('EPSG:3413', [-180, 45, 180, 90]);

    const R = 6378137;
    const MERC_MAX = Math.PI * R;
    const RAD = Math.PI / 180;
    const fakeAt = (z: number, x: number, y: number, px: number, py: number) => {
      const size = (2 * MERC_MAX) / Math.pow(2, z);
      const mx = -MERC_MAX + x * size + (px / 4096) * size;
      const my = MERC_MAX - y * size - (py / 4096) * size;
      return [mx / R / RAD, (2 * Math.atan(Math.exp(my / R)) - Math.PI / 2) / RAD];
    };

    const z = 2;
    let mismatches = 0;
    let checked = 0;
    for (let x = 0; x < Math.pow(2, z) - 1; x++) {
      for (let y = 0; y < Math.pow(2, z); y++) {
        for (const py of [0, 1365, 2730, 4096]) {
          const aFake = fakeAt(z, x, y, 4096, py);
          const bFake = fakeAt(z, x + 1, y, 0, py);
          const [aReal] = await projection.toReal([aFake]);
          const [bReal] = await projection.toReal([bFake]);
          if (!Number.isFinite(aReal[0]) || !Number.isFinite(bReal[0])) {
            continue;
          }
          checked++;
          if (Math.abs(aReal[0] - bReal[0]) > 0.01 || Math.abs(aReal[1] - bReal[1]) > 0.01) {
            mismatches++;
          }
        }
      }
    }
    return { checked, mismatches };
  });

  console.log('EDGES', JSON.stringify(result));
  expect(result.checked).toBeGreaterThan(0);
  expect(result.mismatches).toBe(0);
});
