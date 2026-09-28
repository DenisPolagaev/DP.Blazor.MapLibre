import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, 'fixtures');
const port = Number(process.env.PORT || 4173);

// Serve the real RCL wwwroot trees under their Blazor static web asset paths so the
// browser specs exercise the same URLs a Blazor host would use.
const assetMounts = [
  ['/_content/DP.Blazor.MapLibre/', path.join(__dirname, '..', '..', 'src', 'DP.Blazor.MapLibre', 'wwwroot')],
  ['/_content/ProjPlugin/', path.join(__dirname, '..', '..', 'src', 'plugins', 'DP.Blazor.MapLibre.ProjPlugin', 'wwwroot')],
];

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.map': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm',
  '.db': 'application/octet-stream',
  '.ini': 'text/plain; charset=utf-8',
};

function resolveFile(urlPath) {
  for (const [prefix, base] of assetMounts) {
    if (urlPath.startsWith(prefix)) {
      const rel = urlPath.slice(prefix.length);
      const file = path.normalize(path.join(base, rel));
      if (file.startsWith(base)) return file;
      return null;
    }
  }

  const rel = urlPath === '/' ? '/index.html' : urlPath;
  const file = path.normalize(path.join(root, rel));
  if (!file.startsWith(root)) return null;
  return file;
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const filePath = resolveFile(urlPath);
  if (!filePath) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`fixtures server on http://127.0.0.1:${port}`);
});
