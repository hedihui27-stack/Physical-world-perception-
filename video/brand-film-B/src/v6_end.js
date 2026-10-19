// ===== 第六版 · 结尾：机器人、无人机、自动驾驶在真实街区里行动 → 拉远到整个地球在“呼吸” → 光收拢成 logo 的橙色小球 =====
let STR=null;const SCL=5;
function buildStreet(){const tall=BLK.b.filter(b=>b[2]>0.12);let cx=0,cz=0;tall.forEach(b=>{cx+=b[0];cz+=b[1]});cx/=tall.length;cz/=tall.length;
  const B=BLK.b.filter(b=>Math.hypot(b[0]-cx,b[1]-cz)<1.5).map(([x,z,h,r])=>[(x-cx)*SCL,(z-cz)*SCL,h,r.map((v,i)=>(v-(i%2?cz:cx))*SCL)]);
  const Wk=BLK.w.map(w=>{const o=[];for(let i=0;i<w.length;i+=2)o.push((w[i]-cx)*SCL,(w[i+1]-cz)*SCL);return o}).filter(w=>Math.hypot(w[0],w[1])<6.5);
  const r=rng(23);const A=[];for(let i=0;i<150;i++){const k=i%10<5?'car':i%10<8?'bot':'drone';A.push({k,w:Wk[Math.floor(r()*Wk.length)],sp:(k==='car'?0.05:k==='bot'?0.018:0.03)*(0.7+0.6*r()),ph:r()*2,h:0.28+r()*0.32,a:r()*6.283,rx:1+r()*4,rz:1+r()*4})}
  STR={B,A}}
function wire(V,E,col,a,lw=1.1){g.strokeStyle=rgba(col,a);g.lineWidth=lw;g.beginPath();for(const [i,j] of E){const p=V[i],q=V[j];if(!p||!q)continue;g.moveTo(p[0],p[1]);g.lineTo(q[0],q[1])}g.stroke()}
const BOXE=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
function box3(c,L,Wd,Hh,yaw,y0){const cs=Math.cos(yaw),sn=Math.sin(yaw);const P=[];for(const yy of [y0,y0+Hh])for(const [u,v] of [[-L,-Wd],[L,-Wd],[L,Wd],[-L,Wd]])P.push(proj([c[0]+u*cs-v*sn,yy,c[1]+u*sn+v*cs]));return P}
function glowDot(p,r,col,a){if(!p)return;const gg=g.createRadialGradient(p[0],p[1],0,p[0],p[1],r);gg.addColorStop(0,rgba(col,a));gg.addColorStop(1,rgba(col,0));g.fillStyle=gg;g.beginPath();g.arc(p[0],p[1],r,0,7);g.fill()}
function drawAgent(A,t,a){const sv=M;const W2=A.w;const [x,z]=walkerXZ(W2,t,A.sp,A.ph);const AS=2.2;
  // draw the agent in a local frame scaled up around its position
  M={...sv,p:[x+(sv.p[0]-x)/AS,(sv.p[1])/AS,z+(sv.p[2]-z)/AS]};const F0=F;drawAgent0(A,t,a);M=sv}
