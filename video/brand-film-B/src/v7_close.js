// ===== 第七版 · 景别与视角多样化（一）：卫星 = 正上方遥感俯视；东城 = 拉近到街区尺度看"漏检 vs 全检" =====
// ---------- 卫星：a nadir remote-sensing view; strips of fresh imagery sweep across an otherwise stale, grey map ----------
let RS=null;
function buildRS(){const L0=-180,L1=180,B0=-56,B1=76;const Wm=2400,Hm=Math.round(2400*(B1-B0)/(L1-L0));
  const src=document.createElement('canvas');src.width=1800;src.height=900;const sx=src.getContext('2d');const im=new Image();im.src='land.png';
  return new Promise(res=>{im.onload=()=>{const sm=document.createElement('canvas');sm.width=Wm;sm.height=Hm;const smx=sm.getContext('2d');smx.imageSmoothingEnabled=true;smx.imageSmoothingQuality='high';smx.drawImage(im,(L0+180)/360*1800,(90-B1)/180*900,(L1-L0)/360*1800,(B1-B0)/180*900,0,0,Wm,Hm);smx.filter='blur(2px)';smx.drawImage(sm,0,0);const L=smx.getImageData(0,0,Wm,Hm).data;
    const mk=()=>{const c=document.createElement('canvas');c.width=Wm;c.height=Hm;return c};const col=mk(),grey=mk(),sar=mk();const cc=col.getContext('2d'),gc=grey.getContext('2d'),rc=sar.getContext('2d');
    const ci=cc.createImageData(Wm,Hm),gi=gc.createImageData(Wm,Hm),ri=rc.createImageData(Wm,Hm);const r=rng(4);
    const noise=(x,y)=>Math.sin(x*0.013+Math.sin(y*0.011)*2)*0.5+Math.sin(x*0.041-y*0.037)*0.3+Math.sin(x*0.11+y*0.09)*0.2;
    for(let y=0;y<Hm;y++){const lat=B1-(y/Hm)*(B1-B0);for(let x=0;x<Wm;x++){const lon=L0+(x/Wm)*(L1-L0);const lf=L[(y*Wm+x)*4]/255;const land=lf>0.5;const n=noise(x,y),k=(y*Wm+x)*4;
      let c;const sea=[16,30,44].map(v=>v+n*4);{const al=Math.abs(lat);const arid=clamp(1-Math.abs(al-25)/10)*clamp(0.6+n*0.6);const green=clamp(1-al/18)+clamp(1-Math.abs(al-50)/12)*0.5;c=[lerp(lerp(96,70,green),132,arid),lerp(lerp(92,92,green),112,arid),lerp(lerp(70,62,green),80,arid)].map(v=>v*1.25*(0.85+0.3*(n*0.5+0.5)));c=c.map((v,m)=>lerp(sea[m],v,clamp((lf-0.35)/0.3)))}
      const sp=0.75+0.5*r();ci.data.set([c[0],c[1],c[2],255],k);const l=(c[0]*0.3+c[1]*0.59+c[2]*0.11)*0.3;gi.data.set([l,l,l*1.05,255],k);const rv=land?(70+60*(n*0.5+0.5))*sp:18*sp;ri.data.set([rv*0.9,rv,rv*1.08,255],k)}}
    cc.putImageData(ci,0,0);gc.putImageData(gi,0,0);rc.putImageData(ri,0,0);
    const cl=mk();const xc=cl.getContext('2d');const rr=rng(9);for(let i=0;i<70;i++){const x=rr()*Wm,y=rr()*Hm*0.8,R0=60+rr()*170;const gg=xc.createRadialGradient(x,y,0,x,y,R0);gg.addColorStop(0,'rgba(200,204,210,0.13)');gg.addColorStop(1,'rgba(222,226,232,0)');xc.fillStyle=gg;xc.fillRect(x-R0,y-R0,2*R0,2*R0)}
    RS={L0,L1,B0,B1,Wm,Hm,col,grey,sar,cl};res()}})}
