# SLIDE BLIND · 即兴幻灯片派对

**没看过幻灯片，也要讲得像准备了很久。** 一个本地运行、中英文双语、可导出单文件 HTML 的 PowerPoint Karaoke 项目。

[English README](README.en.md) · [内容格式与扩展方法](docs/CONTENT_FORMAT.md)

## 这个项目能做什么

PowerPoint Karaoke 是即兴演讲游戏：演讲者事先不看内容，现场逐页看到幻灯片，再把标题、图片和荒诞论证串成一场演讲。观众可以知道这是即兴游戏，重点是临场解释和一本正经地胡说。

- 内置 **18 套、180 页**：用户原 PPT 中的 8 个题材，以及参考样本风格创作的 10 套新题材。
- 每套 10 页，建议演讲 **6–8 分钟**；默认**手动翻页**，计时器只显示已用时间，不会自动翻页或结束。
- 同一套内容支持中文 / English；界面语言与幻灯片语言分别设置。
- 图片、样式、内容和播放器都打包进 HTML，离线播放，无需公网 URL。
- 朋友可以直接收一个 HTML，也可以 clone 仓库后自行生成。
- 支持本地 JSON 导入，以及通过模型接口或现有 AI 工具创作新题材。

内置题库是已经写好的演示内容，运行 demo 不会调用模型。所有论证和数字都是虚构游戏内容。

## 1. 最快开始

### 只想玩：直接打开 HTML

收到 `slide-blind.html` 后，保存到电脑，用浏览器打开即可。不需要 Node.js、PowerPoint、API key、安装依赖或启动服务器。

聊天软件的附件预览可能不运行 HTML。请下载后，用系统“打开方式”选择浏览器；收到 ZIP 时先解压。

### 想从仓库生成：一条命令

准备 **Node.js 22 或更新版本**，先用 `node --version` 检查。Windows PowerShell、macOS 或 Linux 终端均可。

```bash
git clone https://github.com/JerryLi4533/slide-blind.git
cd slide-blind
node src/cli.mjs demo
```

私有仓库需要 GitHub 访问权限。也可解压源码 ZIP，进入解压后的项目目录运行最后一条命令。

双击生成的 `output/karaoke.html`。**不用 npm install**：正常构建和测试只用 Node.js 内置模块。原 PPTX、DOCX 和字体包不是运行依赖，构建所需的整理后素材已经包含在 `assets/` 中。

## 2. 导出给朋友

```bash
node scripts/export-share.mjs
```

生成：

| 文件 | 用途 |
| --- | --- |
| `dist/friends/slide-blind.html` | 完整 18 套演示，约 5.6 MB；直接发送这一份即可 |
| `dist/friends/START-HERE.txt` | 可以一并发送的中英文操作说明 |

HTML 包含全部图片，不用再发送 assets 文件夹。重复导出会更新这两个文件。只有生成自定义模型内容时才可能需要联网；播放和内置题库构建均可离线完成。

只想分享一套，可以在首页选中它后点“下载选中套装”，或者：

```bash
node src/cli.mjs demo --deck tomato-universe --out output/tomato.html
# 同一份内容，打开时默认英文
node src/cli.mjs demo --deck tomato-universe --lang en --out output/tomato-en.html
```

## 3. 现场怎么玩

1. 首页选择分类：**原 PPT 样本** / **全新创作** / 全部。
2. 选择一个盲盒主题。默认显示类别，开始后才揭晓标题。
3. 选择幻灯片语言，保持默认“手动翻页”。
4. 点击开始，讲完一页再翻页。每页平均约 36–48 秒，全场约 6–8 分钟；这是内容节奏建议，不是强制时限。
5. 结束后返回首页，换下一位演讲者。

| 操作 | 按键 / 按钮 |
| --- | --- |
| 下一页 | 空格、右方向键、Page Down，或“下一页”按钮 |
| 暂停 / 继续 | P，或暂停按钮 |
| 切换幻灯片中英文 | L，或内容语言按钮 |
| 全屏 / 退出全屏 | F，或全屏按钮；浏览器也可用 Esc 退出 |
| 结束本轮回首页 | 暂停后点“结束本轮，返回首页” |
| 返回上一页 / 跳页 | 仅在主持人审阅中可用：左方向键、Page Up 或页码选择 |

