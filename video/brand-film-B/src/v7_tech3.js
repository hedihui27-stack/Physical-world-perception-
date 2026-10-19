// ===== 第七版 · 技术表述重做（三）：泰山 = 由"知识"构成的山 + 一层"此刻未知"；苏醒 = 同一个地点被搜索、被预测、被行动 =====
const TS_WORDS=['泰山','1545 米','山东泰安','五岳之首','玉皇顶','南天门','十八盘','日出','石刻','岱庙','碧霞祠','云海'];
shotTaishan=function(t){bg();const lt=t-13.3;const az=-0.55+lt*0.045;const d=8.2-1.2*ease(clamp(lt/5.7));setCam([Math.sin(az)*d,3.6,Math.cos(az)*d],[0.2,1.0,-0.3],42);
  // the mountain the language model knows: its shape is made of what has been written about it
  const L=[];for(let x=-4.2;x<=4.2;x+=0.2)for(let z=-3.2;z<=3.0;z+=0.2){const y=ridge(x,z)*1.2;const p=proj([x,y,z]);if(!p)continue;L.push([p[2],x,z,y,p])}L.sort((a,b)=>b[0]-a[0]);
  const app=ease(clamp(lt/1.2));
  for(const [dd,x,z,y,p] of L){const h=Math.sin(x*12.9+z*78.2)*43758.5,r=h-Math.floor(h);const w=TS_WORDS[Math.floor(r*TS_WORDS.length)];const sz=clamp(150/dd,8,20);const hi=y/1.9;if(hi>0.55&&r>0.45)continue;
    const a=app*(0.2+0.32*hi)*clamp((x*0.37+z*0.21+lt*1.6+3)/1.5);if(a<=0.02)continue;g.font=`500 ${sz}px ${FONT}`;g.fillStyle=`rgba(${190+40*hi|0},${180+34*hi|0},${160+30*hi|0},${a})`;g.textAlign='center';g.fillText(w,p[0],p[1])}
  // what it does not know: the state of the sky right now — a layer of noise that never settles
  const ua=clamp((lt-1.6)/0.8);if(ua>0){const Y=1.55;const r=rng(Math.floor(t*12));for(let x=-2.6;x<=2.8;x+=0.16)for(let z=-2.2;z<=1.8;z+=0.16){const rr=Math.hypot(x-0.2,(z+0.3)*1.3);if(rr>2.5)continue;const P=[[x,Y,z],[x+0.15,Y,z],[x+0.15,Y,z+0.15],[x,Y,z+0.15]].map(proj);if(P.some(p=>!p))continue;const v=r();g.fillStyle=`rgba(${150+70*v|0},${156+66*v|0},${166+60*v|0},${ua*(0.14+0.3*v)*(1-rr/2.5)})`;g.beginPath();P.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill()}
    const pq=proj([2.9,Y,-0.2]);if(pq)text('此刻 · 有没有云海？',pq[0]+10,pq[1],32,rgba(C_OR2,ua),'left',700,3)}
  vignette()};
// ---------- 苏醒：同一个路口，被搜索 → 被预测 → 被行动 ----------
let WK=null;
shotWake=function(t){bg();const lt=t-29.1;const az=0.25+lt*0.03;setCam([Math.sin(az)*8.4+0.6,5.4-lt*0.1,Math.cos(az)*8.4-0.6],[0.9,0.6,-0.9],44);
  if(!WK){const r=rng(5);WK={A:[]};for(let i=0;i<70;i++)WK.A.push(BLK.w[Math.floor(r()*BLK.w.length)])}
  drawBlock(t,{y:0,dense:0.35});const P0=[1.0,0,-1.0];const s1=clamp((lt-0.6)/0.6),s2=clamp((lt-3.1)/0.6),s3=clamp((lt-5.8)/0.6);
  // search: a query lands on one place and its present state comes back
  const pc=proj([P0[0],0.02,P0[2]]);g.globalCompositeOperation='lighter';if(s1>0){camPool(P0[0],P0[2],0.55,C_OR,0.35*s1);const pt=proj([P0[0],2.6,P0[2]]);if(pt&&pc){g.strokeStyle=rgba(C_OR2,0.8*s1*(1-s2*0.6));g.lineWidth=2;g.beginPath();g.moveTo(pt[0],pt[1]);g.lineTo(pc[0],lerp(pt[1],pc[1],s1));g.stroke()}}g.globalCompositeOperation='source-over';
  if(s1>0&&pc){text('东四路口 · 此刻',pc[0]-30,pc[1]+56,26,`rgba(236,238,242,${s1})`,'right',600,2);text('人流 312 · 车流 中 · 无事件',pc[0]-30,pc[1]+88,22,rgba(C_OR2,s1),'right',500,2)}
  // predict: the same place stacked into its next hours
  if(s2>0){for(let k=1;k<=3;k++){const y=k*0.7;const a=s2*clamp((lt-3.1-k*0.35)/0.4)*(1-s3*0.5);if(a<=0)continue;const ring=[];for(let i=0;i<=40;i++){const an=i/40*6.283;ring.push(proj([P0[0]+Math.cos(an)*(0.55+k*0.08),y,P0[2]+Math.sin(an)*(0.55+k*0.08)]))}
      g.strokeStyle=rgba(k===2?C_OR2:[200,210,224],0.7*a);g.lineWidth=k===2?2.2:1.2;g.beginPath();ring.forEach((p,i)=>{if(p)i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1])});g.stroke();
      const lp=proj([P0[0]+0.75+k*0.08,y,P0[2]]);if(lp)text(['','+5 分钟','+30 分钟','+1 小时'][k],lp[0]+10,lp[1]+6,22,k===2?rgba(C_OR2,a):`rgba(220,226,236,${a})`,'left',600,2)}}
  // act: a decision goes out, traffic re-routes, and the place's state changes
  if(s3>0){g.globalCompositeOperation='lighter';WK.A.forEach((w,i)=>{const [x,z]=walkerXZ(w,t,0.03,i*0.3);const d=Math.hypot(x-P0[0],z-P0[2]);if(d>2.4)return;const away=s3*clamp(1.2-d/2);const nx=x+(x-P0[0])/(d+0.01)*0.5*away,nz=z+(z-P0[2])/(d+0.01)*0.5*away;const q=proj([nx,0.03,nz]);if(!q)return;g.fillStyle=rgba(C_OR,0.9);g.fillRect(q[0]-2.5,q[1]-2.5,5,5)});
    for(let k=0;k<3;k++){const ph=((lt-5.8)*0.8+k/3)%1;camPool(P0[0],P0[2],0.3+ph*2.2,C_OR,0.22*(1-ph)*s3)}g.globalCompositeOperation='source-over'}
  const lb=[['可搜索',s1*(1-s2)],['可预测',s2*(1-s3)],['可行动',s3]];lb.forEach(([s,a])=>{if(a>0)text(s,120,1000,40,rgba(C_OR2,a),'left',700,8)});
  vignette()};
