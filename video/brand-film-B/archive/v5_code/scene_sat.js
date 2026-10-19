// ===== 写实卫星特写：太阳翼、本体、成像视场与地面条带 =====
function satModel(){ // local frame: x = wing axis, y = up (away from earth), z = along-track
  const F=[];const box=(cx,cy,cz,sx,sy,sz,col,kind)=>{const v=(a,b,c)=>[cx+a*sx/2,cy+b*sy/2,cz+c*sz/2];
    F.push({p:[v(-1,-1,1),v(1,-1,1),v(1,1,1),v(-1,1,1)],n:[0,0,1],col,kind},{p:[v(1,-1,-1),v(-1,-1,-1),v(-1,1,-1),v(1,1,-1)],n:[0,0,-1],col,kind},
      {p:[v(1,-1,1),v(1,-1,-1),v(1,1,-1),v(1,1,1)],n:[1,0,0],col,kind},{p:[v(-1,-1,-1),v(-1,-1,1),v(-1,1,1),v(-1,1,-1)],n:[-1,0,0],col,kind},
      {p:[v(-1,1,1),v(1,1,1),v(1,1,-1),v(-1,1,-1)],n:[0,1,0],col,kind},{p:[v(-1,-1,-1),v(1,-1,-1),v(1,-1,1),v(-1,-1,1)],n:[0,-1,0],col,kind})};
  box(0,0,0,0.9,0.9,1.4,[201,162,74],'foil');          // body, gold MLI foil
  box(0,-0.6,0.15,0.36,0.3,0.36,[60,64,72],'lens');     // camera barrel pointing to earth
  box(0,0.55,-0.3,0.2,0.2,0.2,[200,205,215],'metal');   // star tracker
  for(const s of [-1,1]){box(s*0.7,0,0,0.5,0.06,0.06,[180,185,195],'metal');      // yoke
    for(let k=0;k<3;k++)F.push({p:[[s*(0.95+k*0.85),0.02,-0.55],[s*(0.95+k*0.85+0.8),0.02,-0.55],[s*(0.95+k*0.85+0.8),0.02,0.55],[s*(0.95+k*0.85),0.02,0.55]],n:[0,1,0],col:[28,46,92],kind:'panel',two:true})}
  return F}
const SATM=satModel();
function drawSatModel(pos,ex,ey,ez,scale,sun){ // ex,ey,ez: world axes of the model frame
  const W3=v=>[pos[0]+(v[0]*ex[0]+v[1]*ey[0]+v[2]*ez[0])*scale,pos[1]+(v[0]*ex[1]+v[1]*ey[1]+v[2]*ez[1])*scale,pos[2]+(v[0]*ex[2]+v[1]*ey[2]+v[2]*ez[2])*scale];
  const faces=[];for(const f of SATM){const P=f.p.map(W3);const n=[0,1,2].map(i=>f.n[0]*ex[i]+f.n[1]*ey[i]+f.n[2]*ez[i]);const c=P.reduce((a,p)=>[a[0]+p[0]/4,a[1]+p[1]/4,a[2]+p[2]/4],[0,0,0]);
    const toCam=norm(sub(M.p,c));let nd=dot(n,toCam);if(nd<0&&!f.two)continue;const nn=nd<0?n.map(x=>-x):n;const lit=Math.max(0,dot(nn,sun));const pr=P.map(proj);if(pr.some(q=>!q))continue;faces.push({pr,d:Math.hypot(...sub(c,M.p)),f,lit,nn})}
  faces.sort((a,b)=>b.d-a.d);
  for(const {pr,f,lit,nn} of faces){const amb=0.28;let col=f.col.map(x=>x*(amb+(1-amb)*lit));
    if(f.kind==='foil'){col=col.map((x,i)=>x+[40,30,0][i]*lit)}
    g.fillStyle=rgba(col,1);g.beginPath();pr.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.closePath();g.fill();
    if(f.kind==='panel'){ // solar cell grid + specular
      g.strokeStyle=rgba([90,120,190],0.55);g.lineWidth=0.8;for(let i=1;i<6;i++){const a=[0,1].map(k=>lerp(pr[0][k],pr[1][k],i/6)),b=[0,1].map(k=>lerp(pr[3][k],pr[2][k],i/6));g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke()}
      for(let j=1;j<4;j++){const a=[0,1].map(k=>lerp(pr[0][k],pr[3][k],j/4)),b=[0,1].map(k=>lerp(pr[1][k],pr[2][k],j/4));g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke()}
      const spec=Math.pow(Math.max(0,dot(nn,norm(sun.map((s,i)=>s+norm(sub(M.p,pos))[i])))),18);if(spec>0.02){g.fillStyle=`rgba(200,225,255,${0.6*spec})`;g.beginPath();pr.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.closePath();g.fill()}}
    else{g.strokeStyle='rgba(0,0,0,0.35)';g.lineWidth=0.8;g.stroke()}
    if(f.kind==='foil'&&lit>0.2){g.fillStyle=`rgba(255,235,170,${0.15*lit})`;g.beginPath();pr.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.closePath();g.fill()}}}
