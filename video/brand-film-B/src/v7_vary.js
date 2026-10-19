// ===== 第七版 · 景别与颜色多样化（二）：外壳/感知点/事件 = 斜俯视的地图图层；汇合 = 完整地球；时间世界 = 侧面看时间轴；整体更多颜色 =====
// ---- more colour overall ----
ROOFS.splice(0,ROOFS.length,[100,102,108],[150,94,74],[74,120,118],[90,126,86],[88,110,142],[166,142,102],[170,168,160],[120,96,120]);
// sensing categories, each with its own hue (cameras amber, IoT teal, environment green, mobility blue, web lavender)
const CAT=[[255,186,104],[104,206,196],[150,204,110],[120,164,236],[194,170,240]];
const catOf=i=>{const h=Math.sin(i*12.9898)*43758.5,r=h-Math.floor(h);return r<0.38?0:r<0.6?1:r<0.75?2:r<0.9?3:4};
// ---- an oblique map plane (parallel projection) built from the remote-sensing canvases ----
function mapXf(k,th,ox,oy,sq=0.5){const c=Math.cos(th),s=Math.sin(th);return{a:k*c,b:k*sq*s,c:-k*s,d:k*sq*c,e:ox,f:oy}}
function mapImg(img,X,alpha=1){g.save();g.globalAlpha=alpha;g.setTransform(X.a,X.b,X.c,X.d,X.e,X.f);g.drawImage(img,-RS.Wm/2,-RS.Hm/2);g.restore()}
function mapPt(X,lat,lon){const x=(lon-RS.L0)/(RS.L1-RS.L0)*RS.Wm-RS.Wm/2,y=(RS.B1-lat)/(RS.B1-RS.B0)*RS.Hm-RS.Hm/2;return[X.a*x+X.c*y+X.e,X.b*x+X.d*y+X.f]}
function mapEdge(X,col,a){const P=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([u,v])=>[X.a*u*RS.Wm/2+X.c*v*RS.Hm/2+X.e,X.b*u*RS.Wm/2+X.d*v*RS.Hm/2+X.f]);g.strokeStyle=rgba(col,a);g.lineWidth=1;g.beginPath();P.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.stroke()}
function inRS(la,lo){return lo>RS.L0&&lo<RS.L1&&la>RS.B0&&la<RS.B1}
// 外壳：sky · ground · web as three stacked layers of the same region
shotShells=function(t){bg();if(!RS)return;const lt=t-37.9;const th=-0.3+lt*0.01,k=0.5+lt*0.006;
  const L=[[0,'天上',0.6],[1,'地上',3.0],[2,'网上',5.4]];const gap=200;
  L.slice().reverse().forEach(([i,nm,t0])=>{const a=ease(clamp((lt-t0)/1.0));if(a<=0)return;const X=mapXf(k,th,W/2+120,H/2-gap+i*gap+(1-a)*60);
    if(i===0){mapImg(RS.grey,X,0.5*a);mapImg(RS.col,X,0.5*a);mapImg(RS.cl,X,0.25*a)}
    else if(i===1){mapImg(RS.grey,X,0.55*a);const G=D.global;for(let j=0;j<G.length;j++){const [la,lo]=G[j];if(!inRS(la,lo))continue;const p=mapPt(X,la,lo);g.fillStyle=rgba(CAT[catOf(j)],0.7*a);g.fillRect(p[0]-1,p[1]-1,2,2)}g.globalCompositeOperation='source-over'}
    else{mapImg(RS.grey,X,0.35*a);const r=rng(31);for(let j=0;j<70;j++){const la=RS.B0+r()*(RS.B1-RS.B0),lo=RS.L0+r()*(RS.L1-RS.L0);const p=mapPt(X,la,lo);const w=24+r()*16,h=w*0.62;g.fillStyle=`rgba(24,26,32,${0.9*a})`;g.fillRect(p[0]-w/2,p[1]-h/2,w,h);g.strokeStyle=rgba(CAT[4],0.7*a);g.lineWidth=0.8;g.strokeRect(p[0]-w/2,p[1]-h/2,w,h);g.fillStyle=rgba(CAT[4],0.8*a);g.fillRect(p[0]-w/2+3,p[1]-h/2+3,w*0.5,2)}}
    mapEdge(X,[200,206,216],0.35*a);const lp=mapPt(X,RS.B1-2,RS.L0+1);text(nm,lp[0]-30,lp[1],36,rgba(C_OR2,a),'right',700,6)});
  vignette()};
// 感知点：600,000 live sensors, coloured by kind, light up over the region
shotPoints=function(t){bg();if(!RS)return;const lt=t-53.1;const X=mapXf(0.98+lt*0.03,-0.16,W/2,H/2-10,0.62);mapImg(RS.grey,X,0.7);
  const G=D.global;const fr=ease(clamp(lt/2.3));g.globalCompositeOperation='source-over';for(let j=0;j<G.length;j++){const [la,lo]=G[j];if(!inRS(la,lo))continue;if((j%97)/97>fr)continue;const p=mapPt(X,la,lo);g.fillStyle=rgba(CAT[catOf(j)],0.55);g.fillRect(p[0]-1.2,p[1]-1.2,2.4,2.4)}g.globalCompositeOperation='source-over';
  const n=Math.round(600000*ease(clamp(lt/2.6)));countUp(n,'',C_OR2,clamp(lt/0.3));
  const la=clamp((lt-0.5)/0.4);[['摄像头',0],['物联网',1],['环境',2],['交通',3]].forEach(([s,i],j)=>{g.fillStyle=rgba(CAT[i],la);g.fillRect(1500,880+j*34,14,14);text(s,1524,894+j*34,22,`rgba(230,232,238,${la})`,'left',500,2)});vignette()};
