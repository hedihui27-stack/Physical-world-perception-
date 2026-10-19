// ===== 第五版 · 第三批：全国、东城的一天、南京、AGI =====
function chinaP(la,lo,h=0){return[(lo-112)*0.93,h,-(la-33.5)*1.1]}
function drawChinaBase(alpha=1){for(const [la,lo,c] of D.landCN){const p=proj(chinaP(la,lo));if(!p)continue;g.fillStyle=c?`rgba(140,220,255,${alpha})`:`rgba(120,140,185,${0.85*alpha})`;const s=clamp((c?60:46)/p[2],2,9);g.fillRect(p[0],p[1],s,s)}}
// ---------- 镜 19：全国在线城市 ----------
function shotChina5(t){bg();const lt=LT(t);setCam([3+lt*0.3,19-lt*0.5,24-lt*0.6],[3,0,1.5],38);drawChinaBase(1);g.globalCompositeOperation='lighter';for(const c of C275){const p=proj(chinaP(c[0],c[1],0.02));if(!p)continue;const R2=clamp(90/p[2],3,12);const gg=g.createRadialGradient(p[0],p[1],0,p[0],p[1],R2);gg.addColorStop(0,'rgba(111,201,192,0.55)');gg.addColorStop(1,'rgba(111,201,192,0)');g.fillStyle=gg;g.beginPath();g.arc(p[0],p[1],R2,0,7);g.fill()}g.globalCompositeOperation='source-over';
  g.globalCompositeOperation='lighter';
  for(const [la,lo] of D.pending){const p=proj(chinaP(la,lo,0.02));if(!p)continue;const fl=0.5+0.5*Math.sin(t*4+la*3);const R2=clamp(60/p[2],4,14);const gg=g.createRadialGradient(p[0],p[1],0,p[0],p[1],R2);gg.addColorStop(0,`rgba(180,190,215,${0.55*fl})`);gg.addColorStop(1,'rgba(180,190,215,0)');g.fillStyle=gg;g.beginPath();g.arc(p[0],p[1],R2,0,7);g.fill()}
  const scale={'北京':1,'南京':0.8,'雄安':0.4,'青岛':0.55,'郑州':0.6,'苏州':0.55,'深圳':0.75};
  for(const [nm,la,lo] of D.online){const sc=scale[nm]||0.5;const rise=ease(clamp((lt-0.1)/1.4));const b=chinaP(la,lo,0.02),tp=chinaP(la,lo,sc*5*rise);const p0=proj(b),p1=proj(tp);if(!p0||!p1)continue;
    for(let w=0;w<3;w++){const lg=g.createLinearGradient(p0[0],p0[1],p1[0],p1[1]);lg.addColorStop(0,`rgba(255,111,181,${0.95-w*0.22})`);lg.addColorStop(1,'rgba(255,111,181,0)');g.strokeStyle=lg;g.lineWidth=6+w*14;g.beginPath();g.moveTo(p0[0],p0[1]);g.lineTo(p1[0],p1[1]);g.stroke()}
    const R2=clamp(300/p0[2],14,60);const gg=g.createRadialGradient(p0[0],p0[1],0,p0[0],p0[1],R2);gg.addColorStop(0,'rgba(255,140,200,0.8)');gg.addColorStop(1,'rgba(255,140,200,0)');g.fillStyle=gg;g.beginPath();g.arc(p0[0],p0[1],R2,0,7);g.fill();
    g.globalCompositeOperation='source-over';text(nm,p1[0],p1[1]-10,26,'#ffd1e6','center',700,2);g.globalCompositeOperation='lighter'}
  g.globalCompositeOperation='source-over';vignette()}
