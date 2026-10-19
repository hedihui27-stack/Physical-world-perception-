// ===== 一镜到底样片：地球 → 中国 → 北京 → 路口摄像头 → 画面 → 向量空间 =====
let WS=null;const BJ=[39.92,116.40];
const OCOL=[[255,212,92],[255,169,77],[255,122,107]];
function satsReal(ts){const out=[];for(const e of WS.sats){const s=sat(e,ts);out.push(s)}return out}
// ---- camera path (globe part) ----
function globeCam(T){const k1=ease(clamp(T/6.2));const lon=lerp(72,BJ[1],k1),lat=lerp(12,BJ[0]-6*clamp((T-5)/5),k1);
  const dA=lerp(3.5,1.9,k1);const k2=clamp((T-5.6)/5.0);const dist=Math.exp(lerp(Math.log(dA),Math.log(1.028),ease(k2)));
  const p=ll(lat,lon,dist);const tgt=ll(BJ[0]+1.5*ease(k2),BJ[1],ease(k2)*0.999);setCam(p,tgt,lerp(38,52,ease(k2)));return dist}
function drawGlobeOT(T){bg();const dist=globeCam(T);const cdir=norm(M.p);const near=clamp((2.2-dist)/1.2);
  const c0=proj([0,0,0]);if(c0&&dist>1.15){const er=proj(M.r)[0]-c0[0];const gr=g.createRadialGradient(c0[0],c0[1],er*0.97,c0[0],c0[1],er*1.18);gr.addColorStop(0,'rgba(90,150,240,0.35)');gr.addColorStop(1,'rgba(90,150,240,0)');g.fillStyle=gr;g.beginPath();g.arc(c0[0],c0[1],er*1.2,0,7);g.fill();
    const g2=g.createRadialGradient(c0[0]-er*.3,c0[1]-er*.35,er*.1,c0[0],c0[1],er);g2.addColorStop(0,'#0e2133');g2.addColorStop(1,'#050b13');g.fillStyle=g2;g.beginPath();g.arc(c0[0],c0[1],er,0,7);g.fill()}
  // land
  for(const [la,lo] of D.land){const v=ll(la,lo);if(occluded(v))continue;const p=proj(v);if(!p)continue;const sz=clamp(1.4/p[2]*1.2,1.2,5);g.fillStyle=`rgba(110,125,155,${0.35+0.35*near})`;g.fillRect(p[0],p[1],sz,sz)}
  if(near>0)for(const [la,lo,c] of D.landCN){const v=ll(la,lo);if(occluded(v))continue;const p=proj(v);if(!p)continue;const sz=clamp(0.6/p[2]*2.5,1,6);g.fillStyle=c?`rgba(170,195,230,${near})`:`rgba(105,122,155,${0.7*near})`;g.fillRect(p[0],p[1],sz,sz)}
  g.globalCompositeOperation='lighter';
  // ground sensing points
  const G=D.global;for(let i=0;i<G.length;i++){const v=ll(G[i][0],G[i][1],1.0004);if(dot(v,cdir)<0.1)continue;if(occluded(v))continue;const p=proj(v);if(!p)continue;const tw=0.6+0.4*Math.sin(T*2+i*0.37);const sz=clamp(0.5/p[2],1.1,4);g.fillStyle=`rgba(${i%9===0?'255,111,181':'159,232,255'},${0.45*tw})`;g.fillRect(p[0],p[1],sz,sz)}
  if(window.SHOW_AIR){
  // aircraft with trails (colour = altitude ramp)
  for(const [la,lo,alt,hd,spd] of WS.air){const v=ll(la,lo,1.002);if(occluded(v)||dot(v,cdir)<0.15)continue;const p=proj(v);if(!p)continue;const back=step(la,lo,hd+180,Math.max(40,spd*0.6*(1-0.6*near)));const q=proj(ll(back[0],back[1],1.002));if(!q)continue;const c=R.altitude(alt);const gr=g.createLinearGradient(q[0],q[1],p[0],p[1]);gr.addColorStop(0,rgba(c,0));gr.addColorStop(1,rgba(c,0.85));g.strokeStyle=gr;g.lineWidth=1.2;g.beginPath();g.moveTo(q[0],q[1]);g.lineTo(p[0],p[1]);g.stroke();g.fillStyle=rgba(c,1);g.fillRect(p[0]-1,p[1]-1,2,2)}
  }
  // real satellites: 15,900 objects from CelesTrak, coloured by orbit class
  const ts=T*90;for(const e of WS.sats){const s=sat(e,ts);if(occluded(s.v))continue;const p=proj(s.v);if(!p||p[0]<-20||p[0]>W+20||p[1]<-20||p[1]>H+20)continue;const c=OCOL[s.cls];const sz=clamp(0.9/p[2],1,3.5);g.fillStyle=rgba(c,0.75);g.fillRect(p[0]-sz/2,p[1]-sz/2,sz,sz)}
  g.globalCompositeOperation='source-over';
  // atmosphere limb when close
  if(dist<1.3){const a=clamp((1.3-dist)/0.2);const ang=Math.acos(1/Math.hypot(...M.p));const ax=norm(cross(cdir,M.u)),ay=norm(cross(ax,cdir));const hz=[];for(let i=0;i<=80;i++){const u=i/80*6.283;const dir=[0,1,2].map(k=>ax[k]*Math.cos(u)+ay[k]*Math.sin(u));const v=[0,1,2].map(k=>cdir[k]*Math.cos(ang)+dir[k]*Math.sin(ang));hz.push(proj(v))}
    g.globalCompositeOperation='lighter';for(let w=0;w<5;w++){g.strokeStyle=`rgba(90,160,255,${(0.16-w*0.03)*a})`;g.lineWidth=6+w*16;g.beginPath();let on=false;for(const p of hz){if(!p){on=false;continue}on?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]);on=true}g.stroke()}g.globalCompositeOperation='source-over'}
  // Beijing marker
  const pb=proj(ll(BJ[0],BJ[1],1.0005));if(pb&&!occluded(ll(BJ[0],BJ[1],1.0005))){const a=clamp((T-3.5)/1.2)*(1-clamp((T-9.3)/0.6));if(a>0){g.strokeStyle=`rgba(233,238,249,${a})`;g.lineWidth=1.4;const r=10+4*Math.sin(T*3);g.beginPath();g.arc(pb[0],pb[1],r,0,7);g.stroke();g.beginPath();g.moveTo(pb[0]+r,pb[1]);g.lineTo(pb[0]+60,pb[1]-40);g.lineTo(pb[0]+160,pb[1]-40);g.stroke();text('北京',pb[0]+66,pb[1]-50,24,`rgba(233,238,249,${a})`,'left',600,2)}}}
