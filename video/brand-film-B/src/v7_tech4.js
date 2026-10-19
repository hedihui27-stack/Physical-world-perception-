// ===== 第七版 · 统一视觉（四）：剥离 / 外壳 / 感知点 / 汇合 / 多城运行 —— 全部改为近地轨道视角 + 弧形地平线；南京换新城市画法 =====
function lightsLayer(cdir,frac,col,a,step=1,size=1){const G=D.global;const N=Math.floor(G.length*frac);g.globalCompositeOperation='lighter';
  for(let i=0;i<N;i+=step){const v=ll(G[i][0],G[i][1],1.001);if(dot(v,cdir)<0.02||occluded(v))continue;const p=proj(v);if(!p)continue;const s=clamp(3.4/p[2],0.8,2.6)*size;g.fillStyle=rgba(col,a);g.fillRect(p[0]-s/2,p[1]-s/2,s,s)}g.globalCompositeOperation='source-over'}
// 剥离：the physical world right now — present, but unindexed: the lights go out region by region
shotPeel=function(t){bg();const lt=t-25.9;const cdir=lowEarth(18,104+lt*0.6,0.32,36,112,1);
  const off=clamp(lt/2.4);const G=D.global;g.globalCompositeOperation='source-over';
  // dim the city lights from west to east
  for(let i=0;i<G.length;i+=2){const v=ll(G[i][0],G[i][1],1.0015);if(dot(v,cdir)<0.02||occluded(v))continue;const p=proj(v);if(!p)continue;const k=clamp((G[i][1]-60)/100);if(k>off)continue;g.fillStyle='rgba(11,12,14,0.95)';g.fillRect(p[0]-2,p[1]-2,4,4);g.fillStyle='rgba(150,152,158,0.6)';g.fillRect(p[0]-0.9,p[1]-0.9,1.8,1.8)}
  vignette()};
// 外壳：sky · ground · web — three layers of sensing laid over the same horizon, one after another
shotShells=function(t){bg();const lt=t-37.9;const cdir=lowEarth(16+lt*0.25,106,0.3,36,114,1);
  const sA=clamp((lt-0.6)/1.2),gA=clamp((lt-3.0)/1.2),wA=clamp((lt-5.4)/1.2);
  // ground: sensing points brighten on the surface
  if(gA>0)lightsLayer(cdir,1,[255,206,140],0.55*gA,2,1.3);
  // sky: orbits drawn as fine arcs of moving satellites above the surface
  if(sA>0){g.globalCompositeOperation='lighter';for(let k=0;k<14;k++){const S={P:ll(10+k*3,90+k*4,1),H:norm(cross(ll(10+k*3,90+k*4,1),ll(10+k*3+40,90+k*4+70,1)))};const H=norm(cross(S.H,S.P));
      for(let j=0;j<120;j++){const u=j/120*1.2-0.6;const X=[0,1,2].map(m=>(Math.cos(u)*S.P[m]+Math.sin(u)*H[m])*1.06);if(occluded(X))continue;const p=proj(X);if(!p)continue;g.fillStyle=`rgba(200,214,232,${0.28*sA})`;g.fillRect(p[0]-0.8,p[1]-0.8,1.6,1.6)}
      const u0=((lt*0.05+k*0.13)%1.2)-0.6;const X=[0,1,2].map(m=>(Math.cos(u0)*S.P[m]+Math.sin(u0)*H[m])*1.06);if(!occluded(X)){const p=proj(X);if(p){g.fillStyle=rgba(C_OR2,sA);g.fillRect(p[0]-2.5,p[1]-2.5,5,5)}}}g.globalCompositeOperation='source-over'}
  // web: a thin high layer of pages and messages drifting above the atmosphere, dropping onto places
  if(wA>0){const r=rng(13);for(let i=0;i<60;i++){const la=10+r()*40,lo=92+r()*46;const v=ll(la,lo,1.16+0.04*Math.sin(lt+i));if(occluded(v))continue;const p=proj(v);if(!p)continue;const w=clamp(240/p[2],10,46),h=w*0.62;const a=wA*(0.5+0.5*r());
      g.fillStyle=`rgba(22,25,31,${0.85*a})`;g.fillRect(p[0]-w/2,p[1]-h/2,w,h);g.strokeStyle=`rgba(200,206,216,${0.55*a})`;g.lineWidth=0.8;g.strokeRect(p[0]-w/2,p[1]-h/2,w,h);g.fillStyle=rgba(C_OR,0.8*a);g.fillRect(p[0]-w/2+3,p[1]-h/2+3,w*0.4,2);
      const q=proj(ll(la,lo,1.002));if(q&&r()<0.5){g.strokeStyle=`rgba(220,226,236,${0.14*a})`;g.lineWidth=0.8;g.beginPath();g.moveTo(p[0],p[1]+h/2);g.lineTo(q[0],q[1]);g.stroke()}}}
  const lb=[['天上',sA*(1-gA)],['地上',gA*(1-wA)],['网上',wA]];lb.forEach(([s,a])=>{if(a>0)text(s,120,1000,40,rgba(C_OR2,a),'left',700,8)});
  vignette()};
