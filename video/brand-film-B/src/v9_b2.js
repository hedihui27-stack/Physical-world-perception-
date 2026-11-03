// ===== 第九版 · 第 2 批：四要素 / 成本 / 文字与状态 / 景区 / 散场 / 回流 / 账本 / 训练（S15–S23）=====
function glass(x,y,w,h,a=1,col=C_OR){g.save();g.globalAlpha=a;g.fillStyle='rgba(16,17,21,0.86)';g.beginPath();g.roundRect(x,y,w,h,14);g.fill();g.strokeStyle=rgba(col,0.75);g.lineWidth=1.5;g.stroke();g.restore()}
const P3=(p)=>proj(p);
// ---------------------------------------------------------------- S15 · 每一条信息都带着四个要素（92.0–98.4）
// one judgment unit (the orange cube from S11) lands over the crossing and opens into its four parts, each on its word
function shotFourEl(t){const u=t-92.0;v9init();bg();const k=ease(clamp(u/6.4));
  setCam([HX+lerp(1.6,1.25,k),lerp(1.35,1.1,k),HZ+lerp(2.2,1.75,k)],[HX,0.5,HZ],50);drawBlock(t,{dense:0.9});
  const land=ease(clamp(u/1.3));const C=[HX,lerp(2.6,0.55,land),HZ];const s=lerp(0.03,0.085,ease(clamp((u-0.9)/0.8)));
  // trail from above
  g.globalCompositeOperation='lighter';if(land<1){const p0=proj([HX-0.6,3.2,HZ-1.2]),p1=proj(C);if(p0&&p1){const gg=g.createLinearGradient(p0[0],p0[1],p1[0],p1[1]);gg.addColorStop(0,'rgba(255,170,60,0)');gg.addColorStop(1,'rgba(255,190,90,0.8)');g.strokeStyle=gg;g.lineWidth=3;g.beginPath();g.moveTo(p0[0],p0[1]);g.lineTo(p1[0],p1[1]);g.stroke()}}
  const pc=proj(C);if(pc)glowDot(pc,160,C_OR,0.45*land);g.globalCompositeOperation='source-over';cube3(C,s,[226,150,62],1,C_OR2);
  if(!pc){vignette();return}
  // the four parts, each appearing on its word (何时 94.65 · 何地 95.46 · 何事 96.22 · 置信度 96.96)
  const T=[2.55,3.4,4.15,4.9];const W2=400,H2=250;const pos=[[pc[0]-W2-200,pc[1]-H2-90],[pc[0]+200,pc[1]-H2-90],[pc[0]-W2-200,pc[1]+80],[pc[0]+200,pc[1]+80]];
  const intro=clamp((u-1.4)/0.5);if(intro>0&&u<2.6)text('四个要素',pc[0],pc[1]-150,40,rgba(C_OR2,intro*(1-clamp((u-2.3)/0.3))),'center',700,8);
  for(let i=0;i<4;i++){const a=ease(clamp((u-T[i])/0.45));if(a<=0)continue;const [x,y]=pos[i];const ox=(1-a)*(pc[0]-x-W2/2)*0.6,oy=(1-a)*(pc[1]-y-H2/2)*0.6;const X=x+ox,Y=y+oy;
    // connector
    g.strokeStyle=rgba(C_OR,0.6*a);g.lineWidth=1.5;g.beginPath();g.moveTo(pc[0],pc[1]);g.lineTo(X+(i%2?0:W2),Y+(i<2?H2:0));g.stroke();
    glass(X,Y,W2,H2,a);text(['何时','何地','何事','置信度'][i],X+24,Y+50,36,rgba(C_OR2,a),'left',800,4);g.save();g.globalAlpha=a;
    const cx=X+W2-110,cy=Y+H2/2+10;
    if(i===0){g.strokeStyle='rgba(236,232,222,0.9)';g.lineWidth=3;g.beginPath();g.arc(cx,cy,70,0,7);g.stroke();for(let m=0;m<12;m++){const an=m/12*6.283;g.beginPath();g.moveTo(cx+Math.cos(an)*60,cy+Math.sin(an)*60);g.lineTo(cx+Math.cos(an)*68,cy+Math.sin(an)*68);g.stroke()}
      const sec=(t*6)%60;const hand=(an,l,w,c)=>{g.strokeStyle=c;g.lineWidth=w;g.beginPath();g.moveTo(cx,cy);g.lineTo(cx+Math.cos(an-Math.PI/2)*l,cy+Math.sin(an-Math.PI/2)*l);g.stroke()};hand((9+43/60)/12*6.283,36,5,'#ece6da');hand(43/60*6.283,54,3,'#ece6da');hand(sec/60*6.283,58,1.5,rgba(C_OR2,1));
      text('09:43:'+String(Math.floor(17+u*1)%60).padStart(2,'0'),X+24,Y+H2-40,40,'#f2efe8','left',700,1)}
    if(i===1){if(!V9.satPhoto)V9.satPhoto=buildSatPhoto();g.drawImage(V9.satPhoto,90,60,200,150,cx-90,cy-62,180,135);g.strokeStyle=rgba(C_OR,1);g.lineWidth=1.5;g.strokeRect(cx-90,cy-62,180,135);g.fillStyle=rgba(C_OR2,1);g.beginPath();g.arc(cx,cy-12,10,Math.PI,0);g.lineTo(cx,cy+12);g.closePath();g.fill();
      text('39.93°N',X+24,Y+H2-80,32,'#f2efe8','left',700,1);text('116.41°E',X+24,Y+H2-40,32,'#f2efe8','left',700,1)}
    if(i===2){const r=rng(9);for(let n=0;n<120;n++){const an=r()*6.283,d=Math.abs(r()+r()-1)*60;g.fillStyle=n%9?'rgba(240,232,214,0.9)':rgba(C_OR2,1);g.fillRect(cx+Math.cos(an)*d*1.2-2,cy+Math.sin(an)*d*0.7-2,4,4)}text('人群聚集',X+24,Y+H2-40,40,'#f2efe8','left',700,1)}
    if(i===3){const f=0.93*ease(clamp((u-T[3]-0.2)/0.9));g.strokeStyle='rgba(60,60,66,1)';g.lineWidth=12;g.beginPath();g.arc(cx,cy,64,Math.PI*0.75,Math.PI*2.25);g.stroke();g.strokeStyle=rgba(C_OR2,1);g.beginPath();g.arc(cx,cy,64,Math.PI*0.75,Math.PI*0.75+Math.PI*1.5*f);g.stroke();text(Math.round(f*100)+'%',cx,cy+14,40,'#f2efe8','center',800,1)}
    g.restore()}
  // 3D echoes: a pin on the ground (where), a time axis through the unit (when)
  const ea=clamp((u-T[1])/0.4);if(ea>0){line3([HX,0.02,HZ],C,rgba(C_OR2,0.8*ea),2);g.globalCompositeOperation='lighter';camPool(HX,HZ,0.22,C_OR,0.5*ea);g.globalCompositeOperation='source-over'}
  const ta=clamp((u-T[0])/0.4);if(ta>0)line3([C[0],C[1]-0.5,C[2]],[C[0],C[1]+0.9,C[2]],`rgba(236,232,222,${0.5*ta})`,1.2);
  vignette()}
