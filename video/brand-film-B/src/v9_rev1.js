// ===== 第九版 · 第 1 批静帧修改（按 2026-11-03 标注）=====
// ---------- 卫星：小尺寸，但看得出是卫星（本体 + 两翼太阳能板 + 天线）
function satGlyph(p,dir,a=1,sc=1){if(!p)return;const ang=Math.atan2(dir[1],dir[0]);g.save();g.translate(p[0],p[1]);g.rotate(ang);g.globalAlpha=a;
  g.globalCompositeOperation='lighter';const gg=g.createRadialGradient(0,0,0,0,0,34*sc);gg.addColorStop(0,'rgba(255,190,90,0.55)');gg.addColorStop(1,'rgba(255,190,90,0)');g.fillStyle=gg;g.beginPath();g.arc(0,0,34*sc,0,7);g.fill();g.globalCompositeOperation='source-over';
  g.strokeStyle='rgba(210,214,222,0.9)';g.lineWidth=1.2*sc;g.beginPath();g.moveTo(0,-26*sc);g.lineTo(0,26*sc);g.stroke();
  for(const s of [-1,1]){g.fillStyle='rgba(54,66,92,0.95)';g.fillRect(-6*sc,s*9*sc+(s<0?-16*sc:0),12*sc,16*sc);g.strokeStyle='rgba(190,204,228,0.9)';g.lineWidth=0.8*sc;g.strokeRect(-6*sc,s*9*sc+(s<0?-16*sc:0),12*sc,16*sc);
    g.beginPath();for(let k=1;k<4;k++){const y=s*9*sc+(s<0?-16*sc:0)+k*4*sc;g.moveTo(-6*sc,y);g.lineTo(6*sc,y)}g.stroke()}
  g.fillStyle='rgba(236,226,206,1)';g.fillRect(-5*sc,-4*sc,10*sc,8*sc);g.fillStyle=rgba(C_OR2,1);g.beginPath();g.arc(6*sc,0,2.2*sc,0,7);g.fill();
  g.strokeStyle='rgba(236,226,206,0.9)';g.lineWidth=1;g.beginPath();g.moveTo(5*sc,0);g.lineTo(11*sc,-3*sc);g.stroke();g.restore()}
