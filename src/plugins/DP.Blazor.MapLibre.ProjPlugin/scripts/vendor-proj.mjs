// Vendors the proj-wasm pipeline dependency graph (see wwwroot/proj-pipeline.js) into ../wwwroot/vendor.
// maplibre-proj and backproj are not used and are not vendored.
//
// Usage: node scripts/vendor-proj.mjs
//
// Downloads pinned package trees from unpkg (no npm/registry auth needed), then prunes
// build-only files. pmtiles is not on unpkg in the required layout; it is copied from the sibling
// DP.Blazor.MapLibre.PmtilesPlugin so that both plugins ship the same file. The output tree is served
// as a static web asset under _content/ProjPlugin/vendor and wired up by ProjPlugin.js.
//
// There is no MVT dependency any more: the reprojection pipeline decodes and encodes MapLibre Tiles
// with @maplibre/mlt. That package's dist/*.js uses extensionless relative specifiers (TypeScript's
// "bundler" module resolution), which a browser cannot resolve, so its tree is normalized to
// explicit .js specifiers after the download (see normalizeEsmSpecifiers).
//
// The output directory is deleted and rebuilt on every run.
//
// Behind a TLS-intercepting proxy, run with NODE_TLS_REJECT_UNAUTHORIZED=0.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const outRoot = path.resolve(here, '..', 'wwwroot', 'vendor');

/** Reads `pmtiles v4.5.0` from the bundle banner; falls back to "unknown". */
function readVendoredVersion(bundlePath) {
  try {
    const firstLine = fs.readFileSync(bundlePath, 'utf8').split('\n', 1)[0];
    return /pmtiles v(\d+\.\d+\.\d+)/.exec(firstLine)?.[1] ?? 'unknown';
  } catch {
    return 'unknown';
  }
}

// Curated single-version closure. The upstream packages use overlapping semver ranges,
// so versions are pinned here to keep one copy of each bare specifier.
//
// proj-wasm 0.1.0 is the first release whose dist/ holds only the PROJ files: it imports `ffi-wasm` as a bare
// specifier, so ffi-wasm must be vendored and mapped in the import map (see wwwroot/ProjPlugin.js).
// @wcohen/wasmts (JTS) and lru-cache belonged to the old Worker/JTS pipeline; nothing imports them any more,
// so they are not vendored.
const packages = [
  ['proj-wasm', '0.1.0', 'proj-wasm'],
  ['ffi-wasm', '0.0.3', 'ffi-wasm'],
  ['@wcohen/worker-router', '0.0.2', 'worker-router'],
  ['comlink', '4.4.2', 'comlink'],
  ['squint-cljs', '0.14.210', 'squint-cljs'],
  ['resource-tracker', '0.0.1', 'resource-tracker'],
  // MapLibre Tile decode/encode (vector tile reprojection). Its only runtime dependency is
  // @mapbox/point-geometry, which is vendored below.
  ['@maplibre/mlt', '1.3.0', 'maplibre-mlt'],
  ['@mapbox/point-geometry', '1.1.0', 'mapbox-point-geometry'],
];

// Packages whose dist tree is TypeScript output with extensionless relative imports. Browsers do not
// append a file extension to a module specifier, so "./mltDecoder" would 404; every such specifier is
// rewritten to "./mltDecoder.js" (or "/index.js" for directory imports) before the tree is served.
const normalizeSpecifiers = new Set(['maplibre-mlt']);

// Single-file packages copied from the repository instead of downloaded. The version is read from
// the source file's banner (see DP.Blazor.MapLibre.PmtilesPlugin/scripts/vendor-pmtiles.mjs).
const localPackages = [
  {
    name: 'pmtiles',
    version: readVendoredVersion(
      path.resolve(here, '..', '..', 'DP.Blazor.MapLibre.PmtilesPlugin', 'wwwroot', 'pmtiles', 'pmtiles.mjs'),
    ),
    dir: 'pmtiles',
    source: path.resolve(here, '..', '..', 'DP.Blazor.MapLibre.PmtilesPlugin', 'wwwroot', 'pmtiles'),
  },
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

function listJsFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listJsFiles(full));
    else if (entry.name.endsWith('.js') || entry.name.endsWith('.mjs')) out.push(full);
  }
  return out;
}

// Rewrites extensionless relative module specifiers ("from './x'", 'import("./x")') to a path a
// browser can fetch: "./x.js" when that file exists, "./x/index.js" when it is a directory.
function normalizeEsmSpecifiers(dir, label) {
  const specifier = /((?:from|import)\s*\(?\s*)(["'])(\.{1,2}\/[^"'\n]+)\2/g;
  let files = 0;
  let rewrites = 0;
  for (const file of listJsFiles(dir)) {
    const before = fs.readFileSync(file, 'utf8');
    const after = before.replace(specifier, (match, prefix, quote, value) => {
      if (/\.(js|mjs|cjs|json|wasm)$/i.test(value)) return match;
      const target = path.resolve(path.dirname(file), value);
      if (fs.existsSync(`${target}.js`)) {
        rewrites++;
        return `${prefix}${quote}${value}.js${quote}`;
      }
      if (fs.existsSync(path.join(target, 'index.js'))) {
        rewrites++;
        return `${prefix}${quote}${value}/index.js${quote}`;
      }
      return match;
    });
    if (after !== before) {
      fs.writeFileSync(file, after);
      files++;
    }
  }
  console.log(`  normalized ESM specifiers in ${label}: ${rewrites} rewrite(s) across ${files} file(s)`);
  return rewrites;
}

fs.rmSync(outRoot, { recursive: true, force: true });
fs.mkdirSync(outRoot, { recursive: true });

const manifest = { generated: new Date().toISOString(), packages: [] };
let totalBytes = 0;
for (const [name, version, safe] of packages) {
  const dest = path.join(outRoot, safe);
  const { count, bytes } = await downloadPackage(name, version, dest);
  totalBytes += bytes;
  if (normalizeSpecifiers.has(safe)) {
    normalizeEsmSpecifiers(dest, `${name}@${version}`);
  }
  manifest.packages.push({ name, version, dir: safe, files: count });
  console.log(`${name}@${version} -> vendor/${safe} (${count} files, ${(bytes / 1024 / 1024).toFixed(2)} MB)`);
}

for (const local of localPackages) {
  const dest = path.join(outRoot, local.dir);
  fs.cpSync(local.source, dest, { recursive: true });
  const files = fs.readdirSync(dest).filter((f) => fs.statSync(path.join(dest, f)).isFile());
  manifest.packages.push({ name: local.name, version: local.version, dir: local.dir, files: files.length });
  console.log(`${local.name} (copied) -> vendor/${local.dir} (${files.length} files)`);
}

fs.writeFileSync(path.join(outRoot, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`\nDone: ${(totalBytes / 1024 / 1024).toFixed(2)} MB in ${path.relative(process.cwd(), outRoot)}`);