切换浏览器标签页会自动暂停，回来后手动继续。语言切换保留当前页与计时状态。首页右上角“中文 / EN”改变界面语言；“幻灯片语言”改变演讲内容，两者互不强制跟随。

### 主持人审阅

点击“主持人审阅”可以提前看标题、返回上一页和跳页。建议主持人先检查内容，再退出审阅让朋友盲讲。盲讲隐藏只是交互设计，HTML 源码中仍能看到内容。

### 可选自动模式

手动翻页是默认。需要挑战玩法时，可主动选择整场 6 / 7 / 8 分钟自动翻页，或每页 15 / 20 / 30 / 45 / 60 秒计时。整场模式不允许提前跳页，暂停不计时；每页计时允许手动提前翻页。主持人审阅可以自由导航。

## 4. 题库与原 PPT 的关系

“原 PPT 样本”指用户提供的 `PPT乱讲大赛.pptx` 中的八个题材。它们经过 HTML 重新排版、双语改写和内容扩展，每套 10 页；不是原 PPT 版式的逐像素复刻。原样本重排后的六页均按顺序保留，再插入题材相关的新页。

新作采用“生活观察 → 荒诞模型 → 案例和质疑 → 解决方案 → 意外后果 → 回扣”的结构，保留即兴发挥空间。不是每页塞满讲稿。最早生成的鹅总、月球面馆、猫咪城市三套已移除。

<details>
<summary>查看全部题目与命令行 ID（会剧透）</summary>

| 分类 | 题目 | ID |
| --- | --- | --- |
| 原 PPT 样本 | 宇宙的尽头是西红柿 | `tomato-universe` |
| 原 PPT 样本 | 奶茶是人类文明的终极形态 | `bubble-tea-civilization` |
| 原 PPT 样本 | 手机电量低于20%会引发宇宙危机 | `battery-crisis` |
| 原 PPT 样本 | 摸鱼才是职场最高生产力 | `slacking-productivity` |
| 原 PPT 样本 | 熬夜对银河系和平的重要性分析 | `galactic-night-shift` |
| 原 PPT 样本 | 表情包是人类第二语言 | `meme-language` |
| 原 PPT 样本 | 外卖小哥是现代社会的超级英雄 | `delivery-heroes` |
| 原 PPT 样本 | 猫咪统治地球的可行性报告 | `cat-world-order` |
| 参考样本新作 | 周一是未经批准的时间膨胀实验 | `monday-relativity` |
| 参考样本新作 | 电梯关门键是人类最后的控制感 | `elevator-control` |
| 参考样本新作 | 冰箱是家庭文明的考古现场 | `fridge-archaeology` |
| 参考样本新作 | 快递物流是当代人的史诗文学 | `parcel-epic` |
| 参考样本新作 | “收到”是组织的量子态 | `received-quantum` |
| 参考样本新作 | 洗澡是人类最高规格的战略会议 | `shower-board` |
| 参考样本新作 | 收藏夹：一所永不毕业的大学 | `bookmark-university` |
| 参考样本新作 | 闹钟是与明天的我进行外交谈判 | `alarm-diplomacy` |
| 参考样本新作 | 谁掌握空调遥控器，谁掌握夏天 | `remote-sovereignty` |
| 参考样本新作 | 失踪的袜子正在申请跨宇宙移民 | `sock-migration` |

</details>

### 批量导出与原稿存档

```bash
node scripts/build-samples.mjs
```

| 输出 | 内容 |
| --- | --- |
| `output/karaoke.html` | 全部 18 套，默认手动翻页 |
| `output/source-samples.html` | 全题库，默认筛选原 PPT 样本 |
| `output/new-samples.html` | 全题库，默认筛选新作 |
| `output/decks/<id>.html`、`<id>.json` | 每套的独立演示与内容数据 |
| `output/short-editions.html` | 扩写前的 14 套六页版本 |
| `output/source-archive.html` | 原 PPT 全部 62 页提取出的文字与配图，按原页序存档 |
| `output/host-notes.html` | 用户原主持稿的 HTML 排版，会剧透 |