// ---------- S07：最早的在底层，本次过境升到最顶层
shotPass=function(t){const u=t-45.3;v9init();bg();
  const cz=ease(clamp(u/4.3));setCam([lerp(-6.6,-4.6,cz),lerp(6.2,5.6,cz),lerp(9.8,8.6,cz)],[0.6,lerp(2.0,2.5,cz),-0.4],46);
  drawBlock(t,{dense:0.25});
  const scan=ease(clamp(u/1.7)),sx=lerp(-5.4,5.4,scan);const rise=ease(clamp((u-1.6)/1.3));const diff=clamp((u-2.8)/0.6);
  const Y_OLD=[2.2,3.0],Y_NEW=3.8;const plate=(y,a,col,la)=>{const P=[[-4.4,y,-3.6],[4.4,y,-3.6],[4.4,y,3.6],[-4.4,y,3.6]].map(proj);poly2(P,`rgba(14,15,18,${a})`,rgba(col,la??0.6),1.4)};
  // older passes: earliest at the bottom
  [[Y_OLD[0],'更早 · 09:12',0.32],[Y_OLD[1],'上次过境 · 10:47',0.42]].forEach(([y,lb,a])=>{plate(y,0.55,[200,206,216]);flatSheet(y,a,(cx,cz,h0,B)=>V9.chgSet.has(B)?null:roofCol(cx,cz,h0*160).map(v=>v*0.9+18));const lp=proj([-4.4,y,3.6]);if(lp)text(lb,lp[0]-16,lp[1]+8,28,'rgba(214,220,230,0.85)','right',600,2)});
  // this pass: painted on the ground under the swath, then rising through the stack to the top
  const yN=lerp(0.03,Y_NEW,rise);if(rise>0)plate(yN,0.6*rise,C_OR2,0.9);
  flatSheet(yN,lerp(0.62,0.8,rise),(cx,cz,h0)=>roofCol(cx,cz,h0*160).map(v=>Math.min(255,v*1.35+20)),rise>0?undefined:sx);
  if(rise>0){const lp=proj([-4.4,yN,3.6]);if(lp)text('本次过境 · 12:21',lp[0]-16,lp[1]+8,32,rgba(C_OR2,rise),'right',700,2)}
  g.globalCompositeOperation='lighter';
  if(diff>0)V9.chg.forEach((bi,k)=>{const b=BLK.b[bi];const a=diff*clamp((u-2.8-k*0.04)/0.3);if(a<=0)return;const rr=b[3];
    const P=[];for(let i=0;i<rr.length;i+=2)P.push(proj([rr[i],yN+0.004,rr[i+1]]));poly2(P,rgba(C_OR,0.6*a),rgba(C_OR2,a),2);
    for(const y of Y_OLD){const Q=[];for(let i=0;i<rr.length;i+=2)Q.push(proj([rr[i],y,rr[i+1]]));poly2(Q,null,`rgba(220,226,236,${0.55*a})`,1)}
    line3([b[0],0.02,b[1]],[b[0],yN,b[1]],rgba(C_OR2,0.5*a),1.4);const q=proj([b[0],0.02,b[1]]);if(q)glowDot(q,36,C_OR,0.5*a)});
  // swath from the satellite to the ground line
  const SY=6.0,SZ=2.6;if(scan<1){const a=Math.sin(scan*Math.PI)*0.9+0.1;const p=proj([sx,SY,SZ]),l=proj([sx,0.03,-3.9]),r2=proj([sx,0.03,3.9]);if(p&&l&&r2){const gg=g.createLinearGradient(p[0],p[1],(l[0]+r2[0])/2,(l[1]+r2[1])/2);gg.addColorStop(0,rgba(C_OR2,0.3*a));gg.addColorStop(1,rgba(C_OR,0.12*a));g.fillStyle=gg;g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(l[0],l[1]);g.lineTo(r2[0],r2[1]);g.closePath();g.fill();g.strokeStyle=rgba(C_OR2,0.9*a);g.lineWidth=3;g.beginPath();g.moveTo(l[0],l[1]);g.lineTo(r2[0],r2[1]);g.stroke()}}
  g.globalCompositeOperation='source-over';
  const SX=lerp(-6.5,9,clamp(u/3.4));const pb=proj([SX,SY,SZ]),pn=proj([SX+0.3,SY,SZ]),pt=proj([SX-5,SY,SZ]);
  if(pb&&pt){const gg=g.createLinearGradient(pt[0],pt[1],pb[0],pb[1]);gg.addColorStop(0,'rgba(255,200,120,0)');gg.addColorStop(1,'rgba(255,200,120,0.45)');g.strokeStyle=gg;g.lineWidth=1.5;g.beginPath();g.moveTo(pt[0],pt[1]);g.lineTo(pb[0],pb[1]);g.stroke()}
  if(pb&&pn)satGlyph(pb,[pn[0]-pb[0],pn[1]-pb[1]],1,1.1);
  vignette()};
