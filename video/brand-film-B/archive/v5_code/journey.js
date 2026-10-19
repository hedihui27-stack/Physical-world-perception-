// ===== 60–94 s 一镜到底：地球 → 东城 → 一基多专 → 路口摄像头 → 向量空间 =====
// local time lt: line10 0, line11 6.18, line12 18.88, line13 24.23, end 33.69
const JB={l11:6.18,l12:18.88,l13:24.23};
function jSampleT(lt){ // map to the camera/time base of the one-take sample
  if(lt<6.4)return lt*10.6/6.4;
  if(lt<JB.l12)return 10.6+1.4*ease(clamp((lt-6.4)/(JB.l12-6.4)));
  return 12+5*clamp((lt-JB.l12)/(23.6-JB.l12));}
const EXP=[{k:'sat',n:'SeeMind-Sat',s:'卫星',c:C_SAT,p:[-5,2.8,-4]},{k:'cam',n:'SeeMind-Cam',s:'摄像头',c:C_CAM,p:[5,2.8,-4]},{k:'sense',n:'SeeMind-Sense',s:'传感器',c:C_SEN,p:[-5.5,2.2,3]},{k:'net',n:'SeeMind-News',s:'互联网',c:C_NET,p:[5.5,2.2,3]}];
const CORE=[0.4,3.6,-1.5];
function expertsOverlay(T,lt){const a=clamp((lt-JB.l11+0.2)/1.2)*(1-clamp((lt-JB.l12+0.6)/1.2));if(a<=0)return;const ll2=lt-JB.l11;
  g.globalCompositeOperation='lighter';const r=rng(19);
  EXP.forEach((e,ei)=>{const ea=a*clamp(ll2*1.2-ei*0.25);if(ea<=0)return;
    // raw sources -> expert: dense fine particles
    for(let i=0;i<260;i++){let src;const q=r(),q2=r(),q3=r();
      if(ei===0)src=[e.p[0]+(q-.5)*16,16+q2*4,e.p[2]+(q3-.5)*10];          // from the sky
      else if(ei===1){const c=DC.cams[Math.floor(q*DC.cams.length)];src=[c[0],0.05,c[1]]}  // street cameras
      else if(ei===2)src=[(q-.5)*24,0.05,(q2-.5)*28];                       // ground sensors
      else src=[(q<.5?-1:1)*(18+q2*4),1+q3*3,(r()-.5)*24];                  // internet, from the horizon
      const u=((T*0.4+i/260+ei*0.17)%1);const x=lerp(src[0],e.p[0],ease(u)),y=lerp(src[1],e.p[1],ease(u)),z=lerp(src[2],e.p[2],ease(u));const p=proj([x,y,z]);if(!p)continue;g.fillStyle=rgba(e.c,0.6*ea*(0.4+0.6*u));g.fillRect(p[0]-1,p[1]-1,2,2)}
    // structured tokens: expert -> core
    const tk=clamp((ll2-2.6)/1);if(tk>0)for(let i=0;i<6;i++){const u=((T*0.35+i/6+ei*0.2)%1);const v=[0,1,2].map(k=>lerp(e.p[k],CORE[k],ease(u)));const p=proj(v);if(!p)continue;g.fillStyle=rgba(e.c,0.95*ea*tk);g.fillRect(p[0]-5,p[1]-5,10,10)}
    const p=proj(e.p);if(!p)return;g.globalCompositeOperation='source-over';
    g.fillStyle=rgba(e.c,0.18*ea);g.beginPath();g.arc(p[0],p[1],34,0,7);g.fill();g.strokeStyle=rgba(e.c,0.9*ea);g.lineWidth=1.6;g.beginPath();g.arc(p[0],p[1],34,0,7);g.stroke();
    icon(e.k,p[0],p[1],34,e.c,ea);g.globalCompositeOperation='lighter'});
  // core: base model fusing
  const ca=a*clamp((ll2-3.6)/1.2);const pc=proj(CORE);if(pc&&ca>0){g.globalCompositeOperation='source-over';
    const cg=g.createRadialGradient(pc[0],pc[1],0,pc[0],pc[1],110);cg.addColorStop(0,`rgba(233,238,249,${0.35*ca})`);cg.addColorStop(1,'rgba(233,238,249,0)');g.fillStyle=cg;g.beginPath();g.arc(pc[0],pc[1],110,0,7);g.fill();
    g.strokeStyle=`rgba(233,238,249,${0.5*ca})`;g.lineWidth=1.2;for(let k=0;k<3;k++){g.beginPath();g.ellipse(pc[0],pc[1],70+k*16,(70+k*16)*0.4,T*0.3*(k%2?-1:1),0,6.283);g.stroke()}
    text('SeeMind',pc[0],pc[1]+10,30,`rgba(242,246,255,${ca})`,'center',700,2)}
  g.globalCompositeOperation='source-over';
}
function sceneJourney(t){const lt=LT(t);const sT=jSampleT(lt);const tg=g;
  const A=window.__JA,B=window.__JB,Cv=window.__JC;
  const cityA=sT<9.9?0:ease(clamp((sT-9.9)/1.3));const vA=lt<23.4?0:ease(clamp((lt-23.4)/0.9));
  const draw=(buf,fn,al)=>{g=buf.getContext('2d');fn();g=tg;g.globalAlpha=al;g.drawImage(buf,0,0);g.globalAlpha=1};
  if(cityA<1&&vA<1)draw(A,()=>drawGlobeOT(sT),1);
  if(cityA>0&&vA<1)draw(B,()=>{drawCityDC(sT);if(lt>JB.l11-0.5&&lt<JB.l12+1){const va=clamp((lt-JB.l11+0.2)/1.2)*(1-clamp((lt-JB.l12+0.6)/1.2));g.fillStyle=`rgba(5,7,15,${0.62*va})`;g.fillRect(0,0,W,H);expertsOverlay(t,lt)}},cityA);
  if(vA>0){const save=CP.t0;CP.t0=t0v();draw(Cv,()=>sceneVCloud(t),vA);CP.t0=save}
  function t0v(){return (60.40+23.4)-4.6}}
SC.journey=sceneJourney;
