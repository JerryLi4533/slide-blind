# 构建与素材工具

正常使用只需要 Node.js 22+，无需 Python 或原始 Office 文件。

| 脚本 | 用途 | 是否日常需要 |
| --- | --- | --- |
| `export-share.mjs` | 导出 dist/friends/slide-blind.html 与双语操作说明 | 分享时使用 |
| `build-samples.mjs` | 导出所有题库入口、单套 HTML/JSON、原稿存档和主持稿 | 批量导出时使用 |
| `inspect_samples.py` | 检查本地原 PPTX / DOCX，输出 .qa 中间产物 | 历史素材处理 |
| `prepare_assets.py` | 将 .qa/samples 图片压缩并更新 catalog | 历史素材处理，依赖 Pillow |
| `package_generated.py` | 按 .qa/generated-input.json 打包新场景图 | 历史素材处理，依赖 Pillow 和原始图片 |
| `add-new-deck-images.mjs` | 对第一批六套内容应用固定配图映射 | 历史编辑步骤，会修改内容源码 |

历史脚本保留用于理解素材来源，不是从 clone 到运行的必要步骤。部分输入只存在于原作者工作目录。不要为了普通构建运行素材预处理脚本；仓库中的 assets 已可直接打包。

发布前建议依次运行：

```bash
node --test
node scripts/build-samples.mjs
node scripts/export-share.mjs
```

share 和 samples 都更新约定的生成文件。命令行自定义输出路径则有覆盖保护，见主 README。