// ---------------------------------------------------------------- S16 · 分工让城市规模实时推理的成本进入商业可行区间（98.4–104.7）
// pull up from one unit to the district: every source does its own work in place; only the few hard cases go up to the base model
function shotCost(t){const u=t-98.4;v9init();bg();const k=ease(clamp(u/4.0));
  setCam([lerp(HX+1.25,6.5,k),lerp(1.1,7.0,k),lerp(HZ+1.75,8.5,k)],[lerp(HX,0.2,k),lerp(0.5,0.3,k),lerp(HZ,-0.6,k)],lerp(50,44,k));
  drawBlock(t,{dense:lerp(0.9,0.35,k)});
  const top=[0.3,2.3,-0.8];const sp=clamp((u-0.8)/2.2);
  curved(()=>{g.globalCompositeOperation='lighter';const nd=V9.node;for(let i=0;i<nd.length;i+=2){const n=nd[i];if(!n[3])continue;const d=Math.hypot(n[0]-HX,n[2]-HZ);if(d>sp*10)continue;const p=proj(n);if(!p)continue;
      const pulse=Math.pow(0.5+0.5*Math.sin(t*5+n[4]*40),3);const s=clamp(50/p[2],1.5,5);g.fillStyle=rgba(C_OR,0.35+0.6*pulse);g.fillRect(p[0]-s/2,p[1]-s/2,s,s);if(pulse>0.7)glowDot(p,s*3,C_OR,0.3*pulse);
      // hard cases (≈1%) rise to the base model
      if(n[4]<0.03&&u>1.6){const tp=proj(top);const f=((t*0.6+n[4]*30)%1);const q=proj([lerp(n[0],top[0],f),lerp(n[1],top[1],f)+Math.sin(f*Math.PI)*0.6,lerp(n[2],top[2],f)]);if(tp&&q){g.strokeStyle=`rgba(255,220,160,${0.18})`;g.lineWidth=1;g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(tp[0],tp[1]);g.stroke();g.fillStyle=rgba(C_OR2,0.9);g.fillRect(q[0]-2,q[1]-2,4,4)}}}
    g.globalCompositeOperation='source-over'});
  const tp=proj(top);if(tp&&u>1.4){const a=clamp((u-1.4)/0.5);const sv=[MXP,MXS],X0=XC.slice();MXP=0.13;MXS=0.09;XC[0]=top[0];XC[1]=top[1];XC[2]=top[2];try{seeMindMatrix(t,0.55*a,-0.6+u*0.05)}finally{MXP=sv[0];MXS=sv[1];XC[0]=X0[0];XC[1]=X0[1];XC[2]=X0[2]}}
  // cost gauge: one city's real-time inference, falling into the commercially viable band
  const ga=clamp((u-3.4)/0.5);if(ga>0){const X=1640,Y0=170,Y1=900;g.globalAlpha=ga;g.strokeStyle='rgba(214,220,230,0.5)';g.lineWidth=2;g.beginPath();g.moveTo(X,Y0);g.lineTo(X,Y1);g.stroke();
    for(let i=0;i<=8;i++){const y=lerp(Y0,Y1,i/8);g.beginPath();g.moveTo(X-10,y);g.lineTo(X,y);g.stroke()}const b0=lerp(Y0,Y1,0.72),b1=lerp(Y0,Y1,0.9);g.fillStyle=rgba(C_OR,0.28);g.fillRect(X-26,b0,52,b1-b0);g.strokeStyle=rgba(C_OR2,0.9);g.strokeRect(X-26,b0,52,b1-b0);
    text('商业可行区间',X-44,(b0+b1)/2+12,38,rgba(C_OR2,1),'right',700,2);text('城市规模 · 实时推理成本',X+24,Y0-34,32,'rgba(236,238,242,0.85)','right',600,2);
    const m=ease(clamp((u-3.7)/1.6));const my=lerp(Y0+20,(b0+b1)/2,m);g.fillStyle=rgba(m>0.98?C_OR2:[240,240,244],1);g.beginPath();g.moveTo(X+30,my);g.lineTo(X+56,my-14);g.lineTo(X+56,my+14);g.closePath();g.fill();g.globalAlpha=1}
  vignette()}
