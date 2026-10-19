// ===== new scenes for film B v2 (narration 2026-10-15) =====
const rng=s=>()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296};
const LT=t=>t-CP.t0;            // local time inside segment
const C_SAT=[255,212,92],C_CAM=[255,111,181],C_SEN=[95,224,176],C_NET=[159,232,255],C_INK=[233,238,249],C_MUT=[147,160,186];
// ---------- shared layers ----------
let FIB=null;function fib(n){if(FIB&&FIB.length===n)return FIB;FIB=[];const ga=Math.PI*(3-Math.sqrt(5));for(let i=0;i<n;i++){const y=1-2*(i+.5)/n,r=Math.sqrt(1-y*y),a=i*ga;FIB.push([Math.cos(a)*r,y,Math.sin(a)*r])}return FIB}
let LINKS=null;function links(){if(LINKS)return LINKS;const P=fib(2600),r=rng(3);LINKS=[];while(LINKS.length<260){const a=P[Math.floor(r()*P.length)],b=P[Math.floor(r()*P.length)];const d=dot(a,b);if(d>0.55&&d<0.93)LINKS.push([a,b,r()])}return LINKS}
function arc3(a,b,h,u=1){const mid=norm([a[0]+b[0],a[1]+b[1],a[2]+b[2]]).map(x=>x*(1+h));const out=[];for(let j=0;j<=24;j++){const s=j/24*u;out.push([0,1,2].map(i=>(1-s)*(1-s)*a[i]+2*(1-s)*s*mid[i]+s*s*b[i]))}return out}
function poly(pts,col,w){g.strokeStyle=col;g.lineWidth=w;g.beginPath();let on=false;for(const v of pts){const p=proj(v);if(!p||occluded(v)){on=false;continue}on?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]);on=true}g.stroke()}
function drawGroundPts(t,cdir,frac,alpha=1,wave=null){const pts=D.global;const NN=Math.floor(pts.length*frac);for(let i=0;i<NN;i++){const [la,lo]=pts[i];const v=ll(la,lo,1.002);const fd=dot(v,cdir);if(fd<0.03)continue;let a=1;if(wave){const d=Math.acos(clamp(dot(v,wave.c),-1,1));if(d>wave.r)continue;a=clamp((wave.r-d)*6)}const p=proj(v);const tw=0.55+0.45*Math.sin(t*1.7+i*0.37);g.fillStyle=`rgba(${i%9===0?'255,111,181':'159,232,255'},${(0.22+0.3*tw)*fd*alpha*a})`;g.fillRect(p[0],p[1],1.1,1.1)}}
function drawSats(t,cdir,n=32,trail=20,alpha=1){const T=t*240;for(let i=0;i<n;i++){const e=SSO[i];let prev=null;for(let k=trail;k>=0;k--){const s=sat(e,T-k*120);const v=norm(s.v).map(x=>x*1.003);const fd=dot(v,cdir);const p=proj(v);if(prev&&fd>0.02&&prev[2]>0.02){const age=k/trail;g.strokeStyle=`rgba(255,212,92,${(0.38-0.28*age)*fd*alpha})`;g.lineWidth=Math.max(2,10*fd);g.beginPath();g.moveTo(prev[0],prev[1]);g.lineTo(p[0],p[1]);g.stroke()}prev=[p[0],p[1],fd]}
  const s=sat(e,T);if(!occluded(s.v)){const p=proj(s.v);const s2=sat(e,T+20);const q=proj(s2.v)||p;let dx=q[0]-p[0],dy=q[1]-p[1];const L=Math.hypot(dx,dy)||1;dx/=L;dy/=L;const wx=-dy,wy=dx;g.strokeStyle=`rgba(110,150,230,${alpha})`;g.lineWidth=2.4;g.beginPath();g.moveTo(p[0]-wx*9,p[1]-wy*9);g.lineTo(p[0]+wx*9,p[1]+wy*9);g.stroke();g.fillStyle=`rgba(232,190,90,${alpha})`;g.fillRect(p[0]-2.2,p[1]-2.2,4.4,4.4)}}}
function srcRing(t,R=1.85){return[...Array(477)].map((_,i)=>{const a=i/477*6.283+t*0.03,inc=0.35*Math.sin(i*1.7);return[Math.cos(a)*R,Math.sin(a)*Math.sin(inc)*R+0.25*Math.sin(i),Math.sin(a)*Math.cos(inc)*R]})}
function drawSources(t,cdir,alpha=1,arcs=120){const srcs=srcRing(t);for(const s of srcs){const p=proj(s);if(!p)continue;g.fillStyle=`rgba(159,232,255,${0.5*alpha})`;g.fillRect(p[0]-1,p[1]-1,2,2)}
  const r=rng(11),cats=Object.values(EVT),G=D.global;for(let k=0;k<arcs;k++){const born=r()*12,life=3.2;const age=((t-born)%12+12)%12;const pt=G[Math.floor(r()*G.length)];const sp=srcs[Math.floor(r()*477)];if(age>life)continue;const v=ll(pt[0],pt[1],1.003);const fd=dot(v,cdir);const col=hex(cats[k%cats.length]);
    if(age<0.9&&fd>0){poly(arc3(sp,v,0.3,age/0.9),rgba(col,0.28*alpha),1)}
    if(age>=0.9&&fd>0.05){const a=(age-0.9)/(life-0.9);const p=proj(v);g.strokeStyle=rgba(col,(1-a)*fd*alpha);g.lineWidth=1.5;g.beginPath();g.arc(p[0],p[1],3+a*28*fd,0,7);g.stroke()}}}
