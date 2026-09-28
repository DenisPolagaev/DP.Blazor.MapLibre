// Vendors the maplibre-proj runtime dependency graph into ../wwwroot/vendor.
//
// Usage: node scripts/vendor-proj.mjs
//
// Downloads pinned package trees from unpkg (no npm/registry auth needed), then prunes
// build-only files. The output tree is served as a static web asset under
// _content/ProjPlugin/vendor and wired up by ProjPlugin.js.
//
// Behind a TLS-intercepting proxy, run with NODE_TLS_REJECT_UNAUTHORIZED=0.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const outRoot = path.resolve(here, '..', 'wwwroot', 'vendor');

// Curated single-version closure. The upstream packages use overlapping semver ranges,
// so versions are pinned here to keep one copy of each bare specifier.
const packages = [
  ['proj-wasm', '0.1.0-alpha9', 'proj-wasm'],
  ['ffi-wasm', '0.0.1', 'ffi-wasm'],
  ['@wcohen/wasmts', '0.1.0-alpha6', 'wcohen-wasmts'],
  ['@wcohen/worker-router', '0.0.2', 'worker-router'],
  ['comlink', '4.4.2', 'comlink'],
  ['squint-cljs', '0.14.208', 'squint-cljs'],
  ['resource-tracker', '0.0.1', 'resource-tracker'],
  ['lru-cache', '11.2.6', 'lru-cache'],
  ['@mapbox/vector-tile', '2.0.4', 'mapbox-vector-tile'],
  ['@mapbox/point-geometry', '1.1.0', 'mapbox-point-geometry'],
  ['pbf', '4.0.1', 'pbf'],
];

const skipExt = new Set(['.map', '.md', '.ts', '.flow', '.d.ts']);
const skipDir = /(^|\/)(test|tests|__tests__|bench|benchmark|example|examples|docs?)(\/|$)/i;
const skipFile = /(^|\/)(README|CHANGELOG|HISTORY|AUTHORS|\.npmignore|package-lock\.json)(\.|$)/i;

// squint-cljs ships a compiler/CLI we never import at runtime; keep only the runtime.
const prune = {
  'squint-cljs': [/^\/lib\//, /^\/vite/, /^\/node[-_]/],
};

async function getJson(url) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return res.json();
}

async function downloadPackage(name, version, dest) {
  const meta = await getJson(`https://unpkg.com/${name}@${version}/?meta`);
  const files = (meta.files || []).filter((f) => f.path && !f.path.endsWith('/'));
  const prunes = prune[name] || [];
  let count = 0;
  let bytes = 0;
  for (const file of files) {
    const p = file.path;
    if (skipExt.has(path.extname(p).toLowerCase())) continue;
    if (skipDir.test(p)) continue;
    if (skipFile.test(p)) continue;
    if (prunes.some((re) => re.test(p))) continue;
    const res = await fetch(`https://unpkg.com/${name}@${version}${p}`, { redirect: 'follow' });
    if (!res.ok) {
      console.warn(`  skip ${name}${p}: ${res.status}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const target = path.join(dest, p.replace(/^\//, ''));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, buf);
    count++;
    bytes += buf.length;
  }
  return { count, bytes };
}

fs.rmSync(outRoot, { recursive: true, force: true });
fs.mkdirSync(outRoot, { recursive: true });

const manifest = { generated: new Date().toISOString(), packages: [] };
let totalBytes = 0;
for (const [name, version, safe] of packages) {
  const { count, bytes } = await downloadPackage(name, version, path.join(outRoot, safe));
  totalBytes += bytes;
  manifest.packages.push({ name, version, dir: safe, files: count });
  console.log(`${name}@${version} -> vendor/${safe} (${count} files, ${(bytes / 1024 / 1024).toFixed(2)} MB)`);
}

fs.writeFileSync(path.join(outRoot, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`\nDone: ${(totalBytes / 1024 / 1024).toFixed(2)} MB in ${path.relative(process.cwd(), outRoot)}`);
