// ===== 第九版 · 新解说词 · 感知到融合段（S07–S13）=====
// 主角：同一个路口（东城，HX,HZ）。每个镜头都从解说的具体意思出发。
const HX=1.0,HZ=-1.0;
const C_CAMW=[255,186,110],C_SENW=[150,214,226],C_NETW=[206,196,255],C_SATW=[255,170,48];
function poly2(P,fill,stroke,lw=1){if(P.some(p=>!p))return;g.beginPath();P.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();if(fill){g.fillStyle=fill;g.fill()}if(stroke){g.strokeStyle=stroke;g.lineWidth=lw;g.stroke()}}
function line3(a,b,col,lw=1){const p=proj(a),q=proj(b);if(!p||!q)return;g.strokeStyle=col;g.lineWidth=lw;g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(q[0],q[1]);g.stroke()}
const sstep=(a,b,x)=>{const k=clamp((x-a)/(b-a));return k*k*(3-2*k)};
// flat top-down image of the district (roofs only) at height y — used as satellite captures
function flatSheet(y,a,colFn,clipX){for(const B of BLK.b){const [cx,cz,h0,r]=B;if(clipX!==undefined&&cx>clipX)continue;const P=[];for(let i=0;i<r.length;i+=2){const p=proj([r[i],y,r[i+1]]);if(!p)return;P.push(p)}const c=colFn(cx,cz,h0,B);if(!c)continue;g.fillStyle=rgba(c,a);g.beginPath();P.forEach((p,m)=>m?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill()}}
// map an image onto a 3D parallelogram (o = top-left, ex/ey = edge vectors)
function img3(img,o,ex,ey,a=1){const p=proj(o),px=proj(o.map((v,i)=>v+ex[i])),py=proj(o.map((v,i)=>v+ey[i]));if(!p||!px||!py)return;g.save();g.globalAlpha=a;g.setTransform((px[0]-p[0])/img.width,(px[1]-p[1])/img.width,(py[0]-p[0])/img.height,(py[1]-p[1])/img.height,p[0],p[1]);g.drawImage(img,0,0);g.restore()}
function mkC(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
// ---------------------------------------------------------------- shared data
let V9=null;
function v9init(){if(V9)return V9;V9={};const r=rng(909);
  // buildings that changed between passes (near the hero, so the stack reads)
  V9.chg=[];const near=BLK.b.map((b,i)=>[Math.hypot(b[0]-HX*0.6,b[1]-HZ*0.6),i]).sort((a,b)=>a[0]-b[0]).slice(0,500);for(let k=0;k<14;k++)V9.chg.push(near[Math.floor(r()*near.length)][1]);V9.chgSet=new Set(V9.chg.map(i=>BLK.b[i]));
  // height field of the district for the sensing mesh
  const NX=64,NZ=52;V9.NX=NX;V9.NZ=NZ;V9.hf=new Float32Array((NX+1)*(NZ+1));for(const [cx,cz,h0] of BLK.b){const i=Math.round((cx+4.4)/8.8*NX),j=Math.round((cz+3.6)/7.2*NZ);for(let di=-1;di<=1;di++)for(let dj=-1;dj<=1;dj++){const q=(j+dj)*(NX+1)+(i+di);if(q>=0&&q<V9.hf.length)V9.hf[q]=Math.max(V9.hf[q],Math.max(h0,0.012)*1.5*(di||dj?0.6:1))}}
  V9.node=[];for(let j=0;j<=NZ;j++)for(let i=0;i<=NX;i++){const x=-4.4+i/NX*8.8,z=-3.6+j/NZ*7.2;const h=V9.hf[j*(NX+1)+i];const k=r();V9.node.push([x,h+0.03,z,k<0.10?1:k<0.22?2:0,r()])}
  // intersections: path vertices shared by several street paths
  const cnt=new Map();BLK.w.forEach((w,wi)=>{const seen=new Set();for(let k=0;k<w.length;k+=2){const key=Math.round(w[k]/0.06)+','+Math.round(w[k+1]/0.06);if(seen.has(key))continue;seen.add(key);cnt.set(key,(cnt.get(key)||0)+1)}});
  V9.ix=[];for(const [key,c] of cnt){if(c<3)continue;const [a,b]=key.split(',').map(Number);const x=a*0.06,z=b*0.06;if(V9.ix.some(p=>Math.hypot(p[0]-x,p[1]-z)<0.32))continue;V9.ix.push([x,z,r()])}
  V9.tall=BLK.b.filter(b=>b[2]>0.16).map(b=>[b[0],b[2]*1.5,b[1],r()]);
  // satellite pane: pixelated top view around the hero
  const sc=mkC(96,64),x=sc.getContext('2d');x.fillStyle='#1a1b1d';x.fillRect(0,0,96,64);const wx=2.4,wz=1.6,X0=HX-wx/2,Z0=HZ-wz/2;
  x.fillStyle='#3a3936';for(const w of BLK.w)for(let k=0;k<w.length;k+=2){const u=(w[k]-X0)/wx*96,v=(w[k+1]-Z0)/wz*64;x.fillRect(u-1,v-1,2,2)}
  for(const [cx,cz,h0,rr] of BLK.b){if(Math.abs(cx-HX)>wx*0.7||Math.abs(cz-HZ)>wz*0.7)continue;const c=roofCol(cx,cz,h0*160).map(v=>Math.min(255,v*1.25));x.fillStyle=rgba(c,1);x.beginPath();for(let i=0;i<rr.length;i+=2){const u=(rr[i]-X0)/wx*96,v=(rr[i+1]-Z0)/wz*64;i?x.lineTo(u,v):x.moveTo(u,v)}x.closePath();x.fill()}
  const big=mkC(384,256),bx=big.getContext('2d');bx.imageSmoothingEnabled=false;bx.drawImage(sc,0,0,384,256);V9.satImg=big;
  V9.pane=[mkC(384,256),mkC(384,256),mkC(384,256),mkC(384,256)];
  return V9}
// ---------------------------------------------------------------- S07 · 卫星每次过境记录地表变化（45.3–49.6）
// 轨道视角：卫星扫过，扫过处生成一张新影像；新影像升起叠到前几次过境之上，几处地表变化被橙色勾出，并连回地面
function shotPass(t){const u=t-45.3;v9init();bg();
  const cz=ease(clamp(u/4.3));setCam([lerp(-6.6,-4.6,cz),lerp(6.2,5.4,cz),lerp(9.8,8.6,cz)],[0.6,lerp(2.0,2.3,cz),-0.4],46);
  drawBlock(t,{dense:0.25});
  const scan=ease(clamp(u/1.7)),sx=lerp(-5.4,5.4,scan);const rise=ease(clamp((u-1.7)/1.2));const diff=clamp((u-2.7)/0.6);
  const Ys=[2.3,3.15,4.0];const plate=(y,a,col)=>{const P=[[-4.4,y,-3.6],[4.4,y,-3.6],[4.4,y,3.6],[-4.4,y,3.6]].map(proj);poly2(P,`rgba(14,15,18,${a})`,rgba(col,0.6),1.4)};
  // older passes already floating (dim, cooler)
  for(let k=2;k>=1;k--){const y=Ys[k];const a=0.42-0.1*(k-1);plate(y,0.55,[200,206,216]);
    flatSheet(y,a,(cx,cz,h0,B)=>V9.chgSet.has(B)?null:roofCol(cx,cz,h0*160).map(v=>v*0.9+18),undefined);
    const P=[[-4.4,y,-3.6],[4.4,y,-3.6],[4.4,y,3.6],[-4.4,y,3.6]].map(proj);poly2(P,null,`rgba(210,216,226,${0.35})`,1);
    const lp=proj([-4.4,y,3.6]);if(lp)text(['','上次过境 · 10:47','更早 · 09:12'][k],lp[0]-16,lp[1]+8,28,'rgba(214,220,230,0.85)','right',600,2)}
  // the new capture: painted on the ground as the swath passes, then lifting into the stack
  const yN=lerp(0.03,Ys[0],rise);const aN=lerp(0.62,0.75,rise);if(rise>0)plate(yN,0.6*rise,C_OR2);
  flatSheet(yN,aN,(cx,cz,h0)=>roofCol(cx,cz,h0*160).map(v=>Math.min(255,v*1.35+20)),rise>0?undefined:sx);
  if(rise>0){const P=[[-4.4,yN,-3.6],[4.4,yN,-3.6],[4.4,yN,3.6],[-4.4,yN,3.6]].map(proj);poly2(P,null,rgba(C_OR2,0.55*rise),1.4);const lp=proj([-4.4,yN,3.6]);if(lp)text('本次过境 · 12:21',lp[0]-16,lp[1]+8,32,rgba(C_OR2,rise),'right',700,2)}
  // what changed: present in the new capture, not in the old ones
  g.globalCompositeOperation='lighter';
  if(diff>0)V9.chg.forEach((bi,k)=>{const b=BLK.b[bi];const a=diff*clamp((u-2.7-k*0.04)/0.3);if(a<=0)return;const rr=b[3];
    const P=[];for(let i=0;i<rr.length;i+=2)P.push(proj([rr[i],yN+0.004,rr[i+1]]));poly2(P,rgba(C_OR,0.55*a),rgba(C_OR2,a),2);
    for(const y of [Ys[1],Ys[2]]){const Q=[];for(let i=0;i<rr.length;i+=2)Q.push(proj([rr[i],y,rr[i+1]]));poly2(Q,null,`rgba(220,226,236,${0.5*a})`,1)}
    line3([b[0],0.02,b[1]],[b[0],Ys[2],b[1]],rgba(C_OR2,0.55*a),1.4);const q=proj([b[0],0.02,b[1]]);if(q)glowDot(q,40,C_OR,0.5*a)});
  // swath: a light curtain from the satellite to the ground line under it
  const S=[sx,6.0,2.6];if(scan<1){const a=Math.sin(scan*Math.PI)*0.9+0.1;const p=proj(S),l=proj([sx,0.03,-3.9]),r2=proj([sx,0.03,3.9]);if(p&&l&&r2){const gg=g.createLinearGradient(p[0],p[1],(l[0]+r2[0])/2,(l[1]+r2[1])/2);gg.addColorStop(0,rgba(C_OR2,0.35*a));gg.addColorStop(1,rgba(C_OR,0.14*a));g.fillStyle=gg;g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(l[0],l[1]);g.lineTo(r2[0],r2[1]);g.closePath();g.fill();g.strokeStyle=rgba(C_OR2,0.9*a);g.lineWidth=3;g.beginPath();g.moveTo(l[0],l[1]);g.lineTo(r2[0],r2[1]);g.stroke()}}
  // the satellite itself (body + two panels), continuing along its track after the scan
  const SX=lerp(-6.5,9,clamp(u/3.4));const Sp=[SX,6.0,2.6];const pb=proj(Sp);if(pb){const pl=proj([SX,6.0,1.85]),pr=proj([SX,6.0,3.35]),pw=proj([SX+0.12,6.0,2.6]);
    if(pl&&pr&&pw){const dx=pw[0]-pb[0],dy=pw[1]-pb[1];g.globalCompositeOperation='source-over';for(const pp of [pl,pr]){g.fillStyle='rgba(70,84,104,0.95)';g.beginPath();g.moveTo(pp[0]-dx,pp[1]-dy);g.lineTo(pp[0]+dx,pp[1]+dy);g.lineTo(pb[0]+dx*0.6,pb[1]+dy*0.6);g.lineTo(pb[0]-dx*0.6,pb[1]-dy*0.6);g.closePath();g.fill();g.strokeStyle='rgba(200,214,232,0.8)';g.lineWidth=1;g.stroke()}
      g.globalCompositeOperation='lighter';glowDot(pb,110,C_OR,0.6);glowDot(pb,22,[255,240,210],1)}
    const pt=proj([SX-6,6.0,2.6]);if(pt){const gg=g.createLinearGradient(pt[0],pt[1],pb[0],pb[1]);gg.addColorStop(0,'rgba(255,200,120,0)');gg.addColorStop(1,'rgba(255,200,120,0.5)');g.strokeStyle=gg;g.lineWidth=2;g.beginPath();g.moveTo(pt[0],pt[1]);g.lineTo(pb[0],pb[1]);g.stroke()}}
  g.globalCompositeOperation='source-over';vignette()}
// ---------------------------------------------------------------- S08 · 地面感知层 → 精细到路口 → 精细到分钟（49.6–57.4）
function shotGround(t){const u=t-49.6;v9init();bg();
  const dive=ease(clamp((u-3.4)/1.7)),orb=clamp((u-5.0)/2.8);
  const az=0.35+u*0.03;const A=[Math.sin(az)*7.6+0.4,4.6,Math.cos(az)*7.6-0.4],AT=[0.4,0.2,-0.5];
  const az2=0.2+orb*0.7;const B=[HX+Math.sin(az2)*lerp(1.5,1.9,orb),lerp(1.2,1.25,orb),HZ+Math.cos(az2)*lerp(1.5,1.9,orb)],BT=[HX,lerp(0.18,0.6,ease(orb)),HZ];
  setCam(A.map((v,i)=>lerp(v,B[i],dive)),AT.map((v,i)=>lerp(v,BT[i],dive)),lerp(44,50,dive));
  drawBlock(t,{dense:lerp(0.45,1,dive)});
  const grow=ease(clamp((u-0.2)/2.6));const Rm=grow*9.5;const NX=V9.NX;
  curved(()=>{g.globalCompositeOperation='lighter';
    // the sensing layer: a fine mesh draped over the district, spreading out from the hero
    const fade=1-0.75*dive;const nd=V9.node;
    for(let j=0;j<=V9.NZ;j++)for(let i=0;i<=NX;i++){const n=nd[j*(NX+1)+i];const d=Math.hypot(n[0]-HX,n[2]-HZ);if(d>Rm)continue;const ea=clamp((Rm-d)/1.2)*fade;const p=proj(n);if(!p)continue;
      if(i<NX){const m=nd[j*(NX+1)+i+1];const q=proj(m);if(q){g.strokeStyle=`rgba(235,222,196,${0.30*ea})`;g.lineWidth=1;g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(q[0],q[1]);g.stroke()}}
      if(j<V9.NZ){const m=nd[(j+1)*(NX+1)+i];const q=proj(m);if(q){g.strokeStyle=`rgba(235,222,196,${0.30*ea})`;g.lineWidth=1;g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(q[0],q[1]);g.stroke()}}
      if(n[3]){const col=n[3]===1?C_OR:C_SENW;const pulse=0.6+0.4*Math.sin(t*3+n[4]*20);const s=clamp(60/p[2],2,7);glowDot(p,s*1.8,col,0.35*ea*pulse);g.fillStyle=rgba(n[3]===1?C_OR2:[230,244,250],0.95*ea);g.fillRect(p[0]-s/4,p[1]-s/4,s/2,s/2)}}
    // cameras throw warm coverage onto the street
    for(let k=0;k<nd.length;k+=7){const n=nd[k];if(n[3]!==1)continue;const d=Math.hypot(n[0]-HX,n[2]-HZ);if(d>Rm)continue;camPool(n[0],n[2],0.18,C_OR,0.06*fade*clamp((Rm-d)/1.2))}
    g.globalCompositeOperation='source-over'});
  // space down to the crossing: the grid subdivides around the hero and locks onto one intersection
  const sub=clamp((u-3.5)/1.4),lockA=clamp((u-4.6)/0.4);
  if(sub>0){g.globalCompositeOperation='lighter';for(let lv=0;lv<4;lv++){const a=clamp(sub*4-lv)*(1-0.6*orb);if(a<=0)continue;const half=[1.1,0.55,0.28,0.14][lv],n=[4,4,4,4][lv]*(lv+1);const yy=0.025;
      for(let k=0;k<=n;k++){const f=-half+2*half*k/n;line3([HX+f,yy,HZ-half],[HX+f,yy,HZ+half],`rgba(255,214,150,${0.5*a})`,1.2);line3([HX-half,yy,HZ+f],[HX+half,yy,HZ+f],`rgba(255,214,150,${0.5*a})`,1.2)}}
    // lock frame: corner brackets around the crossing
    if(lockA>0){const h=0.13,c=0.05,yy=0.03;for(const [sx2,sz2] of [[-1,-1],[1,-1],[1,1],[-1,1]]){line3([HX+sx2*h,yy,HZ+sz2*h],[HX+sx2*(h-c),yy,HZ+sz2*h],rgba(C_OR2,lockA),3);line3([HX+sx2*h,yy,HZ+sz2*h],[HX+sx2*h,yy,HZ+sz2*(h-c)],rgba(C_OR2,lockA),3)}camPool(HX,HZ,0.16,C_OR,0.35*lockA)}
    g.globalCompositeOperation='source-over'}
  // time down to the minute: the crossing's state, one slice per minute, stacking upward
  if(orb>0){const nS=Math.floor(orb*26)+1,fr=(orb*26)%1;const half=0.17;
    for(let s=0;s<nS;s++){const age=nS-1-s+fr;const y=0.06+age*0.042;if(y>1.25)continue;const a=clamp(orb*3)*(s===nS-1?fr:1)*clamp(1.4-y);const r=rng(4000+s);
      const P=[[HX-half,y,HZ-half],[HX+half,y,HZ-half],[HX+half,y,HZ+half],[HX-half,y,HZ+half]].map(proj);if(P.some(p=>!p))continue;poly2(P,`rgba(16,16,20,${0.7*a})`,null);
      // the slice carries this minute's activity pattern (5×5 cells)
      for(let i=0;i<5;i++)for(let j=0;j<5;j++){const v=Math.pow(r(),2.2);if(v<0.08)continue;const x0=HX-half+i*2*half/5,z0=HZ-half+j*2*half/5;const Q=[[x0,y,z0],[x0+2*half/5,y,z0],[x0+2*half/5,y,z0+2*half/5],[x0,y,z0+2*half/5]].map(proj);poly2(Q,rgba(v>0.6?C_OR:[226,220,206],(0.25+0.7*v)*a),null)}
      poly2(P,null,rgba(s===nS-1?C_OR2:[214,220,230],(s===nS-1?0.95:0.35)*a),s===nS-1?1.8:0.8);
      if(s===nS-1||s%5===0){const lp=proj([HX+half+0.03,y,HZ-half]);const mm=41+s;if(lp)text(`09:${String(mm%60).padStart(2,'0')}`,lp[0]+10,lp[1]+6,s===nS-1?24:18,s===nS-1?rgba(C_OR2,a):`rgba(214,220,230,${0.6*a})`,'left',600,1)}}
    // minute ring on the ground
    g.globalCompositeOperation='lighter';for(let k=0;k<60;k++){const an=k/60*6.2832-Math.PI/2;const R1=0.24,R2=k%5?0.26:0.28;const on=k<=Math.floor(orb*26)%60;line3([HX+Math.cos(an)*R1,0.03,HZ+Math.sin(an)*R1],[HX+Math.cos(an)*R2,0.03,HZ+Math.sin(an)*R2],on?rgba(C_OR2,0.9*clamp(orb*3)):`rgba(200,206,216,${0.4*clamp(orb*3)})`,on?2:1)}g.globalCompositeOperation='source-over'}
  vignette()}
// ---------------------------------------------------------------- S09 · 网络信息与天上地上观测相互校正（57.4–61.6）
// one event (a crowd at the crossing). three reports of it: a message, a satellite pass, a camera — each puts it at a slightly different place and time; they pull each other into one
const MSGS=['路口人好多','这边排队排到街角了','绿灯过不去'];
function shotCross(t){const u=t-57.4;v9init();bg();setCam([HX+0.95+u*0.08,1.5,HZ+2.05],[HX+0.02,0.22,HZ-0.12],50);
  drawBlock(t,{dense:1});
  const E={sat:[HX-0.6,HZ-0.38],cam:[HX+0.04,HZ-0.05],net:[HX+0.62,HZ+0.32]};const F=[HX+0.02,HZ-0.03];
  const conv=ease(clamp((u-2.1)/1.1)),fin=clamp((u-3.0)/0.5);const at=k=>[lerp(E[k][0],F[0],conv),lerp(E[k][1],F[1],conv)];
  // the event itself: a crowd thickening at the crossing
  g.globalCompositeOperation='lighter';{const r=rng(31);for(let i=0;i<260;i++){const a=r()*6.283,d=Math.abs((r()+r()+r()-1.5))*0.16;const p=proj([F[0]+Math.cos(a)*d,0.02,F[1]+Math.sin(a)*d*0.8]);if(!p)continue;const s=clamp(14/p[2],1.5,4);g.fillStyle=`rgba(246,236,214,${0.75})`;g.fillRect(p[0]-s/2,p[1]-s/2,s,s)}}
  // satellite: a beam from orbit, its footprint on its estimate
  const sa=clamp((u-0.7)/0.4)*(1-0.85*fin);if(sa>0){const s=at('sat');const top=proj([s[0]-0.6,3.2,s[1]-3.4]);const hw=0.17;const Q=[[-hw,-hw],[hw,-hw],[hw,hw],[-hw,hw]].map(([dx,dz])=>proj([s[0]+dx,0.03,s[1]+dz]));
    if(top&&Q.every(q=>q)){const gg=g.createLinearGradient(top[0],top[1],Q[2][0],Q[2][1]);gg.addColorStop(0,rgba(C_SATW,0));gg.addColorStop(1,rgba(C_SATW,0.22*sa));g.fillStyle=gg;for(let k=0;k<4;k++){g.beginPath();g.moveTo(top[0],top[1]);g.lineTo(Q[k][0],Q[k][1]);g.lineTo(Q[(k+1)%4][0],Q[(k+1)%4][1]);g.closePath();g.fill()}}
    poly2(Q,rgba(C_SATW,0.12*sa),rgba(C_SATW,0.95*sa),2.5)}
  // camera: a pole on the corner, its view cone onto its estimate
  const ca=clamp((u-1.1)/0.4);if(ca>0){const s=at('cam');const pole=[HX-0.32,0,HZ+0.3];line3(pole,[pole[0],0.32,pole[2]],`rgba(220,224,232,${ca})`,2.5);const hp=proj([pole[0],0.32,pole[2]]);
    const L=[[-0.12,-0.1],[0.14,-0.08],[0.12,0.12],[-0.1,0.12]].map(([dx,dz])=>proj([s[0]+dx,0.03,s[1]+dz]));if(hp&&L.every(q=>q)){g.fillStyle=rgba(C_OR,0.13*ca);g.beginPath();g.moveTo(hp[0],hp[1]);L.forEach(q=>g.lineTo(q[0],q[1]));g.closePath();g.fill();glowDot(hp,26,C_OR,0.8*ca)}
    camPool(s[0],s[1],0.2,C_OR,0.45*ca)}
  g.globalCompositeOperation='source-over';
  // messages fall in and pin themselves (roughly) to where they talk about
  MSGS.forEach((m,i)=>{const st=0.0+i*0.28;const k=ease(clamp((u-st)/1.0));if(k<=0)return;const s=at('net');const off=[[0,0],[0.3,-0.35],[-0.15,0.32]][i];const gp=[s[0]+off[0]*0.35,s[1]+off[1]*0.35];
    const home=[[s[0]+0.1,0.62,s[1]+0.05],[s[0]+0.55,0.86,s[1]-0.55],[s[0]-0.05,1.0,s[1]+0.5]][i];const y=lerp(home[1]+1.6,home[1],k);const p=proj([home[0],y,home[2]]);if(!p)return;
    const a=clamp((u-st)/0.3)*(1-0.6*fin);const fs=34;g.font=`500 ${fs}px ${FONT}`;const w=g.measureText(m).width+fs*1.1,h=fs*1.75;
    g.fillStyle=`rgba(20,19,28,${0.88*a})`;g.fillRect(p[0]-w/2,p[1]-h,w,h);g.strokeStyle=rgba(C_NETW,0.9*a);g.lineWidth=1.6;g.strokeRect(p[0]-w/2,p[1]-h,w,h);text(m,p[0],p[1]-h*0.3,fs,`rgba(240,238,250,${a})`,'center',500);
    const gq=proj([gp[0],0.02,gp[1]]);if(gq&&k>0.85){g.strokeStyle=rgba(C_NETW,0.7*a);g.lineWidth=1.4;g.setLineDash([5,5]);g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(gq[0],gq[1]);g.stroke();g.setLineDash([])}});
  // three estimates, three places: linked by a tension triangle, then pulled together
  g.globalCompositeOperation='lighter';const ks=['sat','cam','net'],cols=[C_SATW,C_OR,C_NETW],st0=[0.7,1.1,0.9];const pts=ks.map(k=>{const s=at(k);return proj([s[0],0.03,s[1]])});
  const la=clamp((u-1.5)/0.4)*(1-fin);if(la>0&&pts.every(p=>p)){g.setLineDash([10,8]);g.strokeStyle=`rgba(240,240,246,${0.85*la})`;g.lineWidth=2.5;g.beginPath();g.moveTo(pts[0][0],pts[0][1]);g.lineTo(pts[1][0],pts[1][1]);g.lineTo(pts[2][0],pts[2][1]);g.closePath();g.stroke();g.setLineDash([])}
  pts.forEach((p,i)=>{if(!p)return;const a=clamp((u-st0[i])/0.4)*(1-fin);if(a<=0)return;glowDot(p,50,cols[i],0.5*a);g.fillStyle=rgba(cols[i],a);g.beginPath();g.arc(p[0],p[1],9,0,7);g.fill();
    if(conv<0.9){const lb=['卫星 · 10:47','摄像头 · 09:43','网络 · 约 09:40'][i];g.globalCompositeOperation='source-over';text(lb,p[0]+(i===0?-18:18),p[1]+(i===2?40:-18),30,rgba(cols[i],a*(1-conv)),i===0?'right':'left',700,1);g.globalCompositeOperation='lighter'}});
  // corrected: one place, one time, confidence filling
  if(fin>0){const p=proj([F[0],0.03,F[1]]);if(p){glowDot(p,120,C_OR,0.5*fin);g.globalCompositeOperation='source-over';const R0=62,k2=ease(clamp((u-3.1)/0.9));g.strokeStyle=`rgba(40,40,46,${0.85*fin})`;g.lineWidth=7;g.beginPath();g.arc(p[0],p[1],R0,0,7);g.stroke();g.strokeStyle=rgba(C_OR2,fin);g.beginPath();g.arc(p[0],p[1],R0,-Math.PI/2,-Math.PI/2+6.2832*0.93*k2);g.stroke();
    text('同一件事 · 09:43',p[0]+R0+24,p[1]-8,36,rgba(C_OR2,fin),'left',700,2);text(`置信度 ${Math.round(93*k2)}%`,p[0]+R0+24,p[1]+34,28,`rgba(240,240,244,${fin})`,'left',600,1)}}
  g.globalCompositeOperation='source-over';vignette()}
// ---------------------------------------------------------------- pane contents (S10/S11)
function paneSat(c,t){const x=c.getContext('2d');x.drawImage(V9.satImg,0,0);const sy=((t*90)%300)-20;const gg=x.createLinearGradient(0,sy-30,0,sy);gg.addColorStop(0,'rgba(255,200,120,0)');gg.addColorStop(1,'rgba(255,200,120,0.35)');x.fillStyle=gg;x.fillRect(0,sy-30,384,30);
  x.strokeStyle='rgba(255,170,48,0.9)';x.lineWidth=3;x.strokeRect(150,96,80,60)}
function paneCam(c,t){const x=c.getContext('2d');if(VC.img)x.drawImage(VC.img,0,0,384,256);x.fillStyle='rgba(0,0,0,0.15)';x.fillRect(0,0,384,256);const r=rng(Math.floor(t*6));x.strokeStyle='rgba(255,186,110,0.95)';x.lineWidth=2;for(let i=0;i<9;i++){const bx=40+r()*280,by=120+r()*90,bw=14+r()*16;x.strokeRect(bx,by,bw,bw*1.9)}
  x.fillStyle='rgba(0,0,0,0.55)';x.fillRect(250,8,126,24);x.font='600 16px '+FONT;x.fillStyle='#fff';x.fillText('09:43:'+String(Math.floor(t*25)%60).padStart(2,'0'),258,26)}
function paneSen(c,t){const x=c.getContext('2d');x.fillStyle='#0d1114';x.fillRect(0,0,384,256);x.strokeStyle='rgba(150,214,226,0.12)';x.lineWidth=1;for(let i=0;i<=12;i++){x.beginPath();x.moveTo(i*32,0);x.lineTo(i*32,256);x.stroke()}for(let j=0;j<=8;j++){x.beginPath();x.moveTo(0,j*32);x.lineTo(384,j*32);x.stroke()}
  const cols=['rgba(150,214,226,0.95)','rgba(206,230,180,0.85)','rgba(240,220,170,0.85)'];cols.forEach((cc,k)=>{x.strokeStyle=cc;x.lineWidth=2;x.beginPath();for(let i=0;i<=384;i+=3){const s=i/384*8+t*2.2+k*3;const v=Math.sin(s*1.7+k)*0.5+Math.sin(s*4.3+k*2)*0.25+Math.sin(s*11+k)*0.12;const y=50+k*75+v*30;i?x.lineTo(i,y):x.moveTo(i,y)}x.stroke()})}
const NETL=['09:38  这边排队排到街角了','09:39  路口人好多','09:40  刚过去，有点堵','09:41  人行道站满了人','09:41  绿灯过不去','09:42  出口那边好走点','09:42  公交晚了几分钟','09:43  人好像少一些了'];
function paneNet(c,t){const x=c.getContext('2d');x.fillStyle='#121019';x.fillRect(0,0,384,256);const off=(t*26)%34;x.font='500 19px '+FONT;for(let i=0;i<10;i++){const s=NETL[(i+Math.floor(t*26/34))%NETL.length];const y=30+i*34-off;x.fillStyle=i===3?'rgba(255,212,96,0.95)':'rgba(214,208,236,0.8)';x.fillText(s,16,y)}}
const PANES=[['卫星',paneSat,C_SATW],['摄像头',paneCam,C_OR],['传感器',paneSen,C_SENW],['网络',paneNet,C_NETW]];
// four panes standing over the crossing; each looks at the place its own way
function paneGeom(i){const xs=[-1.62,-0.54,0.54,1.62];const a=-xs[i]*0.13;const cx=HX+xs[i],cz=HZ+0.55+Math.abs(xs[i])*0.12;const w=1.04,h=0.72;const ex=[Math.cos(a)*w,0,Math.sin(a)*w];const y=1.62+(i%2?0.06:-0.04);return{o:[cx-ex[0]/2,y,cz-ex[2]/2],ex,ey:[0,-h,0],w,h,c:[cx,y-h/2,cz]}}
const PANE_SEE=[[HX-0.42,HZ-0.3],[HX+0.04,HZ-0.02],[HX+0.45,HZ-0.22],[HX+0.3,HZ+0.38]];
function camFour(t){const u=t-61.6;setCam([HX+u*0.03,1.72+u*0.02,HZ+3.35-u*0.04],[HX,1.12,HZ+0.2],54)}
function shotFour(t){const u=t-61.6;v9init();bg();camFour(t);drawBlock(t,{dense:0.8});
  const pop=[0.2,0.95,1.9,2.35],diverge=clamp((u-2.9)/0.6);
  for(let i=0;i<4;i++){const a=ease(clamp((u-pop[i])/0.5));if(a<=0)continue;const G=paneGeom(i);const [nm,fn,col]=PANES[i];fn(V9.pane[i],t);
    const lift=(1-a)*0.5;const o=[G.o[0],G.o[1]-lift,G.o[2]];
    // sight lines from the pane down to the ground — first all at the crossing, then each at a different spot
    const see=[lerp(HX,PANE_SEE[i][0],diverge),lerp(HZ,PANE_SEE[i][1],diverge)];const bot=[G.c[0],o[1]-G.h,G.c[2]];g.globalCompositeOperation='lighter';
    for(const f of [0.15,0.85]){line3([o[0]+G.ex[0]*f,bot[1],o[2]+G.ex[2]*f],[see[0],0.03,see[1]],rgba(col,0.35*a),1.2)}camPool(see[0],see[1],0.15,col,0.45*a);g.globalCompositeOperation='source-over';
    img3(V9.pane[i],o,G.ex,G.ey,0.95*a);const P=[o,o.map((v,m)=>v+G.ex[m]),o.map((v,m)=>v+G.ex[m]+G.ey[m]),o.map((v,m)=>v+G.ey[m])].map(proj);poly2(P,null,rgba(col,0.9*a),1.6);
    if(P[0])text(nm,P[0][0]+4,P[0][1]-14,34,rgba(col,a),'left',700,6);
    // what each one reports — different readings of the same moment
    if(diverge>0&&P[3]){const rd=['一片人群 · 10:47','37 人 · 09:43','噪声 68 dB · 09:43','"很堵" · 约 09:40'][i];text(rd,P[3][0]+4,P[3][1]+44,30,rgba(col,diverge),'left',700,1)}}
  vignette()}
// ---------------------------------------------------------------- S11 · 同一种语言 → 统一时空框架（66.4–72.9）
// the four panes break into cells; on the way down every cell becomes the same unit and settles into a space-time lattice
const LAT={nx:10,nz:8,ny:7,dx:0.2,dy:0.16};
function latPos(i,j,k,cx=HX,cz=HZ){return[cx+(i-(LAT.nx-1)/2)*LAT.dx,0.12+k*LAT.dy,cz+(j-(LAT.nz-1)/2)*LAT.dx]}
function cube3(c,s,col,a,edge){const v=[[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1],[-1,1,-1],[1,1,-1],[1,1,1],[-1,1,1]].map(d=>proj(c.map((x,m)=>x+d[m]*s)));if(v.some(p=>!p))return;
  const faces=[[4,5,6,7,1.0],[0,1,5,4,0.62],[1,2,6,5,0.5],[2,3,7,6,0.62],[3,0,4,7,0.5]];for(const [a1,b,c2,d,l] of faces){const P=[v[a1],v[b],v[c2],v[d]];const cr=(P[1][0]-P[0][0])*(P[2][1]-P[0][1])-(P[1][1]-P[0][1])*(P[2][0]-P[0][0]);if(cr>=0)continue;poly2(P,rgba(col.map(x=>x*l),a),edge?rgba(edge,a*0.8):null,0.7)}}
function shotLang(t){const u=t-66.4;v9init();bg();
  const pull=ease(clamp((u-3.0)/2.4));
  // camera: from the four-pane view to high and wide over the whole district
  const u0=61.6+4.8;const a0=[HX+4.8*0.03,1.72+4.8*0.02,HZ+3.35-4.8*0.04],t0=[HX,1.12,HZ+0.2];const az=0.6+u*0.02;const a1=[Math.sin(az)*7.8+0.3,7.4,Math.cos(az)*7.8-0.3],t1=[0.3,0.7,-0.4];
  setCam(a0.map((v,i)=>lerp(v,a1[i],pull)),t0.map((v,i)=>lerp(v,t1[i],pull)),lerp(54,46,pull));
  drawBlock(t,{dense:lerp(0.8,0.35,pull)});
  const fly=ease(clamp(u/2.4));
  // source cells from each pane, travelling into the lattice
  const L=[];for(let i=0;i<4;i++){const G=paneGeom(i);const [nm,fn,col]=PANES[i];const cx=V9.pane[i].getContext('2d');fn(V9.pane[i],u0);const im=cx.getImageData(0,0,384,256).data;
    for(let a=0;a<12;a++)for(let b=0;b<8;b++){const id=i*96+a*8+b;const r=rng(id*7+3);const src=[G.o[0]+G.ex[0]*(a+0.5)/12,G.o[1]+G.ey[1]*(b+0.5)/8,G.o[2]+G.ex[2]*(a+0.5)/12];
      const q=((Math.floor((b+0.5)/8*256))*384+Math.floor((a+0.5)/12*384))*4;const pc=[im[q],im[q+1],im[q+2]].map(v=>Math.min(255,v*1.3+30));
      const li=Math.floor(r()*LAT.nx),lj=Math.floor(r()*LAT.nz),lk=Math.floor(r()*LAT.ny);const dst=latPos(li,lj,lk);
      const k=ease(clamp((fly*1.35-r()*0.35)));const mid=[(src[0]+dst[0])/2,Math.max(src[1],dst[1])+0.3,(src[2]+dst[2])/2];
      const p=[0,1,2].map(m=>{const A=lerp(src[m],mid[m],k),B=lerp(mid[m],dst[m],k);return lerp(A,B,k)});L.push([Math.hypot(...sub(p,M.p)),p,k,pc,col])}}
  // the panes themselves dissolve as their cells leave
  const pa=1-clamp(u/0.8);if(pa>0)for(let i=0;i<4;i++){const G=paneGeom(i);PANES[i][1](V9.pane[i],u0);img3(V9.pane[i],G.o,G.ex,G.ey,0.95*pa)}
  // lattice frame over the crossing
  const fa=clamp((u-0.6)/0.8)*(1-pull*0.7);if(fa>0){g.globalCompositeOperation='lighter';for(let i=0;i<LAT.nx;i+=2)for(let j=0;j<LAT.nz;j+=2){const p0=latPos(i,j,0),p1=latPos(i,j,LAT.ny-1);line3([p0[0],0.03,p0[2]],p1,`rgba(220,214,200,${0.22*fa})`,0.8)}
    for(let k=0;k<LAT.ny;k+=1){const c=[latPos(0,0,k),latPos(LAT.nx-1,0,k),latPos(LAT.nx-1,LAT.nz-1,k),latPos(0,LAT.nz-1,k)].map(proj);poly2(c,null,`rgba(220,214,200,${0.25*fa})`,0.8)}g.globalCompositeOperation='source-over'}
  L.sort((a,b)=>b[0]-a[0]);const one=[226,150,62];
  for(const [d,p,k,pc,col] of L){const col2=pc.map((v,m)=>lerp(v,one[m],sstep(0.35,0.9,k)));const s=0.034*(1-pull*0.3);if(k<0.5){const q=proj(p);if(!q)continue;const w=clamp(320/q[2],4,40)*lerp(1,0.6,k*2);g.fillStyle=rgba(col2,0.95);g.fillRect(q[0]-w/2,q[1]-w*0.35,w,w*0.7)}else cube3(p,s,col2,0.95,k>0.6?C_OR2:null)}
  if(u<2.6){const a=clamp(u/0.3)*(1-clamp((u-2.2)/0.4));}
  // every judgment filed into one space-time framework — the lattice spreads over the whole district
  if(pull>0){curved(()=>{g.globalCompositeOperation='lighter';const N=12,M2=10,spx=8.8/N,spz=7.2/M2;const sp=pull;
      for(let i=0;i<=N;i++){const x=-4.4+i*spx;const a=sp*clamp(1.4-Math.abs(x-HX)/8);line3([x,0.04,-3.6],[x,0.04,3.6],`rgba(255,206,140,${0.45*a})`,1.3)}
      for(let j=0;j<=M2;j++){const z=-3.6+j*spz;line3([-4.4,0.04,z],[4.4,0.04,z],`rgba(255,206,140,${0.45*sp})`,1.3)}
      for(let i=0;i<=N;i+=2)for(let j=0;j<=M2;j+=2){const x=-4.4+i*spx,z=-3.6+j*spz;line3([x,0.04,z],[x,1.6*sp,z],`rgba(236,226,206,${0.4*sp})`,1.2)}
      for(const y of [0.5,1.0,1.5]){const c=[[-4.4,y,-3.6],[4.4,y,-3.6],[4.4,y,3.6],[-4.4,y,3.6]].map(p=>proj([p[0],p[1]*sp,p[2]]));poly2(c,null,`rgba(236,226,206,${0.3*sp})`,1)}
      g.globalCompositeOperation='source-over';
      // judgments dropping into cells all over the city
      const r=rng(77);for(let n=0;n<420;n++){const i=Math.floor(r()*N),j=Math.floor(r()*M2),k=Math.floor(r()*3),st=r()*2.6;const x=-4.4+(i+0.5)*spx,z=-3.6+(j+0.5)*spz,y=(0.25+k*0.5)*sp;const kk=ease(clamp((u-3.4-st)/0.5));if(kk<=0)continue;
        const p=[x+(r()-.5)*spx*0.6,lerp(y+1.2,y,kk),z+(r()-.5)*spz*0.6];cube3(p,0.055,one,0.9*kk,C_OR2);if(kk<1){const q=proj(p);if(q){g.globalCompositeOperation='lighter';glowDot(q,30,C_OR,0.5*(1-kk));g.globalCompositeOperation='source-over'}}}});
    // axis words: where, where, when
    const ax=proj([-4.4,0.04,3.9]),az2=proj([4.7,0.04,-3.6]),at=proj([-4.4,1.75*pull,-3.6]);const la=clamp((u-4.0)/0.5);
    if(ax)text('经度',ax[0],ax[1]+40,36,`rgba(255,214,150,${la})`,'center',600,4);if(az2)text('纬度',az2[0]+20,az2[1],36,`rgba(255,214,150,${la})`,'left',600,4);if(at)text('时间 ↑',at[0],at[1]-16,36,`rgba(255,214,150,${la})`,'center',600,4)}
  vignette()}
// ---------------------------------------------------------------- S12 · 每个路口、街区、建筑都有自己的位置与时间轴（72.9–77.8）
function timeAxis(x,z,y0,h,col,a,lw,t,ph){const p0=proj([x,y0,z]),p1=proj([x,y0+h,z]);if(!p0||!p1)return;const gg=g.createLinearGradient(p0[0],p0[1],p1[0],p1[1]);gg.addColorStop(0,rgba(col,0.95*a));gg.addColorStop(1,rgba(col,0.08*a));g.strokeStyle=gg;g.lineWidth=lw;g.beginPath();g.moveTo(p0[0],p0[1]);g.lineTo(p1[0],p1[1]);g.stroke();
  for(let k=1;k<8;k++){const y=y0+h*k/8;const d=k%4?0.025:0.05;line3([x-d,y,z],[x+d,y,z],rgba(col,0.55*a*(1-k/9)),1)}
  const f=((t*0.3+ph)%1);const p=proj([x,y0+h*f,z]);if(p){g.fillStyle=rgba(col,a*(1-f));const s=clamp(60/p[2],2,6);g.fillRect(p[0]-s,p[1]-s/3,2*s,s*0.66)}
  g.globalCompositeOperation='lighter';glowDot(p0,clamp(90/p0[2],4,14),col,0.45*a);g.globalCompositeOperation='source-over'}
function shotForest(t){const u=t-72.9;v9init();bg();const k=ease(clamp(u/4.9));
  setCam([lerp(-3.6,1.2,k),lerp(1.35,1.7,k),lerp(3.6,2.9,k)],[lerp(-0.4,2.4,k),0.75,lerp(-1.0,-2.2,k)],56);
  drawBlock(t,{dense:0.6});
  const aI=clamp((u-0.2)/0.6),aB=clamp((u-1.3)/0.6),aT=clamp((u-2.0)/0.6);
  curved(()=>{
    // blocks: tall translucent columns over each block cell
    if(aB>0){const N=8,M2=6;for(let i=0;i<N;i++)for(let j=0;j<M2;j++){const r=rng(i*31+j*7);if(r()<0.35)continue;const x0=-4.4+i*8.8/N+0.08,z0=-3.6+j*7.2/M2+0.08,x1=x0+8.8/N-0.16,z1=z0+7.2/M2-0.16;const h=1.0+r()*0.6;const a=aB*clamp((u-1.3-r()*0.4)/0.5);
      for(const [xa,za,xb,zb] of [[x0,z0,x1,z0],[x1,z0,x1,z1],[x1,z1,x0,z1],[x0,z1,x0,z0]]){const P=[[xa,0.05,za],[xb,0.05,zb],[xb,h,zb],[xa,h,za]].map(proj);if(P.some(p=>!p))continue;const gg=g.createLinearGradient(P[0][0],P[0][1],P[3][0],P[3][1]);gg.addColorStop(0,`rgba(214,206,190,${0.10*a})`);gg.addColorStop(1,'rgba(214,206,190,0)');g.fillStyle=gg;g.beginPath();P.forEach((p,m)=>m?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill()}
      const ff=((t*0.3+r())%1)*h;const Q=[[x0,ff,z0],[x1,ff,z0],[x1,ff,z1],[x0,ff,z1]].map(proj);poly2(Q,null,`rgba(226,220,206,${0.35*a})`,1)}}
    // intersections
    if(aI>0)V9.ix.forEach(([x,z,r],n)=>{const a=aI*clamp((u-0.2-r*0.5)/0.4);if(a>0)timeAxis(x,z,0.03,1.3+r*0.7,C_OR,a,2.2,t,r)});
    // buildings: each tall building carries its own axis from its roof
    if(aT>0)V9.tall.forEach(([x,h,z,r])=>{const a=aT*clamp((u-2.0-r*0.5)/0.4);if(a>0)timeAxis(x,z,h,0.9+r*0.6,[232,236,244],a,1.6,t,r)});
  });
  
  vignette()}
// ---------------------------------------------------------------- S13 · 单一信号可能失真，多源融合方见真相（77.8–82.1）
// one time axis turned toward us as a chart: the camera trace alone spikes on a glare; three other sources arrive; the fused line follows the truth
function truth(x){return 0.36+0.24*Math.sin(x*2.1+0.4)+0.08*Math.sin(x*5.3)}
function shotTruth(t){const u=t-77.8;v9init();bg();setCam([HX+0.1+u*0.04,1.0,HZ+2.3],[HX+0.12,0.88,HZ+0.2],52);
  drawBlock(t,{dense:0.7,a:0.45});g.fillStyle='rgba(6,7,10,0.35)';g.fillRect(0,0,W,H);
  const X0=HX-1.25,X1=HX+1.45,Y0=0.32,YH=1.25,Z=HZ+0.2;const P=x=>[lerp(X0,X1,x),Y0+YH*x,Z];
  const pt=(x,v)=>proj([lerp(X0,X1,x),Y0+v*YH,Z]);
  const grow=clamp(u/1.4);const spike=x=>{const d=(x-0.62)/0.035;return Math.exp(-(d*d))*0.5};
  // axis frame
  const o=pt(0,0),e=pt(1,0),tp=pt(0,1);if(o&&e&&tp){g.strokeStyle='rgba(214,220,230,0.45)';g.lineWidth=1.2;g.beginPath();g.moveTo(tp[0],tp[1]);g.lineTo(o[0],o[1]);g.lineTo(e[0],e[1]);g.stroke();text('时间 →',e[0]-10,e[1]+34,22,'rgba(214,220,230,0.7)','right',500,2)}
  // the camera alone
  const camV=x=>truth(x)+spike(x)+0.02*Math.sin(x*40);const fus=clamp((u-2.0)/1.2),fx=clamp((u-2.6)/1.3);
  g.globalCompositeOperation='lighter';g.strokeStyle=rgba(C_OR,lerp(0.95,0.35,fus));g.lineWidth=3;g.beginPath();let first=1;for(let x=0;x<=grow;x+=0.004){const q=pt(x,camV(x));if(!q)continue;first?g.moveTo(q[0],q[1]):g.lineTo(q[0],q[1]);first=0}g.stroke();
  // the spike: glare on the lens
  if(grow>0.62){const q=pt(0.62,camV(0.62));const a=clamp((u-0.9)/0.3)*(1-0.6*fus);if(q){glowDot(q,90,[255,250,235],0.6*a);g.globalCompositeOperation='source-over';
      const w=420,h=280,X=q[0]-w-70,Y=q[1]+40;if(VC.img){g.save();g.globalAlpha=a;g.drawImage(VC.img,X,Y,w,h);const gg=g.createRadialGradient(X+w*0.65,Y+h*0.3,0,X+w*0.65,Y+h*0.3,w*0.55);gg.addColorStop(0,'rgba(255,255,250,1)');gg.addColorStop(1,'rgba(255,255,250,0)');g.fillStyle=gg;g.fillRect(X,Y,w,h);g.restore();g.strokeStyle=rgba(C_OR,a);g.lineWidth=1.5;g.strokeRect(X,Y,w,h);g.beginPath();g.moveTo(X+w,Y);g.lineTo(q[0],q[1]);g.stroke()}
      text('单一摄像头 · 逆光 · 读数失真',X,Y-16,32,`rgba(255,240,220,${a})`,'left',700,2);g.globalCompositeOperation='lighter'}}
  // other sources arrive, each in its own form
  if(fus>0){// satellite: a few discrete passes
    for(const x of [0.12,0.47,0.83]){if(x>fus)continue;const q=pt(x,truth(x)+0.02);if(q){glowDot(q,30,C_SATW,0.8);g.fillStyle=rgba(C_SATW,1);g.fillRect(q[0]-6,q[1]-6,12,12)}}
    // sensors: dense jittery trace
    g.strokeStyle=rgba(C_SENW,0.75);g.lineWidth=1.6;g.beginPath();first=1;for(let x=0;x<=fus;x+=0.004){const q=pt(x,truth(x)-0.03+0.03*Math.sin(x*90));if(!q)continue;first?g.moveTo(q[0],q[1]):g.lineTo(q[0],q[1]);first=0}g.stroke();
    // network: scattered reports
    const r=rng(12);for(let n=0;n<14;n++){const x=r();if(x>fus)continue;const q=pt(x,truth(x)+(r()-0.5)*0.12);if(q){g.strokeStyle=rgba(C_NETW,0.9);g.lineWidth=1.6;g.beginPath();g.arc(q[0],q[1],7,0,7);g.stroke()}}}
  // fused: a thick line with a narrowing confidence band; it does not follow the spike
  if(fx>0){g.globalCompositeOperation='source-over';const band=x=>lerp(0.12,0.035,fx);g.fillStyle=rgba(C_OR,0.16);g.beginPath();let pts=[];for(let x=0;x<=fx;x+=0.005){const a=pt(x,truth(x)+band(x)),b=pt(x,truth(x)-band(x));if(a&&b)pts.push([a,b])}
    if(pts.length>1){g.moveTo(pts[0][0][0],pts[0][0][1]);pts.forEach(p=>g.lineTo(p[0][0],p[0][1]));for(let i=pts.length-1;i>=0;i--)g.lineTo(pts[i][1][0],pts[i][1][1]);g.closePath();g.fill()}
    g.globalCompositeOperation='lighter';g.strokeStyle=rgba(C_OR2,1);g.lineWidth=5;g.beginPath();first=1;for(let x=0;x<=fx;x+=0.004){const q=pt(x,truth(x));if(!q)continue;first?g.moveTo(q[0],q[1]):g.lineTo(q[0],q[1]);first=0}g.stroke();
    const q=pt(fx,truth(fx));if(q){glowDot(q,60,C_OR,0.8)}
    if(fx>0.62){const a=clamp((fx-0.62)/0.15);const q1=pt(0.62,truth(0.62)),q2=pt(0.62,camV(0.62));if(q1&&q2){g.globalCompositeOperation='source-over';g.setLineDash([5,5]);g.strokeStyle=`rgba(236,238,242,${0.7*a})`;g.lineWidth=1.4;g.beginPath();g.moveTo(q1[0],q1[1]);g.lineTo(q2[0],q2[1]);g.stroke();g.setLineDash([]);text('多源融合 · 真实读数',q1[0]+20,q1[1]+56,36,rgba(C_OR2,a),'left',700,2)}}}
  g.globalCompositeOperation='source-over';
  // legend: four sources, four forms
  const lx=1460,ly=120;const items=[['摄像头',C_OR,'line'],['卫星',C_SATW,'sq'],['传感器',C_SENW,'thin'],['网络消息',C_NETW,'ring']];items.forEach(([nm,col,f],i)=>{const a=i===0?1:fus;if(a<=0)return;const y=ly+i*50;g.strokeStyle=rgba(col,a);g.fillStyle=rgba(col,a);g.lineWidth=f==='thin'?1.6:3;if(f==='sq')g.fillRect(lx,y-14,12,12);else if(f==='ring'){g.beginPath();g.arc(lx+6,y-8,7,0,7);g.stroke()}else{g.beginPath();g.moveTo(lx-6,y-8);g.lineTo(lx+22,y-8);g.stroke()}text(nm,lx+40,y,30,rgba(col,a),'left',600,2)});
  vignette()}
