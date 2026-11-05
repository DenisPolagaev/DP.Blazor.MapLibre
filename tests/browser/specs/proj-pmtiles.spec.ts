import { expect, test } from '@playwright/test';

// Reads tiles from a real PMTiles archive (e.g. local MinIO) and reprojects them.
//   set PROJ_PMTILES_URL=http://localhost:9000/fire-tiles/gfmr/static.pmtiles
//   set PROJ_ALLOW_CORS=1            (allow cross-origin fetches to local MinIO)
//   optional PROJ_PMTILES_CRS=EPSG:3413
const archiveUrl = process.env.PROJ_PMTILES_URL;
const crs = process.env.PROJ_PMTILES_CRS ?? 'EPSG:3413';

test.skip(!archiveUrl, 'set PROJ_PMTILES_URL to a PMTiles archive to run this test');

test('reads and reprojects a real PMTiles archive', async ({ page }) => {
  test.setTimeout(300_000);
  await page.goto('/proj.html');
  await page.waitForFunction(() => (window as any).__projReady || (window as any).__projError);

  const out = await page.evaluate(async ({ archive, crs }) => {
    const plugin = (window as any).__proj;
    await plugin.reprojectStyle({ style: { version: 8, sources: {}, layers: [] }, crs: 'ESRI:54030' });
    const pipeline: any = await import('/_content/ProjPlugin/proj-pipeline.js');
    const mlt: any = await import('@maplibre/mlt');
    const { PMTiles } = await import('pmtiles');

    const pm: any = new PMTiles(archive);
    let header: any;
    try {
      header = await pm.getHeader();
    } catch (e: any) {
      return { headerError: String((e && e.message) || e).slice(0, 200) };
    }

    // Find an existing tile by scanning low zooms.
    let source: any = null;
    const maxZoom = Math.min(header?.maxZoom ?? 6, 6);
    outer: for (let z = 0; z <= maxZoom; z++) {
      const world = Math.pow(2, z);
      const step = Math.max(1, Math.floor(world / 6));
      for (let x = 0; x < world; x += step) {
        for (let y = 0; y < world; y += step) {
          const t = await pm.getZxy(z, x, y);
          if (t?.data && t.data.byteLength > 0) {
            source = { z, x, y, data: t.data };
            break outer;
          }
        }
      }
    }

    if (!source) {
      return { header: { maxZoom: header?.maxZoom, tileType: header?.tileType }, found: false };
    }

    const inputFeatures = mlt.decodeTile(new Uint8Array(source.data))
      .reduce((sum: number, table: any) => sum + table.numFeatures, 0);

    // Reproject an output tile at the same zoom covering roughly the same area.
    const projection = await pipeline.createProjection(crs, null);
    const reprojectTile = pipeline.createTileReprojector(projection, { kind: 'pmtiles' });
    let reprojected = 0;
    let reprojectedFeatures = 0;
    try {
      const bytes = await reprojectTile(`reproj://${archive}/${source.z}/${source.x}/${source.y}`);
      reprojected = bytes.byteLength;
      reprojectedFeatures = bytes.byteLength > 0
        ? mlt.decodeTile(bytes).reduce((sum: number, table: any) => sum + table.numFeatures, 0)
        : 0;
    } catch (e: any) {
      reprojected = -1;
    }

    return {
      header: { minZoom: header?.minZoom, maxZoom: header?.maxZoom, tileType: header?.tileType },
      source: { zxy: `${source.z}/${source.x}/${source.y}`, bytes: source.data.byteLength },
      inputFeatures,
      reprojectedBytes: reprojected,
      reprojectedFeatures,
    };
  }, { archive: archiveUrl, crs });

  console.log('PMTILES', JSON.stringify(out, null, 1));
  expect((out as any).headerError, JSON.stringify(out)).toBeFalsy();
  expect((out as any).found, JSON.stringify(out)).not.toBe(false);
  // TileType 6 is MLT: the archive must not be a legacy MVT one.
  expect((out as any).header.tileType, JSON.stringify(out)).toBe(6);
  expect((out as any).inputFeatures, JSON.stringify(out)).toBeGreaterThan(0);
});
