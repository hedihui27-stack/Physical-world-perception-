// ===== 第七版 · 开场：不再画新网页。在卡片墙上直接把被选中的网页染成橙色，用极细的线连起来：搜索=按相关度串起；推荐=相似的彼此相连；大模型=大量网页互相关联 =====
let DSEL=null,DPOS={};
function pickD7(){const save=M;const pick=(T,n,seed,R)=>{digiCam(T);const cdir=norm(M.p);const r=rng(seed);const cand=[];for(let i=0;i<CARDS.length;i++){const v=CARDS[i].v;if(dot(v,cdir)<0.7)continue;const p=proj(v);if(!p)continue;const dx=(p[0]-W/2)/(W*0.42),dy=(p[1]-H/2)/(H*0.4);if(dx*dx+dy*dy>R)continue;cand.push(i)}
    const out=[];let g2=0;while(out.length<n&&g2++<20000){const c=cand[Math.floor(r()*cand.length)];if(!out.includes(c))out.push(c)}return out};
  DSEL={s:pick(7.2,9,21,0.8),r:pick(9.4,16,22,0.9),m:pick(11.8,46,23,1.0)};M=save}
function dHL(i,T){let h=0;const S=DSEL;let j;
  if((j=S.s.indexOf(i))>=0)h=Math.max(h,clamp((T-6.4-j*0.12)/0.3)*(1-clamp((T-8.4)/0.4)));
  if((j=S.r.indexOf(i))>=0)h=Math.max(h,clamp((T-8.6-j*0.07)/0.3)*(1-clamp((T-10.5)/0.4)));
  if((j=S.m.indexOf(i))>=0)h=Math.max(h,clamp((T-10.6-j*0.03)/0.3)*(1-clamp((T-13.1)/0.3)));return h}
function dLines(list,T,mode){const P=list.map(i=>DPOS[i]).filter(Boolean);if(P.length<2)return;g.lineWidth=2.0;
  const done=new Set();const seg=(a,b,al)=>{if(al<=0)return;const ka=P.indexOf(a),kb=P.indexOf(b);const key=Math.min(ka,kb)+'_'+Math.max(ka,kb);if(done.has(key))return;done.add(key);g.strokeStyle=rgba(C_OR2,al);g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke()};
  if(mode==='s'){const Q=P.slice().sort((a,b)=>a[0]-b[0]);for(let k=0;k<Q.length-1;k++)seg(Q[k],Q[k+1],0.85*Math.min(Q[k][2],Q[k+1][2]))}
  else if(mode==='r'){for(const a of P){const n=P.filter(b=>b!==a).sort((x,y)=>Math.hypot(x[0]-a[0],x[1]-a[1])-Math.hypot(y[0]-a[0],y[1]-a[1]))[0];seg(a,n,0.75*Math.min(a[2],n[2]))}}
  else{for(let k=0;k<P.length;k++){const a=P[k];const n=P.filter(b=>b!==a).sort((x,y)=>Math.hypot(x[0]-a[0],x[1]-a[1])-Math.hypot(y[0]-a[0],y[1]-a[1]));seg(a,n[0],0.55*Math.min(a[2],n[0][2]));if(k%3===0&&n[3])seg(a,n[3],0.4*Math.min(a[2],n[3][2]))}}}