function sceneSatHero(t){bg();const lt=LT(t);
  // satellite flies over eastern China, sun from upper-left
  const lat0=31+lt*0.55,lon0=118.5;const up=ll(lat0,lon0);const east=norm(cross([0,1,0],up)).map(x=>-x);const north=norm(cross(up,east));
  const sp=up.map(x=>x*1.075);
  const cam=[0,1,2].map(i=>sp[i]+up[i]*0.035-north[i]*0.085+east[i]*(0.05-0.035*ease(CP.k)));
  setCam(cam,[0,1,2].map(i=>sp[i]-up[i]*0.045+north[i]*0.05),50);{const f=M.f;const r=norm(cross(f,up));M.r=r;M.u=cross(r,f)}
  const cdir=norm(M.p);
  // earth limb + atmosphere
  const c0=proj([0,0,0]);const sun=norm([0,1,2].map(i=>up[i]*0.7-east[i]*0.6+north[i]*0.3));
  {const gr2=g.createLinearGradient(0,0,0,H);gr2.addColorStop(0,'#05070f');gr2.addColorStop(0.35,'#071426');gr2.addColorStop(1,'#0b1d33');}
  for(const [la,lo,c] of D.landCN){const v=ll(la,lo);if(occluded(v))continue;const p=proj(v);if(!p)continue;g.fillStyle=c?'rgba(170,195,230,0.95)':'rgba(110,128,160,0.7)';const sz=clamp(0.012/p[2]*60,1.5,6);g.fillRect(p[0],p[1],sz,sz)}
  g.strokeStyle='rgba(79,127,184,0.22)';g.lineWidth=1;for(let la=20;la<=46;la+=1){const pts=[];for(let lo=100;lo<=135;lo+=0.5)pts.push(ll(la,lo));poly(pts,'rgba(79,127,184,0.18)',1)}for(let lo=100;lo<=135;lo+=1){const pts=[];for(let la=18;la<=48;la+=0.5)pts.push(ll(la,lo));poly(pts,'rgba(79,127,184,0.18)',1)}
  g.globalCompositeOperation='lighter';for(const [la,lo] of D.global){if(la<18||la>48||lo<100||lo>135)continue;const v=ll(la,lo,1.0003);if(occluded(v))continue;const p=proj(v);if(!p)continue;g.fillStyle='rgba(255,111,181,0.6)';g.fillRect(p[0],p[1],1.6,1.6)}g.globalCompositeOperation='source-over';
  // atmosphere glow along horizon
  {const hz=[];for(let a=0;a<=60;a++){const u=(a/60-0.5)*2.4;let dir=[0,1,2].map(i=>north[i]*Math.cos(u)+east[i]*Math.sin(u));const dd=dot(dir,cdir);dir=norm(dir.map((x,i)=>x-dd*cdir[i]));const ang=Math.acos(1/Math.hypot(...M.p));const v=[0,1,2].map(i=>(cdir[i]*Math.cos(ang)+dir[i]*Math.sin(ang))*1.0);hz.push(proj(v))}
   g.globalCompositeOperation='lighter';for(let w=0;w<5;w++){g.strokeStyle=`rgba(90,160,255,${0.14-w*0.025})`;g.lineWidth=6+w*14;g.beginPath();hz.forEach((p,i)=>p&&(i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1])));g.stroke()}g.globalCompositeOperation='source-over'}
  // imaging footprint: cone from lens to ground + swath strip already imaged behind
  const gnd=up.map(x=>x*1.0005);const hw=0.012;
  const corners=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([a,b])=>norm([0,1,2].map(i=>gnd[i]+east[i]*hw*a+north[i]*hw*0.6*b)).map(x=>x*1.0005));
  g.globalCompositeOperation='lighter';
  // swath behind
  const strip=[];for(let k=0;k<=40;k++){const la=lat0-k*0.06;const u=ll(la,lon0,1.0005);const e2=norm(cross([0,1,0],u)).map(x=>-x);strip.push([u.map((x,i)=>x+e2[i]*hw),u.map((x,i)=>x-e2[i]*hw)])}
  for(let k=0;k<40;k++){const a=strip[k],b=strip[k+1];const P=[a[0],a[1],b[1],b[0]].map(proj);if(P.some(q=>!q))continue;g.fillStyle=`rgba(255,212,92,${0.22*(1-k/40)})`;g.beginPath();P.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.closePath();g.fill()}
  const lens=[0,1,2].map(i=>sp[i]-up[i]*0.0012);const pl=proj(lens);
  corners.forEach(cn=>{const q=proj(cn);if(!q||!pl)return;const gr=g.createLinearGradient(pl[0],pl[1],q[0],q[1]);gr.addColorStop(0,'rgba(255,212,92,0.5)');gr.addColorStop(1,'rgba(255,212,92,0.05)');g.strokeStyle=gr;g.lineWidth=1.2;g.beginPath();g.moveTo(pl[0],pl[1]);g.lineTo(q[0],q[1]);g.stroke()});
  {const P=corners.map(proj);if(P.every(q=>q)){g.strokeStyle='rgba(255,212,92,0.9)';g.lineWidth=1.5;g.beginPath();P.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.closePath();g.stroke();g.fillStyle='rgba(255,212,92,0.12)';g.fill()}}
  g.globalCompositeOperation='source-over';
  // the satellite (model frame: x=east wing axis, y=up, z=north along-track)
  drawSatModel(sp,east,up,north,0.0055,sun);
  // a few other satellites of the constellation as small lit glints with orbit lines
  g.globalCompositeOperation='lighter';for(let i=0;i<5;i++){const lt2=lat0+8+i*7,lo2=lon0-14+i*9;const v=ll(lt2,lo2,1.075);const p=proj(v);if(!p)continue;g.fillStyle='rgba(255,243,196,0.9)';g.beginPath();g.arc(p[0],p[1],2,0,7);g.fill()}g.globalCompositeOperation='source-over';

  vignette()}
SC.sathero=sceneSatHero;