window.RS_READY=buildRS();
const RSTR=(()=>{const r=rng(55);const S=[];for(let i=0;i<32;i++)S.push({x0:r()*1.15-0.08,ph:r(),sar:i%3===0,v:0.16+r()*0.06,w:46+r()*26});return S})();
// 卫星：restore the v5 shot with real satellite bodies (body, solar panels, imaging beam and footprint); only the planet loses its blue
shotSats=function(t){window._satsV5(t)};
// neutral planet for the old globe code: no blue atmosphere, dark graphite disc, warm-grey land
earthRich=function(cdir,opt={}){const c0=proj([0,0,0]);if(!c0)return;const R0=(()=>{const p=proj(norm(cross(cdir,[0,1,0])));return p?Math.hypot(p[0]-c0[0],p[1]-c0[1]):0})();
  g.globalCompositeOperation='lighter';for(const [k,a] of [[1.02,0.2],[1.08,0.1],[1.22,0.05]]){const gr=g.createRadialGradient(c0[0],c0[1],R0*0.96,c0[0],c0[1],R0*k*1.08);gr.addColorStop(0,`rgba(226,224,218,${a})`);gr.addColorStop(1,'rgba(226,224,218,0)');g.fillStyle=gr;g.beginPath();g.arc(c0[0],c0[1],R0*k*1.1,0,7);g.fill()}
  g.globalCompositeOperation='source-over';const gr=g.createRadialGradient(c0[0]-R0*.35,c0[1]-R0*.4,R0*.05,c0[0],c0[1],R0);gr.addColorStop(0,'#1c1d20');gr.addColorStop(0.7,'#111214');gr.addColorStop(1,'#08090a');g.fillStyle=gr;g.beginPath();g.arc(c0[0],c0[1],R0,0,7);g.fill();
  const key=norm([0.4,0.6,0.7]);for(const [la,lo] of D.land){const v=ll(la,lo);const fd=dot(v,cdir);if(fd<0.03)continue;const p=proj(v);if(!p)continue;const lit=0.35+0.65*Math.max(0,dot(v,key));g.fillStyle=`rgba(${(110+50*lit)|0},${(106+48*lit)|0},${(96+40*lit)|0},${(0.22+0.5*fd)*(opt.land??1)})`;const s=1.6+1.4*fd;g.fillRect(p[0],p[1],s,s)}
  return {c0,R0}};
// ---------- 东城：one neighbourhood, close — the patrol sees a little and misses most; AI sees every event, round the clock ----------
let DC7=null;
shotDCDay=function(t){bg();const lt=t-129.0;const P0=[0.6,-0.4];const az=0.75+lt*0.035;setCam([P0[0]+Math.sin(az)*2.4,3.3,P0[1]+Math.cos(az)*2.4],[P0[0],0,P0[1]],50);
  if(!DC7){const r=rng(61);DC7={ev:[],cams:[],pw:null};for(let i=0;i<60;i++)DC7.ev.push([P0[0]+(r()-.5)*3.6,P0[1]+(r()-.5)*3.6,r()*9.4]);for(let i=0;i<46;i++){const w=BLK.w[Math.floor(r()*BLK.w.length)];const k=Math.floor(r()*(w.length/2))*2;if(Math.hypot(w[k]-P0[0],w[k+1]-P0[1])<2.4)DC7.cams.push([w[k],w[k+1]])}
    let best=null;for(const w of BLK.w){const d=Math.hypot(w[0]-P0[0],w[1]-P0[1]);if(!best||d<best[0])best=[d,w]}DC7.pw=best[1]}
  const sw=ease(clamp((lt-4.4)/1.4));drawBlock(t,{y:0,dense:0.3});
  g.globalCompositeOperation='lighter';
  const [px,pz]=walkerXZ(DC7.pw,t,0.012,0.2);if(sw<1){camPool(px,pz,0.35,[226,232,240],0.5*(1-sw));const q=proj([px,0.02,pz]);if(q){g.fillStyle=`rgba(244,246,250,${1-sw})`;g.fillRect(q[0]-3,q[1]-3,6,6)}}
  if(sw>0)for(const [x,z] of DC7.cams)camPool(x,z,0.5,C_OR,0.16*sw);
  // events: caught (orange ring) or missed (grey, fades unseen)
  for(const [x,z,t0] of DC7.ev){const age=lt-t0;if(age<0||age>1.6)continue;const caught=sw>0.5||Math.hypot(x-px,z-pz)<0.4;const q=proj([x,0.02,z]);if(!q)continue;const k=age/1.6;
    if(caught){g.strokeStyle=rgba(C_OR,0.95*(1-k));g.lineWidth=2.4;g.beginPath();g.ellipse(q[0],q[1],12+k*70,(12+k*70)*0.5,0,0,7);g.stroke();g.fillStyle=rgba(C_OR2,1-k);g.fillRect(q[0]-3,q[1]-3,6,6)}
    else{g.fillStyle=`rgba(150,156,166,${0.6*(1-k)})`;g.fillRect(q[0]-2.5,q[1]-2.5,5,5)}}
  g.globalCompositeOperation='source-over';
  const bx=560,by=930,bw=800;g.fillStyle='rgba(30,34,42,0.85)';g.fillRect(bx,by,bw,14);
  if(sw<1)[[8,11],[14,17],[20,21]].forEach(([a,b])=>{g.fillStyle=`rgba(220,226,236,${0.85*(1-sw)})`;g.fillRect(bx+a/24*bw,by,(b-a)/24*bw,14)});if(sw>0){g.fillStyle=rgba(C_OR,0.9*sw);g.fillRect(bx,by,bw*sw,14)}
  for(const h of [0,6,12,18,24])text(String(h).padStart(2,'0')+':00',bx+h/24*bw,by+46,20,'rgba(170,178,190,0.8)','center',500,1);
  text(sw<0.5?'人工巡查 · 局部、定时 · 多数事件未被发现':'AI 感知 · 7×24 · 事件即时发现',bx,by-20,30,sw<0.5?'rgba(236,238,242,0.95)':rgba(C_OR2,1),'left',700,3);
  text('北京 · 东城区',120,1000,30,'rgba(236,238,242,0.9)','left',600,4);vignette()};
