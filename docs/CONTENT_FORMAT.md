# 内容格式与题库扩展

[返回 README](../README.md) · [可运行的 JSON 示例](../examples/mini-deck.json)

## 先运行一个最小例子

```bash
node src/cli.mjs render --input examples/mini-deck.json --out output/mini.html
```

示例只有三页，供检查格式；正式题材建议十页、六到八分钟。JSON 不包含注释。命令行和浏览器导入均接受一个套装对象，或最多 100 个套装的数组，输入大小上限 2 MB。

## 双语字段

所有自然语言字段使用同一结构：

```json
{ "zh-CN": "中文内容", "en": "English content" }
```

两种语言必须非空，数字和情节保持一致。标题尽量控制在中文 22 字 / 英文 65 字符内；校验允许 100 字符。避免直接逐字翻译中文梗，让两种语言都能自然地演讲。

## 套装字段

| 字段 | 格式 |
| --- | --- |
| `id` | 1–60 字符的小写字母、数字和连字符，例如 `coffee-meeting`；题库中保持唯一 |
| `title` | 双语题目，每种语言最多 100 字符 |
| `category` | 双语盲盒类别，每种语言最多 60 字符；避免在类别中提前揭晓笑点 |
| `description` | 双语说明，每种语言最多 180 字符 |
| `accent` | `orange` / `blue` / `green` |
| `theme` | 推荐必填：`cosmic` / `cream` / `alert` / `mint` / `noir` |
| `collection` | 新内容填写 `new`；来自用户 PPT 的题材填写 `source` |
| `slides` | 3–16 页数组；建议 10 页 |

主题字段虽然在校验中可省略，但新版表格、聊天、公式等布局依赖主题渲染器，请为新套装填写 `theme`。首尾使用 `cover` 和 `finale`；模型生成会验证首尾类型，普通 JSON 导入仅做基础字段校验。

## 幻灯片字段与布局

所有页都有 `type` 和双语 `title`。可选双语 `subtitle` / `kicker`，每种语言最多 180 字符。

| type | 附加内容 |
| --- | --- |
| `cover`, `visual`, `statement`, `twist`, `quote`, `finale` | 标题、可选说明、可选 `image`；适合开场、反转和收尾 |
| `compare` | 恰好 2 个 `items`；可选 `images` 为两侧配图 |
| `chart` | 2–4 个 `items`，每项 `value` 为 0–100 数字；在说明中写明单位和数据虚构 |
| `evidence`, `table`, `steps`, `words` | 2–6 个 `items`，可选 `image`；步骤以三项为宜 |
| `timeline` | 2–6 个 `items`；label 为时间，detail 为事件 |
| `chat` | 2–6 个 `items`；label 为说话者，detail 为消息；可选 `image` |
| `formula` | 必填双语 `formula`，最多 180 字符；可选 items 解释术语及 image |
| `stat` | `value` 为最多 12 字符的短字符串，在 subtitle 解释含义 |
| `gallery` | `images` 放 1–4 个图片 ID，`items` 放 2–6 个双语说明 |

普通条目格式：

```json
{
  "label": { "zh-CN": "观察", "en": "Observation" },
  "detail": { "zh-CN": "一条具体证据。", "en": "One specific piece of evidence." }
}
```

label 最多 100 字符，detail 可选、最多 180 字符。投屏内容建议远短于上限：每页放一个清晰论点、两三条具体材料，让演讲者补全解释，而不是朗读整段文章。

## 配图与离线打包

`image` 填素材 ID，例如 `image201`；`images` 是素材 ID 数组。不能填远程网址、本地绝对路径、HTML 或 SVG 代码。正文会作为文本转义，不能嵌入自定义标签。

打包器从 `assets/catalog.json` 读取图片。当前允许的文件路径为 `samples/image数字.webp`、`samples/image数字.gif`，或 `generated/小写英文数字及连字符.webp`。图片文件相对于 assets 目录；仅允许 WebP / GIF MIME。

添加自己的 WebP：

1. 将文件放入 `assets/generated/coffee-meeting.webp`。
2. 检查现有索引，选择未使用的 ID，例如 `image301`。
3. 在 catalog.json 中加入：

```json
"image301": {
  "file": "generated/coffee-meeting.webp",
  "mime": "image/webp",
  "origin": "custom",
  "alt": {
    "zh-CN": "一杯咖啡坐在会议桌主位",
    "en": "A cup of coffee at the head of a meeting table"
  }
}
```

4. 在支持图片的幻灯片中写 `"image": "image301"`，重新运行 render / demo / share。

HTML 只嵌入本次题库实际引用的图片。**浏览器导入 JSON 不能读取磁盘上新加的图片**；需要新增图片时，先修改索引，再从命令行打包。只发送 JSON 不会附带图片。

## 加入默认题库

仅临时演示：直接 render 自己的 JSON 即可。

长期加入：在 `src/bonus-decks.mjs` 中添加完整的十页双语对象，它会被 `src/library.mjs` 的 newLibrary 收录。也可以新增内容模块，再从 library.mjs 导入；使用 `T`、`I`、`S` 等辅助函数可减少重复字段。

`src/expansions.mjs` 是针对原有十四套六页题材的扩展映射。不要把任意十页新套装塞进该映射。`sourceSlide` 仅用于来源页码追踪，允许 1–62；自行创作的页不填写它。

当前测试包含固定题库数量和页数断言。新增正式内容后同步更新数量，运行 `node --test`，再实际打开导出文件检查中文、英文、长标题和图片。通用数据校验允许 3–16 页，默认题库约定十页。

## 如何写出适合即兴发挥的十页

建议节奏：命题 → 日常观察 → 具体案例 → 假模型 → 证据 → 对话或反方质疑 → 矛盾 → 解决方案 → 意外后果 → 回扣。反转应来自此前的论证，不靠完全无关的随机事件。图表数字注明虚构；不需要逐字演讲稿。

自动模型提示词在 `src/generate.mjs`，布局在 `src/web/player.js`，视觉样式在 `src/web/style.css` 和 `journal.css`。修改后必须重新打包，旧 HTML 不会自动引用更新后的源码。