// ---------- S08：分钟切片 —— 一根占据画面中央的大柱，层次分明
const _ground1=shotGround;
shotGround=function(t){const u=t-49.6;if(u<5.0)return _ground1(t);v9init();bg();
  const orb=clamp((u-5.0)/2.8),e=ease(orb);const az=0.55+orb*0.45;const R0=lerp(1.05,0.95,e);
  setCam([HX+Math.sin(az)*R0*1.45,0.95,HZ+Math.cos(az)*R0*1.45],[HX,0.62,HZ],50);
  drawBlock(t,{dense:1});
  g.globalCompositeOperation='lighter';camPool(HX,HZ,0.3,C_OR,0.35);g.globalCompositeOperation='source-over';
  const half=0.14,gap=0.062,B0=0.26;const n=Math.min(12,Math.floor(orb*24)+3),fr=(orb*30)%1;
  for(let s=0;s<n;s++){const age=n-1-s+(s===n-1?0:fr);const y=0.07+(n-1-s)*gap+(s===n-1?0:fr*0);const yy=B0+(n-1-s)*gap;const a=1;
    const mm=31+(n-1)-s;const r=rng(4000+mm);const cnr=[[HX-half,yy,HZ-half],[HX+half,yy,HZ-half],[HX+half,yy,HZ+half],[HX-half,yy,HZ+half]];const P=cnr.map(proj);if(P.some(p=>!p))continue;
    // plate body (thin slab) + this minute's activity cells
    const P2=cnr.map(c=>proj([c[0],c[1]-0.012,c[2]]));poly2([P[0],P[1],P2[1],P2[0]],`rgba(30,30,34,${0.9*a})`,null);poly2([P[1],P[2],P2[2],P2[1]],`rgba(24,24,28,${0.9*a})`,null);poly2([P[2],P[3],P2[3],P2[2]],`rgba(30,30,34,${0.9*a})`,null);poly2([P[3],P[0],P2[0],P2[3]],`rgba(24,24,28,${0.9*a})`,null);
    poly2(P,`rgba(16,16,20,${0.92*a})`,null);
    for(let i=0;i<6;i++)for(let j=0;j<6;j++){const v=Math.pow(r(),2.0);if(v<0.1)continue;const c0=HX-half+i*2*half/6+0.006,z0=HZ-half+j*2*half/6+0.006,w=2*half/6-0.012;const Q=[[c0,yy+0.001,z0],[c0+w,yy+0.001,z0],[c0+w,yy+0.001,z0+w],[c0,yy+0.001,z0+w]].map(proj);poly2(Q,rgba(v>0.55?C_OR:[226,220,206],(0.3+0.65*v)*a),null)}
    poly2(P,null,rgba(s===0?C_OR2:[214,220,230],(s===0?1:0.55)*a),s===0?2.2:1);
    const lp=proj([HX+half,yy,HZ+half]);if(lp&&(s===0||s%3===0))text(`09:${String(mm).padStart(2,'0')}`,lp[0]+14,lp[1]+8,s===0?30:22,s===0?rgba(C_OR2,a):`rgba(214,220,230,${0.75*a})`,'left',700,1)}
  line3([HX,0.02,HZ],[HX,B0,HZ],rgba(C_OR2,0.7),2);const bt=proj([HX-half-0.03,B0,HZ+half]),tp=proj([HX-half-0.03,B0+11*gap,HZ+half]);if(bt&&tp){g.strokeStyle='rgba(236,226,206,0.6)';g.lineWidth=1.4;g.beginPath();g.moveTo(bt[0],bt[1]);g.lineTo(tp[0],tp[1]);g.stroke();text('每分钟一层',tp[0]-12,tp[1]-10,28,'rgba(236,226,206,0.85)','right',600,3)}
  vignette()};
