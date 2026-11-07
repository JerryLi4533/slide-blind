from pathlib import Path
import zipfile, json, re, posixpath
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / '.qa' / 'samples'
OUT.mkdir(parents=True, exist_ok=True)
NS = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main', 'p': 'http://schemas.openxmlformats.org/presentationml/2006/main', 'r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
slides = []
with zipfile.ZipFile(ROOT / 'PPT乱讲大赛.pptx') as z:
    for name in sorted([n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml', n)], key=lambda n:int(re.search(r'(\d+)\.xml',n).group(1))):
        number = int(re.search(r'(\d+)\.xml',name).group(1))
        xml = ET.fromstring(z.read(name))
        relname = f'ppt/slides/_rels/slide{number}.xml.rels'
        rels = {}
        if relname in z.namelist():
            for r in ET.fromstring(z.read(relname)):
                rels[r.attrib['Id']] = posixpath.normpath(posixpath.join('ppt/slides', r.attrib['Target']))
        paragraphs = [''.join(p.itertext()) for p in []]
        paragraphs = [''.join(t.text or '' for t in p.findall('.//a:t',NS)) for p in xml.findall('.//a:p',NS)]
        images = []
        for pic in xml.findall('.//p:pic',NS):
            blip = pic.find('.//a:blip',NS)
            if blip is None: continue
            rid = blip.get('{'+NS['r']+'}embed')
            target = rels.get(rid)
            if target and target in z.namelist():
                dest = OUT / Path(target).name
                dest.write_bytes(z.read(target))
                xfrm = pic.find('.//a:xfrm',NS)
                images.append({'file':dest.name,'geometry':ET.tostring(xfrm,encoding='unicode') if xfrm is not None else ''})
        slides.append({'slide':number,'text':[t for t in paragraphs if t.strip()],'images':images})
    if 'docProps/thumbnail.jpeg' in z.namelist(): (OUT/'thumbnail.jpeg').write_bytes(z.read('docProps/thumbnail.jpeg'))
(OUT/'slides.json').write_text(json.dumps(slides,ensure_ascii=False,indent=2),encoding='utf-8')
for s in slides: print(f"SLIDE {s['slide']}: {' | '.join(s['text'])}\nIMAGES: {', '.join(i['file'] for i in s['images'])}")
for path in ROOT.glob('*.docx'):
    with zipfile.ZipFile(path) as z:
        root = ET.fromstring(z.read('word/document.xml'))
        ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        text='\n'.join(''.join(t.text or '' for t in p.findall('.//w:t',ns)) for p in root.findall('.//w:p',ns))
        (OUT/(path.stem+'.txt')).write_text(text,encoding='utf-8')
        print(f'\nDOCUMENT {path.name}\n{text}')

from PIL import Image, ImageOps, ImageDraw
files=[]
for p in OUT.iterdir():
    if p.name.startswith('image'):
        try:
            im=Image.open(p); im.load(); files.append((p,im.copy().convert('RGB')))
        except Exception: pass
for batch in range(0,len(files),30):
    selected=files[batch:batch+30]
    sheet=Image.new('RGB',(1000,220*((len(selected)+4)//5)), '#e8e8e8')
    draw=ImageDraw.Draw(sheet)
    for n,(p,im) in enumerate(selected):
        thumb=ImageOps.contain(im,(190,185))
        x=(n%5)*200; y=(n//5)*220
        sheet.paste(thumb,(x+(200-thumb.width)//2,y))
        draw.text((x+5,y+190),p.name,fill='black')
    sheet.save(OUT/f'contact-{batch//30+1}.jpg')
print(f'Extracted {len(slides)} slides, {len(files)} unique images. Contact sheets: {OUT}')
