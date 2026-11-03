// ===== S05 · 第一次说"构建物理世界大模型 SeeMind"：画面中央升起 SeeMind 模型体 =====
// 解说（成片原时间）：正在构建物理世界大模型 SeeMind 29.7–32.6 · 可搜索 32.9 · 可预测 34.7 · 智能体据此行动 35.6
const _wake9=shotWake;
shotWake=function(t){_wake9(t);const u=t-28.2;
  const grow=ease(clamp((t-29.8)/1.3)),lift=ease(clamp((t-32.45)/0.8)),la=clamp((t-31.2)/0.5);if(grow<=0)return;
  // the model sits over the district centre, then rises to the top of the frame and stays as the source of what follows
  const D0=6.2;const base=[M.p[0]+M.f[0]*D0+M.u[0]*lerp(0,1.55,lift),M.p[1]+M.f[1]*D0+M.u[1]*lerp(0,1.55,lift),M.p[2]+M.f[2]*D0+M.u[2]*lerp(0,1.55,lift)];const mp=lerp(0.19,0.11,lift)*lerp(0.6,1,grow);
  const sv=[MXP,MXS],X0=XC.slice();MXP=mp;MXS=mp*0.7;XC[0]=base[0];XC[1]=base[1];XC[2]=base[2];
  // light from the model down into the city: it is built on what the city senses
  g.globalCompositeOperation='lighter';const r=rng(61);for(let i=0;i<140;i++){const gx=(r()-0.5)*6,gz=(r()-0.5)*5;const f=((t*0.5+r())%1);const p=proj([lerp(gx,base[0],f),lerp(0.02,base[1]-0.3,f*f),lerp(gz,base[2],f)]);if(!p)continue;const s=clamp(40/p[2],1.2,3.5);g.fillStyle=rgba(r()<0.7?C_OR2:[230,236,244],0.7*grow*Math.sin(f*Math.PI));g.fillRect(p[0]-s/2,p[1]-s/2,s,s)}
  const pc=proj(base);if(pc)glowDot(pc,lerp(520,300,lift)*grow,C_OR,0.1*grow);g.globalCompositeOperation='source-over';
  if(pc){const R0=lerp(560,320,lift);const gg=g.createRadialGradient(pc[0],pc[1],0,pc[0],pc[1],R0);gg.addColorStop(0,`rgba(6,7,10,${0.72*grow})`);gg.addColorStop(0.6,`rgba(6,7,10,${0.45*grow})`);gg.addColorStop(1,'rgba(6,7,10,0)');g.fillStyle=gg;g.fillRect(pc[0]-R0,pc[1]-R0,2*R0,2*R0)}
  try{seeMindMatrix(t,0.85*grow,-0.75+u*0.05)}finally{MXP=sv[0];MXS=sv[1];XC[0]=X0[0];XC[1]=X0[1];XC[2]=X0[2]}
  const hh=mp*5.2;const pl=proj([base[0]-M.u[0]*hh,base[1]-M.u[1]*hh,base[2]-M.u[2]*hh]);if(pl&&la>0){text('SeeMind',pl[0],pl[1]+lerp(56,40,lift),lerp(64,44,lift),`rgba(246,244,240,${la})`,'center',700,6)}};
