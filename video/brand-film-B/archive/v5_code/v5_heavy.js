// ===== 第五版 · 四个重镜头 =====
// ---------- 通用：饱满的地球 ----------
function earthRich(cdir,opt={}){const c0=proj([0,0,0]);if(!c0)return;
  const R0=(()=>{const p=proj(norm(cross(cdir,[0,1,0])));return p?Math.hypot(p[0]-c0[0],p[1]-c0[1]):0})();
  // atmosphere: three layered halos
  g.globalCompositeOperation='lighter';
  for(const [k,a] of [[1.02,0.32],[1.08,0.22],[1.22,0.12]]){const gr=g.createRadialGradient(c0[0],c0[1],R0*0.96,c0[0],c0[1],R0*k*1.08);gr.addColorStop(0,`rgba(80,150,255,${a})`);gr.addColorStop(1,'rgba(80,150,255,0)');g.fillStyle=gr;g.beginPath();g.arc(c0[0],c0[1],R0*k*1.1,0,7);g.fill()}
  g.globalCompositeOperation='source-over';
  const gr=g.createRadialGradient(c0[0]-R0*.35,c0[1]-R0*.4,R0*.05,c0[0],c0[1],R0);gr.addColorStop(0,'#123049');gr.addColorStop(0.7,'#0a1a2b');gr.addColorStop(1,'#050c16');g.fillStyle=gr;g.beginPath();g.arc(c0[0],c0[1],R0,0,7);g.fill();
  // graticule
  g.strokeStyle='rgba(79,127,184,0.10)';g.lineWidth=1;for(let la=-60;la<=60;la+=20){const p=[];for(let lo=-180;lo<=180;lo+=4)p.push(ll(la,lo,1.001));poly(p,'rgba(79,127,184,0.10)',1)}for(let lo=-180;lo<180;lo+=20){const p=[];for(let la=-80;la<=80;la+=4)p.push(ll(la,lo,1.001));poly(p,'rgba(79,127,184,0.10)',1)}
  // land: dense, lit by a soft key light
  const key=norm([0.4,0.6,0.7]);for(const [la,lo] of D.land){const v=ll(la,lo);const fd=dot(v,cdir);if(fd<0.03)continue;const p=proj(v);if(!p)continue;const lit=0.35+0.65*Math.max(0,dot(v,key));g.fillStyle=`rgba(${(95+60*lit)|0},${(112+70*lit)|0},${(140+80*lit)|0},${(0.25+0.6*fd)*(opt.land??1)})`;const s=1.6+1.4*fd;g.fillRect(p[0],p[1],s,s)}
  return {c0,R0}}
function cityLights(T,cdir,a=1,size=1){g.globalCompositeOperation='lighter';const G=D.global;for(let i=0;i<G.length;i++){const v=ll(G[i][0],G[i][1],1.002);const fd=dot(v,cdir);if(fd<0.05)continue;const p=proj(v);if(!p)continue;const tw=0.7+0.3*Math.sin(T*2+i*0.37);g.fillStyle=`rgba(255,${190+(i%5)*12},${120+(i%7)*15},${0.32*fd*tw*a})`;const s=(1.4+1.2*fd)*size;g.fillRect(p[0]-s/2,p[1]-s/2,s,s)}g.globalCompositeOperation='source-over'}

