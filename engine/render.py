# usage: python3 render.py <index.html> <audio.mp3> <out.mp4>      (full render, 30fps, 1080x1920)
#        python3 render.py <index.html> test <t1,t2,...>            (writes test_<t>.png stills)
# The page must define window.render(t) (seconds). Chromium via Playwright (preinstalled in cloud workspace).
import sys, subprocess, os
from playwright.sync_api import sync_playwright
html=os.path.abspath(sys.argv[1]); mode=sys.argv[2]
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={"width":1080,"height":1920})
    pg.goto("file://"+html); pg.wait_for_timeout(300)
    if mode=="test":
        for t in [float(x) for x in sys.argv[3].split(",")]:
            pg.evaluate(f"render({t})"); pg.screenshot(path=f"test_{t}.png")
    else:
        audio=mode; out=sys.argv[3]; fps=30
        dur=float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",audio]))
        ff=subprocess.Popen(["ffmpeg","-y","-loglevel","error","-f","image2pipe","-framerate",str(fps),"-c:v","mjpeg","-i","-","-i",audio,
          "-c:v","libx264","-pix_fmt","yuv420p","-crf","20","-preset","medium","-c:a","aac","-b:a","192k","-shortest","-movflags","+faststart",out],stdin=subprocess.PIPE)
        for i in range(int(dur*fps)+1):
            pg.evaluate(f"render({i/fps})"); ff.stdin.write(pg.screenshot(type="jpeg",quality=92))
        ff.stdin.close(); ff.wait()
    b.close()
