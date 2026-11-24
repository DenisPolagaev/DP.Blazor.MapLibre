import { expect, test } from '@playwright/test';

// Covers the pure geometry helpers behind the tile pipeline: the endpoint-indexed merge (it replaced a quadratic
// rescan), Douglas–Peucker simplification, and the determinism of a whole reprojected tile now that input tiles are
// fetched concurrently.
test('line merging and simplification keep the geometry intact', async ({ page }) => {
  test.setTimeout(300_000);
  await page.goto('/proj.html');
  await page.waitForFunction(() => (window as any).__projReady || (window as any).__projError);
  expect(await page.evaluate(() => (window as any).__projError ?? null)).toBeFalsy();

  const result = await page.evaluate(async () => {
    const plugin = (window as any).__proj;
    await plugin.reprojectStyle({ style: { version: 8, sources: {}, layers: [] }, crs: 'ESRI:54030' });
    const pipeline: any = await import('/_content/ProjPlugin/proj-pipeline.js');

    const segment = (ax: number, ay: number, bx: number, by: number) => [[ax, ay], [bx, by]];

    // A chain handed over in a scrambled order must come back as one polyline in a consistent direction.
    const chained = pipeline.mergeLines([
      segment(2, 0, 3, 0),
      segment(1, 0, 2, 0),
      segment(0, 0, 1, 0),
    ]);

    // Two disjoint chains stay two lines, and the input order decides which comes first.
    const disjoint = pipeline.mergeLines([
      segment(10, 0, 11, 0),
      segment(0, 0, 1, 0),
      segment(11, 0, 12, 0),
    ]);

    // Simplification drops a vertex that adds no shape and keeps the one that does.
    const collinear = pipeline.simplifyPath([[0, 0], [5, 0], [10, 0]]);
    const bent = pipeline.simplifyPath([[0, 0], [5, 8], [10, 0]]);
    const ring = pipeline.simplifyClosedPath([[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]]);

    // A long straight chain: the previous merge rescanned every segment per join.
    const many = [];
    for (let i = 0; i < 5000; i++) {
      many.push(segment(i, 0, i + 1, 0));
    }
    const started = performance.now();
    const merged = pipeline.mergeLines(many);
    const elapsedMs = performance.now() - started;

    return {
      chained,
      disjoint,
      collinear,
      bent,
      ring,
      mergedLines: merged.length,
      mergedPoints: merged[0]?.length ?? 0,
      elapsedMs,
    };
  });

  expect(result.chained).toHaveLength(1);
  expect(result.chained[0]).toHaveLength(4);
  // One direction only: the chain is monotone in x, whichever end it started from.
  const xs = result.chained[0].map((p: number[]) => p[0]);
  expect(xs).toEqual([...xs].sort((a: number, b: number) => a - b));

  expect(result.disjoint).toHaveLength(2);
  // The chain that starts at the first unused segment comes first: the input order of the segments decides.
  expect(result.disjoint[0][0][0]).toBe(10);
  expect(result.disjoint[1][0][0]).toBe(0);

  expect(result.collinear).toEqual([[0, 0], [10, 0]]);
  expect(result.bent).toHaveLength(3);
  expect(result.ring).toHaveLength(5);
  expect(result.ring[0]).toEqual(result.ring[result.ring.length - 1]);

  expect(result.mergedLines).toBe(1);
  expect(result.mergedPoints).toBe(5001);
  // Generous, but it fails on the quadratic version, which spends seconds on this chain.
  expect(result.elapsedMs).toBeLessThan(2000);
});

test('the same output tile is byte-identical across calls', async ({ page }) => {
  test.setTimeout(300_000);
  await page.goto('/proj.html');
  await page.waitForFunction(() => (window as any).__projReady || (window as any).__projError);
  expect(await page.evaluate(() => (window as any).__projError ?? null)).toBeFalsy();

  const sizes = await page.evaluate(async () => {
    const plugin = (window as any).__proj;
    await plugin.reprojectStyle({ style: { version: 8, sources: {}, layers: [] }, crs: 'ESRI:54030' });
    const pipeline: any = await import('/_content/ProjPlugin/proj-pipeline.js');
    const projection = await pipeline.createProjection('ESRI:54030', null);
    const reprojectTile = pipeline.createTileReprojector(
      projection,
      ['http://127.0.0.1:4173/tiles/weather/{z}/{x}/{y}.mlt'],
      { sourceId: 'weather' });

    const url = 'reproj://http://127.0.0.1:4173/tiles/weather/1/0/0.mlt';
    const first = Array.from(await reprojectTile(url));
    const second = Array.from(await reprojectTile(url));
    return {
      byteLength: first.length,
      identical: first.length === second.length && first.every((value: number, index: number) => value === second[index]),
    };
  });

  expect(sizes.byteLength).toBeGreaterThan(100);
  expect(sizes.identical).toBe(true);
});
