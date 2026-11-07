# SLIDE BLIND

**No prep. All nerve.** A local-first, bilingual presentation karaoke kit.

[中文说明](README.zh-CN.md)

Clone the repo, generate one self-contained HTML file, and double-click to play. No hosting, accounts, package installation, CDN, or internet connection needed for playback. Requires **Node.js 22+** to generate files; viewers only need a modern browser.

```bash
git clone https://github.com/JerryLi4533/slide-blind.git
cd slide-blind
node src/cli.mjs demo
```

Open `output/karaoke.html`. The current library includes **18 decks, 180 bilingual slides, ten per deck**: 8 supplied PPT remixes and 10 new decks. These are curated demos, not freshly model-generated content. Game arguments and numbers are fictional. Sample imagery is embedded in the HTML; fonts use system fallbacks.

## Send a playable file to friends

Run `node scripts/export-share.mjs` (or `npm run share`). Send `dist/friends/slide-blind.html` to your friends; `START-HERE.txt` provides bilingual instructions. It includes all 18 decks and their images, about 5.6 MB, with manual advance by default. Friends only need to save the attachment and open it in a browser. Chat previews may not execute HTML. No assets folder, Node.js, API key, or server is needed to play.

The export is deliberately overwritten on the next share build. Generated output and local source Office/font files are ignored by Git. Prepared assets are included, so a fresh clone builds without the original PPTX. For authoring details, see [the content format](docs/CONTENT_FORMAT.md) and [the runnable JSON example](examples/mini-deck.json).

## What is PowerPoint Karaoke?

The speaker sees an unfamiliar slide deck for the first time and improvises a convincing presentation as each slide appears. This project turns that format into an offline party game: pick a mystery category, start presenting, and explain every unexpected chart, image, and claim with confidence. No PowerPoint installation is required.

## Sample-based edition

The supplied themes cover tomato cosmology, bubble-tea civilization, low-battery crises, strategic slacking, galactic night shifts, meme linguistics, delivery heroes, and feline world rule. New themes cover Monday relativity, elevator-button control, refrigerator archaeology, parcel-tracking epics, the quantum state of “noted,” and shower strategy meetings. Four additional topics cover Bookmark University, alarm-clock diplomacy, AC-remote sovereignty, and interdimensional sock migration.

The original six retain their illustrated slides, with more images in the extensions and four additional decks: eight surreal scenes created with built-in ImageGen plus reaction memes from the supplied samples. All delivery images are embedded in the HTML. Exact prompts and file mappings are saved in `assets/generated/prompts.json`; normal clone/build/play needs no image-generation service.

The redesigned version edits headings and dense wording for presentation while preserving the main arguments and selected source imagery. The complete 62-page text/image archive retains all extracted source text and image relationships; it is not a pixel-perfect slide reproduction and does not preserve PPT animation.

```bash
node src/cli.mjs demo --collection source --out output/source-samples.html --force
node src/cli.mjs demo --collection new --out output/new-samples.html --force
node scripts/build-samples.mjs
```

The last command builds the combined 18-deck library, filtered entry points (each retaining access to all 18 decks), individual HTML/JSON decks, the unchanged original short versions in `output/short-editions.html`, `output/source-archive.html`, and `output/host-notes.html`. Host notes preserve the supplied wording, including unverified source claims and inconsistent original page numbers. Prepared assets are included in the repo, so normal builds still need only Node.js.

**Host review** reveals titles and enables previous-slide/jump navigation. It is off by default. Chinese and English versions cover native slide text; text baked into original meme images stays in its original language. The original PPT topics are under the “Original PPT samples” filter.

## Play

Pick a mystery category, slide language, and mode. The title stays hidden until you start.

- Manual advance is the default: press Space, Right arrow, or Next slide. Aim for 6–8 minutes across ten slides. The timer shows elapsed time without advancing or ending the round.
- Optional full-round timer: choose 6, 7, or 8 minutes. Ten slides receive 36, 42, or 48 seconds each; early skipping is disabled. Pause time is excluded.
- Free mode / per-slide mode: Space or Right arrow advances. Host review also allows previous-slide/jump navigation and early advance.
- P: pause/resume; L: switch slide language; F: fullscreen.
- Custom per-slide timer: 15, 20, 30, 45, or 60 seconds. Free and custom modes do not enforce the 6–8 minute total.
- Switching tabs automatically pauses the game. Resume explicitly when ready.
- Pause to return home. Interface language and slide language are independent.
- Download the selected deck as another standalone HTML; import a deck JSON locally.

Blind mode hides previews in the UI; it is not a security boundary. Anyone inspecting source can read the embedded slides.

## Generate new content with a model

Copy `.env.example` to `.env` and set `LLM_MODEL`, `LLM_API_KEY`, and optionally `LLM_BASE_URL`. The endpoint must implement OpenAI-compatible `/chat/completions` with JSON-object response mode. Compatibility depends on the provider/model; not all providers support this format. For a local server without authentication, use a loopback URL and explicitly set `LLM_ALLOW_NO_KEY=1`.

