// ===== 第六版 · 开场：数字地球 —— 网页不停变换；搜索 / 推荐 / 大模型 用网页的筛选与重组来表现 =====
function digiCam(T){const az=0.4+T*0.05;const dist=T<4.5?lerp(3.6,2.3,ease(clamp(T/4.5))):lerp(2.3,1.45,ease(clamp((T-4.5)/2.2)));setCam([Math.sin(az)*dist,0.22*dist,Math.cos(az)*dist],[0,0,0],40);return dist}
let SEL=null;
function pickSel(){const save=M;digiCam(6.0);const cdir=norm(M.p);const r=rng(17);const cand=[];for(let i=0;i<CARDS.length;i++){const v=CARDS[i].v;if(dot(v,cdir)<0.6)continue;const p=proj(v);if(!p)continue;const dx=(p[0]-W/2)/760,dy=(p[1]-H/2)/400;if(dx*dx+dy*dy>1)continue;cand.push([i,p])}
  const out=[];let guard=0;while(out.length<18&&guard++<5000){const c=cand[Math.floor(r()*cand.length)];if(out.some(o=>Math.hypot(o[1][0]-c[1][0],o[1][1]-c[1][1])<120))continue;out.push(c)}SEL=out.map(o=>o[0]);M=save}
const PERM=[3,0,7,1,12,5,2,9,4,15,6,11,8,17,10,13,16,14];
// content of one page, drawn in a unit box 100×72 (changes over time)
function pageContent(seed,a,accent,big){const r=rng(seed*7919+13);const cBar=accent?rgba(C_OR,0.95*a):`rgba(205,212,222,${0.55*a})`;
  g.fillStyle=cBar;g.fillRect(6,6,30+r()*40,6);
  const img=r()<0.6;if(img){const gg=g.createLinearGradient(6,18,40,60);gg.addColorStop(0,`rgba(${120+r()*60|0},${130+r()*50|0},${140+r()*40|0},${0.55*a})`);gg.addColorStop(1,`rgba(60,66,78,${0.5*a})`);g.fillStyle=gg;g.fillRect(6,18,34,30)}
  g.fillStyle=`rgba(225,228,234,${0.42*a})`;const x0=img?46:6;for(let l=0;l<(big?8:5);l++){const w=(img?48:88)*(0.45+0.55*r());g.fillRect(x0,19+l*8,w,3)}
  if(r()<0.4){g.fillStyle=`rgba(225,228,234,${0.3*a})`;for(let l=0;l<3;l++)g.fillRect(6,54+l*5,20+r()*70,2)}}
function card2D(cx,cy,w,h,rot,seed,a,accent){g.save();g.translate(cx,cy);g.rotate(rot);g.scale(w/100,h/72);g.translate(-50,-36);
  g.fillStyle=`rgba(22,25,31,${0.92*a})`;g.beginPath();g.roundRect(0,0,100,72,4);g.fill();g.strokeStyle=accent?rgba(C_OR,0.9*a):`rgba(200,206,216,${0.45*a})`;g.lineWidth=accent?1.4:0.8;g.stroke();pageContent(seed,a,accent);g.restore()}
