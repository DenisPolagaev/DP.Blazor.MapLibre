import { expect, test } from '@playwright/test';

test.describe('MapLibre 6.2 contract suite', () => {
  test('map options accept v6 names and time API is top-level', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => !!window.maplibregl);

    const result = await page.evaluate(async () => {
      const map = new maplibregl.Map({
        container: 'map',
        style: { version: 8, sources: {}, layers: [] },
        center: [0, 0],
        zoom: 1,
        attributionControl: false,
        zoomLevelsToOverscale: 4,
        rotateSpeed: 0.8,
        pitchSpeed: -0.5,
        anisotropicFilterPitch: 20,
        terrainSkirtLength: 'auto',
        aroundCenter: true,
      });
      await map.once('load');

      const hasSetNow = typeof maplibregl.setNow === 'function';
      const hasRestoreNow = typeof maplibregl.restoreNow === 'function';
      const hasIsTimeFrozen = typeof maplibregl.isTimeFrozen === 'function';
      const hasLegacyTimeControl = !!maplibregl.timeControl;

      if (hasSetNow) {
        maplibregl.setNow(1_700_000_000_000);
      }
      const frozen = hasIsTimeFrozen ? maplibregl.isTimeFrozen() : null;
      if (hasRestoreNow) {
        maplibregl.restoreNow();
      }

      map.remove();
      return {
        hasSetNow,
        hasRestoreNow,
        hasIsTimeFrozen,
        hasLegacyTimeControl,
        frozen,
      };
    });

    expect(result.hasSetNow).toBe(true);
    expect(result.hasRestoreNow).toBe(true);
    expect(result.hasIsTimeFrozen).toBe(true);
    expect(result.hasLegacyTimeControl).toBe(false);
    expect(result.frozen).toBe(true);
  });

  test('geojson cluster options and bounds match wrapper contracts', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => !!window.__mapHarness);

    const result = await page.evaluate(async () => {
      const h = window.__mapHarness;
      await h.createMap('contract');

      await h.setGeoJson('contract', 'points', {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { id: 'a' },
            geometry: { type: 'Point', coordinates: [1, 2] },
          },
          {
            type: 'Feature',
            properties: { id: 'b' },
            geometry: { type: 'Point', coordinates: [3, 4] },
          },
        ],
      });

      const clusterOptions = await h.getClusterOptions('contract', 'points');
      const bounds = await h.getGeoJsonBounds('contract', 'points');

      h.remove('contract');
      return {
        clusterOptions,
        bounds,
        clusterKeys: Object.keys(clusterOptions ?? {}).sort(),
      };
    });

    expect(result.clusterKeys).toEqual(['cluster', 'clusterMaxZoom', 'clusterRadius']);
    expect(result.clusterOptions.cluster).toBe(true);
    expect(result.bounds._sw.lng).toBeDefined();
    expect(result.bounds._sw.lat).toBeDefined();
    expect(result.bounds._ne.lng).toBeDefined();
    expect(result.bounds._ne.lat).toBeDefined();
  });

  test('compact sourcedata DTO includes MapLibre 6 fields', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => !!window.__mapHarness);

    const result = await page.evaluate(() => {
      const h = window.__mapHarness;
      const synthetic = h.createCompactMapEventDto({
        type: 'sourcedata',
        dataType: 'source',
        isSourceLoaded: true,
        sourceId: 'points',
        sourceDataType: 'content',
        sourceDataChanged: true,
        tile: { tileID: { canonical: { z: 2, x: 3, y: 4 } } },
      });

      return {
        keys: Object.keys(synthetic).sort(),
        synthetic,
      };
    });

    for (const key of [
      'type',
      'dataType',
      'isSourceLoaded',
      'sourceId',
      'sourceDataType',
      'sourceDataChanged',
      'tile',
      'newProjection',
      'id',
    ]) {
      expect(result.keys).toContain(key);
    }
    expect(result.synthetic.sourceId).toBe('points');
    expect(result.synthetic.sourceDataType).toBe('content');
    expect(result.synthetic.tile).toEqual({ z: 2, x: 3, y: 4 });
  });

  test('image source updateImage accepts url+coordinates like UpdateImageSourceOptions', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => !!window.maplibregl);

    const result = await page.evaluate(async () => {
      const map = new maplibregl.Map({
        container: 'map',
        style: {
          version: 8,
          sources: {
            overlay: {
              type: 'image',
              url: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
              coordinates: [
                [-10, 10],
                [10, 10],
                [10, -10],
                [-10, -10],
              ],
            },
          },
          layers: [{ id: 'overlay', type: 'raster', source: 'overlay' }],
        },
        center: [0, 0],
        zoom: 1,
        attributionControl: false,
      });
      await map.once('load');

      const source = map.getSource('overlay');
      await source.updateImage({
        url: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
        coordinates: [
          [-5, 5],
          [5, 5],
          [5, -5],
          [-5, -5],
        ],
      });

      map.remove();
      return { ok: true };
    });

    expect(result.ok).toBe(true);
  });

  test('FullscreenControl accepts pseudo option', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => !!window.maplibregl);

    const result = await page.evaluate(async () => {
      const map = new maplibregl.Map({
        container: 'map',
        style: { version: 8, sources: {}, layers: [] },
        center: [0, 0],
        zoom: 1,
        attributionControl: false,
      });
      await map.once('load');
      map.addControl(new maplibregl.FullscreenControl({ pseudo: true }), 'top-right');
      const hasControl = document.querySelector('.maplibregl-ctrl-fullscreen') != null;
      map.remove();
      return { hasControl };
    });

    expect(result.hasControl).toBe(true);
  });
});
