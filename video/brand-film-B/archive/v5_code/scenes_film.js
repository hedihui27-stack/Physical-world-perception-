// ===== shared: globe base =====
const EVT={occupy:'#ff7a3d',trash:'#5ce1c8',parking:'#4aa8ff',construction:'#ffd166',crowd:'#ff9ecb',flood:'#4aa8ff',traffic:'#b583ff'};
function camGlobe(lon,lat,dist){const a=lon*Math.PI/180,e=lat*Math.PI/180;setCam([dist*Math.cos(e)*Math.cos(a),dist*Math.sin(e),-dist*Math.cos(e)*Math.sin(a)],[0,0,0],38)}
function globeBase(landA=1){
  const cdir=norm(M.p),c0=proj([0,0,0]),er=proj(M.r)[0]-c0[0];
  let gr=g.createRadialGradient(c0[0],c0[1],er*0.97,c0[0],c0[1],er*1.16);gr.addColorStop(0,'rgba(79,127,184,0.30)');gr.addColorStop(1,'rgba(79,127,184,0)');g.fillStyle=gr;g.beginPath();g.arc(c0[0],c0[1],er*1.2,0,7);g.fill();
  gr=g.createRadialGradient(c0[0]-er*.35,c0[1]-er*.4,er*.1,c0[0],c0[1],er);gr.addColorStop(0,'#0d1d2c');gr.addColorStop(1,'#050b13');g.fillStyle=gr;g.beginPath();g.arc(c0[0],c0[1],er,0,7);g.fill();
  for(const [la,lo] of D.land){const v=ll(la,lo);const fd=dot(v,cdir);if(fd<0.02)continue;const p=proj(v);g.fillStyle=`rgba(93,104,130,${(0.18+0.45*fd)*landA})`;g.fillRect(p[0],p[1],1.5,1.5)}
  return {cdir,c0,er};
}
function title(a,b){text(a,80,110,32,'#e9eef9','left',500,4);if(b)text(b,80,152,22,'#93a0ba','left',400,1)}
// ===== 1 天：32 颗遥感卫星，扫过地球留下的影像条带 =====
const SSO=[...Array(32)].map((_,i)=>[97.6,(i*11.25)%360,0.001,0,(i*137.5)%360,15.05+(i%4)*0.12]);
function sceneSky(t){bg();camGlobe(108+t*0.8,26,3.25-0.45*ease(CP.k));const {cdir}=globeBase(1.6);
  const T=t*240; // 1 s = 4 min
  g.globalCompositeOperation='lighter';
  for(let i=0;i<32;i++){const e=SSO[i];
    // swath history: last 6 h of ground track, painted as a band
    const steps=Math.max(2,Math.round(4+40*CP.k));let prev=null;
    for(let k=steps;k>=0;k--){const ts=T-k*120;const s=sat(e,ts);const gp=norm(s.v);const v=gp.map(x=>x*1.003);const fd=dot(v,cdir);const p=proj(v);
      if(prev&&fd>0.02&&prev[2]>0.02){const age=k/steps;g.strokeStyle=`rgba(255,212,92,${(0.42-0.30*age)*fd})`;g.lineWidth=Math.max(3,13*fd);g.beginPath();g.moveTo(prev[0],prev[1]);g.lineTo(p[0],p[1]);g.stroke()}
      prev=[p[0],p[1],fd]}
    // orbit ring + satellite
    g.strokeStyle='rgba(255,240,200,0.45)';g.lineWidth=1.2;g.beginPath();let on=false;
    for(let k=-6;k<=6;k++){const s=sat(e,T+k*60);if(occluded(s.v)){on=false;continue}const p=proj(s.v);on?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]);on=true}g.stroke();
    const s=sat(e,T);if(!occluded(s.v)){const p=proj(s.v);g.fillStyle='#fff3c4';g.beginPath();g.arc(p[0],p[1],3,0,7);g.fill();
      // imaging beam to ground
      const gp=proj(norm(s.v).map(x=>x*1.003));g.strokeStyle='rgba(255,212,92,0.35)';g.lineWidth=1;g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(gp[0],gp[1]);g.stroke()}}
  g.globalCompositeOperation='source-over';vignette();
}
// ===== 2 地：全球 60 万+ 实时感知点 =====
function sceneGround(t){bg();window.USE_CAMG&&t<61?camG(t):camGlobe(96+t*1.6,24,3.15-0.35*ease(CP.k));const {cdir}=globeBase(1.4);g.globalCompositeOperation='lighter';
  const pts=D.global;const NN=Math.floor(pts.length*clamp(CP.k*1.6));for(let i=0;i<NN;i++){const [la,lo]=pts[i];const v=ll(la,lo,1.002);const fd=dot(v,cdir);if(fd<0.03)continue;const p=proj(v);const tw=0.55+0.45*Math.sin(t*1.7+i*0.37);g.fillStyle=`rgba(${i%9===0?'255,111,181':'159,232,255'},${(0.22+0.3*tw)*fd})`;g.fillRect(p[0],p[1],1.1,1.1)}
  g.globalCompositeOperation='source-over';vignette();}