// ---------------------------------------------------------------- S17 · 大语言模型建模的是文字；SeeMind 建模的是物理世界的状态（104.7–110.6）
const TOKCH='的是在了不有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少图山统接知较将组见计别她手角期根论运农指几九区强放决西被干做必战先回则任取据处府研队'.split('');
function shotTextState(t){const u=t-104.7;v9init();bg();const B=sstep(2.6,3.6,u);
  // camera glides low over an endless page of text, then rises as the page falls away and the city's state shows
  const k=ease(clamp(u/5.9));setCam([lerp(-1.5,4.2,k),lerp(1.2,4.6,B),lerp(4.5,5.6,k)],[lerp(0.8,0.4,k),lerp(0.2,0.1,B),lerp(-1.0,-1.0,k)],52);
  if(B>0){drawBlock(t,{dense:0.6,a:B});
    // state of the physical world: every block cell carries a living state — people, flow, occupancy — changing over time
    curved(()=>{g.globalCompositeOperation='lighter';const N=34,M2=28;for(let i=0;i<N;i++)for(let j=0;j<M2;j++){const x=-4.4+(i+0.5)*8.8/N,z=-3.6+(j+0.5)*7.2/M2;const v=0.5+0.5*Math.sin(x*1.3+t*0.8)*Math.cos(z*1.1-t*0.6)+0.25*Math.sin((x+z)*3+t*1.4);const kk=clamp(v);if(kk<0.35)continue;
      const p=proj([x,0.03,z]);if(!p)continue;const col=kk>0.8?C_OR:kk>0.6?[236,190,120]:[180,190,206];const r=clamp(220/p[2],4,26)*kk;glowDot(p,r,col,0.35*B*kk)}
      g.globalCompositeOperation='source-over'});
    const la=clamp((u-3.9)/0.5);if(la>0)text('物理世界的状态',960,150,52,rgba(C_OR2,la),'center',800,10)}
  const A=1-B;if(A>0){const y0=lerp(0.3,-1.6,ease(clamp((u-2.6)/1.4)));const r=rng(17);
    for(let i=0;i<60;i++)for(let j=0;j<44;j++){const x=-6+i*0.2,z=-6+j*0.22;const ch=TOKCH[Math.floor(r()*TOKCH.length)];const q=proj([x,y0+(A<1?(r()-0.5)*(1-A)*2:0),z]);if(!q||q[2]<0.3)continue;
      const lead=((i+j*60)-Math.floor(t*40))%173===0;const fs=clamp(260/q[2],6,40);if(fs<6.5)continue;g.font=`500 ${fs}px ${FONT}`;g.textAlign='center';const hot=Math.abs(((i*7+j*13+Math.floor(t*12))%97))<2;
      g.fillStyle=hot?rgba(C_OR2,0.95*A):`rgba(214,214,222,${(0.25+0.3*r())*A})`;g.fillText(ch,q[0],q[1])}
    const la=clamp((u-0.4)/0.5)*(1-clamp((u-2.4)/0.4));if(la>0)text('文字',960,150,52,`rgba(236,238,242,${la})`,'center',800,10)}
  vignette()}
