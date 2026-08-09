import * as esbuild from 'esbuild';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outfile = path.resolve(root, '../wwwroot/js/geoportal-map-facade.js');

await mkdir(path.dirname(outfile), { recursive: true });

await esbuild.build({
  entryPoints: [path.join(root, 'src/index.ts')],
  outfile,
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  sourcemap: true,
  // maplibre-gl is already loaded by MapLibre.razor.js; keep the facade lean.
  external: ['maplibre-gl'],
});

await writeFile(
  path.resolve(root, '../wwwroot/js/.maplibre-gl-version'),
  '6.2.0\n',
  'utf8',
);

console.log(`Built ${outfile}`);
