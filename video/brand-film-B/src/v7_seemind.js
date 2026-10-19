// ===== 第七版 · SeeMind 改为方块矩阵：x 轴是网络层，数据从左面进、计算逐层推进、结论从右面出 =====
const MXN=9;let MXP=0.46,MXS=0.31;
function mxCell(i,j,k,rot){const h=(MXN-1)/2;const x=(i-h)*MXP,y=(j-h)*MXP,z=(k-h)*MXP;const cs=Math.cos(rot),sn=Math.sin(rot);return[XC[0]+x*cs-z*sn,XC[1]+y,XC[2]+x*sn+z*cs]}
function mxAct(i,j,k,t){const hs=Math.sin(j*12.9+k*78.2)*43758.5;const r=hs-Math.floor(hs);const w=Math.sin(i/MXN*Math.PI*2-t*2.4+r*1.2);return Math.pow(Math.max(0,w),10)*(0.25+0.6*r)}
function seeMindMatrix(t,a,rotO){const rot=rotO??(-0.95+(t-69.6)*0.03);const cs=Math.cos(rot),sn=Math.sin(rot);const ax=[[cs,0,sn],[0,1,0],[-sn,0,cs]];const s=MXS/2;
  const L=[];for(let i=0;i<MXN;i++)for(let j=0;j<MXN;j++)for(let k=0;k<MXN;k++){const c=mxCell(i,j,k,rot);L.push([Math.hypot(...sub(c,M.p)),c,mxAct(i,j,k,t),i])}L.sort((p,q)=>q[0]-p[0]);
  const key=norm([0.4,0.8,0.5]);
  for(const [d,c,act,i] of L){// visible faces of one cubelet
    for(const [ai,sg] of [[0,1],[0,-1],[1,1],[1,-1],[2,1],[2,-1]]){const n=ax[ai].map(v=>v*sg);const fc=c.map((v,m)=>v+n[m]*s);if(dot(n,sub(M.p,fc))<=0)continue;
      const u=ax[(ai+1)%3],v=ax[(ai+2)%3];const P=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([p,q])=>proj(fc.map((x,m)=>x+(u[m]*p+v[m]*q)*s)));if(P.some(x=>!x))continue;
      const lit=0.45+0.55*Math.max(0,dot(n,key));const base=[46,70,98].map(x=>x*lit),hot=[255,176,70];const col=base.map((x,m)=>lerp(x,hot[m],act));
      g.fillStyle=rgba(col,(0.30+0.55*act)*a);g.beginPath();P.forEach((p,m)=>m?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill();
      g.strokeStyle=rgba(act>0.3?[255,214,150]:[150,180,212],(0.22+0.4*act)*a);g.lineWidth=0.6;g.stroke()}}
  g.globalCompositeOperation='lighter';for(const [d,c,act] of L){if(act<0.25)continue;const p=proj(c);if(!p)continue;const r=clamp(260/p[2],10,60);const gg=g.createRadialGradient(p[0],p[1],0,p[0],p[1],r);gg.addColorStop(0,rgba(C_OR,0.22*act*a));gg.addColorStop(1,rgba(C_OR,0));g.fillStyle=gg;g.fillRect(p[0]-r,p[1]-r,2*r,2*r)}
  g.globalCompositeOperation='source-over';return rot}