// ---------------------------------------------------------------- S19 · 景区：此刻与半小时后的预测并排呈现（119.2–126.4）
function njTerrain(t,heatK){if(!NJ7)buildNJ7();const S=NJ.scenic;const key=norm([-0.5,0.75,0.45]);const Q=NJ7.Q.map(q=>[Math.hypot(...sub(q.c,M.p)),q]).sort((a,b)=>b[0]-a[0]);
  for(const [d,q] of Q){const P=q.v.map(proj);if(P.some(x=>!x))continue;const lit=0.35+0.65*Math.max(0,dot(q.n,key));let col=NJ_RAMP(q.hm).map(v=>v*(0.5+0.6*lit));const rr=Math.hypot((q.c[0]-S[0])/1.4,(q.c[2]-S[1])/0.9);const heat=Math.exp(-rr*rr/2.2)*heatK;col=col.map((v,i)=>lerp(v,[120,62,14][i],heat*0.7));
    g.fillStyle=rgba(col,1);g.beginPath();P.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill();const lv=Math.floor(q.v[0][1]/0.12);if(q.v.some(v=>Math.floor(v[1]/0.12)!==lv)){g.strokeStyle=heat>0.25?rgba(C_OR2,0.35*heat):'rgba(140,175,170,0.16)';g.lineWidth=0.5;g.beginPath();g.moveTo(P[0][0],P[0][1]);g.lineTo(P[2][0],P[2][1]);g.stroke()}}
  drawBlds(NJ7.B,{hs:1.8,edgeD:6,col:(x,z,hm)=>R.altitude(lerp(1500,6500,clamp((hm-3)/120))).map(v=>v*0.8)})}
function shotScenic(t){const u=t-119.2;bg();const S=NJ?NJ.scenic:[10.14,-0.56];const k=ease(clamp(u/7.2));
  setCam([lerp(5.0,5.8,k),lerp(1.6,1.45,k),lerp(6.2,5.4,k)],[lerp(8.2,8.6,k),0.35,lerp(-0.8,-0.9,k)],44);njTerrain(t,0.4);
  // on the ground: where the numbers come from — the paths' crowd, the car parks, the gate queue
  g.globalCompositeOperation='lighter';const r2=rng(21);for(let i=0;i<700;i++){const a=r2()*6.283,rr=Math.pow(r2(),0.8)*2.4;const x=S[0]+Math.cos(a)*rr*1.4,z=S[1]+Math.sin(a)*rr*0.9;const dens=Math.exp(-rr*rr/2.6);const p=proj([x,njH(x,z)+0.02,z]);if(!p)continue;g.fillStyle=rgba(dens>0.6?C_OR2:C_OR,0.55*dens);const s=clamp(10/p[2],1,2.6);g.fillRect(p[0]-s/2,p[1]-s/2,s,s)}g.globalCompositeOperation='source-over';
  const lots=[[S[0]-2.6,S[1]+1.4,0.82],[S[0]-1.6,S[1]+2.0,0.95],[S[0]+0.4,S[1]+1.9,0.6]];lots.forEach(([x,z,f],i)=>{const p=proj([x,njH(x,z)+0.05,z]);if(!p)return;const a=clamp((u-2.2)/0.4);if(a<=0)return;g.strokeStyle='rgba(60,60,66,1)';g.lineWidth=6;g.beginPath();g.arc(p[0],p[1],26,0,7);g.stroke();g.strokeStyle=rgba(f>0.9?C_OR:C_OR2,a);g.beginPath();g.arc(p[0],p[1],26,-Math.PI/2,-Math.PI/2+6.283*f*a);g.stroke();text('P',p[0],p[1]+9,24,`rgba(240,240,244,${a})`,'center',800)});
  const gate=[S[0]-1.0,S[1]+1.1];{const a=clamp((u-3.3)/0.4);if(a>0)for(let i=0;i<26;i++){const p=proj([gate[0]-i*0.05,njH(gate[0],gate[1])+0.02,gate[1]+i*0.035]);if(p){g.fillStyle=rgba(C_OR2,a*(1-i/30));g.fillRect(p[0]-2.5,p[1]-2.5,5,5)}}}
  // the product view: now and +30 min side by side
  const X=1080,Y=170,Wp=760,Hp=600;const pa=clamp((u-0.3)/0.5);if(pa>0){glass(X,Y,Wp,Hp,pa);g.globalAlpha=pa;text('景区实时 · 预测',X+36,Y+62,36,'#f2efe8','left',800,4);
    text('此刻',X+390,Y+130,28,'rgba(214,220,230,0.8)','center',700,4);text('30 分钟后',X+620,Y+130,28,rgba(C_OR2,1),'center',700,4);g.strokeStyle='rgba(214,220,230,0.18)';g.lineWidth=1;g.beginPath();g.moveTo(X+30,Y+150);g.lineTo(X+Wp-30,Y+150);g.stroke();
    const rows=[['人流量','1,820','2,460','↑',0.95],['剩余车位','126','38','↓',2.3],['排队时长','12 分钟','25 分钟','↑',3.4]];
    rows.forEach(([nm,a1,a2,ar,ts],i)=>{const a=ease(clamp((u-ts)/0.5));if(a<=0)return;const y=Y+230+i*130;g.globalAlpha=pa*a;text(nm,X+40,y,34,'#f2efe8','left',700,2);text(a1,X+390,y,46,'#f2efe8','center',800,1);
      const b=ease(clamp((u-4.4)/0.6));if(b>0){g.globalAlpha=pa*a*b;text(a2,X+600,y,46,rgba(C_OR2,1),'center',800,1);text(ar,X+700,y,40,rgba(C_OR,1),'center',800)}
      g.globalAlpha=pa*a*0.6;g.strokeStyle='rgba(214,220,230,0.25)';g.beginPath();g.moveTo(X+30,y+40);g.lineTo(X+Wp-30,y+40);g.stroke();
      // tiny trend: past (solid) → forecast (dashed)
      g.globalAlpha=pa*a;const sx=X+40,sy=y+30,sw=220;g.strokeStyle='rgba(214,220,230,0.6)';g.lineWidth=1.5;g.beginPath();for(let q=0;q<=20;q++){const yy=sy-6-Math.sin(q*0.4+i)*5-q*0.4*(i===1?-1:1);q?g.lineTo(sx+q*sw/40,yy):g.moveTo(sx,yy)}g.stroke()});
    g.globalAlpha=1}
  vignette()}