function label(x,y,s,col,size=20,align='left'){text(s,x,y,size,col,align,500,1)}

// ---------- 01 数字世界已被索引 ----------
function sceneIndex(t){bg();const lt=LT(t);camGlobe(30+lt*3.2,16,3.35-0.25*ease(CP.k));const cdir=norm(M.p);
  const c0=proj([0,0,0]),er=proj(M.r)[0]-c0[0];let gr=g.createRadialGradient(c0[0],c0[1],er*0.96,c0[0],c0[1],er*1.2);gr.addColorStop(0,'rgba(159,232,255,0.22)');gr.addColorStop(1,'rgba(159,232,255,0)');g.fillStyle=gr;g.beginPath();g.arc(c0[0],c0[1],er*1.25,0,7);g.fill();
  g.fillStyle='#06111b';g.beginPath();g.arc(c0[0],c0[1],er,0,7);g.fill();
  g.globalCompositeOperation='lighter';
  const P=fib(2600);const k1=clamp(lt/3.2);const org=clamp((lt-4.2)/3);
  for(let i=0;i<P.length;i++){if(i/P.length>k1)break;let v=P[i];if(org>0){const lat=Math.asin(v[1]);const band=Math.round(lat/(Math.PI/18))*(Math.PI/18);const lon=Math.atan2(v[2],v[0]);const tl=lerp(lat,band,ease(org));v=[Math.cos(tl)*Math.cos(lon),Math.sin(tl),Math.cos(tl)*Math.sin(lon)]}
    const fd=dot(v,cdir);if(fd<0.02)continue;const p=proj(v);g.fillStyle=`rgba(159,232,255,${(0.25+0.55*fd)})`;g.fillRect(p[0]-0.8,p[1]-0.8,1.7,1.7)}
  for(const [a,b,ph] of links()){const u=clamp(lt*0.5-ph*0.8);if(u<=0)continue;poly(arc3(a,b,0.12,u),`rgba(159,232,255,${0.22})`,1)}
  // three organizing rings: search / recommendation / LLM
  const rings=[[1.32,0.35,'搜索'],[1.52,-0.25,'推荐'],[1.74,0.1,'大模型']];
  rings.forEach(([R,tilt,name],ri)=>{const a=clamp((lt-4.4-ri*0.9)/1.2);if(a<=0)return;const pts=[];for(let j=0;j<=120;j++){const u=j/120*6.283;pts.push([Math.cos(u)*R,Math.sin(u)*Math.sin(tilt)*R,Math.sin(u)*Math.cos(tilt)*R])}
    g.strokeStyle=`rgba(233,238,249,${0.35*a})`;g.lineWidth=1.2;g.beginPath();pts.forEach((v,j)=>{const p=proj(v);j?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1])});g.stroke();
    for(let q=0;q<6;q++){const u=(lt*0.35*(ri%2?-1:1)+q/6)*6.283;const v=[Math.cos(u)*R,Math.sin(u)*Math.sin(tilt)*R,Math.sin(u)*Math.cos(tilt)*R];const p=proj(v);g.fillStyle=`rgba(233,238,249,${0.9*a})`;g.beginPath();g.arc(p[0],p[1],3,0,7);g.fill()}
    const lv=[Math.cos(-0.6)*R,Math.sin(-0.6)*Math.sin(tilt)*R,Math.sin(-0.6)*Math.cos(tilt)*R];const lp=proj(lv);g.globalCompositeOperation='source-over';label(lp[0]+12,lp[1]+6,name,`rgba(233,238,249,${a})`,22);g.globalCompositeOperation='lighter'});
  g.globalCompositeOperation='source-over';vignette()}