// entry / exit points on the matrix faces
function mxIn(b,rot){const r=rng(300+b);return mxCell(-0.6,r()*(MXN-1),r()*(MXN-1),rot)}
function mxOut(b,rot){const r=rng(700+b);return mxCell(MXN-0.4,r()*(MXN-1),r()*(MXN-1),rot)}
// inputs: countless particles from the whole left side, brightening as they converge straight into the matrix
// four torrents as flowing ribbons along long sweeping curves into four quadrants of the matrix's left face
const SPAL7=[[168,190,226],[160,206,204],[196,210,170],[222,194,172]];
const ST7=[{p0:[-16,9.5,-2.6],p1:[-6.0,8.0,1.0],g:0.62,w:5.6,sw:0.35},{p0:[-17,3.8,2.4],p1:[-7.0,2.6,-1.0],g:0.7,w:4.6,sw:0.25},{p0:[-16.5,-1.0,-1.5],p1:[-7.5,1.2,1.6],g:0.6,w:5.2,sw:0.4},{p0:[-15.5,-6.0,1.6],p1:[-6.0,-3.4,-1.6],g:0.66,w:5.0,sw:0.3}];
const SRCY7=[8.6,4.6,0.0,-4.2];
const XP7=(()=>{const r=rng(56);const P=[];for(let i=0;i<18000;i++){const s=i%4;const a=r()*6.283,rad=Math.sqrt(r());P.push({s,ph:r(),a,rad,fj:(3.5-s)*(MXN-1)/4,fk:(MXN-1)/2,w:r()})}return P})();
function bez(P0,P1,P2,P3,u){const v=1-u;return[0,1,2].map(i=>v*v*v*P0[i]+3*v*v*u*P1[i]+3*v*u*u*P2[i]+u*u*u*P3[i])}
const XO7=(()=>{const r=rng(57);const O=[];for(let i=0;i<4;i++)for(let j=0;j<3;j++)O.push({gy:(i-1.5)*2.3+(r()-.5)*0.4,gz:(j-1)*2.6+(r()-.5)*0.5,gx:5.2+j*0.6+r()*0.8,n:6+Math.floor(r()*4),hue:r()});return O})();
const PAL7=[[150,190,240],[110,200,215],[170,210,150],[230,180,140],[170,160,230]];
shotExperts=function(t){bg();const lt=LT(t);const k=ease(clamp(lt/12.7));
  setCam([lerp(-4.0,2.4,k),lerp(3.4,3.0,k),lerp(11.0,10.4,k)],[lerp(-2.0,2.6,k),2.1,0],58);
  const a0=clamp(lt/1.0),ca=clamp((lt-0.8)/1.4),oa=clamp((lt-3.6)/1.6);const rot=-0.95+(t-69.6)*0.03;
  g.globalCompositeOperation='lighter';
  // four inputs from the left: a fine-particle wedge per source (wide → narrow), then evenly spaced data blocks along an S-curve into the matrix
  const SY=[7.6,4.2,0.6,-3.0],EJ=[5.6,4.7,3.3,2.4],SC=[[214,196,150],[214,170,186],[160,200,172],[160,188,214]];
  for(let s4=0;s4<4;s4++){const tg=mxCell(-0.7,EJ[s4],(MXN-1)/2,rot);const P0=[-9.6,SY[s4]*0.85,0],P1=[-4.8,SY[s4]*0.85,0],P2=[tg[0]-3.4,tg[1],tg[2]],P3=tg;const col=SC[s4];
    for(let i=0;i<6500;i++){const h=Math.sin((i+1)*(s4+3)*12.9898)*43758.5453;const r1=h-Math.floor(h),h2=Math.sin((i+7)*78.233+s4)*43758.5453,r2=h2-Math.floor(h2);
      const u=((t*0.09+r1)%1);const e=u*0.46;const c=bez(P0,P1,P2,P3,e);const wk=1-e/0.46;const h3=Math.sin((i+13)*39.425+s4*7)*24634.6345,r3=h3-Math.floor(h3),h4=Math.sin((i+29)*11.135+s4*3)*17531.123,r4=h4-Math.floor(h4);const off=((r2+r3)/2-0.5)*2.6*wk*0.85;const v=[c[0],c[1]+off,c[2]+(r4-0.5)*wk*0.6];
      const q=proj(v);if(!q)continue;const al=a0*(0.45+0.55*(1-wk))*clamp(u/0.05)*(1-clamp((u-0.94)/0.06));g.fillStyle=rgba(col,al);const sz=clamp(10/q[2],1,2.2);g.fillRect(q[0]-sz/2,q[1]-sz/2,sz,sz)}
    // blocks
    for(let b=0;b<22;b++){const u=((t*0.16+b/22+s4*0.07)%1);const e=0.46+u*0.54;const c=bez(P0,P1,P2,P3,e);const q=proj(c);if(!q)continue;const fade=1-clamp((u-0.85)/0.15);const al=a0*fade*clamp(u/0.08);
      const sz=clamp(70/q[2],4,8);g.fillStyle=rgba(col.map(x=>x*0.6),0.8*al);g.fillRect(q[0]-sz/2,q[1]-sz/2,sz,sz);g.fillStyle=rgba(col.map(x=>Math.min(255,x*1.2)),al);g.fillRect(q[0]-sz/2,q[1]-sz/2,sz,1.5);g.fillRect(q[0]-sz/2,q[1]-sz/2,1.5,sz)}
    // faint guide of the path (hairline) so the S-shape reads
    g.strokeStyle=rgba(col,0.10*a0);g.lineWidth=0.7;g.beginPath();for(let k=0;k<=40;k++){const c=bez(P0,P1,P2,P3,0.46+k/40*0.54);const q=proj(c);if(!q)continue;k?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1])}g.stroke()}
  g.globalCompositeOperation='source-over';
  if(ca>0){seeMindMatrix(t,ca);const pc=proj([XC[0],XC[1]-(MXN/2+1.2)*MXP,XC[2]]);if(pc)text('SeeMind',pc[0],pc[1]+70,78,`rgba(236,238,242,${ca*0.85})`,'center',700,6)}
  // outputs: a wide fan of streams; each settles into a small luminous grid (a structured answer)
  if(oa>0){g.globalCompositeOperation='lighter';const ex=mxCell(MXN-0.4,(MXN-1)/2,(MXN-1)/2,rot);
    XO7.forEach((o,i)=>{const pa=oa*clamp((lt-3.6)*0.8-i*0.12);if(pa<=0)return;const end=[ex[0]+o.gx,ex[1]+o.gy,ex[2]+o.gz];const col=PAL7[Math.floor(o.hue*5)];
      for(let b=0;b<700;b++){const u=((t*0.2+b/700+i*0.07)%1);const st=mxOut(i*61+b,rot);const sp=Math.sin(u*Math.PI)*0.35;const v=[0,1,2].map(j=>lerp(st[j],end[j],ease(u))+(j?Math.sin(b*7.1+j*3)*sp:0));const q=proj(v);if(!q)continue;const cc=u>0.6?col.map((x,j)=>lerp(x,C_OR2[j],(u-0.6)*1.6)):[225,232,240];g.fillStyle=rgba(cc,0.95*pa*Math.sin(Math.PI*Math.min(1,u*1.05)));const s=clamp(12/q[2],1.3,2.8);g.fillRect(q[0]-s/2,q[1]-s/2,s,s)}
      // the answer: a small grid of lit cells that fills in
      const grow=ease(clamp((lt-4.4-i*0.15)/1.5));const n=o.n,cs=0.11;for(let a=0;a<n;a++)for(let b=0;b<n;b++){const hs=Math.sin((a*7+b*13+i*31)*12.9898)*43758.5;const r=hs-Math.floor(hs);if(r>grow)continue;const c3=[0,1,2].map(j=>end[j]+M.r[j]*(a-n/2)*cs+M.u[j]*(b-n/2)*cs);const q=proj(c3);if(!q)continue;const s=clamp(70/q[2]*cs*10,2,9);const on=r<grow*0.35;g.fillStyle=rgba(on?C_OR2:col,(on?0.75:0.35)*pa);g.fillRect(q[0]-s*0.42,q[1]-s*0.42,s*0.84,s*0.84)}
      const pe=proj(end);if(pe){const gg=g.createRadialGradient(pe[0],pe[1],0,pe[0],pe[1],80);gg.addColorStop(0,rgba(C_OR,0.18*pa));gg.addColorStop(1,rgba(C_OR,0));g.fillStyle=gg;g.fillRect(pe[0]-80,pe[1]-80,160,160)}});
    g.globalCompositeOperation='source-over'}
  vignette()};
