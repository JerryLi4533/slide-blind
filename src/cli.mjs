import { parseArgs } from 'node:util';
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { library } from './library.mjs';
import { writeHtml } from './build.mjs';
import { makePrompt, generateDeck } from './generate.mjs';

try { process.loadEnvFile(); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const help = `SLIDE BLIND — local bilingual presentation karaoke

Node.js 22+; no dependencies, no install, no server needed to play.

  node src/cli.mjs demo                         Build all 18 decks, 10 slides each
  node src/cli.mjs demo --collection source     Build redesigned supplied samples
  node src/cli.mjs demo --collection new        Build 10 new decks
  node src/cli.mjs demo --deck tomato-universe  Build one bundled deck
  node src/cli.mjs generate --topic "太空咖啡馆" --slides 10 --lang both
  node src/cli.mjs render --input my-deck.json   Render AI/user-authored JSON
  node src/cli.mjs prompt --topic "Space cafe"   Save a prompt for your AI tool

Options: --out path.html (prompt: path.txt), --lang both|zh|en, --force
Generation needs .env: LLM_BASE_URL, LLM_MODEL, LLM_API_KEY.
Both translations are always included; --lang controls the starting language.
Output: output/karaoke.html for demos; timestamped HTML + JSON for generation.
`;
async function ensureAvailable(path, force) {
  try { await access(path); } catch (error) { if (error.code === 'ENOENT') return; throw error; }
  if (!force) throw new Error(`File exists: ${path}. Choose another --out or pass --force.`);
}
try {
  const { values, positionals } = parseArgs({ allowPositionals: true, options: {
    topic: { type: 'string' }, slides: { type: 'string', default: '10' }, lang: { type: 'string', default: 'both' }, collection: { type: 'string', default: 'all' },
    out: { type: 'string' }, input: { type: 'string' }, deck: { type: 'string' }, force: { type: 'boolean' }, help: { type: 'boolean' }
  } });
  const command = positionals[0] || 'help';
  if (values.help || command === 'help') { console.log(help); process.exit(0); }
  if (positionals.length > 1) throw new Error('Unexpected positional arguments. Use --topic "your topic".');
  if (!['both', 'zh', 'en'].includes(values.lang)) throw new Error('--lang must be both, zh, or en');
  const language = values.lang === 'en' ? 'en' : 'zh-CN';
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  let result, destination;
  if (command === 'demo') {
    if (!['all','source','new'].includes(values.collection)) throw new Error('--collection must be all, source, or new');
    result = values.deck ? library.filter(d => d.id === values.deck) : library.filter(d => values.collection === 'all' || d.collection === values.collection);
    if (!result.length) throw new Error(`Unknown deck. Choose: ${library.map(d => d.id).join(', ')}`);
    destination = values.out || 'output/karaoke.html';
    if (values.out) await ensureAvailable(destination, values.force);
  } else if (command === 'generate' || command === 'prompt') {
    const topic = values.topic || '荒诞职场 / Absurd office life';
    const count = Number(values.slides);
    const prompt = makePrompt(topic, count);
    if (command === 'prompt') {
      const path = resolve(values.out || `output/prompt-${stamp}.txt`);
      await ensureAvailable(path, values.force); await mkdir(dirname(path), { recursive: true }); await writeFile(path, prompt, 'utf8');
      console.log(`Prompt saved: ${path}\nGive this prompt to your AI tool; save its JSON and run the render command.`);
      process.exit(0);
    }
    destination = values.out || `output/deck-${stamp}.html`;
    if (!destination.endsWith('.html')) throw new Error('--out must end with .html');
    await ensureAvailable(destination, values.force);
    await ensureAvailable(destination.replace(/\.html$/, '.json'), values.force);
    console.log('Generating bilingual content… (one validation repair at most)');
    result = [await generateDeck({ topic, count })];
  } else if (command === 'render') {
    if (!values.input) throw new Error('Use --input path/to/deck.json');
    const raw = await readFile(values.input, 'utf8'); if (raw.length > 2_000_000) throw new Error('Input must be under 2 MB');
    const parsed = JSON.parse(raw); result = Array.isArray(parsed) ? parsed : [parsed];
    if (!result.length || result.length > 100) throw new Error('Expected 1–100 decks');
    destination = values.out || `output/imported-${stamp}.html`;
    await ensureAvailable(destination, values.force);
  } else throw new Error(`Unknown command: ${command}\n${help}`);
  if (!destination.endsWith('.html')) throw new Error('--out must end with .html');
  const path = await writeHtml(result, destination, { language });
  if (command === 'generate') await writeFile(destination.replace(/\.html$/, '.json'), JSON.stringify(result[0], null, 2), 'utf8');
  console.log(`Ready: ${path}\n${result.length} bilingual deck(s). Double-click the HTML to play offline.`);
} catch (error) {
  console.error(`Error: ${error.message}`); process.exitCode = 1;
}