// ---------- 02 泰山：知道位置，不知道此刻 ----------
function ridge(x,z){return 1.6*Math.exp(-((x-0.2)**2+(z+0.3)**2)/3.2)+0.9*Math.exp(-((x+2.2)**2+(z-1)**2)/2)+0.6*Math.exp(-((x-2.6)**2+(z-1.8)**2)/2.6)+0.12*Math.sin(x*2.1+z*1.3)+0.08*Math.sin(x*4.7-z*3.1)}
function sceneTaishan(t){bg();const lt=LT(t);const az=-0.5+lt*0.03;setCam([Math.sin(az)*9,4.6,Math.cos(az)*9],[0,0.9,0],38);
  // terrain wireframe, coloured by height
  for(let zi=-24;zi<=24;zi++){const z=zi*0.2;let prev=null;for(let xi=-28;xi<=28;xi++){const x=xi*0.2;const h=ridge(x,z);const p=proj([x,h,z]);if(prev&&p){const c=R.altitude(h*5200);g.strokeStyle=rgba(c,0.22+0.35*clamp(h/1.6));g.lineWidth=1;g.beginPath();g.moveTo(prev[0],prev[1]);g.lineTo(p[0],p[1]);g.stroke()}prev=p}}
  for(let xi=-28;xi<=28;xi+=2){const x=xi*0.2;let prev=null;for(let zi=-24;zi<=24;zi++){const z=zi*0.2;const h=ridge(x,z);const p=proj([x,h,z]);if(prev&&p){g.strokeStyle=`rgba(93,104,130,${0.12+0.2*clamp(h/1.6)})`;g.beginPath();g.moveTo(prev[0],prev[1]);g.lineTo(p[0],p[1]);g.stroke()}prev=p}}
  // grid floor
  g.strokeStyle='rgba(79,127,184,0.12)';for(let i=-5;i<=5;i++){const a=proj([i,0,-5]),b=proj([i,0,5]),c=proj([-5,0,i]),d=proj([5,0,i]);g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.moveTo(c[0],c[1]);g.lineTo(d[0],d[1]);g.stroke()}
  // known: location pin (crisp)
  const top=[0.2,ridge(0.2,-0.3),-0.3];const p0=proj(top),p1=proj([top[0],top[1]+1.1,top[2]]);const ka=clamp(lt/0.8);
  g.strokeStyle=`rgba(233,238,249,${ka})`;g.lineWidth=2;g.beginPath();g.moveTo(p0[0],p0[1]);g.lineTo(p1[0],p1[1]);g.stroke();g.fillStyle=`rgba(233,238,249,${ka})`;g.beginPath();g.arc(p1[0],p1[1],6,0,7);g.fill();
  label(p1[0]+16,p1[1]-4,'泰山',`rgba(233,238,249,${ka})`,30);text('36.25°N  117.10°E  ·  1545 m',p1[0]+16,p1[1]+26,20,`rgba(147,160,186,${ka})`,'left',400,1);
  // unknown: cloud layer at summit level — hatched, flickering
  const ua=clamp((lt-1.6)/1);if(ua>0){const yc=1.25;const cl=[];for(let i=0;i<=64;i++){const u=i/64*6.283;cl.push([0.2+Math.cos(u)*3.6,yc,-0.3+Math.sin(u)*2.4])}
    g.setLineDash([10,8]);poly(cl,`rgba(159,232,255,${0.55*ua})`,1.6);g.setLineDash([]);
    const r=rng(2);for(let i=0;i<220;i++){const u=r()*6.283,rr=Math.sqrt(r());const v=[0.2+Math.cos(u)*3.6*rr,yc+(r()-.5)*0.15,-0.3+Math.sin(u)*2.4*rr];const p=proj(v);const fl=0.5+0.5*Math.sin(t*9+i*1.7);g.fillStyle=`rgba(159,232,255,${0.18*ua*fl})`;g.fillRect(p[0],p[1],2,2)}
    const q=proj([3.9,yc,-0.3]);label(q[0]+14,q[1]+8,'云海 ?',`rgba(159,232,255,${ua*(0.6+0.4*Math.sin(t*6))})`,30)}
  vignette()}

// ---------- 03 停车场：知道位置，不知道空位 ----------
function sceneParking(t){bg();const lt=LT(t);setCam([2.5,9.5-0.8*ease(CP.k),8],[0,0,0.2],38);
  const cols=14,rows=6,sw=0.42,sd=0.9;const ox=-cols*sw/2,oz=-2.4;
  const box=(x0,z0,x1,z1,st,fill)=>{const c=[[x0,0,z0],[x1,0,z0],[x1,0,z1],[x0,0,z1]].map(proj);g.beginPath();c.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();if(fill){g.fillStyle=fill;g.fill()}if(st){g.strokeStyle=st;g.stroke()}};
  g.lineWidth=1.2;box(ox-0.4,oz-0.6,-ox+0.4,oz+rows*sd+1.6,'rgba(93,104,130,0.6)');
  const r=rng(8);
  for(let ro=0;ro<rows;ro++)for(let c=0;c<cols;c++){const x=ox+c*sw,z=oz+ro*sd+(ro%2?0.3:0);const fl=0.5+0.5*Math.sin(t*5+ro*3+c*1.3+r()*6);
    g.setLineDash([4,4]);box(x+0.03,z,x+sw-0.03,z+0.72,'rgba(147,160,186,0.45)',`rgba(147,160,186,${0.05+0.06*fl})`);g.setLineDash([]);
    const p=proj([x+sw/2,0,z+0.36]);text('?',p[0],p[1]+7,18,`rgba(147,160,186,${0.35+0.4*fl})`,'center',500)}
  // known entrance pin
  const pe=proj([ox-0.4,0,oz+rows*sd+0.6]),pt=proj([ox-0.4,1.1,oz+rows*sd+0.6]);g.strokeStyle='#e9eef9';g.lineWidth=2;g.beginPath();g.moveTo(pe[0],pe[1]);g.lineTo(pt[0],pt[1]);g.stroke();g.fillStyle='#e9eef9';g.beginPath();g.arc(pt[0],pt[1],6,0,7);g.fill();icon('P',pt[0]+30,pt[1]-2,34,C_INK,1);
  // time strip: now / +30 min unknown
  const x0=560,x1=1360,y=930;g.strokeStyle='rgba(147,160,186,0.5)';g.lineWidth=2;g.beginPath();g.moveTo(x0,y);g.lineTo(x1,y);g.stroke();
  const mk=(x,s,a)=>{g.fillStyle=`rgba(233,238,249,${a})`;g.beginPath();g.arc(x,y,6,0,7);g.fill();text(s,x,y+40,22,`rgba(233,238,249,${a})`,'center',500,1)};
  mk(x0,'此刻 ?',1);const a2=clamp((lt-3.6)/0.8);if(a2>0){g.setLineDash([8,8]);g.strokeStyle=`rgba(159,232,255,${a2})`;g.beginPath();g.moveTo(x0,y);g.lineTo(lerp(x0,x1,a2),y);g.stroke();g.setLineDash([]);mk(x1,'30 分钟后 ?',a2)}
  vignette()}

