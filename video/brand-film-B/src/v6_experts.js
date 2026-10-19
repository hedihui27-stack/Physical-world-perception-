// ===== 第六版 · 一基多专：四股海量数据 → 源头专家 → SeeMind → 多组结论 =====
const XC=[0,2.2,0];
// four inputs, same cold white; told apart only by how they move
const XIN=[{e:[-4.2,4.6,-1.2],kind:'sky'},{e:[-4.6,2.9,1.4],kind:'grid'},{e:[-4.4,1.0,-0.6],kind:'ground'},{e:[-3.8,-0.6,1.0],kind:'swirl'}];
const XOUT=[[6.6,4.4,-1.6],[7.4,2.9,0.9],[6.9,1.3,-0.8],[7.8,0.0,1.4],[6.2,-0.9,-0.2]];
const XP=(()=>{const r=rng(55);const P=[];for(let s=0;s<4;s++)for(let i=0;i<5200;i++)P.push({s,a:r(),b:r(),c:r(),ph:r()});return P})();
const SHL=(()=>{const P=[];const n=1800;const ga=Math.PI*(3-Math.sqrt(5));for(let i=0;i<n;i++){const y=1-2*(i+.5)/n,rr=Math.sqrt(1-y*y),a=i*ga;P.push([Math.cos(a)*rr,y,Math.sin(a)*rr])}return P})();
function xSrc(k,a,b,c,T){ // raw source position for a particle of input k
  if(k==='sky')return[-12+a*7,5.5+b*4,-4+c*7];
  if(k==='ground')return[-12+a*7,-3.2+b*0.5,-4+c*8];
  if(k==='grid')return[-13+Math.floor(a*8)*0.8,0.6+Math.floor(b*8)*0.5,-2+Math.floor(c*6)*0.6];
  const ang=a*6.283+T*0.9;return[-11+Math.cos(ang)*2.4*(0.4+b),-0.6+Math.sin(ang)*1.6*(0.4+b),1+(c-.5)*4]}
function octa(cx,s,rot,col,a,stretch=1.6){const V=[[1,0,0],[-1,0,0],[0,stretch,0],[0,-stretch,0],[0,0,1],[0,0,-1]].map(([x,y,z])=>{const X=x*Math.cos(rot)-z*Math.sin(rot),Z=x*Math.sin(rot)+z*Math.cos(rot);return[cx[0]+X*s,cx[1]+y*s,cx[2]+Z*s]});
  const F=[[2,0,4],[2,4,1],[2,1,5],[2,5,0],[3,4,0],[3,1,4],[3,5,1],[3,0,5]];const key=norm([0.4,0.8,0.6]);
  const L=F.map(f=>{const c=[0,1,2].map(i=>(V[f[0]][i]+V[f[1]][i]+V[f[2]][i])/3);const n=norm(cross(sub(V[f[1]],V[f[0]]),sub(V[f[2]],V[f[0]])));return[Math.hypot(...sub(c,M.p)),f,n]}).sort((x,y)=>y[0]-x[0]);
  for(const [d,f,n] of L){const P=f.map(i=>proj(V[i]));if(P.some(x=>!x))continue;const lit=0.35+0.65*Math.abs(dot(n,key));g.fillStyle=rgba(col.map(v=>Math.min(255,v*(0.55+0.6*lit))),0.55*a);g.beginPath();P.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill();g.strokeStyle=rgba([255,236,200],0.6*a);g.lineWidth=0.8;g.stroke()}}