// ---------- 镜 7：三十二颗卫星，把地球「涂满」 ----------
const SHELL=1.24; // visual orbit radius (exaggerated altitude for space)
function satPos(e,ts){const s=sat(e,ts);return norm(s.v).map(x=>x*SHELL)}
function shotSats(t){bg();const lt=LT(t);const D7=7.0;
  // camera: wide orbit of the shell, then glide alongside one satellite
  const hero=SSO[5];const ts=lt*95;const hp=satPos(hero,ts);const hv=norm(sub(satPos(hero,ts+20),hp));const up=norm(hp);
  const k=ease(clamp((lt-3.0)/3.4));
  const wide=ll(26+lt*1.2,100+lt*3,3.6);const near=[0,1,2].map(i=>hp[i]+up[i]*0.10-hv[i]*0.32+norm(cross(up,hv))[i]*0.12);
  const cam=[0,1,2].map(i=>lerp(wide[i],near[i],k));const tgt=[0,1,2].map(i=>lerp(0,hp[i]+hv[i]*0.2-up[i]*0.15,k));setCam(cam,tgt,lerp(36,48,k));
  const cdir=norm(M.p);earthRich(cdir);cityLights(t,cdir,0.6);
  // swath mosaic: every satellite paints its ground strip; the earth fills up
  g.globalCompositeOperation='lighter';const HW=0.028;
  for(let i=0;i<32;i++){const e=SSO[i];const steps=Math.floor(10+70*clamp(lt/D7));for(let s=0;s<steps;s++){const t0=ts-s*28,t1=t0-28;const a=norm(sat(e,t0).v),b=norm(sat(e,t1).v);const side=norm(cross(a,sub(b,a)));const q=[a.map((x,j)=>(x+side[j]*HW)*1.0015),a.map((x,j)=>(x-side[j]*HW)*1.0015),b.map((x,j)=>(x-side[j]*HW)*1.0015),b.map((x,j)=>(x+side[j]*HW)*1.0015)];if(dot(a,cdir)<0.02)continue;const P=q.map(proj);if(P.some(x=>!x))continue;const age=s/steps;g.fillStyle=`rgba(255,${200-60*age|0},${110-60*age|0},${0.22*(1-age*0.6)})`;g.beginPath();P.forEach((p,j)=>j?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill()}}
  // orbit shell hint + orbits
  for(let i=0;i<32;i++){const e=SSO[i];const pts=[];for(let s=-40;s<=4;s++)pts.push(satPos(e,ts+s*40));g.strokeStyle='rgba(255,212,92,0.16)';g.lineWidth=1.2;g.beginPath();let on=false;for(const v of pts){const p=proj(v);if(!p||occluded(v)){on=false;continue}on?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]);on=true}g.stroke()}
  // imaging cones from each satellite to the ground
  for(let i=0;i<32;i++){const e=SSO[i];const sp=satPos(e,ts);if(occluded(sp))continue;const gp=norm(sp);const p=proj(sp);if(!p)continue;const side=norm(cross(gp,[0,1,0]));const fw=norm(cross(side,gp));
    const cs=[[1,1],[1,-1],[-1,-1],[-1,1]].map(([a,b])=>proj(gp.map((x,j)=>(x+side[j]*HW*a+fw[j]*HW*0.7*b)*1.002)));if(cs.some(x=>!x))continue;
    const gr=g.createLinearGradient(p[0],p[1],(cs[0][0]+cs[2][0])/2,(cs[0][1]+cs[2][1])/2);gr.addColorStop(0,'rgba(255,212,92,0.32)');gr.addColorStop(1,'rgba(255,212,92,0.04)');g.fillStyle=gr;g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(cs[0][0],cs[0][1]);g.lineTo(cs[1][0],cs[1][1]);g.closePath();g.fill();g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(cs[2][0],cs[2][1]);g.lineTo(cs[3][0],cs[3][1]);g.closePath();g.fill();
    g.strokeStyle='rgba(255,220,130,0.9)';g.lineWidth=1.4;g.beginPath();cs.forEach((c,j)=>j?g.lineTo(c[0],c[1]):g.moveTo(c[0],c[1]));g.closePath();g.stroke()}
  g.globalCompositeOperation='source-over';
  // the 32 satellites as lit 3D models, far ones first
  const sun=norm([0.5,0.7,0.5]);const list=[...Array(32)].map((_,i)=>{const sp=satPos(SSO[i],ts);return [Math.hypot(...sub(sp,M.p)),i,sp]}).sort((a,b)=>b[0]-a[0]);
  for(const [d,i,sp] of list){if(occluded(sp))continue;const up2=norm(sp),vel=norm(sub(satPos(SSO[i],ts+20),sp)),wing=norm(cross(vel,up2));const sc=0.03;drawSatModel(sp,wing,up2,vel,sc,sun);
    const p=proj(sp);if(p){g.globalCompositeOperation='lighter';const gg=g.createRadialGradient(p[0],p[1],0,p[0],p[1],26);gg.addColorStop(0,'rgba(255,230,160,0.55)');gg.addColorStop(1,'rgba(255,230,160,0)');g.fillStyle=gg;g.beginPath();g.arc(p[0],p[1],26,0,7);g.fill();g.globalCompositeOperation='source-over'}}
  // counter: number of satellites lit so far
  const n=Math.min(32,Math.floor(lt/0.08));countUp(n,'',C_SAT,clamp(lt/0.4)*(1-clamp((lt-3.2)/0.5)));
  vignette()}