原稿存档不保留 PPT 动画或原版式。原始图片内的文字不会随中英文按钮变化；中英文切换覆盖原生 HTML 文本。

## 5. 命令行参考

所有命令在仓库根目录运行。默认 demo 输出可以重复生成；自定义 `--out` 文件存在时需 `--force` 才会覆盖。

```bash
# 生成全题库
node src/cli.mjs demo
# 仅导出指定分类（与批量构建的筛选入口不同，此文件只包含该分类）
node src/cli.mjs demo --collection source --out output/only-source.html
node src/cli.mjs demo --collection new --out output/only-new.html
# 将自己的 JSON 打包成离线 HTML
node src/cli.mjs render --input examples/mini-deck.json --out output/mini.html
# 查看帮助
node src/cli.mjs --help
```

| 选项 | 说明 |
| --- | --- |
| `--deck <id>` | demo 导出题库内单套，ID 见上表 |
| `--collection all|source|new` | demo 分类；默认 all |
| `--lang both|zh|en` | 默认 both；both / zh 打开时中文，en 打开时英文；文件始终带双语 |
| `--topic "主题"` | generate / prompt 的主题 |
| `--slides 10` | generate / prompt 默认 10 页，允许 3–16 页 |
| `--input <file.json>` | render 的输入；单套对象或 1–100 套组成的数组，最多 2 MB |
| `--out <path>` | 指定输出位置；HTML 命令使用 .html，prompt 使用文本文件 |
| `--force` | 覆盖指定输出文件 |

有 npm 时也可用 `npm run demo`、`npm run samples`、`npm run share`、`npm test`，它们是同一批 Node 命令的别名。

## 6. 用 AI 创作新主题

### 方法 A：用现有聊天 / 编程工具，无需另配 API

```bash
node src/cli.mjs prompt --topic "给外星人开的奶茶店" --slides 10
```

把生成的 `output/prompt-*.txt` 交给你的 AI 工具，让它输出符合格式的 JSON。保存为 `my-deck.json`，再运行：

```bash
node src/cli.mjs render --input my-deck.json
```

也可以在播放器首页“导入 JSON”。导入保存在当前页面内存中；刷新会丢失。要保留，请下载当前套装或用命令行重新打包。

### 方法 B：模型接口流水线

将 `.env.example` 复制为 `.env`，填写：

```dotenv
LLM_BASE_URL=https://your-provider.example/v1
LLM_MODEL=your-model-name
LLM_API_KEY=your-api-key
LLM_ALLOW_NO_KEY=0
```

示例地址和名称是占位符。服务需兼容 Chat Completions 的 `/chat/completions` 路径，并支持 `response_format: {type: "json_object"}`。请使用自己已有访问权限的服务与模型。

```bash
node src/cli.mjs generate --topic "给外星人开的奶茶店" --slides 10 --lang both
```

流程：主题 → 双语提示词 → 模型返回 JSON → 格式校验 → 最多一次自动修复 → 输出独立 HTML + JSON。默认输出文件名带时间戳。模型调用可能产生提供商费用；API key 仅由本地 Node 进程使用，不写入 HTML，`.env` 已被 Git 忽略。

远程端点要求 HTTPS。本机无鉴权服务可以使用 localhost / 127.0.0.1 / ::1 的 HTTP 地址，并显式设置 `LLM_ALLOW_NO_KEY=1`。真实接口需要自己的配置；仓库测试使用模拟模型服务。

自动生成目前以文字、表格、公式和时间线为主，不自动搜图或生图。想加入图片，请看[内容格式说明](docs/CONTENT_FORMAT.md)。

## 7. 仓库结构与修改入口

