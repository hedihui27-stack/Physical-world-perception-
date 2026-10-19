window._satsV5=shotSats;
// ===== 第七版 · 技术表述重做（二）：卫星 = 扫过地面的成像条带、"最新影像"不断刷新、雷达穿云；事件 = 文字被解析成"时间·地点·类型"再落到地图 =====
// low-orbit view of the planet: dark land, warm city lights, thin limb — a horizon, not a floating globe
// The camera always points at the planet's centre (so the limb is a perfect circle) and the image is lens-shifted down,
// keeping only the upper arc in frame: a true circular horizon, never an ellipse.
let LE=null;const _projBase=proj;proj=function(v){const p=_projBase(v);if(p&&LE&&g.canvas===LE.c&&window.__T===LE.T)p[1]+=LE.sy;return p};
function lowEarth(lat,lon,alt,tLat,tLon,a=1){const d=1+alt;LE=null;const eye=ll(tLat-21,tLon+(lon-tLon)*0.6,d);setCam(eye,[0,0,0],46);
  const Rs=F*Math.tan(Math.asin(1/d));const cy=H*0.27+Rs;LE={c:g.canvas,T:window.__T,sy:cy-H/2};const cdir=norm(M.p);
  // earth disc + atmosphere as exact circles
  g.fillStyle=`rgba(11,12,14,${a})`;g.beginPath();g.arc(W/2,cy,Rs,0,7);g.fill();
  g.globalCompositeOperation='lighter';for(const [w,al,col] of [[70,0.05,[150,175,205]],[24,0.08,[200,212,226]],[6,0.15,[236,228,210]],[1.6,0.32,[245,238,222]]]){g.strokeStyle=rgba(col,al*a);g.lineWidth=w;g.beginPath();g.arc(W/2,cy,Rs+w*0.15,Math.PI,2*Math.PI);g.stroke()}
  for(const [la0,lo0] of D.land){const hj=Math.sin(la0*91.3+lo0*17.7)*43758.5,jr=hj-Math.floor(hj);const la=la0+(jr-0.5)*0.28,lo=lo0+(((jr*7.31)%1)-0.5)*0.34;const v=ll(la,lo,1.0005);if(dot(v,cdir)<0.02||occluded(v))continue;const p=proj(v);if(!p)continue;const s=clamp(5/p[2],0.8,3);g.fillStyle=`rgba(120,116,106,${0.45*a})`;g.fillRect(p[0]-s/2,p[1]-s/2,s,s)}
  const G=D.global;for(let i=0;i<G.length;i+=2){const v=ll(G[i][0],G[i][1],1.001);if(dot(v,cdir)<0.02||occluded(v))continue;const p=proj(v);if(!p)continue;const s=clamp(3/p[2],0.7,2);g.fillStyle=rgba(i%7?[236,206,160]:[190,206,222],0.42*a);g.fillRect(p[0]-s/2,p[1]-s/2,s,s)}
  g.globalCompositeOperation='source-over';return cdir}