// ---- city part ----
const CK=[[10.0,[0,26,30],[0,0,-2]],[12.0,[3,11,14],[0,0,-1]],[14.0,[4.9,4.2,13.5],[1.1,0.4,7.9]],[15.6,[2.3,1.0,9.9],[0.5,0.7,6.7]],[17.0,[0.3,0.71,7.6],[0.3,0.71,6.4]]];
function cityCam(T){let i=0;while(i<CK.length-2&&T>CK[i+1][0])i++;const a=CK[i],b=CK[i+1];const k=ease(clamp((T-a[0])/(b[0]-a[0])));const p=a[1].map((x,j)=>lerp(x,b[1][j],k)),t=a[2].map((x,j)=>lerp(x,b[2][j],k));setCam(p,t,lerp(44,52,clamp((T-14)/3)))}
function drawCityOT(T){bg();if(!CITYN)buildCityNet();cityCam(T);
  // ground grid
  g.strokeStyle='rgba(79,127,184,0.10)';g.lineWidth=1;for(let i=-14;i<=14;i+=1){const a=proj([i,0,-14]),b=proj([i,0,14]),c=proj([-14,0,i]),d=proj([14,0,i]);if(a&&b){g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke()}if(c&&d){g.beginPath();g.moveTo(c[0],c[1]);g.lineTo(d[0],d[1]);g.stroke()}}
  g.globalCompositeOperation='lighter';
  for(const rd of CITYN.roads){g.strokeStyle=`rgba(79,150,220,${rd.w===3?0.7:rd.w===2?0.45:0.22})`;g.lineWidth=rd.w===3?2.6:rd.w;g.beginPath();let on=false;for(const q of rd.pts){const p=proj([q[0],0,q[1]]);if(!p){on=false;continue}on?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]);on=true}g.stroke()}
  // moving traffic particles along ring roads
  for(const rd of CITYN.roads){if(rd.w<2)continue;const n=rd.w===3?40:14;for(let k=0;k<n;k++){const u=((T*0.03*(k%2?1:-1)+k/n)%1+1)%1;const f=u*(rd.pts.length-1),s=Math.floor(f),fr=f-s;const A=rd.pts[s],B=rd.pts[Math.min(s+1,rd.pts.length-1)];const p=proj([lerp(A[0],B[0],fr),0.02,lerp(A[1],B[1],fr)]);if(!p)continue;g.fillStyle=k%2?'rgba(255,209,102,0.9)':'rgba(233,238,249,0.9)';g.fillRect(p[0]-1.3,p[1]-1.3,2.6,2.6)}}
  g.globalCompositeOperation='source-over';
  // buildings
  const B=blds().map(b=>[b,Math.hypot(b[0]-M.p[0],b[1]-M.p[2])]).sort((a,b)=>b[1]-a[1]);
  for(const [[x,z,s,h0]] of B){if(Math.hypot(x-2.0,z-0.6)<1.6||(x>1.5&&x<3.6&&z>0&&z<3.4))continue;const h=h0*0.9;const c=R.altitude(h*3500);const cs=[[x-s,z-s],[x+s,z-s],[x+s,z+s],[x-s,z+s]];const bot=cs.map(([a,b])=>proj([a,0,b])),top=cs.map(([a,b])=>proj([a,h,b]));if(bot.some(p=>!p)||top.some(p=>!p))continue;
    for(let k=0;k<4;k++){const k2=(k+1)%4;g.fillStyle=rgba(c.map(v=>v*0.3),0.82);g.beginPath();g.moveTo(bot[k][0],bot[k][1]);g.lineTo(bot[k2][0],bot[k2][1]);g.lineTo(top[k2][0],top[k2][1]);g.lineTo(top[k][0],top[k][1]);g.closePath();g.fill();g.strokeStyle=rgba(c,0.25);g.lineWidth=0.6;g.stroke()}
    g.fillStyle=rgba(c,0.85);g.beginPath();top.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill()}
  g.globalCompositeOperation='lighter';
  // camera cones
  for(const [x,z,h] of CITYN.cams){const a=proj([x,0.02,z]);if(!a||a[2]<2.2)continue;const L=0.55,sp=0.45;const b=proj([x+Math.cos(h-sp)*L,0.02,z+Math.sin(h-sp)*L]),c=proj([x+Math.cos(h+sp)*L,0.02,z+Math.sin(h+sp)*L]);if(b&&c){const gg=g.createRadialGradient(a[0],a[1],0,a[0],a[1],Math.max(1,Math.hypot(b[0]-a[0],b[1]-a[1])));gg.addColorStop(0,'rgba(255,111,181,0.30)');gg.addColorStop(1,'rgba(255,111,181,0)');g.fillStyle=gg;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.lineTo(c[0],c[1]);g.closePath();g.fill()}g.fillStyle='rgba(255,140,200,0.95)';g.fillRect(a[0]-1.2,a[1]-1.2,2.4,2.4)}
  for(const [x,z,cat,ph] of CITYN.evs){const age=((T-ph)%8+8)%8;if(age>3)continue;const k=age/3;const p=proj([x,0.03,z]);if(!p)continue;const col=hex(EVT[cat]);g.strokeStyle=rgba(col,1-k);g.lineWidth=2;g.beginPath();g.ellipse(p[0],p[1],4+k*26,(4+k*26)*0.5,0,0,7);g.stroke()}
  // flights overhead (city scale)
  if(window.SHOW_AIR)for(let i=0;i<6;i++){const y=5+i*0.6;const u=((T*0.05+i*0.23)%1)*36-18;const a=proj([u,y,-8+i*3]),b=proj([u-3,y,-8+i*3]);if(a&&b){const c=R.altitude(8000+i*600);const gr=g.createLinearGradient(b[0],b[1],a[0],a[1]);gr.addColorStop(0,rgba(c,0));gr.addColorStop(1,rgba(c,0.8));g.strokeStyle=gr;g.lineWidth=1.4;g.beginPath();g.moveTo(b[0],b[1]);g.lineTo(a[0],a[1]);g.stroke()}}
  g.globalCompositeOperation='source-over';
  heroCam(T);
  vignette()}
