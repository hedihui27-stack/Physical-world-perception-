// ===== 第七版 · 结尾：机器不画本体，只画它们的感知——走过的地方，城市以点云出现；点云再升起汇入 SeeMind 矩阵 =====
let PC7=null;
function buildPC7(){const r=rng(71);const pts=[];const HS=2.2;
  for(const [cx,cz,h0,rr] of BLK.b){const h=Math.max(h0,0.02)*HS;const n=rr.length/2;
    for(let i=0;i<n;i++){const ax=rr[2*i],az=rr[2*i+1],bx=rr[(2*i+2)%rr.length],bz=rr[(2*i+3)%rr.length];const L=Math.hypot(bx-ax,bz-az);const nh=Math.max(1,Math.round(L/0.028)),nv=Math.max(1,Math.round(h/0.03));
      for(let a=0;a<nh;a++)for(let b=0;b<=nv;b++){if(r()>0.8)continue;const u=(a+r())/nh;pts.push(lerp(ax,bx,u),h*b/nv,lerp(az,bz,u))}}
    // roof
    let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9;for(let i=0;i<n;i++){x0=Math.min(x0,rr[2*i]);x1=Math.max(x1,rr[2*i]);z0=Math.min(z0,rr[2*i+1]);z1=Math.max(z1,rr[2*i+1])}
    for(let x=x0;x<x1;x+=0.035)for(let z=z0;z<z1;z+=0.035){let c=false;for(let i=0,j=n-1;i<n;j=i++){const xi=rr[2*i],zi=rr[2*i+1],xj=rr[2*j],zj=rr[2*j+1];if(((zi>z)!==(zj>z))&&(x<(xj-xi)*(z-zi)/(zj-zi)+xi))c=!c}if(c)pts.push(x+(r()-.5)*0.02,h,z+(r()-.5)*0.02)}}
  // ground scan points along streets
  for(const w of BLK.w)for(let i=0;i<w.length;i+=2)if(r()<0.35)pts.push(w[i]+(r()-.5)*0.08,0,w[i+1]+(r()-.5)*0.08);
  const P=new Float32Array(pts);const N=P.length/3;
  // agents: ground machines on real streets + drones on loops
  const A=[];for(let i=0;i<190;i++){const kd=i%5===4?'drone':'ground';A.push({kd,w:BLK.w[Math.floor(r()*BLK.w.length)],sp:(0.02+r()*0.03),ph:r()*2,h:0.5+r()*0.6,a:r()*6.28,R:0.3+r()*0.6})}
  // reveal time per point via a coarse grid swept by every machine's sensing radius
  const G=0.06,GX=Math.ceil(9/G),GZ=Math.ceil(7.6/G);const cell=new Float32Array(GX*GZ).fill(99);const T0=143.8;
  for(let s=0;s<=70;s++){const t=T0+s*0.1;for(const a of A){const [x,z]=agentXZ7(a,t);const Rr=a.kd==='drone'?0.5:0.3;const ci=Math.floor((x+4.5)/G),cj=Math.floor((z+3.8)/G),rc=Math.ceil(Rr/G);
      for(let di=-rc;di<=rc;di++)for(let dj=-rc;dj<=rc;dj++){if(di*di+dj*dj>rc*rc)continue;const ii=ci+di,jj=cj+dj;if(ii<0||jj<0||ii>=GX||jj>=GZ)continue;const k=jj*GX+ii;if(cell[k]>s*0.1)cell[k]=s*0.1}}}
  const RV=new Float32Array(N),HU=new Float32Array(N),ER=new Float32Array(N*3);for(let i=0;i<N;i++){const ii=Math.floor((P[3*i]+4.5)/G),jj=Math.floor((P[3*i+2]+3.8)/G);RV[i]=(ii<0||jj<0||ii>=GX||jj>=GZ)?99:cell[jj*GX+ii]+r()*0.25;HU[i]=r();const big=r()<0.12?3:1;ER[3*i]=(r()-.5)*0.05*big;ER[3*i+1]=(r()-.5)*0.04*big*(P[3*i+1]>0?1:0);ER[3*i+2]=(r()-.5)*0.05*big}
  PC7={P,N,RV,HU,ER,A}}