// ---------- 镜 20：东城的一天（人工 vs 7×24） ----------
function shotDCDay(t){const lt=LT(t);const dayT=(lt/9.4)*2;const hour=(8+lt/9.4*48)%24; // two simulated days
  const sw=clamp((lt-3.6)/1.2);window.CONEA=sw;
  const save=cityCam;window.NOHERO=1;cityCam=()=>{const az=0.9+lt*0.035,R0=15-3*ease(clamp(lt/9)),h=11-2.5*ease(clamp(lt/9));setCam([Math.sin(az)*R0,h,Math.cos(az)*R0],[0.5,0,-1],44)};drawCityDC(t);cityCam=save;window.NOHERO=0;window.CONEA=1;
  // day / night: a warm wash in daytime, deep blue at night
  const sun=Math.sin((hour-6)/24*6.283);g.globalCompositeOperation='source-over';g.fillStyle=sun>0?`rgba(255,200,140,${0.08*sun})`:`rgba(5,10,30,${0.35*(-sun)})`;g.fillRect(0,0,W,H);
  // manual patrol: a few small circles, daytime only, on a handful of streets
  if(sw<1){g.globalCompositeOperation='lighter';for(let i=0;i<9;i++){const day=hour>8&&hour<18;if(!day)continue;const u=((lt*0.06+i*0.17)%1);const x=-6+((i*3.1)%12),z=-9+u*18;const p=proj([x,0.03,z]);if(!p)continue;const R2=clamp(260/p[2],10,40);const gg=g.createRadialGradient(p[0],p[1],0,p[0],p[1],R2);gg.addColorStop(0,`rgba(255,200,120,${0.75*(1-sw)})`);gg.addColorStop(1,'rgba(255,200,120,0)');g.fillStyle=gg;g.beginPath();g.ellipse(p[0],p[1],R2,R2*0.5,0,0,7);g.fill()}g.globalCompositeOperation='source-over'}
  // 24-hour ring: patrol hours vs always-on
  const cx=1660,cy=230,r=110;g.strokeStyle='rgba(147,160,186,0.3)';g.lineWidth=16;g.beginPath();g.arc(cx,cy,r,0,7);g.stroke();
  const arc=(h0,h1,col,rr,w)=>{g.strokeStyle=col;g.lineWidth=w;g.beginPath();g.arc(cx,cy,rr,(h0/24)*6.283-1.5708,(h1/24)*6.283-1.5708);g.stroke()};arc(9,11,'rgba(255,200,120,0.95)',r,16);arc(14.5,16.5,'rgba(255,200,120,0.95)',r,16);
  if(sw>0)arc(0,24*ease(sw),'rgba(90,160,255,0.95)',r-24,12);const ha=hour/24*6.283-1.5708;g.fillStyle='#fff';g.beginPath();g.arc(cx+Math.cos(ha)*(r+22),cy+Math.sin(ha)*(r+22),6,0,7);g.fill();
  text(String(Math.floor(hour)).padStart(2,'0')+':00',cx,cy+12,34,'#e9eef9','center',700,1);
  const la=clamp(lt/0.8);text('北京 · 东城区',120,1000,30,`rgba(233,238,249,${la})`,'left',600,4);vignette()}
// ---------- 镜 21：南京 · 一句话问现实 ----------
let NJ=null;
function shotNanjing(t){bg();const lt=LT(t);const B=NJ||{b:[]};const S0=NJ?NJ.scenic:[4,-1];const az=-0.75+lt*0.03;setCam([S0[0]-3+Math.sin(az)*9.5,6.8-1.2*ease(clamp(lt/5.4)),S0[1]+Math.cos(az)*9.5],[S0[0]-3,0.8,S0[1]],46);
  g.strokeStyle='rgba(79,127,184,0.08)';g.lineWidth=1;for(let i=-14;i<=14;i++){const a=proj([i,0,-14]),b=proj([i,0,14]);if(a&&b){g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke()}}
  const list=[];for(const b of B.b){const d=Math.hypot(b[0]-M.p[0],b[1]-M.p[2]);list.push([d,b])}list.sort((a,b)=>b[0]-a[0]);
  for(const [d,[cx,cz,h,r]] of list){const n=r.length/2;const top=[];let ok=true;for(let i=0;i<n;i++){const p=proj([r[2*i],h,r[2*i+1]]);if(!p){ok=false;break}top.push(p)}if(!ok)continue;const hm=h*1000*0.4/2.5;const c=R.altitude(lerp(3000,13000,clamp((hm-3)/90)));g.fillStyle=rgba(c,0.85);g.beginPath();top.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill();g.strokeStyle=rgba(c.map(v=>Math.min(255,v*1.3)),0.5);g.lineWidth=0.6;g.stroke()}
  // the scenic area: a heat mountain of people rising out of the ground
  const S=[NJ?NJ.scenic[0]:4,NJ?NJ.scenic[1]:-1];const grow=ease(clamp((lt-2.4)/1.8));g.globalCompositeOperation='lighter';const r2=rng(21);
  for(let i=0;i<9000;i++){const a=r2()*6.283,rr=Math.pow(r2(),0.7)*3.4;const x=S[0]+Math.cos(a)*rr*1.3,z=S[1]+Math.sin(a)*rr;const dens=Math.exp(-rr*rr/3.6);const y=dens*3.2*grow*(0.7+0.3*r2());const p=proj([x,y,z]);if(!p)continue;const c=R.density(dens);g.fillStyle=rgba(c,0.55*grow+0.05);const s=clamp(10/p[2],1.2,4);g.fillRect(p[0]-s/2,p[1]-s/2,s,s)}
  // the question travels as a beam of light into the scenic area
  const qa=clamp((lt-0.6)/1.6);if(qa>0){const from=[S[0]-6,0.2,S[1]+7],to=[S[0],0.8,S[1]];for(let k=0;k<40;k++){const u=Math.min(qa,k/40);const v=[0,1,2].map(i=>lerp(from[i],to[i],u)+(i===1?Math.sin(u*Math.PI)*2.2:0));const p=proj(v);if(!p)continue;g.fillStyle=`rgba(233,238,249,${0.9*(k/40)})`;g.beginPath();g.arc(p[0],p[1],3,0,7);g.fill()}}
  g.globalCompositeOperation='source-over';
  const q='钟山景区，现在人多吗？';const n=Math.floor(clamp(lt/1.8)*q.length);g.fillStyle='rgba(23,32,39,0.8)';g.strokeStyle='rgba(233,238,249,0.4)';g.lineWidth=1.2;g.beginPath();g.roundRect(560,900,800,90,45);g.fill();g.stroke();text(q.slice(0,n),960,958,36,'#f2f6ff','center',600,2);
  const aa=clamp((lt-3.6)/0.6);if(aa>0){const pc=proj([S[0],1.9,S[1]]);if(pc)text('人流 · 适中',pc[0],pc[1]-20,40,`rgba(111,201,192,${aa})`,'center',800,3)}
  text('南京 · 玄武区',120,1000,30,'rgba(233,238,249,0.9)','left',600,4);vignette()}