// ---- foreground parallax layer: soft data motes drifting outward faster than the scene ----
const MOTES=(()=>{const r=rng(91);return[...Array(70)].map(()=>({a:r()*6.283,r0:r(),d:0.25+r()*0.75,c:r()<0.5?[159,232,255]:[255,212,92],s:r()}))})();
function zoomS(T){return T*0.35+2.2*ease(clamp((T-5.6)/5))+1.6*ease(clamp((T-10)/7))+2.4*ease(clamp((T-15)/2.4))}
function motes(T){const s=zoomS(T);g.globalCompositeOperation='lighter';for(const m of MOTES){let rr=((m.r0+s*0.35/m.d)%1);const R0=rr*rr*1300;const x=W/2+Math.cos(m.a)*R0,y=H/2+Math.sin(m.a)*R0*0.75;const sz=(2+10*(1-m.d))*(0.5+rr);const a=0.22*(1-m.d*0.6)*Math.sin(rr*Math.PI);const gr=g.createRadialGradient(x,y,0,x,y,sz);gr.addColorStop(0,rgba(m.c,a));gr.addColorStop(1,rgba(m.c,0));g.fillStyle=gr;g.beginPath();g.arc(x,y,sz,0,7);g.fill()}g.globalCompositeOperation='source-over'}
// ---- background parallax: stars drift slowly against camera motion ----
function starsBG(T){const s=zoomS(T);const r=rng(5);g.fillStyle='#05070f';g.fillRect(0,0,W,H);for(let i=0;i<700;i++){const d=0.2+r()*0.8;const x=((r()*W+T*6*d)%W),y=(r()*H+s*8*d)%H;g.fillStyle=`rgba(200,215,255,${r()*0.4})`;g.fillRect(x,y,1,1)}}
// ---- real Dongcheng (OSM footprints, 14k buildings) ----
let DC=null;
function drawCityDC(T){bg();cityCam(T);
  g.strokeStyle='rgba(79,127,184,0.08)';g.lineWidth=1;for(let i=-14;i<=14;i+=1){const a=proj([i,0,-15]),b=proj([i,0,15]),c=proj([-14,0,i]),d=proj([14,0,i]);if(a&&b){g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke()}if(c&&d){g.beginPath();g.moveTo(c[0],c[1]);g.lineTo(d[0],d[1]);g.stroke()}}
    g.globalCompositeOperation='source-over';
  // buildings, far to near
  const segd=(x,z,ax,az,bx,bz)=>{const vx=bx-ax,vz=bz-az;const t=clamp(((x-ax)*vx+(z-az)*vz)/(vx*vx+vz*vz));return Math.hypot(x-ax-vx*t,z-az-vz*t)};const list=[];for(const b of DC.b){const d=Math.hypot(b[0]-M.p[0],b[1]-M.p[2]);if(d<0.25)continue;if(segd(b[0],b[1],1.1,8.3,4.9,13.5)<0.5||segd(b[0],b[1],0.3,6.4,1.1,8.3)<0.4)continue;list.push([d,b])}list.sort((a,b)=>b[0]-a[0]);
  for(const [d,[cx,cz,h,r]] of list){const n=r.length/2;const top=[];let ok=true;for(let i=0;i<n;i++){const p=proj([r[2*i],h,r[2*i+1]]);if(!p){ok=false;break}top.push(p)}if(!ok)continue;
    const hm=h*1000*0.4/2.5;const c=R.altitude(lerp(1500,13000,clamp((hm-3)/120)));
    if(hm>12){const bot=[];for(let i=0;i<n;i++){const p=proj([r[2*i],0,r[2*i+1]]);if(!p){ok=false;break}bot.push(p)}if(ok){g.fillStyle=rgba(c.map(v=>v*0.32),0.9);for(let i=0;i<n;i++){const j=(i+1)%n;g.beginPath();g.moveTo(bot[i][0],bot[i][1]);g.lineTo(bot[j][0],bot[j][1]);g.lineTo(top[j][0],top[j][1]);g.lineTo(top[i][0],top[i][1]);g.closePath();g.fill()}}}
    g.fillStyle=rgba(c,hm>12?0.9:0.55);g.beginPath();top.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill();if(d<9){g.strokeStyle=rgba(c.map(v=>Math.min(255,v*1.3)),0.5);g.lineWidth=0.6;g.stroke()}}
  g.globalCompositeOperation='lighter';
  for(const [x,z,hd] of DC.cams){const a=proj([x,0.02,z]);if(!a||a[2]<2.2)continue;const L=0.35,sp=0.45;const b=proj([x+Math.cos(hd-sp)*L,0.02,z+Math.sin(hd-sp)*L]),c=proj([x+Math.cos(hd+sp)*L,0.02,z+Math.sin(hd+sp)*L]);if(b&&c){const gg=g.createRadialGradient(a[0],a[1],0,a[0],a[1],Math.max(1,Math.hypot(b[0]-a[0],b[1]-a[1])));gg.addColorStop(0,`rgba(255,111,181,${0.32*(window.CONEA??1)})`);gg.addColorStop(1,'rgba(255,111,181,0)');g.fillStyle=gg;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.lineTo(c[0],c[1]);g.closePath();g.fill()}g.fillStyle=`rgba(255,140,200,${0.95*(0.3+0.7*(window.CONEA??1))})`;g.fillRect(a[0]-1.1,a[1]-1.1,2.2,2.2)}
  for(const [x,z,cat,ph] of DC.evs){const age=((T-ph)%8+8)%8;if(age>3)continue;const k=age/3;const p=proj([x,0.03,z]);if(!p)continue;const col=hex(EVT[cat]);g.strokeStyle=rgba(col,1-k);g.lineWidth=2;g.beginPath();g.ellipse(p[0],p[1],4+k*26,(4+k*26)*0.5,0,0,7);g.stroke()}
  if(window.SHOW_AIR)for(let i=0;i<6;i++){const y=5+i*0.6;const u=((T*0.05+i*0.23)%1)*36-18;const a=proj([u,y,-8+i*3]),b=proj([u-3,y,-8+i*3]);if(a&&b){const c=R.altitude(8000+i*600);const gr=g.createLinearGradient(b[0],b[1],a[0],a[1]);gr.addColorStop(0,rgba(c,0));gr.addColorStop(1,rgba(c,0.8));g.strokeStyle=gr;g.lineWidth=1.4;g.beginPath();g.moveTo(b[0],b[1]);g.lineTo(a[0],a[1]);g.stroke()}}
  g.globalCompositeOperation='source-over';
  heroCam(T);
  // district label
  const la=clamp((T-11)/0.8)*(1-clamp((T-13.6)/0.6));if(la>0){text('北京 · 东城区',120,980,30,`rgba(233,238,249,${la})`,'left',600,4)}
  vignette()}