function agentXZ7(a,t){if(a.kd==='drone'){const [x,z]=walkerXZ(a.w,t,a.sp*0.5,a.ph);return[x+Math.cos(t*0.6+a.a)*a.R,z+Math.sin(t*0.6+a.a)*a.R]}return walkerXZ(a.w,t,a.sp,a.ph)}
shotAGI=function(t){bg();if(!PC7)buildPC7();const lt=LT(t);const {P,N,RV,HU,ER,A}=PC7;
  const k=ease(clamp(lt/7.0)),up=ease(clamp((lt-2.4)/3.6));
  setCam([lerp(-2.4,0.4,k),lerp(1.2,2.9,k),lerp(4.2,5.2,k)],[lerp(0.6,0.2,k),lerp(0.0,-0.3,k),lerp(-0.8,-1.2,k)],52);
  const MC=[0.3,2.3,-2.6];
  g.globalCompositeOperation='lighter';
  for(let i=0;i<N;i++){const age=lt-RV[i];const x0=P[3*i],y0=P[3*i+1],z0=P[3*i+2];const ex=ER[3*i],ey=ER[3*i+1],ez=ER[3*i+2];const err=Math.hypot(ex,ey,ez);
    // before the scan: the model's predicted point (faint, slightly off); on the scan: snapped to reality, flashing by the size of the error
    const fix=ease(clamp(age/0.6));const x=x0+ex*(1-fix),y=y0+ey*(1-fix),z=z0+ez*(1-fix);const q=proj([x,y,z]);if(!q)continue;
    const hu=HU[i];const base=hu<0.45?[120,150,180]:hu<0.7?[110,160,160]:hu<0.88?[150,165,140]:[175,160,150];const gnd=y0===0;
    let c,al;if(age<0){c=[90,110,135];al=0.16*(gnd?0.6:1)}else{const fl=clamp(1-age/0.9)*clamp(err/0.04);c=base.map((v,j)=>lerp(v,C_OR2[j],fl));al=(0.5+0.45*fl)*(gnd?0.6:1)}
    g.fillStyle=rgba(c,al);const s=clamp(7/q[2],1.0,2.6);g.fillRect(q[0]-s/2,q[1]-s/2,s,s)}
  // the machines themselves: only a bright point, a hairline trail and the edge of what they sense
  for(const a of A){const [x,z]=agentXZ7(a,t);const y=a.kd==='drone'?a.h:0.006;const p=proj([x,y,z]);if(!p)continue;
    g.strokeStyle=rgba(a.kd==='drone'?[200,215,230]:C_OR,0.55);g.lineWidth=0.6;g.beginPath();for(let s=0;s<14;s++){const [x2,z2]=agentXZ7(a,t-s*0.06);const q=proj([x2,y,z2]);if(!q)continue;s?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1])}g.stroke();
    g.fillStyle=rgba(a.kd==='drone'?[230,236,244]:C_OR2,0.95);g.fillRect(p[0]-1.6,p[1]-1.6,3.2,3.2);
    const Rr=a.kd==='drone'?0.42:0.24;const ph=((t*0.9+a.ph)%1);g.strokeStyle=rgba(a.kd==='drone'?[170,200,220]:C_OR,0.35*(1-ph));g.beginPath();for(let s=0;s<=24;s++){const an=s/24*6.283;const q=proj([x+Math.cos(an)*Rr*ph,0.004,z+Math.sin(an)*Rr*ph]);if(!q)continue;s?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1])}g.stroke();
    if(a.kd==='drone'){const q=proj([x,0.004,z]);if(q){g.strokeStyle='rgba(170,200,220,0.12)';g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(q[0],q[1]);g.stroke()}}}
  g.globalCompositeOperation='source-over';
  vignette()};
