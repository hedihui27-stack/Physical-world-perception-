// ===== 第六版 · 城市类镜头：东城摄像头、东城 7×24、南京 =====
// 东城：无数路口的「眼睛」—— 柔和的橙色覆盖光斑
shotEyes=function(t){const lt=LT(t);const az=-0.4+lt*0.05;const cam=()=>setCam([Math.sin(az)*6,4.2-0.8*clamp(lt/5),Math.cos(az)*6+2],[0.6,0,1.5],46);const save=cityCam;window.NOHERO=1;window.CONEA=0;cityCam=cam;drawCityDC(t);cityCam=save;window.NOHERO=0;window.CONEA=1;g.fillStyle='rgba(6,7,10,0.4)';g.fillRect(0,0,W,H);cam();
  g.globalCompositeOperation='lighter';const on=clamp(lt/0.8);
  for(let i=0;i<DC.cams.length;i++){const [x,z,hd]=DC.cams[i];const a=proj([x,0.03,z]);if(!a||a[2]<0.6)continue;const k=clamp(on*1.6-((i*0.37)%1)*0.6);if(k<=0)continue;const pulse=0.85+0.15*Math.sin(t*2.2+i);
    camPool(x+Math.cos(hd)*0.1,z+Math.sin(hd)*0.1,0.24*pulse,C_OR,0.28*k);
    const top=proj([x,0.12,z]);if(top){g.strokeStyle=rgba(C_OR2,0.55*k);g.lineWidth=1;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(top[0],top[1]);g.stroke();const s=clamp(6/top[2],1.5,7);g.fillStyle=rgba([255,236,200],0.95*k);g.fillRect(top[0]-s/2,top[1]-s/3,s,s*0.66)}}
  g.globalCompositeOperation='source-over';vignette()};
// 东城：从人工巡查到 7×24 —— 不再有昼夜罩色（之前的两次变亮）
shotDCDay=function(t){const lt=LT(t);const hour=(8+lt/9.4*48)%24;
  const sw=clamp((lt-3.6)/1.2);window.CONEA=sw;window.POOLC=C_OR;
  const save=cityCam;window.NOHERO=1;cityCam=()=>{const az=0.9+lt*0.035,R0=15-3*ease(clamp(lt/9)),h=11-2.5*ease(clamp(lt/9));setCam([Math.sin(az)*R0,h,Math.cos(az)*R0],[0.5,0,-1],44)};drawCityDC(t);cityCam=save;window.NOHERO=0;window.CONEA=1;window.POOLC=null;
  // manual patrol: a few small lights, daytime only, on a handful of streets
  if(sw<1){g.globalCompositeOperation='lighter';const day=hour>8&&hour<18;if(day)for(let i=0;i<9;i++){const u=((lt*0.06+i*0.17)%1);const x=-6+((i*3.1)%12),z=-9+u*18;camPool(x,z,0.5,C_WH,0.55*(1-sw))}g.globalCompositeOperation='source-over'}
  // 24-hour ring: two short patrol arcs (grey) vs an always-on ring (orange)
  const cx=1660,cy=230,r=110;g.strokeStyle='rgba(150,158,172,0.28)';g.lineWidth=16;g.beginPath();g.arc(cx,cy,r,0,7);g.stroke();
  const arc=(h0,h1,col,rr,w)=>{g.strokeStyle=col;g.lineWidth=w;g.beginPath();g.arc(cx,cy,rr,(h0/24)*6.283-1.5708,(h1/24)*6.283-1.5708);g.stroke()};arc(9,11,'rgba(205,210,220,0.9)',r,16);arc(14.5,16.5,'rgba(205,210,220,0.9)',r,16);
  if(sw>0){g.globalCompositeOperation='lighter';arc(0,24*ease(sw),rgba(C_OR,0.95),r-24,12);arc(0,24*ease(sw),rgba(C_OR,0.25),r-24,26);g.globalCompositeOperation='source-over'}
  const ha=hour/24*6.283-1.5708;g.fillStyle='#fff';g.beginPath();g.arc(cx+Math.cos(ha)*(r+22),cy+Math.sin(ha)*(r+22),6,0,7);g.fill();
  text(String(Math.floor(hour)).padStart(2,'0')+':00',cx,cy+12,34,'#eceef2','center',700,1);
  const la=clamp(lt/0.8);text('北京 · 东城区',120,1000,30,`rgba(236,238,242,${la})`,'left',600,4);vignette()};

// ---------- 南京 · 玄武区：密集城区在前，钟山在后隆起，人流热区用橙色 ----------
function njH(x,z){const e=(cx,cz,sx,sz,h)=>h*Math.exp(-(((x-cx)/sx)**2+((z-cz)/sz)**2));
  let h=e(10.4,-1.6,3.4,1.5,1.55)+e(7.4,-0.9,1.9,1.2,0.75)+e(12.9,-2.4,1.7,1.3,0.7)+e(9.0,0.6,1.6,1.0,0.45);
  h*=1+0.12*Math.sin(x*3.1+z*1.7)+0.08*Math.sin(x*7.3-z*5.1);return Math.max(0,h-0.16)*1.35}
