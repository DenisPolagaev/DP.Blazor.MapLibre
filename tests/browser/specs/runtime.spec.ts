import { expect, test } from '@playwright/test';

// These checks run the real MapLibre.razor.js (see fixtures/runtime.html), not a copy.
test.describe('MapLibre runtime (real module)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/runtime.html');
    await page.waitForFunction(() => (window as any).__ready || (window as any).__error);
    expect(await page.evaluate(() => (window as any).__error ?? null)).toBeNull();
    await page.evaluate(() => new Promise((resolve) => {
      const map = (window as any).__map;
      if (map.isStyleLoaded()) {
        resolve(null);
      } else {
        map.once('style.load', () => resolve(null));
      }
    }));
  });

  test('executeTransaction applies the valid operations and reports each failed one', async ({ page }) => {
    const outcome = await page.evaluate(async () => {
      const api = (window as any).__api;
      const map = (window as any).__map;
      let message: string | null = null;
      try {
        await api.executeTransaction('map', [
          { event: 'addSource', data: ['src', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } }] },
          { event: 'noSuchOperation', data: [] },
          { event: 'addLayer', data: [{ id: 'lyr', type: 'circle', source: 'src' }, null] },
        ]);
      } catch (error) {
        message = String((error as Error).message);
      }

      return { message, hasLayer: Boolean(map.getLayer('lyr')) };
    });

    expect(outcome.message).toContain('1 of 3 operation(s) failed');
    expect(outcome.message).toContain('noSuchOperation');
    expect(outcome.hasLayer).toBe(true);
  });

  test('easeTo turns easingCurve samples into an easing function and drops the curve', async ({ page }) => {
    const captured = await page.evaluate(() => {
      const api = (window as any).__api;
      const map = (window as any).__map;
      let received: any = null;
      const original = map.easeTo;
      map.easeTo = (options: any) => {
        received = options;
        return map;
      };

      try {
        api.easeTo('map', { zoom: 3, easingCurve: [0, 0.25, 1] }, null);
      } finally {
        map.easeTo = original;
      }

      return {
        hasCurve: 'easingCurve' in received,
        zoom: received.zoom,
        atStart: received.easing(0),
        atMiddle: received.easing(0.5),
        quarter: received.easing(0.25),
        atEnd: received.easing(1),
      };
    });

    expect(captured.hasCurve).toBe(false);
    expect(captured.zoom).toBe(3);
    expect(captured.atStart).toBe(0);
    expect(captured.atMiddle).toBeCloseTo(0.25, 9);
    expect(captured.quarter).toBeCloseTo(0.125, 9);
    expect(captured.atEnd).toBe(1);
  });

  test('invokeMarker forwards only allow-listed methods and exposes the marker element', async ({ page }) => {
    const outcome = await page.evaluate(async () => {
      const api = (window as any).__api;
      api.createMarker('map', 'marker-1', {}, { lng: 1, lat: 2 });

      const position = await api.invokeMarker('marker-1', 'getLngLat', []);

      let rejected: string | null = null;
      try {
        await api.invokeMarker('marker-1', 'remove', []);
      } catch (error) {
        rejected = String((error as Error).message);
      }

      const element = await api.invokeMarker('marker-1', 'getElement', []);
      return { position, rejected, isElement: element instanceof HTMLElement };
    });

    expect(outcome.position).toEqual({ lng: 1, lat: 2 });
    expect(outcome.rejected).toContain('not supported');
    expect(outcome.isElement).toBe(true);
  });

  test('getRtlTextPluginStatus reports a known status', async ({ page }) => {
    const status = await page.evaluate(() => (window as any).__api.getRtlTextPluginStatus());

    expect(['unavailable', 'deferred', 'requested', 'loading', 'loaded', 'error']).toContain(status);
  });
});
