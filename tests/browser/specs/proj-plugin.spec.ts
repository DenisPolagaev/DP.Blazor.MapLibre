import { expect, test } from '@playwright/test';

async function openHarness(page: import('@playwright/test').Page) {
  await page.goto('/proj.html');
  await page.waitForFunction(() => (window as any).__projReady || (window as any).__projError);
  const error = await page.evaluate(() => (window as any).__projError as string | undefined);
  expect(error, error).toBeFalsy();
}

test.describe('ProjPlugin', () => {
  test('reprojects a GeoJSON + vector source into ESRI:54030', async ({ page }) => {
    await openHarness(page);

    const result = await page.evaluate(async () => {
      const plugin = (window as any).__proj;
      const style = {
        version: 8,
        sources: {
          pts: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: { id: '1' },
                  geometry: { type: 'Point', coordinates: [-77.0, 38.9] },
                },
              ],
            },
          },
          vec: {
            type: 'vector',
            tiles: ['http://127.0.0.1:4173/tiles/{z}/{x}/{y}.pbf'],
          },
        },
        layers: [
          { id: 'pts', type: 'circle', source: 'pts' },
          { id: 'vec', type: 'line', source: 'vec', 'source-layer': 'layer0' },
        ],
      };

      const r = await plugin.reprojectStyle({ style, crs: 'ESRI:54030' });
      return {
        transformerId: r.transformerId,
        bounds: r.bounds,
        projection: r.style.projection,
        vectorTiles: r.style.sources.vec.tiles,
        pointCoords: r.style.sources.pts.data.features[0].geometry.coordinates,
        hasMaxBounds: !!r.maxBounds,
      };
    });

    expect(result.transformerId).toBeTruthy();
    expect(result.projection).toEqual({ type: 'mercator' });
    expect(result.vectorTiles[0]).toMatch(/^reproj-/);
    // Robinson puts the point somewhere other than its real lon/lat.
    expect(result.pointCoords[0]).not.toBeCloseTo(-77.0, 1);
    expect(Number.isFinite(result.bounds._sw.lng)).toBe(true);
    expect(Number.isFinite(result.bounds._ne.lat)).toBe(true);
  });

  test('inverseTransformCoords recovers real lon/lat', async ({ page }) => {
    await openHarness(page);

    const result = await page.evaluate(async () => {
      const plugin = (window as any).__proj;
      const style = {
        version: 8,
        sources: {
          pts: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: {},
                  geometry: { type: 'Point', coordinates: [-77.0, 38.9] },
                },
              ],
            },
          },
        },
        layers: [{ id: 'pts', type: 'circle', source: 'pts' }],
      };

      const r = await plugin.reprojectStyle({ style, crs: 'EPSG:5070' });
      const fake = r.style.sources.pts.data.features[0].geometry.coordinates;
      const real = await plugin.inverseTransformCoords([{ lng: fake[0], lat: fake[1] }], r.transformerId);
      const forward = await plugin.transformPoint({ lng: -77.0, lat: 38.9 }, r.transformerId);
      return { fake, real, forward };
    });

    expect(result.real[0].lng).toBeCloseTo(-77.0, 2);
    expect(result.real[0].lat).toBeCloseTo(38.9, 2);
    expect(Number.isFinite(result.forward.lng)).toBe(true);
    expect(Number.isFinite(result.forward.lat)).toBe(true);
    expect(result.forward.lng).toBeCloseTo(result.fake[0], 3);
    expect(result.forward.lat).toBeCloseTo(result.fake[1], 3);
  });

  test('applyReprojection sets style, maxBounds and fitBounds on the map', async ({ page }) => {
    await openHarness(page);

    const result = await page.evaluate(async () => {
      const plugin = (window as any).__proj;
      const map = (window as any).__map;
      const style = {
        version: 8,
        sources: {
          pts: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: {},
                  geometry: { type: 'Point', coordinates: [-77.0, 38.9] },
                },
              ],
            },
          },
        },
        layers: [{ id: 'pts', type: 'circle', source: 'pts' }],
      };

      const r = await plugin.applyReprojection({ style, crs: 'EPSG:5070' });
      await new Promise((resolve) => {
        if (map.isStyleLoaded()) resolve(null);
        else map.once('idle', () => resolve(null));
      });
      const applied = map.getStyle();
      return {
        transformerId: r.transformerId,
        projection: applied.projection,
        sourceIds: Object.keys(applied.sources),
        center: map.getCenter(),
      };
    });

    expect(result.projection).toEqual({ type: 'mercator' });
    expect(result.sourceIds).toContain('pts');
  });

  test('reprojectCurrentStyle expands TileJSON and drops raster sources', async ({ page }) => {
    await openHarness(page);

    const result = await page.evaluate(async () => {
      const plugin = (window as any).__proj;
      const map = (window as any).__map;

      const tilejson = {
        tiles: ['http://127.0.0.1:4173/tiles/{z}/{x}/{y}.pbf'],
        minzoom: 0,
        maxzoom: 5,
        attribution: 'test',
      };
      const tilejsonUrl = 'data:application/json,' + encodeURIComponent(JSON.stringify(tilejson));

      map.setStyle({
        version: 8,
        sources: {
          vec: { type: 'vector', url: tilejsonUrl },
          pm: { type: 'vector', url: 'pmtiles://http://127.0.0.1:4173/archive.pmtiles' },
          relief: {
            type: 'raster',
            tiles: ['http://127.0.0.1:4173/relief/{z}/{x}/{y}.png'],
            tileSize: 256,
          },
        },
        layers: [
          { id: 'relief-layer', type: 'raster', source: 'relief' },
          { id: 'pm-layer', type: 'line', source: 'pm', 'source-layer': 'layer0' },
          { id: 'vec-layer', type: 'line', source: 'vec', 'source-layer': 'layer0' },
        ],
      });
      await new Promise((resolve) => setTimeout(resolve, 300));

      const r = await plugin.reprojectCurrentStyle({ crs: 'ESRI:54030' });
      return {
        sourceIds: Object.keys(r.style.sources),
        vectorTiles: r.style.sources.vec?.tiles ?? null,
        pmTiles: r.style.sources.pm?.tiles ?? null,
        layerIds: r.style.layers.map((l: any) => l.id),
      };
    });

    expect(result.sourceIds).not.toContain('relief');
    expect(result.sourceIds).toContain('pm');
    expect(result.layerIds).not.toContain('relief-layer');
    expect(result.layerIds).toContain('pm-layer');
    expect(result.vectorTiles[0]).toMatch(/^reproj-/);
    expect(result.pmTiles[0]).toMatch(/^reproj-/);
  });

  test('reprojectSource rewrites vector tiles and geojson', async ({ page }) => {
    await openHarness(page);

    const result = await page.evaluate(async () => {
      const plugin = (window as any).__proj;

      const a = await plugin.reprojectSource({
        sourceId: 'layer-a',
        source: { type: 'vector', tiles: ['http://127.0.0.1:4173/a/{z}/{x}/{y}.pbf'] },
        crs: 'ESRI:54030',
      });

      const b = await plugin.reprojectSource({
        sourceId: 'layer-b',
        source: { type: 'vector', tiles: ['http://127.0.0.1:4173/b/{z}/{x}/{y}.pbf'] },
        crs: 'ESRI:54030',
      });

      const geo = await plugin.reprojectSource({
        sourceId: 'geo',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-77, 38.9] } },
            ],
          },
        },
        crs: 'ESRI:54030',
      });

      return {
        aTiles: a.source.tiles,
        bTiles: b.source.tiles,
        geoCoord: geo.source.data.features[0].geometry.coordinates,
      };
    });

    expect(result.aTiles[0]).toMatch(/^reproj-/);
    expect(result.bTiles[0]).toMatch(/^reproj-/);
    // Distinct layers must get distinct protocol handlers (not the first source's).
    expect(result.aTiles[0].split('://')[0]).not.toBe(result.bTiles[0].split('://')[0]);
    expect(result.geoCoord[0]).not.toBeCloseTo(-77, 1);
  });

  test('shutdownTileWorkers and getImportMap are wired', async ({ page }) => {
    await openHarness(page);

    const result = await page.evaluate(async () => {
      const plugin = (window as any).__proj;
      const importMap = plugin.getImportMap();
      await plugin.shutdownTileWorkers();
      return {
        entries: Object.keys(importMap.imports).length,
        projWasm: importMap.imports['proj-wasm'],
        wasmts: importMap.imports['@wcohen/wasmts'],
      };
    });

    expect(result.entries).toBeGreaterThan(10);
    expect(result.projWasm).toContain('_content/ProjPlugin/vendor/proj-wasm/');
    expect(result.wasmts).toContain('_content/ProjPlugin/vendor/wcohen-wasmts/');
  });
});
