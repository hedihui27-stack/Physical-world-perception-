// ===== 第六版 · 预测与验证段：真实东城街区 + 地球 =====
// a hotspot that the prediction follows through the layers (orange)
const HOT=[1.35,-0.6];
function hotColumn(ys,s,a,T,spread){g.globalCompositeOperation='lighter';
  ys.forEach((y,i)=>{const R0=(0.25+spread[i])*s;camPool(HOT[0]*s,HOT[1]*s,R0*1.6,C_OR,0.42*a,y+0.01);
    const r=rng(70+i);for(let k=0;k<70;k++){const ang=r()*6.283,rr=Math.sqrt(r())*R0;const p=proj([HOT[0]*s+Math.cos(ang)*rr+Math.sin(T*0.8+k)*0.03,y+0.03,HOT[1]*s+Math.sin(ang)*rr]);if(!p)continue;const sz=clamp(10/p[2],1.4,4);g.fillStyle=rgba(C_OR2,0.9*a);g.fillRect(p[0]-sz/2,p[1]-sz/2,sz,sz)}});
  // the column of light joining the layers
  const p0=proj([HOT[0]*s,ys[0],HOT[1]*s]),p1=proj([HOT[0]*s,ys[ys.length-1],HOT[1]*s]);if(p0&&p1){for(let w=0;w<3;w++){g.strokeStyle=rgba(C_OR,(0.5-w*0.15)*a);g.lineWidth=1.5+w*5;g.beginPath();g.moveTo(p0[0],p0[1]);g.lineTo(p1[0],p1[1]);g.stroke()}}
  g.globalCompositeOperation='source-over'}
const LAY6=[[0,'此刻',0],[1.6,'+5 分钟',0.25],[3.2,'+30 分钟',0.6],[4.8,'+1 小时',1.0]];
shotPredict=function(t){bg();const lt=LT(t);const az=0.7-lt*0.035;setCam([Math.sin(az)*10.8,5.6+lt*0.14,Math.cos(az)*10.8],[0,2.3,0],44);
  const shown=[];LAY6.forEach(([y,lbl,bl],i)=>{const a=clamp((lt-0.2-i*1.0)/0.9);if(a<=0)return;shown.push(i);
    drawBlock(t+i*0.6,{y,a,ghost:i>0,blur:bl,dense:i?0.75:1});const lp=proj([4.6,y,-3.6]);if(lp)text(lbl,lp[0]+12,lp[1]+8,26,i===0?`rgba(244,244,242,${a})`:`rgba(205,212,222,${a})`,'left',600,2)});
  // one place followed into the future: the halo widens = the confidence it carries
  const ha=clamp((lt-2.2)/1.0);if(ha>0&&shown.length>1)hotColumn(shown.map(i=>LAY6[i][0]),1,ha,t,shown.map(i=>LAY6[i][2]*0.55));
  vignette()};
shotMatch=function(t){bg();const lt=LT(t);const az=0.45;setCam([Math.sin(az)*9.8,5.8,Math.cos(az)*9.8],[0,0.8,0],44);const fall=ease(clamp(lt/2.0));
  drawBlock(t,{y:0});const gy=lerp(3.2,0.02,fall);drawBlock(t+0.01,{y:gy,ghost:1,blur:0.3*(1-fall),a:0.8,dense:0.7});
  if(fall>0.6){const k=(fall-0.6)/0.4;g.globalCompositeOperation='lighter';const r=rng(3);for(let i=0;i<900;i++){const w=BLK.w[i];const sp=0.02+((i*37)%17)/17*0.03;const [x,z]=walkerXZ(w,t,sp,(i*0.618)%2);const q=proj([x,0.04,z]);if(!q)continue;const ok=r()<0.86;const col=ok?C_OR:[200,90,80];const s=clamp(14/q[2],2,6)*(ok?1:0.7);const gg=g.createRadialGradient(q[0],q[1],0,q[0],q[1],s*2.4);gg.addColorStop(0,rgba(col,0.95*k));gg.addColorStop(1,rgba(col,0));g.fillStyle=gg;g.beginPath();g.arc(q[0],q[1],s*2.4,0,7);g.fill()}g.globalCompositeOperation='source-over'}
  vignette()};