function countUp(n,suffix,col,a){if(a<=0)return;text(n.toLocaleString('en-US')+suffix,120,980,96,rgba(col,a),'left',800,2)}

// ---------- 镜 8：六十万个感知点 → 每一个都是一只眼睛 ----------
function shotPoints(t){bg();const lt=LT(t);const k=ease(clamp((lt-1.6)/3.0));
  const dist=lerp(2.25,1.16,k);const lat=lerp(30,39.0,k),lon=lerp(102,116.4,k);camGlobe(lon,lat,dist);if(k>0.2){const f=M.f;const up=ll(39.9,116.4);const r=norm(cross(f,up));M.r=r;M.u=cross(r,f)}
  const cdir=norm(M.p);earthRich(cdir,{land:0.6});
  // each sensing point = a tiny light pillar; height grows, colour by density ramp
  g.globalCompositeOperation='lighter';const G=D.global;const grow=ease(clamp(lt/1.2));
  for(let i=0;i<G.length;i++){const [la,lo]=G[i];const v=ll(la,lo,1.0015);const fd=dot(v,cdir);if(fd<0.06)continue;const p=proj(v);if(!p)continue;const hgt=(0.004+0.012*((i*7919)%13)/13)*grow*clamp((dist-1.03)/0.7,0.08,1);const q=proj(ll(la,lo,1.0015+hgt));if(!q)continue;
    const c=i%9===0?[255,111,181]:[159,232,255];g.strokeStyle=rgba(c,0.5*fd);g.lineWidth=1.2;g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(q[0],q[1]);g.stroke();g.fillStyle=rgba(c,0.9*fd);g.fillRect(q[0]-1,q[1]-1,2.2,2.2)}
  g.globalCompositeOperation='source-over';
  const n=Math.round(600000*ease(clamp(lt/2.6)));countUp(n,'+',C_NET,clamp(lt/0.4)*(1-clamp((lt-3.6)/0.6)));
  vignette()}
// close-up layer for shot 8: points resolve into cameras with cones over a city (drawn in local city coords)
function shotEyes(t){const lt=LT(t);const az=-0.4+lt*0.05;const cam=()=>setCam([Math.sin(az)*6,4.2-0.8*clamp(lt/5),Math.cos(az)*6+2],[0.6,0,1.5],46);const save=cityCam;window.NOHERO=1;cityCam=cam;drawCityDC(t);cityCam=save;window.NOHERO=0;g.fillStyle='rgba(5,7,15,0.45)';g.fillRect(0,0,W,H);cam();
  g.globalCompositeOperation='lighter';
  for(const [x,z,hd] of DC.cams){const a=proj([x,0.03,z]);if(!a||a[2]<0.6)continue;const L=0.45,sp=0.5;const b=proj([x+Math.cos(hd-sp)*L,0.02,z+Math.sin(hd-sp)*L]),c=proj([x+Math.cos(hd+sp)*L,0.02,z+Math.sin(hd+sp)*L]);if(b&&c){const gg=g.createRadialGradient(a[0],a[1],0,a[0],a[1],Math.max(1,Math.hypot(b[0]-a[0],b[1]-a[1])));gg.addColorStop(0,'rgba(255,111,181,0.45)');gg.addColorStop(1,'rgba(255,111,181,0)');g.fillStyle=gg;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.lineTo(c[0],c[1]);g.closePath();g.fill()}
    const top=proj([x,0.12,z]);if(top){g.strokeStyle='rgba(255,170,215,0.6)';g.lineWidth=1;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(top[0],top[1]);g.stroke();const s=clamp(6/top[2],1.5,7);g.fillStyle='rgba(255,200,230,0.95)';g.fillRect(top[0]-s/2,top[1]-s/3,s,s*0.66)}}
  g.globalCompositeOperation='source-over';vignette()}