// ---------- S10 面板：卫星像卫星照片；传感器、网络改成抽象表达
function buildSatPhoto(){const W0=768,H0=512,c=mkC(W0,H0),x=c.getContext('2d');const wx=2.4,wz=1.6,X0=HX-wx/2,Z0=HZ-wz/2;const U=v=>(v-X0)/wx*W0,V=v=>(v-Z0)/wz*H0;const r=rng(11);
  x.fillStyle='#4a4c46';x.fillRect(0,0,W0,H0);for(let i=0;i<9000;i++){const v=60+r()*30;x.fillStyle=`rgba(${v},${v+3},${v-4},0.35)`;x.fillRect(r()*W0,r()*H0,2+r()*4,2+r()*4)}
  // trees in courtyards
  for(let i=0;i<1400;i++){const px=r()*W0,py=r()*H0,rr=3+r()*7;x.fillStyle=`rgba(${40+r()*20},${62+r()*24},${38+r()*14},0.85)`;x.beginPath();x.arc(px,py,rr,0,7);x.fill()}
  // roads
  x.lineCap='round';for(const w of BLK.w){x.strokeStyle='rgba(78,79,80,1)';x.lineWidth=9;x.beginPath();for(let k=0;k<w.length;k+=2){const a=U(w[k]),b=V(w[k+1]);k?x.lineTo(a,b):x.moveTo(a,b)}x.stroke()}
  for(const w of BLK.w){x.strokeStyle='rgba(150,148,140,0.35)';x.lineWidth=1;x.setLineDash([6,8]);x.beginPath();for(let k=0;k<w.length;k+=2){const a=U(w[k]),b=V(w[k+1]);k?x.lineTo(a,b):x.moveTo(a,b)}x.stroke()}x.setLineDash([]);
  // buildings: shadow, roof with texture
  const vis=BLK.b.filter(b=>Math.abs(b[0]-HX)<wx*0.7&&Math.abs(b[1]-HZ)<wz*0.7);
  for(const [cx,cz,h0,rr] of vis){const sh=4+h0*60;x.fillStyle='rgba(18,18,16,0.55)';x.beginPath();for(let i=0;i<rr.length;i+=2){const a=U(rr[i])+sh,b=V(rr[i+1])+sh*0.6;i?x.lineTo(a,b):x.moveTo(a,b)}x.closePath();x.fill()}
  for(const [cx,cz,h0,rr] of vis){const base=h0>0.05?[150,150,146]:(r()<0.5?[98,96,92]:[120,110,96]);const k=0.85+r()*0.3;x.fillStyle=rgba(base.map(v=>v*k),1);x.beginPath();for(let i=0;i<rr.length;i+=2){const a=U(rr[i]),b=V(rr[i+1]);i?x.lineTo(a,b):x.moveTo(a,b)}x.closePath();x.fill();x.save();x.clip();x.strokeStyle='rgba(60,58,54,0.35)';x.lineWidth=1;for(let s=-W0;s<W0*2;s+=4){x.beginPath();x.moveTo(s,0);x.lineTo(s+H0*0.2,H0);x.stroke()}x.restore();x.strokeStyle='rgba(210,206,196,0.35)';x.stroke()}
  // cars
  for(const w of BLK.w){if(r()<0.6)continue;const k=Math.floor(r()*(w.length/2))*2;x.fillStyle=r()<0.5?'#d8d6d0':'#2a2c30';x.fillRect(U(w[k])-2,V(w[k+1])-1.5,5,3)}
  // haze + grain
  x.fillStyle='rgba(170,176,170,0.08)';x.fillRect(0,0,W0,H0);const out=mkC(384,256);out.getContext('2d').drawImage(c,0,0,384,256);return out}
paneSat=function(c,t){if(!V9.satPhoto)V9.satPhoto=buildSatPhoto();const x=c.getContext('2d');x.drawImage(V9.satPhoto,0,0);x.strokeStyle='rgba(255,170,48,0.9)';x.lineWidth=2;x.strokeRect(160,100,70,52);x.fillStyle='rgba(0,0,0,0.45)';x.fillRect(8,230,120,20);x.font='500 13px '+FONT;x.fillStyle='rgba(240,240,240,0.9)';x.fillText('10:47  过境影像',14,245)};
// sensors: a field of points, pulsing in waves — reads as "measuring", without saying what
paneSen=function(c,t){const x=c.getContext('2d');x.fillStyle='#0c0f12';x.fillRect(0,0,384,256);const r=rng(5);
  for(let i=0;i<24;i++)for(let j=0;j<16;j++){const px=12+i*15.5,py=10+j*15.5;const d=Math.hypot(px-150,py-120),d2=Math.hypot(px-300,py-60);const v=0.5+0.5*Math.sin(d*0.06-t*4)*Math.exp(-d/260)+0.35*Math.sin(d2*0.08-t*3.1)*Math.exp(-d2/200);const k=clamp(v);
    x.fillStyle=`rgba(${lerp(70,170,k)},${lerp(110,226,k)},${lerp(120,236,k)},${0.25+0.7*k})`;const s=1.5+k*3.5;x.fillRect(px-s/2,py-s/2,s,s)}};
