// SCENE 4: World State 技术具象化 =================
function sceneState(t,opt={}){
 bg(); setCam([10.5-1.5*ease(CP.k),6.6,13.5-1.2*ease(CP.k)],[0,1.9,-0.6],36);
 const L=(a,b,col,w=1.2)=>{const p=proj(a),q=proj(b);if(!p||!q)return;g.strokeStyle=col;g.lineWidth=w;g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(q[0],q[1]);g.stroke()};
 const plane=(y,col,a,lbl,val,conf)=>{const c=[[-3,y,-3],[3,y,-3],[3,y,3],[-3,y,3]].map(proj);g.fillStyle=`rgba(${col},${a*0.10})`;g.beginPath();c.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill();g.strokeStyle=`rgba(${col},${a*0.6})`;g.lineWidth=1.2;g.stroke();
  // grid
  for(let i=-3;i<=3;i++){L([i,y,-3],[i,y,3],`rgba(${col},${a*0.12})`,1);L([-3,y,i],[3,y,i],`rgba(${col},${a*0.12})`,1)}
  const lp=proj([3.2,y,-3]);text(lbl,lp[0]+10,lp[1]+6,22,`rgba(${col},${a})`,'left',500,2);
  // crowd density surface as bars on this slice (queue / crowd)
  return c};
 // entity: station square with components (taxi, ride-hailing, metro, parking)
 const comps=[[-1.6,-1.2,'出租车候车区'],[1.4,-1.5,'网约车上客点'],[-1.2,1.6,'地铁入口'],[1.8,1.3,'停车场入口']];
 const slices=[[0,'109,215,190','此刻 · 实测',[0.42,0.55,0.30,0.70]],[1.4,'111,201,192','+5 分钟',[0.50,0.62,0.36,0.78]],[2.8,'79,127,184','+30 分钟',[0.78,0.70,0.58,0.92]],[4.2,'58,74,107','+1 小时',[0.60,0.52,0.48,0.81]]];
 for(const [y,col,lbl,vals] of slices){const si=slices.findIndex(s=>s[0]===y);if(CP.k*5<si+0.3)continue;plane(y,col,1,lbl);
  comps.forEach(([x,z,name],i)=>{const v=vals[i];const p0=proj([x,y,z]),p1=proj([x,y+v*1.1,z]);const c=R.density(v);g.strokeStyle=rgba(c,0.95);g.lineWidth=10;g.beginPath();g.moveTo(p0[0],p0[1]);g.lineTo(p1[0],p1[1]);g.stroke();
   // confidence band widens with horizon
   const conf=[0,0.06,0.14,0.22][slices.findIndex(s=>s[0]===y)];if(conf){const pa=proj([x,y+(v-conf)*1.1,z]),pb=proj([x,y+(v+conf)*1.1,z]);g.strokeStyle=rgba(c,0.35);g.lineWidth=22;g.beginPath();g.moveTo(pa[0],pa[1]);g.lineTo(pb[0],pb[1]);g.stroke()}
   if(y===0){const pl=proj([x,y-0.05,z]);text(name,pl[0],pl[1]+30,20,'#93a0ba','center')}})}
 // observation sources feeding in (camera / sensor / internet / satellite) as streams into the "now" slice
 const src=[[-5.5,0.2,-2.5,'摄像头',CAM],[-4.5,0.2,4.5,'传感器','#5fe0b0'],[-2,6.4,-3,'卫星','#ffd45c'],[5.5,0.2,-4,'互联网','#9fe8ff']];
 g.globalCompositeOperation='lighter';
 for(const [x,y,z,name,col] of src){const c=hex(col);const p=proj([x,y,z]);g.fillStyle=rgba(c,1);g.beginPath();g.arc(p[0],p[1],6,0,7);g.fill();text(name,p[0],p[1]-14,20,col,'center',500);
  for(let k=0;k<14;k++){const u=((t*0.35+k/14)%1);const tx=lerp(x,0,u),ty=lerp(y,0.05,u),tz=lerp(z,0,u);const q=proj([tx,ty,tz]);g.fillStyle=rgba(c,0.9*(1-u*0.5));g.fillRect(q[0]-1.5,q[1]-1.5,3,3)}}
 // reality check: the +30 min prediction hits reality later (green tick ring at "now")
 const pr=proj([1.4,0,-1.5]);const kk=(t*0.5)%1;g.strokeStyle=`rgba(95,224,176,${1-kk})`;g.lineWidth=2;g.beginPath();g.ellipse(pr[0],pr[1],10+kk*40,(10+kk*40)*0.45,0,0,7);g.stroke();
 g.globalCompositeOperation='source-over';
 const tl=proj([-3,0,-3]);
 vignette();
}
