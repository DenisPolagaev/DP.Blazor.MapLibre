import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

// The portal declares the vendored projection modules in a *static* import map (browsers read import maps only before
// the first module loads). Two properties of that block are easy to get wrong and each one disables the projection
// completely while looking fine:
//   1. every value must be URL-like — an import map value has to be an absolute URL or start with "/", "./" or "../".
//      A bare `_content/...` is rejected by the browser ("Ignored an import map value … Bare specifier"), yet the key
//      is still there, so the plugin's runtime fallback used to consider the host covered and installed nothing;
//   2. every mapped file must exist, or the module graph breaks at the first import.
// The keys must also cover everything the plugin maps, since `hostProvidesImportMap` only checks one of them.
const EXPECTED_KEYS = [
  'maplibre-gl',
  'proj-wasm',
  'ffi-wasm',
  '@maplibre/mlt',
  '@mapbox/vector-tile',
  '@mapbox/point-geometry',
  'pbf',
  'pmtiles',
  'squint-cljs/core.js',
  'squint-cljs/src/squint/string.js',
  'squint-cljs/src/squint/multi.js',
  'resource-tracker',
  'worker-router',
  'worker-router/worker-bootstrap',
  'comlink',
  'comlink/dist/esm/node-adapter.mjs',
];

const CONTENT_ROOTS: Record<string, string> = {
  '_content/DP.Blazor.MapLibre/': 'libs/Blazor.MapLibre/src/DP.Blazor.MapLibre/wwwroot/',
  '_content/ProjPlugin/': 'libs/Blazor.MapLibre/src/plugins/DP.Blazor.MapLibre.ProjPlugin/wwwroot/',
};

function findRepositoryRoot(start: string): string {
  let directory = start;
  for (let depth = 0; depth < 12; depth++) {
    if (fs.existsSync(path.join(directory, 'DP.Geoportal.slnx'))) {
      return directory;
    }

    const parent = path.dirname(directory);
    if (parent === directory) {
      break;
    }

    directory = parent;
  }

  throw new Error(`Repository root (DP.Geoportal.slnx) not found above ${start}.`);
}

test('the portal import map is URL-like, complete and points at real files', () => {
  const repositoryRoot = findRepositoryRoot(process.cwd());
  const indexPath = path.join(repositoryRoot, 'src/Web/DP.Geoportal.Web/wwwroot/index.html');
  const html = fs.readFileSync(indexPath, 'utf8');

  const block = html.match(/<script type="importmap">([\s\S]*?)<\/script>/);
  expect(block, 'index.html declares a static import map').not.toBeNull();

  const map = JSON.parse(block![1]) as { imports?: Record<string, string> };
  const imports = map.imports ?? {};
  expect(Object.keys(imports).sort()).toEqual([...EXPECTED_KEYS].sort());

  const broken: string[] = [];
  for (const [specifier, value] of Object.entries(imports)) {
    const urlLike = /^(?:[a-z][a-z0-9+.-]*:|\/|\.\/|\.\.\/)/i.test(value);
    if (!urlLike) {
      broken.push(`${specifier}: "${value}" is a bare specifier, not a URL`);
      continue;
    }

    const prefix = Object.keys(CONTENT_ROOTS).find((candidate) => value.startsWith(`./${candidate}`)
      || value.startsWith(`/${candidate}`));
    if (!prefix) {
      broken.push(`${specifier}: "${value}" does not point into a package wwwroot`);
      continue;
    }

    const relative = value.replace(/^\.?\//, '').slice(prefix.length);
    const file = path.join(repositoryRoot, CONTENT_ROOTS[prefix], relative);
    if (!fs.existsSync(file)) {
      broken.push(`${specifier}: "${value}" does not exist (${file})`);
    }
  }

  expect(broken, broken.join('\n')).toEqual([]);
});