// network: the shape of web pages — header, image blocks, lines of text — none of it readable
paneNet=function(c,t){const x=c.getContext('2d');x.fillStyle='#121019';x.fillRect(0,0,384,256);const off=(t*30)%128;
  for(let p=-1;p<3;p++){const y0=p*128-off+8;x.fillStyle='rgba(206,196,255,0.16)';x.fillRect(10,y0,364,118);x.fillStyle='rgba(206,196,255,0.55)';x.fillRect(18,y0+8,140,9);
    x.fillStyle='rgba(206,196,255,0.22)';x.fillRect(18,y0+26,92,72);const r=rng(80+((p+Math.floor((t*30)/128))%7+7)%7);for(let l=0;l<6;l++){x.fillStyle=l===2?'rgba(255,212,96,0.7)':'rgba(214,208,236,0.42)';x.fillRect(122,y0+28+l*13,120+r()*120,5)}
    x.fillStyle='rgba(206,196,255,0.3)';for(let k=0;k<3;k++)x.fillRect(122+k*44,y0+104,36,8)}};
PANES[0][1]=paneSat;PANES[2][1]=paneSen;PANES[3][1]=paneNet;
// readings: different, but not over-specific
shotFour=(function(prev){return function(t){const sv=text;text=function(s,...a){const m={'一片人群 · 10:47':'俯视影像 · 10:47','37 人 · 09:43':'人流聚集 · 09:43','噪声 68 dB · 09:43':'信号起伏 · 09:43','"很堵" · 约 09:40':'相关讨论 · 约 09:40'};return sv(m[s]??s,...a)};try{prev(t)}finally{text=sv}}})(shotFour);
// ---------- S11：碎成细小的数据颗粒（数字、字符），飞行中收拢成统一单元
const GLY='0123456789ABCDEF.:-+%#'.split('');
const _lang1=shotLang;
shotLang=function(t){const u=t-66.4;if(u>=2.6)return _lang1(t);v9init();bg();
  const a0=[HX+4.8*0.03,1.72+4.8*0.02,HZ+3.35-4.8*0.04],t0=[HX,1.12,HZ+0.2];setCam(a0,t0,54);drawBlock(t,{dense:0.8});
  const fly=ease(clamp(u/2.4));const pa=1-clamp(u/0.6);if(pa>0)for(let i=0;i<4;i++){const G=paneGeom(i);PANES[i][1](V9.pane[i],66.4);img3(V9.pane[i],G.o,G.ex,G.ey,0.95*pa)}
  // lattice frame
  const fa=clamp((u-0.6)/0.8);if(fa>0){g.globalCompositeOperation='lighter';for(let i=0;i<LAT.nx;i+=2)for(let j=0;j<LAT.nz;j+=2){const p0=latPos(i,j,0),p1=latPos(i,j,LAT.ny-1);line3([p0[0],0.03,p0[2]],p1,`rgba(220,214,200,${0.22*fa})`,0.8)}g.globalCompositeOperation='source-over'}
  const L=[];for(let i=0;i<4;i++){const G=paneGeom(i);const col=PANES[i][2];for(let n=0;n<520;n++){const r=rng(i*9001+n*7+1);const a=r(),b=r();const src=[G.o[0]+G.ex[0]*a,G.o[1]+G.ey[1]*b,G.o[2]+G.ex[2]*a];
      const dst=latPos(Math.floor(r()*LAT.nx),Math.floor(r()*LAT.nz),Math.floor(r()*LAT.ny));const k=ease(clamp(fly*1.4-r()*0.4));const mid=[(src[0]+dst[0])/2+(r()-.5)*0.6,Math.max(src[1],dst[1])+0.25+r()*0.3,(src[2]+dst[2])/2];
      const p=[0,1,2].map(m=>{const A=lerp(src[m],mid[m],k),B=lerp(mid[m],dst[m],k);return lerp(A,B,k)});L.push([Math.hypot(...sub(p,M.p)),p,k,col,GLY[Math.floor(r()*GLY.length)]])}}
  L.sort((a,b)=>b[0]-a[0]);const one=[226,150,62];
  for(const [d,p,k,col,ch] of L){if(k<0.82){const q=proj(p);if(!q)continue;const fs=clamp(240/q[2],9,22);const c2=col.map((v,m)=>lerp(v,one[m],sstep(0.3,0.8,k)));g.font=`600 ${fs}px ${FONT}`;g.fillStyle=rgba(c2,0.9);g.textAlign='center';g.fillText(ch,q[0],q[1])}
    else cube3(p,0.034*sstep(0.82,1,k)+0.004,one,0.95,C_OR2)}
  vignette()};
