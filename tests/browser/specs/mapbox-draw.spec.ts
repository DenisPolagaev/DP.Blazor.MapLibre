import { expect, test } from '@playwright/test';

// The reference plugin from the examples solution: loads its UMD dependencies itself and cleans up.
test('mapbox draw reference plugin adds a control, a feature, and removes the control', async ({ page }) => {
  await page.goto('/mapbox-draw.html');
  await page.waitForFunction(() => (window as any).__ready || (window as any).__error);
  expect(await page.evaluate(() => (window as any).__error ?? null)).toBeNull();

  const outcome = await page.evaluate(async () => {
    const plugin = (window as any).__plugin;
    const map = (window as any).__map;
    const reference = { invokeMethodAsync: async () => undefined };

    await plugin.initialize(map, reference);
    plugin.addControl(map, {
      displayControlsDefault: false,
      controls: { point: true, polygon: true, trash: true },
      defaultMode: 'draw_polygon',
    });

    const added = document.querySelectorAll('.maplibregl-ctrl-group').length;

    plugin.addFeature(map, {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[[0, 0], [1, 0], [1, 1], [0, 0]]],
      },
    });

    plugin.removeControl(map);
    plugin.removeControl(map);

    return {
      added,
      afterRemove: document.querySelectorAll('.maplibregl-ctrl-group').length,
      drawsLoaded: Boolean((globalThis as any).MapboxDraw),
      turfLoaded: Boolean((globalThis as any).turf),
    };
  });

  expect(outcome.added).toBeGreaterThan(0);
  expect(outcome.afterRemove).toBe(0);
  expect(outcome.drawsLoaded).toBe(true);
  expect(outcome.turfLoaded).toBe(true);
});
