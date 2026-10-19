// ===== 13 时空切片 → 向量空间 → 城市状态图（升级版） =====
const VC={};
function vcInit(){if(VC.n)return;const r=rng(77);const GX=16,GY=9,PER=190;const n=GX*GY*PER;VC.n=n;
  VC.s=new Float32Array(n*3);VC.c=new Float32Array(n*3);VC.k=new Float32Array(n*3);VC.d=new Float32Array(n*3);VC.cl=new Uint8Array(n);VC.patch=new Uint16Array(n);VC.j=new Float32Array(n);
  const gauss=()=>{let u=0;for(let i=0;i<6;i++)u+=r();return u-3};
  VC.cent=[[-2.6,0.9,-0.6],[-0.9,-0.7,1.6],[1.4,1.4,1.2],[2.7,-0.6,-0.4],[0.6,-0.2,-2.4],[-1.6,-0.4,-2.2]];
  VC.names=['车流','人群','排队','停车','占道经营','施工'];VC.cols=[[74,168,255],[255,158,203],[255,209,102],[95,224,176],[255,122,61],[181,131,255]];
  VC.sub=VC.cent.map(c=>[0,1,2].map(()=>[c[0]+gauss()*0.45,c[1]+gauss()*0.45,c[2]+gauss()*0.45]));
  for(let i=0;i<n;i++){const p=Math.floor(i/PER);VC.patch[i]=p;const px=p%GX,py=Math.floor(p/GX);
    VC.s[i*3]=-3.2+(px+r())*6.4/GX;VC.s[i*3+1]=1.8-(py+r())*3.6/GY;VC.s[i*3+2]=0;
    // patches with similar content share a cluster: derive from row/col pattern (road rows vs buildings etc.)
    const cl=((py<3)?(px%3===0?4:5):(py>6?(px%2?3:2):(px%2?0:1)));VC.cl[i]=cl;
    VC.c[i*3]=gauss()*1.6;VC.c[i*3+1]=gauss()*1.1;VC.c[i*3+2]=gauss()*1.6;
    const ce=VC.cent[cl];VC.k[i*3]=ce[0]+gauss()*0.32;VC.k[i*3+1]=ce[1]+gauss()*0.32;VC.k[i*3+2]=ce[2]+gauss()*0.32;
    const sb=VC.sub[cl][i%3];VC.d[i*3]=sb[0]+gauss()*0.05;VC.d[i*3+1]=sb[1]+gauss()*0.05;VC.d[i*3+2]=sb[2]+gauss()*0.05;VC.j[i]=r()}
  VC.frame=document.createElement('canvas');VC.frame.width=640;VC.frame.height=360}
