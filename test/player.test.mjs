// Execute the real bundled player against a minimal DOM/event harness.
// This verifies state transitions, not browser layout or native fullscreen/downloads.
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { buildHtml } from '../src/build.mjs';
import { sampleDecks as decks } from '../src/sample-decks.mjs';
import { sampleDecks } from '../src/sample-decks.mjs';
import { newDecks } from '../src/new-decks.mjs';
import { library } from '../src/library.mjs';

async function player(input = decks, mode = 'default', options = {}) {
  const html = await buildHtml(input, options);
  const code = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  let now = 0, interval;
  const events = {}, appEvents = {};
  const app = { innerHTML: '', addEventListener: (name, fn) => { appEvents[name] = fn; } };
  const timer = { textContent: '', classList: { toggle() {} } };
  const document = {
    hidden: false, body: { className: '' }, documentElement: { lang: '' },
    getElementById: id => id === 'app' ? app : id === 'clock' ? timer : { textContent: html.match(/<script type="application\/json" id="deck-data">([\s\S]*?)<\/script>/)[1] },
    addEventListener: (name, fn) => { events[name] = fn; }
  };
  vm.runInNewContext(code, { document, performance: { now: () => now }, setInterval: fn => { interval = fn; }, console, Blob, URL, setTimeout, window: { alert() {} } });
  if (mode !== 'default') await appEvents.change({target:{id:'mode',value:mode}});
  return {
    app, timer, document,
    click: action => appEvents.click({ target: { closest: () => ({ dataset: { action } }) } }),
    choose: n => appEvents.click({ target: { closest: () => ({ dataset: { deck: String(n) } }) } }),
    filter: value => appEvents.click({target:{closest:()=>({dataset:{filter:value}})}}),
    change: (id, value) => appEvents.change({ target: { id, value } }),
    key: key => events.keydown({ key, target: { tagName: 'BODY' }, preventDefault() {} }),
    tick: milliseconds => { now += milliseconds; interval(); },
    hide: () => { document.hidden = true; events.visibilitychange(); },
    show: () => { document.hidden = false; events.visibilitychange(); },
    import: text => appEvents.change({ target: { id: 'import', files: [{ size: text.length, text: async () => text }] } })
  };
}

test('home does not reveal deck titles; UI and content language are independent', async () => {
  const p = await player();
  assert(!p.app.innerHTML.includes(decks[0].title['zh-CN']));
  p.click('ui-en'); assert.match(p.app.innerHTML, /NO PREP/);
  p.click('start'); assert.match(p.app.innerHTML, /宇宙的尽头是西红柿/);
  p.tick(480000); assert.equal(p.timer.textContent, '08:00');
  assert.match(p.app.innerHTML, /宇宙的尽头是西红柿/);
  p.click('content-lang'); assert.match(p.app.innerHTML, /The Universe Ends with a Tomato/);
  assert.match(p.app.innerHTML, /08:00/);
  p.key('ArrowLeft'); assert.match(p.app.innerHTML, /The Universe Ends with a Tomato/);
  p.key(' '); assert.match(p.app.innerHTML, /The Universe vs. a Tomato/);
});

test('all 180 extended slides render both languages with all packaged pictures', async () => {
  const p = await player(library);
  let count=0;
  for (let d=0;d<library.length;d++) {
    p.choose(d); p.click('start');
    for (const s of library[d].slides) {
      const escaped = value => value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
      assert(p.app.innerHTML.includes(escaped(s.title['zh-CN'])));
      if (s.image || s.images) assert(p.app.innerHTML.includes('data:image/'));
      p.click('content-lang'); assert(p.app.innerHTML.includes(escaped(s.title.en)));
      assert(!p.app.innerHTML.includes('undefined'));
      p.click('content-lang'); p.click('next'); count++;
    }
    assert.match(p.app.innerHTML,/居然还挺像回事/); p.click('home');
  }
  assert.equal(count,180);
});

test('optional paced round lasts exactly seven active minutes and cannot skip ahead', async () => {
  const p=await player(library,'paced'); p.click('start');
  assert.match(p.app.innerHTML,/00:42/);
  p.key(' '); p.click('next'); assert.match(p.app.innerHTML,/01 \/ 10/);
  p.tick(12000); assert.equal(p.timer.textContent,'00:30');
  p.click('content-lang'); assert.match(p.app.innerHTML,/00:30/);
  p.click('pause'); p.tick(90000); p.click('pause');
  p.tick(30000); assert.match(p.app.innerHTML,/02 \/ 10/);
  p.tick(377999); assert.match(p.app.innerHTML,/10 \/ 10/);
  p.tick(1); assert.match(p.app.innerHTML,/07:00/); assert.match(p.app.innerHTML,/居然还挺像回事/);
});

test('six and eight minute rounds honor total duration, including delayed timer ticks',async()=>{
  for(const minutes of [6,8]) {
    const p=await player(library,'paced');await p.change('minutes',String(minutes));p.click('start');
    p.tick(minutes*60000+1234);
    assert.match(p.app.innerHTML,new RegExp(`0${minutes}:00`));assert.match(p.app.innerHTML,/居然还挺像回事/);
  }
});