// 感知点：600,000 live sensing points light up across the surface
shotPoints=function(t){bg();const lt=t-53.1;const cdir=lowEarth(12+lt*0.6,98,0.55,34,112,1);
  lightsLayer(cdir,ease(clamp(lt/2.4)),[255,212,150],0.45,1,1.1);
  const n=Math.round(600000*ease(clamp(lt/2.6)));countUp(n,'',C_OR2,clamp(lt/0.3));vignette()};
// 汇合：the predicted world (cool, offset) slides onto the real one; only the physical world can check its forecasts
shotConverge=function(t){bg();const lt=t-115.8;const cdir=lowEarth(14,104+lt*0.5,0.45,34,112,1);const conv=ease(clamp(lt/4.6));
  const G=D.global;g.globalCompositeOperation='lighter';const ang=(1-conv)*0.05;
  for(let i=0;i<G.length;i+=3){const v=ll(G[i][0],G[i][1],1.0015);if(dot(v,cdir)<0.05||occluded(v))continue;const p=proj(v);if(p){g.fillStyle='rgba(236,210,170,0.5)';g.fillRect(p[0]-1,p[1]-1,2,2)}
    const gv=ll(G[i][0]+ang*40,G[i][1]+ang*60,1.004+0.02*(1-conv));const q=proj(gv);if(q&&!occluded(gv)){g.fillStyle=`rgba(160,186,214,${0.5*(1-conv*0.85)})`;g.fillRect(q[0]-1,q[1]-1,2,2)}}
  const n=Math.floor(C275.length*conv);for(let i=0;i<n;i++){const [la,lo]=C275[i];const v=ll(la,lo,1.003);if(occluded(v))continue;const q=proj(v);if(!q)continue;const R0=clamp(60/q[2],3,14);const gg=g.createRadialGradient(q[0],q[1],0,q[0],q[1],R0);gg.addColorStop(0,rgba(C_OR,0.6));gg.addColorStop(1,rgba(C_OR,0));g.fillStyle=gg;g.fillRect(q[0]-R0,q[1]-R0,2*R0,2*R0)}
  g.globalCompositeOperation='source-over';vignette()};
// 多城运行：the cities where it already runs light up, each with a growing coverage
shotChina5=function(t){bg();const lt=t-125.8;const cdir=lowEarth(20+lt*0.2,114,0.3,31,116,1);lightsLayer(cdir,1,[230,200,160],0.3,3,1);
  g.globalCompositeOperation='lighter';D.online.forEach(([nm,la,lo],i)=>{const a=clamp((lt-0.2-i*0.3)/0.5);if(a<=0)return;const v=ll(la,lo,1.002);if(occluded(v))return;const p=proj(v);if(!p)return;const R0=clamp(1400/p[2],30,110)*(0.6+0.4*a);
    g.save();g.translate(p[0],p[1]);const gg=g.createRadialGradient(0,0,0,0,0,R0);gg.addColorStop(0,rgba(C_OR2,0.75*a));gg.addColorStop(0.4,rgba(C_OR,0.3*a));gg.addColorStop(1,rgba(C_OR,0));g.fillStyle=gg;g.scale(1,0.55);g.beginPath();g.arc(0,0,R0,0,7);g.fill();g.restore();
    g.globalCompositeOperation='source-over';text(nm,p[0],nm==='雄安'?p[1]+R0*0.35+30:p[1]-R0*0.35-10,32,`rgba(244,242,236,${a})`,'center',700,3);g.globalCompositeOperation='lighter'});
  g.globalCompositeOperation='source-over';vignette()};
// 南京：new city palette, curved ground and horizon; the tall tower keeps its real height but loses the green tint
const _nj7=shotNanjing;
shotNanjing=function(t){const svR=R.altitude;R.altitude=v=>{const h=(v-1500)/5000*120;return roofCol(h*0.37,h*0.11,h).map(x=>x*0.95)};
  const svBg=bg;let first=true;bg=()=>{svBg();if(first){first=false}};
  const cam=setCam;let did=false;const svRE=RE_EARTH;RE_EARTH=700;try{setCam=(...a)=>{cam(...a);if(!did){did=true;earthGround(6.5,-1.0,RE_EARTH,40)}};curved(()=>_nj7(t),6.5,-1.0)}finally{R.altitude=svR;bg=svBg;setCam=cam;RE_EARTH=svRE}};