// ---------- 04 物理世界的现在，尚未被索引 ----------
function sceneDark(t){bg();const lt=LT(t);window.USE_CAMG?camG(t):camGlobe(110+lt*1.5,24,3.2);const {cdir}=globeBase(0.9);
  g.globalCompositeOperation='lighter';const P=fib(2600);const fade=1-clamp(lt/1.6);
  if(fade>0)for(let i=0;i<P.length;i+=2){const v=P[i].map(x=>x*(1+0.25*(1-fade)));const fd=dot(norm(v),cdir);if(fd<0.02)continue;const p=proj(v);g.fillStyle=`rgba(159,232,255,${0.35*fade*fd})`;g.fillRect(p[0],p[1],1.4,1.4)}
  const r=rng(21);for(let i=0;i<160;i++){const pt=D.global[Math.floor(r()*D.global.length)];const v=ll(pt[0],pt[1],1.002);const fd=dot(v,cdir);if(fd<0.05)continue;const on=Math.sin(t*2.3+i*2.1)>0.7;if(!on)continue;const p=proj(v);g.fillStyle='rgba(147,160,186,0.8)';g.fillRect(p[0]-1.5,p[1]-1.5,3,3)}
  g.globalCompositeOperation='source-over';vignette()}

// ---------- 05 SeeMind 点亮物理世界 ----------
function sceneWake(t){bg();const lt=LT(t);window.USE_CAMG?camG(t):camGlobe(112+lt*1.6,26,3.2-0.3*ease(CP.k));const {cdir}=globeBase(1.2);g.globalCompositeOperation='lighter';
  const c=ll(39.9,116.4);const wr=0.05+3.2*ease(clamp(lt/7));drawGroundPts(t,cdir,1,1,{c,r:wr});
  // wave front
  const ring=[];for(let i=0;i<=90;i++){const u=i/90*6.283;const ax=norm(cross(c,[0,1,0])),ay=cross(ax,c);const d=Math.min(wr,3.1);ring.push([0,1,2].map(k=>(c[k]*Math.cos(d)+(ax[k]*Math.cos(u)+ay[k]*Math.sin(u))*Math.sin(d))*1.004))}
  if(wr<3.1)poly(ring,'rgba(233,238,249,0.5)',1.5);
  const pc=proj(c.map(x=>x*1.004));if(dot(c,cdir)>0){g.fillStyle='#fff';g.beginPath();g.arc(pc[0],pc[1],4,0,7);g.fill()}
  g.globalCompositeOperation='source-over';vignette()}

// ---------- 06 天上、地上、网上：三层同框 ----------
function sceneLayers(t){bg();const lt=LT(t);window.USE_CAMG?camG(t):camGlobe(96+lt*1.2,22,4.3-0.5*ease(CP.k));const {cdir}=globeBase(1.1);g.globalCompositeOperation='lighter';
  const a1=clamp(lt/1.4),a2=clamp((lt-1.6)/1.4),a3=clamp((lt-3.2)/1.4);
  drawGroundPts(t,cdir,1,a2);drawSats(t,cdir,32,8,a1);drawSources(t,cdir,a3,90);
  g.globalCompositeOperation='source-over';
  const lab=(a,y,k,col)=>{if(a<=0)return;icon(k,1560,y-10,40,col,a)};
  lab(a1,400,'sat',C_SAT);lab(a2,480,'cam',C_CAM);lab(a3,560,'net',C_NET);
  vignette()}

