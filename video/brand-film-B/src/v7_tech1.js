// ===== 第七版 · 技术表述重做（一）：时空切片与状态图 / 同一坐标 / 东城 7×24 =====
// ---------- 视频云 → 时空切片 · 相似聚合 · 城市状态图 ----------
const VK=[[150,182,222],[140,200,188],[204,190,140],[212,162,150],[172,160,212],[162,204,150]];
const VX=24,VZ=20,VL=[0.35,0.75,1.15];
function vClass(i,j,l,T){const x=i/VX,z=j/VZ;const s=Math.sin(x*6.1+l*0.7+T*0.15)+Math.cos(z*5.3-x*2.0)+0.6*Math.sin((x+z)*9.0+l);return Math.floor(((s+2.6)/5.2)*6+6)%6}
const VC6=[[-3.0,3.6,-1.2],[-0.4,4.4,-1.8],[2.4,3.8,-1.0],[-2.0,2.9,1.8],[0.8,3.0,2.0],[3.2,4.4,1.2]];
function cube2D(q,s,col,a){g.fillStyle=rgba(col.map(v=>v*0.55),0.75*a);g.fillRect(q[0]-s/2,q[1]-s/2,s,s);g.fillStyle=rgba(col,0.95*a);g.fillRect(q[0]-s/2,q[1]-s/2,s,Math.max(1,s*0.2));g.fillRect(q[0]-s/2,q[1]-s/2,Math.max(1,s*0.2),s)}
sceneVCloud=function(t){bg();const u=t-87.6;const az=0.55+u*0.025;setCam([Math.sin(az)*7.5,12.5,Math.cos(az)*7.5],[0.2,1.4,0],48);
  const lift=ease(clamp((u-2.6)/2.4)),back=ease(clamp((u-6.0)/2.0)),sl=clamp(u/1.6);
  drawBlock(t,{y:0,dense:0.4,a:1-0.5*back});
  // state map: each cell coloured by the cluster it fell into
  if(back>0){for(let i=0;i<VX;i++)for(let j=0;j<VZ;j++){const k=vClass(i,j,1,t);const x0=-4.4+i*8.8/VX,z0=-3.6+j*7.2/VZ;const P=[[x0,0.02,z0],[x0+8.8/VX,0.02,z0],[x0+8.8/VX,0.02,z0+7.2/VZ],[x0,0.02,z0+7.2/VZ]].map(proj);if(P.some(p=>!p))continue;g.fillStyle=rgba(VK[k].map(v=>v*0.55),0.5*back);g.beginPath();P.forEach((p,m)=>m?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill()}}
  // time slices: the block cut into cells of (place, time); they lift into a space where similar ones sit together, then fall back as the map
  for(let l=0;l<3;l++)for(let i=0;i<VX;i++)for(let j=0;j<VZ;j++){if(((i*7+j*13+l*5)%2)!==0)continue;const k=vClass(i,j,l,t);const x=-4.4+(i+0.5)*8.8/VX,z=-3.6+(j+0.5)*7.2/VZ;
    const r=rng(i*97+j*31+l);const tgt=VC6[k].map((v,m)=>v+(r()-.5)*(m===1?0.9:1.4));const home=[x,VL[l],z];
    const e=lift*(1-back);const p=[0,1,2].map(m=>lerp(home[m],tgt[m],e));const q=proj(p);if(!q)continue;
    const a=sl*(1-back*0.9);if(a<=0.01)continue;const col=lift>0.05?VK[k].map((v,m)=>lerp(200,v,lift)):[196,204,216];cube2D(q,clamp(90/q[2],4,13),col,a)}
  // faint time-axis planes while slicing
  const pa=sl*(1-lift);if(pa>0)VL.forEach(y=>{const c=[[-4.4,y,-3.6],[4.4,y,-3.6],[4.4,y,3.6],[-4.4,y,3.6]].map(proj);if(c.every(p=>p)){g.strokeStyle=`rgba(170,190,215,${0.35*pa})`;g.lineWidth=0.8;g.beginPath();c.forEach((p,m)=>m?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.stroke()}});
  const lb=(s,a)=>{if(a>0)text(s,120,1000,32,`rgba(236,238,242,${a})`,'left',600,4)};
  lb('时空切片',clamp(u/0.5)*(1-clamp((u-2.8)/0.4)));lb('相似的现实彼此靠近',clamp((u-3.2)/0.5)*(1-clamp((u-5.8)/0.4)));lb('城市状态图 · 持续演化',clamp((u-6.4)/0.5));
  vignette()};
// ---------- 坐标：影像、视频、消息对齐到同一栋楼、同一时刻，再拉开到 275 座城市 ----------
const _coordOld=shotCoord;
shotCoord=function(t){const lt=t-63.4;if(lt>3.7){_coordOld(t);const a=1-clamp((lt-3.7)/0.5);if(a<=0)return;}
  if(lt>4.2)return;bg();const az=0.5+lt*0.04;setCam([1.62+Math.sin(az)*3.2,5.2,-2.0+Math.cos(az)*3.2],[1.62,0.3,-2.0],46);
  drawBlock(t,{y:0,dense:0.4});
  const B=[1.62,-2.0];const top=[B[0],0.9,B[1]];const k=ease(clamp((lt-0.3)/2.0));const lock=clamp((lt-2.3)/0.4);
  // three sources arriving from three directions
  const srcs=[[[B[0]-0.4,3.2,B[1]+1.0],'sat'],[[B[0]-2.6,1.4,B[1]+2.6],'cam'],[[B[0]+2.2,1.5,B[1]+2.4],'txt']];
  srcs.forEach(([s,kind],i)=>{const kk=ease(clamp((lt-0.3-i*0.25)/1.8));const c=[0,1,2].map(m=>lerp(s[m],top[m],kk));const q=proj(c);if(!q)return;const w=lerp(380,60,kk),h=w*0.62;const a=1-0.7*lock;
    g.save();g.globalAlpha=a;if(kind==='cam'&&VC.img){g.drawImage(VC.img,q[0]-w/2,q[1]-h/2,w,h)}else if(kind==='sat'){const r=rng(9);for(let x=0;x<8;x++)for(let y=0;y<5;y++){const v=40+r()*50;g.fillStyle=`rgb(${v},${v+6},${v+4})`;g.fillRect(q[0]-w/2+x*w/8,q[1]-h/2+y*h/5,w/8-1,h/5-1)}}
    else{g.fillStyle='rgba(20,22,28,0.9)';g.fillRect(q[0]-w/2,q[1]-h/2,w,h);g.fillStyle=rgba(C_OR,0.9);g.fillRect(q[0]-w/2+8,q[1]-h/2+8,w*0.4,5);g.fillStyle='rgba(220,224,230,0.7)';for(let l=0;l<4;l++)g.fillRect(q[0]-w/2+8,q[1]-h/2+20+l*h*0.17,w*(0.5+0.35*((l*7)%3)/2),3)}
    g.strokeStyle=`rgba(220,228,238,0.7)`;g.lineWidth=1;g.strokeRect(q[0]-w/2,q[1]-h/2,w,h);g.restore()});
  // the shared coordinate: x · y · z · t
  const pt=proj(top);if(pt&&lock>0){g.globalCompositeOperation='lighter';glowDot(pt,60,C_OR,0.6*lock);g.globalCompositeOperation='source-over';g.strokeStyle=rgba(C_OR2,lock);g.lineWidth=2;g.beginPath();g.moveTo(pt[0]-40,pt[1]);g.lineTo(pt[0]+40,pt[1]);g.moveTo(pt[0],pt[1]-40);g.lineTo(pt[0],pt[1]+40);g.stroke();
    text('39.93°N  116.41°E  · 高 36 m · 09:42:17',pt[0]+56,pt[1]-20,26,rgba(C_OR2,lock),'left',600,2)}
  vignette()};
// ---------- 东城：人工局部巡查（有盲区、有断档）→ 7×24 AI 感知 ----------
const _dcOld=shotDCDay;
let DCP=null;
shotDCDay=function(t){const lt=t-129.0;bg();const az=0.3+lt*0.02;setCam([Math.sin(az)*9.6,6.8,Math.cos(az)*9.6],[0,0.2,0],44);
  if(!DCP){const r=rng(41);DCP={pat:[0,1,2,3,4,5].map(()=>BLK.w[Math.floor(r()*BLK.w.length)]),cams:[]};for(let i=0;i<260;i++){const w=BLK.w[Math.floor(r()*BLK.w.length)];const k=Math.floor(r()*(w.length/2))*2;DCP.cams.push([w[k],w[k+1],r()])}}
  const sw=ease(clamp((lt-4.4)/1.6));drawBlock(t,{y:0,dense:0.5});
  g.globalCompositeOperation='lighter';
  // manual patrol: six small moving circles, the rest of the district unseen
  if(sw<1)DCP.pat.forEach((w,i)=>{const [x,z]=walkerXZ(w,t,0.03,i*0.3);camPool(x,z,0.32,[220,226,236],0.45*(1-sw));const q=proj([x,0.02,z]);if(q){g.fillStyle=`rgba(240,242,246,${1-sw})`;g.fillRect(q[0]-2.5,q[1]-2.5,5,5)}});
  // AI sensing: coverage everywhere, all the time
  if(sw>0)DCP.cams.forEach(([x,z,r])=>{if(r>sw)return;camPool(x,z,0.42,C_OR,0.16*sw)});
  g.globalCompositeOperation='source-over';
  // 24-hour bar: patrol covers a few hours, AI covers all 24
  const bx=560,by=930,bw=800;g.fillStyle='rgba(30,34,42,0.85)';g.fillRect(bx,by,bw,14);
  const segs=[[8,11],[14,17],[20,21]];if(sw<1)segs.forEach(([a,b])=>{g.fillStyle=`rgba(220,226,236,${0.85*(1-sw)})`;g.fillRect(bx+a/24*bw,by,(b-a)/24*bw,14)});
  if(sw>0){g.fillStyle=rgba(C_OR,0.9*sw);g.fillRect(bx,by,bw*sw,14)}
  for(const h of [0,6,12,18,24])text(String(h).padStart(2,'0')+':00',bx+h/24*bw,by+46,20,'rgba(170,178,190,0.8)','center',500,1);
  text(sw<0.5?'人工巡查 · 局部、定时':'AI 感知 · 7×24',bx,by-20,30,sw<0.5?'rgba(236,238,242,0.95)':rgba(C_OR2,1),'left',700,3);
  text('北京 · 东城区',120,1000,30,'rgba(236,238,242,0.9)','left',600,4);vignette()};
