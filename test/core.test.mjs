import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleDecks as decks } from '../src/sample-decks.mjs';
import { validateDeck } from '../src/validate.mjs';
import { buildHtml } from '../src/build.mjs';
import { generateDeck, makePrompt } from '../src/generate.mjs';
import vm from 'node:vm';

test('all bundled decks are bilingual and render into one self-contained HTML', async () => {
  for (const deck of decks) assert.equal(validateDeck(deck), deck);
  const html = await buildHtml(decks);
  assert(!html.includes('/*__')); assert(!html.includes('__DATA__'));
  assert(!/<(?:script|link|img)\b[^>]*(?:src|href)=["']https?:/i.test(html));
  const json = html.match(/<script type="application\/json" id="deck-data">([\s\S]*?)<\/script>/)[1];
  assert.equal(JSON.parse(json).decks.length, 8);
  const code = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  assert.doesNotThrow(() => new vm.Script(code));
});
test('untrusted deck text cannot terminate the embedded script', async () => {
  const d = structuredClone(decks[0]); d.title.en = '</script><img src=x onerror=alert(1)>';
  const html = await buildHtml([d]);
  assert(!html.includes(d.title.en));
  assert(html.includes('\\u003c/script>'));
});
test('reject missing translations, invalid chart numbers, missing items', () => {
  const d = structuredClone(decks[0]); delete d.slides[0].title.en;
  assert.throws(() => validateDeck(d), /title.en/);
  const c = structuredClone(decks[0]); c.slides[2].type = 'chart'; c.slides[2].items.forEach(i => { i.value = 25; }); c.slides[2].items[0].value = -20;
  assert.throws(() => validateDeck(c), /chart values/);
  c.slides[2].items = []; assert.throws(() => validateDeck(c), /item count/);
});
test('prompt limits slide count and includes bilingual schema', () => {
  assert.throws(() => makePrompt('x', 99), /3 to 16/);
  assert.throws(() => makePrompt('', 8), /Topic/);
  assert.match(makePrompt('太空咖啡馆', 8), /exactly 8 slides/);
});
test('generation repairs invalid model JSON once and keeps credentials out of deck', async () => {
  let calls = 0;
  const result = await generateDeck({ topic: 'tomato', count: 6, env: { LLM_MODEL: 'test-model', LLM_API_KEY: 'test-secret' }, fetchImpl: async (url, options) => {
    calls++; assert.equal(url, 'https://api.openai.com/v1/chat/completions');
    assert.equal(options.headers.Authorization, 'Bearer test-secret');
    const body = JSON.parse(options.body); assert.equal(body.response_format.type, 'json_object');
    if (calls === 2) assert.match(body.messages.at(-1).content, /Repair the JSON/);
    return { ok: true, json: async () => ({ choices: [{ message: { content: calls === 1 ? '{}' : JSON.stringify(decks[0]) } }] }) };
  } });
  assert.equal(calls, 2); assert.equal(result.id, 'tomato-universe'); assert(!JSON.stringify(result).includes('test-secret'));
});
test('generation rejects missing credentials, insecure remote endpoint and non-OK response', async () => {
  await assert.rejects(generateDeck({ topic: 'x', env: {} }), /LLM_MODEL/);
  await assert.rejects(generateDeck({ topic: 'x', env: { LLM_MODEL: 'm', LLM_BASE_URL: 'http://example.com/v1' } }), /HTTPS/);
  await assert.rejects(generateDeck({ topic: 'x', env: { LLM_MODEL: 'm', LLM_API_KEY: 'test' }, fetchImpl: async () => ({ ok: false, status: 401 }) }), /HTTP 401/);
});
test('local model can explicitly opt out of auth', async () => {
  const d = await generateDeck({ topic: 'x', count: 6, env: { LLM_BASE_URL: 'http://127.0.0.1:9999/v1', LLM_MODEL: 'local', LLM_ALLOW_NO_KEY: '1' }, fetchImpl: async (url, options) => {
    assert(!options.headers.Authorization);
    return { ok: true, json: async () => ({ choices: [{ message: { content: JSON.stringify(decks[0]) } }] }) };
  } });
  assert.equal(d.slides.length, 6);
});