// four time worlds in depth; as "now" reaches each one it merges with reality and is sealed (orange frame)
shotTimeWorlds=function(t){bg();const lt=LT(t);const flyZ=lerp(9,-13,ease(clamp(lt/6.9)));setCam([2.8,3.6,flyZ+6.5],[0,0.2,flyZ-4],52);
  const gaps=[0,-6.5,-13,-19.5],s=0.78;LAY6.forEach(([_,lbl,bl],i)=>{const z0=gaps[i];const reach=clamp((lt-0.8-i*1.5)/0.8);const merged=reach>=1;
    drawBlock(t+i*0.6,{oz:z0,s,ghost:!merged&&i>0,blur:bl*(1-reach),a:1,dense:0.8,edge:merged?C_OR:C_ST,edgeW:merged?3:1.2,edgeD:5});
    if(reach>0&&!merged){g.globalCompositeOperation='lighter';const r=rng(40+i);for(let k=0;k<500;k++){const w=BLK.w[k];const sp=0.02+((k*37)%17)/17*0.03;const [x,z]=walkerXZ(w,t+i*0.6,sp,(k*0.618)%2);const q=proj([x*s,0.05,z*s+z0]);if(!q)continue;const ok=r()<0.84;const col=ok?C_OR:[200,90,80];const sz=clamp(12/q[2],1.5,5);g.fillStyle=rgba(col,0.7*reach);g.fillRect(q[0]-sz,q[1]-sz,sz*2,sz*2)}g.globalCompositeOperation='source-over'}
    if(merged){g.globalCompositeOperation='lighter';const c=[[-4.4,-3.6],[4.4,-3.6],[4.4,3.6],[-4.4,3.6]].map(([x,z])=>proj([x*s,0,z*s+z0]));if(c.every(x=>x)){g.strokeStyle=rgba(C_OR,0.25);g.lineWidth=12;g.beginPath();c.forEach((p,k)=>k?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.stroke()}g.globalCompositeOperation='source-over'}
    const lp=proj([-4.5*s,0.1,3.6*s+z0]);if(lp)text(lbl,lp[0],lp[1]-14,30,merged?rgba(C_OR2,1):'rgba(236,238,242,0.9)','left',700,2)});
  vignette()};
// convergence at planetary scale: the predicted world (ghost) slides onto the real one as cities connect;
// the world made only of text stays blurred — nothing real to check it against
let TXTG=null;
shotConverge=function(t){bg();const lt=LT(t);const conv=ease(clamp(lt/4.6));
  const p=ll(30,108-lt*1.2,2.95);setCam(p,[0,0,0],38);M.p=M.p.map((x,i)=>x+M.r[i]*0.42);// earth sits left of centre
  const cdir=norm(M.p);earthRich(cdir,{land:0.6});
  // real sensing points (warm white) and the predicted ghost (cool, rotated off) converging
  const G=D.global;const ang=(1-conv)*0.16,ca=Math.cos(ang),sa=Math.sin(ang);g.globalCompositeOperation='lighter';
  for(let i=0;i<G.length;i+=2){const v=ll(G[i][0],G[i][1],1.002);const fd=dot(v,cdir);if(fd<0.05)continue;const pr=proj(v);if(pr){g.fillStyle=`rgba(200,200,198,${0.22*fd})`;g.fillRect(pr[0]-0.7,pr[1]-0.7,1.5,1.5)}
    const gv=[v[0]*ca-v[2]*sa,v[1]+(1-conv)*0.05,v[0]*sa+v[2]*ca].map(x=>x*(1.012+0.03*(1-conv)));if(dot(gv,cdir)<0.05)continue;const pg=proj(gv);if(pg){g.fillStyle=`rgba(150,170,195,${0.3*fd*(1-conv*0.85)})`;g.fillRect(pg[0]-0.8,pg[1]-0.8,1.7,1.7)}}
  // cities connecting: one by one they light up orange
  const n=Math.floor(C275.length*conv);for(let i=0;i<n;i++){const [la,lo]=C275[i];const v=ll(la,lo,1.004);if(dot(v,cdir)<0.1)continue;const q=proj(v);if(!q)continue;const age=clamp((conv*C275.length-i)/12);const R0=3+7*(1-age);const gg=g.createRadialGradient(q[0],q[1],0,q[0],q[1],R0*2);gg.addColorStop(0,rgba(C_OR,0.5));gg.addColorStop(0.35,rgba(C_OR,0.18));gg.addColorStop(1,rgba(C_OR,0));g.fillStyle=gg;g.beginPath();g.arc(q[0],q[1],R0*2,0,7);g.fill()}
  g.globalCompositeOperation='source-over';
  // the text world
  const ta=clamp((lt-2.6)/0.9);if(ta>0){if(!TXTG){const r=rng(9);TXTG=[...Array(900)].map((_,i)=>{const y=1-2*(i+.5)/900,rr=Math.sqrt(1-y*y),a=i*2.39996;return[Math.cos(a)*rr,y,Math.sin(a)*rr,'文字语料网页知识新闻百科问答'.charAt(Math.floor(r()*14))]})}
    const cx=1530,cy=470,R0=210,rot=t*0.25;g.font='500 20px "Noto Sans CJK SC"';g.textAlign='center';
    for(const [x,y,z,ch] of TXTG){const X=x*Math.cos(rot)-z*Math.sin(rot),Z=x*Math.sin(rot)+z*Math.cos(rot);if(Z<-0.2)continue;const sx=cx+X*R0,sy=cy-y*R0;for(let k=0;k<3;k++){g.fillStyle=`rgba(205,208,215,${0.10*ta*(0.4+0.6*(Z+1)/2)})`;g.fillText(ch,sx+(k-1)*3.5,sy+(k%2)*2.5)}}}
  vignette()};
// ---------- 行动改变现实，现实训练模型 ----------
const AG=(()=>{const r=rng(81);return[...Array(46)].map((_,i)=>({w:Math.floor(r()*1400),sp:0.03+r()*0.03,ph:r()*2,k:i%3}))})();
shotFlywheel=function(t){bg();const lt=LT(t);const az=0.3+lt*0.09;setCam([Math.sin(az)*9.6,6.2,Math.cos(az)*9.6],[0,1.4,0],46);
  drawBlock(t,{y:0,dense:0.5});const core=[0,4.2,0];
  g.globalCompositeOperation='lighter';
  // agents acting in the city: orange trails
  for(const a of AG){const w=BLK.w[a.w];const pts=[];for(let k=0;k<26;k++){const [x,z]=walkerXZ(w,t-k*0.12,a.sp*2.2,a.ph);pts.push(proj([x,a.k===1?0.35:0.03,z]))}
    for(let k=0;k<pts.length-1;k++){const p=pts[k],q=pts[k+1];if(!p||!q)continue;g.strokeStyle=rgba(C_OR,0.9*(1-k/26));g.lineWidth=2.4*(1-k/26)+0.6;g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(q[0],q[1]);g.stroke()}
    if(pts[0]){const gg=g.createRadialGradient(pts[0][0],pts[0][1],0,pts[0][0],pts[0][1],12);gg.addColorStop(0,rgba(C_OR2,1));gg.addColorStop(1,rgba(C_OR2,0));g.fillStyle=gg;g.beginPath();g.arc(pts[0][0],pts[0][1],12,0,7);g.fill()}}
  // reality rises into the model (white), the model's next move falls back (orange)
  for(let i=0;i<AG.length;i++){const a=AG[i];const [x,z]=walkerXZ(BLK.w[a.w],t,a.sp*2.2,a.ph);for(let k=0;k<8;k++){const up=k<5;const u=((t*0.6+k/8+i*0.07)%1);const from=up?[x,0.05,z]:core,to=up?core:[x,0.05,z];const v=[0,1,2].map(j=>lerp(from[j],to[j],u)+(j===1?Math.sin(u*Math.PI)*0.6:0));const p=proj(v);if(!p)continue;const s=2.6;g.fillStyle=up?`rgba(232,236,242,${0.7*Math.sin(u*Math.PI)})`:rgba(C_OR,0.8*Math.sin(u*Math.PI));g.fillRect(p[0]-s/2,p[1]-s/2,s,s)}}
  // the model: a spinning ring that speeds up with every loop
  const pc=proj(core);if(pc){const spin=t*(1.2+lt*0.8);for(let i=0;i<900;i++){const th=i/900*6.283+spin,v=i*2.399;const rr=1.4+0.18*Math.cos(v);const p=proj([Math.cos(th)*rr,core[1]+0.18*Math.sin(v),Math.sin(th)*rr]);if(!p)continue;const b=0.5+0.5*Math.cos(th*2-t*5);g.fillStyle=`rgba(${235},${215+20*b|0},${190+40*b|0},${0.3+0.5*b})`;g.fillRect(p[0]-1.2,p[1]-1.2,2.4,2.4)}
    const gg=g.createRadialGradient(pc[0],pc[1],0,pc[0],pc[1],110);gg.addColorStop(0,rgba(C_OR2,0.75));gg.addColorStop(0.3,rgba(C_OR,0.3));gg.addColorStop(1,rgba(C_OR,0));g.fillStyle=gg;g.beginPath();g.arc(pc[0],pc[1],110,0,7);g.fill()}
  g.globalCompositeOperation='source-over';vignette()};
