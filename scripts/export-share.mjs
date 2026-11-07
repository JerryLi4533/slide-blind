// Build a self-contained file for friends. No original Office files or API credentials needed.
import { mkdir, writeFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { library } from '../src/library.mjs';
import { writeHtml } from '../src/build.mjs';

const destination = new URL('../dist/friends/', import.meta.url);
await mkdir(destination, { recursive: true });
const path = await writeHtml(library, fileURLToPath(new URL('slide-blind.html', destination)));
await writeFile(new URL('START-HERE.txt', destination), `SLIDE BLIND / 即兴幻灯片派对

1. 将 slide-blind.html 保存到电脑，用浏览器打开（双击或“打开方式”）。
2. 选择一个主题盲盒，点“我准备好胡说了”。别提前偷看题目。
3. 空格 / 右方向键 / 下一页：手动翻页。每套 10 页，建议讲 6–8 分钟。
4. P 暂停，L 切换中英文内容，F 全屏。暂停后可以返回首页。
5. 界面右上角可切换中文 / EN；首页可以单独选择幻灯片语言。
6. 主持人审阅会显示题目，并允许返回上一页与跳页，适合主持人先检查内容。

18 套、180 页。图片已嵌入，无需联网、安装软件、注册账号或提供 API key。
默认手动翻页，计时器只显示用时，不会自动结束。
聊天软件的附件预览可能不运行 HTML；请下载后用浏览器打开。
如果收到了 ZIP，请先解压。无需附带 assets 文件夹。
全部论证与数字为虚构游戏内容。

ENGLISH
Save slide-blind.html to your computer and open it in a browser.
Choose a mystery category and start. Space / Right arrow / Next slide advances manually.
Aim for 6–8 minutes per ten-slide deck. P pauses, L changes slide language, F toggles fullscreen.
Use EN at the top for the English interface; slide language is a separate setting.
Host review reveals titles and enables back/jump navigation.
All 18 decks and pictures are inside this file. No internet, server, account, or Node.js needed.
Download the attachment instead of using a chat app's preview. Unzip first if necessary.
All arguments and numbers are fictional.
`, 'utf8');
console.log(`Share this file: ${path}`);
console.log(`${library.length} decks / ${library.reduce((n,d)=>n+d.slides.length,0)} slides / ${((await stat(path)).size / 1048576).toFixed(2)} MB. Default: manual advance.`);
