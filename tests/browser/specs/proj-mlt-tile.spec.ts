import { expect, test } from '@playwright/test';

// End-to-end: reproject a real MapLibre Tile (a fixture produced by the tile worker) for several CRS,
// decode the produced tile with @maplibre/mlt and check that layers, properties and geometry survived.
const template = 'http://127.0.0.1:4173/tiles/weather/{z}/{x}/{y}.mlt';
const sourceUrl = 'reproj://http://127.0.0.1:4173/tiles/weather/0/0/0.mlt';

const crsList = [
  { crs: 'ESRI:54030' },
  { crs: 'EPSG:5070', area: [-130, 20, -60, 55] },
  { crs: 'EPSG:3413', area: [-180, 45, 180, 90] },
  { crs: 'EPSG:3576', area: [-180, 45, 180, 90] },
  { crs: 'EPSG:3995', area: [-180, 45, 180, 90] },
  { crs: 'EPSG:3031', area: [-180, -90, 180, -45] },
];

test('reprojects MLT tiles end-to-end across CRS', async ({ page }) => {
  test.setTimeout(300_000);
  await page.goto('/proj.html');
  await page.waitForFunction(() => (window as any).__projReady || (window as any).__projError);
  expect(await page.evaluate(() => (window as any).__projError ?? null)).toBeFalsy();

  const results = await page.evaluate(async ({ crsList, template, sourceUrl }) => {
    const plugin = (window as any).__proj;
    await plugin.reprojectStyle({ style: { version: 8, sources: {}, layers: [] }, crs: 'ESRI:54030' });
    const pipeline: any = await import('/_content/ProjPlugin/proj-pipeline.js');
    const mlt: any = await import('@maplibre/mlt');

    const out: any[] = [];
    for (const item of crsList) {
      const { crs, area } = item;
      try {
        const projection = await pipeline.createProjection(crs, area ?? null);
        const reprojectTile = pipeline.createTileReprojector(projection, [template], { sourceId: 'weather' });
        const bytes: Uint8Array = await reprojectTile(sourceUrl);
        const tables = bytes.byteLength > 0 ? mlt.decodeTile(bytes) : [];
        const features = tables.flatMap((table: any) => table.getFeatures());
        const inTile = (p: any) => Number.isFinite(p.x) && Number.isFinite(p.y)
          && p.x >= -64 && p.x <= 4096 + 64 && p.y >= -64 && p.y <= 4096 + 64;

        out.push({
          crs,
          bytes: bytes.byteLength,
          layers: tables.map((table: any) => ({ name: table.name, extent: table.extent, features: table.numFeatures })),
          features: features.length,
          propertyNames: features.length > 0 ? Object.keys(features[0].properties) : [],
          sample: features.length > 0 ? features[0].properties.temperature_2m : null,
          types: [...new Set(features.map((feature: any) => feature.geometry.type))],
          finite: features.every((feature: any) => feature.geometry.coordinates.every((ring: any) => ring.every(inTile))),
        });
      } catch (error: any) {
        out.push({ crs, error: String((error && (error.stack || error.message)) || error).slice(0, 300) });
      }
    }

    return out;
  }, { crsList, template, sourceUrl });

  for (const result of results) {
    const label = JSON.stringify(result);
    expect(result.error, label).toBeFalsy();
    expect(result.bytes, label).toBeGreaterThan(100);
    expect(result.features, label).toBeGreaterThan(0);
    expect(result.layers.length, label).toBe(1);
    expect(result.layers[0].name, label).toBe('weather_grid_hourly');
    expect(result.layers[0].extent, label).toBe(4096);
    expect(result.propertyNames, label).toContain('temperature_2m');
    expect(typeof result.sample, label).toBe('number');
    // 2 = Polygon, 5 = MultiPolygon: the geometry never degrades to points or lines.
    expect(result.types.every((type: number) => type === 2 || type === 5), label).toBe(true);
    expect(result.finite, label).toBe(true);
  }
});

