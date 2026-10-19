// ===== 第七版 · 呼应开头：预测与验证都用开场那座停车场 —— "三十分钟后会不会满"在这里得到回答 =====
const PK={cols:26,rows:10,sw:0.36,sd:0.82};PK.ox=-PK.cols*PK.sw/2;PK.oz=-PK.rows*PK.sd/2;
const PKCOL=[[74,168,255],[255,209,102],[233,238,249],[255,122,61],[95,224,176]];
function pkHash(ro,c){const h=Math.sin(ro*127.1+c*311.7)*43758.5453;return h-Math.floor(h)}
function pkQuad(pts,fill,stroke,lw=1){const P=pts.map(proj);if(P.some(x=>!x))return;g.beginPath();P.forEach((p,k)=>k?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();if(fill){g.fillStyle=fill;g.fill()}if(stroke){g.strokeStyle=stroke;g.lineWidth=lw;g.stroke()}}
// one layer of the lot. o: {y, f (fill 0..1), ghost, blur, a, mark(ro,c)->null|'ok'|'miss'}
function drawLot(o){const {cols,rows,sw,sd,ox,oz}=PK;const y=o.y||0,a=o.a??1,bl=o.blur||0;
  pkQuad([[ox-0.5,y,oz-0.6],[-ox+0.5,y,oz-0.6],[-ox+0.5,y,-oz+0.6],[ox-0.5,y,-oz+0.6]],o.ghost?`rgba(40,52,70,${0.28*a})`:`rgba(20,32,48,${0.9*a})`,`rgba(140,155,180,${(o.ghost?0.5:0.7)*a})`,o.ghost?1:1.5);
  for(let ro=0;ro<rows;ro++)for(let c=0;c<cols;c++){const x=ox+c*sw,z=oz+ro*sd+(ro%2?0.08:0);
    if(!o.ghost)pkQuad([[x+0.02,y+0.001,z],[x+sw-0.02,y+0.001,z],[x+sw-0.02,y+0.001,z+0.66],[x+0.02,y+0.001,z+0.66]],null,`rgba(147,160,186,${0.5*a})`,1);
    if(pkHash(ro,c)>o.f)continue;const h=0.16,m=0.07;const jx=bl*(pkHash(c,ro+9)-0.5)*0.25,jz=bl*(pkHash(ro+3,c)-0.5)*0.35;const cx0=x+m+jx,cx1=x+sw-m+jx,cz0=z+0.08+jz,cz1=z+0.58+jz;
    const mk=o.mark?o.mark(ro,c):null;
    if(o.ghost){const col=[175,195,220];pkQuad([[cx0,y+h,cz0],[cx1,y+h,cz0],[cx1,y+h,cz1],[cx0,y+h,cz1]],rgba(col,(0.16-0.08*bl)*a),rgba(col,(0.55-0.3*bl)*a),0.8);continue}
    const col=mk==='ok'?C_OR:mk==='miss'?[200,96,84]:PKCOL[(ro+c)%5];
    pkQuad([[cx0,y+h,cz0],[cx1,y+h,cz0],[cx1,y+h,cz1],[cx0,y+h,cz1]],rgba(col,0.85*a),rgba(col.map(v=>Math.min(255,v*1.2)),0.9*a));pkQuad([[cx0,y,cz1],[cx1,y,cz1],[cx1,y+h,cz1],[cx0,y+h,cz1]],rgba(col.map(v=>v*0.45),0.9*a))}}
const PKL=[[0,'此刻',0.62,0,''],[1.7,'+5 分钟',0.71,0.25,'把握 96%'],[3.4,'+30 分钟',0.94,0.6,'将满 · 把握 87%'],[5.1,'+1 小时',0.98,1.0,'已满 · 把握 72%']];
function pkLabel(i,y,a){const L=PKL[i];const p=proj([-PK.ox+0.8,y+0.05,PK.oz]);if(!p)return;text(L[1],p[0]+14,p[1]+8,28,i===2?rgba(C_OR2,a):`rgba(236,238,242,${a})`,'left',700,2);if(L[4])text(L[4],p[0]+14,p[1]+44,22,i===2?rgba(C_OR2,0.9*a):`rgba(200,206,216,${0.9*a})`,'left',500,2)}
shotPredict=function(t){bg();const lt=LT(t);const az=0.62-lt*0.03;setCam([Math.sin(az)*14.2,8.0+lt*0.12,Math.cos(az)*14.2],[0.6,2.2,0],42);
  for(let i=0;i<4;i++){const a=i?clamp((lt-0.6-i*1.3)/0.9):1;if(a<=0)continue;const L=PKL[i];drawLot({y:L[0],f:L[2],ghost:i>0,blur:L[3],a});pkLabel(i,L[0],a)}
  // the +30 layer is the question from the opening: keep a soft orange edge on it
  const a3=clamp((lt-3.2)/0.9);if(a3>0){g.globalCompositeOperation='lighter';const y=PKL[2][0];pkQuad([[PK.ox-0.5,y,PK.oz-0.6],[-PK.ox+0.5,y,PK.oz-0.6],[-PK.ox+0.5,y,-PK.oz+0.6],[PK.ox-0.5,y,-PK.oz+0.6]],null,rgba(C_OR,0.8*a3),2);g.globalCompositeOperation='source-over'}
  vignette()};
// thirty minutes later: the prediction comes down onto reality and is scored slot by slot
shotMatch=function(t){bg();const lt=LT(t);const az=0.5;setCam([Math.sin(az)*11.4,7.6,Math.cos(az)*11.4],[0.4,0.6,0],42);const fall=ease(clamp(lt/1.4));
  const sc=clamp((lt-1.4)/1.0);const mark=(ro,c)=>{if(sc<=0)return null;if(pkHash(ro+5,c+2)>sc)return null;return pkHash(c+11,ro)<0.93?'ok':'miss'};
  drawLot({y:0,f:0.94,mark});if(fall<1)drawLot({y:lerp(PKL[2][0],0.02,fall),f:0.94,ghost:true,blur:0.6*(1-fall),a:1-fall*0.6});
  const p=proj([-PK.ox+0.8,0.05,PK.oz]);const ta=clamp((lt-1.6)/0.5);if(p&&ta>0){text('30 分钟后 · 现实',p[0]+14,p[1]+8,28,`rgba(236,238,242,${ta})`,'left',700,2);text('预测命中 93%',p[0]+14,p[1]+44,24,rgba(C_OR2,ta),'left',600,2)}
  vignette()};