// ===== 3 数字世界：477 个信源，每天 2–4 万件事件 =====
function sceneEvents(t){bg();window.USE_CAMG?camG(t):camGlobe(80+t*1.2,22,3.5-0.4*ease(CP.k));const {cdir}=globeBase(0.7);
  const r=(s=>()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296})(11);
  // source halo: 477 sources orbiting as a ring of points
  const srcs=[...Array(477)].map((_,i)=>{const a=i/477*6.283+t*0.03,inc=0.35*Math.sin(i*1.7);return[Math.cos(a)*1.85,Math.sin(a)*Math.sin(inc)*1.85+0.25*Math.sin(i),Math.sin(a)*Math.cos(inc)*1.85]});
  g.globalCompositeOperation='lighter';
  for(const s of srcs){const p=proj(s);if(!p)continue;g.fillStyle='rgba(159,232,255,0.55)';g.fillRect(p[0]-1,p[1]-1,2,2)}
  const cats=Object.values(EVT);const G=D.global;
  const KK=Math.floor(340*clamp(0.15+CP.k*1.3));for(let k=0;k<KK;k++){const born=r()*12,life=3.2;const age=((t-born)%12+12)%12;if(age>life)continue;const pt=G[Math.floor(r()*G.length)];const v=ll(pt[0],pt[1],1.003);const fd=dot(v,cdir);const col=hex(cats[k%cats.length]);
    const sp=srcs[Math.floor(r()*477)];
    // arc from source to event location while age<0.8
    if(age<0.9&&fd>0){const u=age/0.9;const mid=norm(v.map((x,i)=>x+sp[i])).map(x=>x*1.6);const pts=[];for(let j=0;j<=20;j++){const a=j/20*u;const b=[0,1,2].map(i=>(1-a)*(1-a)*sp[i]+2*(1-a)*a*mid[i]+a*a*v[i]);pts.push(proj(b))}
      g.strokeStyle=rgba(col,0.28);g.lineWidth=1;g.beginPath();pts.forEach((p,j)=>p&&(j?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1])));g.stroke()}
    if(age>=0.9&&fd>0.05){const a=(age-0.9)/(life-0.9);const p=proj(v);g.strokeStyle=rgba(col,(1-a)*fd);g.lineWidth=1.6;g.beginPath();g.arc(p[0],p[1],4+a*34*fd,0,7);g.stroke();g.fillStyle=rgba(col,fd);g.beginPath();g.arc(p[0],p[1],3,0,7);g.fill()}}
  g.globalCompositeOperation='source-over';vignette();}
