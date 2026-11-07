// Optional local preview for development; playing the generated HTML needs no server.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const port = Number(process.env.PORT || 4173);
createServer(async (req, res) => {
  if (req.url !== '/' && req.url !== '/index.html') { res.writeHead(404); res.end('Not found'); return; }
  try { const html = await readFile(new URL('../output/karaoke.html', import.meta.url)); res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'no-store' }); res.end(html); }
  catch { res.writeHead(404); res.end('Run node src/cli.mjs demo first.'); }
}).listen(port, '127.0.0.1', () => console.log(`Local preview: http://127.0.0.1:${port}`));
