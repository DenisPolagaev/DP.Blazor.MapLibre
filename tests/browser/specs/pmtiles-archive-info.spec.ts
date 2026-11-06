import { expect, test } from '@playwright/test';

// The portal picks a vector source's `encoding` from the PMTiles header when the layer style does not declare it, so
// the format is read from the archive instead of assumed. This checks the plugin API against a real archive:
//   set PROJ_PMTILES_URL=http://localhost:9000/fire-tiles/gfmr/static.pmtiles
//   set PROJ_ALLOW_CORS=1            (allow cross-origin fetches to local MinIO)
const archiveUrl = process.env.PROJ_PMTILES_URL;

test.skip(!archiveUrl, 'set PROJ_PMTILES_URL to a PMTiles archive to run this test');

test('reports the tile type and MapLibre encoding of a real archive', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/proj.html');

  const out = await page.evaluate(async ({ archive }) => {
    const plugin: any = await import('/_content/PmtilesPlugin/PmtilesPlugin.js');
    const info = await plugin.getArchiveInfo(archive);
    // A second call must be served from the page cache, not another range request.
    const again = await plugin.getArchiveInfo(archive);
    return { info, cached: again === info };
  }, { archive: archiveUrl });

  console.log('PMTILES INFO', JSON.stringify(out, null, 1));
  expect(out.info.tileType).toBe(6);
  expect(out.info.encoding).toBe('mlt');
  expect(out.info.maxZoom).toBeGreaterThanOrEqual(0);
  expect(out.cached).toBe(true);
});