shotExperts=function(t){bg();const lt=LT(t);const k=ease(clamp(lt/12.7));
  setCam([lerp(-5.0,2.2,k),lerp(2.8,2.4,k),lerp(9.8,9.6,k)],[lerp(-3.6,1.6,k),1.9,0],56);
  const a0=clamp(lt/1.0),ea=clamp((lt-1.0)/1.2),ca=clamp((lt-2.0)/1.4),oa=clamp((lt-4.2)/1.4);
  g.globalCompositeOperation='lighter';
  // 1) raw torrents → the expert at each source
  for(const p of XP){const I=XIN[p.s];const u=((t*0.16+p.ph)%1);const src=xSrc(I.kind,p.a,p.b,p.c,t);const e=ease(u);
    const rad=(1-e*0.8)*0.9;let v=[0,1,2].map(i=>lerp(src[i],I.e[i],e)+(i===0?0:(i===1?(p.b-.5):(p.c-.5))*rad*(1-e)*2.2));if(I.kind==='sky')v[1]+=Math.sin(u*Math.PI)*0.8;if(I.kind==='swirl'){const w=(1-u)*1.2;v[1]+=Math.sin(u*9+p.a*6)*w;v[2]+=Math.cos(u*7+p.b*6)*w}
    const q=proj(v);if(!q)continue;const al=a0*(0.25+0.6*u)*(1-Math.max(0,u-0.92)/0.08);g.fillStyle=`rgba(226,230,236,${Math.min(1,al*1.1)})`;const s=clamp(14/q[2],1.3,3.4);g.fillRect(q[0]-s/2,q[1]-s/2,s,s)}
  // 2) experts: small dense prisms right at the source — raw noise in, ordered beads out
  XIN.forEach((I,i)=>{const pa=ea*clamp(lt*1.2-i*0.25-1.0);if(pa<=0)return;const pe=proj(I.e);if(!pe)return;
    const gg=g.createRadialGradient(pe[0],pe[1],0,pe[0],pe[1],70);gg.addColorStop(0,`rgba(240,240,236,${0.55*pa})`);gg.addColorStop(1,'rgba(240,240,236,0)');g.fillStyle=gg;g.beginPath();g.arc(pe[0],pe[1],70,0,7);g.fill();
    g.globalCompositeOperation='source-over';octa(I.e,0.32,t*0.8+i,[215,222,232],pa,1.3);g.globalCompositeOperation='lighter';
    // ordered beads: few, bright, evenly spaced, into the core
    for(let b=0;b<14;b++){const u=((t*0.32+b/14)%1);const v=[0,1,2].map(j=>lerp(I.e[j],XC[j],ease(u)));const q=proj(v);if(!q)continue;const s=clamp(70/q[2],3,9);g.fillStyle=`rgba(245,242,235,${0.95*pa*ca})`;g.beginPath();g.arc(q[0],q[1],s/2,0,7);g.fill()}});
  // 3) SeeMind: layered shells, warm heart
  if(ca>0){const pc=proj(XC);[[1.5,0.25,0.55],[1.15,-0.4,0.7],[0.8,0.6,0.9]].forEach(([Rr,sp,al],li)=>{const rot=t*sp;for(let i=li;i<SHL.length;i+=1+li){const q0=SHL[i];const x=q0[0]*Math.cos(rot)-q0[2]*Math.sin(rot),z=q0[0]*Math.sin(rot)+q0[2]*Math.cos(rot);const v=[XC[0]+x*Rr,XC[1]+q0[1]*Rr,XC[2]+z*Rr];const q=proj(v);if(!q)continue;const front=(z+1)/2;g.fillStyle=li===2?rgba(C_OR2,al*ca*(0.3+0.7*front)):`rgba(232,234,238,${al*ca*(0.2+0.6*front)})`;const s=li===2?2.2:1.6;g.fillRect(q[0]-s/2,q[1]-s/2,s,s)}});
    if(pc){const pulse=0.85+0.15*Math.sin(t*3);for(const [r0,a1,col] of [[320,0.18,C_OR],[150,0.5,C_OR],[60,0.9,C_OR2]]){const gg=g.createRadialGradient(pc[0],pc[1],0,pc[0],pc[1],r0*pulse);gg.addColorStop(0,rgba(col,a1*ca));gg.addColorStop(1,rgba(col,0));g.fillStyle=gg;g.beginPath();g.arc(pc[0],pc[1],r0*pulse,0,7);g.fill()}
      g.globalCompositeOperation='source-over';text('SeeMind',pc[0],pc[1]+190,30,`rgba(244,242,236,${ca*0.9})`,'center',700,4);g.globalCompositeOperation='lighter'}}
  // 4) many conclusions: streams out to the right, crystallising
  if(oa>0){XOUT.forEach((o,i)=>{const pa=oa*clamp((lt-4.2)*0.9-i*0.25);if(pa<=0)return;
      for(let b=0;b<520;b++){const u=((t*0.22+b/520+i*0.13)%1);const sp=(1-u)*0.35;const v=[0,1,2].map(j=>lerp(XC[j],o[j],ease(u))+(j?Math.sin(b*7.1+j)*sp*0.5:0));const q=proj(v);if(!q)continue;const w=u;const col=[lerp(235,C_OR[0],w),lerp(235,C_OR[1],w),lerp(232,C_OR[2],w)];g.fillStyle=rgba(col,0.75*pa*Math.sin(Math.PI*Math.min(1,u*1.1)));const s=clamp(8/q[2],1.2,3);g.fillRect(q[0]-s/2,q[1]-s/2,s,s)}
      const pe=proj(o);if(pe){const gg=g.createRadialGradient(pe[0],pe[1],0,pe[0],pe[1],70);gg.addColorStop(0,rgba(C_OR,0.35*pa));gg.addColorStop(1,rgba(C_OR,0));g.fillStyle=gg;g.beginPath();g.arc(pe[0],pe[1],70,0,7);g.fill()}
      g.globalCompositeOperation='source-over';const r=rng(90+i);const grow=ease(clamp((lt-5.0-i*0.35)/1.6));for(let c=0;c<4;c++){const off=[(r()-.5)*0.7,(r()-.5)*0.7,(r()-.5)*0.7];octa(o.map((x,j)=>x+off[j]*grow),(0.12+0.16*r())*grow,t*0.6+c*1.7+i,C_OR,pa,1.5)}g.globalCompositeOperation='lighter'})}
  g.globalCompositeOperation='source-over';vignette()};
