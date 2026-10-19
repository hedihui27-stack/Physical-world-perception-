// ===== 第六版 · 基础：调色、橙色强调、柔和覆盖光斑、东城街区 =====
const C_OR=[255,166,38],C_OR2=[255,212,96],C_WH=[228,232,238],C_ST=[150,162,180];
// muted palette: slate → pale warm white (buildings, terrain)
R.altitude=ramp([[0,'#262c36'],[2500,'#3a4656'],[6000,'#5d6e80'],[9500,'#9eaab6'],[13000,'#efe7d8']]);
R.density=ramp([[0,'#3b424e'],[0.35,'#66768a'],[0.7,'#d4a35a'],[1,'#ffd27a']]);
C_SAT[0]=255;C_SAT[1]=170;C_SAT[2]=48; // satellites carry the brand orange
// neutral background
starsBG=function(T){const s=zoomS(T);const r=rng(5);g.fillStyle='#06070a';g.fillRect(0,0,W,H);for(let i=0;i<700;i++){const d=0.2+r()*0.8;const x=((r()*W+T*6*d)%W),y=(r()*H+s*8*d)%H;g.fillStyle=`rgba(215,220,230,${r()*0.4})`;g.fillRect(x,y,1,1)}};
// grade: pull cool hues toward grey, keep warm accents untouched
function grade(ctx){const im=ctx.getImageData(0,0,W,H),d=im.data;for(let i=0;i<d.length;i+=4){const r=d[i],gg=d[i+1],b=d[i+2];const c=b-r;if(c<=4)continue;const w=Math.min(1,c/60)*0.72;const l=0.3*r+0.59*gg+0.11*b;d[i]=r+(l-r)*w;d[i+1]=gg+(l-gg)*w;d[i+2]=b+(l*1.02-b)*w}ctx.putImageData(im,0,0)}
// soft circular coverage on the ground (replaces the hard view cones)
function camPool(x,z,Rr,col,a,y=0.02){const c=proj([x,y,z]),e=proj([x+Rr,y,z]),f=proj([x,y,z+Rr]);if(!c||!e||!f)return;const det=(e[0]-c[0])*(f[1]-c[1])-(e[1]-c[1])*(f[0]-c[0]);if(Math.abs(det)<0.5)return;
  g.save();g.setTransform(e[0]-c[0],e[1]-c[1],f[0]-c[0],f[1]-c[1],c[0],c[1]);const gg=g.createRadialGradient(0,0,0,0,0,1);gg.addColorStop(0,rgba(col,a));gg.addColorStop(0.55,rgba(col,a*0.4));gg.addColorStop(1,rgba(col,0));g.fillStyle=gg;g.beginPath();g.arc(0,0,1,0,7);g.fill();g.restore()}
// generic extruded footprints
function drawBlds(B,o={}){const ox=o.ox||0,oy=o.oy||0,oz=o.oz||0,hs=o.hs||1,sc=o.s||1,al=o.a??1;const L=[];
  for(const b of B){const X=b[0]*sc+ox,Z=b[1]*sc+oz;if(o.clip&&!o.clip(b[0],b[1]))continue;L.push([Math.hypot(X-M.p[0],Z-M.p[2]),b])}L.sort((a,b)=>b[0]-a[0]);
  for(const [d,[cx,cz,h0,r]] of L){const hm=h0*160;const h=oy+Math.max(h0,o.minH||0)*hs*sc;const n=r.length/2;const top=[];let ok=true;for(let i=0;i<n;i++){const p=proj([r[2*i]*sc+ox,h,r[2*i+1]*sc+oz]);if(!p){ok=false;break}top.push(p)}if(!ok)continue;
    const c=o.col?o.col(cx,cz,hm):R.altitude(lerp(1500,13000,clamp((hm-3)/120)));
    if(o.ghost){g.strokeStyle=rgba(c,0.5*al);g.lineWidth=0.7;g.beginPath();top.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fillStyle=rgba(c,0.10*al);g.fill();if(hm>12)g.stroke();continue}
    if(hm>12||o.walls){const bot=[];for(let i=0;i<n;i++){const p=proj([r[2*i]*sc+ox,oy,r[2*i+1]*sc+oz]);if(!p){ok=false;break}bot.push(p)}if(ok){g.fillStyle=rgba(c.map(v=>v*0.32),0.9*al);for(let i=0;i<n;i++){const j=(i+1)%n;g.beginPath();g.moveTo(bot[i][0],bot[i][1]);g.lineTo(bot[j][0],bot[j][1]);g.lineTo(top[j][0],top[j][1]);g.lineTo(top[i][0],top[i][1]);g.closePath();g.fill()}}}
    g.fillStyle=rgba(c,(hm>12?0.9:0.6)*al);g.beginPath();top.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill();if(d<(o.edgeD||9)){g.strokeStyle=rgba(c.map(v=>Math.min(255,v*1.3)),0.5*al);g.lineWidth=0.6;g.stroke()}}}
// ---- the Dongcheng block (2,108 real footprints, 3.5 × 2.9 km) with street walkers ----
let BLK=null;
function walkerXZ(w,T,sp,ph){const n=w.length/2;const u=((T*sp+ph)%2+2)%2;const f=(u<1?u:2-u)*(n-1);const i=Math.min(n-2,Math.floor(f)),k=f-i;return[lerp(w[2*i],w[2*i+2],k),lerp(w[2*i+1],w[2*i+3],k)]}
// one time-slice of the block. o: {y, s, a, ghost, blur, dense, pcol, ox, oz}
function drawBlock(T,o={}){const y=o.y||0,s=o.s||1,a=o.a??1,blur=o.blur||0,ox=o.ox||0,oz=o.oz||0;
  // ground plate + faint street grid glow
  const q=[[-4.4,-3.6],[4.4,-3.6],[4.4,3.6],[-4.4,3.6]].map(([x,z])=>proj([x*s+ox,y,z*s+oz]));if(q.every(p=>p)){g.fillStyle=`rgba(20,24,32,${(o.ghost?0.25:0.75)*a})`;g.beginPath();q.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill();g.strokeStyle=rgba(o.edge||C_ST,(o.ghost?0.45:0.6)*a);g.lineWidth=o.edgeW||1.2;g.stroke()}
  drawBlds(BLK.b,{oy:y,s,ox,oz,a:a*(o.ghost?0.9:1),ghost:o.ghost,hs:1.5,minH:0.012,edgeD:o.edgeD||7});
  // walkers: people & vehicles on the real street network
  g.globalCompositeOperation='lighter';const N=Math.floor(BLK.w.length*(o.dense??1));const pc=o.pcol||(o.ghost?[150,175,205]:[238,232,220]);
  for(let i=0;i<N;i++){const w=BLK.w[i];const sp=0.02+((i*37)%17)/17*0.03;const [x,z]=walkerXZ(w,T,sp,(i*0.618)%2);const jx=blur*Math.sin(i*12.9+T*0.7)*0.18,jz=blur*Math.cos(i*7.1+T*0.6)*0.18;const p=proj([(x+jx)*s+ox,y+0.02,(z+jz)*s+oz]);if(!p)continue;const sz=clamp(9/p[2],1.2,4)*(1+blur*1.6);g.fillStyle=rgba(pc,(0.85-blur*0.45)*a);g.fillRect(p[0]-sz/2,p[1]-sz/2,sz,sz)}
  g.globalCompositeOperation='source-over'}