// ---------- 10 统一坐标：三维底座 ----------
let BLD=null;function blds(){if(BLD)return BLD;const r=rng(31);BLD=[];for(let i=-11;i<=11;i++)for(let j=-11;j<=11;j++){if(i%4===0||j%4===0)continue;const d=Math.hypot(i,j);const h=(0.15+r()*0.5)*(1+3.2*Math.exp(-d*d/40))*(r()<0.08?2:1);BLD.push([i*0.55,j*0.55,0.22+r()*0.12,h])}return BLD}
function sceneBase(t){bg();const lt=LT(t);const az=0.7+lt*0.04;setCam([Math.sin(az)*12,7.5-1.2*ease(CP.k),Math.cos(az)*12],[0,0.8,0],40);
  const B=blds().map(b=>[b,Math.hypot(b[0]-M.p[0],b[1]-M.p[2])]).sort((a,b)=>b[1]-a[1]);const grow=ease(clamp(lt/2.2));
  for(const [[x,z,s,h0]] of B){const h=h0*grow;const c=R.altitude(h*3500);const corners=[[x-s,z-s],[x+s,z-s],[x+s,z+s],[x-s,z+s]];
    const bot=corners.map(([a,b])=>proj([a,0,b])),top=corners.map(([a,b])=>proj([a,h,b]));if(bot.some(p=>!p))continue;
    for(let k=0;k<4;k++){const k2=(k+1)%4;g.fillStyle=rgba(c.map(v=>v*0.35),0.9);g.beginPath();g.moveTo(bot[k][0],bot[k][1]);g.lineTo(bot[k2][0],bot[k2][1]);g.lineTo(top[k2][0],top[k2][1]);g.lineTo(top[k][0],top[k][1]);g.closePath();g.fill()}
    g.fillStyle=rgba(c,0.9);g.beginPath();top.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill();g.strokeStyle=rgba(c,0.5);g.lineWidth=0.6;g.stroke()}
  // observations falling into one coordinate frame
  g.globalCompositeOperation='lighter';const r=rng(41);const cols=[C_SAT,C_CAM,C_SEN,C_NET];
  for(let i=0;i<260;i++){const b=BLD[Math.floor(r()*BLD.length)];const born=r()*6+1.2,col=cols[i%4];const age=lt-born;if(age<0)continue;const fall=clamp(age/1.1);const h=b[3]*grow;const y=lerp(h+4,h+0.02,ease(fall));const p=proj([b[0],y,b[1]]);if(!p)continue;
    if(fall<1){g.fillStyle=rgba(col,0.85);g.fillRect(p[0]-1.5,p[1]-1.5,3,3)}else{const k=clamp((age-1.1)/1.2);g.strokeStyle=rgba(col,1-k);g.lineWidth=1.4;g.beginPath();g.ellipse(p[0],p[1],3+k*14,(3+k*14)*0.5,0,0,7);g.stroke();g.fillStyle=rgba(col,0.9);g.fillRect(p[0]-1.5,p[1]-1.5,3,3)}}
  g.globalCompositeOperation='source-over';vignette()}

// ---------- 11 一基多专 ----------
function sceneExperts(t){bg();const lt=LT(t);const cx=960,cy=560;
  const EX=[[C_SAT,'SeeMind-Sat','卫星',-560,-250],[C_CAM,'SeeMind-Cam','摄像头',560,-250],[C_SEN,'SeeMind-Sense','传感器',-560,250],[C_NET,'SeeMind-News','互联网',560,250]];
  const intro=clamp(lt/1.5);
  // core
  const cr=110;g.strokeStyle='rgba(233,238,249,0.25)';g.lineWidth=1;for(let k=0;k<3;k++){g.beginPath();g.ellipse(cx,cy,cr+k*16,(cr+k*16)*0.92,lt*0.2*(k%2?-1:1),0,6.283);g.stroke()}
  const cg=g.createRadialGradient(cx,cy,0,cx,cy,cr);cg.addColorStop(0,'rgba(233,238,249,0.22)');cg.addColorStop(1,'rgba(233,238,249,0.02)');g.fillStyle=cg;g.beginPath();g.arc(cx,cy,cr,0,7);g.fill();
  text('SeeMind-Base',cx,cy-4,26,'#e9eef9','center',600,1);text('基础大模型 · 融合推演',cx,cy+28,18,'#93a0ba','center',400,1);
  g.globalCompositeOperation='lighter';
  EX.forEach(([col,name,src,dx,dy],ei)=>{const ex=cx+dx*0.62,ey=cy+dy*0.62,sx=cx+dx*1.38,sy=cy+dy*1.38;const a=clamp(intro*1.5-ei*0.15);
    // raw stream: dense particles source -> expert
    for(let i=0;i<320;i++){const u=((lt*0.55+i/320+ei*0.13)%1);const jx=Math.sin(i*12.9)*60*(1-u),jy=Math.cos(i*7.3)*60*(1-u);const x=lerp(sx+jx,ex,u),y=lerp(sy+jy,ey,u);g.fillStyle=rgba(col,0.8*a);g.fillRect(x-1.2,y-1.2,2.4,2.4)}
    // structured tokens: few, larger, expert -> core
    for(let i=0;i<5;i++){const u=((lt*0.32+i/5+ei*0.21)%1);const x=lerp(ex,cx+dx*0.2,u),y=lerp(ey,cy+dy*0.2,u);g.fillStyle=rgba(col,0.95*a*(1-u*0.3));g.fillRect(x-5,y-5,10,10)}
    g.globalCompositeOperation='source-over';
    g.fillStyle=rgba(col,0.16*a);g.beginPath();g.arc(ex,ey,46,0,7);g.fill();g.strokeStyle=rgba(col,0.8*a);g.lineWidth=1.6;g.beginPath();g.arc(ex,ey,46,0,7);g.stroke();
    text(name,ex,ey+(dy<0?-62:84),22,rgba(col,a),'center',600,1);text(src,sx,sy+(dy<0?-30:44),20,rgba(col.map(v=>v*0.8),a),'center',500,2);
    g.globalCompositeOperation='lighter'});
  g.globalCompositeOperation='source-over';
  const la=clamp((lt-1.5)/1);legendDot(160,980,'rgba(233,238,249,0.6)','细点：源头原始数据，在边缘就地看懂');g.fillStyle=`rgba(233,238,249,0.9)`;g.fillRect(800,968,10,10);text('方块：结构化事件，进入基础模型',822,980,20,'#93a0ba');
  vignette()}

