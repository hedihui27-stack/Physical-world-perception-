// ===== 结尾三个方向的打样 =====
let ST=null;
function initST(){const C=[1.3*MS,-1.7*MS];buildSB(1.3,-1.7,1.1);
  const Wm=BLK.w.map(w=>{const o=[];for(let i=0;i<w.length;i+=2)o.push(w[i]*MS,w[i+1]*MS);return o});
  // nearest straight-ish walk segment to C → camera street
  let best=null;for(const w of Wm)for(let i=0;i<w.length-2;i+=2){const d=Math.hypot(w[i]-C[0],w[i+1]-C[1]);if(!best||d<best.d)best={d,w,i}}
  const w=best.w,i=best.i;let j=Math.min(w.length-2,i+16);const dir=norm([w[j]-w[i],0,w[j+1]-w[i+1]]);
  const near=Wm.filter(v=>Math.hypot(v[0]-C[0],v[1]-C[1])<700);
  const r=rng(5);const A=[];for(let k=0;k<160;k++){const kk=k%10;A.push({k:kk<4?'car':kk<7?'bot':kk<8?'dog':'drone',w:near[Math.floor(r()*near.length)],sp:(kk<4?0.012:0.004)*(0.7+0.6*r()),ph:r()*2,h:12+r()*30})}
  ST={C,cam:[w[i],w[i+1]],dir,A}}
function agentAt(A,t){const [x,z]=walkerXZ(A.w,t,A.sp,A.ph);const [x2,z2]=walkerXZ(A.w,t+0.2,A.sp,A.ph);return[x,z,Math.atan2(z2-z,x2-x)]}
function ground(a=1){const q=[[-3000,-3000],[3000,-3000],[3000,3000],[-3000,3000]].map(([x,z])=>proj([x,0,z]));if(q.every(p=>p)){g.fillStyle=`rgba(9,10,13,${a})`;fillP(q)}}
function drawAgents(t,maxD,heroes=[]){const fx=[];
  for(const A of ST.A){const [x,z,yaw]=agentAt(A,t);if(Math.hypot(x-M.p[0],z-M.p[2])>maxD)continue;
    if(A.k==='car'){car(x,z,yaw);fx.push(()=>carFX(x,z,yaw))}else if(A.k==='bot'){humanoid(x,z,yaw,t);fx.push(()=>botFX(x,z))}else if(A.k==='dog'){dog(x,z,yaw,t);fx.push(()=>botFX(x,z,0.7))}
    else{const y=A.h;drone(x,y,z,yaw,t);fx.push(()=>droneFX(x,y,z))}}
  for(const h of heroes){h.f();fx.push(h.fx)}return fx}
function runFX(fx){g.globalCompositeOperation='lighter';fx.forEach(f=>f());g.globalCompositeOperation='source-over'}
// street camera + heroes
function streetCam(t,back=0,up=0){const [cx,cz]=ST.cam,d=ST.dir;const p=[cx-d[0]*(6+back),1.25+up,cz-d[2]*(6+back)];setCam(p,[cx+d[0]*80,9+up*0.4,cz+d[2]*80],56);return p}
function heroes(t){const [cx,cz]=ST.cam,d=ST.dir,s=[-d[2],0,d[0]];const yaw=Math.atan2(d[2],d[0]);const P=(f,l)=>[cx+d[0]*f+s[0]*l,cz+d[2]*f+s[2]*l];
  const H=[];const h1=P(-2.6+t*0.6,-1.3);H.push({f:()=>humanoid(h1[0],h1[1],yaw,t),fx:()=>botFX(h1[0],h1[1])});
  const d1=P(2,1.6);H.push({f:()=>dog(d1[0],d1[1],yaw+0.3,t),fx:()=>botFX(d1[0],d1[1],0.7)});
  const c1=P(16-t*2,3.2);H.push({f:()=>car(c1[0],c1[1],yaw+Math.PI,{}),fx:()=>carFX(c1[0],c1[1],yaw+Math.PI)});
  const c2=P(55+t*6,-3.5);H.push({f:()=>car(c2[0],c2[1],yaw),fx:()=>carFX(c2[0],c2[1],yaw)});
  for(const [f,l,y] of [[3,0.8,4.2],[14,-4,9],[30,6,16],[50,-2,22]]){const q=P(f,l);const yy=y+Math.sin(t+f)*0.6;H.push({f:()=>drone(q[0],yy,q[1],yaw,t),fx:()=>droneFX(q[0],yy,q[1])})}
  return H}
