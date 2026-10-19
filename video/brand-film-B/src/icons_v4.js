// ===== small vector icons (replace text labels with pictures) =====
function icon(kind,x,y,s,col,a=1){g.save();g.translate(x,y);g.scale(s/24,s/24);g.strokeStyle=rgba(col,a);g.fillStyle=rgba(col,a);g.lineWidth=1.8;g.lineCap='round';g.lineJoin='round';g.beginPath();
  if(kind==='sat'){g.fillRect(-3,-3,6,6);g.strokeRect(-12,-2,7,4);g.strokeRect(5,-2,7,4);g.moveTo(-5,0);g.lineTo(-3,0);g.moveTo(3,0);g.lineTo(5,0);g.moveTo(0,3);g.lineTo(0,7);g.stroke()}
  else if(kind==='cam'){g.strokeRect(-9,-5,13,9);g.moveTo(4,-2);g.lineTo(10,-5);g.lineTo(10,4);g.lineTo(4,1);g.moveTo(-3,4);g.lineTo(-3,10);g.moveTo(-7,10);g.lineTo(1,10);g.stroke()}
  else if(kind==='sense'){g.arc(0,4,2.2,0,7);g.fill();g.beginPath();for(const r of [6,10]){g.moveTo(-r*0.7,4-r*0.7);g.arc(0,4,r,-2.36,-0.79)}g.stroke()}
  else if(kind==='net'){g.arc(0,0,9,0,7);g.moveTo(-9,0);g.lineTo(9,0);g.moveTo(0,-9);g.bezierCurveTo(-6,-4,-6,4,0,9);g.moveTo(0,-9);g.bezierCurveTo(6,-4,6,4,0,9);g.stroke()}
  else if(kind==='walk'){g.arc(0,-8,2.6,0,7);g.fill();g.beginPath();g.moveTo(0,-5);g.lineTo(0,3);g.lineTo(-4,10);g.moveTo(0,3);g.lineTo(4,10);g.moveTo(-5,-2);g.lineTo(5,0);g.stroke()}
  else if(kind==='P'){g.strokeRect(-8,-8,16,16);g.font='700 13px sans-serif';g.textAlign='center';g.fillText('P',0,5)}
  g.restore()}
// ===== one continuous globe camera for 22.9–60.4 s =====
const GK=[[20,120,22,3.25],[22.86,118,24,3.2],[26.05,116,28,3.1],[34.87,111,26,3.6],[43.08,104,22,3.9],[50.14,97,22,3.2],[55.08,87,19,3.5],[60.40,72,12,3.5],[64,70,12,3.5]];
function camG(T){let i=1;while(i<GK.length-2&&T>GK[i+1][0])i++;const p0=GK[i-1],p1=GK[i],p2=GK[i+1],p3=GK[Math.min(i+2,GK.length-1)];const u=clamp((T-p1[0])/(p2[0]-p1[0]));
  const cr=(a,b,c,d)=>0.5*((2*b)+(-a+c)*u+(2*a-5*b+4*c-d)*u*u+(-a+3*b-3*c+d)*u*u*u);const lon=cr(p0[1],p1[1],p2[1],p3[1]),lat=cr(p0[2],p1[2],p2[2],p3[2]),dist=cr(p0[3],p1[3],p2[3],p3[3]);camGlobe(lon,lat,dist)}
// ===== 东城案例段：真实楼体 + 环绕机位 =====
function sceneDCReal(t){const lt=LT(t);const save=cityCam;window.NOHERO=1;
  cityCam=()=>{const az=0.9+lt*0.035,R0=17-4*ease(clamp(lt/9)),h=12-3*ease(clamp(lt/9));setCam([Math.sin(az)*R0,h,Math.cos(az)*R0],[0.5,0,-1],42)};
  drawCityDC(t);cityCam=save;window.NOHERO=0;
  const la=clamp(lt/0.8);text('北京 · 东城区',120,1000,30,`rgba(233,238,249,${la})`,'left',600,4)}