// ---------- 12-13 文字 token vs 现实切片 → 状态图 ----------
function streetFrame(x0,y0,w,h,t){g.fillStyle='#0b1622';g.fillRect(x0,y0,w,h);g.fillStyle='#16283a';g.beginPath();g.moveTo(x0,y0+h*0.62);g.lineTo(x0+w,y0+h*0.38);g.lineTo(x0+w,y0+h*0.6);g.lineTo(x0,y0+h*0.86);g.fill();
  const r=rng(5);for(let i=0;i<9;i++){const u=((t*0.08+r())%1);const x=x0+u*w,y=y0+h*(0.72-0.24*u)+(i%2?10:-6);g.fillStyle=['#4aa8ff','#ffd166','#e9eef9','#ff7a3d'][i%4];g.fillRect(x-9,y-5,18,10)}
  for(let i=0;i<26;i++){const x=x0+r()*w,y=y0+h*(0.2+0.25*r())+((t*12+i*7)%20);g.fillStyle='#ff9ecb';g.fillRect(x,y,3,3)}
  for(let i=0;i<6;i++){g.fillStyle='#1f3a6e';g.fillRect(x0+i*w/6+8,y0+8,w/6-16,h*0.22)}}
let SG=null;function sgraph(){if(SG)return SG;const r=rng(17);const nodes=[...Array(26)].map((_,i)=>({x:1240+r()*480,y:300+r()*460,k:i%4}));const edges=[];nodes.forEach((n,i)=>{nodes.forEach((m,j)=>{if(j>i&&Math.hypot(n.x-m.x,n.y-m.y)<150&&r()<0.6)edges.push([i,j])})});SG={nodes,edges};return SG}
function sceneTokens(t){bg();const lt=LT(t);const ph2=5.35;
  if(lt<ph2+1){const a=1-clamp((lt-ph2)/1);const words='大模型建模的是文字'.split('');const y=300;
    text('大模型的 token',220,y-50,22,`rgba(147,160,186,${a})`,'left',500,2);
    words.forEach((w,i)=>{const k=clamp(lt*2.2-i*0.25);const x=220+i*72;g.globalAlpha=a*k;g.strokeStyle='rgba(147,160,186,0.6)';g.lineWidth=1;g.strokeRect(x,y,60,60);text(w,x+30,y+42,30,'#c9d2e3','center',500);g.globalAlpha=1});
    const b=clamp((lt-2.4)/1)*a;if(b>0){text('SeeMind 的 token',220,y+180,22,`rgba(159,232,255,${b})`,'left',500,2);g.globalAlpha=b;streetFrame(220,y+210,640,300,t);g.strokeStyle='rgba(159,232,255,0.7)';for(let i=1;i<8;i++){g.beginPath();g.moveTo(220+i*80,y+210);g.lineTo(220+i*80,y+510);g.stroke()}for(let j=1;j<4;j++){g.beginPath();g.moveTo(220,y+210+j*75);g.lineTo(860,y+210+j*75);g.stroke()}g.globalAlpha=1}}
  // phase 2: patches with (t,x,y) fly into a state graph that keeps versions
  const k2=clamp((lt-ph2+0.4)/1.2);if(k2>0){const fx=180,fy=330,fw=640,fh=360;g.globalAlpha=k2;streetFrame(fx,fy,fw,fh,t);g.globalAlpha=1;
    const {nodes,edges}=sgraph();const cols=[C_CAM,C_SAT,C_SEN,C_NET];
    // version stack behind graph
    for(let v=3;v>=1;v--){const off=v*26;g.strokeStyle=`rgba(111,201,192,${0.12*k2})`;g.lineWidth=1;g.strokeRect(1200+off,270-off,560,520);text(`t-${v}`,1200+off+560,270-off-8,16,`rgba(111,201,192,${0.4*k2})`,'right')}
    g.strokeStyle=`rgba(111,201,192,${0.5*k2})`;g.strokeRect(1200,270,560,520);text('城市状态图 · 版本化 · 可回溯',1200,250,20,`rgba(111,201,192,${k2})`,'left',500,1);
    const grow=clamp((lt-ph2)/6);for(const [i,j] of edges){if((i+j)/52>grow)continue;g.strokeStyle='rgba(111,201,192,0.35)';g.lineWidth=1;g.beginPath();g.moveTo(nodes[i].x,nodes[i].y);g.lineTo(nodes[j].x,nodes[j].y);g.stroke()}
    nodes.forEach((n,i)=>{if(i/26>grow+0.05)return;const pulse=0.5+0.5*Math.sin(t*3+i);g.fillStyle=rgba(cols[n.k],0.85);g.beginPath();g.arc(n.x,n.y,5+3*pulse,0,7);g.fill()});
    g.globalCompositeOperation='lighter';
    for(let p=0;p<14;p++){const cyc=1.6;const age=((lt-ph2+p*0.37)%cyc)/cyc;const ci=p%8,cj=Math.floor(p/8)%4;const sx=fx+ci*80+40,sy=fy+cj*90+45;const n=nodes[(p*7)%nodes.length];const x=lerp(sx,n.x,ease(age)),y=lerp(sy,n.y,ease(age))-Math.sin(age*Math.PI)*80;
      g.strokeStyle=`rgba(159,232,255,${0.9*(1-age*0.6)})`;g.lineWidth=1.5;g.strokeRect(x-18,y-14,36,28);if(age<0.7)text(`t·x·y`,x,y-20,14,`rgba(159,232,255,${0.8*(1-age)})`,'center',500)}
    g.globalCompositeOperation='source-over';
    g.strokeStyle='rgba(159,232,255,0.7)';for(let i=1;i<8;i++){g.beginPath();g.moveTo(fx+i*80,fy);g.lineTo(fx+i*80,fy+fh);g.stroke()}for(let j=1;j<4;j++){g.beginPath();g.moveTo(fx,fy+j*90);g.lineTo(fx+fw,fy+j*90);g.stroke()}
    text('每个切片：一段画面 + 时间 + 位置',fx,fy+fh+44,20,`rgba(159,232,255,${k2})`,'left',500,1)}
  vignette()}