// ---------------------------------------------------------------- S20 · 演出散场：高峰被预见，运力提前就位；预测驱动行动（126.4–134.5）
const VEN={x:0,z:0,rx:0.95,rz:0.7};const GATE=[0.0,0.92];
function venueDraw(t,tm,outflow){// a lit bowl: tiers, roof ring, crowd in the stands
  const r=rng(8);const tiers=[[1.0,0.05],[0.93,0.16],[0.86,0.27],[0.8,0.36]];
  for(const [s,y] of tiers){const P=[];for(let i=0;i<=64;i++){const a=i/64*6.283;P.push(proj([VEN.x+Math.cos(a)*VEN.rx*s,y,VEN.z+Math.sin(a)*VEN.rz*s]))}if(P.some(p=>!p))continue;g.strokeStyle='rgba(214,206,190,0.55)';g.lineWidth=1.3;g.beginPath();P.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke()}
  // outer wall
  for(let i=0;i<64;i++){const a=i/64*6.283,b=(i+1)/64*6.283;const Q=[[Math.cos(a),0,Math.sin(a)],[Math.cos(b),0,Math.sin(b)],[Math.cos(b),0.36,Math.sin(b)],[Math.cos(a),0.36,Math.sin(a)]].map(([c,y,s])=>proj([VEN.x+c*VEN.rx*(y?0.8:1.0),y?0.36:0.0,VEN.z+s*VEN.rz*(y?0.8:1.0)]));const n=Math.sin((a+b)/2);if(n<-0.1)continue;poly2(Q,`rgba(40,38,36,${0.5})`,null)}
  // field
  const F=[];for(let i=0;i<=40;i++){const a=i/40*6.283;F.push(proj([VEN.x+Math.cos(a)*VEN.rx*0.45,0.04,VEN.z+Math.sin(a)*VEN.rz*0.45]))}poly2(F,'rgba(60,70,58,0.7)',null);
  g.globalCompositeOperation='lighter';const keep=1-outflow;for(let i=0;i<1600;i++){const a=r()*6.283,s=0.5+r()*0.45;if(r()>keep)continue;const y=lerp(0.05,0.34,(s-0.5)/0.45);const p=proj([VEN.x+Math.cos(a)*VEN.rx*s,y+0.01,VEN.z+Math.sin(a)*VEN.rz*s]);if(!p)continue;g.fillStyle=`rgba(246,232,206,${0.7})`;const z=clamp(9/p[2],1,2.4);g.fillRect(p[0],p[1],z,z)}
  // roof ring light
  const R2=[];for(let i=0;i<=80;i++){const a=i/80*6.283;R2.push(proj([VEN.x+Math.cos(a)*VEN.rx*1.04,0.42,VEN.z+Math.sin(a)*VEN.rz*1.04]))}if(R2.every(p=>p)){g.strokeStyle=rgba(C_OR2,0.6);g.lineWidth=2.5;g.beginPath();R2.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke()}
  g.globalCompositeOperation='source-over'}
function venueGround(){// plaza and roads around the venue (drawn, not the real city)
  const pz=[];for(let i=0;i<=48;i++){const a=i/48*6.283;pz.push(proj([Math.cos(a)*1.45,0.005,Math.sin(a)*1.15]))}poly2(pz,'rgba(30,30,32,0.95)','rgba(120,116,108,0.4)',1);
  for(const [a,b] of [[[-4,0,1.6],[4,0,1.6]],[[-4,0,-1.5],[4,0,-1.5]],[[-1.9,0,-4],[-1.9,0,4]],[[1.9,0,-4],[1.9,0,4]],[[0,0,1.15],[0,0,1.6]]]){line3(a,b,'rgba(70,70,74,1)',10);line3(a,b,'rgba(150,146,136,0.35)',1)}}