function surf(lat,lon,r=1.002){return ll(lat,lon,r)}
// ---------- 卫星 ----------
// 32 satellites on near-polar passes across the region in view (great circles, slightly tilted)
const SAT7=(()=>{const r=rng(321);const S=[];for(let i=0;i<32;i++){const lat0=8+r()*44,lon0=88+r()*52,hd=(r()-0.5)*0.5;const P=ll(lat0,lon0,1);const N=ll(lat0+1,lon0+Math.tan(hd)*1.3,1);const H=norm(sub(N,P.map(v=>v*dot(N,P))));S.push({P,H,ph:r()*0.6-0.3,sar:i%2===1,w:1.2+r()*0.8})}return S})();
function satPos7(s,u,alt=0.09){const R=1+alt;return[0,1,2].map(k=>(Math.cos(u)*s.P[k]+Math.sin(u)*s.H[k])*R)}
const CLOUD7=[[34,106,6],[42,122,5],[27,114,4],[38,96,5],[31,125,4]];
shotSats=function(t){bg();const lt=t-46.1;const cdir=lowEarth(22+lt*0.35,110,0.2,40,117);
  // each satellite sweeps an imaging strip; strips fade as they age (freshness); radar strips show through the clouds
  const speed=0.02;for(const pass of [0,1]){if(pass===1){g.globalCompositeOperation='source-over';for(const [la,lo,rd] of CLOUD7){const r=rng(la*7);for(let k=0;k<70;k++){const v=surf(la+(r()-.5)*rd,lo+(r()-.5)*rd*1.3,1.004);if(occluded(v))continue;const p=proj(v);if(!p)continue;const R0=clamp(260/p[2],10,60);const gg=g.createRadialGradient(p[0],p[1],0,p[0],p[1],R0);gg.addColorStop(0,'rgba(205,208,214,0.05)');gg.addColorStop(1,'rgba(200,204,210,0)');g.fillStyle=gg;g.fillRect(p[0]-R0,p[1]-R0,2*R0,2*R0)}}g.globalCompositeOperation='lighter'}for(const s of SAT7){if((pass===0)===s.sar)continue;const u0=s.ph+lt*speed-0.07;const pos=satPos7(s,u0,0.05);
    for(let k=0;k<70;k++){const u=u0-k*0.0022;const P=satPos7(s,u,0);const Q=norm(P);const age=k/60;const side=norm(cross(Q,norm(sub(satPos7(s,u+0.001,0),P))));
      const a1=Q.map((v,m)=>v*1.002+side[m]*0.006*s.w),a2=Q.map((v,m)=>v*1.002-side[m]*0.006*s.w);if(occluded(Q.map(v=>v*1.002)))continue;const p1=proj(a1),p2=proj(a2);if(!p1||!p2)continue;
      const col=s.sar?[176,196,214]:[236,206,150];const al=0.42*Math.pow(1-age,1.5);g.strokeStyle=rgba(col,al);g.lineWidth=clamp(1.2*Math.hypot(p1[0]-p2[0],p1[1]-p2[1])/16,1,5);g.beginPath();g.moveTo(p1[0],p1[1]);g.lineTo(p2[0],p2[1]);g.stroke()}
    if(occluded(pos))continue;const q=proj(pos);if(!q)continue;g.fillStyle=rgba(s.sar?[210,224,236]:C_OR2,0.95);g.fillRect(q[0]-3,q[1]-3,6,6);
    const nd=proj(norm(pos).map(v=>v*1.002));if(nd){g.strokeStyle=rgba(s.sar?[190,210,228]:C_OR,0.18);g.lineWidth=1;g.beginPath();g.moveTo(q[0],q[1]);g.lineTo(nd[0],nd[1]);g.stroke()}}
  }g.globalCompositeOperation='source-over';
  // one place, always freshly imaged: the "latest image" age keeps resetting
  const bj=surf(39.9,116.4,1.003);const pb=proj(bj);if(pb&&!occluded(bj)){const cyc=(lt*1.35)%1;const mins=Math.max(1,Math.round(cyc*14));g.globalCompositeOperation='lighter';glowDot(pb,26+20*(1-cyc),C_OR,0.55*(1-cyc)+0.2);g.globalCompositeOperation='source-over';
    g.strokeStyle=rgba(C_OR2,0.9);g.lineWidth=2;g.strokeRect(pb[0]-14,pb[1]-14,28,28);text('北京 · 最新影像 '+mins+' 分钟前',pb[0]-26,pb[1]-18,26,rgba(C_OR2,0.95),'right',600,2)}
  const n=Math.min(32,Math.floor(lt/0.08));countUp(n,'',C_OR2,clamp(lt/0.4)*(1-clamp((lt-6.2)/0.5)));
  const la=clamp((lt-1.2)/0.5);if(la>0){text('光学',1520,940,24,rgba([236,206,150],la),'left',600,2);text('雷达 · 穿透云层',1520,976,24,rgba([190,210,228],la),'left',600,2)}
  vignette()};
// ---------- 事件 ----------
shotEvents=function(t){bg();const lt=t-58.1;const cdir=lowEarth(20+lt*0.3,111,0.2,38,116);
  // news text arrives, is parsed into time · place · type, and drops onto its location
  const r=rng(77);const N=46;for(let i=0;i<N;i++){const t0=(i/N)*4.6+r()*0.3;const k=lt-t0;const C=C275[Math.floor(r()*C275.length)];const sx=1280+r()*560,sy=80+r()*380;if(k<0)continue;
    const v=surf(C[0],C[1],1.003);const pv=proj(v);if(!pv||occluded(v))continue;const mv=ease(clamp((k-0.7)/0.9));
    if(mv<1){const x=lerp(sx,pv[0],mv),y=lerp(sy,pv[1],mv);const w=lerp(150,10,mv),h=w*0.62;const a=clamp(k/0.25);
      g.fillStyle=`rgba(22,25,31,${0.88*a})`;g.fillRect(x-w/2,y-h/2,w,h);g.strokeStyle=`rgba(200,206,216,${0.5*a})`;g.lineWidth=0.8;g.strokeRect(x-w/2,y-h/2,w,h);
      if(w>40){g.fillStyle=`rgba(225,228,234,${0.5*a})`;for(let l=0;l<3;l++)g.fillRect(x-w/2+8,y-h/2+10+l*h*0.2,w*(0.5+0.3*((i+l)%3)/2),2.5);
        const pa=clamp((k-0.3)/0.3)*(1-mv*2);if(pa>0){const tags=[[C_OR2,'时间'],[[190,210,228],'地点'],[[200,214,170],'类型']];tags.forEach(([c,s],j)=>{g.fillStyle=rgba(c,0.9*pa);g.fillRect(x-w/2+8+j*44,y+h/2-20,38,14);text(s,x-w/2+27+j*44,y+h/2-9,11,`rgba(18,20,24,${pa})`,'center',700,0)})}}}
    else{const age=k-1.6;const ph=clamp(age/1.2);g.globalCompositeOperation='lighter';g.fillStyle=rgba(C_OR2,0.9);g.fillRect(pv[0]-2,pv[1]-2,4,4);if(ph<1){g.strokeStyle=rgba(C_OR,0.7*(1-ph));g.lineWidth=1.2;g.beginPath();g.ellipse(pv[0],pv[1],4+ph*22,(4+ph*22)*0.45,0,0,7);g.stroke()}g.globalCompositeOperation='source-over'}}
  const n=Math.round(30000*ease(clamp(lt/3.5)));countUp(n,'',C_OR2,clamp(lt/0.4)*(1-clamp((lt-4.6)/0.5)));
  vignette()};