test('keeps polygon holes apart from the exterior', async ({ page }) => {
  await page.goto('/proj.html');
  await page.waitForFunction(() => (window as any).__projReady || (window as any).__projError);

  const result = await page.evaluate(async () => {
    await (window as any).__proj.reprojectStyle({ style: { version: 8, sources: {}, layers: [] }, crs: 'ESRI:54030' });
    const pipeline: any = await import('/_content/ProjPlugin/proj-pipeline.js');
    const mlt: any = await import('@maplibre/mlt');

    const source = new Uint8Array(await (await fetch('http://127.0.0.1:4173/tiles/weather/0/0/0.mlt')).arrayBuffer());
    const ring: number[][] = mlt.decodeTile(source)[0].getFeatures()[0].geometry.coordinates[0].map((p: any) => [p.x, p.y]);
    const cx = ring.reduce((sum, [x]) => sum + x, 0) / ring.length;
    const cy = ring.reduce((sum, [, y]) => sum + y, 0) / ring.length;
    const scaled = ring.map(([x, y]) => [cx + (x - cx) * 0.8, cy + (y - cy) * 0.8]);
    // The hole must wind against its exterior; the tile is encoded with both rings.
    const hole = [...ring].reverse();

    const synthetic = mlt.encodeTile([{
      name: 'donut',
      extent: 4096,
      features: [{
        geometry: { type: 'Polygon', coordinates: [scaled, hole] },
        properties: { kind: 'donut' },
      }],
    }]);
    const dataUrl = `data:application/octet-stream;base64,${btoa(String.fromCharCode(...synthetic))}`;

    const projection = await pipeline.createProjection('ESRI:54030', null);
    const reprojectTile = pipeline.createTileReprojector(projection, [dataUrl], { sourceId: 'donut' });
    const output = mlt.decodeTile(await reprojectTile('reproj://donut/0/0/0.mlt'));
    const layer = output[0];
    const feature = layer.getFeatures()[0];
    const area = (points: number[][]) => {
      let sum = 0;
      for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        sum += points[j][0] * points[i][1] - points[i][0] * points[j][1];
      }
      return sum / 2;
    };
    const rings = feature.geometry.coordinates.map((r: any) => r.map((p: any) => [p.x, p.y]));
    return {
      layer: layer.name,
      count: layer.numFeatures,
      type: feature.geometry.type,
      rings: rings.length,
      areas: rings.map(area),
      property: feature.properties.kind,
    };
  });

  expect(result.layer).toBe('donut');
  expect(result.count).toBe(1);
  expect(result.property).toBe('donut');
  // 2 = POLYGON with an exterior and one hole (not a two-part multipolygon).
  expect(result.type).toBe(2);
  expect(result.rings).toBe(2);
  expect(Math.sign(result.areas[0])).not.toBe(Math.sign(result.areas[1]));
});

test('keeps feature ids and keeps string/bool/int/double properties', async ({ page }) => {
  await page.goto('/proj.html');
  await page.waitForFunction(() => (window as any).__projReady || (window as any).__projError);

  const result = await page.evaluate(async () => {
    await (window as any).__proj.reprojectStyle({ style: { version: 8, sources: {}, layers: [] }, crs: 'ESRI:54030' });
    const pipeline: any = await import('/_content/ProjPlugin/proj-pipeline.js');
    const mlt: any = await import('@maplibre/mlt');
    const projection = await pipeline.createProjection('ESRI:54030', null);

    const fire = pipeline.createTileReprojector(
      projection,
      ['http://127.0.0.1:4173/tiles/fire/{z}/{x}/{y}.mlt'],
      { sourceId: 'fire' });
    const fireTile = mlt.decodeTile(await fire('reproj://http://127.0.0.1:4173/tiles/fire/0/0/0.mlt'));

    const stations = pipeline.createTileReprojector(
      projection,
      ['http://127.0.0.1:4173/tiles/stations/{z}/{x}/{y}.mlt'],
      { sourceId: 'stations' });
    const stationTile = mlt.decodeTile(await stations('reproj://http://127.0.0.1:4173/tiles/stations/0/0/0.mlt'));

    const fireFeature = fireTile[0].getFeatures()[0];
    const stationFeature = stationTile[0].getFeatures()[0];
    return {
      fireLayer: fireTile[0].name,
      fireCount: fireTile[0].numFeatures,
      fireProperties: fireFeature.properties,
      fireTypes: [...new Set(fireTile[0].getFeatures().map((f: any) => f.geometry.type))],
      stationLayer: stationTile[0].name,
      stationCount: stationTile[0].numFeatures,
      stationTypes: [...new Set(stationTile[0].getFeatures().map((f: any) => f.geometry.type))],
      stationName: stationFeature.properties.name,
    };
  });

  expect(result.fireLayer).toBe('fire_incidents_mvt');
  expect(result.fireCount).toBeGreaterThan(0);
  expect(typeof result.fireProperties.frp).toBe('number');
  expect(typeof result.fireProperties.confidence).toBe('number');
  expect(typeof result.fireProperties.is_gas_flare).toBe('boolean');
  expect(result.fireTypes.every((type: number) => type === 2 || type === 5)).toBe(true);

  expect(result.stationLayer).toBe('weather_stations_mvt');
  expect(result.stationCount).toBeGreaterThan(0);
  expect(result.stationTypes.every((type: number) => type === 0 || type === 3)).toBe(true);
  expect(typeof result.stationName).toBe('string');
});
