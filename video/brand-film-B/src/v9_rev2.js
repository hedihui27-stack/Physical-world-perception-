// ===== 第九版 · 第 2 批修改 + 沿用镜头重新卡时间 =====
// ---------- 沿用镜头：新时间 → 旧时间 的分段映射，词点对齐新解说
function remap(pts,t){if(t<=pts[0][0])return pts[0][1]+(t-pts[0][0]);for(let i=1;i<pts.length;i++)if(t<=pts[i][0]){const [a0,b0]=pts[i-1],[a1,b1]=pts[i];return b0+(b1-b0)*(t-a0)/(a1-a0)}const L=pts[pts.length-1];return L[1]+(t-L[0])}
const RELABEL={'可行动':'智能体行动','网上':'网络','东四路口 · 此刻':'路口 · 此刻'};
function retime(name,pts,o0,o1){const f=window[name];window[name]=function(t){const ot=remap(pts,t);CP.t0=o0;CP.k=clamp((ot-o0)/(o1-o0));const sv=text;text=function(s,...a){return sv(RELABEL[s]??s,...a)};try{return f(ot)}finally{text=sv}}}
retime('shotDigital',[[0,0],[12.6,13.3]],0,13.3);
retime('shotTaishan',[[12.6,13.3],[18.0,19.0]],13.3,19.0);
retime('shotParking',[[18.0,19.0],[24.5,25.9]],19.0,25.9);
retime('shotPeel',[[24.5,25.9],[28.2,29.1]],25.9,29.1);
// 可搜索 32.9 · 可预测 34.7 · 智能体据此行动 35.6
retime('shotWake',[[28.2,29.1],[32.4,29.75],[34.2,32.25],[35.2,34.95],[37.4,37.9]],29.1,37.9);
// 天上 42.1 · 地上 43.1 · 网络 43.8
retime('shotShells',[[37.4,37.9],[41.6,38.5],[42.7,40.9],[43.6,43.3],[45.3,44.6]],37.9,46.1);
// 感官各自分工 82.3 · 专家模型 85.3 · 基础大模型融合推演 89.4
retime('shotExperts',[[82.1,69.6],[92.0,82.3]],69.6,82.3);
// +5 分钟 113.4 · +30 分钟 114.3 · +1 小时 115.3
retime('shotPredict',[[110.6,97.1],[119.2,106.0]],97.1,106.0);
retime('shotAGI',[[148.2,143.8],[159.0,158.0]],143.8,158.0);
// ---------- S17：文字改为英文
const TOKEN_EN=['The',' city',' of',' Beijing',' is',' a',' large',' and',' busy',' place','.',' Traffic',' on',' the',' road','s',' is',' heavy',' in',' the',' morning',',',' and',' people',' search',' for',' park','ing','.',' Phys','ical',' world',' data',' is',' rare','ly',' index','ed','.',' A',' model',' predict','s',' the',' next',' token',' from',' text','.',' Ques','tion',':',' is',' it',' crowd','ed',' now','?',' An','swer',':',' unknown','.',' Weather',' report','s',' and',' news',' art','icle','s',' describe',' the',' past','.'];
shotTextState=function(t){const u=t-104.7;v9init();bg();const B=sstep(2.6,3.6,u);const k=ease(clamp(u/5.9));
  setCam([lerp(-1.5,4.2,k),lerp(1.2,4.6,B),lerp(4.5,5.6,k)],[lerp(0.8,0.4,k),lerp(0.2,0.1,B),lerp(-1.0,-1.0,k)],52);
  if(B>0){drawBlock(t,{dense:0.6,a:B});curved(()=>{g.globalCompositeOperation='lighter';const N=34,M2=28;for(let i=0;i<N;i++)for(let j=0;j<M2;j++){const x=-4.4+(i+0.5)*8.8/N,z=-3.6+(j+0.5)*7.2/M2;const v=0.5+0.5*Math.sin(x*1.3+t*0.8)*Math.cos(z*1.1-t*0.6)+0.25*Math.sin((x+z)*3+t*1.4);const kk=clamp(v);if(kk<0.35)continue;
      const p=proj([x,0.03,z]);if(!p)continue;const col=kk>0.8?C_OR:kk>0.6?[236,190,120]:[180,190,206];const r=clamp(220/p[2],4,26)*kk;glowDot(p,r,col,0.35*B*kk)}g.globalCompositeOperation='source-over'});
    const la=clamp((u-3.9)/0.5);if(la>0)text('物理世界的状态',960,150,52,rgba(C_OR2,la),'center',800,10)}
  const A=1-B;if(A>0){const y0=lerp(0.3,-1.6,ease(clamp((u-2.6)/1.4)));const r=rng(17);
    const TC=[[150,200,220],[220,180,140],[190,170,230],[160,210,170],[230,200,120]];
    for(let j=0;j<40;j++){let x=-6;let ti=(j*17)%TOKEN_EN.length;while(x<6.5){const w=TOKEN_EN[ti%TOKEN_EN.length];ti++;const z=-6+j*0.24;const jit=(r()-0.5);const yy=y0+(A<1?jit*(1-A)*2:0);const adv=0.03+w.length*0.042;
      const q=proj([x,yy,z]),q2=proj([x+adv-0.015,yy,z]);if(q&&q2&&q[2]>0.3){const fs=clamp(220/q[2],6,34);const fd=Math.pow(clamp((6.5-q[2])/3.5),1.3);if(fd>0.02){const wpx=Math.max(4,q2[0]-q[0]);const hpx=fs*1.25;const hot=((ti+j*13+Math.floor(t*14))%61+61)%61===0;const col=hot?C_OR2:TC[ti%TC.length];
        g.fillStyle=rgba(col,(hot?0.55:0.16)*A*fd);g.fillRect(q[0],q[1]-hpx*0.82,wpx-1,hpx);g.strokeStyle=rgba(col,(hot?0.9:0.35)*A*fd);g.lineWidth=1;g.strokeRect(q[0],q[1]-hpx*0.82,wpx-1,hpx);
        g.font=`500 ${fs}px "DejaVu Sans Mono","Noto Sans Mono",monospace`;g.textAlign='left';g.fillStyle=hot?rgba([255,240,210],A):`rgba(226,226,232,${(0.15+0.7*fd)*(0.6+0.4*r())*A})`;g.fillText(w.replace(' ','␣'),q[0]+1,q[1])}}x+=adv}}
    const la=clamp((u-0.4)/0.5)*(1-clamp((u-2.4)/0.4));if(la>0)text('文字',960,150,52,`rgba(236,238,242,${la})`,'center',800,10)}
  vignette()};