shotDigital=function(t){bg();const T=t;const form=ease(clamp(T/3.0));const org=clamp((T-4)/4);const dist=digiCam(T);const cdir=norm(M.p);if(!SEL)pickSel();
  const ph1=clamp((T-6.0)/0.8),dim=1-0.68*clamp((T-6.4)/0.7);const wave=(T-6.0)*1500;
  const c0=proj([0,0,0]);if(c0){g.globalCompositeOperation='lighter';const R0=clamp(900/dist,60,600)*form;const gg=g.createRadialGradient(c0[0],c0[1],0,c0[0],c0[1],R0*1.1);gg.addColorStop(0,'rgba(150,165,190,0.16)');gg.addColorStop(0.8,'rgba(150,165,190,0.07)');gg.addColorStop(1,'rgba(150,165,190,0)');g.fillStyle=gg;g.beginPath();g.arc(c0[0],c0[1],R0*1.1,0,7);g.fill()}
  const selSet=new Set(SEL);const lifted=j=>ease(clamp((T-6.7-j*0.05)/0.9));
  g.globalCompositeOperation='lighter';
  for(let i=0;i<CARDS.length;i++){const C=CARDS[i];const born=(i%97)/97*1.4;const f=ease(clamp((T-born*0.6)/2.2));if(f<=0)continue;
    const jit=(1-org)*0.06;const v=norm(C.v.map((x,k)=>x+C.j[k]*jit)).map(x=>x*f);const fd=dot(norm(v),cdir);if(fd<-0.15)continue;
    if(selSet.has(i)&&lifted(SEL.indexOf(i))>0.02)continue;
    const q=cardQuad(v,0.012*C.w,C.rot*(1-org));const P=q.map(proj);if(P.some(x=>!x))continue;const area=Math.abs((P[1][0]-P[0][0])*(P[3][1]-P[0][1]));
    // the page keeps changing: each card swaps its content at its own rhythm, with a small flash
    const rate=0.5+C.b*1.6,cyc=T*rate+C.b*7;const flash=Math.max(0,1-(cyc%1)*5);
    const pc=proj(v);let hit=0;if(ph1>0&&ph1<1&&pc){const dd=Math.hypot(pc[0]-W/2,pc[1]-H/2);hit=Math.exp(-(((dd-wave)/60)**2))}
    if(area<0.5){g.fillStyle=`rgba(200,208,220,${(0.25+0.4*fd)*dim})`;g.fillRect(pc[0],pc[1],1.3,1.3);continue}
    const base=(0.06+0.15*C.b+0.16*Math.max(0,fd)+0.22*flash)*dim;const col=hit>0.05?[lerp(190,255,hit),lerp(198,190,hit),lerp(210,120,hit)]:[165+45*C.b,172+42*C.b,186+38*C.b];
    g.fillStyle=rgba(col,Math.min(0.95,base+hit*0.6));g.beginPath();P.forEach((p,k)=>k?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill();
    if(area>90){const seed=i*31+Math.floor(cyc);const r=rng(seed);g.strokeStyle=rgba([235,238,242],(0.3+0.4*hit+0.3*flash)*dim);g.lineWidth=0.7;const nl=2+Math.floor(r()*3);for(let l=1;l<=nl;l++){const a=[0,1].map(k=>lerp(P[0][k],P[3][k],l/(nl+1.2))),b=[0,1].map(k=>lerp(P[1][k],P[2][k],l/(nl+1.2)));const bb=[0,1].map(k=>lerp(a[k],b[k],0.3+0.6*r()));g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(bb[0],bb[1]);g.stroke()}}}
  g.globalCompositeOperation='source-over';
  // ---- the selected pages, lifted off the globe and recombined ----
  const rec=ease(clamp((T-8.4)/0.9)),rank=ease(clamp((T-9.3)/0.7)),scroll=clamp((T-8.6)/4.0)*620;const llm=T-10.4;
  const colX=1440,cw=360,chh=250;
  SEL.forEach((ci,j)=>{const L=lifted(j);if(L<=0)return;const C=CARDS[ci];const v=C.v;const q=cardQuad(v,0.012*C.w,0);const P=q.map(proj);if(P.some(x=>!x))return;
    const sx=(P[0][0]+P[2][0])/2,sy=(P[0][1]+P[2][1])/2,sw=Math.hypot(P[1][0]-P[0][0],P[1][1]-P[0][1]),sr=Math.atan2(P[1][1]-P[0][1],P[1][0]-P[0][0]);
    // search: pulled toward the viewer, enlarged
    const tx=lerp(sx,W/2,0.25)+(sx-W/2)*0.15,ty=lerp(sy,H/2,0.2)-30,tw=230;
    let x=lerp(sx,tx,L),y=lerp(sy,ty,L),w=lerp(sw,tw,L),rt=lerp(sr,0,L);
    // recommend: re-ordered into a personal feed, which keeps scrolling
    if(rec>0){const rk=lerp(j,PERM[j],rank);const fy=330+rk*(chh+30)-scroll;const k=ease(clamp(rec*1.4-j*0.03));x=lerp(x,colX,k);y=lerp(y,fy,k);w=lerp(w,cw,k)}
    let a=1;if(llm>0){a=1-clamp((llm-j*0.04)/0.9)}
    if(a>0.01&&y>-200&&y<H+200){const h=w*0.72;card2D(x,y,w,h,rt,ci*31+Math.floor(T*(1.2+j%3*0.4)),a,true);
      if(rec>0.5&&a>0.5){g.fillStyle=rgba(C_OR,a*(rec-0.5)*2);g.fillRect(x-w/2-16,y-h/2,5,h)}}
    // large model: each page dissolves into particles that flow into one new page
    if(llm>0&&llm<2.4){g.globalCompositeOperation='lighter';const r=rng(ci);for(let k=0;k<120;k++){const u=clamp((llm-j*0.04-r()*0.4)/1.2);if(u<=0||u>=1)continue;const px=x+(r()-.5)*w,py=y+(r()-.5)*w*0.72;const qx=W/2-80+(r()-.5)*640,qy=H/2+(r()-.5)*380;const e=ease(u);const mx=lerp(px,qx,e),my=lerp(py,qy,e)-Math.sin(u*Math.PI)*80;g.fillStyle=`rgba(255,${200+r()*40|0},${130+r()*60|0},${0.9*Math.sin(u*Math.PI)})`;g.fillRect(mx-1.3,my-1.3,2.6,2.6)}g.globalCompositeOperation='source-over'}});
  // the generated page: written line by line
  const ga=clamp((llm-0.7)/0.6);if(ga>0){const bx=W/2-80,by=H/2,bw=760,bh=470;g.save();g.translate(bx-bw/2,by-bh/2);g.globalAlpha=ga;
    g.fillStyle='rgba(20,22,28,0.94)';g.beginPath();g.roundRect(0,0,bw,bh,10);g.fill();g.strokeStyle=rgba(C_OR,0.95);g.lineWidth=2;g.stroke();
    g.fillStyle=rgba(C_OR,0.95);g.fillRect(36,36,220,14);const r=rng(4);const written=(llm-1.0)*7;let cur=null;
    for(let l=0;l<11;l++){const full=(l%4===3?0.45:0.7+0.3*r())*(bw-72);const k=clamp(written-l);if(k<=0)break;const wv=full*k;g.fillStyle='rgba(232,234,238,0.75)';g.fillRect(36,82+l*32,wv,8);cur=[36+wv,82+l*32]}
    if(cur&&Math.sin(T*14)>0){g.fillStyle=rgba(C_OR2,1);g.fillRect(cur[0]+6,cur[1]-6,4,20)}g.restore();g.globalAlpha=1}
  // small labels at the action
  const lab=(s,x,y,a)=>{if(a<=0)return;g.fillStyle=rgba(C_OR,a);g.beginPath();g.arc(x-16,y-10,6,0,7);g.fill();text(s,x,y,32,`rgba(244,242,236,${a})`,'left',700,6)};
  lab('搜索',W/2-60,150,clamp((T-6.2)/0.4)*(1-clamp((T-8.3)/0.4)));lab('推荐',colX-420,140,clamp((T-8.6)/0.4)*(1-clamp((T-10.3)/0.4)));lab('大模型',W/2-150,H/2-280,clamp((T-11.0)/0.4)*(1-clamp((T-13.0)/0.3)));
  vignette()};