// ---------- S12：更像时间轴：过去段实、未来段虚、"此刻"节点、事件点
timeAxis=function(x,z,y0,h,col,a,lw,t,ph){const now=0.62;const pN=proj([x,y0+h*now,z]),p0=proj([x,y0,z]),p1=proj([x,y0+h,z]);if(!pN||!p0||!p1)return;
  g.strokeStyle=rgba(col,0.9*a);g.lineWidth=lw;g.beginPath();g.moveTo(p0[0],p0[1]);g.lineTo(pN[0],pN[1]);g.stroke();
  g.setLineDash([3,4]);g.strokeStyle=rgba(col,0.4*a);g.lineWidth=Math.max(1,lw*0.7);g.beginPath();g.moveTo(pN[0],pN[1]);g.lineTo(p1[0],p1[1]);g.stroke();g.setLineDash([]);
  for(let k=1;k<10;k++){const y=y0+h*k/10;const d=k%5?0.018:0.04;line3([x-d,y,z],[x+d,y,z],rgba(col,(k/10<now?0.7:0.3)*a),1)}
  const r=rng(Math.floor(ph*1e4));for(let k=0;k<3;k++){const f=r()*now*0.95;const q=proj([x,y0+h*f,z]);if(q){const s=clamp(50/q[2],2,5);g.fillStyle=rgba(col,a);g.beginPath();g.arc(q[0],q[1],s,0,7);g.fill()}}
  const s=clamp(70/pN[2],2,6);g.fillStyle=`rgba(255,250,240,${a})`;g.beginPath();g.arc(pN[0],pN[1],s*0.6,0,7);g.fill();
  const f=((t*0.25+ph)%1)*now;const pm=proj([x,y0+h*f,z]);if(pm){g.fillStyle=rgba(col,0.9*a);g.fillRect(pm[0]-2,pm[1]-1,4,2)}};
const _forest1=shotForest;
shotForest=function(t){_forest1(t);const u=t-72.9;const a=clamp((u-0.6)/0.5);if(a>0){text('此刻',1580,190,30,rgba(C_OR2,a),'left',700,4);g.fillStyle=`rgba(255,250,240,${a})`;g.beginPath();g.arc(1560,180,7,0,7);g.fill();
  g.strokeStyle=rgba(C_OR,0.9*a);g.lineWidth=2;g.beginPath();g.moveTo(1560,120);g.lineTo(1560,170);g.stroke();g.setLineDash([3,4]);g.beginPath();g.moveTo(1560,190);g.lineTo(1560,240);g.stroke();g.setLineDash([]);text('未来',1580,240,24,'rgba(214,220,230,0.7)','left',500,3);text('过去',1580,130,24,'rgba(214,220,230,0.7)','left',500,3)}};
