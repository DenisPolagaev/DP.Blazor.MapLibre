import { expect, test } from '@playwright/test';

test.describe('Starfield plugin globe math', () => {
  test('resolveTransform uses public map accessors, not the removed Transform', async ({ page }) => {
    await page.goto('/');

    const result = await page.evaluate(async () => {
      const module = await import(
        '/_content/StarfieldPlugin/maplibre-gl-starfield-0.1.js'
      );
      const resolve = (map) =>
        module.MapLibreStarryBackground.prototype.resolveTransform.call({}, map);

      return {
        // MapLibre 6.19: no transform, camera state is not exposed on Map.
        publicApi: resolve({ getZoom: () => 3, getCenter: () => ({ lat: 55 }) }),
        six19: resolve({ getZoom: () => 2, getCenter: () => ({ lat: -10 }), camera: undefined }),
        // Legacy hosts that still expose the transform.
        legacyMethod: resolve({
          _getTransformForUpdate: () => ({ worldSize: 2048, center: { lat: 40 } }),
        }),
        legacyField: resolve({ transform: { worldSize: 1024, _center: { lat: 0 } } }),
        noSources: resolve({}),
        zoomThrows: resolve({ getZoom: () => { throw new Error('boom'); } }),
      };
    });

    expect(result.publicApi.worldSize).toBe(512 * Math.pow(2, 3));
    expect(result.publicApi.lat).toBe(55);
    expect(result.six19.worldSize).toBe(512 * Math.pow(2, 2));
    expect(result.six19.lat).toBe(-10);
    expect(result.legacyMethod).toEqual({ worldSize: 2048, lat: 40 });
    expect(result.legacyField).toEqual({ worldSize: 1024, lat: 0 });
    expect(result.noSources).toBeNull();
    expect(result.zoomThrows).toBeNull();
  });
});