let NJM=null;
function buildNJM(){const S=0.22;const Q=[];for(let x=4.2;x<15;x+=S)for(let z=-5.2;z<2.8;z+=S){const v=[[x,njH(x,z),z],[x+S,njH(x+S,z),z],[x+S,njH(x+S,z+S),z+S],[x,njH(x,z+S),z+S]];const hm=(v[0][1]+v[1][1]+v[2][1]+v[3][1])/4;if(hm<0.004)continue;const n=norm([v[0][1]-v[1][1],S,v[0][1]-v[3][1]]);Q.push({v,n,hm,c:[x+S/2,hm,z+S/2]})}
  // keep only buildings that are not under the mountain
  const B=(NJ?NJ.b:[]).filter(b=>njH(b[0],b[1])<0.08);NJM={Q,B}}
shotNanjing=function(t){bg();if(!NJM)buildNJM();const lt=LT(t);const S=NJ?NJ.scenic:[10.14,-0.56];
  // camera stands over the dense south-west city and looks north-east to Zhongshan
  const k=ease(clamp(lt/5.4));const cp=[lerp(-6.5,-4.6,k),lerp(4.2,3.6,k),lerp(10.5,9.0,k)];setCam(cp,[lerp(7.0,8.0,k),0.9,lerp(-1.0,-1.2,k)],42);
  // ground grid
  g.strokeStyle='rgba(150,160,175,0.06)';g.lineWidth=1;for(let i=-10;i<=16;i++){const a=proj([i,0,-12]),b=proj([i,0,12]);if(a&&b){g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke()}const c=proj([-10,0,i-4]),d=proj([16,0,i-4]);if(c&&d){g.beginPath();g.moveTo(c[0],c[1]);g.lineTo(d[0],d[1]);g.stroke()}}
  // Zhongshan: shaded terrain with soft ridge light
  const key=norm([-0.5,0.8,0.5]);const Q=NJM.Q.map(q=>[Math.hypot(...sub(q.c,M.p)),q]).sort((a,b)=>b[0]-a[0]);
  for(const [d,q] of Q){const P=q.v.map(proj);if(P.some(x=>!x))continue;const lit=0.3+0.7*Math.max(0,dot(q.n,key));const col=[30,34,42].map((x,i)=>x*(0.4+0.9*lit)+q.hm*[9,8,5][i]);const ea=clamp(q.hm/0.18);g.fillStyle=rgba(col,0.98*ea);g.beginPath();P.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill();g.strokeStyle=rgba([150,160,172],(0.03+0.09*clamp(q.hm/1.4))*ea);g.lineWidth=0.6;g.stroke()}
  // buildings in front (DC style), forest-free footprints only
  drawBlds(NJM.B,{hs:1.0,edgeD:10,col:(x,z,hm)=>R.altitude(lerp(1200,8000,clamp((hm-3)/120)))});
  // heat of people rising out of the scenic area, following the terrain
  const grow=ease(clamp((lt-2.2)/1.8));g.globalCompositeOperation='lighter';const r2=rng(21);
  for(let i=0;i<4500;i++){const a=r2()*6.283,rr=Math.pow(r2(),0.7)*3.0;const x=S[0]+Math.cos(a)*rr*1.4,z=S[1]+Math.sin(a)*rr*0.9;const dens=Math.exp(-rr*rr/3.2);const y=njH(x,z)+0.04+dens*1.9*grow*(0.7+0.3*r2());const p=proj([x,y,z]);if(!p)continue;const c=dens>0.5?C_OR2:C_OR;g.fillStyle=rgba(c,(0.32*grow+0.05)*(0.4+0.6*dens));const s=clamp(9/p[2],1,3);g.fillRect(p[0]-s/2,p[1]-s/2,s,s)}
  // a soft orange glow over the hotspot
  const ph=proj([S[0],njH(S[0],S[1])+0.9*grow,S[1]]);if(ph&&grow>0){const R0=260;const gg=g.createRadialGradient(ph[0],ph[1],0,ph[0],ph[1],R0);gg.addColorStop(0,rgba(C_OR,0.22*grow));gg.addColorStop(1,rgba(C_OR,0));g.fillStyle=gg;g.beginPath();g.arc(ph[0],ph[1],R0,0,7);g.fill()}
  // the question travels as a beam of light from the city into the scenic area
  const qa=clamp((lt-0.6)/1.6);if(qa>0){const from=[-3.5,0.3,5.5],to=[S[0],njH(S[0],S[1])+0.5,S[1]];for(let k2=0;k2<60;k2++){const u=Math.min(qa,k2/60);const v=[0,1,2].map(i=>lerp(from[i],to[i],u)+(i===1?Math.sin(u*Math.PI)*2.4:0));const p=proj(v);if(!p)continue;g.fillStyle=`rgba(240,236,228,${0.9*(k2/60)})`;g.beginPath();g.arc(p[0],p[1],2.6,0,7);g.fill()}}
  g.globalCompositeOperation='source-over';
  const q='钟山景区，现在人多吗？';const n=Math.floor(clamp(lt/1.8)*q.length);g.fillStyle='rgba(18,20,26,0.82)';g.strokeStyle='rgba(236,238,242,0.4)';g.lineWidth=1.2;g.beginPath();g.roundRect(560,900,800,90,45);g.fill();g.stroke();text(q.slice(0,n),960,958,36,'#f4f4f2','center',600,2);
  const aa=clamp((lt-3.6)/0.6);if(aa>0&&ph)text('人流 · 适中',ph[0],ph[1]-30,42,rgba(C_OR2,aa),'center',800,3);
  text('南京 · 玄武区',120,1000,30,'rgba(236,238,242,0.9)','left',600,4);vignette()};