// ===== 4 全国：在线城市与对接中城市 =====
function sceneChina(t){bg();
  const lat0=33,lon0=112;const P=(la,lo,h=0)=>[(lo-lon0)*0.93,h,-(la-lat0)*1.1];
  setCam([1-2*CP.k,26-7*ease(CP.k),32-9*ease(CP.k)],[3,0,0.2],34);
  for(const [la,lo,c] of D.landCN){const p=proj(P(la,lo));if(!p)continue;g.fillStyle=c?'rgba(140,165,200,0.85)':'rgba(93,104,130,0.32)';g.fillRect(p[0],p[1],c?2.2:1.6,c?2.2:1.6)}
  g.globalCompositeOperation='lighter';
  // pending: dim rings
  for(const [la,lo] of D.pending){const p=proj(P(la,lo,0.02));if(!p)continue;const k=(t*0.4+la)%1;g.strokeStyle=`rgba(147,160,186,${0.35})`;g.lineWidth=1.2;g.beginPath();g.ellipse(p[0],p[1],7,4,0,0,7);g.stroke();g.fillStyle='rgba(147,160,186,0.5)';g.fillRect(p[0]-1,p[1]-1,2,2)}
  // online: camera clusters + light column (height ~ access scale)
  const scale={'北京':1,'南京':0.75,'雄安':0.35,'青岛':0.5,'郑州':0.55,'苏州':0.5,'深圳':0.7};
  const r=(s=>()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296})(5);
  for(const [nm,la,lo] of D.online){const sc=scale[nm];const base=P(la,lo,0.02);
    for(let i=0;i<500*sc;i++){const rr=Math.abs((r()+r()+r()-1.5))*0.55*sc+0.02;const a=r()*6.283;const p=proj([base[0]+Math.cos(a)*rr,0.02,base[2]+Math.sin(a)*rr*0.9]);if(p){g.fillStyle='rgba(255,111,181,0.75)';g.fillRect(p[0],p[1],1.6,1.6)}}
    const top=proj([base[0],sc*5*ease(clamp(CP.k*2-0.2)),base[2]]),p0=proj(base);const lg=g.createLinearGradient(p0[0],p0[1],top[0],top[1]);lg.addColorStop(0,'rgba(255,111,181,0.9)');lg.addColorStop(1,'rgba(255,111,181,0)');g.strokeStyle=lg;g.lineWidth=4;g.beginPath();g.moveTo(p0[0],p0[1]);g.lineTo(top[0],top[1]);g.stroke();
    text(nm,top[0],top[1]-8,24,'#ffd1e6','center',500)}
  // SeeMind reads cities together: arcs between online cities
  {const on=D.online;for(let i=0;i<on.length;i++)for(let j=i+1;j<on.length;j++){if(Math.hypot(on[i][1]-on[j][1],on[i][2]-on[j][2])>6.5)continue;const kk=clamp(CP.k*3-1-(i+j)*0.05);if(kk<=0)continue;const A=P(on[i][1],on[i][2],0.02),B=P(on[j][1],on[j][2],0.02);const mid=[(A[0]+B[0])/2,Math.hypot(A[0]-B[0],A[2]-B[2])*0.25,(A[2]+B[2])/2];g.strokeStyle=`rgba(111,201,192,${0.35*kk})`;g.lineWidth=1.2;g.beginPath();for(let s=0;s<=24*kk;s++){const u=s/24;const q=[0,1,2].map(d=>(1-u)*(1-u)*A[d]+2*(1-u)*u*mid[d]+u*u*B[d]);const p=proj(q);s?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1])}g.stroke()}}
  for(const [nm,la,lo] of D.scenic){const p=proj(P(la,lo,0.02));g.fillStyle='#5fe0b0';g.beginPath();g.moveTo(p[0],p[1]-7);g.lineTo(p[0]+6,p[1]);g.lineTo(p[0],p[1]+7);g.lineTo(p[0]-6,p[1]);g.fill();text(nm,p[0]+10,p[1]+6,20,'#5fe0b0')}
  g.globalCompositeOperation='source-over';vignette();}
