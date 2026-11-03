// ===== 第九版 · 预览第 3 版修改 =====
// ---------- S06 前段补画面：「要索引现实，先要看见现实」——夜晚的地球，一道光波从北京扩散，经过之处全球感知点逐一亮起
const BJ9=[39.9,116.4];
function angDist(a,b){const r=Math.PI/180;const c=Math.sin(a[0]*r)*Math.sin(b[0]*r)+Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.cos((a[1]-b[1])*r);return Math.acos(Math.max(-1,Math.min(1,c)))/r}
let SEEPTS=null;const R9=u=>lerp(0,70,ease(clamp((u-0.7)/3.4)));
function shotSee(t){const u=t-37.4;bg();
  // the same low-orbit view as S04 (where reality sat unlit), drifting east
  const cdir=lowEarth(18,lerp(106,111,clamp(u/4.4)),lerp(0.2,0.24,clamp(u/4.4)),38,112,1);const R=R9(u);const G=D.global;
  for(let i=0;i<G.length;i+=2){const v=ll(G[i][0],G[i][1],1.0015);if(dot(v,cdir)<0.02||occluded(v))continue;const p=proj(v);if(!p)continue;const d=angDist(G[i],BJ9);
    if(d>R){g.fillStyle='rgba(11,12,14,0.95)';g.fillRect(p[0]-2,p[1]-2,4,4);g.fillStyle='rgba(150,152,158,0.55)';g.fillRect(p[0]-0.9,p[1]-0.9,1.8,1.8)}
    else{const flash=Math.exp(-((R-d)/5)*2.5);g.globalCompositeOperation='lighter';const col=(i%5===0)?C_OR:CAT[i%5];g.fillStyle=rgba(col,0.42+0.55*flash);const s2=clamp(9/p[2],1.6,3.2)+4*flash;g.fillRect(p[0]-s2/2,p[1]-s2/2,s2,s2);g.globalCompositeOperation='source-over'}}
  // the wavefront
  g.globalCompositeOperation='lighter';if(R>0.3&&R<119){const ring=[];for(let i=0;i<=240;i++){const b=i/240*360;const r=Math.PI/180,la1=BJ9[0]*r,d=R*r,br=b*r;const la2=Math.asin(Math.sin(la1)*Math.cos(d)+Math.cos(la1)*Math.sin(d)*Math.cos(br));const lo2=BJ9[1]*r+Math.atan2(Math.sin(br)*Math.sin(d)*Math.cos(la1),Math.cos(d)-Math.sin(la1)*Math.sin(la2));const v=ll(la2/r,lo2/r,1.003);ring.push(occluded(v)||dot(v,cdir)<0?null:proj(v))}
    for(const [w,al] of [[30,0.06],[10,0.14],[2.4,0.75]]){g.strokeStyle=rgba(C_OR2,al);g.lineWidth=w;g.beginPath();let on=false;for(const p of ring){if(!p){on=false;continue}on?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]);on=true}g.stroke()}}
  const pb=proj(ll(BJ9[0],BJ9[1],1.003));if(pb)glowDot(pb,60,C_OR,0.75*clamp(u/0.6));
  g.globalCompositeOperation='source-over';vignette()}
const _shells9=shotShells;let SEEBUF=null;
shotShells=function(t){const X0=41.25,X1=41.85;if(t<X0)return shotSee(t);if(t>=X1)return _shells9(t);
  shotSee(t);if(!SEEBUF){SEEBUF=document.createElement('canvas');SEEBUF.width=W;SEEBUF.height=H}const sg=g;g=SEEBUF.getContext('2d');try{_shells9(t)}finally{g=sg}g.globalAlpha=ease((t-X0)/(X1-X0));g.drawImage(SEEBUF,0,0);g.globalAlpha=1};
// ---------- S15：判断单元从路口下方浮上来（不再从天上坠落）
const _fourEl9=shotFourEl;
shotFourEl=function(t){const u=t-92.0;if(u>=1.4)return _fourEl9(t);
  // draw the scene without the unit, then the rising unit
  v9init();bg();const k=ease(clamp(u/6.4));setCam([HX+lerp(1.6,1.25,k),lerp(1.35,1.1,k),HZ+lerp(2.2,1.75,k)],[HX,0.5,HZ],50);drawBlock(t,{dense:0.9});
  const rise=ease(clamp((u+0.6)/1.9));const C=[HX,lerp(0.02,0.55,rise),HZ];const s=lerp(0.03,0.085,ease(clamp((u-0.9)/0.8)));
  g.globalCompositeOperation='lighter';camPool(HX,HZ,0.25,C_OR,0.45*rise);const r=rng(7);for(let i=0;i<70;i++){const f=((t*0.6+r())%1);const a2=r()*6.283,rr=r()*0.18;const p=proj([HX+Math.cos(a2)*rr*(1-f),f*C[1],HZ+Math.sin(a2)*rr*(1-f)]);if(p){g.fillStyle=rgba(C_OR2,0.8*Math.sin(f*Math.PI)*rise);g.fillRect(p[0]-1.5,p[1]-1.5,3,3)}}
  const pc=proj(C);if(pc)glowDot(pc,150,C_OR,0.4*rise);g.globalCompositeOperation='source-over';g.globalAlpha=clamp(rise*1.5);cube3(C,s,[226,150,62],1,C_OR2);g.globalAlpha=1;vignette()};
