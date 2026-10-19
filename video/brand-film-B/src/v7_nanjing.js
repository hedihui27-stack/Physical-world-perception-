// ===== 第七版 · 南京：钟山改成暗色地形 + 细等高线，人流热度直接染在山体上（不再堆白色粒子） =====
let NJ7=null;
function buildNJ7(){const S=0.16;const Q=[];for(let x=3.5;x<15.5;x+=S)for(let z=-5.6;z<3.2;z+=S){const v=[[x,njH(x,z),z],[x+S,njH(x+S,z),z],[x+S,njH(x+S,z+S),z+S],[x,njH(x,z+S),z+S]];const hm=(v[0][1]+v[1][1]+v[2][1]+v[3][1])/4;if(hm<0.002)continue;const n=norm([v[0][1]-v[1][1],S,v[0][1]-v[3][1]]);Q.push({v,n,hm,c:[x+S/2,hm,z+S/2]})}
  const B=(NJ?NJ.b:[]).filter(b=>njH(b[0],b[1])<0.05);NJ7={Q,B}}
const NJ_RAMP=ramp([[0,'#0c0e0f'],[0.4,'#121614'],[1.0,'#191e19'],[1.8,'#20261f']]);
shotNanjing=function(t){bg();if(!NJ7)buildNJ7();const lt=LT(t);const S=NJ?NJ.scenic:[10.14,-0.56];
  const k=ease(clamp(lt/5.4));const cp=[lerp(2.4,3.6,k),lerp(1.15,0.95,k),lerp(9.6,8.2,k)];setCam(cp,[lerp(9.6,10.2,k),0.55,lerp(-0.6,-1.0,k)],42);
  // dark ground so nothing reads as empty black
  const gq=[[-12,-14],[18,-14],[18,12],[-12,12]].map(([x,z])=>proj([x,0,z]));if(false&&gq.every(p=>p)){g.fillStyle='#141b21';g.beginPath();gq.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill()}
  // Xuanwu lake: dark water between the city and the mountain, catching a faint sheen
  {const P=[];for(let i=0;i<48;i++){const a=i/48*6.283;P.push(proj([3.3+Math.cos(a)*2.9+0.3*Math.sin(a*3),0.002,-0.2+Math.sin(a)*2.5]))}if(P.every(p=>p)){g.fillStyle='#0b0f12';g.beginPath();P.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill();const c=proj([3.3,0,-0.2]);const gg=g.createRadialGradient(c[0],c[1]-40,0,c[0],c[1],520);gg.addColorStop(0,'rgba(120,150,170,0.05)');gg.addColorStop(1,'rgba(120,150,170,0)');g.fillStyle=gg;g.fill()}}
  const grow=ease(clamp((lt-2.0)/1.8));const key=norm([-0.5,0.75,0.45]);
  const Q=NJ7.Q.map(q=>[Math.hypot(...sub(q.c,M.p)),q]).sort((a,b)=>b[0]-a[0]);
  for(const [d,q] of Q){const P=q.v.map(proj);if(P.some(x=>!x))continue;const lit=0.35+0.65*Math.max(0,dot(q.n,key));let col=NJ_RAMP(q.hm).map(v=>v*(0.5+0.6*lit));
    const rr=Math.hypot((q.c[0]-S[0])/1.4,(q.c[2]-S[1])/0.9);const heat=Math.exp(-rr*rr/2.2)*grow;col=col.map((v,i)=>lerp(v,[120,62,14][i],heat*0.7));
    g.fillStyle=rgba(col,1);g.beginPath();P.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill();
    // thin contour lines every 0.12 in height
    const lv=Math.floor(q.v[0][1]/0.12);if(q.v.some(v=>Math.floor(v[1]/0.12)!==lv)){g.strokeStyle=heat>0.25?rgba(C_OR2,0.35*heat):'rgba(140,175,170,0.16)';g.lineWidth=0.5;g.beginPath();g.moveTo(P[0][0],P[0][1]);g.lineTo(P[2][0],P[2][1]);g.stroke()}}
  drawBlds(NJ7.B,{hs:1.8,edgeD:6,col:(x,z,hm)=>R.altitude(lerp(1500,6500,clamp((hm-3)/120))).map(v=>v*0.8)});
  // sparse people-sparks over the hotspot (few, so they stay orange)
  g.globalCompositeOperation='lighter';const r2=rng(21);for(let i=0;i<900;i++){const a=r2()*6.283,rr=Math.pow(r2(),0.8)*2.6;const x=S[0]+Math.cos(a)*rr*1.4,z=S[1]+Math.sin(a)*rr*0.9;const dens=Math.exp(-rr*rr/2.6);const u=(t*0.25+r2())%1;const y=njH(x,z)+0.02+u*0.5*dens*grow;const p=proj([x,y,z]);if(!p)continue;g.fillStyle=rgba(dens>0.6?C_OR2:C_OR,0.5*grow*dens*Math.sin(u*Math.PI));const s=clamp(10/p[2],1,2.6);g.fillRect(p[0]-s/2,p[1]-s/2,s,s)}
  const ph=proj([S[0],njH(S[0],S[1])+0.5,S[1]]);
  const qa=clamp((lt-0.6)/1.6);if(qa>0){const from=[cp[0]+2,0.4,cp[2]-2],to=[S[0],njH(S[0],S[1])+0.3,S[1]];for(let k2=0;k2<80;k2++){const u=Math.min(qa,k2/80);const v=[0,1,2].map(i=>lerp(from[i],to[i],u)+(i===1?Math.sin(u*Math.PI)*1.6:0));const p=proj(v);if(!p)continue;g.fillStyle=`rgba(236,236,230,${0.7*(k2/80)})`;g.fillRect(p[0]-1,p[1]-1,2,2)}}
  g.globalCompositeOperation='source-over';
  const q='钟山景区，现在人多吗？';const n=Math.floor(clamp(lt/1.8)*q.length);g.fillStyle='rgba(18,20,26,0.82)';g.strokeStyle='rgba(236,238,242,0.4)';g.lineWidth=1.2;g.beginPath();g.roundRect(560,900,800,90,45);g.fill();g.stroke();text(q.slice(0,n),960,958,36,'#f4f4f2','center',600,2);
  const aa=clamp((lt-3.6)/0.6);if(aa>0&&ph)text('人流 · 适中',ph[0],ph[1]-40,42,rgba(C_OR2,aa),'center',800,3);
  text('南京 · 玄武区',120,1000,30,'rgba(236,238,242,0.9)','left',600,4);vignette()};
