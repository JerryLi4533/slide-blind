"""Encode generated artwork for the offline presentation; retain originals in .qa."""
from pathlib import Path
import json, shutil
from PIL import Image

root=Path(__file__).resolve().parents[1]
entries=json.loads((root/'.qa/generated-input.json').read_text(encoding='utf-8'))
destination=root/'assets/generated'
destination.mkdir(parents=True,exist_ok=True)
originals=root/'.qa/generated'
originals.mkdir(parents=True,exist_ok=True)
catalog=json.loads((root/'assets/catalog.json').read_text(encoding='utf-8'))
descriptions=[
 ('办公室里一只融化的巨型时钟','A giant clock melting onto an office desk'),
 ('用力按下巨型关门键，但电梯门仍然敞开','An enormous close-door button, with the elevator still open'),
 ('微型考古队正在冰箱里研究剩菜','Tiny archaeologists excavating leftovers inside a refrigerator'),
 ('披着斗篷的快递包裹踏上史诗旅程','A parcel in a cape beginning an epic journey'),
 ('会议桌旁全是确认印章，中间的文件却无人处理','Approval stamps surround an untouched task folder'),
 ('淋浴间里正在举行一场荒诞的董事会','An imaginary board meeting inside a shower'),
 ('半颗柠檬、酱料包和蛋糕残块被当作考古文物','A lemon, sauce packets and a cake remnant displayed as museum artifacts'),
 ('考古学家发现套在一起的空保鲜盒','An archaeologist discovers nested empty food containers')
]
manifest=[]
for entry,description in zip(entries,descriptions):
    source=Path(entry['sourcePath'])
    shutil.copy2(source,originals/(entry['id']+'.png'))
    im=Image.open(source).convert('RGB')
    im.thumbnail((1400,1400),Image.Resampling.LANCZOS)
    out=root/'assets'/entry['output']
    im.save(out,'WEBP',quality=86,method=6)
    catalog[entry['assetId']]={'file':entry['output'],'mime':'image/webp','origin':'generated','alt':{'zh-CN':description[0],'en':description[1]}}
    manifest.append({k:v for k,v in entry.items() if k!='sourcePath'})
(root/'assets/catalog.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2),encoding='utf-8')
(destination/'prompts.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
print(f'Packaged {len(manifest)} images, {sum(p.stat().st_size for p in destination.glob("*.webp"))/1048576:.2f} MB')
