#!/usr/bin/env python3
"""Prepare the observed Apple Weather references using local captures only."""
from pathlib import Path
import hashlib
import html
import json
import struct
import subprocess

ROOT = Path(__file__).resolve().parent
SOURCES = ROOT / 'source-captures'
SHOTS = ROOT / 'screenshots'
SHOTS.mkdir(exist_ok=True)
RENAMES = {
    '08-location-marker-selected': '08-marker-tap-no-sheet',
    '16-map-panned': '16-scroll-input-no-pan',
    '19-map-data-attribution': '19-map-data-tap-no-page',
    '20-timeline-hidden': '20-timeline-hidden-after-label-taps',
}

for path in sorted(SOURCES.iterdir()):
    if not path.is_file():
        continue
    assert path.read_bytes().startswith(b'\xff\xd8'), f'Unexpected source format: {path}'
    target = path.with_name(RENAMES.get(path.stem, path.stem) + '.jpg')
    if path != target:
        assert not target.exists(), target
        path.rename(target)

log = json.loads((ROOT / 'capture-log.json').read_text())
for entry in log:
    stem = Path(entry['file']).stem
    entry['file'] = RENAMES.get(stem, stem) + '.jpg'
    if stem == '11-timeline-playing':
        entry['note'] = 'Play pressed on Wind Speed timeline; pause icon is visible. The subtitle shows a date, not a precise forecast hour.'
if not any(e['file'].startswith('00-') for e in log):
    log.insert(0, {'file': '00-initial-fullscreen.jpg', 'capturedAt': None,
                  'note': 'Initial full-screen capture before the timestamped capture log was started.'})
(ROOT / 'capture-log.json').write_text(json.dumps(log, ensure_ascii=False, indent=2) + '\n')

metadata = {
    'title': 'Apple Weather Wind Map — iPhone SE 2',
    'observedDate': '2026-09-29', 'sessionTimezone': 'Europe/Sofia',
    'device': {'model': 'iPhone SE (2nd generation)', 'productType': 'iPhone12,8',
               'osVersion': '26.6.1', 'osBuild': '23G83', 'orientation': 'portrait',
               'nativePixels': [750, 1334], 'logicalPoints': [375, 667], 'scale': 2},
    'app': {'name': 'Apple Weather', 'interfaceLanguage': 'English', 'windUnit': 'km/h'},
    'capture': {'method': 'macOS iPhone Mirroring via cua_repl', 'sourceFormat': 'JPEG',
                'sourcePixels': [392, 713], 'outputFormat': 'PNG', 'outputPixels': [375, 667],
                'crop': {'x': 8, 'y': 38, 'width': 375, 'height': 667},
                'pixelContentEdits': 'Crop only; no retouching or upscaling.',
                'nativeIOSDeviceScreenshots': False, 'statusBarTimeIsCaptureTime': False},
    'finalObservedState': 'Wind Map, My Location / Sofia, timeline visible, playback paused',
    'applicationCodeChanged': False,
}
(ROOT / 'metadata.json').write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + '\n')

manifest = []
for source in sorted(SOURCES.glob('*.jpg')):
    output = SHOTS / (source.stem + '.png')
    subprocess.run(['sips', '-s', 'format', 'png', '-c', '667', '375', '--cropOffset', '38', '8',
                    str(source), '--out', str(output)], check=True, capture_output=True)
    pixels = output.read_bytes()
    assert pixels.startswith(b'\x89PNG\r\n\x1a\n'), output
    assert struct.unpack('>II', pixels[16:24]) == (375, 667), output
    for path in (source, output):
        data = path.read_bytes()
        manifest.append({'file': str(path.relative_to(ROOT)), 'bytes': len(data),
                         'sha256': hashlib.sha256(data).hexdigest()})
