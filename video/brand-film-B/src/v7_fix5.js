// ===== 第七版 · 收尾（五）：时间世界改为一条时间轴上的四张"预测卡"；南京压矮超高楼；剥离加"未知"噪点；苏醒改为路口近景 =====
// ---------- 南京：cap the single super-tall tower so it no longer cuts the frame like a pole ----------
if(typeof buildNJ7==='function'){const _b=buildNJ7;buildNJ7=function(){_b();NJ7.B=NJ7.B.map(b=>b[2]*160>60?[b[0],b[1],60/160,b[3]]:b)}}
// ---------- 剥离：where nothing is indexed, the surface reads as unresolved noise ----------
const _peel7=shotPeel;
shotPeel=function(t){_peel7(t);const lt=t-25.9;const a=clamp((lt-0.6)/1.2);if(a<=0)return;const r=rng(Math.floor(t*10));g.globalCompositeOperation='lighter';
  for(let i=0;i<900;i++){const la=12+r()*38,lo=88+r()*50;const v=ll(la,lo,1.001);if(occluded(v))continue;const p=proj(v);if(!p)continue;const s=clamp(14/p[2],2,7);const q=r();g.fillStyle=`rgba(170,176,186,${a*0.06*q})`;g.fillRect(p[0]-s/2,p[1]-s/2,s,s)}
  g.globalCompositeOperation='source-over'};
// ---------- 苏醒：closer, at the crossroads, no horizon (so it no longer looks like 下降) ----------
const _wake7=shotWake;
shotWake=function(t){const lt=t-29.1;window.NO_EARTH=1;const cam=setCam;setCam=()=>{const az=0.25+lt*0.04;cam([1.0+Math.sin(az)*3.0,2.3,-1.0+Math.cos(az)*3.0],[1.0,0.7,-1.0],54)};try{_wake7(t)}finally{setCam=cam;window.NO_EARTH=0}};
