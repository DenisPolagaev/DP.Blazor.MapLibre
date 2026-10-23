import { expect, test } from '@playwright/test';

// Runs each plugin module the way a Blazor host loads it (see fixtures/plugins.html).
test.describe('plugin modules (real MapLibre bundle)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/plugins.html');
    await page.waitForFunction(() => (window as any).__ready || (window as any).__error);
    expect(await page.evaluate(() => (window as any).__error ?? null)).toBeNull();
  });

  test('framerate adds and removes its control', async ({ page }) => {
    const outcome = await page.evaluate(async () => {
      const plugin = (window as any).__plugins.framerate;
      const map = (window as any).__map;
      await plugin.initialize(map);
      await plugin.addControl(map, { barWidth: 4, graphHeight: 20 }, 'top-left');
      const added = document.querySelectorAll('.maplibregl-ctrl-fps').length;
      plugin.removeControl(map);
      return { added, removed: document.querySelectorAll('.maplibregl-ctrl-fps').length };
    });

    expect(outcome.added).toBeGreaterThan(0);
    expect(outcome.removed).toBe(0);
  });

  test('minimap adds and removes its control', async ({ page }) => {
    const outcome = await page.evaluate(async () => {
      const plugin = (window as any).__plugins.minimap;
      const map = (window as any).__map;
      await plugin.initialize(map);
      await plugin.addControl(map, { width: '120px', height: '90px' }, 'bottom-left');
      const added = document.querySelectorAll('.maplibregl-ctrl-minimap').length;
      plugin.removeControl(map);
      return { added, removed: document.querySelectorAll('.maplibregl-ctrl-minimap').length };
    });

    expect(outcome.added).toBeGreaterThan(0);
    expect(outcome.removed).toBe(0);
  });

  test('geogrid adds and removes its layers without a manual stylesheet link', async ({ page }) => {
    const outcome = await page.evaluate(async () => {
      const plugin = (window as any).__plugins.geogrid;
      const map = (window as any).__map;
      await plugin.initialize();
      plugin.add(map, { gridDensityDegrees: 10 });
      await new Promise((resolve) => {
        if (map.loaded()) {
          resolve(null);
        } else {
          map.once('idle', () => resolve(null));
        }
      });
      const layers = ['geo-grid_parallers', 'geo-grid_meridians'].filter((id) => Boolean(map.getLayer(id)));
      const stylesheet = document.querySelector('link[data-maplibre-asset="geogrid"]')
        ?? Array.from(document.querySelectorAll('link')).find((link) => link.href.includes('geogrid.css'));
      plugin.remove(map);
      const afterRemove = ['geo-grid_parallers', 'geo-grid_meridians'].filter((id) => Boolean(map.getLayer(id)));
      return { layers, afterRemove, hasStylesheet: Boolean(stylesheet) };
    });

    expect(outcome.layers).toHaveLength(2);
    expect(outcome.afterRemove).toHaveLength(0);
    expect(outcome.hasStylesheet).toBe(true);
  });

  test('compare creates the slider between two maps and removes it', async ({ page }) => {
    const outcome = await page.evaluate(async () => {
      const plugin = (window as any).__plugins.compare;
      const settings = { mousemove: false, orientation: 'vertical', handle: {} };
      await plugin.initialize();
      const ready = plugin.mapsReady('map', 'map2');

      const instanceKey = 'spec-instance';
      await plugin.createCompare('map', 'map2', instanceKey, '#cmp', settings);
      const created = document.querySelectorAll('.maplibregl-compare').length;

      plugin.setSlider('map', instanceKey, 240);
      const position = plugin.getCurrentPosition('map', instanceKey);
      const state = plugin.getSliderState('map', instanceKey);

      plugin.remove('map', instanceKey);
      plugin.dispose('map', instanceKey);

      return { ready, created, position, state, afterRemove: document.querySelectorAll('.maplibregl-compare').length };
    });

    expect(outcome.ready).toBe(true);
    expect(outcome.created).toBeGreaterThan(0);
    expect(outcome.position).toBeCloseTo(240, 0);
    expect(outcome.state.ratio).toBeGreaterThan(0);
    expect(outcome.afterRemove).toBe(0);
  });

  test('starfield attaches and detaches its backdrop layers', async ({ page }) => {
    const outcome = await page.evaluate(async () => {
      const plugin = (window as any).__plugins.starfield;
      const map = (window as any).__map;
      await plugin.initialize(map);
      plugin.attach(map, { starCount: 20, glowIntensity: 0.5 });
      const attached = {
        layer: document.querySelectorAll('.maplibre-starfield-layer').length,
        glow: document.querySelectorAll('.maplibre-starfield-glow').length,
      };

      plugin.detach(map);
      plugin.dispose(map);
      return {
        attached,
        detached: {
          layer: document.querySelectorAll('.maplibre-starfield-layer').length,
          glow: document.querySelectorAll('.maplibre-starfield-glow').length,
        },
      };
    });

    expect(outcome.attached.layer).toBeGreaterThan(0);
    expect(outcome.attached.glow).toBeGreaterThan(0);
    expect(outcome.detached.layer).toBe(0);
    expect(outcome.detached.glow).toBe(0);
  });

  test('pmtiles initializes idempotently and releases the protocol on the last dispose', async ({ page }) => {
    const outcome = await page.evaluate(async () => {
      const plugin = (window as any).__plugins.pmtiles;
      await Promise.all([plugin.initialize(), plugin.initialize()]);
      await plugin.initialize();
      plugin.dispose();
      plugin.dispose();
      return 'ok';
    });

    expect(outcome).toBe('ok');
  });

  test('terradraw exposes defaults and manages control ids', async ({ page }) => {
    const outcome = await page.evaluate(async () => {
      const plugin = (window as any).__plugins.terradraw;
      const map = (window as any).__map;
      await plugin.initialize(map);

      const defaults = plugin.getDefaultControlOptions();
      const before = plugin.getControlIds(map);

      const controlId = await plugin.addControl(map, 'draw', {}, 'top-left', 'spec-control');
      const afterAdd = plugin.getControlIds(map);
      const type = plugin.getControlType(map, controlId);

      plugin.removeControl(map, controlId);
      const afterRemove = plugin.getControlIds(map);

      return {
        defaultsIsObject: Boolean(defaults) && typeof defaults === 'object',
        before,
        afterAdd,
        type,
        afterRemove,
      };
    });

    expect(outcome.defaultsIsObject).toBe(true);
    expect(outcome.before).toHaveLength(0);
    expect(outcome.afterAdd).toEqual(['spec-control']);
    expect(outcome.type).toBe('draw');
    expect(outcome.afterRemove).toHaveLength(0);
  });
});