function heroCam(T){if(window.NOHERO)return;
  const P=[1.1,0,8.3],top=[1.1,0.72,8.3];const pp=proj(P),pt=proj(top);const ha=clamp((T-13.2)/0.8);
  if(ha>0){if(pp&&pt){g.strokeStyle=`rgba(200,210,225,${ha})`;g.lineWidth=2;g.beginPath();g.moveTo(pp[0],pp[1]);g.lineTo(pt[0],pt[1]);g.stroke();g.fillStyle=`rgba(230,235,245,${ha})`;g.fillRect(pt[0]-5,pt[1]-4,12,8)}
    const fq=[[-0.305,1.05,6.4],[0.905,1.05,6.4],[0.905,0.37,6.4],[-0.305,0.37,6.4]];
    g.globalCompositeOperation='lighter';fq.forEach(q=>{const p=proj(q);if(!p||!pt)return;g.strokeStyle=`rgba(255,111,181,${0.55*ha})`;g.lineWidth=1.2;g.beginPath();g.moveTo(pt[0],pt[1]);g.lineTo(p[0],p[1]);g.stroke()});g.globalCompositeOperation='source-over';
    const P4=fq.map(proj);if(P4.every(q=>q)){const fa=clamp((T-14.6)/0.8);if(fa>0){g.save();g.globalAlpha=fa;g.setTransform((P4[1][0]-P4[0][0])/960,(P4[1][1]-P4[0][1])/960,(P4[3][0]-P4[0][0])/540,(P4[3][1]-P4[0][1])/540,P4[0][0],P4[0][1]);g.drawImage(VC.img,0,0);g.restore()}
      g.strokeStyle=`rgba(255,111,181,${ha})`;g.lineWidth=1.6;g.beginPath();P4.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.closePath();g.stroke()}
    }
}
