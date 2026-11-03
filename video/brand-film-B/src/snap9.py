import sys,time
from playwright.sync_api import sync_playwright
import threading,http.server,functools,socketserver,os as _os
_h=functools.partial(http.server.SimpleHTTPRequestHandler,directory=_os.path.dirname(_os.path.abspath(__file__)))
class _Q(_h.func):
    def log_message(self,*a):pass
_srv=socketserver.ThreadingTCPServer(('127.0.0.1',0),functools.partial(_Q,directory=_os.path.dirname(_os.path.abspath(__file__))));PORT=_srv.server_address[1];threading.Thread(target=_srv.serve_forever,daemon=True).start()
ts=[float(x) for x in sys.argv[1].split(',')];out=sys.argv[2] if len(sys.argv)>2 else 's9'
import os;os.makedirs(out,exist_ok=True)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1920,'height':1080})
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto(f'http://127.0.0.1:{PORT}/film_v9.html'); pg.evaluate('init()')
    for t in ts:
        t0=time.time();pg.evaluate(f'render({t})');print(t,round(time.time()-t0,2),flush=True); pg.screenshot(path=f'{out}/f_{t:06.2f}.jpg',type='jpeg',quality=85)
    print('errors',errs[:5]); b.close()