// ---------- 18 现实闭环 ----------
function sceneLoop(t){bg();const lt=LT(t);const cx=960,cy=540,Rr=300;const N=[['感知',-90,C_CAM],['预测',0,C_NET],['行动',90,C_SAT],['现实验证',180,C_SEN]];
  g.strokeStyle='rgba(147,160,186,0.35)';g.lineWidth=2;g.beginPath();g.arc(cx,cy,Rr,0,7);g.stroke();
  const head=(-90+lt*140)*Math.PI/180;g.strokeStyle='rgba(233,238,249,0.9)';g.lineWidth=4;g.beginPath();g.arc(cx,cy,Rr,head-1.2,head);g.stroke();
  N.forEach(([s,deg,col])=>{const a=deg*Math.PI/180;const x=cx+Math.cos(a)*Rr,y=cy+Math.sin(a)*Rr;const lit=Math.cos(head-a)>0.9;g.fillStyle=rgba(col,lit?1:0.6);g.beginPath();g.arc(x,y,lit?14:10,0,7);g.fill();text(s,x+Math.cos(a)*48,y+Math.sin(a)*48+8,26,rgba(col,1),'center',600,2)});
  text('物理世界',cx,cy+10,30,'#e9eef9','center',600,4);vignette()}

// ---------- 20 东城：7×24 ----------
function sceneDongcheng(t){(typeof DC!=="undefined"&&DC)?sceneDCReal(t):sceneCity(t);const lt=LT(t);const cx=1640,cy=300,r=120;const a=clamp(lt/0.8);
  g.globalAlpha=a;g.fillStyle='rgba(5,7,15,0.6)';g.beginPath();g.arc(cx,cy,r+48,0,7);g.fill();
  g.strokeStyle='rgba(147,160,186,0.3)';g.lineWidth=14;g.beginPath();g.arc(cx,cy,r,0,7);g.stroke();
  const arc=(h0,h1,col,rr,w)=>{g.strokeStyle=col;g.lineWidth=w;g.beginPath();g.arc(cx,cy,rr,(h0/24)*6.283-1.5708,(h1/24)*6.283-1.5708);g.stroke()};
  arc(9,11,'rgba(255,111,181,0.9)',r,14);arc(14.5,16.5,'rgba(255,111,181,0.9)',r,14);
  const k=clamp((lt-2.5)/4);if(k>0)arc(0,24*ease(k),'rgba(95,224,176,0.95)',r-22,10);
  for(const h of [0,6,12,18]){const an=h/24*6.283-1.5708;text(String(h),cx+Math.cos(an)*(r+30),cy+Math.sin(an)*(r+30)+7,18,'#93a0ba','center')}
  text('24 h',cx,cy+8,24,'#e9eef9','center',600);
  icon('walk',cx-40,cy+r+80,30,C_CAM,1);if(k>0)icon('cam',cx+40,cy+r+80,30,C_SEN,1);g.globalAlpha=1}

