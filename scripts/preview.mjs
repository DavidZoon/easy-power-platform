import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.xml': 'application/xml', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.txt': 'text/plain' };
export async function preview(port = 4173) {
  const root = path.resolve('_site');
  const home = await fs.readFile(path.join(root, 'index.html'), 'utf8');
  const canonical = home.match(/rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical) throw new Error('Canonical de la page accueil introuvable');
  const base = new URL(canonical).pathname.replace(/\/$/, '');
  const server = http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://localhost');
      const decoded = decodeURIComponent(url.pathname);
      if (base && !decoded.startsWith(`${base}/`) && decoded !== base) {
        if (decoded === '/') response.writeHead(302, { Location: `${base}/` });
        else response.writeHead(404);
        response.end();
        return;
      }
      const relative = decoded.slice(base.length) || '/';
      let file = path.resolve(root, `.${relative}`);
      if (file !== root && !file.startsWith(`${root}${path.sep}`)) { response.writeHead(403); response.end(); return; }
      if ((await fs.stat(file)).isDirectory()) file = path.join(file, 'index.html');
      const data = await fs.readFile(file);
      response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
      response.end(data);
    } catch (error) {
      if (error.code !== 'ENOENT') console.error('Preview:', error);
      response.writeHead(error.code === 'ENOENT' ? 404 : 500);
      response.end('Page unavailable');
    }
  });
  await new Promise(resolve => server.listen(port, '127.0.0.1', resolve));
  return { server, url: `http://127.0.0.1:${server.address().port}${base}/` };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { url } = await preview(Number(process.env.PORT || 4173));
  console.log(`Preview: ${url}`);
}
