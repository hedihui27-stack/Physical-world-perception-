// ===== 第五版 · 第二批：开场、泰山、停车场、点亮、三层空间、信源、预测验证段 =====
// ---------- 镜 0–1：数字地球（数不清的网页卡片） ----------
const CARDS=(()=>{const r=rng(5);const n=16000;const P=[];const ga=Math.PI*(3-Math.sqrt(5));for(let i=0;i<n;i++){const y=1-2*(i+.5)/n,rr=Math.sqrt(1-y*y),a=i*ga;const v=[Math.cos(a)*rr,y,Math.sin(a)*rr];P.push({v,j:[(r()-.5)*0.6,(r()-.5)*0.6,(r()-.5)*0.6],b:r(),w:0.6+r()*0.8,rot:(r()-.5)*1.2})}return P})();
function cardQuad(v,size,rot){const e=norm(cross([0,1,0],v).map((x,i)=>x+(i===0?1e-6:0)));const n2=cross(v,e);const c=Math.cos(rot),s=Math.sin(rot);const a=e.map((x,i)=>x*c+n2[i]*s),b=e.map((x,i)=>-x*s+n2[i]*c);const w=size,h=size*0.72;return[[-1,-1],[1,-1],[1,1],[-1,1]].map(([p,q])=>v.map((x,i)=>x+a[i]*w*p+b[i]*h*q))}
const BEAMS=[{n:'搜索',tilt:0.35,sp:0.55,c:[159,232,255]},{n:'推荐',tilt:-0.5,sp:-0.42,c:[255,212,92]},{n:'大模型',tilt:1.1,sp:0.33,c:[255,158,203]}];
function beamDir(b,T){const a=T*b.sp*1.4;const x=[Math.cos(a),0,Math.sin(a)];return norm([x[0],Math.sin(b.tilt)*x[2],Math.cos(b.tilt)*x[2]])}
function shotDigital(t){bg();const T=t;const form=ease(clamp(T/3.0));const org=clamp((T-5)/5);
  const az=0.4+T*0.06,dist=lerp(3.6,2.05,ease(clamp(T/11)));setCam([Math.sin(az)*dist,0.55*dist*0.4,Math.cos(az)*dist],[0,0,0],40);const cdir=norm(M.p);
  // inner glow core
  const c0=proj([0,0,0]);if(c0){g.globalCompositeOperation='lighter';const R0=clamp(900/dist,60,600)*form;const gg=g.createRadialGradient(c0[0],c0[1],0,c0[0],c0[1],R0*1.1);gg.addColorStop(0,'rgba(60,140,255,0.25)');gg.addColorStop(0.8,'rgba(60,140,255,0.10)');gg.addColorStop(1,'rgba(60,140,255,0)');g.fillStyle=gg;g.beginPath();g.arc(c0[0],c0[1],R0*1.1,0,7);g.fill()}
  g.globalCompositeOperation='lighter';const bd=BEAMS.map(b=>beamDir(b,T));const ba=clamp((T-4.2)/1.2);
  for(let i=0;i<CARDS.length;i++){const C=CARDS[i];const born=(i%97)/97*1.4;const f=ease(clamp((T-born*0.6)/2.2));if(f<=0)continue;
    // explode from a single point, then settle on the sphere (organised: jitter shrinks)
    const jit=(1-org)*0.06;const v=norm(C.v.map((x,k)=>x+C.j[k]*jit)).map(x=>x*(f*1.0));const fd=dot(norm(v),cdir);if(fd<-0.15)continue;
    let lit=0;if(ba>0)for(let k=0;k<3;k++){const d=Math.acos(clamp(dot(norm(v),bd[k]),-1,1));lit=Math.max(lit,Math.exp(-d*d/0.012)*ba)}
    const q=cardQuad(v,0.012*C.w,C.rot*(1-org));const P=q.map(proj);if(P.some(x=>!x))continue;const area=Math.abs((P[1][0]-P[0][0])*(P[3][1]-P[0][1]));if(area<0.5){const p=proj(v);g.fillStyle=`rgba(159,232,255,${0.25+0.4*fd})`;g.fillRect(p[0],p[1],1.3,1.3);continue}
    const base=0.10+0.22*C.b+0.25*Math.max(0,fd);const col=lit>0.05?[lerp(159,255,lit),lerp(232,255,lit),255]:[120+60*C.b,190+40*C.b,255];
    g.fillStyle=rgba(col,Math.min(0.95,base+lit*0.7));g.beginPath();P.forEach((p,k)=>k?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill();
    if(area>90){g.strokeStyle=rgba([220,240,255],0.35+0.4*lit);g.lineWidth=0.7;for(let l=1;l<4;l++){const a=[0,1].map(k=>lerp(P[0][k],P[3][k],l/4.2)),b=[0,1].map(k=>lerp(P[1][k],P[2][k],l/4.2));const bb=[0,1].map(k=>lerp(a[k],b[k],0.4+0.5*((i*l)%7)/7));g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(bb[0],bb[1]);g.stroke()}}}
  // three beams sweeping around the sphere
  if(ba>0)BEAMS.forEach((b,k)=>{const d=bd[k];const pts=[];for(let s=-30;s<=30;s++){const a=s/30*0.9;const ax=norm(cross(d,[0,1,0]));const v=d.map((x,i)=>x*Math.cos(a)+ax[i]*Math.sin(a)).map(x=>x*1.06);pts.push(proj(v))}
    for(let w=0;w<3;w++){g.strokeStyle=rgba(b.c,(0.35-w*0.1)*ba);g.lineWidth=3+w*7;g.beginPath();let on=false;for(const p of pts){if(!p){on=false;continue}on?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]);on=true}g.stroke()}
    const lp=proj(d.map(x=>x*1.12));if(lp){g.globalCompositeOperation='source-over';text(b.n,lp[0],lp[1],26,rgba(b.c,ba),'center',700,3);g.globalCompositeOperation='lighter'}});
  g.globalCompositeOperation='source-over';vignette()}
