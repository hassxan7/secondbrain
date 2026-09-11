#!/usr/bin/env python3
"""Assemble index.html from template.html + img/*.jpg + Inter-variable.woff2 + gsap.min.js.
Run after editing template.html or dropping a new headshot into img/ (file name = person id, e.g. img/boris.jpg)."""
import base64, os, sys, json
here = os.path.dirname(os.path.abspath(__file__))
rd = lambda *p: open(os.path.join(here, *p), 'rb').read()
cfg = dict(VP_TOP=130, VP_H=950, ROW_H=300, ROW_W=1300, AV=128, Q_FS=32, Q_LH=44, SCROLL=100, TOTAL=42)
html = rd('template.html').decode()
html = html.replace('__FONT__', base64.b64encode(rd('Inter-variable.woff2')).decode())
html = html.replace('__GSAP__', rd('gsap.min.js').decode())
imgs = {os.path.splitext(f)[0]: base64.b64encode(rd('img', f)).decode()
        for f in sorted(os.listdir(os.path.join(here, 'img'))) if f.lower().endswith(('.jpg', '.jpeg'))}
html = html.replace('__IMGS__', ','.join(f"{k}:'{v}'" for k, v in imgs.items()))
for k, v in cfg.items(): html = html.replace(f'__{k}__', str(v))
open(os.path.join(here, 'index.html'), 'w').write(html)
print(f"index.html {len(html)//1024} KB, headshots: {', '.join(imgs)}")
