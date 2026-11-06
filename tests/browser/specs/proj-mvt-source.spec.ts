import { expect, test } from '@playwright/test';

// The OpenFreeMap basemap the Map API serves is MVT and has no MLT build, so the projection pipeline has to read
// MVT as an input — and still answer with MLT, because that is what MapLibre decodes from the protocol handler.
// Our own archives stay MLT; this is the only MVT path in the plugin and it is an input decoder, not an encoder.
test('reprojects an MVT tile and answers with MLT', async ({ page }) => {
  await page.goto('/proj.html');
  await page.waitForFunction(() => (window as any).__projReady || (window as any).__projError);
  expect(await page.evaluate(() => (window as any).__projError ?? null)).toBeFalsy();

  const result = await page.evaluate(async () => {
    const plugin = (window as any).__proj;
    await plugin.reprojectStyle({ style: { version: 8, sources: {}, layers: [] }, crs: 'ESRI:54030' });
    const Pbf = (await import('pbf')).default;
    const pipeline: any = await import('/_content/ProjPlugin/proj-pipeline.js');
    const mlt: any = await import('@maplibre/mlt');

    // Minimal MVT writer: one layer with one polygon (a 512-unit square) and two properties.
    const zigzag = (value: number) => (value << 1) ^ (value >> 31);
    const pbf = new Pbf();
    pbf.writeMessage(3, (_layer: any, layer: any) => {
      layer.writeVarintField(15, 2); // version
      layer.writeStringField(1, 'basemap');

      layer.writeMessage(2, (_feature: any, feature: any) => {
        feature.writeVarintField(1, 7); // id
        feature.writePackedVarint(2, [0, 0, 1, 1]); // class -> "water", rank -> 3
        feature.writeVarintField(3, 3); // polygon
        feature.writePackedVarint(4, [
          (1 & 0x7) | (1 << 3), zigzag(0), zigzag(0), // MoveTo (0, 0)
          (2 & 0x7) | (3 << 3), zigzag(512), zigzag(0), zigzag(0), zigzag(512), zigzag(-512), zigzag(0), // LineTo
          (7 & 0x7) | (1 << 3), // ClosePath
        ]);
      });

      layer.writeStringField(3, 'class');
      layer.writeStringField(3, 'rank');
      layer.writeMessage(4, (_value: any, value: any) => value.writeStringField(1, 'water'));
      layer.writeMessage(4, (_value: any, value: any) => value.writeVarintField(5, 3));
      layer.writeVarintField(5, 4096); // extent
    });

    const bytes: Uint8Array = pbf.finish();
    const tileUrl = `data:application/octet-stream;base64,${btoa(String.fromCharCode(...bytes))}`;

    const projection = await pipeline.createProjection('ESRI:54030', null);
    const reprojectTile = pipeline.createTileReprojector(projection, [tileUrl], {
      sourceId: 'basemap',
      encoding: 'mvt',
    });
    const output: Uint8Array = await reprojectTile('reproj://basemap/0/0/0.mlt');
    const tables = mlt.decodeTile(output);
    const features = tables[0]?.getFeatures() ?? [];
    const inTile = (p: any) => Number.isFinite(p.x) && Number.isFinite(p.y)
      && p.x >= -64 && p.x <= 4096 + 64 && p.y >= -64 && p.y <= 4096 + 64;

    return {
      bytes: output.byteLength,
      layers: tables.map((table: any) => table.name),
      count: features.length,
      id: features[0]?.id ?? null,
      types: [...new Set(features.map((feature: any) => feature.geometry.type))],
      className: features[0]?.properties.class ?? null,
      rank: features[0]?.properties.rank ?? null,
      finite: features.every((feature: any) =>
        feature.geometry.coordinates.every((ring: any) => ring.every(inTile))),
    };
  });

  // 2 = Polygon / 5 = MultiPolygon: the MVT polygon stays a polygon after the round-trip.
  expect(result.bytes).toBeGreaterThan(50);
  expect(result.layers).toEqual(['basemap']);
  expect(result.count).toBeGreaterThan(0);
  expect(result.id).toBe(7);
  expect(result.types.every((type: number) => type === 2 || type === 5)).toBe(true);
  expect(result.className).toBe('water');
  expect(result.rank).toBe(3);
  expect(result.finite).toBe(true);
});

test('reprojectStyle keeps an MVT basemap source and forces MLT on the output', async ({ page }) => {
  await page.goto('/proj.html');
  await page.waitForFunction(() => (window as any).__projReady || (window as any).__projError);

  const result = await page.evaluate(async () => {
    const plugin = (window as any).__proj;
    // Shaped like the OpenFreeMap style: an MVT vector source (no encoding — MapLibre's default) plus a raster
    // hillshade, which cannot be reprojected at all.
    const style = {
      version: 8,
      sources: {
        openmaptiles: { type: 'vector', tiles: ['https://tiles.openfreemap.org/planet/{z}/{x}/{y}'] },
        hillshade: { type: 'raster', tiles: ['https://tiles.openfreemap.org/ne2sr/{z}/{x}/{y}.png'], tileSize: 256 },
      },
      layers: [
        { id: 'water', type: 'fill', source: 'openmaptiles', 'source-layer': 'water' },
        { id: 'relief', type: 'raster', source: 'hillshade' },
      ],
    };

    const reprojected = await plugin.reprojectStyle({ style, crs: 'ESRI:54030' });
    const source = reprojected.style.sources.openmaptiles ?? {};
    return {
      sourceIds: Object.keys(reprojected.style.sources),
      layerIds: reprojected.style.layers.map((layer: any) => layer.id),
      tiles: source.tiles ?? null,
      encoding: source.encoding ?? null,
      dropped: reprojected.droppedSources ?? null,
    };
  });

  expect(result.sourceIds).toEqual(['openmaptiles']);
  expect(result.layerIds).toEqual(['water']);
  // The handler answers with MLT, so the source must say so or MapLibre would decode it as MVT.
  expect(result.encoding).toBe('mlt');
  expect(result.tiles[0]).toMatch(/^reproj-/);
  expect(result.dropped).toEqual(['hillshade']);
});

test('reprojectSource accepts an MVT source and rewrites it to MLT', async ({ page }) => {
  await page.goto('/proj.html');
  await page.waitForFunction(() => (window as any).__projReady || (window as any).__projError);

  const result = await page.evaluate(async () => {
    const plugin = (window as any).__proj;
    const rewritten = await plugin.reprojectSource({
      sourceId: 'openmaptiles',
      source: { type: 'vector', tiles: ['https://tiles.openfreemap.org/planet/{z}/{x}/{y}'] },
      crs: 'ESRI:54030',
    });

    return {
      tiles: rewritten.source.tiles,
      encoding: rewritten.source.encoding ?? null,
    };
  });

  expect(result.encoding).toBe('mlt');
  expect(result.tiles).toHaveLength(1);
  expect(result.tiles[0]).toMatch(/^reproj-/);
  expect(result.tiles[0]).toContain('https://tiles.openfreemap.org/planet/{z}/{x}/{y}');
});