// ---------- 21 南京：直接问现实 ----------
function sceneAsk(t){bg();const lt=LT(t);const q='钟山景区，现在人多吗？';const n=Math.floor(clamp(lt/2.2)*q.length);
  g.fillStyle='rgba(233,238,249,0.08)';g.strokeStyle='rgba(233,238,249,0.35)';g.lineWidth=1.2;g.beginPath();g.roundRect(200,200,700,96,48);g.fill();g.stroke();
  text(q.slice(0,n)+(n<q.length&&Math.sin(t*12)>0?'▍':''),250,262,34,'#e9eef9','left',500,1);
  const a=clamp((lt-2.8)/1);if(a>0){g.globalAlpha=a;
    // scenic area map: contour rings + crowd heat
    const mx=1300,my=480;for(let i=1;i<=9;i++){g.strokeStyle=`rgba(93,104,130,${0.15+i*0.03})`;g.beginPath();g.ellipse(mx+Math.sin(i)*14,my,60+i*34,40+i*24,0.3,0,7);g.stroke()}
    const r=rng(12);g.globalCompositeOperation='lighter';for(let i=0;i<420;i++){const u=r()*6.283,rr=Math.pow(r(),0.6)*230;const x=mx+Math.cos(u)*rr*1.3,y=my+Math.sin(u)*rr*0.8;const c=R.density(clamp(0.9-rr/300));g.fillStyle=rgba(c,0.85);g.fillRect(x,y,3,3)}g.globalCompositeOperation='source-over';
    text('钟山风景区 · 实时',mx-280,my-250,22,'#93a0ba','left',500,2);
    // answer card
    const x0=200,y0=400,w=700,h=380;g.fillStyle='rgba(23,32,39,0.85)';g.strokeStyle='rgba(111,201,192,0.5)';g.beginPath();g.roundRect(x0,y0,w,h,16);g.fill();g.stroke();
    text('人流 · 适中',x0+36,y0+64,34,'#6fc9c0','left',600,2);text('预计 30 分钟后走高，建议现在出发',x0+36,y0+108,22,'#c9d2e3','left',400);
    const cx0=x0+36,cx1=x0+w-36,cy0=y0+150,cy1=y0+h-50;const f=u=>0.25+0.5*Math.exp(-((u-0.62)**2)/0.03)+0.1*Math.sin(u*9);const now=0.5;
    g.strokeStyle='rgba(111,201,192,0.95)';g.lineWidth=2.5;g.beginPath();for(let i=0;i<=100*now;i++){const u=i/100;const X=lerp(cx0,cx1,u),Y=lerp(cy1,cy0,f(u));i?g.lineTo(X,Y):g.moveTo(X,Y)}g.stroke();
    g.setLineDash([7,6]);g.beginPath();for(let i=100*now;i<=100;i++){const u=i/100;const X=lerp(cx0,cx1,u),Y=lerp(cy1,cy0,f(u));i===100*now?g.moveTo(X,Y):g.lineTo(X,Y)}g.stroke();g.setLineDash([]);
    const nx=lerp(cx0,cx1,now);g.strokeStyle='rgba(233,238,249,0.6)';g.beginPath();g.moveTo(nx,cy0-10);g.lineTo(nx,cy1);g.stroke();text('此刻',nx,cy1+30,18,'#e9eef9','center',500);text('今天 8:00',cx0,cy1+30,16,'#93a0ba');text('18:00',cx1,cy1+30,16,'#93a0ba','right');
    g.globalAlpha=1}
  vignette()}

// ---------- 22 / outro 接入现实：训练阶段 ----------
function sceneAGI(t){bg();const lt=LT(t);camGlobe(100+t*1.0,20,3.6+0.9*ease(clamp(lt/10)));const {cdir}=globeBase(1.2);g.globalCompositeOperation='lighter';
  drawGroundPts(t,cdir,1,0.9);drawSats(t,cdir,32,6,0.8);drawSources(t,cdir,0.6,70);
  const tilt=0.42,Rr=1.55;const pts=[];for(let j=0;j<=160;j++){const u=j/160*6.283;pts.push([Math.cos(u)*Rr,Math.sin(u)*Math.sin(tilt)*Rr,Math.sin(u)*Math.cos(tilt)*Rr])}
  g.strokeStyle='rgba(233,238,249,0.35)';g.lineWidth=1.4;g.beginPath();pts.forEach((v,j)=>{const p=proj(v);j?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1])});g.stroke();
  for(let q=0;q<4;q++){const u=(t*0.25+q/4)*6.283;const v=[Math.cos(u)*Rr,Math.sin(u)*Math.sin(tilt)*Rr,Math.sin(u)*Math.cos(tilt)*Rr];const p=proj(v);const col=[C_CAM,C_NET,C_SAT,C_SEN][q];g.fillStyle=rgba(col,1);g.beginPath();g.arc(p[0],p[1],5,0,7);g.fill()}
  g.globalCompositeOperation='source-over';vignette()}

Object.assign(SC,{index:sceneIndex,taishan:sceneTaishan,parking:sceneParking,dark:sceneDark,wake:sceneWake,layers:sceneLayers,base:sceneBase,experts:sceneExperts,tokens:sceneTokens,loop:sceneLoop,dongcheng:sceneDongcheng,ask:sceneAsk,agi:sceneAGI});
