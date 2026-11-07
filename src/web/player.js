(() => {
  'use strict';
  const data = JSON.parse(document.getElementById('deck-data').textContent);
  let library = data.decks;
  const media = data.media || {};
  const mediaDescriptions = data.mediaDescriptions || {};
  library.forEach(validateDeck);
  let ui = data.language || 'zh-CN', lang = ui, selected = 0, mode = 'manual', seconds = 30, minutes = 7;
  let screen = 'home', index = 0, paused = false, remaining = 0, elapsed = 0, previous = performance.now(), notice = '';
  let filter = ['all','source','new'].includes(data.initialFilter) ? data.initialFilter : 'all', review = false;
  if (filter !== 'all') selected = Math.max(0, library.findIndex(d => d.collection === filter));
  const app = document.getElementById('app');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const tr = (zh, en) => ui === 'zh-CN' ? zh : en;
  const tx = object => esc(object?.[lang] || '');
  const clock = value => `${String(Math.floor(Math.max(0, value) / 60)).padStart(2, '0')}:${String(Math.floor(Math.max(0, value) % 60)).padStart(2, '0')}`;
  const current = () => library[selected];
  const pageDuration = () => mode === 'paced' ? minutes * 60000 / current().slides.length : seconds * 1000;
  const locked = () => mode === 'paced' && !review;
  const brand = () => `<div class="brand"><span class="brand-mark" aria-hidden="true">▰▰</span><div>SLIDE BLIND<small>THE IMPROV SLIDE CLUB</small></div></div>`;
  const languageButtons = () => `<div class="lang-group" aria-label="${tr('界面语言','Interface language')}"><button data-action="ui-zh" class="${ui === 'zh-CN' ? 'active' : ''}" aria-pressed="${ui === 'zh-CN'}">中文</button><button data-action="ui-en" class="${ui === 'en' ? 'active' : ''}" aria-pressed="${ui === 'en'}">EN</button></div>`;
  const star = `<svg viewBox="0 0 120 120" fill="none" aria-hidden="true"><path d="M60 0 70 35 100 14 85 46 120 50 88 64 110 94 76 82 68 120 54 87 22 109 36 77 0 68 34 53 13 23 46 36Z" fill="currentColor"/><circle cx="47" cy="54" r="4" fill="#ee532f"/><circle cx="71" cy="54" r="4" fill="#ee532f"/><path d="M46 68Q60 83 74 68" stroke="#ee532f" stroke-width="4"/></svg>`;
  function art(kind) {
    let drawing;
    if (kind === 'cat') drawing = `<path d="M85 210 75 90 155 130Q200 110 245 130L325 90 310 225Q300 315 200 315T85 210" fill="#d08d42" stroke="#23241f" stroke-width="6"/><path d="m100 120 8 65 42-39m150-26-8 65-42-39" fill="#e8b9a5"/><path d="m135 210 30-4m70 0 30 4" stroke="#23241f" stroke-width="8" stroke-linecap="round"/><path d="m190 232 20 0-10 15Z" fill="#23241f"/><path d="M200 245q-5 20-25 8m25-8q5 20 25 8M77 232l-48-10m50 30-49 6m291-26 48-10m-50 30 49 6" stroke="#23241f" stroke-width="5" fill="none"/><path d="M115 322h170v35H115z" fill="#aebc99" stroke="#23241f" stroke-width="5"/>`;
    else if (kind === 'moon') drawing = `<circle cx="200" cy="200" r="130" fill="#e5dba6" stroke="#23241f" stroke-width="5"/><circle cx="150" cy="135" r="30" fill="#c9bd88"/><circle cx="260" cy="178" r="19" fill="#c9bd88"/><circle cx="140" cy="252" r="19" fill="#c9bd88"/><path d="M115 222h175q-12 85-87 85t-88-85" fill="#ee532f" stroke="#23241f" stroke-width="5"/><path d="M135 218q-20-30 10-50m28 50q-20-30 10-50m28 50q-20-30 10-50" stroke="#23241f" stroke-width="5" fill="none"/><path d="m225 210 80-100m-62 108 80-100" stroke="#23241f" stroke-width="7" stroke-linecap="round"/><path d="M55 90h30m-15-15v30m245 195h30m-15-15v30" stroke="#23241f" stroke-width="5"/>`;
    else if (kind === 'egg') drawing = `<path d="M115 125h170v180H115z" fill="#e5e5d5" stroke="#23241f" stroke-width="6"/><path d="M145 90h110v90H145z" fill="#f4f1e9" stroke="#23241f" stroke-width="5"/><path d="M95 180h210v65H95z" fill="#afbaa4" stroke="#23241f" stroke-width="5"/><circle cx="275" cy="205" r="7" fill="#ee532f"/><path d="M149 275c0-60 35-102 51-102s51 42 51 102c0 60-102 60-102 0Z" fill="#fff3ce" stroke="#23241f" stroke-width="5"/><path d="m185 235 16 15-12 18 24 10" fill="none" stroke="#23241f" stroke-width="4"/>`;
    else if (kind === 'spark') return `<div class="illustration" style="color:var(--accent)">${star}</div>`;
    else drawing = `<path d="M93 249Q62 198 125 194L190 204 200 128Q202 74 247 82Q285 89 269 131L244 191Q291 235 261 279Q237 317 174 301L105 286 70 261Z" fill="#fffdf4" stroke="#23241f" stroke-width="6" stroke-linejoin="round"/><path d="m269 106 57 23-61 13" fill="#ee8b35" stroke="#23241f" stroke-width="5" stroke-linejoin="round"/><circle cx="250" cy="105" r="5" fill="#23241f"/><path d="M122 226q35 52 87 17" fill="none" stroke="#23241f" stroke-width="5" stroke-linecap="round"/><path d="m165 300-10 42-30 2m88-42 8 40 30 2" fill="none" stroke="#23241f" stroke-width="7" stroke-linecap="round"/><path d="m208 169 24 10-12 15-17-17 1 41-20-17Z" fill="#ee532f" stroke="#23241f" stroke-width="3"/><path d="m66 152 18 7m-5-35 13 15m-36 43 22-1" stroke="#23241f" stroke-width="5" stroke-linecap="round"/>`;
    return `<svg class="illustration" viewBox="0 0 400 400" role="img" aria-label="${tr('游戏插画','Game illustration')}">${drawing}</svg>`;
  }
  function renderHome() {
    document.body.className = '';
    app.innerHTML = `<div class="wrap"><header class="masthead">${brand()}<nav class="nav"><span class="offline tiny"><i class="dot"></i>${tr('完全离线 · 随时开讲','OFFLINE & READY')}</span>${languageButtons()}</nav></header>
      <section class="hero"><div><div class="eyebrow">${tr('一场毫无准备的演讲派对','A PRESENTATION PARTY. UNPREPARED.')}</div><h1>${tr('临场发挥。<br><em>大胆开讲。</em>','NO PREP.<br><em>ALL NERVE.</em>')}</h1><p class="intro">${tr('你没看过这些幻灯片。观众不知道你没准备。<br>把下一页的意外，讲成你的独到见解。','You have never seen these slides.<br>Make every unexpected turn sound like part of the plan.')}</p><div class="hero-note"><span><b>01</b> ${tr('选一套','Pick a deck')}</span><span><b>02</b> ${tr('站起来','Take the stage')}</span><span><b>03</b> ${tr('开始编','Make it up')}</span></div></div><div class="poster" aria-hidden="true"><div class="poster-back"></div><div class="poster-main"><div class="poster-line tiny"><span>TOP SECRET</span><span>✳ 008</span></div><h2>${tr('下一页？<br>你也不知道。','NEXT SLIDE?<br>YOUR GUESS.')}</h2><span class="poster-number tiny">TRUST YOUR NONSENSE.</span><div class="star">${star}</div></div><div class="sticker">${tr('零准备<br>百分百即兴','ZERO PREP<br>100% IMPROV')}</div></div></section>
      <section aria-label="${tr('游戏设置','Game settings')}"><div class="section-line"><h2>${tr('选一个盲盒主题','PICK YOUR MYSTERY DECK')}</h2><span>${review ? tr('主持人审阅中：显示题目，允许返回','Host review: titles visible, back navigation enabled') : tr('题目将在开始后揭晓','The title stays hidden until you start')}</span></div><div class="collection-bar"><div class="collection-tabs">${[['all','全部','All'],['source','原 PPT 样本','Original PPT samples'],['new','全新创作','New originals']].map(([value,zh,en]) => `<button class="${filter===value?'active':''}" data-filter="${value}">${tr(zh,en)} <small>${library.filter(d=>value==='all'||d.collection===value).length}</small></button>`).join('')}</div><button class="review-toggle" data-action="review" aria-pressed="${review}">${review?tr('退出主持人审阅','Leave host review'):tr('主持人审阅（显示题目）','Host review (reveal titles)')}</button></div><div class="decks">${library.map((d, i) => filter!=='all'&&d.collection!==filter ? '' : `<button class="deck ${i === selected ? 'selected' : ''} theme-${d.theme||'cream'}" data-deck="${i}" aria-pressed="${i === selected}"><div class="deck-top"><span>${String(i + 1).padStart(2, '0')} / ${d.collection==='source'?tr('原样本','SOURCE'):d.collection==='new'?tr('新作','NEW'):tr('导入','IMPORTED')}</span><span class="radio"></span></div><h3>${esc((review?d.title:d.category)[ui])}</h3><p>${d.slides.length} ${tr('页 · 中英双语 · 6–8分钟','slides · bilingual · 6–8 min')}</p></button>`).join('')}</div>
      <p class="round-note">${tr('默认手动翻页：按空格、右方向键或点“下一页”。每套建议讲 6–8 分钟，计时器仅显示已用时间。','Manual by default: press Space, Right arrow, or Next slide. Aim for 6–8 minutes per deck; the timer only shows elapsed time.')}</p><div class="setup"><div class="fields"><label class="field">${tr('幻灯片语言','SLIDE LANGUAGE')}<select id="content-language"><option value="zh-CN" ${lang === 'zh-CN' ? 'selected' : ''}>中文</option><option value="en" ${lang === 'en' ? 'selected' : ''}>English</option></select></label><label class="field">${tr('翻页方式','PLAY MODE')}<select id="mode"><option value="manual" ${mode === 'manual' ? 'selected' : ''}>${tr('手动翻页（默认）','Manual (default)')}</option><option value="paced" ${mode === 'paced' ? 'selected' : ''}>${tr('整场定时自动翻页','Timed auto advance')}</option><option value="auto" ${mode === 'auto' ? 'selected' : ''}>${tr('计时挑战','Beat the clock')}</option></select></label><label class="field">${tr('整场时长','ROUND LENGTH')}<select id="minutes" ${mode !== 'paced' ? 'disabled' : ''}>${[6,7,8].map(v=>`<option value="${v}" ${minutes===v?'selected':''}>${v} ${tr('分钟','min')}</option>`).join('')}</select></label><label class="field">${tr('每页时长','SECONDS / SLIDE')}<select id="seconds" ${mode !== 'auto' ? 'disabled' : ''}>${[15, 20, 30, 45, 60].map(v => `<option value="${v}" ${seconds === v ? 'selected' : ''}>${v} ${tr('秒','sec')}</option>`).join('')}</select></label></div><button class="primary" data-action="start">${tr('我准备好胡说了','LET ME COOK')}<span class="arrow">↗</span></button></div></section>
      ${notice ? `<div class="notice" role="status">${esc(notice)}</div>` : ''}<footer class="footer"><span>${tr('所有情节与数据均为虚构。认真表演，别太当真。','Fictional stories. Made-up numbers. Very real confidence.')}</span><div class="links"><label class="import-label">${tr('导入 JSON','Import JSON')}<input id="import" type="file" accept=".json,application/json"></label><button class="text-button" data-action="download">${tr('下载选中套装','Download this deck')}</button></div></footer></div>`;
  }
  function content(s) {
    if (current().theme) return journalContent(s);
    const kicker = `<div class="slide-tag">${tx(s.kicker) || `${tr('即兴演讲','IMPROV PRESENTATION')} / ${String(index + 1).padStart(2, '0')}`}</div>`;
    const title = `<h2>${tx(s.title)}</h2>`;
    const subtitle = s.subtitle ? `<p class="subtitle">${tx(s.subtitle)}</p>` : '';
    if (['cover','visual','twist','finale'].includes(s.type)) return `<article class="slide split"><div>${kicker}${title}${subtitle}</div><div class="art-frame">${art(s.art || 'spark')}</div></article>`;
    let detail = '';
    if (s.type === 'chart') detail = `<div class="bars">${s.items.map(item => `<div class="bar-row"><span>${tx(item.label)}</span><div class="bar-track"><div class="bar-fill" style="width:${item.value}%"></div></div><span class="bar-value">${item.value}</span></div>`).join('')}</div>`;
    if (s.type === 'compare') detail = `<div class="compare-grid">${s.items.map((item, n) => `<div class="compare-item"><span>0${n + 1}</span>${tx(item.label)}</div>`).join('')}</div>`;
    if (s.type === 'words') detail = `<div class="word-list">${s.items.map(item => `<div class="word-item">${tx(item.label)}</div>`).join('')}</div>`;
    if (s.type === 'stat') detail = `<div class="big-stat">${esc(s.value)}</div>`;
    return `<article class="slide">${kicker}${s.type === 'quote' ? '<div class="quote-mark" aria-hidden="true">“</div>' : ''}${title}${detail}${subtitle}</article>`;
  }
  function journalContent(s) {
    const source = s.sourceSlide ? `${tr('原样本','SOURCE')} ${String(s.sourceSlide).padStart(2,'0')}` : `${tr('研究札记','RESEARCH NOTE')} ${String(index+1).padStart(2,'0')}`;
    const tag = `<div class="slide-tag">${s.kicker?tx(s.kicker):source}</div>`;
    const title = `<h2>${tx(s.title)}</h2>`;
    const subtitle = s.subtitle?`<p class="subtitle">${tx(s.subtitle)}</p>`:'';
    const img = id => typeof media[id]==='string' && /^data:image\/(webp|gif|png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(media[id]) ? `<img src="${media[id]}" alt="${esc(mediaDescriptions[id]?.[lang]||tr('来自用户样本的配图','Illustration from the supplied samples'))}" loading="eager">` : '';
    const picture = s.image && img(s.image) ? `<figure class="source-picture">${img(s.image)}</figure>` : '';
    const value = s.value ? `<div class="display-value">${esc(s.value)}</div>` : '';
    const list = (kind='evidence-list') => `<div class="${kind}">${(s.items||[]).map((item,n)=>`<div class="evidence-row"><span class="item-index">${String(n+1).padStart(2,'0')}</span><div><strong>${tx(item.label)}</strong>${item.detail?`<p>${tx(item.detail)}</p>`:''}</div></div>`).join('')}</div>`;
    if (['cover','visual','finale','statement','twist','quote'].includes(s.type)) {
      return `<article class="slide journal journal-${s.type} ${picture?'with-image':'type-only'}"><div class="journal-text">${tag}${title}${subtitle}${!picture?value:''}</div>${picture}</article>`;
    }
    if (s.type==='gallery') return `<article class="slide journal journal-gallery">${tag}${title}<div class="gallery-images">${(s.images||[]).map(id=>`<figure>${img(id)}</figure>`).join('')}</div><div class="gallery-captions">${(s.items||[]).map(item=>`<div><strong>${tx(item.label)}</strong>${item.detail?`<p>${tx(item.detail)}</p>`:''}</div>`).join('')}</div>${subtitle}</article>`;
    if (s.type==='timeline') return `<article class="slide journal">${tag}${title}<div class="research-timeline">${(s.items||[]).map(item=>`<div><strong>${tx(item.label)}</strong><p>${tx(item.detail||item.label)}</p></div>`).join('')}</div>${subtitle}</article>`;
    if (s.type==='chat') return `<article class="slide journal journal-chat">${tag}${title}<div class="chat-body ${picture?'has-picture':''}"><div class="chat-transcript">${(s.items||[]).map((item,n)=>`<div class="chat-line ${n%2?'reply':''}"><span>${tx(item.label)}</span><p>${tx(item.detail||item.label)}</p></div>`).join('')}</div>${picture}</div>${subtitle}</article>`;
    if (s.type==='formula') return `<article class="slide journal journal-formula">${tag}${title}<div class="formula-line">${tx(s.formula)}</div><div class="formula-bottom">${list()}${picture}</div>${subtitle}</article>`;
    if (s.type==='compare') return `<article class="slide journal">${tag}${title}<div class="research-compare ${s.images?'illustrated-compare':''}">${s.items.map((item,n)=>`<section><span class="compare-number">0${n+1}</span><h3>${tx(item.label)}</h3>${s.images?.[n]?`<figure class="comparison-picture">${img(s.images[n])}</figure>`:''}${item.detail?`<p>${tx(item.detail)}</p>`:''}</section>`).join('')}</div>${subtitle}</article>`;
    if (s.type==='chart') return `<article class="slide journal">${tag}${title}<div class="bars">${s.items.map(item=>`<div class="bar-row"><span>${tx(item.label)}</span><div class="bar-track"><div class="bar-fill" style="width:${item.value}%"></div></div><span class="bar-value">${item.value}</span></div>`).join('')}</div>${subtitle}</article>`;
    if (s.type==='stat') return `<article class="slide journal">${tag}${title}${value}${subtitle}</article>`;
    return `<article class="slide journal journal-evidence">${tag}${title}<div class="evidence-body ${picture?'has-picture':''}">${list(s.type==='table'?'research-table':s.type==='steps'?'research-steps':'evidence-list')}${picture}</div>${subtitle}</article>`;
  }
  function renderGame() {
    const d = current(), s = d.slides[index];
    document.body.className = `${d.accent} type-${s.type} ${d.theme?`journal-mode theme-${d.theme}`:''}`;
    app.innerHTML = `<div class="game"><header class="game-top"><span class="game-brand">SLIDE BLIND<span class="sr-only"> ${tr('演示中','Presenting')}</span></span><div class="game-controls">${review?`<select class="review-select" id="review-slide" aria-label="${tr('审阅跳页','Review slide')}">${d.slides.map((v,n)=>`<option value="${n}" ${n===index?'selected':''}>${n+1} / ${d.slides.length}</option>`).join('')}</select>`:''}<span class="round-label">${mode==='paced'?tr(`${minutes} 分钟场 · 本页剩余`,`${minutes} min round · slide left`):mode==='auto'?tr('本页剩余','Slide left'):tr('已用时间','Elapsed')}</span><span class="clock" id="clock" aria-label="${tr('计时器','Timer')}">${clock(mode !== 'manual' ? Math.ceil(remaining / 1000) : elapsed / 1000)}</span><button class="small-button" data-action="content-lang" aria-label="${tr('切换幻灯片语言','Switch slide language')}">${lang === 'zh-CN' ? '内容 → EN' : 'Slides → 中文'}</button><button class="small-button" data-action="pause">${paused ? tr('继续','Resume') : tr('暂停','Pause')}</button><button class="small-button" data-action="fullscreen">${tr('全屏','Fullscreen')}</button></div></header><section class="stage" aria-label="${tr('当前幻灯片','Current slide')}">${content(s)}${paused ? `<div class="paused"><div class="eyebrow">TAKE A BREATH</div><h2>${tr('喘口气。','Take a beat.')}</h2><button class="primary" data-action="pause">${tr('继续开讲','Back to the stage')} →</button><button class="text-button" data-action="home">${tr('结束本轮，返回首页','End round & return home')}</button></div>` : ''}</section><footer class="game-bottom"><span class="slide-number">${String(index + 1).padStart(2,'0')} / ${String(d.slides.length).padStart(2,'0')}${review?` · ${tr('主持人审阅','HOST REVIEW')}`:''}</span><span class="game-help">${locked()?tr('自动翻页 · P 暂停 · L 切换语言 · 纯属虚构','Auto advance · P Pause · L Language · Fictional content'):tr('空格 下一页 · P 暂停 · L 切换语言 · 纯属虚构','SPACE Next · P Pause · L Language · Fictional content')}</span><div class="page-actions">${review?`<button class="small-button" data-action="previous" ${index===0||paused?'disabled':''}>← ${tr('上一页','Back')}</button>`:''}<button class="next" data-action="next" ${paused || locked() ? 'disabled' : ''}>${locked() ? tr('按节奏自动翻页','Auto advancing') : index === d.slides.length - 1 ? tr('结束演讲','Finish') : tr('下一页','Next slide')} →</button></div></footer><div class="progress"><i style="width:${(index + 1) / d.slides.length * 100}%"></i></div></div>`;
  }
  function renderEnd() {
    document.body.className = '';
    app.innerHTML = `<div class="wrap"><header class="masthead">${brand()}${languageButtons()}</header><section class="end"><div class="eyebrow">STANDING OVATION, PLEASE.</div><h1>${tr('讲完了。<br><em>居然还挺像回事。</em>','YOU DID IT.<br><em>ALMOST BELIEVABLE.</em>')}</h1><p class="end-deck">${tx(current().title)}</p><div class="end-stats"><div><strong>${current().slides.length}</strong><span>${tr('页即兴发挥','slides improvised')}</span></div><div><strong>${clock(elapsed / 1000)}</strong><span>${tr('演讲用时','time on stage')}</span></div></div><p>${tr('把掌声送给演讲者。下一位，请保持同样的自信。','A round of applause for the speaker. Next up: bring that same confidence.')}</p><div class="end-actions"><button class="primary" data-action="home">${tr('换个人，再来一轮','NEXT SPEAKER')} ↗</button><button class="small-button" data-action="download">${tr('保存这套 HTML','Save this HTML')}</button></div></section></div>`;
  }
  function render() { document.documentElement.lang = ui; if (screen === 'home') renderHome(); else if (screen === 'game') renderGame(); else renderEnd(); }
  function start() { index = 0; elapsed = 0; remaining = pageDuration(); paused = false; screen = 'game'; previous = performance.now(); render(); }
  function next(automatic = false) { if (screen !== 'game' || paused || (locked() && automatic !== true)) return; if (index + 1 === current().slides.length) screen = 'end'; else index++; remaining = pageDuration(); render(); }
  function previousSlide() { if (!review || screen!=='game' || paused || index===0) return; index--; remaining=pageDuration(); render(); }
  function pause() { if (screen !== 'game') return; paused = !paused; previous = performance.now(); render(); }
  async function fullscreen() { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { notice = tr('此浏览器不支持页面全屏，请使用浏览器的全屏功能。','Use your browser’s fullscreen control on this device.'); window.alert(notice); } }
  function download() {
    const copy = document.documentElement.cloneNode(true);
    copy.querySelector('#app').replaceChildren(); copy.querySelector('body').className = '';
    const used = new Set(current().slides.flatMap(s=>[s.image,...(s.images||[])]).filter(Boolean));
    copy.querySelector('#deck-data').textContent = JSON.stringify({ decks: [current()], language: lang, media:Object.fromEntries(Object.entries(media).filter(([id])=>used.has(id))),mediaDescriptions:Object.fromEntries(Object.entries(mediaDescriptions).filter(([id])=>used.has(id))) }).replace(/</g, '\\u003c');
    const blob = new Blob(['<!doctype html>\n', copy.outerHTML], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = `${current().id}.html`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const actions = { start, next, previous:previousSlide, pause, fullscreen, download, review:()=>{review=!review;render();}, home: () => { screen = 'home'; paused = false; notice = ''; render(); }, 'ui-zh': () => { ui = 'zh-CN'; render(); }, 'ui-en': () => { ui = 'en'; render(); }, 'content-lang': () => { lang = lang === 'zh-CN' ? 'en' : 'zh-CN'; render(); } };
  app.addEventListener('click', e => { const b = e.target.closest('[data-action],[data-deck],[data-filter]'); if (!b) return; if (b.dataset.filter!==undefined) { filter=b.dataset.filter; if(filter!=='all'&&current().collection!==filter){const n=library.findIndex(d=>d.collection===filter); if(n>=0) selected=n;} render(); } else if (b.dataset.deck !== undefined) { selected = Number(b.dataset.deck); render(); } else actions[b.dataset.action]?.(); });
  app.addEventListener('change', async e => {
    if (e.target.id === 'content-language') lang = e.target.value;
    if (e.target.id === 'mode') mode = e.target.value;
    if (e.target.id === 'seconds') seconds = Number(e.target.value);
    if (e.target.id === 'minutes' && [6,7,8].includes(Number(e.target.value))) minutes = Number(e.target.value);
    if (e.target.id === 'review-slide' && review) { index=Number(e.target.value); remaining=pageDuration(); }
    if (e.target.id === 'import') {
      const file = e.target.files[0]; if (!file) return;
      try {
        if (file.size > 2_000_000) throw new Error(tr('文件需小于 2 MB','File must be under 2 MB'));
        const imported = JSON.parse(await file.text()); const incoming = Array.isArray(imported) ? imported : [imported];
        if (incoming.length < 1 || incoming.length > 100) throw new Error('Expected 1–100 decks'); incoming.forEach(validateDeck);
        selected = library.length; library = [...library, ...incoming]; filter='all'; notice = tr(`已导入 ${incoming.length} 套内容，开始后揭晓题目。`, `Imported ${incoming.length} deck(s). Titles stay hidden until you start.`);
      } catch (error) { notice = `${tr('导入失败：','Import failed: ')}${error.message}`; }
    }
    render();
  });
  document.addEventListener('keydown', e => {
    if (screen !== 'game' || /^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(e.target.tagName) && [' ', 'Enter', 'ArrowDown', 'ArrowUp'].includes(e.key) || e.ctrlKey || e.metaKey || e.altKey) return;
    if ([' ', 'ArrowRight', 'PageDown'].includes(e.key)) { e.preventDefault(); if (!e.repeat) next(); }
    if (['ArrowLeft','PageUp'].includes(e.key) && review) { e.preventDefault(); if(!e.repeat) previousSlide(); }
    if (e.key.toLowerCase() === 'p' && !e.repeat) pause();
    if (e.key.toLowerCase() === 'l' && !e.repeat) actions['content-lang']();
    if (e.key.toLowerCase() === 'f' && !e.repeat) fullscreen();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden && screen === 'game' && !paused) pause(); });
  setInterval(() => {
    const now = performance.now(), delta = now - previous; previous = now;
    if (screen !== 'game' || paused || document.hidden) return;
    if (mode === 'manual') elapsed += delta;
    else {
      let budget = delta;
      while (budget > 0 && screen === 'game') {
        const used = Math.min(budget, remaining);
        elapsed += used; remaining -= used; budget -= used;
        if (remaining <= 0) next(true);
      }
      if (screen !== 'game') return;
    }
    const timer = document.getElementById('clock');
    if (timer) { timer.textContent = clock(mode !== 'manual' ? Math.ceil(remaining / 1000) : elapsed / 1000); timer.classList.toggle('urgent', mode !== 'manual' && remaining < 6000); }
  }, 100);
  render();
})();