shotDigital=function(t){if(!DSEL)pickD7();bg();const T=t;const form=ease(clamp(T/3.0));const org=clamp((T-4)/4);const dist=digiCam(T);const cdir=norm(M.p);if(!SEL)pickSel();
  const ph1=clamp((T-6.0)/0.8),dim=1-0.55*clamp((T-6.4)/0.7);const wave=(T-6.0)*1500;
  const c0=proj([0,0,0]);if(c0){g.globalCompositeOperation='lighter';const R0=clamp(900/dist,60,600)*form;const gg=g.createRadialGradient(c0[0],c0[1],0,c0[0],c0[1],R0*1.1);gg.addColorStop(0,'rgba(150,165,190,0.16)');gg.addColorStop(0.8,'rgba(150,165,190,0.07)');gg.addColorStop(1,'rgba(150,165,190,0)');g.fillStyle=gg;g.beginPath();g.arc(c0[0],c0[1],R0*1.1,0,7);g.fill()}
  const selSet=new Set(SEL);const lifted=j=>ease(clamp((T-6.7-j*0.05)/0.9));
  g.globalCompositeOperation='lighter';
  for(let i=0;i<CARDS.length;i++){const C=CARDS[i];const born=(i%97)/97*1.4;const f=ease(clamp((T-born*0.6)/2.2));if(f<=0)continue;
    const jit=(1-org)*0.06;const v=norm(C.v.map((x,k)=>x+C.j[k]*jit)).map(x=>x*f);const fd=dot(norm(v),cdir);if(fd<-0.15)continue;
    const hl=dHL(i,T);
    const q=cardQuad(v,0.012*C.w,C.rot*(1-org));const P=q.map(proj);if(P.some(x=>!x))continue;const area=Math.abs((P[1][0]-P[0][0])*(P[3][1]-P[0][1]));
    // the page keeps changing: each card swaps its content at its own rhythm, with a small flash
    const rate=0.5+C.b*1.6,cyc=T*rate+C.b*7;const flash=Math.max(0,1-(cyc%1)*5);
    const pc=proj(v);if(hl>0&&pc)DPOS[i]=[pc[0],pc[1],hl];let hit=0;if(ph1>0&&ph1<1&&pc){const dd=Math.hypot(pc[0]-W/2,pc[1]-H/2);hit=Math.exp(-(((dd-wave)/60)**2))}
    if(area<0.5){g.fillStyle=`rgba(200,208,220,${(0.25+0.4*fd)*dim})`;g.fillRect(pc[0],pc[1],1.3,1.3);continue}
    const base=(0.06+0.15*C.b+0.16*Math.max(0,fd)+0.22*flash)*dim;const col=hit>0.05?[lerp(190,255,hit),lerp(198,190,hit),lerp(210,120,hit)]:[165+45*C.b,172+42*C.b,186+38*C.b];
    const col2=hl>0?col.map((x,k)=>lerp(x,C_OR[k],hl)):col;g.fillStyle=rgba(col2,Math.min(0.95,base+hit*0.6+hl*0.55));g.beginPath();P.forEach((p,k)=>k?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill();
    if(area>90){const seed=i*31+Math.floor(cyc);const r=rng(seed);g.strokeStyle=rgba([235,238,242],(0.3+0.4*hit+0.3*flash)*dim);g.lineWidth=0.7;const nl=2+Math.floor(r()*3);for(let l=1;l<=nl;l++){const a=[0,1].map(k=>lerp(P[0][k],P[3][k],l/(nl+1.2))),b=[0,1].map(k=>lerp(P[1][k],P[2][k],l/(nl+1.2)));const bb=[0,1].map(k=>lerp(a[k],b[k],0.3+0.6*r()));g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(bb[0],bb[1]);g.stroke()}}}
  g.globalCompositeOperation='lighter';dLines(DSEL.s,T,'s');dLines(DSEL.r,T,'r');dLines(DSEL.m,T,'m');g.globalCompositeOperation='source-over';DPOS={};
  const lab=(s,x,y,a)=>{if(a<=0)return;g.fillStyle=rgba(C_OR,a);g.beginPath();g.arc(x-16,y-10,6,0,7);g.fill();text(s,x,y,40,`rgba(244,242,236,${a})`,'left',700,6)};
  lab('搜索',W/2-60,140,clamp((T-6.2)/0.4)*(1-clamp((T-8.3)/0.4)));lab('推荐',W/2-60,140,clamp((T-8.6)/0.4)*(1-clamp((T-10.4)/0.4)));lab('大模型',W/2-80,140,clamp((T-10.7)/0.4)*(1-clamp((T-13.0)/0.3)));
  vignette()};