function sceneVCloud(t){bg();vcInit();const lt=LT(t);
  // phase clocks (seconds after segment start = narration line 12 onset)
  const A1=5.35,B0=5.4,B1=7.9,C1=10.2,D1=13.0;
  const az=-0.15*clamp((lt-B0)/3)+(-0.35)*ease(clamp((lt-B0)/(D1-B0)))+lt*0.015,dist=9-1.6*ease(clamp((lt-B0)/4));
  setCam([Math.sin(az)*dist,0.4+1.2*ease(clamp((lt-B0)/4)),Math.cos(az)*dist],[0,0,0],38);
  // 1) the camera frame as a plane, with patch grid (fades as patches lift off)
  const fa=1-clamp((lt-B0-1.6)/0.4);
  if(fa>0){const img=VC.img;const p00=proj([-3.2,1.8,0]),p10=proj([3.2,1.8,0]),p01=proj([-3.2,-1.8,0]);
    g.save();g.setTransform((p10[0]-p00[0])/960,(p10[1]-p00[1])/960,(p01[0]-p00[0])/540,(p01[1]-p00[1])/540,p00[0],p00[1]);
    for(let p=0;p<144;p++){const px=p%16,py=Math.floor(p/16);const lift=clamp((lt-B0-px*0.05-py*0.04)/0.6);if(lift>=1)continue;g.globalAlpha=0.95*(1-lift);g.drawImage(img,px*60,py*60,60,60,px*60,py*60,60,60)}
    g.restore();g.globalAlpha=1;
    const ga=clamp((lt-2.2)/1.5)*fa;if(ga>0){g.strokeStyle=`rgba(159,232,255,${0.75*ga})`;g.lineWidth=1;for(let i=0;i<=16;i++){const a=proj([-3.2+i*0.4,1.8,0]),b=proj([-3.2+i*0.4,-1.8,0]);g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke()}for(let j=0;j<=9;j++){const a=proj([-3.2,1.8-j*0.4,0]),b=proj([3.2,1.8-j*0.4,0]);g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke()}
      // a few time/position stamps on patches
      for(let q=0;q<6;q++){const px=(q*5+3)%16,py=(q*4+1)%9;const a=proj([-3.2+px*0.4+0.2,1.8-py*0.4-0.2,0]);text(`t ${String(8+q).padStart(2,'0')}:${String(12+q*7).padStart(2,'0')} · ${(116.40+q*0.003).toFixed(3)},${(39.91+q*0.002).toFixed(3)}`,a[0],a[1]-14,13,`rgba(159,232,255,${ga})`,'center',500)}}}
  // word tokens (what LLMs model) — small, dim, upper left, only in phase A
  const wa=VC.noWords?0:clamp(lt/0.8)*(1-clamp((lt-A1+0.3)/0.8));if(wa>0){text('SeeMind 的 token',1060,905,20,`rgba(159,232,255,${clamp((lt-2.4)/0.8)*wa})`,'left',500,2);text('画面 + 时间 + 位置',1060,950,22,`rgba(159,232,255,${clamp((lt-2.4)/0.8)*wa})`,'left',500,2);text('大模型的 token',560,905,20,`rgba(147,160,186,${wa})`,'left',500,2);'大模型建模的是文字'.split('').forEach((w,i)=>{g.globalAlpha=wa;g.strokeStyle='rgba(147,160,186,0.5)';g.strokeRect(560+i*50,920,42,42);text(w,581+i*50,950,22,'#c9d2e3','center',500);g.globalAlpha=1})}
  // 2) particles: patch -> cloud -> clusters -> graph nodes
  if(lt>B0-0.2){g.globalCompositeOperation='lighter';const n=VC.n;const M0=M,fx=M0.p,f=M0.f,rr=M0.r,u=M0.u;
    for(let i=0;i<n;i++){const p=VC.patch[i];const lift=clamp((lt-B0-(p%16)*0.05-Math.floor(p/16)*0.04)/1.4);if(lift<=0)continue;
      const k1=ease(lift),k2=ease(clamp((lt-B1+0.4-VC.j[i]*0.6)/2.2)),k3=ease(clamp((lt-C1-VC.j[i]*0.5)/1.6));
      let x,y,z;const i3=i*3;
      if(k2<=0){x=lerp(VC.s[i3],VC.c[i3],k1);y=lerp(VC.s[i3+1],VC.c[i3+1],k1);z=lerp(VC.s[i3+2],VC.c[i3+2]+2.2*Math.sin(k1*Math.PI),k1)}
      else if(k3<=0){x=lerp(VC.c[i3],VC.k[i3],k2);y=lerp(VC.c[i3+1],VC.k[i3+1],k2);z=lerp(VC.c[i3+2],VC.k[i3+2],k2)}
      else{x=lerp(VC.k[i3],VC.d[i3],k3);y=lerp(VC.k[i3+1],VC.d[i3+1],k3);z=lerp(VC.k[i3+2],VC.d[i3+2],k3)}
      const dx=x-fx[0],dy=y-fx[1],dz=z-fx[2];const zz=dx*f[0]+dy*f[1]+dz*f[2];if(zz<0.1)continue;const sx=W/2+(dx*rr[0]+dy*rr[1]+dz*rr[2])*F/zz,sy=H/2-(dx*u[0]+dy*u[1]+dz*u[2])*F/zz;
      const cc=VC.cols[VC.cl[i]];const mix=clamp(k2*1.2);const R0=lerp(170,cc[0],mix),G0=lerp(225,cc[1],mix),B0c=lerp(255,cc[2],mix);
      const a=(0.35+0.4*(1-k3*0.5))*clamp(9/zz);const s=1.6*clamp(9/zz,0.5,1.6);g.fillStyle=`rgba(${R0|0},${G0|0},${B0c|0},${a})`;g.fillRect(sx-s/2,sy-s/2,s,s)}
    g.globalCompositeOperation='source-over'}
  // 3) cluster labels (similar reality comes together)
  const la=clamp((lt-B1-1.2)/0.8);if(la>0)VC.cent.forEach((c,ci)=>{const p=proj([c[0],c[1]+0.75,c[2]]);if(!p)return;const col=VC.cols[ci];text(VC.names[ci],p[0],p[1],20,rgba(col,la),'center',600,2)});
  // 4) state graph: edges between sub-nodes and clusters, version layers
  const ea=clamp((lt-C1-0.6)/1.2);if(ea>0){g.globalCompositeOperation='lighter';const L=(a,b,al)=>{const p=proj(a),q=proj(b);if(!p||!q)return;g.strokeStyle=`rgba(200,235,255,${al})`;g.lineWidth=1.2;g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(q[0],q[1]);g.stroke()};
    VC.sub.forEach((ss,ci)=>{ss.forEach((s,k)=>L(s,ss[(k+1)%3],0.5*ea));L(ss[0],VC.sub[(ci+1)%6][1],0.35*ea);L(ss[2],VC.sub[(ci+2)%6][0],0.25*ea)});
    VC.sub.forEach((ss,ci)=>ss.forEach(s=>{const p=proj(s);if(!p)return;const col=VC.cols[ci];const pulse=0.6+0.4*Math.sin(t*4+ci);g.fillStyle=rgba(col,0.9*ea);g.beginPath();g.arc(p[0],p[1],4+3*pulse,0,7);g.fill()}));
    g.globalCompositeOperation='source-over';
    const tags=[['实体',VC.sub[0][0]],['关系',VC.sub[2][1]],['属性',VC.sub[3][2]],['时空',VC.sub[5][0]]];tags.forEach(([s,v],i)=>{const p=proj(v);if(!p)return;const a=clamp((lt-C1-1.0-i*0.25)/0.6);g.fillStyle=`rgba(5,7,15,${0.7*a})`;g.fillRect(p[0]+14,p[1]-30,62,30);g.strokeStyle=`rgba(233,238,249,${0.6*a})`;g.strokeRect(p[0]+14,p[1]-30,62,30);text(s,p[0]+45,p[1]-8,18,`rgba(233,238,249,${a})`,'center',600,2)})}
  vignette()}
SC.vcloud=sceneVCloud;

// ===== glow pass: bright parts bleed light (cheap: two downsampled blurs) =====
const GL1=document.createElement('canvas');GL1.width=480;GL1.height=270;const GL2=document.createElement('canvas');GL2.width=240;GL2.height=135;
function glow(src,dst,amt=0.75){const a=GL1.getContext('2d'),b=GL2.getContext('2d');
  a.globalCompositeOperation='copy';a.filter='blur(3px)';a.drawImage(src,0,0,480,270);a.filter='none';
  b.globalCompositeOperation='copy';b.filter='blur(5px)';b.drawImage(GL1,0,0,240,135);b.filter='none';
  dst.save();dst.globalCompositeOperation='lighter';dst.globalAlpha=amt*0.55;dst.drawImage(GL1,0,0,W,H);dst.globalAlpha=amt*0.6;dst.drawImage(GL2,0,0,W,H);dst.restore()}