test('filtered entry points retain every supplied PPT topic without removed prototypes',async()=>{
  const p=await player(library,'default',{initialFilter:'new'});
  assert(!p.app.innerHTML.includes('data-deck="0"'));assert(!p.app.innerHTML.includes('最初的三套'));
  p.filter('all');assert.equal((p.app.innerHTML.match(/data-deck=/g)||[]).length,18);
  p.filter('source');assert.equal((p.app.innerHTML.match(/data-deck=/g)||[]).length,8);
  p.click('review');p.click('start');p.click('next');assert.match(p.app.innerHTML,/02 \/ 10/);
});

test('all 84 redesigned slides render in both languages, with embedded images', async () => {
  const inputs=[...sampleDecks,...newDecks];
  const p=await player(inputs);
  let visited=0,illustrated=0;
  for(let d=0;d<inputs.length;d++) {
    p.choose(d);p.click('start');
    for(let i=0;i<inputs[d].slides.length;i++) {
      assert(p.app.innerHTML.includes(`${String(i+1).padStart(2,'0')} / 06`));
      const s=inputs[d].slides[i];
      if(s.image||s.images) {assert(p.app.innerHTML.includes('data:image/'));illustrated++;}
      assert(!p.app.innerHTML.includes('undefined'));
      p.click('content-lang');assert(p.app.innerHTML.includes('Slides → 中文'));
      assert(!p.app.innerHTML.includes('undefined'));
      p.click('content-lang');p.click('next');visited++;
    }
    assert.match(p.app.innerHTML,/居然还挺像回事/);p.click('home');
  }
  assert.equal(visited,84);assert(illustrated>=30);
});

test('host review reveals titles and allows back/jump; blind mode does not', async () => {
  const p=await player([...sampleDecks,...newDecks]);
  assert(!p.app.innerHTML.includes(sampleDecks[0].title['zh-CN']));
  p.click('review');assert(p.app.innerHTML.includes(sampleDecks[0].title['zh-CN']));
  p.click('start');p.click('next');p.key('ArrowLeft');assert.match(p.app.innerHTML,/01 \/ 06/);
  await p.change('review-slide','4');assert.match(p.app.innerHTML,/05 \/ 06/);
  p.click('pause');p.click('home');p.click('review');p.click('start');p.click('next');p.key('ArrowLeft');
  assert.match(p.app.innerHTML,/02 \/ 06/);assert(!p.app.innerHTML.includes('review-slide'));
});

test('collection filter selects a deck in that collection',async()=>{
  const p=await player([...sampleDecks,...newDecks]);p.filter('new');
  assert(!p.app.innerHTML.includes('data-deck="0"'));assert(p.app.innerHTML.includes('data-deck="8"'));
  p.click('start');assert(p.app.innerHTML.includes('周一，是未经批准的时间膨胀实验'));
});

test('all eight supplied decks render every page in both languages and finish', async () => {
  for (let d = 0; d < decks.length; d++) {
    const p = await player(); p.choose(d); p.click('start');
    for (let i = 0; i < decks[d].slides.length; i++) {
      assert.match(p.app.innerHTML, new RegExp(`${String(i + 1).padStart(2, '0')} / 06`));
      p.click('content-lang'); assert(p.app.innerHTML.includes('Slides → 中文'));
      p.click('content-lang'); assert(p.app.innerHTML.includes('内容 → EN'));
      p.click('next');
    }
    assert.match(p.app.innerHTML, /居然还挺像回事/);
    p.click('home'); assert.match(p.app.innerHTML, /选一个盲盒主题/);
  }
});

test('timed mode preserves time across language switches; pause and background freeze it', async () => {
  const p = await player();
  await p.change('mode', 'auto'); await p.change('seconds', '15'); p.click('start');
  p.tick(5000); assert.equal(p.timer.textContent, '00:10');
  p.click('content-lang'); assert.match(p.app.innerHTML, /00:10/);
  p.click('pause'); p.tick(20000); p.click('next'); assert.match(p.app.innerHTML, /01 \/ 06/);
  p.click('pause'); p.tick(10000); assert.match(p.app.innerHTML, /02 \/ 06/);
  p.hide(); assert.match(p.app.innerHTML, /喘口气/); p.tick(20000); p.show();
  assert.match(p.app.innerHTML, /02 \/ 06/); p.click('pause'); p.tick(15000);
  assert.match(p.app.innerHTML, /03 \/ 06/);
});

test('JSON import validates atomically and escapes imported HTML', async () => {
  const p = await player();
  await p.import('{not json}'); assert.match(p.app.innerHTML, /导入失败/);
  const d = structuredClone(decks[0]); d.category['zh-CN'] = '<img src=x onerror=alert(1)>';
  await p.import(JSON.stringify(d));
  assert.match(p.app.innerHTML, /已导入 1 套内容/);
  assert(!p.app.innerHTML.includes('<img src=x'));
  assert(p.app.innerHTML.includes('&lt;img'));
  p.click('start'); assert.match(p.app.innerHTML, /宇宙的尽头是西红柿/);
});
