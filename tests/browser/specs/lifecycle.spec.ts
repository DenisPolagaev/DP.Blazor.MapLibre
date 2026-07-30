import { expect, test } from '@playwright/test';

test.describe('MapLibre lifecycle suite', () => {
  test('repeated remount leaves no maps or listeners', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => !!window.__mapHarness);

    const result = await page.evaluate(async () => {
      const h = window.__mapHarness;
      const events = [];

      for (let i = 0; i < 100; i++) {
        const id = `map-${i}`;
        await h.createMap(id);
        const listenerId = h.on(id, 'move', (payload) => events.push(payload), null, 50);
        await h.applyViewState(id, {
          center: { lng: i % 10, lat: i % 5 },
          zoom: 2 + (i % 3),
          bearing: 0,
          pitch: 0,
        });
        h.off(id, listenerId);
        h.remove(id);
      }

      return {
        diagnostics: h.getLifecycleDiagnostics(),
        events: events.length,
      };
    });

    expect(result.diagnostics.maps).toBe(0);
    expect(result.diagnostics.listeners).toBe(0);
  });

  test('source setData, query, and cluster leaves work', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => !!window.__mapHarness);

    const result = await page.evaluate(async () => {
      const h = window.__mapHarness;
      await h.createMap('ops');

      await h.setGeoJson('ops', 'points', {
        type: 'FeatureCollection',
        features: Array.from({ length: 40 }, (_, index) => ({
          type: 'Feature',
          properties: { id: String(index) },
          geometry: {
            type: 'Point',
            coordinates: [(index % 8) * 0.1, Math.floor(index / 8) * 0.1],
          },
        })),
      });

      // Give the source a frame to re-cluster.
      await new Promise((resolve) => requestAnimationFrame(() => resolve()));

      const features = await h.queryRendered('ops', ['points-circle']);
      const source = window.maplibregl && null;
      void source;

      const map = document.querySelector('.maplibregl-canvas');
      const clusterFeatures = features.filter((f) => f.properties?.cluster);
      let leaves = [];
      if (clusterFeatures.length > 0) {
        leaves = await h.getClusterLeaves(
          'ops',
          'points',
          clusterFeatures[0].properties.cluster_id,
          25,
          0,
        );
      }

      h.remove('ops');
      return {
        hasCanvas: !!map,
        featureCount: features.length,
        leafCount: leaves.length,
        diagnostics: h.getLifecycleDiagnostics(),
      };
    });

    expect(result.hasCanvas).toBeTruthy();
    expect(result.featureCount).toBeGreaterThan(0);
    expect(result.diagnostics.maps).toBe(0);
    expect(result.diagnostics.listeners).toBe(0);
  });

  test('offAll cancels throttle timers before remove', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => !!window.__mapHarness);

    const result = await page.evaluate(async () => {
      const h = window.__mapHarness;
      await h.createMap('throttle');
      let calls = 0;
      h.on('throttle', 'mousemove', () => {
        calls += 1;
      }, null, 200);

      // Fire synthetic moves then tear down immediately.
      const canvas = document.querySelector('.maplibregl-canvas');
      for (let i = 0; i < 5; i++) {
        canvas.dispatchEvent(new MouseEvent('mousemove', { clientX: i, clientY: i, bubbles: true }));
      }

      h.remove('throttle');
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        calls,
        diagnostics: h.getLifecycleDiagnostics(),
      };
    });

    expect(result.diagnostics.maps).toBe(0);
    expect(result.diagnostics.listeners).toBe(0);
  });

  test('interaction handlers and image source coordinates APIs exist', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => !!window.__mapHarness);

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
          layers: [
            {
              id: 'overlay',
              type: 'raster',
              source: 'overlay',
            },
          ],
        },
        center: [0, 0],
        zoom: 1,
        attributionControl: false,
      });

      await map.once('load');

      map.dragPan.disable();
      map.scrollZoom.disable();
      map.cooperativeGestures.enable();

      const source = map.getSource('overlay');
      source.setCoordinates([
        [-5, 5],
        [5, 5],
        [5, -5],
        [-5, -5],
      ]);

      const state = {
        dragPan: map.dragPan.isEnabled(),
        scrollZoom: map.scrollZoom.isEnabled(),
        cooperativeGestures: map.cooperativeGestures.isEnabled(),
        hasSetCoordinates: typeof source.setCoordinates === 'function',
        hasUpdateImage: typeof source.updateImage === 'function',
      };

      map.remove();
      return state;
    });

    expect(result.dragPan).toBe(false);
    expect(result.scrollZoom).toBe(false);
    expect(result.cooperativeGestures).toBe(true);
    expect(result.hasSetCoordinates).toBe(true);
    expect(result.hasUpdateImage).toBe(true);
  });

  test('plugin-like control remount leaves no leftover control DOM', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => !!window.__mapHarness);

    const result = await page.evaluate(async () => {
      const create = async (id) => {
        const map = new maplibregl.Map({
          container: 'map',
          style: { version: 8, sources: {}, layers: [] },
          center: [0, 0],
          zoom: 1,
          attributionControl: false,
        });
        await map.once('load');

        const controlRoot = document.createElement('div');
        controlRoot.className = 'fake-plugin-control';
        controlRoot.dataset.pluginId = id;
        controlRoot.textContent = id;

        const control = {
          onAdd() {
            return controlRoot;
          },
          onRemove() {
            controlRoot.remove();
          },
        };

        map.addControl(control, 'top-right');
        return { map, controlRoot };
      };

      for (let i = 0; i < 20; i++) {
        const { map } = await create(`plugin-${i}`);
        map.remove();
      }

      return {
        leftoverControls: document.querySelectorAll('.fake-plugin-control').length,
        leftoverCanvases: document.querySelectorAll('.maplibregl-canvas').length,
      };
    });

    expect(result.leftoverControls).toBe(0);
    expect(result.leftoverCanvases).toBe(0);
  });
});
