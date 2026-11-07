"""Repackage supplied images for the offline HTML. No external downloads."""
from pathlib import Path
import json, shutil
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / '.qa' / 'samples'
DEST = ROOT / 'assets' / 'samples'
DEST.mkdir(parents=True, exist_ok=True)
existing = json.loads((ROOT/'assets/catalog.json').read_text(encoding='utf-8')) if (ROOT/'assets/catalog.json').exists() else {}
catalog = {key:value for key,value in existing.items() if value.get('origin') == 'generated'}
for p in sorted(SOURCE.glob('image*')):
    try:
        im = Image.open(p)
        if getattr(im, 'is_animated', False):
            name = p.stem + '.gif'; shutil.copyfile(p, DEST / name)
            catalog[p.stem] = {'file': 'samples/' + name, 'mime': 'image/gif', 'source': p.name}
        else:
            im = im.convert('RGBA')
            im.thumbnail((1600, 1100), Image.Resampling.LANCZOS)
            name = p.stem + '.webp'
            im.save(DEST / name, 'WEBP', quality=87, method=6)
            catalog[p.stem] = {'file': 'samples/' + name, 'mime': 'image/webp', 'source': p.name}
    except Exception as e:
        raise RuntimeError(f'Cannot package {p.name}: {e}')
(ROOT/'assets/catalog.json').write_text(json.dumps(catalog, ensure_ascii=False, indent=2), encoding='utf-8')
(ROOT/'assets/source-slides.json').write_bytes((SOURCE/'slides.json').read_bytes())
(ROOT/'assets/host-script.txt').write_bytes((SOURCE/'PPT乱讲大赛主持人演讲稿.txt').read_bytes())
(ROOT/'assets/font-instructions.txt').write_bytes((SOURCE/'0字体安装方法.txt').read_bytes())
print(f'{len(catalog)} image assets; {sum(p.stat().st_size for p in DEST.iterdir())/1024/1024:.1f} MB total')
