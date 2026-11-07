import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { validateDeck } from './validate.mjs';
export async function buildHtml(decks, { language = 'zh-CN', initialFilter = 'all' } = {}) {
  decks.forEach(validateDeck);
  const media = await loadMedia(decks.flatMap(d => d.slides.flatMap(s => [s.image, ...(s.images || [])]).filter(Boolean)));
  const catalog = Object.keys(media).length ? JSON.parse(await readFile(new URL('../assets/catalog.json', import.meta.url), 'utf8')) : {};
  const mediaDescriptions = Object.fromEntries(Object.keys(media).filter(id=>catalog[id]?.alt).map(id=>[id,catalog[id].alt]));
  const [template, css, js] = await Promise.all(['shell.html', 'style.css', 'player.js'].map(name => readFile(new URL(`./web/${name}`, import.meta.url), 'utf8')));
  const validator = (await readFile(new URL('./validate.mjs', import.meta.url), 'utf8')).replaceAll('export ', '');
  const journalCss = await readFile(new URL('./web/journal.css', import.meta.url),'utf8');
  const json = JSON.stringify({ decks, language, initialFilter, media, mediaDescriptions }).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  return template.replace('/*__STYLE__*/', () => css+'\n'+journalCss).replace('/*__VALIDATE__*/', () => validator).replace('/*__PLAYER__*/', () => js).replace('__DATA__', () => json);
}
export async function loadMedia(ids) {
  if (!ids.length) return {};
  const catalog = JSON.parse(await readFile(new URL('../assets/catalog.json', import.meta.url), 'utf8'));
  const result = {};
  for (const id of new Set(ids)) {
    const entry = catalog[id];
    if (!entry || !/^(?:samples\/image\d+\.(?:webp|gif)|generated\/[a-z0-9-]+\.webp)$/.test(entry.file) || !['image/webp','image/gif'].includes(entry.mime)) throw new Error(`Unknown packaged image: ${id}`);
    const bytes = await readFile(new URL(`../assets/${entry.file}`, import.meta.url));
    result[id] = `data:${entry.mime};base64,${bytes.toString('base64')}`;
  }
  return result;
}
export async function writeHtml(decks, file, options) {
  const path = resolve(file);
  const html = await buildHtml(decks, options);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, html, 'utf8');
  return path;
}
