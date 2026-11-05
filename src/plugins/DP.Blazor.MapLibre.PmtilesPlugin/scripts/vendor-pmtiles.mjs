// Rebuilds wwwroot/pmtiles/pmtiles.mjs: one minified ESM bundle of the `pmtiles`
// package (fflate inlined), which PmtilesPlugin.js imports as ./pmtiles/pmtiles.mjs.
//
// Usage:
//   node scripts/vendor-pmtiles.mjs            # rebuild from VENDORED_VERSION
//   node scripts/vendor-pmtiles.mjs 4.5.0      # rebuild a specific version
//
// Run this whenever VENDORED_VERSION changes, then bump THIRD-PARTY-NOTICES.txt.
// ProjPlugin copies this file at vendor time
// (see ../DP.Blazor.MapLibre.ProjPlugin/scripts/vendor-proj.mjs), so a rebuild
// here is the only place the vendored copy has to change.
//
// Behind a TLS-intercepting proxy, run with NODE_TLS_REJECT_UNAUTHORIZED=0.

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const pluginRoot = path.resolve(here, '..');

// Pin lives here (and in THIRD-PARTY-NOTICES.txt); there is no package.json in this
// folder on purpose, so `npm install` at the repo root never walks into it.
const VENDORED_VERSION = '4.5.0';
const ESBUILD_VERSION = '0.25.10';

const isWindows = process.platform === 'win32';
const requested = process.argv[2];
const version = requested ?? VENDORED_VERSION;
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'vendor-pmtiles-'));
const target = path.join(pluginRoot, 'wwwroot', 'pmtiles', 'pmtiles.mjs');

try {
    fs.writeFileSync(
        path.join(work, 'package.json'),
        JSON.stringify({ name: 'vendor-pmtiles', private: true, type: 'module' }),
    );

    console.log(`installing pmtiles@${version} and esbuild@${ESBUILD_VERSION} in ${work}`);
    // A single command string with shell:true: passing an argv array makes Node emit
    // DEP0190 (unescaped args), and the values here are plain version numbers.
    const npm = isWindows
        ? spawnSync(`npm install --no-audit --no-fund --silent pmtiles@${version} esbuild@${ESBUILD_VERSION}`, {
              cwd: work,
              stdio: 'inherit',
              shell: true,
          })
        : spawnSync('npm', ['install', '--no-audit', '--no-fund', '--silent', `pmtiles@${version}`, `esbuild@${ESBUILD_VERSION}`], {
              cwd: work,
              stdio: 'inherit',
          });
    if (npm.status !== 0) {
        throw new Error(`npm install failed with status ${npm.status}`);
    }

    const installed = JSON.parse(
        fs.readFileSync(path.join(work, 'node_modules', 'pmtiles', 'package.json'), 'utf8'),
    ).version;

    // Import esbuild from the scratch install: the plugin folder has no node_modules
    // of its own, and the CLI banner flag is awkward to quote through a Windows shell.
    const esbuild = await import(pathToFileURL(path.join(work, 'node_modules', 'esbuild', 'lib', 'main.js')).href);

    await esbuild.build({
        entryPoints: [path.join(work, 'node_modules', 'pmtiles', 'dist', 'esm', 'index.js')],
        bundle: true,
        format: 'esm',
        minify: true,
        platform: 'browser',
        target: 'es2020',
        legalComments: 'none',
        banner: {
            js: `/*! pmtiles v${installed} | BSD-3-Clause | https://github.com/protomaps/PMTiles | bundled with esbuild */`,
        },
        outfile: target,
    });

    console.log(`\nvendored pmtiles@${installed} -> ${path.relative(pluginRoot, target)} (${fs.statSync(target).size} bytes)`);
    console.log('Update THIRD-PARTY-NOTICES.txt, then re-run ../DP.Blazor.MapLibre.ProjPlugin/scripts/vendor-proj.mjs.');

    // esbuild keeps a child service process alive; it holds the scratch install open on Windows.
    esbuild.stop?.();
} finally {
    // Windows keeps the scratch install locked for a moment after the child exits.
    for (let attempt = 0; attempt < 10; attempt++) {
        try {
            fs.rmSync(work, { recursive: true, force: true });
            break;
        } catch (error) {
            if (attempt === 9) {
                console.warn(`could not remove ${work}: ${error.message}`);
                break;
            }
            Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 200);
        }
    }
}