// 事件：messages are parsed (time · place · type) and dropped onto the map
shotEvents=function(t){bg();if(!RS)return;const lt=t-58.1;const X=mapXf(0.95+lt*0.02,-0.16,W/2-40,H/2+10,0.62);mapImg(RS.grey,X,0.65);
  const G=D.global;g.globalCompositeOperation='lighter';for(let j=0;j<G.length;j+=4){const [la,lo]=G[j];if(!inRS(la,lo))continue;const p=mapPt(X,la,lo);g.fillStyle=rgba(CAT[catOf(j)],0.25);g.fillRect(p[0]-0.8,p[1]-0.8,1.6,1.6)}g.globalCompositeOperation='source-over';
  const r=rng(77);const N=50;for(let i=0;i<N;i++){const t0=(i/N)*4.6+r()*0.3;const k=lt-t0;const C=D.global[Math.floor(r()*D.global.length)];const sx=1300+r()*520,sy=60+r()*300;if(k<0||!inRS(C[0],C[1]))continue;const pv=mapPt(X,C[0],C[1]);const mv=ease(clamp((k-0.7)/0.9));const tc=CAT[i%5];
    if(mv<1){const x=lerp(sx,pv[0],mv),y=lerp(sy,pv[1],mv);const w=lerp(150,10,mv),h=w*0.62;const a=clamp(k/0.25);g.fillStyle=`rgba(22,25,31,${0.9*a})`;g.fillRect(x-w/2,y-h/2,w,h);g.strokeStyle=rgba(tc,0.7*a);g.lineWidth=0.8;g.strokeRect(x-w/2,y-h/2,w,h);
      if(w>40){g.fillStyle=`rgba(225,228,234,${0.5*a})`;for(let l=0;l<3;l++)g.fillRect(x-w/2+8,y-h/2+10+l*h*0.2,w*(0.5+0.3*((i+l)%3)/2),2.5);const pa=clamp((k-0.3)/0.3)*(1-mv*2);if(pa>0){[[C_OR2,'时间'],[CAT[3],'地点'],[CAT[2],'类型']].forEach(([c,s],j)=>{g.fillStyle=rgba(c,0.9*pa);g.fillRect(x-w/2+8+j*44,y+h/2-20,38,14);text(s,x-w/2+27+j*44,y+h/2-9,11,`rgba(18,20,24,${pa})`,'center',700,0)})}}}
    else{const ph=clamp((k-1.6)/1.2);g.globalCompositeOperation='lighter';g.fillStyle=rgba(tc,0.95);g.fillRect(pv[0]-2.5,pv[1]-2.5,5,5);if(ph<1){g.strokeStyle=rgba(tc,0.8*(1-ph));g.lineWidth=1.4;g.beginPath();g.ellipse(pv[0],pv[1],4+ph*26,(4+ph*26)*0.62,0,0,7);g.stroke()}g.globalCompositeOperation='source-over'}}
  const n=Math.round(30000*ease(clamp(lt/3.5)));countUp(n,'',C_OR2,clamp(lt/0.4)*(1-clamp((lt-4.6)/0.5)));vignette()};
// 汇合：the whole planet; the predicted world (cool, offset) slides onto the real one, cities connect in orange
shotConverge=function(t){bg();const lt=t-115.8;setCam(ll(22,100+lt*1.2,2.7),[0,0,0],38);const cdir=norm(M.p);earthRich(cdir,{land:0.8});const conv=ease(clamp(lt/4.6));
  const G=D.global;g.globalCompositeOperation='lighter';const ang=(1-conv)*0.06;for(let i=0;i<G.length;i+=2){const v=ll(G[i][0],G[i][1],1.002);const fd=dot(v,cdir);if(fd<0.05)continue;const p=proj(v);if(p){g.fillStyle=rgba(CAT[catOf(i)],0.45*fd);g.fillRect(p[0]-0.9,p[1]-0.9,1.8,1.8)}
    const gv=ll(G[i][0]+ang*40,G[i][1]+ang*60,1.006+0.03*(1-conv));const q=proj(gv);if(q&&dot(norm(gv),cdir)>0.05){g.fillStyle=`rgba(170,196,236,${0.45*(1-conv*0.85)*fd})`;g.fillRect(q[0]-0.9,q[1]-0.9,1.8,1.8)}}
  const n=Math.floor(C275.length*conv);for(let i=0;i<n;i++){const [la,lo]=C275[i];const v=ll(la,lo,1.003);if(dot(v,cdir)<0.08)continue;const q=proj(v);if(!q)continue;const R0=9;const gg=g.createRadialGradient(q[0],q[1],0,q[0],q[1],R0);gg.addColorStop(0,rgba(C_OR,0.7));gg.addColorStop(1,rgba(C_OR,0));g.fillStyle=gg;g.fillRect(q[0]-R0,q[1]-R0,2*R0,2*R0)}
  g.globalCompositeOperation='source-over';vignette()};
// 时间世界：seen from the side — the four time worlds spread out along a horizontal time axis
const _tw7=shotTimeWorlds;
shotTimeWorlds=function(t){const lt=t-108.9;window.NO_EARTH=1;try{_tw7(t)}finally{window.NO_EARTH=0}};

// 视频云: no horizon in this shot
const _vc7=sceneVCloud;sceneVCloud=function(t){window.NO_EARTH=1;try{_vc7(t)}finally{window.NO_EARTH=0}};
