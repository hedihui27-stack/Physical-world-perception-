// ===== 第七版 · 城市视觉与母公司切割：不再是"蓝色 3D 城市放在矩形底盘上"
// 城市长在地球表面（地面随距离弯下去），身后是弧形地平线与大气光；建筑改为暖灰、砂岩、石白的低饱和色 =====
const CITY_RAMP=ramp([[0,'#2b2724'],[2500,'#463e35'],[6000,'#6a6155'],[9500,'#958b7b'],[13000,'#d8cfbe']]);
let RE_EARTH=60;
// roof colours as seen from the air: grey tile, dark grey, white/concrete flat roofs, beige, terracotta, steel blue-grey, the odd green roof
const ROOFS=[[86,88,90],[70,72,76],[150,148,142],[132,122,104],[112,92,82],[88,100,112],[84,104,88],[108,106,100]];
function roofCol(x,z,hm){const h=Math.sin(x*91.7+z*47.3)*43758.5;const r=h-Math.floor(h);let c=ROOFS[Math.floor(r*ROOFS.length)];if(hm>40)c=[[96,110,124],[120,124,128],[140,134,122]][Math.floor(r*3)];const k=0.85+0.3*clamp(hm/120);return c.map(v=>v*k)}
// land use under the city: roads, built ground, parks, plazas, a little water — sampled once into a grid
let LAND=null;
function buildLand(){const C=0.22,X0=-22,Z0=-18,NX=Math.ceil(44/C),NZ=Math.ceil(36/C);const road=new Uint8Array(NX*NZ),bld=new Uint8Array(NX*NZ);
  const mir=(x,z,f)=>{for(const tx of [-2,-1,0,1,2])for(const tz of [-2,-1,0,1,2]){const X=tx*8.8+(tx%2?-1:1)*x,Z=tz*7.2+(tz%2?-1:1)*z;const i=Math.floor((X-X0)/C),j=Math.floor((Z-Z0)/C);if(i>=0&&j>=0&&i<NX&&j<NZ)f(j*NX+i)}};
  for(const w of BLK.w)for(let k=0;k<w.length;k+=2)mir(w[k],w[k+1],q=>road[q]=1);for(const b of BLK.b)mir(b[0],b[1],q=>bld[q]=1);
  const col=new Array(NX*NZ);for(let j=0;j<NZ;j++)for(let i=0;i<NX;i++){const q=j*NX+i;const x=X0+(i+0.5)*C,z=Z0+(j+0.5)*C;const n=Math.sin(x*1.3+Math.sin(z*0.9)*2)+Math.cos(z*1.1-x*0.4);const h=Math.sin(i*12.9+j*78.2)*43758.5,r=h-Math.floor(h);
    let c;if(road[q])c=[44,44,46];else if(bld[q])c=[52,49,45];else if(n>1.1)c=[38,58,42];else if(n<-1.55)c=[26,38,50];else if(r<0.3)c=[40,54,40];else c=[60,57,51];col[q]=c.map(v=>v*0.55*(0.92+0.16*r))}
  LAND={C,X0,Z0,NX,NZ,col}}