// ---------- S13：按老板版本的例子 —— 先判"信息不实"，再三源指向同一事件
function shotTruth2(t){const u=t-77.8;v9init();bg();
  const A=1-sstep(1.9,2.3,u),B=sstep(1.9,2.3,u);
  if(A>0){// a rumour of an accident on a road; the camera on that road shows normal traffic
    const R=[HX+0.45,HZ-0.32];setCam([HX+1.2+u*0.06,1.25,HZ+1.6],[HX+0.25,0.3,HZ-0.2],50);drawBlock(t,{dense:1});
    const k1=ease(clamp(u/0.6)),k2=clamp((u-0.55)/0.4),k3=clamp((u-1.15)/0.25);
    const gp=proj([R[0],0.03,R[1]]);g.globalCompositeOperation='lighter';if(gp)glowDot(gp,90,k3>0?[180,184,192]:[255,120,80],0.6*k1*(1-0.6*k3));g.globalCompositeOperation='source-over';
    // the message card (web-page shape, headline readable)
    const cp=proj([R[0]-0.1,lerp(1.5,0.75,k1),R[1]]);if(cp){const w=600,h=180,X=cp[0]-w/2,Y=cp[1]-h;g.globalAlpha=k1;g.fillStyle='rgba(20,19,28,0.92)';g.fillRect(X,Y,w,h);g.strokeStyle=rgba(C_NETW,0.9);g.lineWidth=1.6;g.strokeRect(X,Y,w,h);g.fillStyle='rgba(206,196,255,0.25)';g.fillRect(X+14,Y+14,86,86);
      text('网络消息',X+116,Y+36,22,'rgba(206,196,255,0.85)','left',600,2);text('某路段发生事故',X+130,Y+92,48,'#f4f2fa','left',700,1);g.fillStyle='rgba(214,208,236,0.35)';g.fillRect(X+116,Y+98,250,6);g.fillRect(X+116,Y+112,190,6);
      if(gp){g.setLineDash([5,5]);g.strokeStyle=rgba(C_NETW,0.7);g.beginPath();g.moveTo(cp[0],cp[1]);g.lineTo(gp[0],gp[1]);g.stroke();g.setLineDash([])}
      // verdict stamp
      if(k3>0){g.save();g.translate(X+w-120,Y+h-30);g.rotate(-0.12);g.globalAlpha=k3;g.strokeStyle=rgba(C_OR,1);g.lineWidth=3;g.strokeRect(-230,-46,460,86);text('SeeMind 判定：信息不实',0,14,40,rgba(C_OR2,1),'center',800,1);g.restore();g.fillStyle=`rgba(10,10,14,${0.35*k3})`;g.fillRect(X,Y,w,h)}
      g.globalAlpha=1}
    // the live camera view on that road
    if(k2>0){const X=1250,Y=380,w=560,h=330;g.globalAlpha=k2;if(VC.img)g.drawImage(VC.img,X,Y,w,h);g.fillStyle='rgba(0,0,0,0.15)';g.fillRect(X,Y,w,h);const r=rng(Math.floor(t*8));g.strokeStyle='rgba(255,186,110,0.95)';g.lineWidth=2;for(let i=0;i<7;i++){const bx=X+40+((i*73+t*120)%(w-120)),by=Y+h*0.55+r()*h*0.25;g.strokeRect(bx,by,44,28)}
      g.strokeStyle=rgba(C_OR,0.9);g.lineWidth=1.6;g.strokeRect(X,Y,w,h);text('路口实拍 · 此刻',X,Y-16,26,'rgba(236,238,242,0.9)','left',600,2);g.fillStyle='rgba(0,0,0,0.55)';g.fillRect(X+w-190,Y+h-48,176,36);text('交通正常',X+w-102,Y+h-21,24,rgba(C_OR2,1),'center',700,2);g.globalAlpha=1;
      if(gp){g.strokeStyle=rgba(C_OR,0.5*k2);g.lineWidth=1.2;g.beginPath();g.moveTo(X,Y+h/2);g.lineTo(gp[0],gp[1]);g.stroke()}}
    g.fillStyle=`rgba(6,7,10,${B})`;g.fillRect(0,0,W,H)}
  if(B>0){// three sources, three kinds of evidence, one event — a big chart
    const v=u-2.0;g.globalAlpha=B;const X0=170,X1=1700,Y0=900,Yh=640;const px=x=>X0+(X1-X0)*x,py=y=>Y0-Yh*y;const reveal=clamp(v/1.5);
    g.strokeStyle='rgba(214,220,230,0.45)';g.lineWidth=1.4;g.beginPath();g.moveTo(X0,py(1.05));g.lineTo(X0,Y0);g.lineTo(X1,Y0);g.stroke();
    ['18:00','19:00','20:00','21:00','22:00'].forEach((s,i)=>text(s,px(i/4),Y0+40,24,'rgba(214,220,230,0.65)','center',500,1));text('事件可能性',X0-14,py(1.05)-14,26,'rgba(214,220,230,0.75)','left',600,2);
    const sig=(x,c,w)=>1/(1+Math.exp(-(x-c)/w));
    // satellite: night lights brightening (a few passes)
    [0.18,0.5,0.72,0.9].forEach(x=>{if(x>reveal)return;const y=0.12+0.62*sig(x,0.62,0.07);g.fillStyle=rgba(C_SATW,1);g.fillRect(px(x)-9,py(y)-9,18,18)});
    // camera: crowd building up
    g.strokeStyle=rgba(C_OR,0.85);g.lineWidth=3;g.beginPath();for(let x=0;x<=reveal;x+=0.004){const y=0.08+0.7*sig(x,0.68,0.05)+0.02*Math.sin(x*60);x?g.lineTo(px(x),py(y)):g.moveTo(px(x),py(y))}g.stroke();
    // network: posts about tonight's show
    const r=rng(3);for(let n=0;n<26;n++){const x=Math.pow(r(),0.7);if(x>reveal)continue;const y=0.2+0.5*sig(x,0.55,0.1)+(r()-0.5)*0.12;g.strokeStyle=rgba(C_NETW,0.95);g.lineWidth=2;g.beginPath();g.arc(px(x),py(y),9,0,7);g.stroke()}
    // fused
    const fx=clamp((v-0.5)/1.3);if(fx>0){const band=lerp(0.12,0.03,fx);g.fillStyle=rgba(C_OR,0.18);g.beginPath();const f=x=>0.1+0.82*sig(x,0.64,0.05);for(let x=0;x<=fx;x+=0.005)x?g.lineTo(px(x),py(f(x)+band)):g.moveTo(px(x),py(f(x)+band));for(let x=fx;x>=0;x-=0.005)g.lineTo(px(x),py(f(x)-band));g.closePath();g.fill();
      g.globalCompositeOperation='lighter';g.strokeStyle=rgba(C_OR2,1);g.lineWidth=7;g.beginPath();for(let x=0;x<=fx;x+=0.004)x?g.lineTo(px(x),py(f(x))):g.moveTo(px(x),py(f(x)));g.stroke();glowDot([px(fx),py(f(fx))],90,C_OR,0.8);g.globalCompositeOperation='source-over';
      const la=clamp((fx-0.8)/0.2);if(la>0){text('指向同一事件：演出散场',px(0.66),py(1.0),46,rgba(C_OR2,la*B),'left',800,2);text('多源融合 · 置信度 96%',px(0.66),py(1.0)+50,30,`rgba(240,240,244,${la*B})`,'left',600,1)}}
    const items=[['卫星 · 灯光增强',C_SATW,'sq'],['摄像头 · 人流聚集',C_OR,'line'],['网络 · 当晚有演出',C_NETW,'ring']];items.forEach(([nm,col,f],i)=>{const y=330+i*56,lx=280;g.strokeStyle=rgba(col,1);g.fillStyle=rgba(col,1);g.lineWidth=3;if(f==='sq')g.fillRect(lx,y-17,16,16);else if(f==='ring'){g.beginPath();g.arc(lx+8,y-9,8,0,7);g.stroke()}else{g.beginPath();g.moveTo(lx-4,y-9);g.lineTo(lx+24,y-9);g.stroke()}text(nm,lx+44,y,32,rgba(col,1),'left',700,2)});
    g.globalAlpha=1}
  vignette()}
shotTruth=shotTruth2;