// ===== 5 城市：一座城的感知网络（环路结构示意） =====
let CITYN=null;
function buildCityNet(){const r=(s=>()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296})(9);const roads=[];
  const ring=(h,pts=120)=>{const a=[];for(let i=0;i<=pts;i++){const u=i/pts*6.283;const c=Math.cos(u),s=Math.sin(u);const k=Math.pow(Math.abs(c)**4+Math.abs(s)**4,-0.25);a.push([h*c*k,h*s*k])}return a};
  [2.6,4.8,7.6,11.5].forEach(h=>roads.push({pts:ring(h),w:3}));
  for(let i=0;i<16;i++){const u=i/16*6.283;roads.push({pts:[[Math.cos(u)*1.2,Math.sin(u)*1.2],[Math.cos(u)*13,Math.sin(u)*13]],w:2})}
  roads.push({pts:[[-13,0],[13,0]],w:3});roads.push({pts:[[0,-13],[0,13]],w:2});
  for(let i=0;i<70;i++){const x=(r()-.5)*20,z=(r()-.5)*20;const hz=r()<.5;const L=1+r()*3;roads.push({pts:hz?[[x-L,z],[x+L,z]]:[[x,z-L],[x,z+L]],w:1})}
  const cams=[];for(const rd of roads){const n=rd.w===3?60:rd.w===2?25:8;for(let i=0;i<n;i++){const seg=Math.floor(r()*(rd.pts.length-1));const a=rd.pts[seg],b=rd.pts[seg+1];const u=r();const x=a[0]+(b[0]-a[0])*u,z=a[1]+(b[1]-a[1])*u;const d=Math.hypot(x,z);if(r()<Math.min(1,0.25+3/(d+1)))cams.push([x,z,Math.atan2(b[1]-a[1],b[0]-a[0])+(r()<.5?0:Math.PI)])}}
  const evs=[...Array(60)].map(()=>{const c=cams[Math.floor(r()*cams.length)];return[c[0],c[1],Object.keys(EVT)[Math.floor(r()*4)],r()*8]});
  CITYN={roads,cams,evs}}
function sceneCity(t){bg();if(!CITYN)buildCityNet();const az=-0.9+t*0.025;const dd=17-5*ease(CP.k);setCam([Math.sin(az)*dd,10-2.5*ease(CP.k),Math.cos(az)*dd],[0.6,0,0],40);
  // district highlight (core district)
  const dist=[[0,-3.4],[2.6,-3.4],[2.6,2.8],[0,2.8]].map(q=>proj([q[0],0,q[1]]));g.fillStyle='rgba(111,201,192,0.07)';g.beginPath();dist.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill();g.strokeStyle='rgba(111,201,192,0.5)';g.setLineDash([6,6]);g.lineWidth=1.5;g.stroke();g.setLineDash([]);
  g.globalCompositeOperation='lighter';
  for(const rd of CITYN.roads){g.strokeStyle=`rgba(79,127,184,${rd.w===3?0.55:rd.w===2?0.35:0.18})`;g.lineWidth=rd.w===3?2.5:rd.w;g.beginPath();rd.pts.forEach((q,i)=>{const p=proj([q[0],0,q[1]]);if(p)i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1])});g.stroke()}
  // cameras with view cones (coverage)
  const NC=Math.floor(CITYN.cams.length*clamp(CP.k*2));for(let ci=0;ci<NC;ci++){const [x,z,h]=CITYN.cams[ci];const a=proj([x,0.02,z]);if(!a)continue;const L=0.55,s=0.45;const b=proj([x+Math.cos(h-s)*L,0.02,z+Math.sin(h-s)*L]),c=proj([x+Math.cos(h+s)*L,0.02,z+Math.sin(h+s)*L]);if(b&&c){const gg=g.createRadialGradient(a[0],a[1],0,a[0],a[1],Math.hypot(b[0]-a[0],b[1]-a[1]));gg.addColorStop(0,'rgba(255,111,181,0.32)');gg.addColorStop(1,'rgba(255,111,181,0)');g.fillStyle=gg;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.lineTo(c[0],c[1]);g.closePath();g.fill()}
    g.fillStyle='rgba(255,140,200,0.95)';g.fillRect(a[0]-1.2,a[1]-1.2,2.4,2.4)}
  // detected events: rings by category
  for(const [x,z,cat,ph] of CITYN.evs){const age=((t-ph)%8+8)%8;if(age>3)continue;const k=age/3;const p=proj([x,0.03,z]);if(!p)continue;const col=hex(EVT[cat]);g.strokeStyle=rgba(col,1-k);g.lineWidth=2;g.beginPath();g.ellipse(p[0],p[1],4+k*26,(4+k*26)*0.5,0,0,7);g.stroke();g.fillStyle=rgba(col,1);g.beginPath();g.arc(p[0],p[1],3.5,0,7);g.fill()}
  g.globalCompositeOperation='source-over';vignette();}
