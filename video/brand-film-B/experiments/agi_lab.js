// ===== 结尾实验室：实体光照的街区 + 机器人/无人机/车（单位：米） =====
const MS=400; // block unit → metres
const LGT=norm([-0.45,0.75,0.5]);const BGC=[11,13,18];let FOGD=900;
let FQ=[];
function face(P3,n,col,o={}){FQ.push({P3,n,col,e:o.e||0,a:o.a??1,win:o.win})}
function flush(){const L=[];for(const f of FQ){let c=[0,0,0];for(const v of f.P3){c[0]+=v[0];c[1]+=v[1];c[2]+=v[2]}c=c.map(v=>v/f.P3.length);
    if(f.n&&dot(f.n,sub(M.p,c))<0)continue;const P=f.P3.map(proj);if(P.some(p=>!p))continue;L.push([Math.hypot(...sub(c,M.p)),f,P])}
  L.sort((a,b)=>b[0]-a[0]);
  for(const [d,f,P] of L){let col=f.col;const fg=clamp(d/FOGD)*0.8;
    if(f.e){g.globalCompositeOperation='lighter';g.fillStyle=rgba(col,f.a*(1-fg));fillP(P);g.globalCompositeOperation='source-over';continue}
    const l=Math.max(0,dot(f.n,LGT)),rim=Math.max(0,dot(f.n,norm([0.6,0.2,-0.7])));col=col.map((v,i)=>v*(0.32+0.68*l)+[255,150,60][i]*0.10*rim);
    col=col.map((v,i)=>lerp(v,BGC[i],fg));g.fillStyle=rgba(col,f.a);fillP(P);
    if(f.win&&d<f.win.maxD)drawWin(f,P,fg)}
  FQ=[]}
function fillP(P){g.beginPath();P.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill()}
// windows on a wall quad P=[b0,b1,t1,t0]
function drawWin(f,P,fg){const {nf,nc,seed,lit,wc}=f.win;const [b0,b1,t1,t0]=P;const r=rng(seed);g.fillStyle=rgba(wc||[230,160,80],(1-fg)*0.6);
  const L=(a,b,k)=>[lerp(a[0],b[0],k),lerp(a[1],b[1],k)];
  for(let i=0;i<nf;i++){const y0=(i+0.4)/nf,y1=(i+0.68)/nf;const l0=L(b0,t0,y0),l1=L(b0,t0,y1),r0=L(b1,t1,y0),r1=L(b1,t1,y1);
    for(let j=0;j<nc;j++){if(r()>lit)continue;const x0=(j+0.3)/nc,x1=(j+0.62)/nc;const q=[L(l0,r0,x0),L(l0,r0,x1),L(l1,r1,x1),L(l1,r1,x0)];fillP(q)}}}
function boxM(c,s,yaw,col,o={}){const cs=Math.cos(yaw),sn=Math.sin(yaw);const [hx,hy,hz]=[s[0]/2,s[1]/2,s[2]/2];
  const V=(u,v,w)=>[c[0]+u*cs-w*sn,c[1]+v,c[2]+u*sn+w*cs];const N=(u,v,w)=>[u*cs-w*sn,v,u*sn+w*cs];
  const p=[V(-hx,-hy,-hz),V(hx,-hy,-hz),V(hx,-hy,hz),V(-hx,-hy,hz),V(-hx,hy,-hz),V(hx,hy,-hz),V(hx,hy,hz),V(-hx,hy,hz)];
  const F=[[[4,5,6,7],N(0,1,0)],[[0,3,2,1],N(0,-1,0)],[[1,2,6,5],N(1,0,0)],[[0,4,7,3],N(-1,0,0)],[[2,3,7,6],N(0,0,1)],[[0,1,5,4],N(0,0,-1)]];
  for(const [ix,n] of F){if(o.noBottom&&n[1]<-0.5)continue;face(ix.map(i=>p[i]),n,o.ecol&&o.eside&&o.eside(n)?o.ecol:col,{e:o.e||(o.eside&&o.eside(n)?1:0)})}}
// ---- buildings (real Dongcheng footprints) ----
let SB=null;
function buildSB(cx,cz,R){const r=rng(11);SB=[];for(const [x,z,h0,rr] of BLK.b){if(Math.hypot(x-cx,z-cz)>R)continue;let hm=h0*160;if(hm<4)hm=4+r()*4;
  const pts=[];for(let i=0;i<rr.length;i+=2)pts.push([rr[i]*MS,rr[i+1]*MS]);SB.push({x:x*MS,z:z*MS,h:hm,pts,seed:(r()*1e6)|0,lit:0.12+r()*0.35})}}
function queueBlds(o={}){const C=o.col||[34,38,45];for(const b of SB){if(Math.hypot(b.x-M.p[0],b.z-M.p[2])>(o.maxD||1400))continue;const n=b.pts.length;const tall=b.h>12;
  // ensure CCW
  let ar=0;for(let i=0;i<n;i++){const a=b.pts[i],c=b.pts[(i+1)%n];ar+=a[0]*c[1]-c[0]*a[1]}const P=ar>0?b.pts:b.pts.slice().reverse();
  const top=P.map(([x,z])=>[x,b.h,z]);face(top,[0,1,0],tall?C.map(v=>v*1.1):[46,41,38],{});
  for(let i=0;i<n;i++){const a=P[i],c=P[(i+1)%n];const ex=c[0]-a[0],ez=c[1]-a[1];const L=Math.hypot(ex,ez);if(L<0.5)continue;const nn=[ez/L,0,-ex/L];
    const wl={nf:Math.max(1,Math.floor(b.h/3.6)),nc:Math.max(1,Math.floor(L/3.2)),seed:b.seed+i,lit:b.lit*(o.litK??1),maxD:o.winD||500,wc:o.wc};
    face([[a[0],0,a[1]],[c[0],0,c[1]],[c[0],b.h,c[1]],[a[0],b.h,a[1]]],nn,C,{win:tall||b.h>6?wl:null})}}}
