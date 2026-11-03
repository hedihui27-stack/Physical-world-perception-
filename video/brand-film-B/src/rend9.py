import sys,os,time,threading,http.server,functools,socketserver
from playwright.sync_api import sync_playwright
a,b,out=int(sys.argv[1]),int(sys.argv[2]),sys.argv[3];FPS=25;os.makedirs(out,exist_ok=True)
D=os.path.dirname(os.path.abspath(__file__))
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*x):pass
srv=socketserver.ThreadingTCPServer(('127.0.0.1',0),functools.partial(Q,directory=D));P=srv.server_address[1];threading.Thread(target=srv.serve_forever,daemon=True).start()
with sync_playwright() as p:
    br=p.chromium.launch();pg=br.new_page(viewport={'width':1920,'height':1080},device_scale_factor=float(os.environ.get('DSF','0.5')))
    pg.goto(f'http://127.0.0.1:{P}/film_v9.html');pg.evaluate('init()');t0=time.time()
    for i in range(a,b):
        pg.evaluate(f'render({i/FPS})');pg.screenshot(path=f'{out}/{i:05d}.jpg',type='jpeg',quality=int(os.environ.get('Q','85')))
        if i%250==0:print(i,round(time.time()-t0),flush=True)
    br.close()
print('done',a,b)
