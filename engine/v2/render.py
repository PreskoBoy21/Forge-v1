# usage:
#   python3 render.py <template.html> <cfg.json> test 0.5,3,8      -> stills ff_<t>.png in cwd
#   python3 render.py <template.html> <cfg.json> video <seconds>   -> frames in ./frames/ (then ffmpeg)
#   python3 render.py car.html <cfg.json> slides                   -> slide-1.png ... slide-N.png (1080x1350)
import os,sys,json
from playwright.sync_api import sync_playwright
tpl,cfg,mode=os.path.abspath(sys.argv[1]),json.load(open(sys.argv[2])),sys.argv[3]
W,H=(1080,1350) if mode=='slides' else (1080,1920)
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':W,'height':H})
    pg.add_init_script('window.CFG='+json.dumps(cfg)+';')
    pg.goto('file://'+tpl);pg.wait_for_timeout(500)
    if mode=='test':
        for t in sys.argv[4].split(','): pg.evaluate(f'render({t})');pg.screenshot(path=f'ff_{t}.png')
    elif mode=='video':
        os.makedirs('frames',exist_ok=True);n=int(float(sys.argv[4])*30)
        for i in range(n): pg.evaluate(f'render({i/30})');pg.screenshot(path=f'frames/{i:04d}.jpg',type='jpeg',quality=92)
    else:
        n=pg.evaluate('N')
        for i in range(n): pg.evaluate(f'show({i})');pg.wait_for_timeout(80);pg.screenshot(path=f'slide-{i+1}.png')
    b.close()
