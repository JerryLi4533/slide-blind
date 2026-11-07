import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {sampleDecks} from '../src/sample-decks.mjs';
import {newDecks} from '../src/new-decks.mjs';
import {buildHtml} from '../src/build.mjs';
import {validateDeck} from '../src/validate.mjs';
import {makePrompt} from '../src/generate.mjs';
import {library, shortLibrary} from '../src/library.mjs';

test('full library preserves all 14 sample-based decks and slide order while expanding to 18 by 10',()=>{
  assert.equal(library.length,18);assert.equal(new Set(library.map(d=>d.id)).size,18);
  for(const d of library){validateDeck(d);assert.equal(d.slides.length,10);assert.equal(d.slides[0].type,'cover');assert.equal(d.slides.at(-1).type,'finale');}
  for(const old of shortLibrary){
    const extended=library.find(d=>d.id===old.id);let cursor=0;
    for(const slide of extended.slides)if(JSON.stringify(slide)===JSON.stringify(old.slides[cursor]))cursor++;
    assert.equal(cursor,old.slides.length,`${old.id}: original content retained in order`);
  }
  assert.deepEqual(['source','new'].map(c=>library.filter(d=>d.collection===c).length),[8,10]);
  assert(!library.some(d=>['goose-ceo','moon-noodles','cat-city'].includes(d.id)));
});

test('8 supplied topics retain their 48 source-slide mappings',()=>{
  const actual=sampleDecks.flatMap(d=>d.slides.map(s=>s.sourceSlide));
  const expected=[6,13,20,27,34,41,48,55].flatMap(start=>Array.from({length:6},(_,i)=>start+i));
  assert.deepEqual(actual,expected);
  for(const deck of [...sampleDecks,...newDecks]){validateDeck(deck);assert.equal(deck.slides.length,6);}
  assert.equal(new Set([...sampleDecks,...newDecks].map(d=>d.id)).size,14);
});
test('asset catalog resolves every original image and new renderer reference',async()=>{
  const catalog=JSON.parse(await readFile(new URL('../assets/catalog.json',import.meta.url),'utf8'));
  const slides=JSON.parse(await readFile(new URL('../assets/source-slides.json',import.meta.url),'utf8'));
  assert.equal(slides.length,62);
  for(const slide of slides)for(const image of slide.images)assert(catalog[image.file.split('.')[0]]);
  const html=await buildHtml(library);
  const data=JSON.parse(html.match(/<script type="application\/json" id="deck-data">([\s\S]*?)<\/script>/)[1]);
  for(const d of data.decks)for(const s of d.slides)for(const id of [s.image,...(s.images||[])].filter(Boolean))assert(data.media[id]);
  assert(!/<(?:img|script|link)[^>]*(src|href)=["']https?:/i.test(html));
  assert(html.length<8_000_000,'combined file with generated artwork should remain comfortably portable');
});
test('reject remote images and unsafe layout metadata',()=>{
  const d=structuredClone(sampleDecks[0]);d.slides[0].image='https://example.com/a.jpg';assert.throws(()=>validateDeck(d),/asset ID/);
  d.slides[0].image='image14';d.theme='" onload="x';assert.throws(()=>validateDeck(d),/theme/);
});
test('generation prompt teaches the supplied narrative style, not the old animal-CEO recipe',()=>{
  const p=makePrompt('冰箱里的剩菜');
  assert.match(p,/exactly 10 slides/);assert.match(p,/6–8 minute/);assert.match(p,/familiar daily-life observation/);assert.match(p,/final callback/);
  assert.match(p,/timeline, chat/);
});