function drawAgent0(A,t,a){const W2=A.w;const [x,z]=walkerXZ(W2,t,A.sp,A.ph);const [x2,z2]=walkerXZ(W2,t+0.05,A.sp,A.ph);const yaw=Math.atan2(z2-z,x2-x);
  if(A.k==='car'){// trail + body + cabin + headlights
    for(let k=1;k<14;k++){const [a1,b1]=walkerXZ(W2,t-k*0.09,A.sp,A.ph),[a2,b2]=walkerXZ(W2,t-(k-1)*0.09,A.sp,A.ph);const p=proj([a1,0.01,b1]),q=proj([a2,0.01,b2]);if(!p||!q)continue;g.strokeStyle=rgba(C_OR,0.7*a*(1-k/14));g.lineWidth=3*(1-k/14)+0.5;g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(q[0],q[1]);g.stroke()}
    wire(box3([x,z],0.075,0.035,0.035,yaw,0.012),BOXE,[232,236,242],0.9*a);wire(box3([x-Math.cos(yaw)*0.01,z-Math.sin(yaw)*0.01],0.04,0.03,0.025,yaw,0.047),BOXE,[232,236,242],0.7*a);
    glowDot(proj([x+Math.cos(yaw)*0.08,0.03,z+Math.sin(yaw)*0.08]),14,C_OR2,0.9*a)}
  else if(A.k==='bot'){const st=Math.sin(t*9+A.ph*5);const base=[x,0,z];const P=v=>proj([base[0]+v[0]*Math.cos(yaw)-v[2]*Math.sin(yaw),v[1],base[2]+v[0]*Math.sin(yaw)+v[2]*Math.cos(yaw)]);
    wire(box3([x,z],0.014,0.022,0.05,yaw,0.06),BOXE,[232,236,242],0.9*a);wire(box3([x,z],0.012,0.012,0.022,yaw,0.115),BOXE,[232,236,242],0.9*a);
    const hip1=P([0,0.06,-0.012]),hip2=P([0,0.06,0.012]),f1=P([0.025*st,0,-0.012]),f2=P([-0.025*st,0,0.012]),sh1=P([0,0.1,-0.03]),sh2=P([0,0.1,0.03]),h1=P([-0.02*st,0.065,-0.034]),h2=P([0.02*st,0.065,0.034]);
    g.strokeStyle=rgba([232,236,242],0.9*a);g.lineWidth=1.2;g.beginPath();for(const [p,q] of [[hip1,f1],[hip2,f2],[sh1,h1],[sh2,h2]]){if(!p||!q)continue;g.moveTo(p[0],p[1]);g.lineTo(q[0],q[1])}g.stroke();glowDot(P([0.013,0.128,0]),9,C_OR2,a)}
  else{// drone: hovering along a smooth loop above the street
    const dx=x+Math.sin(t*0.5+A.a)*0.25,dz=z+Math.cos(t*0.4+A.a)*0.25,dy=A.h+0.08*Math.sin(t*1.7+A.a);const arm=0.07;
    const c=proj([dx,dy,dz]);const ends=[0,1,2,3].map(i=>{const an=yaw+Math.PI/4+i*Math.PI/2;return[dx+Math.cos(an)*arm,dy,dz+Math.sin(an)*arm]});
    g.strokeStyle=rgba([232,236,242],0.9*a);g.lineWidth=1.2;g.beginPath();for(const e of ends){const q=proj(e);if(c&&q){g.moveTo(c[0],c[1]);g.lineTo(q[0],q[1])}}g.stroke();
    for(const e of ends){const P=[];for(let k=0;k<=10;k++){const an=k/10*6.283+t*30;P.push(proj([e[0]+Math.cos(an)*0.03,dy+0.004,e[2]+Math.sin(an)*0.03]))}g.beginPath();let on=0;for(const p of P){if(!p){on=0;continue}on?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]);on=1}g.strokeStyle=rgba([232,236,242],0.55*a);g.lineWidth=0.8;g.stroke()}
    glowDot(proj([dx,dy-0.02,dz]),12,C_OR2,0.9*a);
    // its sensing footprint on the ground
  }}
function drawStreet(t,lt,a,camK){const k=ease(clamp(lt/3.6));const up=ease(clamp((lt-3.0)/1.4));
  setCam([lerp(-3.4,0.2,k),lerp(1.9,1.4,k)+up*7,lerp(5.6,2.6,k)+up*3],[lerp(0.4,1.8,k),0.0,lerp(-1.0,-3.0,k)],50);
  g.strokeStyle='rgba(160,168,180,0.07)';g.lineWidth=1;for(let i=-8;i<=8;i++){const p=proj([i,0,-8]),q=proj([i,0,8]),r2=proj([-8,0,i]),s=proj([8,0,i]);if(p&&q){g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(q[0],q[1]);g.stroke()}if(r2&&s){g.beginPath();g.moveTo(r2[0],r2[1]);g.lineTo(s[0],s[1]);g.stroke()}}
  drawBlds(STR.B,{hs:1.5*SCL,minH:0.006,a,edgeD:6,walls:true,col:(x,z,hm)=>R.altitude(lerp(800,6500,clamp((hm-3)/120)))});
  g.globalCompositeOperation='lighter';for(const A of STR.A)drawAgent(A,t,a);
  // what they meet in reality rises as threads of light — reality training the model
  for(let i=0;i<STR.A.length;i+=2){const A=STR.A[i];const [x,z]=walkerXZ(A.w,t,A.sp,A.ph);for(let k=0;k<5;k++){const u=((t*0.5+k/5+i*0.11)%1);const p=proj([x,0.1+u*3.2,z]);if(!p)continue;g.fillStyle=`rgba(236,236,232,${0.55*a*Math.sin(u*Math.PI)})`;g.fillRect(p[0]-1,p[1]-1,2.2,2.2)}}
  g.globalCompositeOperation='source-over'}