```text
src/
  library.mjs          全题库入口：8 套原 PPT 样本 + 10 套新作
  sample-decks.mjs     原 PPT 八套题材的六页重排版，带原页码
  new-decks.mjs        参照样本写的第一批六套
  expansions.mjs       为上述十四套补充到十页的内容
  bonus-decks.mjs      另外四套十页新作
  content-helpers.mjs  双语内容构造函数
  validate.mjs         Node / 浏览器共用的数据校验
  generate.mjs         提示词、模型请求和修复流程
  build.mjs            嵌入图片、样式、脚本，打包独立 HTML
  cli.mjs              命令行入口
  web/                 双语播放器、布局与样式
scripts/
  export-share.mjs     导出发朋友的 HTML 和操作说明
  build-samples.mjs    批量导出题库、独立套装与原稿存档
assets/                已整理的图片、索引与原稿提取文本
examples/mini-deck.json 可直接 render 的最小示例
docs/CONTENT_FORMAT.md 内容格式、配图与新题材开发说明
test/                  校验、打包、模型模拟、播放器行为测试
output/                本机生成物，不提交 Git
dist/                  分享文件，不提交 Git
```

修改内容后重新运行 demo 或 share 即可，已经发出去的 HTML 不会自行更新。要让朋友拿到新内容，请重新导出并发送。

历史素材处理脚本依赖本地原文件、`.qa/` 中间产物及部分 Python 库；它们不属于正常构建步骤。参见 [scripts/README.md](scripts/README.md)。

## 8. 开发与检查

```bash
node --test
node src/cli.mjs demo
node scripts/export-share.mjs
```

测试覆盖：双语字段和类型校验、HTML 文本转义、原 PPT 页映射保留、全部 180 页渲染、图片内嵌、默认手动翻页、语言切换、暂停和可选计时、JSON 导入及模型修复。播放器使用轻量 DOM 模拟测试，不等同于真实浏览器视觉回归；修改布局后建议实际打开 HTML 检查中英文排版。

开发时可选 `node src/preview.mjs`，只监听 `127.0.0.1:4173`。它不是播放依赖，也不会发布公网网站。

## 9. 常见问题

| 问题 | 处理方式 |
| --- | --- |
| 找不到原 PPT 内容 | 首页选“原 PPT 样本”，或打开 source-samples.html；完整 62 页文字与配图另在 source-archive.html |
| 文件还是旧题库 / 旧模式 | 重新导出，关闭或刷新旧浏览器标签页，确认打开的是新文件 |
| 打开后显示源码或聊天预览空白 | 把附件保存为 .html，用浏览器打开，不用文本编辑器或聊天预览 |
| node 命令找不到 | 安装 Node.js 22+ 并重新打开终端；仅播放朋友发来的 HTML 不需要 Node |
| File exists | 换输出文件名，或确认覆盖后添加 --force |
| 导入提示 Invalid deck | 检查每个文字字段的中英文、页数和类型，参考 examples/mini-deck.json |
| 导入 JSON 后图片不显示 | 浏览器只能使用当前 HTML 已嵌入的图片；新增素材后从命令行重新构建 |
| 全屏按钮没有效果 | 浏览器可能限制全屏；仍可用普通窗口演示或浏览器自己的全屏操作 |
| 为什么图片上的中文没变 | 原表情包是图片，语言切换只改变原生文本 |
| 能否只玩原 PPT 八套 | 使用 --collection source 导出即可 |

## 10. 素材来源与仓库分享

原样本图片与文本来自用户提供的 PPT / 主持稿；八张新场景图的生成提示词记录在 `assets/generated/prompts.json`，图片索引在 `assets/catalog.json`。本项目没有为这些第三方原素材声明统一的开源授权；素材的来源说明不等于授权声明。

仓库不包含原始 PPTX、DOCX、字体包、API key、`.qa/` 中间文件或生成目录；这些本地文件仍可留在工作目录，但被 Git 忽略。构建需要的整理后素材会随源码一起提供。此项目没有自动创建远程仓库或公开发布；上传时可在自己的 Git 服务创建仓库，再添加 remote 和推送。
