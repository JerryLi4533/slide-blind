import { validateDeck } from './validate.mjs';
import { newLibrary } from './library.mjs';
export function makePrompt(topic, count = 10) {
  if (!Number.isInteger(count) || count < 3 || count > 16) throw new Error('Slides must be an integer from 3 to 16.');
  if (typeof topic !== 'string' || !topic.trim() || topic.length > 300) throw new Error('Topic must contain 1–300 characters.');
  const example = structuredClone(newLibrary[1]);
  example.slides.forEach(slide => { delete slide.image; delete slide.images; });
  return `Create a bilingual PowerPoint karaoke deck as a JSON object, not Markdown or code.
The presenter has never seen the slides. It is a friendly party game for adults. Topic: ${JSON.stringify(topic)}.
Return exactly ${count} slides. Follow this style learned from the user's Chinese karaoke samples: a familiar daily-life observation is defended as an absurd academic thesis, with concrete evidence, an invented model, escalating consequences, and a final callback to an ordinary detail. Target a 6–8 minute performance (default 7 minutes, about 42 seconds per slide for 10 slides). Suggested 10-slide sequence: thesis → relatable observation → specific case study → fake explanatory model → evidence → dialogue or challenge → contradiction requiring improvisation → proposed solution → unintended consequence → final callback. For shorter counts, combine stages. Develop the premise with concrete details on each page; do not pad with repeated slogans. The surprise should follow from the premise; avoid disconnected random twists.
Use deadpan, natural Chinese and equally natural localized English. Show enough specific details to improvise a credible argument. Vary the rhetorical device: comparison, annotated timeline, fake equation, evidence table, chat transcript. Do not fill every page with the same list, rely on animal CEOs, end every deck with fundraising, or explain why a joke is funny. Do not invent speeches or detailed presenter notes. Different decks should have distinct observations and callbacks.
All claims and numbers are fictional game content; label chart data as fictional in the bilingual subtitle. Avoid real-person allegations and hateful content. Scientific vocabulary is a comic framing, not factual advice.
Every title, category, description, kicker, subtitle, and item label is an object with nonempty "zh-CN" and "en" strings. Both languages describe the SAME slide; use identical numbers and plot. Titles max 100 characters (prefer <22 Chinese characters and <65 English characters); subtitles max 180. Item labels max 100 (prefer <15 Chinese characters and <50 English characters).
Deck fields: id (lowercase slug, max 60), title, category (max 60 characters per language), description (max 180), accent (orange, blue, or green), theme (cosmic, cream, alert, mint, noir), collection (new), slides.
Slide fields: type, title; optional subtitle, kicker, value. Types: cover, compare, chart, visual, twist, quote, finale, stat, words, statement, evidence, steps, formula, table, timeline, chat.
Use typographic covers with optional short value (<=12 characters) rather than unrelated illustrations. Do not specify image or images fields: these require catalog assets. No HTML, scripts, remote URLs, or SVG code.
compare: items must have exactly 2 objects with bilingual label.
chart: items has 2–4 objects with bilingual label and numeric value from 0 to 100. Use a horizontal bar chart and explain units in subtitle. Percentages must sum to 100 when they describe shares.
words, evidence, steps, table, timeline, chat: items has 2–6 objects with bilingual label and optional bilingual detail (max 180 characters, prefer <60 English / <35 Chinese). For chat, label is the speaker and detail is the message. For timeline, label is the time and detail is the event.
formula: bilingual formula string max 180 characters; optional 2–4 items explaining the terms.
stat: value is a short string of at most 12 characters, explaining the unit in subtitle.
First slide must be cover; last must be finale. Use at least 4 different types when count allows it. Return only the JSON object.
Example schema and style (create NEW observations and content for the requested topic):\n${JSON.stringify(example)}`;
}
export async function generateDeck({ topic, count = 10, env = process.env, fetchImpl = fetch }) {
  const prompt = makePrompt(topic, count);
  const base = new URL(env.LLM_BASE_URL || 'https://api.openai.com/v1');
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(base.hostname);
  if (base.username || base.password || base.search || base.hash || (!local && base.protocol !== 'https:') || !['http:', 'https:'].includes(base.protocol)) throw new Error('LLM_BASE_URL must use HTTPS, or HTTP on localhost, without credentials/query/hash.');
  if (!env.LLM_MODEL) throw new Error('Set LLM_MODEL in .env. Try: node src/cli.mjs demo (no API key needed).');
  if (!env.LLM_API_KEY && !(local && env.LLM_ALLOW_NO_KEY === '1')) throw new Error('Set LLM_API_KEY in .env. For a trusted local server only, set LLM_ALLOW_NO_KEY=1.');
  const endpoint = base.href.replace(/\/$/, '') + '/chat/completions';
  const messages = [{ role: 'system', content: 'You create concise bilingual improv game slides. Output valid JSON only.' }, { role: 'user', content: prompt }];
  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await fetchImpl(endpoint, {
      method: 'POST', signal: AbortSignal.timeout(120000),
      headers: { 'Content-Type': 'application/json', ...(env.LLM_API_KEY ? { Authorization: `Bearer ${env.LLM_API_KEY}` } : {}) },
      body: JSON.stringify({ model: env.LLM_MODEL, response_format: { type: 'json_object' }, messages })
    });
    if (!response.ok) throw new Error(`Model request failed (HTTP ${response.status}). Check your endpoint, model access, and JSON mode support.`);
    const payload = await response.json();
    const content = payload.choices?.[0]?.message?.content;
    if (typeof content !== 'string' || content.length > 200000) throw new Error('Model returned no usable text or an oversized response.');
    try {
      const result = validateDeck(JSON.parse(content));
      if (result.slides.length !== count) throw new Error(`Expected ${count} slides, got ${result.slides.length}`);
      if (result.slides[0].type !== 'cover' || result.slides.at(-1).type !== 'finale') throw new Error('First slide must be cover; last must be finale.');
      return result;
    } catch (error) {
      if (attempt === 1) throw new Error(`Model output still invalid after one repair: ${error.message}`);
      messages.push({ role: 'assistant', content }, { role: 'user', content: `Repair the JSON. Validation failed: ${error.message}. Return the complete corrected JSON deck.` });
    }
  }
}