// ---------- 镜 4：卡片外壳剥落，露出暗着的真实地球 ----------
function shotPeel(t){bg();const lt=LT(t);const dist=2.15+0.6*ease(clamp(lt/3));const az=0.4+(t)*0.06;setCam([Math.sin(az)*dist,0.55*dist*0.4,Math.cos(az)*dist],[0,0,0],40);const cdir=norm(M.p);
  earthRich(cdir,{land:0.55});
  g.globalCompositeOperation='lighter';const peel=ease(clamp(lt/2.4));for(let i=0;i<CARDS.length;i+=2){const C=CARDS[i];const out=1+peel*(0.4+C.b*1.6);const v=C.v.map(x=>x*out*1.01);const fd=dot(norm(v),cdir);if(fd<-0.1)continue;const p=proj(v);if(!p)continue;const a=(1-peel)*0.6+0.15*(1-peel*0.8);g.fillStyle=`rgba(159,232,255,${a*(0.3+0.5*Math.max(0,fd))})`;const s=clamp(6/p[2],1,4);g.fillRect(p[0]-s/2,p[1]-s/2,s*1.3,s)}
  g.globalCompositeOperation='source-over';vignette()}
// ---------- 镜 2：泰山（饱满地形 + 不确定的云海） ----------
function shotTaishan(t){bg();const lt=LT(t);const az=-0.55+lt*0.045;const d=8.2-1.2*ease(clamp(lt/5.7));setCam([Math.sin(az)*d,3.6,Math.cos(az)*d],[0.2,1.0,-0.3],42);
  const key=norm([-0.5,0.8,0.4]);const N=46,S=0.2;const H=(x,z)=>ridge(x,z)*1.15;const quads=[];
  for(let zi=-N/2;zi<N/2;zi++)for(let xi=-N*0.6;xi<N*0.6;xi++){const x=xi*S,z=zi*S;const v=[[x,H(x,z),z],[x+S,H(x+S,z),z],[x+S,H(x+S,z+S),z+S],[x,H(x,z+S),z+S]];const nx=v[0][1]-v[1][1],nz=v[0][1]-v[3][1];const n=norm([nx,S,nz]);const c=v.reduce((a,p)=>[a[0]+p[0]/4,a[1]+p[1]/4,a[2]+p[2]/4],[0,0,0]);quads.push([Math.hypot(...sub(c,M.p)),v,n,c[1]])}
  quads.sort((a,b)=>b[0]-a[0]);
  for(const [dd,v,n,h] of quads){const P=v.map(proj);if(P.some(x=>!x))continue;const lit=0.25+0.75*Math.max(0,dot(n,key));const c=R.altitude(h*5200);const col=c.map(x=>x*(0.35+0.65*lit));g.fillStyle=rgba(col,0.95);g.beginPath();P.forEach((p,k)=>k?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill();g.strokeStyle=rgba(c,0.18+0.25*clamp(h/1.6));g.lineWidth=0.6;g.stroke()}
  // known: summit pin (bright, certain)
  const top=[0.2,H(0.2,-0.3),-0.3];const p0=proj(top),p1=proj([top[0],top[1]+0.9,top[2]]);if(p0&&p1){g.globalCompositeOperation='lighter';g.strokeStyle='rgba(233,238,249,0.95)';g.lineWidth=2.5;g.beginPath();g.moveTo(p0[0],p0[1]);g.lineTo(p1[0],p1[1]);g.stroke();const gg=g.createRadialGradient(p1[0],p1[1],0,p1[0],p1[1],30);gg.addColorStop(0,'rgba(255,255,255,0.9)');gg.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gg;g.beginPath();g.arc(p1[0],p1[1],30,0,7);g.fill();g.globalCompositeOperation='source-over';text('泰山',p1[0]+22,p1[1]+10,34,'#f2f6ff','left',700,3)}
  // unknown: a thick layer of flickering noise where the sea of clouds would be
  const ua=clamp((lt-1.4)/1.0);if(ua>0){g.globalCompositeOperation='lighter';const r=rng(8);for(let i=0;i<9000;i++){const u=r()*6.283,rr=Math.sqrt(r());const x=0.2+Math.cos(u)*4.0*rr,z=-0.3+Math.sin(u)*2.8*rr,y=1.45+(r()-.5)*0.4;const p=proj([x,y,z]);if(!p)continue;const fl=Math.sin(t*(7+r()*9)+i)>0.2?1:0;if(!fl)continue;const s=clamp(5/p[2],1,3);g.fillStyle=`rgba(${190+r()*60|0},${210+r()*40|0},255,${0.7*ua})`;g.fillRect(p[0],p[1],s*2,s*2)}g.globalCompositeOperation='source-over';
    const q=proj([3.2,1.6,-0.3]);if(q)text('云海 ?',q[0]+10,q[1],44,`rgba(159,232,255,${ua*(0.55+0.45*Math.sin(t*6))})`,'left',700,3)}
  vignette()}
// ---------- 镜 3：停车场（车位空满不断变化，地图标记不动） ----------
function shotParking(t){bg();const lt=LT(t);setCam([1.5+lt*0.12,8.4-1.2*ease(clamp(lt/6.9)),6.8],[0,0,0.4],46);
  const cols=26,rows=10,sw=0.36,sd=0.82;const ox=-cols*sw/2,oz=-rows*sd/2;const clock=lt*260; // seconds of simulated time per real second
  const quad=(pts,fill,stroke,lw=1)=>{const P=pts.map(proj);if(P.some(x=>!x))return;g.beginPath();P.forEach((p,k)=>k?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();if(fill){g.fillStyle=fill;g.fill()}if(stroke){g.strokeStyle=stroke;g.lineWidth=lw;g.stroke()}};
  quad([[ox-0.5,0,oz-0.6],[-ox+0.5,0,oz-0.6],[-ox+0.5,0,-oz+0.6],[ox-0.5,0,-oz+0.6]],'rgba(20,32,48,0.9)','rgba(93,104,130,0.7)',1.5);
  let occ=0;for(let ro=0;ro<rows;ro++)for(let c=0;c<cols;c++){const x=ox+c*sw,z=oz+ro*sd+(ro%2?0.08:0);quad([[x+0.02,0.001,z],[x+sw-0.02,0.001,z],[x+sw-0.02,0.001,z+0.66],[x+0.02,0.001,z+0.66]],null,'rgba(147,160,186,0.55)',1);
    const ph=((ro*31+c*17)%97)/97;const period=900+((ro*7+c*13)%11)*260;const on=Math.sin((clock/period+ph)*6.283)+0.25*Math.sin(clock/377+c)>(-0.2+0.8*Math.sin(clock/1500));if(!on)continue;occ++;
    const h=0.16,m=0.07;const col=[[74,168,255],[255,209,102],[233,238,249],[255,122,61],[95,224,176]][(ro+c)%5];const cx0=x+m,cx1=x+sw-m,cz0=z+0.08,cz1=z+0.58;
    quad([[cx0,h,cz0],[cx1,h,cz0],[cx1,h,cz1],[cx0,h,cz1]],rgba(col,0.85),rgba(col.map(v=>Math.min(255,v*1.2)),0.9));quad([[cx0,0,cz1],[cx1,0,cz1],[cx1,h,cz1],[cx0,h,cz1]],rgba(col.map(v=>v*0.45),0.9))}
  // static map pin: location known, state unknown
  const pin=[ox-0.8,0,-oz+0.2];const a=proj(pin),b=proj([pin[0],1.6,pin[2]]);if(a&&b){g.globalCompositeOperation='lighter';g.strokeStyle='rgba(233,238,249,0.9)';g.lineWidth=2.4;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke();const R2=46;const gg=g.createRadialGradient(b[0],b[1],0,b[0],b[1],R2);gg.addColorStop(0,'rgba(80,150,255,0.6)');gg.addColorStop(1,'rgba(80,150,255,0)');g.fillStyle=gg;g.beginPath();g.arc(b[0],b[1],R2,0,7);g.fill();g.globalCompositeOperation='source-over';icon('P',b[0],b[1],56,C_INK,1)}
  // fast-forward clock
  const cx=1640,cy=200,rr=96;g.strokeStyle='rgba(147,160,186,0.35)';g.lineWidth=10;g.beginPath();g.arc(cx,cy,rr,0,7);g.stroke();const prog=clamp(lt/6.4);g.strokeStyle='rgba(159,232,255,0.95)';g.beginPath();g.arc(cx,cy,rr,-1.5708,-1.5708+prog*6.283);g.stroke();
  const mins=Math.floor(prog*30);text('+'+mins+' min',cx,cy+12,34,'#e9eef9','center',700,1);
  vignette()}
// ---------- 镜 5：从北京荡开的光波，地球变成发光的数据地形 ----------
function shotWake(t){bg();const lt=LT(t);const lon=lerp(116,108,ease(clamp(lt/8.8))),lat=lerp(30,26,ease(clamp(lt/8.8)));camGlobe(lon,lat,lerp(2.05,2.5,ease(clamp(lt/8.8))));const cdir=norm(M.p);earthRich(cdir,{land:0.7});
  const c=ll(39.9,116.4);const wr=0.05+3.2*ease(clamp(lt/6.5));g.globalCompositeOperation='lighter';const G=D.global;
  for(let i=0;i<G.length;i++){const [la,lo]=G[i];const v=ll(la,lo,1.0015);const fd=dot(v,cdir);if(fd<0.06)continue;const dd=Math.acos(clamp(dot(v,c),-1,1));if(dd>wr)continue;const age=clamp((wr-dd)*4);const p=proj(v);if(!p)continue;const hgt=(0.006+0.02*((i*7919)%13)/13)*ease(age);const q=proj(ll(la,lo,1.0015+hgt));if(!q)continue;
    const col=i%9===0?[255,111,181]:[159,232,255];const fl=1+1.5*Math.exp(-(((wr-dd)*14)**2));g.strokeStyle=rgba(col,0.42*fd*fl);g.lineWidth=1.2;g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(q[0],q[1]);g.stroke();g.fillStyle=rgba(col,Math.min(1,0.85*fd*fl));g.fillRect(q[0]-1.1,q[1]-1.1,2.2,2.2)}
  // the wave front itself: a glowing ring sweeping the planet
  if(wr<3.1){const ax=norm(cross(c,[0,1,0])),ay=cross(ax,c);for(let w=0;w<3;w++){const pts=[];for(let i=0;i<=120;i++){const u=i/120*6.283;const d=Math.min(wr,3.1);pts.push([0,1,2].map(k=>(c[k]*Math.cos(d)+(ax[k]*Math.cos(u)+ay[k]*Math.sin(u))*Math.sin(d))*1.004))}poly(pts,`rgba(233,238,249,${0.5-w*0.15})`,2+w*6)}}
  g.globalCompositeOperation='source-over';vignette()}
// ---------- 镜 6：天、地、网三层空间，镜头从层间穿过 ----------
function shotShells(t){bg();const lt=LT(t);const d=lerp(4.6,1.55,ease(clamp(lt/8.2)));camGlobe(112-lt*1.6,24+lt*0.6,d);const cdir=norm(M.p);earthRich(cdir,{land:0.65});
  const a1=clamp(lt/1.2),a2=clamp((lt-1.4)/1.2),a3=clamp((lt-2.8)/1.2);
  // ground layer: light pillars
  g.globalCompositeOperation='lighter';const G=D.global;for(let i=0;i<G.length;i+=2){const [la,lo]=G[i];const v=ll(la,lo,1.0015);const fd=dot(v,cdir);if(fd<0.06)continue;const p=proj(v),q=proj(ll(la,lo,1.0015+0.01*a1));if(!p||!q)continue;const col=i%9===0?[255,111,181]:[159,232,255];g.strokeStyle=rgba(col,0.4*fd*a1);g.lineWidth=1.1;g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(q[0],q[1]);g.stroke()}
  // satellite shell: a translucent sphere at orbit height with orbits and satellites
  if(a2>0){const c0=proj([0,0,0]);const rim=proj(norm(cross(cdir,[0,1,0])).map(x=>x*SHELL));if(c0&&rim){const R0=Math.hypot(rim[0]-c0[0],rim[1]-c0[1]);const gg=g.createRadialGradient(c0[0],c0[1],R0*0.9,c0[0],c0[1],R0*1.02);gg.addColorStop(0,'rgba(255,212,92,0)');gg.addColorStop(0.92,`rgba(255,212,92,${0.10*a2})`);gg.addColorStop(1,'rgba(255,212,92,0)');g.fillStyle=gg;g.beginPath();g.arc(c0[0],c0[1],R0*1.02,0,7);g.fill()}
    const ts=t*90;for(let i=0;i<32;i++){const e=SSO[i];const pts=[];for(let s=-60;s<=0;s++)pts.push(satPos(e,ts+s*50));poly(pts,`rgba(255,212,92,${0.28*a2})`,1.3);const sp=satPos(e,ts);if(occluded(sp))continue;const p=proj(sp);if(!p)continue;const gg=g.createRadialGradient(p[0],p[1],0,p[0],p[1],16);gg.addColorStop(0,`rgba(255,235,170,${0.9*a2})`);gg.addColorStop(1,'rgba(255,235,170,0)');g.fillStyle=gg;g.beginPath();g.arc(p[0],p[1],16,0,7);g.fill()}}
  // information ring: 477 sources as a glowing belt far out, streaming cards inward
  if(a3>0){const srcs=srcRing(t,1.95);for(let i=0;i<srcs.length;i++){const s=srcs[i];const p=proj(s);if(!p)continue;{const gg=g.createRadialGradient(p[0],p[1],0,p[0],p[1],9);gg.addColorStop(0,`rgba(159,232,255,${0.9*a3})`);gg.addColorStop(1,'rgba(159,232,255,0)');g.fillStyle=gg;g.fillRect(p[0]-9,p[1]-9,18,18)}if(i%1===0){const u=((t*0.5+i*0.13)%1);const tgt=norm(s).map(x=>x*1.01);const v=s.map((x,k)=>lerp(x,tgt[k],ease(u)));const q=proj(v);if(q&&!occluded(v)){g.fillStyle=`rgba(200,240,255,${0.8*a3*(1-u*0.5)})`;g.fillRect(q[0]-3,q[1]-2,6,4)}}}}
  g.globalCompositeOperation='source-over';vignette()}
// ---------- 镜 9：477 个信源，事件卡片落地成波纹 ----------
function shotEvents(t){bg();const lt=LT(t);camGlobe(96-lt*2,22,lerp(2.9,2.4,ease(clamp(lt/5.3))));const cdir=norm(M.p);earthRich(cdir,{land:0.6});cityLights(t,cdir,0.5);
  g.globalCompositeOperation='lighter';const srcs=srcRing(t,1.85);for(const s of srcs){const p=proj(s);if(!p)continue;g.fillStyle='rgba(159,232,255,0.9)';g.fillRect(p[0]-2,p[1]-2,4,4)}
  const r=rng(11),cats=Object.values(EVT),G=D.global;for(let k=0;k<900;k++){const born=r()*6,life=2.6;const age=((t-born)%6+6)%6;const pt=G[Math.floor(r()*G.length)];const sp=srcs[Math.floor(r()*477)];if(age>life)continue;const v=ll(pt[0],pt[1],1.003);const fd=dot(v,cdir);if(fd<0.05)continue;const col=hex(cats[k%cats.length]);
    if(age<0.8){const u=ease(age/0.8);const mid=norm(v.map((x,i)=>x+sp[i])).map(x=>x*1.5);const b=[0,1,2].map(i=>(1-u)*(1-u)*sp[i]+2*(1-u)*u*mid[i]+u*u*v[i]);const p=proj(b);if(p){g.fillStyle=rgba(col,0.9);g.fillRect(p[0]-4,p[1]-3,8,6)}}
    else{const a=(age-0.8)/(life-0.8);const p=proj(v);if(!p)continue;g.strokeStyle=rgba(col,(1-a)*fd);g.lineWidth=2;g.beginPath();g.ellipse(p[0],p[1],4+a*40*fd,(4+a*40*fd)*0.6,0,0,7);g.stroke();g.fillStyle=rgba(col,fd);g.fillRect(p[0]-2,p[1]-2,4,4)}}
  g.globalCompositeOperation='source-over';const n=Math.round(30000*ease(clamp(lt/3.5)));countUp(n,'',C_NET,clamp(lt/0.4)*(1-clamp((lt-4.4)/0.5)));vignette()}

// ---------- 镜 14–17：高铁站广场的「时间世界」 ----------
const SQ=(()=>{const r=rng(14);const ped=[];for(let i=0;i<2400;i++){const route=Math.floor(r()*5);ped.push({route,ph:r(),sp:0.04+r()*0.06,off:(r()-.5)*0.5,lane:(r()-.5)*0.3})}
  const routes=[[[-4,2.6],[-1.6,-1.2]],[[4,2.6],[1.4,-1.5]],[[-4,-2.6],[-1.2,1.6]],[[4,-2.6],[1.8,1.3]],[[0,3.2],[0,-3.2]]];
  const blds=[[-3.4,-2.6,1.4,0.8,0.5],[3.2,-2.4,1.6,0.9,0.7],[0,-3.3,3.4,0.5,1.2],[-3.6,2.8,1.0,0.7,0.3],[3.4,2.9,1.2,0.6,0.35]];return{ped,routes,blds}})();
function pedPos(p,T,jit){const R2=SQ.routes[p.route];const u=((T*p.sp+p.ph)%1);const a=R2[0],b=R2[1];const dx=b[0]-a[0],dz=b[1]-a[1];const L=Math.hypot(dx,dz);const nx=-dz/L,nz=dx/L;return[a[0]+dx*u+nx*(p.lane+p.off*jit),a[1]+dz*u+nz*(p.lane+p.off*jit)]}
function drawSquare(y,T,blur,alpha,tint,dense=1){const col=tint||[109,215,190];const quad=(pts,fill,stroke)=>{const P=pts.map(proj);if(P.some(x=>!x))return;g.beginPath();P.forEach((p,k)=>k?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();if(fill){g.fillStyle=fill;g.fill()}if(stroke){g.strokeStyle=stroke;g.lineWidth=1.2;g.stroke()}};
  quad([[-4.4,y,-3.6],[4.4,y,-3.6],[4.4,y,3.6],[-4.4,y,3.6]],rgba(col,0.06*alpha),rgba(col,0.55*alpha));
  for(let i=-4;i<=4;i++){const a=proj([i,y,-3.6]),b=proj([i,y,3.6]);if(a&&b){g.strokeStyle=rgba(col,0.08*alpha);g.lineWidth=1;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke()}}
  for(const [x,z,w,dd,h] of SQ.blds){const hh=h*(1-blur*0.5);quad([[x-w/2,y+hh,z-dd/2],[x+w/2,y+hh,z-dd/2],[x+w/2,y+hh,z+dd/2],[x-w/2,y+hh,z+dd/2]],rgba(col.map(v=>v*0.6),0.55*alpha),rgba(col,0.7*alpha));quad([[x-w/2,y,z+dd/2],[x+w/2,y,z+dd/2],[x+w/2,y+hh,z+dd/2],[x-w/2,y+hh,z+dd/2]],rgba(col.map(v=>v*0.3),0.6*alpha))}
  g.globalCompositeOperation='lighter';const n=Math.floor(SQ.ped.length*dense);for(let i=0;i<n;i++){const p=SQ.ped[i];const [x,z]=pedPos(p,T,1+blur*6);const jx=blur*Math.sin(i*12.9+T)*0.25,jz=blur*Math.cos(i*7.1+T)*0.25;const q=proj([x+jx,y+0.03,z+jz]);if(!q)continue;const s=clamp(9/q[2],1.2,4)*(1+blur*1.4);g.fillStyle=rgba(col.map(v=>Math.min(255,v*1.25)),(0.75-blur*0.45)*alpha);g.fillRect(q[0]-s/2,q[1]-s/2,s,s)}g.globalCompositeOperation='source-over'}
const LAY=[[0,'此刻',0],[1.5,'+5 分钟',0.2],[3.0,'+30 分钟',0.5],[4.5,'+1 小时',0.85]];
function shotPredict(t){bg();const lt=LT(t);const az=0.7-lt*0.03;setCam([Math.sin(az)*10.5,5.2+lt*0.12,Math.cos(az)*10.5],[0,2.3,0],42);
  LAY.forEach(([y,lbl,bl],i)=>{const a=clamp((lt-0.3-i*1.0)/0.9);if(a<=0)return;drawSquare(y,t+i*0.6,bl,a,i===0?[109,215,190]:[111,170,230]);const lp=proj([4.6,y,-3.6]);if(lp)text(lbl,lp[0]+12,lp[1]+8,26,`rgba(233,238,249,${a})`,'left',600,2)});
  vignette()}
function shotMatch(t){bg();const lt=LT(t);const az=0.45;setCam([Math.sin(az)*9.5,5.6,Math.cos(az)*9.5],[0,0.8,0],42);const fall=ease(clamp(lt/2.2));
  drawSquare(0,t,0,1,[109,215,190]);const gy=lerp(3.0,0.02,fall);drawSquare(gy,t+0.01,0.25*(1-fall),0.8,[111,170,230],0.7);
  if(fall>0.6){g.globalCompositeOperation='lighter';const r=rng(3);for(let i=0;i<800;i++){const p=SQ.ped[i];const [x,z]=pedPos(p,t,1);const q=proj([x,0.04,z]);if(!q)continue;const ok=r()<0.86;const col=ok?[90,160,255]:[255,110,110];const s=clamp(14/q[2],2,6);const gg=g.createRadialGradient(q[0],q[1],0,q[0],q[1],s*2.4);gg.addColorStop(0,rgba(col,0.95*(fall-0.6)/0.4));gg.addColorStop(1,rgba(col,0));g.fillStyle=gg;g.beginPath();g.arc(q[0],q[1],s*2.4,0,7);g.fill()}g.globalCompositeOperation='source-over'}
  vignette()}
// 镜 16：四个时间世界前后排开，「此刻」走到哪一层，哪一层就和现实合拢、封存
function shotTimeWorlds(t){bg();const lt=LT(t);const flyZ=lerp(9,-13,ease(clamp(lt/6.9)));setCam([2.6,3.4,flyZ+6.5],[0,0.2,flyZ-4],52);
  const gaps=[0,-6.5,-13,-19.5];LAY.forEach(([_,lbl,bl],i)=>{const z0=gaps[i];const reach=clamp((lt-0.8-i*1.5)/0.8);const save=M;
    // translate world: draw square at z offset by temporarily shifting the camera
    const off=[0,0,z0];const P0=M.p;M={...M,p:[P0[0]-off[0],P0[1]-off[1],P0[2]-off[2]]};
    const merged=reach>=1;drawSquare(0,t+i*0.6,bl*(1-reach),1,merged?[90,160,255]:(i===0?[109,215,190]:[111,170,230]),0.8);
    if(reach>0){g.globalCompositeOperation='lighter';const r=rng(40+i);for(let k=0;k<500;k++){const p=SQ.ped[k];const [x,z]=pedPos(p,t+i*0.6,1);const q=proj([x,0.05,z]);if(!q)continue;const ok=r()<0.84;const col=ok?[90,160,255]:[255,110,110];const s=clamp(12/q[2],1.5,5);g.fillStyle=rgba(col,0.7*reach);g.fillRect(q[0]-s,q[1]-s,s*2,s*2)}g.globalCompositeOperation='source-over';
      if(merged){const c=[[-4.5,-0.02,-3.7],[4.5,-0.02,-3.7],[4.5,-0.02,3.7],[-4.5,-0.02,3.7]].map(proj);if(c.every(x=>x)){g.strokeStyle='rgba(90,160,255,0.95)';g.lineWidth=3;g.beginPath();c.forEach((p,k)=>k?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.stroke()}}}
    const lp=proj([-4.6,0.1,3.6]);if(lp)text(lbl,lp[0],lp[1]-14,30,merged?'rgba(150,200,255,1)':'rgba(233,238,249,0.9)','left',700,2);M=save});
  vignette()}
// 镜 17：预测的世界与真实世界的重影，随接入越多越吻合；文字世界始终模糊
function shotConverge(t){bg();const lt=LT(t);const az=0.55+lt*0.02;setCam([Math.sin(az)*12.5,6.0,Math.cos(az)*12.5],[0,0.6,0],42);
  const conv=ease(clamp(lt/4.6));const off=(1-conv)*0.9;
  const save=M;drawSquare(0,t,0,1,[109,215,190]);M={...save,p:[save.p[0]-off,save.p[1],save.p[2]-off*0.6]};drawSquare(0,t+0.3*(1-conv),0.6*(1-conv),0.7,[111,170,230],0.8);M=save;
  // cities connecting: a row of lights filling up
  const n=Math.floor(1+40*conv);for(let i=0;i<42;i++){const x=200+i*36,y=1000;const on=i<n;g.fillStyle=on?'rgba(111,201,192,0.95)':'rgba(93,104,130,0.4)';g.beginPath();g.arc(x,y,on?7:5,0,7);g.fill()}
  // the world made of text: no reality to check against, stays blurred
  const ta=clamp((lt-3.6)/0.8);if(ta>0){const cx=1500,cy=400;const r=rng(9);g.font='500 22px "Noto Sans CJK SC"';for(let i=0;i<520;i++){const a=r()*6.283,rr=Math.sqrt(r())*250;const x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr*0.8;const ch='文字语料网页知识'.charAt(i%8);for(let k=0;k<3;k++){g.fillStyle=`rgba(200,205,220,${0.12*ta})`;g.fillText(ch,x+(k-1)*3,y+(k%2)*2)}}}
  vignette()}
// ---------- 镜 18：双飞轮 ----------
function shotFlywheel(t){bg();const lt=LT(t);setCam([0,3.0,9.2],[0,0,0],44);g.globalCompositeOperation='lighter';
  const wheel=(cx,rot,col,lbl)=>{const R2=2.6,r2=0.55;for(let i=0;i<4200;i++){const u=i/4200*6.283*7,v=i*2.399;const th=u/7+rot;const x=cx+(R2+r2*Math.cos(v))*Math.cos(th),y=(R2+r2*Math.cos(v))*Math.sin(th)*0.95,z=r2*Math.sin(v);const p=proj([x,y,z]);if(!p)continue;const b=0.5+0.5*Math.cos(th*3-t*4);g.fillStyle=rgba(col,0.25+0.55*b);g.fillRect(p[0]-1.4,p[1]-1.4,2.8,2.8)}const p=proj([cx,0,0]);if(p){g.globalCompositeOperation='source-over';text(lbl,p[0],p[1]+12,34,rgba(col,1),'center',800,4);g.globalCompositeOperation='lighter'}};
  wheel(-2.35,t*1.1,[255,212,92],'ACT');wheel(2.35,-t*1.1,[111,201,192],'LEARN');
  for(let k=0;k<60;k++){const u=((t*0.5+k/60)%1);const a=u*6.283;const x=Math.cos(a)>0?2.35+2.6*Math.cos(a+Math.PI):-2.35+2.6*Math.cos(a);const y=2.6*Math.sin(a)*0.95;const p=proj([x*0.5,y*0.25,1]);}
  g.globalCompositeOperation='source-over';vignette()}
