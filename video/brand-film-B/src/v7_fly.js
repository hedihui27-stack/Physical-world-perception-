// ===== 第七版 · 双轮驱动：去掉环。上方是模型的城市状态图（同一街区的虚像），现实向上（白），模型的下一步向下（橙） =====
(()=>{const src=shotFlywheel.toString();})();
shotFlywheel=function(t){bg();const lt=LT(t);const az=0.3+lt*0.09;setCam([Math.sin(az)*8.2,11.5,Math.cos(az)*8.2],[0,1.2,0],46);window.NO_EARTH=1;const Y=3.2;const svRE=RE_EARTH;RE_EARTH=500;
  drawBlock(t,{y:0,dense:0.5});
  drawBlock(t,{y:Y,ghost:true,dense:0.6,a:1.6+0.8*clamp(lt/3),pcol:[255,200,120]});
  g.globalCompositeOperation='lighter';
  for(const a of AG){const w=BLK.w[a.w];const pts=[];for(let k=0;k<26;k++){const [x,z]=walkerXZ(w,t-k*0.12,a.sp*2.2,a.ph);pts.push(proj([x,a.k===1?0.35:0.03,z]))}
    g.strokeStyle=rgba(C_OR,0.7);g.lineWidth=0.8;g.beginPath();let on=0;for(const p of pts){if(!p){on=0;continue}on?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]);on=1}g.stroke();
    if(pts[0]){g.fillStyle=rgba(C_OR2,0.95);g.fillRect(pts[0][0]-2,pts[0][1]-2,4,4)}}
  // reality goes up into the state map (white); the model's next step comes down (orange) — faster as loops accumulate
  const sp=0.5+lt*0.12;for(let i=0;i<AG.length;i++){const a=AG[i];const [x,z]=walkerXZ(BLK.w[a.w],t,a.sp*2.2,a.ph);
    for(let k=0;k<14;k++){const up=k%2===0;const u=((t*sp+k/14+i*0.07)%1);const y=up?lerp(0.05,Y,u):lerp(Y,0.05,u);const p=proj([x+(up?-0.03:0.03),y,z]);if(!p)continue;const s=5;g.fillStyle=up?`rgba(226,234,244,${0.75*Math.sin(u*Math.PI)})`:rgba(C_OR,0.85*Math.sin(u*Math.PI));g.fillRect(p[0]-s/2,p[1]-s/2,s,s)}
    {const a0=proj([x,0.05,z]),a1=proj([x,Y,z]);if(a0&&a1){g.strokeStyle='rgba(220,226,236,0.16)';g.lineWidth=1;g.beginPath();g.moveTo(a0[0],a0[1]);g.lineTo(a1[0],a1[1]);g.stroke()}}
    const q=proj([x,Y,z]);if(q){g.fillStyle=rgba(C_OR2,0.6);g.fillRect(q[0]-1.5,q[1]-1.5,3,3)}}
  g.globalCompositeOperation='source-over';RE_EARTH=svRE;window.NO_EARTH=0;vignette()};