```bash
node src/cli.mjs generate --topic "A coffee shop on Mars" --slides 10 --lang both
```

Generation defaults to ten slides with a 6–8 minute narrative arc and creates a timestamped HTML and JSON in `output/`. Both languages are always included; `--lang en` starts in English, while `both` and `zh` start in Chinese. There is at most one automatic repair request for invalid JSON/schema output. Model calls can incur provider charges. The API key stays in the Node process and is never embedded in HTML.

## Use an AI tool without a separate API setup

```bash
node src/cli.mjs prompt --topic "A coffee shop on Mars" --slides 10
```

Give the generated prompt text to your AI coding/chat tool. Save the returned JSON as `my-deck.json`, then:

```bash
node src/cli.mjs render --input my-deck.json
```

Or use **Import JSON** inside the player. An AI tool that can edit the repo can perform these steps directly. A packaged skill is not included in this prototype.

## Customize / develop

- `src/sample-decks.mjs`: eight redesigned source decks with source page mappings.
- `src/new-decks.mjs`: six original decks following the supplied narrative style.
- `src/expansions.mjs`: topic-specific extensions; all original slides stay in order.
- `src/bonus-decks.mjs`: four new ten-slide decks.
- `src/library.mjs`: unified 18-deck library and original short editions.
- `src/validate.mjs`: shared Node/browser validation.
- `src/generate.mjs`: prompt, provider request, validation and repair.
- `src/web/`: player, bilingual interface, layouts, and built-in illustrations.
- `src/build.mjs`: embeds everything into one HTML.

```bash
node --test
node src/cli.mjs demo --deck tomato-universe --lang en --out output/tomato.html
node src/preview.mjs
```

The optional preview binds only to `127.0.0.1:4173`; it is not needed for playback. `npm run demo`, `npm run generate -- ...`, and `npm test` are optional aliases when npm is available. Run commands from the repository root. Custom output paths are protected against accidental overwrite; use `--force` to replace them. The default demo output is regenerated intentionally.

This edition embeds images extracted from the supplied PPTX and renders diagrams/tables/timelines as native HTML. Model generation uses typography and structured layouts unless you add packaged assets; it does not search or generate images. The browser importer can only display images already embedded in that HTML. Model generation is covered by mocked-provider tests; real provider integration requires your credentials. Generated content still benefits from a host's review for humor and layout.
## Bundled topics

The supplied PPT topics are redesigned and expanded, rather than exact reproductions of the original layouts. All six redesigned source slides remain in order, with four topic-specific additions per deck. The ten new decks follow the samples' everyday-observation-to-absurd-thesis style. Each full-length deck has ten slides. The removed prototype decks are not included.

<details>
<summary>Reveal all titles and CLI IDs (spoilers)</summary>

| Collection | Title | CLI ID |
| --- | --- | --- |
| Supplied PPT | The Universe Ends with a Tomato | `tomato-universe` |
| Supplied PPT | Bubble Tea Is Civilization’s Final Form | `bubble-tea-civilization` |
| Supplied PPT | Below 20%: A Cosmic Emergency | `battery-crisis` |
| Supplied PPT | Doing Less Is Peak Productivity | `slacking-productivity` |
| Supplied PPT | Late Nights and Galactic Peace | `galactic-night-shift` |
| Supplied PPT | Memes Are Humanity’s Second Language | `meme-language` |
| Supplied PPT | Delivery Riders Are Modern Superheroes | `delivery-heroes` |
| Supplied PPT | A Feasibility Study of Feline World Rule | `cat-world-order` |
| New original | Monday Is an Unauthorized Time Experiment | `monday-relativity` |
| New original | The Elevator Button Is Our Last Illusion of Control | `elevator-control` |
| New original | Your Fridge Is an Archaeological Site | `fridge-archaeology` |
| New original | Parcel Tracking Is Modern Epic Literature | `parcel-epic` |
| New original | “Noted” Is an Organizational Quantum State | `received-quantum` |
| New original | The Shower Is Humanity’s Highest-Level Strategy Meeting | `shower-board` |
| New original | Bookmark University: Nobody Graduates | `bookmark-university` |
| New original | Alarm Clocks Are Diplomatic Negotiations | `alarm-diplomacy` |
| New original | Whoever Holds the Remote Owns Summer | `remote-sovereignty` |
| New original | Missing Socks Are Applying for Interdimensional Residency | `sock-migration` |

</details>

## CLI options and output files

Run commands from the repository root. Custom output paths are protected from overwriting; add `--force` to replace them. The default demo and share exports are intentionally regenerated in place.

