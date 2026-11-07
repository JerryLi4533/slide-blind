export const types = ['cover', 'compare', 'chart', 'visual', 'twist', 'quote', 'finale', 'stat', 'words', 'statement', 'evidence', 'steps', 'formula', 'table', 'timeline', 'chat', 'gallery'];
export function validateDeck(deck) {
  const fail = message => { throw new Error(`Invalid deck: ${message}`); };
  const text = (v, path, limit = 180) => {
    if (!v || typeof v !== 'object' || Array.isArray(v)) fail(`${path} must be bilingual`);
    for (const locale of ['zh-CN', 'en']) {
      if (typeof v[locale] !== 'string' || !v[locale].trim() || v[locale].length > limit) fail(`${path}.${locale}: expected 1–${limit} characters`);
    }
  };
  if (!deck || typeof deck !== 'object') fail('expected an object');
  if (!/^[a-z0-9-]{1,60}$/.test(deck.id || '')) fail('id must be a short lowercase slug');
  text(deck.title, 'title', 100); text(deck.category, 'category', 60); text(deck.description, 'description');
  if (!['orange', 'blue', 'green'].includes(deck.accent)) fail('unknown accent');
  if (deck.theme !== undefined && !['cosmic','cream','alert','mint','noir'].includes(deck.theme)) fail('unknown theme');
  if (deck.collection !== undefined && !['source','new','legacy'].includes(deck.collection)) fail('unknown collection');
  if (!Array.isArray(deck.slides) || deck.slides.length < 3 || deck.slides.length > 16) fail('expected 3–16 slides');
  deck.slides.forEach((s, i) => {
    const p = `slides[${i}]`;
    if (!s || !types.includes(s.type)) fail(`${p}: unknown type`);
    text(s.title, `${p}.title`, 100);
    for (const key of ['subtitle', 'kicker']) if (s[key] !== undefined) text(s[key], `${p}.${key}`);
    if (s.formula !== undefined) text(s.formula, `${p}.formula`, 180);
    if (s.type === 'formula' && !s.formula) fail(`${p}: formula required`);
    const checkImage = id => { if (typeof id !== 'string' || !/^image[0-9]{1,4}$/.test(id)) fail(`${p}: image must be a packaged asset ID`); };
    if (s.image !== undefined) checkImage(s.image);
    if (s.images !== undefined) { if (!Array.isArray(s.images) || s.images.length > 4 || !s.images.length) fail(`${p}: expected 1–4 images`); s.images.forEach(checkImage); }
    if (s.sourceSlide !== undefined && (!Number.isInteger(s.sourceSlide) || s.sourceSlide < 1 || s.sourceSlide > 62)) fail(`${p}: invalid source slide`);
    if (s.art !== undefined && !['goose', 'moon', 'cat', 'egg', 'spark'].includes(s.art)) fail(`${p}: unknown art`);
    if ((s.type === 'stat' || s.value !== undefined) && (typeof s.value !== 'string' || s.value.length > 12)) fail(`${p}: invalid value`);
    if (['chart', 'compare', 'words','evidence','steps','table','timeline','chat','gallery'].includes(s.type) || s.items !== undefined) {
      const count = s.type === 'compare' ? 2 : s.type === 'chart' ? 4 : 6;
      if (!Array.isArray(s.items) || s.items.length < 2 || s.items.length > count) fail(`${p}: invalid item count`);
      s.items.forEach((item, j) => {
        text(item?.label, `${p}.items[${j}].label`, 100);
        if (item.detail !== undefined) text(item.detail, `${p}.items[${j}].detail`, 180);
        if (s.type === 'chart' && (typeof item.value !== 'number' || !Number.isFinite(item.value) || item.value < 0 || item.value > 100)) fail(`${p}: chart values must be 0–100`);
      });
    }
  });
  return deck;
}