function frontage(o={}){const [cx,cz]=ST.cam,d=ST.dir,s=[-d[2],0,d[0]];const yaw=Math.atan2(d[2],d[0]);const r=rng(31);
  for(const side of [-1,1]){let f=-20;while(f<420){const w=8+r()*16,h=r()<0.25?18+r()*40:6+r()*9,dp=10+r()*8,set=9+r()*3;const c=[cx+d[0]*(f+w/2)+s[0]*side*(set+dp/2),cz+d[2]*(f+w/2)+s[2]*side*(set+dp/2)];
    SB.push({x:c[0],z:c[1],h,pts:[[-w/2,-dp/2],[w/2,-dp/2],[w/2,dp/2],[-w/2,dp/2]].map(([u,v])=>[c[0]+u*Math.cos(yaw)-v*Math.sin(yaw),c[1]+u*Math.sin(yaw)+v*Math.cos(yaw)]),seed:(r()*1e6)|0,lit:0.15+r()*0.35,syn:1});f+=w+1.5+r()*4}}}
function street(t,o={}){bg2();if(!ST.fr){frontage();ST.fr=1}const cp=streetCam(t,o.back||0,o.up||0);ground();queueBlds(o.bld||{});const fx=drawAgents(t,o.maxD||500,o.noHero?[]:heroes(t));flush();runFX(fx);return cp}
function bg2(){const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#06070a');gr.addColorStop(0.55,'#0f1116');gr.addColorStop(1,'#07080b');g.fillStyle=gr;g.fillRect(0,0,W,H)}
// ---- A: slices of reality rise from every machine ----
function slice(c,sz,yaw,a,img=true){const cs=Math.cos(yaw),sn=Math.sin(yaw),w=sz*1.6,h=sz;const P=[[-w/2,-h/2],[w/2,-h/2],[w/2,h/2],[-w/2,h/2]].map(([u,v])=>proj([c[0]+u*cs,c[1]+v,c[2]+u*sn]));if(P.some(p=>!p))return;
  if(img&&VC.img&&Math.abs(P[1][0]-P[0][0])>6){g.save();g.globalAlpha=a*0.55;g.setTransform((P[1][0]-P[0][0])/VC.img.width,(P[1][1]-P[0][1])/VC.img.width,(P[3][0]-P[0][0])/VC.img.height,(P[3][1]-P[0][1])/VC.img.height,P[0][0],P[0][1]);
    // flip vertical since v grows upward
    g.drawImage(VC.img,0,0);g.restore()}
  g.globalCompositeOperation='lighter';g.fillStyle=rgba(C_OR,0.10*a);fillP(P);g.strokeStyle=rgba(C_OR2,0.8*a);g.lineWidth=1.4;g.beginPath();P.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.stroke();g.globalCompositeOperation='source-over'}
function slicesFrom(t,maxD,rise){const r=rng(9);for(const A of ST.A){const [x,z]=agentAt(A,t);if(Math.hypot(x-M.p[0],z-M.p[2])>maxD)continue;for(let k=0;k<3;k++){const u=(t*0.25+k/3+r())%1;const y=(A.k==='drone'?A.h:2)+u*rise;slice([x+Math.sin(u*5+k)*2,y,z+Math.cos(u*4+k)*2],0.8+u*2.2,r()*6.28,Math.sin(u*Math.PI))}}}
function earthNight(lon,lat,dist,o={}){bg2();camGlobe(lon,lat,dist);const cdir=norm(M.p);const c0=proj([0,0,0]);const e=proj(norm(cross(cdir,[0,1,0])));const R0=Math.hypot(e[0]-c0[0],e[1]-c0[1]);
  g.globalCompositeOperation='lighter';for(const [k,a] of [[1.03,0.16],[1.12,0.07]]){const gr=g.createRadialGradient(c0[0],c0[1],R0*0.97,c0[0],c0[1],R0*k*1.1);gr.addColorStop(0,`rgba(230,225,215,${a})`);gr.addColorStop(1,'rgba(230,225,215,0)');g.fillStyle=gr;g.beginPath();g.arc(c0[0],c0[1],R0*k*1.12,0,7);g.fill()}g.globalCompositeOperation='source-over';
  const gr=g.createRadialGradient(c0[0]-R0*.3,c0[1]-R0*.35,R0*.05,c0[0],c0[1],R0);gr.addColorStop(0,'#1a1d23');gr.addColorStop(0.75,'#0e1014');gr.addColorStop(1,'#08090b');g.fillStyle=gr;g.beginPath();g.arc(c0[0],c0[1],R0,0,7);g.fill();
  for(const [la,lo] of D.land){const v=ll(la,lo,1.001);const fd=dot(v,cdir);if(fd<0.02)continue;const p=proj(v);const s=Math.max(1.5,R0/170)*fd;g.fillStyle=`rgba(150,156,166,${0.5*fd})`;g.fillRect(p[0]-s/2,p[1]-s/2,s,s)}
  g.globalCompositeOperation='lighter';const G=D.global;for(let i=0;i<G.length;i+=o.step||3){const v=ll(G[i][0],G[i][1],1.002);const fd=dot(v,cdir);if(fd<0.03)continue;const p=proj(v);const s=(1+R0/500)*fd;g.fillStyle=rgba(i%5?C_OR2:C_OR,0.45*fd);g.fillRect(p[0]-s/2,p[1]-s/2,s,s)}
  g.globalCompositeOperation='source-over';return {cdir,c0,R0}}
function dirA(p){if(p===0){street(2);slicesFrom(2,160,26);const [cx,cz]=ST.cam,d=ST.dir,sd=[-d[2],0,d[0]];const r=rng(12);
    for(let i=0;i<22;i++){const f=-1+r()*30,l=(r()-0.5)*14,y=2.5+r()*16;slice([cx+d[0]*f+sd[0]*l,y,cz+d[2]*f+sd[2]*l],0.8+y*0.12,Math.atan2(sd[2],sd[0])+(r()-0.5)*0.8,0.5+0.5*r())}vignette();return}
  const E=earthNight(112,24,3.0);const r=rng(4);g.globalCompositeOperation='lighter';
  // slices rising off the planet's lit cities, collecting into a luminous shell
  const G=D.global;for(let i=0;i<900;i++){const j=Math.floor(r()*G.length);const u=r();const v=ll(G[j][0],G[j][1],1.01+u*0.3);const fd=dot(norm(v),E.cdir);if(fd<0.05)continue;const q=proj(v);if(!q)continue;const s=(5+u*12)*fd;g.strokeStyle=rgba(C_OR2,0.7*Math.sin(u*Math.PI)*fd);g.lineWidth=1;g.strokeRect(q[0]-s*0.8,q[1]-s/2,s*1.6,s);g.fillStyle=rgba(C_OR,0.12*fd);g.fillRect(q[0]-s*0.8,q[1]-s/2,s*1.6,s)}
  const gr=g.createRadialGradient(E.c0[0],E.c0[1],E.R0*1.12,E.c0[0],E.c0[1],E.R0*1.32);gr.addColorStop(0,'rgba(255,190,90,0)');gr.addColorStop(0.5,'rgba(255,190,90,0.10)');gr.addColorStop(1,'rgba(255,190,90,0)');g.fillStyle=gr;g.fillRect(0,0,W,H);
  g.globalCompositeOperation='source-over';vignette()}
// ---- B: the model city hangs above as reality's mirror and fills in where machines act ----
function dirB(p){if(p===0){bg2();const cp=streetCam(2,10,0);setCam(cp,[cp[0]+ST.dir[0]*80,22,cp[2]+ST.dir[2]*80],62);
    // mirror plane at y=60: model city upside down, made of warm glass, brighter near agents
    const Y=70;const t=2;const lit=ST.A.map(A=>agentAt(A,t));
    for(const b of SB){if(Math.hypot(b.x-M.p[0],b.z-M.p[2])>700)continue;const near=lit.some(([x,z])=>Math.hypot(x-b.x,z-b.z)<45);const P=b.pts;const hh=Math.min(b.h,40);
      const base=P.map(([x,z])=>[x,Y,z]),bot=P.map(([x,z])=>[x,Y-hh,z]);const a=near?0.55:0.10;face(bot,null,near?C_OR2:[170,175,185],{e:1,a:a*0.6});for(let i=0;i<P.length;i++){const j=(i+1)%P.length;face([base[i],base[j],bot[j],bot[i]],null,near?C_OR:[150,156,168],{e:1,a:a*0.35})}}
    flush();ground();queueBlds();const fx=drawAgents(t,500,heroes(t));flush();runFX(fx);
    // rising threads of light from agents to their mirror
    g.globalCompositeOperation='lighter';for(const [x,z] of lit){for(let k=0;k<6;k++){const u=((t*0.4+k/6+x*0.01)%1);const q=proj([x,2+u*(Y-2),z]);if(!q)continue;glowDot(q,clamp(300/q[2],3,30),C_OR2,0.5*Math.sin(u*Math.PI))}}g.globalCompositeOperation='source-over';vignette();return}
  const E=earthNight(116,30,3.4,{step:4});g.globalCompositeOperation='lighter';// model-earth shell: a second, warm, translucent earth around the real one, filling in
  for(const [la,lo] of D.land){const v=ll(la,lo,1.18);const fd=dot(norm(v),E.cdir);if(fd<0.05)continue;const q=proj(v);if(!q)continue;const fill=0.5+0.5*Math.sin(lo*0.08+la*0.05);g.fillStyle=rgba(fill>0.5?C_OR2:[200,205,215],0.5*fd*fill);g.fillRect(q[0]-2,q[1]-2,4,4)}
  g.globalCompositeOperation='source-over';vignette()}
// ---- C: wherever machines go, the city becomes "known" — light spreads like a tide ----
function dirC(p){const t=2;if(p===0){if(!ST.fr){frontage();ST.fr=1}const pos=[];for(const A of ST.A)for(let k=0;k<30;k+=3)pos.push(walkerXZ(A.w,t-k*0.4,A.sp,A.ph));const [cx,cz]=ST.cam;pos.push([cx,cz]);
    for(const b of SB){const dm=Math.min(...pos.map(([x,z])=>Math.hypot(x-b.x,z-b.z)));b.lit0=b.lit0??b.lit;b.lit=dm<30?0.9:dm<60?0.35:0.02}
    street(t,{bld:{wc:[255,196,120]},back:4,up:3});for(const b of SB)b.lit=b.lit0;
    // warm trails on the ground behind machines
    g.globalCompositeOperation='lighter';for(const A of ST.A){if(A.k==='drone')continue;for(let k=1;k<40;k++){const [x,z]=walkerXZ(A.w,t-k*0.4,A.sp,A.ph);if(Math.hypot(x-M.p[0],z-M.p[2])>400)continue;camPool(x,z,3+k*0.1,C_OR,0.09*(1-k/40))}}g.globalCompositeOperation='source-over';vignette();return}
  // aerial over the whole block: the known region spreads from the machines' paths
  bg2();FOGD=6000;setCam([0,1500,-2500],[0,0,-300],42);ground();const front=900;
  for(const b of SB){}
  const save=SB;buildSB(0,0,6);const r=rng(3);
  for(const b of SB){const d=Math.hypot(b.x-200,b.z+800);const known=d<front+Math.sin(b.x*0.01)*120;b.known=known}
  queueBlds({maxD:6000,winD:0});flush();
  g.globalCompositeOperation='lighter';for(const b of SB){if(!b.known)continue;const q=proj([b.x,b.h,b.z]);if(!q)continue;const s=clamp(14000/q[2],1.5,8)*(b.h>12?1.6:1);g.fillStyle=rgba(r()<0.3?C_OR:C_OR2,0.35);g.fillRect(q[0]-s/2,q[1]-s/2,s,s)}
  const q=proj([200,0,-800]);if(q)glowDot(q,700,C_OR,0.12);g.globalCompositeOperation='source-over';SB=save;FOGD=900;vignette()}
