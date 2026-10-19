import subprocess,sys
from playwright.sync_api import sync_playwright
FPS=25; DUR=158.0; out=sys.argv[1]
ff=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','image2pipe','-framerate',str(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-pix_fmt','yuv420p','-preset','medium','-crf','17','-movflags','+faststart',out],stdin=subprocess.PIPE)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1920,'height':1080})
    pg.goto('http://127.0.0.1:8768/film_v5.html'); pg.evaluate('init()')
    n=int(DUR*FPS)
    for i in range(n):
        pg.evaluate(f'render({i/FPS})'); ff.stdin.write(pg.screenshot(type='jpeg',quality=92))
        if i%250==0: print(i,n,flush=True)
    b.close()
ff.stdin.close(); ff.wait(); print('done')
