import sys
from playwright.sync_api import sync_playwright
ts=[float(x) for x in sys.argv[1].split(',')]
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1920,'height':1080})
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://127.0.0.1:8768/film_v7.html'); pg.evaluate('init()'); pg.evaluate('Promise.resolve(window.RS_READY)')
    for t in ts:
        import time;t0=time.time();pg.evaluate(f'render({t})');print(t,round(time.time()-t0,2)); pg.screenshot(path=f's6/f7_{t:06.2f}.jpg',type='jpeg',quality=80)
    print('errors',errs[:5]); b.close()