// ---------- 镜 10：所有画面落进同一个坐标 → 275 座城市 ----------
let C275=null;
function shotCoord(t){bg();const lt=LT(t);const lat0=33.5,lon0=112;const P=(la,lo,h=0)=>[(lo-lon0)*0.93,h,-(la-lat0)*1.1];
  const bj=P(39.9,116.4);const k=ease(clamp((lt-3.0)/2.6));
  const camA=[3,14,17],tgA=[3,0,-1.5];const camB=[bj[0]+0.9,1.6,bj[2]+2.2],tgB=[bj[0],0,bj[2]];setCam(camA.map((x,i)=>lerp(x,camB[i],k)),tgA.map((x,i)=>lerp(x,tgB[i],k)),lerp(36,46,k));
  for(const [la,lo,c] of D.landCN){const p=proj(P(la,lo));if(!p)continue;g.fillStyle=c?'rgba(140,220,255,1)':'rgba(105,125,165,0.75)';const s=clamp((c?48:34)/p[2],1.8,8);g.fillRect(p[0],p[1],s,s)}
  g.globalCompositeOperation='lighter';
  // three rains falling from three heights into the cities
  const r=rng(23);const fall=clamp(lt/2.6);for(let i=0;i<2400;i++){const c=C275[Math.floor(r()*C275.length)];const kind=i%3;const h0=[14,9,5][kind];const born=r()*2.2;const u=clamp((lt-born)/0.9);if(u<=0||u>=1)continue;const base=P(c[0],c[1]);const x=base[0]+(r()-.5)*0.6*(1-u),z=base[2]+(r()-.5)*0.6*(1-u);const y=lerp(h0,0.05,ease(u));const p=proj([x,y,z]);if(!p)continue;const col=[C_SAT,C_CAM,C_NET][kind];const q=proj([x,y+0.6*(1-u)+0.2,z]);if(q){g.strokeStyle=rgba(col,0.55);g.lineWidth=1.4;g.beginPath();g.moveTo(q[0],q[1]);g.lineTo(p[0],p[1]);g.stroke()}g.fillStyle=rgba(col,0.95);g.fillRect(p[0]-1.5,p[1]-1.5,3,3)}
  g.globalCompositeOperation='source-over';
  // 275 mini cities: little clusters of lit blocks that rise when the data lands
  const sun=norm([0.4,0.8,0.3]);const list=C275.map((c,i)=>[c,i,P(c[0],c[1])]).map(o=>[Math.hypot(o[2][0]-M.p[0],o[2][2]-M.p[2]),o]).sort((a,b)=>b[0]-a[0]);
  for(const [d,[c,i,b]] of list){const rise=ease(clamp((lt-0.6-(i%23)*0.06)/1.2));if(rise<=0)continue;const rr=rng(100+i);const nb=6+Math.min(14,Math.floor(c[2]/6));
    for(let j=0;j<nb;j++){const x=b[0]+(rr()-.5)*0.55,z=b[2]+(rr()-.5)*0.55,h=(0.06+rr()*0.35)*(0.6+c[2]/50)*rise,s=0.04+rr()*0.035;const col=R.altitude(lerp(2000,12000,clamp(h/0.35)));
      const top=[[x-s,h,z-s],[x+s,h,z-s],[x+s,h,z+s],[x-s,h,z+s]].map(proj),bot=[[x-s,0,z+s],[x+s,0,z+s]].map(proj);if(top.some(q=>!q)||bot.some(q=>!q))continue;
      g.fillStyle=rgba(col.map(v=>v*0.45),0.95);g.beginPath();g.moveTo(bot[0][0],bot[0][1]);g.lineTo(bot[1][0],bot[1][1]);g.lineTo(top[2][0],top[2][1]);g.lineTo(top[3][0],top[3][1]);g.closePath();g.fill();
      g.fillStyle=rgba(col,0.95);g.beginPath();top.forEach((q,k2)=>k2?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.closePath();g.fill()}
    const pc=proj([b[0],0.02,b[2]]);if(pc){g.globalCompositeOperation='lighter';const R2=clamp(40/pc[2],4,60);const gg=g.createRadialGradient(pc[0],pc[1],0,pc[0],pc[1],R2);gg.addColorStop(0,`rgba(111,201,192,${0.35*rise})`);gg.addColorStop(1,'rgba(111,201,192,0)');g.fillStyle=gg;g.beginPath();g.arc(pc[0],pc[1],R2,0,7);g.fill();g.globalCompositeOperation='source-over'}}
  const n=Math.min(275,Math.floor(275*clamp((lt-0.6)/2.2)));countUp(n,'',[111,201,192],clamp((lt-0.6)/0.4)*(1-clamp((lt-3.4)/0.5)));
  vignette()}

// ---------- 镜 11：感官各自分工，大脑统一预测 ----------
const BRAIN=(()=>{const r=rng(61);const n=2600;const P=[];for(let i=0;i<n;i++){const u=r()*2-1,a=r()*6.283,rr=Math.sqrt(1-u*u);const j=0.85+0.15*r();P.push([Math.cos(a)*rr*j,u*0.82*j,Math.sin(a)*rr*j])}const L=[];for(let i=0;i<700;i++){const a=Math.floor(r()*n);let best=-1,bd=9;for(let k=0;k<12;k++){const b=Math.floor(r()*n);const d=Math.hypot(...sub(P[a],P[b]));if(d>0.05&&d<bd){bd=d;best=b}}if(best>=0&&bd<0.45)L.push([a,best])}return{P,L}})();
const ORG=[{en:'SATELLITE',k:'sat',c:C_SAT,src:'sky',lens:[-4.6,4.6,-2.2]},{en:'CAMERA',k:'cam',c:C_CAM,src:'cams',lens:[4.6,3.6,-2.2]},{en:'SENSOR',k:'sense',c:C_SEN,src:'ground',lens:[-4.4,2.6,2.6]},{en:'INTERNET',k:'net',c:C_NET,src:'horizon',lens:[4.4,2.2,2.8]}];
const BC=[0.2,4.6,-0.8],BR=1.55;
function lensDraw(L,col,a,T){const p=proj(L);if(!p)return;const r=clamp(1500/p[2],60,230);g.globalCompositeOperation='lighter';
  const gg=g.createRadialGradient(p[0],p[1],r*0.2,p[0],p[1],r);gg.addColorStop(0,rgba(col,0.28*a));gg.addColorStop(0.75,rgba(col,0.10*a));gg.addColorStop(1,rgba(col,0));g.fillStyle=gg;g.beginPath();g.ellipse(p[0],p[1],r,r*0.42,0,0,7);g.fill();
  g.strokeStyle=rgba(col,0.9*a);g.lineWidth=2;g.beginPath();g.ellipse(p[0],p[1],r*0.82,r*0.34,0,0,7);g.stroke();g.lineWidth=1;g.strokeStyle=rgba(col,0.5*a);g.beginPath();g.ellipse(p[0],p[1],r*0.6,r*0.25,0,0,7);g.stroke();
  for(let i=0;i<24;i++){const an=i/24*6.283+T*0.6;const x=p[0]+Math.cos(an)*r*0.82,y=p[1]+Math.sin(an)*r*0.34;g.fillStyle=rgba(col,0.9*a);g.fillRect(x-1.5,y-1.5,3,3)}
  g.globalCompositeOperation='source-over';return {p,r}}
function shotExperts(t){const lt=LT(t);const a0=clamp(lt/1.0);
  // city underneath (real Dongcheng, dimmed), camera orbiting slowly
  const save=cityCam;window.NOHERO=1;cityCam=()=>{const az=-0.25+lt*0.03;setCam([Math.sin(az)*11,7.2-1.0*clamp(lt/12),Math.cos(az)*11],[0.2,3.4,-0.8],50)};drawCityDC(t);cityCam=save;window.NOHERO=0;
  g.fillStyle=`rgba(5,7,15,${0.55*a0})`;g.fillRect(0,0,W,H);
  g.globalCompositeOperation='lighter';
  const r=rng(77);
  ORG.forEach((o,oi)=>{const oa=a0*clamp(lt*1.1-oi*0.3);if(oa<=0)return;const L=o.lens;
    // raw storm: thousands of fine particles from the organ's source into its lens
    for(let i=0;i<1600;i++){let s;const q=r(),q2=r(),q3=r();
      if(o.src==='sky')s=[L[0]+(q-.5)*10,12+q2*5,L[2]+(q3-.5)*8];else if(o.src==='cams'){const c=DC.cams[Math.floor(q*DC.cams.length)];s=[c[0],0.05,c[1]]}else if(o.src==='ground')s=[(q-.5)*22,0.05,(q2-.5)*24];else s=[16+q2*6,0.5+q3*5,(q-.5)*20];
      const u=((t*0.35+i/1600+oi*0.21)%1);const e=ease(u);const p=proj([lerp(s[0],L[0],e),lerp(s[1],L[1],e),lerp(s[2],L[2],e)]);if(!p)continue;g.fillStyle=rgba(o.c,0.75*oa*(0.3+0.7*u));g.fillRect(p[0]-1.2,p[1]-1.2,2.4,2.4)}
    // refined crystals: few, bright, from lens to brain
    for(let i=0;i<10;i++){const u=((t*0.28+i/10+oi*0.17)%1);const e=ease(u);const v=[0,1,2].map(k=>lerp(L[k],BC[k]+(o.lens[k]-BC[k])*0.25,e));const p=proj(v);if(!p)continue;const s=clamp(90/p[2],5,14);g.fillStyle=rgba(o.c,0.95*oa);g.beginPath();g.moveTo(p[0],p[1]-s);g.lineTo(p[0]+s*0.6,p[1]);g.lineTo(p[0],p[1]+s);g.lineTo(p[0]-s*0.6,p[1]);g.closePath();g.fill()}
    g.globalCompositeOperation='source-over';lensDraw(L,o.c,oa,t);const lp=proj(L);if(lp){const fs=clamp(520/lp[2],18,40);text(o.en,lp[0],lp[1]+fs*0.35,fs,rgba(o.c,oa),'center',700,fs*0.28)}g.globalCompositeOperation='lighter'});
  // the brain: a big particle sphere with synapses, pulsing as crystals arrive
  const ba=a0*clamp((lt-1.2)/1.4);if(ba>0){const rot=t*0.25;const P=BRAIN.P.map(q=>{const x=q[0]*Math.cos(rot)-q[2]*Math.sin(rot),z=q[0]*Math.sin(rot)+q[2]*Math.cos(rot);return proj([BC[0]+x*BR,BC[1]+q[1]*BR,BC[2]+z*BR])});
    const pc=proj(BC);if(pc){const RR=clamp(BR*900/pc[2],60,420);const gg=g.createRadialGradient(pc[0],pc[1],0,pc[0],pc[1],RR*1.2);gg.addColorStop(0,`rgba(200,220,255,${0.28*ba})`);gg.addColorStop(1,'rgba(200,220,255,0)');g.fillStyle=gg;g.beginPath();g.arc(pc[0],pc[1],RR*1.2,0,7);g.fill()}
    g.lineWidth=0.8;for(const [a,b] of BRAIN.L){const p=P[a],q=P[b];if(!p||!q)continue;const fl=0.5+0.5*Math.sin(t*5+a);g.strokeStyle=`rgba(190,215,255,${0.22*ba*fl})`;g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(q[0],q[1]);g.stroke()}
    for(let i=0;i<P.length;i++){const p=P[i];if(!p)continue;const ps=2.6;const col=i%4===0?C_SAT:i%4===1?C_CAM:i%4===2?C_SEN:C_NET;const mix=0.6;const cc=[0,1,2].map(k=>lerp(233,col[k],mix*((i%3)/2)));g.fillStyle=rgba(cc,0.8*ba);g.fillRect(p[0]-ps/2,p[1]-ps/2,ps,ps)}}
  g.globalCompositeOperation='source-over';
  if(ba>0){const pc=proj(BC);if(pc)text('SeeMind',pc[0],pc[1]+12,40,`rgba(242,246,255,${ba})`,'center',800,3)}
  vignette()}