(ROOT / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')

curated = [
    (26, 'Картичка в прогнозата', 'inline', 'Цялата Wind Map картичка, компактен маркер и околният интерфейс.'),
    (27, 'Пълен екран', 'full', 'Легенда, слоеве, местоположение, списък и долен панел Wind Speed.'),
    (3, 'Меню за слоеве', 'controls', 'Precipitation, Temperature, Air Quality и активен Wind.'),
    (9, 'Your Locations', 'controls', 'Име, скорост, пориви и посока за двете налични места.'),
    (10, 'Избран San Francisco', 'controls', 'Изборът на ред премества картата към запазения град.'),
    (11, 'Play е активиран', 'time', 'Бутонът показва Pause. Частиците и времевото възпроизвеждане са отделни поведения.'),
    (12, 'Pause е натиснат', 'time', 'Бутонът отново показва Play.'),
    (13, 'Преместване напред във времето', 'time', 'Белият прогрес е вдясно; датата преминава на 30 септември.'),
    (14, 'Начало на времевата линия', 'time', 'Докосване вляво; датата отново е 29 септември.'),
    (15, 'Центриране към My Location', 'controls', 'Стрелката връща картата от San Francisco към Sofia.'),
    (17, 'Увеличение с двукратно докосване', 'gestures', 'По-близък мащаб около докоснатата област.'),
    (18, 'Влачене на картата', 'gestures', 'Географията се премества, а плаващите контроли остават фиксирани.'),
    (21, 'Скрита времева линия', 'gestures', 'Докосване на свободна област скрива долния панел. Маркерът е компактен.'),
    (22, 'Върната времева линия', 'gestures', 'Следващо докосване връща панела; маркерът остава компактен.'),
    (7, 'Wind при близък мащаб', 'full', 'Връщане към Wind след Air Quality; близкият мащаб е запазен.'),
    (4, 'Precipitation', 'layers', 'Сива основа, легенда за валежи и Forecast с 1h / 12h.'),
    (5, 'Temperature', 'layers', 'Цветен температурен слой без долна времева линия.'),
    (6, 'Air Quality — Unavailable', 'layers', 'Наблюдавано липсващо покритие за Sofia, с маркер --.'),
    (23, 'Връщане от пълен екран', 'inline', 'Бутонът × връща прогнозата; картичката е частично изрязана от горната фиксирана област.'),
    (24, 'Картичка при скролиране', 'inline', 'Намалена видима част на картата; отделната Wind картичка се вижда по-надолу.'),
    (8, 'Докосване на големия маркер', 'controls', 'При този опит не се отвори допълнителен панел.'),
    (19, 'Опит с Map Data', 'controls', 'Не се отвори страница с източници; не приемаме предполагаем резултат за потвърден.'),
]
files_by_number = {int(p.name[:2]): p for p in sorted(SHOTS.glob('*.png'))}
labels = {n: (title, text) for n, title, _, text in curated}
catalog = ['# Всички заснети състояния', '', '[Описание и контроли](README.md) · [Галерия](gallery.html)', '',
           'Екраните са изрязани от оригиналните Mirroring кадри. Под всяко изображение има записаното действие/наблюдение.', '']
for entry in log:
    n = int(entry['file'][:2])
    shot = files_by_number[n]
    title, text = labels.get(n, (shot.stem, entry['note']))
    catalog.extend([f'## {n:02d}. {title}', '',
                    f'![{title}](screenshots/{shot.name})', '', text, '',
                    f"Запис: {entry['note']}", '',
                    f"Време UTC: {entry['capturedAt'] or 'не е записано за първоначалния кадър'}. "
                    f"[Оригинален кадър](source-captures/{entry['file']}).", ''])
(ROOT / 'screenshots.md').write_text('\n'.join(catalog))

cards = []
for n, title, category, caption in curated:
    path = 'screenshots/' + files_by_number[n].name
    cards.append(f'''<article class="card" data-category="{category}">
<button class="image-button" data-src="{path}" data-title="{html.escape(title, quote=True)}" aria-label="Увеличи: {html.escape(title, quote=True)}">
<img src="{path}" alt="{html.escape(title, quote=True)}" width="375" height="667" loading="lazy"></button>
<div class="copy"><span class="number">{n:02d}</span><h2>{html.escape(title)}</h2><p>{html.escape(caption)}</p><a href="{path}" target="_blank">Отвори PNG ↗</a></div></article>''')

document = '''<!doctype html><html lang="bg"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Apple Weather · Wind Map · iPhone SE 2</title>
<style>
:root{color-scheme:dark;font-family:system-ui,-apple-system,BlinkMacSystemFont,sans-serif;background:#0b1520;color:#e9f2fa}
*{box-sizing:border-box}body{margin:0}header,main,footer{max-width:1450px;margin:auto;padding:32px}header{padding-bottom:16px}
.eyebrow{color:#91c7e9;font-size:12px;letter-spacing:.1em;text-transform:uppercase}h1{font-size:clamp(28px,4vw,46px);margin:12px 0}header p{max-width:900px;line-height:1.6;color:#bdd0dd}
a{color:#9bd2f7;text-underline-offset:3px}.links{display:flex;gap:20px;flex-wrap:wrap}.filters{display:flex;gap:8px;flex-wrap:wrap;margin:24px 0 12px}
button{font:inherit;cursor:pointer}.filter{border:1px solid #334e63;border-radius:30px;padding:10px 16px;background:#162737;color:#d8e8f4}.filter[aria-pressed=true]{background:#bee6ff;color:#0b2131;border-color:#bee6ff}
#count{color:#99aebb;font-size:13px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(245px,1fr));gap:22px}.card{background:#142432;border:1px solid #2b4051;border-radius:20px;overflow:hidden}.card[hidden]{display:none}
.image-button{display:block;width:100%;border:0;padding:18px 18px 0;background:transparent}.image-button img{display:block;width:100%;height:auto;border-radius:10px;background:#0d1620}.copy{padding:18px}.number{color:#87b4d3;font-size:12px}h2{font-size:17px;line-height:1.35;margin:6px 0 10px}.copy p{font-size:14px;color:#b5c8d6;line-height:1.5;min-height:63px}.copy a{font-size:13px}
footer{font-size:13px;color:#9eb3c3;line-height:1.6;padding-top:10px}dialog{border:1px solid #425a6b;background:#10202d;color:#e9f2fa;border-radius:20px;max-width:95vw;max-height:95vh;padding:18px}dialog::backdrop{background:#02070ddd}dialog img{display:block;max-height:76vh;max-width:85vw;width:auto;height:auto;margin:auto}.dialog-bar{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:12px}#dialog-title{margin:0;font-size:15px}#close{border:1px solid #567;background:#213647;color:white;border-radius:30px;padding:8px 13px}button:focus-visible,a:focus-visible{outline:3px solid #80caff;outline-offset:3px}
@media(max-width:550px){header,main,footer{padding:22px}.grid{grid-template-columns:1fr}.image-button img{max-width:375px;margin:auto}.copy p{min-height:0}}
</style></head><body><header><div class="eyebrow">Наблюдение на реален телефон · 29.09.2026</div>
<h1>Apple Weather · Wind Map</h1><p>iPhone SE 2 · iOS 26.6.1 · английски интерфейс · km/h. Вградената картичка, пълният екран и проверените контроли. Изображенията са реални кадри от iPhone Mirroring, изрязани до 375 × 667 px.</p>
<nav class="links"><a href="README.md">Описание и контролна таблица</a><a href="screenshots.md">Всички 28 кадъра</a><a href="metadata.json">Произход и размери</a></nav>
<div class="filters" role="group" aria-label="Филтри за кадрите">
<button class="filter" data-filter="all" aria-pressed="true">Всички</button><button class="filter" data-filter="inline" aria-pressed="false">Картичка</button><button class="filter" data-filter="full" aria-pressed="false">Пълен екран</button><button class="filter" data-filter="controls" aria-pressed="false">Бутони и менюта</button><button class="filter" data-filter="time" aria-pressed="false">Време</button><button class="filter" data-filter="gestures" aria-pressed="false">Жестове</button><button class="filter" data-filter="layers" aria-pressed="false">Други слоеве</button></div>
<p id="count" aria-live="polite">22 подбрани кадъра · докосни изображение за увеличение</p></header>
<main><div class="grid">''' + '\n'.join(cards) + '''</div></main>
<footer>Стойностите за времето са моментни. Оригиналните JPEG кадри, регистърът и SHA-256 манифестът са в същата папка. Map Data не отвори отделна страница при опитите; това е отбелязано в описанието. Мултитъч и landscape не са проверявани.</footer>
<dialog id="viewer" aria-labelledby="dialog-title"><div class="dialog-bar"><h2 id="dialog-title"></h2><button id="close" aria-label="Затвори увеличения кадър">Затвори ×</button></div><img id="large" alt=""></dialog>
<script>
const cards=[...document.querySelectorAll('.card')],filters=[...document.querySelectorAll('.filter')];
filters.forEach(button=>button.addEventListener('click',()=>{filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));let count=0;cards.forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;if(!card.hidden)count++});document.querySelector('#count').textContent=`${count} кадъра · докосни изображение за увеличение`;}));
const viewer=document.querySelector('#viewer'),large=document.querySelector('#large'),title=document.querySelector('#dialog-title');
document.querySelectorAll('.image-button').forEach(button=>button.addEventListener('click',()=>{large.src=button.dataset.src;large.alt=button.dataset.title;title.textContent=button.dataset.title;viewer.showModal();}));
document.querySelector('#close').addEventListener('click',()=>viewer.close());
viewer.addEventListener('click',event=>{if(event.target===viewer){const r=viewer.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)viewer.close();}});
</script></body></html>'''
(ROOT / 'gallery.html').write_text(document)
print(f'Prepared {len(log)} captures, {len(curated)} gallery cards, and {len(manifest)} manifest entries.')