function drawLand(ox,oz,a){if(!LAND)buildLand();const {C,X0,Z0,NX,NZ,col}=LAND;for(let j=0;j<NZ;j++)for(let i=0;i<NX;i++){const x=X0+i*C+ox,z=Z0+j*C+oz;const d=Math.hypot(x+C/2-ox,z+C/2-oz);const fa=clamp(1-(d-12)/9);if(fa<=0)continue;const P=[[x,0,z],[x+C,0,z],[x+C,0,z+C],[x,0,z+C]].map(proj);if(P.some(p=>!p))continue;g.fillStyle=rgba(col[j*NX+i],a*fa);g.beginPath();g.moveTo(P[0][0],P[0][1]);g.lineTo(P[1][0],P[1][1]);g.lineTo(P[2][0],P[2][1]);g.lineTo(P[3][0],P[3][1]);g.closePath();g.fill()}}
function curved(fn,cx=0,cz=0,RE=RE_EARTH){const P0=proj;proj=v=>{const d2=(v[0]-cx)**2+(v[2]-cz)**2;return P0([v[0],v[1]-d2/(2*RE),v[2]])};try{return fn()}finally{proj=P0}}
// earth disc + atmosphere along the true (projected) horizon ring, plus faint city lights running out to it
function earthGround(cx=0,cz=0,RE=RE_EARTH,ringR=45,a=1){
  // true horizon of a sphere (centre below the district) as seen from the camera
  const C=[cx,-RE,cz];const PC=sub(M.p,C);const d=Math.hypot(...PC);if(d<=RE)return;const n=PC.map(v=>v/d);const e1=norm(cross(n,[0,0,1])),e2=cross(n,e1);const hc=C.map((v,i)=>v+n[i]*RE*RE/d),hr=RE*Math.sqrt(1-RE*RE/(d*d));
  const arc=[];for(let i=0;i<=1440;i++){const th=i/1440*6.2832;const X=[0,1,2].map(k=>hc[k]+hr*(Math.cos(th)*e1[k]+Math.sin(th)*e2[k]));const p=proj(X);if(p&&p[0]>-400&&p[0]<W+400)arc.push(p)}
  if(arc.length<2)return;{const bins=new Map();for(const p of arc){const k=Math.round(p[0]/8);const b=bins.get(k);if(!b||p[1]<b[1])bins.set(k,p)}arc.length=0;[...bins.values()].sort((p,q)=>p[0]-q[0]).forEach(p=>arc.push(p))}
  // replace the projected curve by the exact circle through its two ends and its middle: a clean circular horizon
  const A=arc[0],B=arc[arc.length>>1],C2=arc[arc.length-1];const d2=2*(A[0]*(B[1]-C2[1])+B[0]*(C2[1]-A[1])+C2[0]*(A[1]-B[1]));let cx2=W/2,cy2=1e5,rr2=1e5-arc[0][1];
  if(Math.abs(d2)>1e-6){const a2=A[0]**2+A[1]**2,b2=B[0]**2+B[1]**2,c2=C2[0]**2+C2[1]**2;cx2=(a2*(B[1]-C2[1])+b2*(C2[1]-A[1])+c2*(A[1]-B[1]))/d2;cy2=(a2*(C2[0]-B[0])+b2*(A[0]-C2[0])+c2*(B[0]-A[0]))/d2;rr2=Math.hypot(A[0]-cx2,A[1]-cy2)}
  if(cy2<B[1]||rr2>2e5){cy2=B[1]+1e5;cx2=W/2;rr2=1e5}
  g.fillStyle=`rgba(12,13,15,${a})`;g.beginPath();g.arc(cx2,cy2,rr2,0,7);g.fill();
  g.globalCompositeOperation='lighter';for(const [w,al,col] of [[60,0.04,[150,175,205]],[22,0.07,[200,210,222]],[6,0.13,[236,226,206]],[1.6,0.3,[245,236,218]]]){g.strokeStyle=rgba(col,al*a);g.lineWidth=w;g.beginPath();g.arc(cx2,cy2,rr2,Math.PI,2*Math.PI);g.stroke()}
  // the city keeps going toward the horizon: warm lights on the curved ground
  curved(()=>{const r=rng(808);for(let i=0;i<5200;i++){const an=r()*6.2832,rr=5.0+Math.pow(r(),1.6)*(ringR-5);const p=proj([cx+Math.cos(an)*rr,0.01,cz+Math.sin(an)*rr]);if(!p)continue;const s=clamp(9/p[2],0.8,2.2);const w=r();g.fillStyle=rgba(w<0.7?[230,200,160]:w<0.9?[190,205,220]:C_OR,(0.5*(1-rr/ringR)+0.06)*a);g.fillRect(p[0]-s/2,p[1]-s/2,s,s)}},cx,cz,RE);
  g.globalCompositeOperation='source-over'}
