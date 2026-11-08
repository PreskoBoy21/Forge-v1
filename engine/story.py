# usage: python3 story.py story.json out.png
# story.json: {"kicker":"MYTH OF THE DAY","claim":"Curls are all you need for big arms","time":"12:00","sub":"Answer in today's reel"}
# Renders a 1080x1920 Instagram Story in the Forge look (ink + volt), checked for overflow.
import sys, json
from playwright.sync_api import sync_playwright
S = json.load(open(sys.argv[1], encoding='utf-8')); out = sys.argv[2]
html = f"""<!doctype html><html><head><meta charset="utf-8"><style>
*{{box-sizing:border-box;margin:0;padding:0}}
body{{width:1080px;height:1920px;overflow:hidden;background:#0A0C10;color:#F3F5EF;font-family:'Inter Display','Inter',sans-serif}}
#s{{position:relative;width:1080px;height:1920px;background:radial-gradient(900px 900px at 50% 40%,rgba(198,242,78,.16),transparent 70%),#0A0C10}}
#grid{{position:absolute;inset:0;background-image:linear-gradient(#ffffff08 2px,transparent 2px),linear-gradient(90deg,#ffffff08 2px,transparent 2px);background-size:90px 90px}}
.mark{{position:absolute;top:250px;left:0;right:0;text-align:center;font-weight:900;font-size:38px;letter-spacing:.14em;color:#8C95A5}}
.mark b{{color:#C6F24E}}
.kick{{position:absolute;top:420px;left:0;right:0;text-align:center}}
.kick span{{display:inline-block;font-weight:900;font-size:44px;letter-spacing:.08em;color:#0A0C10;background:#C6F24E;padding:14px 34px;border-radius:999px}}
.claim{{position:absolute;top:560px;left:90px;right:90px;text-align:center;font-weight:900;font-size:{S.get('size',96)}px;line-height:1.02;text-transform:uppercase}}
.btns{{position:absolute;top:1150px;left:0;right:0;display:flex;justify-content:center;gap:40px}}
.btn{{font-weight:900;font-size:64px;padding:26px 60px;border-radius:30px;border:6px solid}}
.t{{border-color:#4ADE9A;color:#4ADE9A}} .f{{border-color:#FF4D5E;color:#FF4D5E}}
.sub{{position:absolute;top:1390px;left:0;right:0;text-align:center;font-weight:800;font-size:50px;color:#D9DDD3}}
.time{{position:absolute;top:1470px;left:0;right:0;text-align:center;font-weight:900;font-size:120px;color:#C6F24E}}
</style></head><body><div id="s"><div id="grid"></div>
<div class="mark"><b>▲</b> FORGE</div>
<div class="kick"><span>{S.get('kicker','MYTH OF THE DAY')}</span></div>
<div class="claim">“{S['claim']}”</div>
<div class="btns"><div class="btn t">TRUE</div><div class="btn f">FALSE</div></div>
<div class="sub">{S.get('sub',"Answer in today's reel")} 👀</div>
<div class="time">{S['time']}</div>
</div></body></html>"""
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1080, 'height': 1920})
    pg.set_content(html); pg.wait_for_timeout(300)
    h = pg.evaluate("document.querySelector('.claim').getBoundingClientRect().bottom")
    if h > 1120: print('OVERFLOW claim too long, lower size'); 
    pg.screenshot(path=out); b.close()
print('ok', out)