// ---------- 镜 22：地球变成一颗发光的神经网络 ----------
let NEURO=null;
function buildNeuro(){const G=D.global;const r=rng(31);const pts=[];for(let i=0;i<G.length;i+=12)pts.push(ll(G[i][0],G[i][1],1.003));const L=[];for(let k=0;k<5200;k++){const a=Math.floor(r()*pts.length);let best=-1,bd=9;for(let j=0;j<10;j++){const b=Math.floor(r()*pts.length);const d=Math.hypot(...sub(pts[a],pts[b]));if(d>0.01&&d<bd){bd=d;best=b}}if(best>=0&&bd<0.22)L.push([a,best,r()])}NEURO={pts,L}}
function shotAGI(t){bg();if(!NEURO)buildNeuro();const lt=LT(t);camGlobe(118-lt*1.5,26,lerp(1.7,3.3,ease(clamp(lt/7))));const cdir=norm(M.p);earthRich(cdir,{land:0.5});cityLights(t,cdir,0.8,1.2);
  const k=ease(clamp((lt-1.0)/3));g.globalCompositeOperation='lighter';for(const [a,b,ph] of NEURO.L){const A=NEURO.pts[a],Bp=NEURO.pts[b];if(dot(A,cdir)<0.05)continue;if(ph>k)continue;const mid=norm(A.map((x,i)=>x+Bp[i])).map(x=>x*1.03);const pa=proj(A),pb=proj(Bp),pm=proj(mid);if(!pa||!pb||!pm)continue;const pulse=0.5+0.5*Math.sin(t*4+ph*30);g.strokeStyle=`rgba(${150+100*pulse|0},${200+40*pulse|0},255,${0.35*dot(A,cdir)})`;g.lineWidth=1;g.beginPath();g.moveTo(pa[0],pa[1]);g.quadraticCurveTo(pm[0],pm[1],pb[0],pb[1]);g.stroke()}
  // the reality loop as a ring of light around the planet
  const tilt=0.42,Rr=1.5;const pts=[];for(let j=0;j<=200;j++){const u=j/200*6.283;pts.push([Math.cos(u)*Rr,Math.sin(u)*Math.sin(tilt)*Rr,Math.sin(u)*Math.cos(tilt)*Rr])}for(let w=0;w<3;w++)poly(pts,`rgba(233,238,249,${(0.35-w*0.1)*k})`,1.5+w*5);
  for(let q=0;q<4;q++){const u=(t*0.25+q/4)*6.283;const v=[Math.cos(u)*Rr,Math.sin(u)*Math.sin(tilt)*Rr,Math.sin(u)*Math.cos(tilt)*Rr];if(occluded(v))continue;const p=proj(v);if(!p)continue;const col=[C_CAM,C_NET,C_SAT,C_SEN][q];const gg=g.createRadialGradient(p[0],p[1],0,p[0],p[1],22);gg.addColorStop(0,rgba(col,0.95*k));gg.addColorStop(1,rgba(col,0));g.fillStyle=gg;g.beginPath();g.arc(p[0],p[1],22,0,7);g.fill()}
  g.globalCompositeOperation='source-over';vignette()}