// ===== 7 现实判分：预测带 vs 实际 =====
function sceneVerify(t){bg();const x0=180,x1=1740,y0=300,y1=820;
  g.strokeStyle='rgba(93,104,130,0.4)';g.lineWidth=1;for(let i=0;i<=6;i++){const y=lerp(y0,y1,i/6);g.beginPath();g.moveTo(x0,y);g.lineTo(x1,y);g.stroke()}
  const N=96;const f=i=>0.45+0.28*Math.sin(i/9)+0.12*Math.sin(i/3.1)+0.06*Math.sin(i*1.7);const act=i=>f(i)+0.07*Math.sin(i*2.3+1)+(i%23===0?0.2:0);
  const X=i=>lerp(x0,x1,i/N),Y=v=>lerp(y1,y0,v);const nowI=Math.min(N,Math.floor(N*(0.12+0.6*CP.k)));
  // prediction band (ahead of now, widening)
  g.fillStyle='rgba(111,201,192,0.18)';g.beginPath();for(let i=0;i<=N;i++){const w=0.06+0.10*Math.max(0,(i-nowI))/N*3;g.lineTo(X(i),Y(f(i)+w))}for(let i=N;i>=0;i--){const w=0.06+0.10*Math.max(0,(i-nowI))/N*3;g.lineTo(X(i),Y(f(i)-w))}g.closePath();g.fill();
  g.strokeStyle='rgba(111,201,192,0.9)';g.lineWidth=2;g.setLineDash([8,6]);g.beginPath();for(let i=0;i<=N;i++)g.lineTo(X(i),Y(f(i)));g.stroke();g.setLineDash([]);
  // actuals up to now, judged
  let hit=0,all=0;for(let i=0;i<=nowI;i++){const w=0.06+0.10*Math.max(0,(i-nowI))/N*3;const a=act(i);const ok=Math.abs(a-f(i))<=w+0.02;all++;hit+=ok;g.fillStyle=ok?'#5fe0b0':'#ff7a7a';g.beginPath();g.arc(X(i),Y(a),ok?4:5.5,0,7);g.fill()}
  g.strokeStyle='rgba(233,238,249,0.7)';g.beginPath();g.moveTo(X(nowI),y0-30);g.lineTo(X(nowI),y1+20);g.stroke();text('此刻',X(nowI),y0-40,22,'#e9eef9','center',500);
  text('过去',x0,y1+50,20,'#93a0ba');text('未来 · 预测带随时间变宽',x1,y1+50,20,'#93a0ba','right');
  vignette();}
window.SC={sky:sceneSky,ground:sceneGround,events:sceneEvents,china:sceneChina,city:sceneCity,verify:sceneVerify};