// ---- agents ----
const GREY=[84,88,96],DARK=[30,33,40],WHITE=[118,122,130];
function car(x,z,yaw,o={}){const y=0;boxM([x,0.7,z],[4.6,0.8,1.9],yaw,o.col||[88,94,104]);boxM([x-0.2*Math.cos(yaw),1.35,z-0.2*Math.sin(yaw)],[2.6,0.55,1.7],yaw,[28,32,40]);
  for(const [u,w] of [[1.5,0.95],[1.5,-0.95],[-1.5,0.95],[-1.5,-0.95]])boxM([x+u*Math.cos(yaw)-w*Math.sin(yaw),0.35,z+u*Math.sin(yaw)+w*Math.cos(yaw)],[0.7,0.7,0.25],yaw,[14,15,18]);
  boxM([x+2.31*Math.cos(yaw),0.85,z+2.31*Math.sin(yaw)],[0.05,0.12,1.7],yaw,[255,236,200],{e:1});boxM([x-2.31*Math.cos(yaw),0.85,z-2.31*Math.sin(yaw)],[0.05,0.12,1.7],yaw,C_OR,{e:1});
  boxM([x,1.75,z],[0.5,0.25,0.5],yaw,C_OR2,{e:1})}
function carFX(x,z,yaw,a=1){camPool(x+6*Math.cos(yaw),z+6*Math.sin(yaw),8,[255,236,200],0.10*a);camPool(x,z,10,C_OR,0.07*a);const p=proj([x+2.4*Math.cos(yaw),0.85,z+2.4*Math.sin(yaw)]);if(p){const r=clamp(900/p[2],10,160);glowDot(p,r,[255,236,210],0.3*a)}const q=proj([x,1.8,z]);if(q)glowDot(q,clamp(500/q[2],6,90),C_OR,0.6*a)}
function humanoid(x,z,yaw,t,k=1){const st=Math.sin(t*5.2)*k;const P=(u,v,w)=>[x+u*Math.cos(yaw)-w*Math.sin(yaw),v,z+u*Math.sin(yaw)+w*Math.cos(yaw)];
  boxM(P(0.18*st,0.42,-0.13),[0.17,0.84,0.17],yaw,GREY);boxM(P(-0.18*st,0.42,0.13),[0.17,0.84,0.17],yaw,GREY);
  boxM(P(0,1.15,0),[0.3,0.62,0.48],yaw,WHITE);boxM(P(-0.16*st,1.1,-0.32),[0.13,0.62,0.13],yaw,GREY);boxM(P(0.16*st,1.1,0.32),[0.13,0.62,0.13],yaw,GREY);
  boxM(P(0,1.62,0),[0.26,0.28,0.24],yaw,WHITE,{eside:n=>dot(n,[Math.cos(yaw),0,Math.sin(yaw)])>0.7,ecol:C_OR});boxM(P(0.16,1.2,0),[0.02,0.12,0.2],yaw,C_OR2,{e:1})}
function botFX(x,z,a=1){camPool(x,z,3.5,C_OR,0.10*a);const p=proj([x,1.62,z]);if(p)glowDot(p,clamp(260/p[2],4,70),C_OR,0.55*a)}
function dog(x,z,yaw,t){const st=Math.sin(t*8);const P=(u,v,w)=>[x+u*Math.cos(yaw)-w*Math.sin(yaw),v,z+u*Math.sin(yaw)+w*Math.cos(yaw)];
  for(const [u,w,s] of [[0.32,0.14,1],[0.32,-0.14,-1],[-0.32,0.14,-1],[-0.32,-0.14,1]])boxM(P(u+0.06*st*s,0.2,w),[0.08,0.4,0.08],yaw,GREY);
  boxM(P(0,0.45,0),[0.8,0.18,0.32],yaw,WHITE);boxM(P(0.46,0.5,0),[0.16,0.14,0.2],yaw,WHITE,{eside:n=>dot(n,[Math.cos(yaw),0,Math.sin(yaw)])>0.7,ecol:C_OR})}
function drone(x,y,z,yaw,t){const arm=0.55;boxM([x,y,z],[0.5,0.16,0.5],yaw,WHITE);for(let i=0;i<4;i++){const an=yaw+Math.PI/4+i*Math.PI/2;const ex=x+Math.cos(an)*arm,ez=z+Math.sin(an)*arm;
    boxM([(x+ex)/2,y+0.02,(z+ez)/2],[arm,0.05,0.06],an,GREY);const R=[];for(let k=0;k<10;k++){const a2=k/10*6.283;R.push([ex+Math.cos(a2)*0.32,y+0.1,ez+Math.sin(a2)*0.32])}face(R,null,[200,206,214],{e:1,a:0.16})}
  boxM([x,y-0.1,z],[0.16,0.06,0.16],yaw,C_OR2,{e:1})}
function droneFX(x,y,z,a=1){const p=proj([x,y-0.1,z]);if(p)glowDot(p,clamp(500/p[2],5,80),C_OR,0.55*a);camPool(x,z,y*0.45,C_OR,0.05*a)}
