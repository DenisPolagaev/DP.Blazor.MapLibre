import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const version = fs
  .readFileSync(path.join(__dirname, '..', '..', '..', 'src', 'DP.Blazor.MapLibre', 'maplibre-gl.version'), 'utf8')
  .trim();

test.describe('prepareMapLibreGl loader suite', () => {
  test('loads the bundled ESM with a cache-busting query and starts the worker', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', (request) => requests.push(request.url()));

    await page.goto(`/prepare.html?v=${encodeURIComponent(version)}`);
    await page.waitForFunction(() => (window as any).__prepareReady === true);

    const prepareError = await page.evaluate(() => (window as any).__prepareError ?? null);
    expect(prepareError).toBeNull();

    const result = await page.evaluate(async () => {
      const gl = (globalThis as any).maplibregl;
      const map = new gl.Map({
        container: 'map',
        style: { version: 8, sources: {}, layers: [] },
        center: [0, 0],
        zoom: 1,
        attributionControl: false,
      });
      await map.once('load');
      map.remove();
      return { hasMap: typeof gl?.Map === 'function' };
    });

    expect(result.hasMap).toBe(true);
    expect(requests.some((url) => url.includes(`maplibre-gl.mjs?v=${version}`))).toBe(true);
    expect(requests.some((url) => url.includes(`maplibre-gl-worker.mjs?v=${version}`))).toBe(true);
  });

  test('exposes an extensible global for UMD plugins', async ({ page }) => {
    await page.goto(`/prepare.html?v=${encodeURIComponent(version)}`);
    await page.waitForFunction(() => (window as any).__prepareReady === true);

    const extensible = await page.evaluate(() => {
      const gl = (globalThis as any).maplibregl;
      gl.__pluginProbe = true;
      return Object.isExtensible(gl) && gl.__pluginProbe === true;
    });

    expect(extensible).toBe(true);
  });
});