// the Dongcheng block, re-drawn on the curved earth (same signature as before)
const _drawBlock6=drawBlock;
drawBlock=function(T,o={}){const base=!o.ghost&&!(o.y)&&!o.noEarth&&!window.NO_EARTH;
  if(base&&g.canvas.__earthT!==window.__T){earthGround(o.ox||0,o.oz||0,RE_EARTH,24);g.canvas.__earthT=window.__T}
  const sv=R.altitude;R.altitude=CITY_RAMP;
  try{curved(()=>{const y=o.y||0,s=o.s||1,a=o.a??1,blur=o.blur||0,ox=o.ox||0,oz=o.oz||0;
    // (land-use layer removed: dark ground like the wide model)
    // no plate: the district continues on all sides (mirrored neighbouring tiles, roofs only, fading out)
    if(!o.ghost&&!o.noNbr){for(const [tx,tz] of [[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]]){const fx=tx?-1:1,fz=tz?-1:1;for(const [bx,bz,h0,rr] of BLK.b){if((Math.abs(bx*7.1+bz*3.3)*100|0)%3===0)continue;const X=(tx*8.8+fx*bx)*s+ox,Z=(tz*7.2+fz*bz)*s+oz;const dd=Math.hypot(X-ox,Z-oz);const fa=clamp(1-(dd-4)/7);if(fa<=0.02)continue;
        const h=Math.min(h0,0.12)*1.5*s+y;const P=[];let ok=true;for(let i=0;i<rr.length;i+=2){const q=proj([(tx*8.8+fx*rr[i])*s+ox,h,(tz*7.2+fz*rr[i+1])*s+oz]);if(!q){ok=false;break}P.push(q)}if(!ok)continue;g.fillStyle=rgba(roofCol(X,Z,h0*160),0.85*fa*a);g.beginPath();P.forEach((q,m)=>m?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.closePath();g.fill()}}}
    drawBlds(BLK.b,{oy:y,s,ox,oz,a:a*(o.ghost?0.9:1),ghost:o.ghost,hs:1.5,minH:0.012,edgeD:o.edgeD||7,col:o.ghost?(()=>[190,196,206]):roofCol});
    g.globalCompositeOperation='lighter';const N=Math.floor(BLK.w.length*(o.dense??1));const pc=o.pcol||(o.ghost?[170,185,205]:[240,226,200]);
    for(let i=0;i<N;i++){const w=BLK.w[i];const sp=0.02+((i*37)%17)/17*0.03;const [x,z]=walkerXZ(w,T,sp,(i*0.618)%2);const jx=blur*Math.sin(i*12.9+T*0.7)*0.18,jz=blur*Math.cos(i*7.1+T*0.6)*0.18;const p=proj([(x+jx)*s+ox,y+0.02,(z+jz)*s+oz]);if(!p)continue;const sz=clamp(9/p[2],1.2,4)*(1+blur*1.6);g.fillStyle=rgba(pc,(0.85-blur*0.45)*a);g.fillRect(p[0]-sz/2,p[1]-sz/2,sz,sz)}
    g.globalCompositeOperation='source-over'},o.ox||0,o.oz||0)}finally{R.altitude=sv}};
// the wider Dongcheng model (下降 / 眼睛 / 东城 old shots): same palette and curvature
const _drawCityDC6=drawCityDC;
drawCityDC=function(T){const sv=R.altitude;let ci=0;R.altitude=v=>roofCol(ci++*1.37,ci*0.71,(v-1500)/11500*120);const svBg=bg;let first=true;
  try{bg=()=>{svBg();if(first){first=false;cityCam(T);earthGround(0,0,320,40)}};curved(()=>_drawCityDC6(T),0,0,320)}finally{R.altitude=sv;bg=svBg}};

// camera frustum and camera-coloured marks: brand orange instead of the old pink
if(Array.isArray(C_CAM)){C_CAM[0]=255;C_CAM[1]=180;C_CAM[2]=90}
