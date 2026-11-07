import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { library, shortLibrary } from '../src/library.mjs';
import { writeHtml, loadMedia } from '../src/build.mjs';

const root = new URL('../', import.meta.url);
const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const inline = value => JSON.stringify(value).replace(/</g,'\\u003c');
const all = library;
await mkdir(new URL('output/decks/',root),{recursive:true});
await writeHtml(all, fileURLToPath(new URL('output/karaoke.html',root)));
for (const [name,initialFilter] of [['source-samples','source'],['new-samples','new']]) {
  await writeHtml(all,fileURLToPath(new URL(`output/${name}.html`,root)),{initialFilter});
}
await writeHtml(shortLibrary,fileURLToPath(new URL('output/short-editions.html',root)));
for (const deck of all) {
  await writeHtml([deck],fileURLToPath(new URL(`output/decks/${deck.id}.html`,root)));
  await writeFile(new URL(`output/decks/${deck.id}.json`,root),JSON.stringify(deck,null,2),'utf8');
}

const slides = JSON.parse(await readFile(new URL('assets/source-slides.json',root),'utf8'));
const media = await loadMedia(slides.flatMap(s=>s.images.map(i=>i.file.split('.')[0])));
const rawStyle = `*{box-sizing:border-box}body{margin:0;background:#f4f0e7;color:#292a25;font-family:"Segoe UI","Microsoft YaHei",sans-serif}header{padding:25px 35px;border-bottom:1px solid #bcbcaf;display:flex;align-items:center;justify-content:space-between;gap:20px}header h1{font-size:21px;margin:0}header p{font-size:12px;color:#77776c;margin:8px 0 0}button,select{font:inherit;cursor:pointer;padding:9px 14px;background:transparent;border:1px solid #bcbcaf;border-radius:3px}button:disabled{opacity:.3}main{max-width:1320px;margin:auto;padding:45px 40px}.page-label{font:12px Consolas,monospace;color:#aa5030;letter-spacing:2px}h2{font-size:clamp(25px,3.8vw,48px);line-height:1.3;max-width:1000px;margin:20px 0 30px}.original-text{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 45px;border-top:1px solid #bcbcaf}.original-text p{padding:13px 0;margin:0;border-bottom:1px solid #d6d1c5;font-size:19px;line-height:1.7;white-space:pre-wrap}.images{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:25px;margin-top:40px}.images figure{margin:0;background:#e9e4d9;padding:12px;display:flex;flex-direction:column;justify-content:center}.images img{max-width:100%;max-height:400px;object-fit:contain}.images figcaption{font:11px Consolas,monospace;color:#77776c;margin-top:10px}footer{max-width:1320px;margin:20px auto;padding:25px 40px;border-top:1px solid #bcbcaf;display:flex;justify-content:space-between;font-size:12px;color:#77776c}.controls{display:flex;gap:8px}.counter{font:13px Consolas,monospace;margin-bottom:20px}.doc{max-width:900px;margin:auto;padding:45px 35px}.doc h2{font-size:26px;border-top:2px solid #b25c39;padding-top:25px;margin-top:45px}.doc p{font-size:17px;line-height:1.95;white-space:pre-wrap}.note{padding:16px 0;color:#8a674e;font-size:14px;border-bottom:1px solid #bcbcaf}.doc a{color:inherit}@media(max-width:650px){header{padding:20px;display:block}.controls{margin-top:18px}main{padding:25px 20px}.original-text{grid-template-columns:1fr}.original-text p{font-size:16px}.images{grid-template-columns:1fr}footer{padding:20px}.doc{padding:25px 20px}}`;
const archive = `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PPT乱讲大赛 · 原稿内容存档</title><style>${rawStyle}</style><body><header><div><h1>PPT乱讲大赛 / 原稿内容存档</h1><p>62页文字与配图，按原页序收录。原文照录，未作事实核验；此页供主持人查看，会剧透。</p></div><div class="controls"><button id="prev">← 上一页</button><select id="page" aria-label="页码"></select><button id="next">下一页 →</button></div></header><main id="slide"></main><footer><span>原始材料：PPT乱讲大赛.pptx</span><span>独立离线 HTML · 内容存档，非原版式复刻</span></footer><script id="source-data" type="application/json">${inline({slides,media})}</script><script>
const data=JSON.parse(document.getElementById('source-data').textContent);let page=0;
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const select=document.getElementById('page'); select.innerHTML=data.slides.map((s,i)=>'<option value="'+i+'">第 '+s.slide+' 页</option>').join('');
function render(){const s=data.slides[page]; select.value=page;document.getElementById('prev').disabled=page===0;document.getElementById('next').disabled=page===data.slides.length-1;document.getElementById('slide').innerHTML='<div class="page-label">SOURCE / '+String(s.slide).padStart(2,'0')+'</div><h2>'+escape(s.text[0]||'原稿配图页')+'</h2><div class="original-text">'+s.text.map(t=>'<p>'+escape(t)+'</p>').join('')+'</div><div class="images">'+s.images.map(i=>'<figure><img src="'+data.media[i.file.split('.')[0]]+'" alt="原稿配图 '+escape(i.file)+'"><figcaption>'+escape(i.file)+'</figcaption></figure>').join('')+'</div>';window.scrollTo(0,0);}
document.getElementById('prev').onclick=()=>{if(page>0){page--;render();}};document.getElementById('next').onclick=()=>{if(page+1<data.slides.length){page++;render();}};select.onchange=()=>{page=Number(select.value);render();};document.addEventListener('keydown',e=>{if(e.target.tagName==='SELECT')return;if(e.key==='ArrowRight')document.getElementById('next').click();if(e.key==='ArrowLeft')document.getElementById('prev').click();});render();</script></body></html>`;
await writeFile(new URL('output/source-archive.html',root),archive,'utf8');
const host=await readFile(new URL('assets/host-script.txt',root),'utf8');
const hostBody=host.split('\n').filter(s=>s.trim()).map((line,i)=>i===0?`<h1>${esc(line)}</h1>`:line.startsWith('【')?`<h2>${esc(line)}</h2>`:`<p>${esc(line)}</p>`).join('\n');
const hostHtml=`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PPT乱讲大赛 · 主持人讲稿</title><style>${rawStyle}</style><body><article class="doc"><div class="page-label">HOST COPY / 主持人专用</div><div class="note">以下为用户提供讲稿的原文排版版，包含题目和结尾，会剧透。原稿页码与实际 PPT 部分不一致，未擅自改写；游戏历史等原文说法未核验。演示时请勿投屏此文档。</div>${hostBody}</article></body></html>`;
await writeFile(new URL('output/host-notes.html',root),hostHtml,'utf8');
console.log(`Built ${all.length} decks = ${all.reduce((n,d)=>n+d.slides.length,0)} bilingual slides. Original short editions preserved separately.`);
console.log(`Archived ${slides.length} original slides with all extracted paragraphs and image references. Host notes converted to HTML.`);
console.log('Open output/karaoke.html, output/source-samples.html, or output/new-samples.html.');