const BAYS=[-0.7,-0.42,-0.14,0.14,0.42,0.7];
function shotVenue(t){const u=t-126.4;bg();const k=ease(clamp(u/8.1));
  setCam([lerp(-2.6,-1.6,k),lerp(2.6,2.1,k),lerp(4.4,3.8,k)],[lerp(0.1,0.0,k),0.1,lerp(0.5,0.6,k)],46);
  {const sv=window.NO_EARTH;drawBlock(t,{ox:0,oz:-5.6,dense:0.25,noNbr:1});}
  venueGround();
  const clock=lerp(21*60+5,21*60+40,sstep(6.0,7.2,u));const outflow=sstep(6.4,8.0,u);venueDraw(t,clock,outflow);
  // predicted peak at the exit gate: a column that grows ahead of time
  const pk=ease(clamp((u-1.8)/1.2));if(pk>0){const G=[GATE[0],0,GATE[1]];g.globalCompositeOperation='lighter';for(let i=0;i<20;i++){const y=i*0.05*pk*1.2;const P=[];for(let j=0;j<=24;j++){const a=j/24*6.283;P.push(proj([G[0]+Math.cos(a)*0.16,y,G[2]+Math.sin(a)*0.1]))}if(P.every(p=>p)){g.strokeStyle=rgba(C_OR,0.35*(1-i/22)*(1-outflow*0.7));g.lineWidth=1.2;g.beginPath();P.forEach((p,m)=>m?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke()}}g.globalCompositeOperation='source-over';
    const lp=proj([G[0]+0.2,1.2*pk,G[2]]);if(lp&&u>3.0)text('出口客流高峰 · 预计 21:40',lp[0]+10,lp[1],30,rgba(C_OR2,clamp((u-3.0)/0.4)),'left',700,2)}
  // vehicles: dispatched early, arriving in the bays before the peak
  const vk=clamp((u-4.2)/1.6);BAYS.forEach((bx,i)=>{const arrive=ease(clamp(vk*1.3-i*0.06));if(arrive<=0)return;const path=[[-4+i*0.2,0,1.6],[bx,0,1.6],[bx,0,1.32]];const f=arrive;const p0=f<0.75?[lerp(path[0][0],path[1][0],f/0.75),0.03,1.6]:[bx,0.03,lerp(1.6,1.32,(f-0.75)/0.25)];
    const leave=sstep(7.2,8.0,u);const p=[p0[0]+leave*4,0.03,leave>0?1.6:p0[2]];const along=(f<0.75||leave>0);const L2=0.11,W2=0.04,Hh=0.05;const c=[p[0],0.0,p[2]];const ex=along?[L2,0,0]:[0,0,L2],ez=along?[0,0,W2]:[W2,0,0];const cn=(sx,sy,sz)=>proj([c[0]+ex[0]*sx+ez[0]*sz,sy,c[2]+ex[2]*sx+ez[2]*sz]);const q=proj([c[0],0.05,c[2]]);
    poly2([cn(-1,0,1),cn(1,0,1),cn(1,Hh,1),cn(-1,Hh,1)],'rgba(120,70,20,0.95)',null);poly2([cn(1,0,-1),cn(1,0,1),cn(1,Hh,1),cn(1,Hh,-1)],'rgba(150,90,30,0.95)',null);poly2([cn(-1,Hh,-1),cn(1,Hh,-1),cn(1,Hh,1),cn(-1,Hh,1)],rgba(C_OR,1),rgba(C_OR2,1),1);if(q){g.globalCompositeOperation='lighter';glowDot(q,30,C_OR,0.35);g.globalCompositeOperation='source-over'}});
  // crowd leaving the gate into the vehicles
  if(outflow>0){g.globalCompositeOperation='lighter';const r=rng(77);for(let i=0;i<500;i++){const f=((r()+t*0.4)%1);if(r()>outflow)continue;const bx=BAYS[Math.floor(r()*6)];const x=lerp(GATE[0]+(r()-.5)*0.2,bx,f),z=lerp(GATE[1],1.32,f);const p=proj([x,0.02,z]);if(p){g.fillStyle='rgba(246,232,206,0.8)';g.fillRect(p[0]-1.5,p[1]-1.5,3,3)}}g.globalCompositeOperation='source-over'}
  // forecast panel: exit flow vs capacity
  const pa=clamp((u-1.6)/0.5)*(1-clamp((u-6.1)/0.5));if(pa>0){const X=70,Y=70,Wp=640,Hp=310;glass(X,Y,Wp,Hp,pa);g.globalAlpha=pa;const cx0=X+50,cx1=X+Wp-40,cy0=Y+Hp-60,ch=190;const px=m=>cx0+(cx1-cx0)*(m-20*60)/(120),py=v=>cy0-ch*v;
    text('出口客流 · 预测',X+30,Y+46,28,'#f2efe8','left',700,3);['20:00','20:30','21:00','21:30','22:00'].forEach((s,i)=>text(s,px(20*60+i*30),cy0+34,20,'rgba(214,220,230,0.6)','center',500));
    const flow=m=>Math.exp(-(((m-(21*60+40))/9)**2));g.setLineDash([6,6]);g.strokeStyle=rgba(C_OR2,1);g.lineWidth=3;g.beginPath();for(let m=20*60;m<=22*60;m+=1){const x=px(m),y=py(flow(m)*0.95);m===1200?g.moveTo(x,y):g.lineTo(x,y)}g.stroke();g.setLineDash([]);
    const capA=clamp((u-4.2)/1.6);if(capA>0){g.fillStyle=rgba(C_OR,0.25);const yc=py(0.95*capA);g.fillRect(px(21*60+20),yc,px(22*60)-px(21*60+20),cy0-yc);text('运力就位',px(21*60+22),yc-10,22,rgba(C_OR,1),'left',700,2)}
    const nx=px(clock);g.strokeStyle='rgba(240,240,244,0.9)';g.lineWidth=2;g.beginPath();g.moveTo(nx,cy0);g.lineTo(nx,cy0-ch-10);g.stroke();text('此刻 '+Math.floor(clock/60)+':'+String(Math.floor(clock%60)).padStart(2,'0'),nx,cy0-ch-20,22,'#f2efe8','center',700,1);g.globalAlpha=1}
  const da=clamp((u-6.2)/0.4);if(da>0)text('预测，驱动行动',80,1000,52,rgba(C_OR2,da),'left',800,6);
  vignette()}
// ---------------------------------------------------------------- S21 · 每一次行动的结果都回到模型（134.5–137.6）
function shotReturn(t){const u=t-134.5;bg();const k=ease(clamp(u/3.1));
  setCam([lerp(-1.6,-3.0,k),lerp(2.1,2.6,k),lerp(3.8,6.0,k)],[0,lerp(0.3,1.6,k),lerp(0.6,0.2,k)],48);drawBlock(t,{ox:0,oz:-5.6,dense:0.25,noNbr:1});venueGround();venueDraw(t,0,1);
  const sv=[MXP,MXS];MXP=0.13;MXS=0.09;const ca=clamp(u/0.6);try{seeMindMatrix(t,0.55*ca,-0.5+u*0.08)}finally{MXP=sv[0];MXS=sv[1]}
  // results rise: each outcome a packet travelling up to the model
  g.globalCompositeOperation='lighter';const r=rng(5);const top=XC;for(let i=0;i<240;i++){const sx=lerp(-1.2,1.2,r()),sz=lerp(1.2,1.7,r());const f=((u*0.45+r())%1);if(f>u*0.6+0.1)continue;
    const p=[lerp(sx,top[0]+(r()-.5)*0.6,f),lerp(0.05,top[1]-0.4,f)+Math.sin(f*Math.PI)*0.5,lerp(sz,top[2]+(r()-.5)*0.6,f)];const q=proj(p);if(!q)continue;const s=clamp(60/q[2],2,6);g.fillStyle=rgba(r()<0.8?C_OR2:[230,236,244],0.9*Math.sin(f*Math.PI));g.fillRect(q[0]-s/2,q[1]-s/2,s,s)}
  g.globalCompositeOperation='source-over';vignette()}
// ---------------------------------------------------------------- S22 · 成功或失败都被记录；现实给出的答案，模型无法改写（137.6–142.9）
function shotLedger(t){const u=t-137.6;bg();const k=ease(clamp(u/5.3));setCam([lerp(-1.0,0.6,k),lerp(2.2,1.6,k),lerp(4.2,3.4,k)],[0,0,lerp(-1.0,-0.8,k)],48);
  const N=11,Mr=16,w=0.5,d=0.36;const lockA=sstep(2.4,3.0,u),tryA=clamp((u-3.4)/1.6);
  const r0=rng(3);const rec=[];for(let i=0;i<N;i++)for(let j=0;j<Mr;j++){const pv=0.25+r0()*0.6,av=clamp(pv+(r0()<0.72?(r0()-.5)*0.08:(r0()-.5)*0.6),0.08,0.95);rec.push([i,j,pv,av,Math.abs(av-pv)<0.06,r0()])}
  const scroll=u*0.55;rec.sort((a,b)=>(b[1]-a[1]));
  for(const [i,j,pv,av,hit,rr] of rec){const x=(i-(N-1)/2)*w,z=-j*d+scroll%d+1.2;if(z>2.0||z<-5)continue;const st=((j+i*0.37)*0.11);const sa=clamp((u-st)/0.25);if(sa<=0)continue;
    const fa=clamp((z+5)/1.5)*clamp((2.0-z)/0.4);const base=[[x-w*0.44,0,z-d*0.42],[x+w*0.44,0,z-d*0.42],[x+w*0.44,0,z+d*0.42],[x-w*0.44,0,z+d*0.42]].map(proj);poly2(base,`rgba(22,22,26,${0.9*fa})`,`rgba(120,116,108,${0.4*fa})`,1);
    // actual (reality): a solid bar; locks when reality speaks
    const bx=x-0.07,bw=0.045,h=av*0.42;const fr=[[bx-bw,0,z],[bx+bw,0,z],[bx+bw,h,z],[bx-bw,h,z]].map(proj);poly2(fr,rgba(lockA>0?[lerp(150,230,lockA),lerp(146,150,lockA),lerp(138,70,lockA)]:[150,146,138],(0.55+0.3*lockA)*fa*sa),lockA>0?rgba(C_OR2,lockA*fa):null,1.5);
    // predicted: an outline bar; it tries to pull reality toward itself — and cannot
    const px=x+0.05,ph=pv*0.42;const nud=tryA>0&&!hit?Math.sin(tryA*Math.PI*3)*0.03*(1-tryA):0;const pr=[[px-bw,0,z],[px+bw,0,z],[px+bw,ph+nud,z],[px-bw,ph+nud,z]].map(proj);poly2(pr,null,`rgba(236,238,242,${0.8*fa*sa})`,1.4);
    // verdict stamp
    const m=proj([x+0.18,0.02,z]);if(m){const ma=sa*fa*clamp((u-st-0.15)/0.2);if(hit){g.strokeStyle=rgba(C_OR2,ma);g.lineWidth=4;g.beginPath();g.moveTo(m[0]-11,m[1]);g.lineTo(m[0]-3,m[1]+9);g.lineTo(m[0]+12,m[1]-11);g.stroke()}else{g.strokeStyle=`rgba(236,238,242,${ma})`;g.lineWidth=4;g.beginPath();g.moveTo(m[0]-9,m[1]-9);g.lineTo(m[0]+9,m[1]+9);g.moveTo(m[0]+9,m[1]-9);g.lineTo(m[0]-9,m[1]+9);g.stroke()}}}
  const l1=clamp((u-0.2)/0.4)*(1-clamp((u-2.2)/0.3));if(l1>0){text('✓ 命中',140,150,40,rgba(C_OR2,l1),'left',800,4);text('✕ 偏差',340,150,40,`rgba(236,238,242,${l1})`,'left',800,4);text('都被记录',540,150,40,`rgba(236,238,242,${l1})`,'left',600,4)}
  if(lockA>0){text('现实给出的答案',140,150,44,rgba(C_OR2,lockA),'left',800,4);const la=clamp((u-3.4)/0.4);if(la>0)text('模型无法改写',140,210,36,`rgba(236,238,242,${la})`,'left',700,4)}
  vignette()}
// ---------------------------------------------------------------- S23 · 每一件真实发生的事都成为下一次训练的素材（142.9–148.2）
function shotTrain(t){const u=t-142.9;v9init();bg();const k=ease(clamp(u/5.3));
  setCam([lerp(7.5,5.2,k),lerp(4.2,4.8,k),lerp(8.5,8.0,k)],[0.2,lerp(1.2,2.0,k),-0.4],52);drawBlock(t,{dense:0.4});
  const sv=[MXP,MXS];MXP=0.24;MXS=0.17;const C=[0,3.4,0];const XC0=XC.slice();XC[0]=C[0];XC[1]=C[1];XC[2]=C[2];try{seeMindMatrix(t,0.55*clamp(u/0.8),-0.4+u*0.06)}finally{MXP=sv[0];MXS=sv[1];XC[0]=XC0[0];XC[1]=XC0[1];XC[2]=XC0[2]}
  // events flash all over the district; each becomes a record that rises, spiralling into the model
  g.globalCompositeOperation='lighter';const r=rng(42);curved(()=>{for(let i=0;i<700;i++){const x=(r()-.5)*8.4,z=(r()-.5)*6.8,ph=r(),kind=r();const tt=((u*0.5+ph)%1.4);const p=proj([x,0.04,z]);if(!p)continue;const flash=Math.exp(-tt*6);if(flash>0.05)glowDot(p,clamp(260/p[2],8,30),kind<0.7?C_OR:[226,232,240],0.6*flash);
    const f=clamp((tt-0.05)/1.2);if(f>0&&f<1){const an=f*4+ph*6.283;const rad=lerp(0.1,1.2,Math.sin(f*Math.PI));const q=proj([lerp(x,C[0],f)+Math.cos(an)*rad*f,lerp(0.05,C[1],f*f),lerp(z,C[2],f)+Math.sin(an)*rad*f]);if(q){const s=clamp(90/q[2],2.5,6);g.fillStyle=rgba(kind<0.7?C_OR2:[230,236,244],0.95*Math.sin(f*Math.PI));g.fillRect(q[0]-s/2,q[1]-s/2,s,s)}}}});
  g.globalCompositeOperation='source-over';vignette()}