function breathingEarth(t,lt,a){const k=ease(clamp((lt-3.6)/4.0));camGlobe(116.4-lt*1.6,30-lt*0.4,lerp(1.18,2.7,k));const cdir=norm(M.p);g.globalAlpha=a;earthRich(cdir,{land:0.55});
  const G=D.global;const src=ll(39.9,116.4);g.globalCompositeOperation='lighter';
  for(let i=0;i<G.length;i+=2){const v=ll(G[i][0],G[i][1],1.002);const fd=dot(v,cdir);if(fd<0.05)continue;const p=proj(v);if(!p)continue;const d=Math.acos(clamp(dot(v,src),-1,1));const br=0.5+0.5*Math.sin(t*2.6-d*9);const s=1.3+1.6*br*fd;
    if(i%12===0){const hd=(i*2.39)%6.283;const L=0.002+0.0025*br;const q=proj([v[0]+Math.cos(hd)*L,v[1]+Math.sin(hd)*L,v[2]-Math.cos(hd)*L]);if(q){g.strokeStyle=rgba(C_OR,0.55*fd*br*a);g.lineWidth=1.2;g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(q[0],q[1]);g.stroke()}}
    g.fillStyle=`rgba(255,${(175+60*(1-br))|0},${(70+120*(1-br))|0},${(0.18+0.5*br)*fd*a})`;g.fillRect(p[0]-s/2,p[1]-s/2,s,s)}
  g.globalCompositeOperation='source-over';g.globalAlpha=1}
shotAGI=function(t){bg();if(!STR)buildStreet();const lt=LT(t);
  const ca=1-clamp((lt-3.6)/0.9),ea=clamp((lt-3.5)/1.0);
  if(ea>0)breathingEarth(t,lt,ea);
  if(ca>0){if(ea>0){const buf=window.__AGIB||(window.__AGIB=Object.assign(document.createElement('canvas'),{width:W,height:H}));const tg=g;g=buf.getContext('2d');g.clearRect(0,0,W,H);drawStreet(t,lt,1);g=tg;g.globalAlpha=ca;g.drawImage(buf,0,0);g.globalAlpha=1}else drawStreet(t,lt,1)}
  vignette()};
// ---- end card with the official logo; the earth's light gathers into the orange ball ----
const LOGO=new Image();LOGO.src='assets/logo_seetime_white.png';
const LG={x:580,y:400,w:760};LG.h=LG.w*1334/4353;LG.bx=LG.x+2636*LG.w/4353;LG.by=LG.y+263*LG.w/4353;LG.br=63*LG.w/4353*2.0;
function endCard(T){const t0=T-151.2;if(t0<0)return;
  const a1=clamp(t0/0.7)*clamp((1.75-t0)/0.4);if(a1>0){g.globalAlpha=a1;g.fillStyle='rgba(6,7,10,0.5)';g.fillRect(0,0,W,H);text('让世界训练智能',W/2,560,80,'#f4f2ee','center',700,16);g.globalAlpha=1}
  const veil=clamp((t0-1.4)/0.8);if(veil>0){g.fillStyle=`rgba(6,7,10,${0.72*veil})`;g.fillRect(0,0,W,H)}
  // gathering light
  const gk=clamp((t0-1.3)/1.0);if(gk>0&&gk<1){g.globalCompositeOperation='lighter';const r=rng(77);for(let i=0;i<700;i++){const sx=r()*W,sy=r()*H;const d=clamp(gk*1.25-r()*0.25);const e=ease(d);const x=lerp(sx,LG.bx,e),y=lerp(sy,LG.by,e);g.fillStyle=rgba(i%3?C_OR:C_OR2,0.8*Math.sin(Math.PI*Math.min(1,d+0.05)));g.fillRect(x-1.3,y-1.3,2.6,2.6)}g.globalCompositeOperation='source-over'}
  const fl=clamp((t0-2.1)/0.25)*(1-clamp((t0-2.5)/0.9));if(fl>0){g.globalCompositeOperation='lighter';glowDot([LG.bx,LG.by],260*fl+40,C_OR,0.7*fl);g.globalCompositeOperation='source-over'}
  const a2=clamp((t0-2.2)/0.7)*clamp((6.4-t0)/0.6);if(a2>0&&LOGO.complete){g.globalAlpha=a2;g.globalCompositeOperation='lighter';glowDot([LG.bx,LG.by],90,C_OR,0.35);g.globalCompositeOperation='source-over';g.drawImage(LOGO,LG.x,LG.y,LG.w,LG.h);
    text('时印 · 洞察当下，预见未来',W/2,LG.y+LG.h+90,34,'#c9ccd2','center',400,12);text('www.seetimeai.com',W/2,LG.y+LG.h+150,24,'#8d929c','center',400,4);g.globalAlpha=1}}