| Option | Meaning |
| --- | --- |
| `--deck <id>` | Export one bundled deck with demo |
| `--collection all\|source\|new` | Select a demo collection; default all |
| `--lang both\|zh\|en` | Starting language; both and zh start in Chinese, en starts in English; both translations stay in the file |
| `--topic "topic"` | Subject for generate or prompt |
| `--slides 10` | Slide count for generate or prompt; default 10, supported range 3–16 |
| `--input <file.json>` | A deck object or an array of 1–100 decks, up to 2 MB |
| `--out <path>` | Output HTML path, or text path for prompt |
| `--force` | Replace existing custom output files |

Try a valid three-slide authoring example:

```bash
node src/cli.mjs render --input examples/mini-deck.json --out output/mini.html
node src/cli.mjs --help
```

The three-slide example demonstrates the format; it is shorter than the ten-slide party decks.

| Generated path | Contents |
| --- | --- |
| `output/karaoke.html` | All 18 decks, manual advance by default |
| `output/source-samples.html` | All decks, initially filtered to supplied PPT topics |
| `output/new-samples.html` | All decks, initially filtered to new topics |
| `output/decks/<id>.html` and `<id>.json` | Individual playable decks and editable data |
| `output/short-editions.html` | The 14 six-slide editions before expansion |
| `output/source-archive.html` | All 62 original PPT pages' extracted text and images, in source order |
| `output/host-notes.html` | Formatted original host script; contains spoilers |
| `dist/friends/slide-blind.html` | The single file to send to friends |

The two filtered library entry points above are produced by `build-samples.mjs` and retain the full library. In contrast, CLI `demo --collection source` or `new` exports only that collection.

## Authoring and image assets

Use `examples/mini-deck.json` as a starting point. Every natural-language field is a bilingual object with `zh-CN` and `en` strings. Numbers and story beats should agree across both languages. Use `cover` for the first slide and `finale` for the last; choose a theme: `cream`, `mint`, `noir`, `cosmic`, or `alert`.

Supported layouts include comparisons, evidence lists, tables, timelines, chat transcripts, formulas, image galleries, charts, and large statistics. Titles allow up to 100 characters per language; subtitles and item details allow up to 180, but concise text works better on a projector.

Images use packaged IDs such as `image201`, resolved through `assets/catalog.json`. The builder embeds only images referenced by the exported decks. To add a new image, place a WebP in `assets/generated/`, register a unique ID and bilingual alt text in the catalog, reference it in a slide, then rebuild. Remote URLs, arbitrary file paths, and executable HTML are not supported image fields.

Browser JSON imports exist only in the current page's memory and disappear on refresh. Download the selected deck or render the JSON with the CLI to save it. Browser imports can use only images already inside that HTML; new assets require rebuilding from the command line.

For a permanent new topic, add a complete ten-slide deck to `src/bonus-decks.mjs` or import a new module from `src/library.mjs`. The expansion map is specifically for the existing six-slide decks. Update fixed library-count assertions when adding bundled topics. The [detailed content reference](docs/CONTENT_FORMAT.md) currently uses Chinese, with JSON examples.

## Validation and development

```bash
node --test
node scripts/build-samples.mjs
node scripts/export-share.mjs
```

The 23 tests cover bilingual/schema validation, safe HTML embedding, preserved source mappings, all 180 full-length slides, packaged images, manual navigation, language switching, pause behavior, optional timers, imports, and mocked model repair. Player tests use a lightweight DOM harness; they do not replace browser visual checks. After changing layouts, open an exported HTML and review both languages.

Normal builds need only Node.js and the prepared assets in this repo. Historical Python asset-processing scripts require local source files, intermediate data, and sometimes Pillow; they are not part of the clone-and-play workflow. See [scripts/README.md](scripts/README.md).

## Troubleshooting

| Problem | What to do |
| --- | --- |
| A chat attachment preview is blank or shows source | Download the .html file and open it in a browser; unzip ZIP attachments first |
| The old deck list or mode still appears | Rebuild, refresh or close the old browser tab, and open the new file |
| node is not recognized | Install Node.js 22+ and reopen the terminal; recipients playing an HTML do not need Node |
| File exists | Choose a new output filename or use --force |
| Invalid deck on import | Check bilingual fields, supported slide types, and counts against the example JSON |
| New images are missing after JSON import | Register the asset and rebuild; the browser cannot load a new local asset from its ID alone |
| Fullscreen does not activate | Use the browser's own fullscreen command or present in a normal window |
| Text inside a meme does not translate | Image pixels remain unchanged; only native slide text is bilingual |
| I only want the original PPT topics | Export with --collection source or use the Original PPT samples filter |
| A friend cannot clone the repository | Private repositories require collaborator access; sending the standalone HTML needs no GitHub access |

## Source material and repository contents

Supplied sample text and images come from the user's PPT and host script. Eight new scene illustrations were generated with ImageGen; prompts and mappings are recorded in `assets/generated/prompts.json`. Attribution is not a blanket license for third-party source material, and this project does not assign one to those assets.

Git excludes API credentials, generated output, local Office documents, supplied font files, and temporary processing data. Prepared assets are included so a fresh clone can build without the original PPTX. Exported HTML files are snapshots: rebuild and resend them to distribute content updates.
