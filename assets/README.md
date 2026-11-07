# Sample assets

`generated/` contains eight original surreal editorial images created with the built-in ImageGen tool for the new decks: Monday's melting clock, the elevator button, fridge archaeology, the heroic parcel, the rubber-stamp meeting, the shower boardroom, fridge museum artifacts, and nested containers. Exact prompts and asset mappings are in `generated/prompts.json`. WebP delivery assets are embedded into HTML. Original PNG copies are retained in the ignored `.qa/generated/` directory.

Images in `samples/` were extracted from the user-supplied `PPT乱讲大赛.pptx`. Raster assets were resized to a maximum of 1600 × 1100 and encoded as WebP for offline portability; animated GIFs retain their original bytes. Cropping during playback is avoided for evidence and memes. `catalog.json` maps the image IDs back to original filenames.

`source-slides.json` preserves all extracted paragraphs and image relationships from all 62 source slides. `host-script.txt` and `font-instructions.txt` preserve the supplied Word document text. Extracted text can contain source typos and source assertions; it is an archive, not independently verified reference material.

These are user-provided assets; no new license or permission to redistribute the original third-party imagery or fonts is implied. The build does not install or redistribute the supplied fonts. It uses system font fallbacks.

To re-extract after replacing the source files, use Python with Pillow:

```text
python scripts/inspect_samples.py
python scripts/prepare_assets.py
```

Normal demo building still needs only Node.js; the prepared assets are part of the repository.