// ---------- S20：主体（出口、运力、人流）占画面更大
const _ven1=shotVenue;
shotVenue=function(t){const u=t-126.4;const k=ease(clamp(u/8.1));const sc=setCam;setCam=function(p,tg,f){return sc([lerp(-2.0,-0.75,k),lerp(2.2,1.05,k),lerp(4.1,2.75,k)],[lerp(0.05,0.0,k),lerp(0.15,0.05,k),lerp(0.6,1.2,k)],46)};
  try{_ven1(t)}finally{setCam=sc}};
// ---------- S22：重做 —— 预测与现实沿时间线逐点对账，命中与偏差都写进记录带；现实那条线随后定格，预测推不动它
function shotLedger(t){const u=t-137.6;bg();
  const X0=140,X1=1780,Yb=700,Yh=440;const px=x=>X0+(X1-X0)*x,py=y=>Yb-Yh*y;
  const real=x=>0.42+0.2*Math.sin(x*7.1+0.3)+0.1*Math.sin(x*17.3+1.2)+0.05*Math.sin(x*41);
  const pred=x=>real(x)+0.16*Math.sin(x*9.7+2.0)*Math.max(0,Math.sin(x*3.1+0.6));
  const now=clamp(u/2.1);const lock=sstep(2.3,2.9,u),push=clamp((u-3.3)/1.6);
  // faint grid
  g.strokeStyle='rgba(214,220,230,0.07)';g.lineWidth=1;for(let i=0;i<=16;i++){g.beginPath();g.moveTo(px(i/16),py(0));g.lineTo(px(i/16),py(1));g.stroke()}for(let j=0;j<=4;j++){g.beginPath();g.moveTo(X0,py(j/4));g.lineTo(X1,py(j/4));g.stroke()}
  // prediction: a dashed line ahead of reality; later it leans on reality — and reality does not move
  const lean=Math.sin(push*Math.PI*2.5)*(1-push)*0.06;
  g.setLineDash([10,8]);g.strokeStyle='rgba(236,238,242,0.75)';g.lineWidth=2.5;g.beginPath();for(let x=0;x<=1;x+=0.003){const y=pred(x)+(push>0?lean*Math.sign(real(x)-pred(x)):0);x?g.lineTo(px(x),py(y)):g.moveTo(px(x),py(y))}g.stroke();g.setLineDash([]);
  // reality: arrives point by point up to "now"; once the answer is in, it hardens
  g.globalCompositeOperation='lighter';const rc=[lerp(214,255,lock),lerp(214,176,lock),lerp(214,80,lock)];g.strokeStyle=rgba(rc,0.95);g.lineWidth=lerp(3,6,lock);g.beginPath();for(let x=0;x<=now;x+=0.003){x?g.lineTo(px(x),py(real(x))):g.moveTo(px(x),py(real(x)))}g.stroke();
  if(lock>0){g.strokeStyle=rgba(C_OR,0.25*lock);g.lineWidth=18;g.beginPath();for(let x=0;x<=1;x+=0.006){x?g.lineTo(px(x),py(real(x))):g.moveTo(px(x),py(real(x)))}g.stroke()}
  g.globalCompositeOperation='source-over';
  if(now<1){g.strokeStyle='rgba(240,240,244,0.6)';g.lineWidth=1.5;g.beginPath();g.moveTo(px(now),py(0));g.lineTo(px(now),py(1.02));g.stroke();text('此刻',px(now),py(1.02)-12,26,'rgba(240,240,244,0.85)','center',700,2)}
  // check points: predicted vs actual, joined; hit or miss, both stamped and written into the record tape
  const N=24,TY=830;text('记录',X0-20,TY+10,26,'rgba(214,220,230,0.8)','right',700,3);g.strokeStyle='rgba(214,220,230,0.25)';g.lineWidth=1;g.beginPath();g.moveTo(X0,TY+26);g.lineTo(X1,TY+26);g.stroke();
  for(let i=0;i<N;i++){const x=(i+0.5)/N;if(x>now)break;const a=clamp((now-x)*N*0.8);const pv=pred(x),av=real(x),hit=Math.abs(pv-av)<0.05;
    g.strokeStyle=hit?rgba(C_OR2,0.8*a):`rgba(236,238,242,${0.5*a})`;g.lineWidth=1.5;g.beginPath();g.moveTo(px(x),py(pv));g.lineTo(px(x),py(av));g.stroke();
    g.fillStyle='rgba(6,7,10,1)';g.strokeStyle='rgba(236,238,242,0.9)';g.lineWidth=2;g.beginPath();g.arc(px(x),py(pv),6,0,7);g.fill();g.stroke();
    g.fillStyle=rgba(lock>0?C_OR2:[240,240,244],a);g.beginPath();g.arc(px(x),py(av),7,0,7);g.fill();
    // stamp on the tape
    const cx=px(x),cy=TY;const cw=(X1-X0)/N*0.7;if(hit){g.fillStyle=rgba(C_OR,0.85*a);g.fillRect(cx-cw/2,cy-16,cw,32);g.strokeStyle=`rgba(20,20,24,${a})`;g.lineWidth=3;g.beginPath();g.moveTo(cx-9,cy);g.lineTo(cx-2,cy+8);g.lineTo(cx+11,cy-9);g.stroke()}
    else{g.strokeStyle=`rgba(236,238,242,${0.9*a})`;g.lineWidth=1.5;g.strokeRect(cx-cw/2,cy-16,cw,32);g.lineWidth=2.5;g.beginPath();g.moveTo(cx-7,cy-7);g.lineTo(cx+7,cy+7);g.moveTo(cx+7,cy-7);g.lineTo(cx-7,cy+7);g.stroke()}
    if(lock>0){g.fillStyle=rgba(C_OR2,lock);g.fillRect(cx-5,cy+22,10,7);g.strokeStyle=rgba(C_OR2,lock);g.lineWidth=1.5;g.beginPath();g.arc(cx,cy+22,4,Math.PI,0);g.stroke()}}
  // legend + the two lines of meaning
  text('预测',X1-260,py(1.02)-12,26,'rgba(236,238,242,0.85)','left',700,2);g.setLineDash([8,6]);g.strokeStyle='rgba(236,238,242,0.75)';g.lineWidth=2.5;g.beginPath();g.moveTo(X1-330,py(1.02)-20);g.lineTo(X1-275,py(1.02)-20);g.stroke();g.setLineDash([]);
  text('现实',X1-110,py(1.02)-12,26,rgba(lock>0?C_OR2:[236,238,242],0.9),'left',700,2);g.strokeStyle=rgba(lock>0?C_OR2:[236,238,242],0.9);g.lineWidth=4;g.beginPath();g.moveTo(X1-180,py(1.02)-20);g.lineTo(X1-125,py(1.02)-20);g.stroke();
  const l1=clamp((u-0.3)/0.4)*(1-clamp((u-2.1)/0.3));if(l1>0){text('成功或失败，都被记录',X0,150,48,`rgba(240,240,244,${l1})`,'left',800,4)}
  if(lock>0){text('现实给出的答案',X0,150,48,rgba(C_OR2,lock),'left',800,4);const la=clamp((u-3.4)/0.4);if(la>0)text('模型无法改写',X0,212,36,`rgba(240,240,244,${la})`,'left',700,4)}
  vignette()}
