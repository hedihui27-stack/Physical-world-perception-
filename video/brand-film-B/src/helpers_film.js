
const ease=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
const W=1920,H=1080; let g=document.getElementById("c").getContext("2d");
const FONT='"Noto Sans CJK SC",sans-serif';
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),lerp=(a,b,k)=>a+(b-a)*k;
// ---- tokens (from world-sensors/vision-center/js/tokens.js)
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
function ramp(stops){const p=stops.map(([v,c])=>[v,hex(c)]);return v=>{if(v<=p[0][0])return p[0][1];for(let i=1;i<p.length;i++)if(v<=p[i][0]){const t=(v-p[i-1][0])/(p[i][0]-p[i-1][0]);return p[i-1][1].map((x,k)=>x+(p[i][1][k]-x)*t)}return p[p.length-1][1]}}
const R={altitude:ramp([[0,'#1f3a6e'],[2500,'#2b6fae'],[6000,'#3fb3bf'],[9500,'#9ce07e'],[13000,'#fdf6c7']]),
 speedSea:ramp([[0,'#25364f'],[2,'#2a6793'],[6,'#30b39f'],[9,'#9adc7c'],[12,'#f4f2bd']]),
 speedLand:ramp([[0,'#2b3a4d'],[12,'#5f9e5a'],[26,'#b9d85f'],[40,'#f7f0b4']]),
 density:ramp([[0,'#3a4a6b'],[0.35,'#4f7fb8'],[0.7,'#6fc9c0'],[1,'#eaf3c9']])};
const ORBIT=['#ffd45c','#ffa94d','#ff7a6b'],CAM='#ff6b8a';
const rgba=(c,a)=>`rgba(${c[0]|0},${c[1]|0},${c[2]|0},${a})`;
// ---- camera
let M,F;
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],norm=a=>{const l=Math.hypot(...a)||1;return a.map(x=>x/l)};
function setCam(p,t,fov=38){const f=norm(sub(t,p)),r=norm(cross(f,[0,1,0])),u=cross(r,f);M={p,f,r,u};F=(H/2)/Math.tan(fov*Math.PI/360)}
function proj(v){const d=sub(v,M.p),z=dot(d,M.f);if(z<0.01)return null;return[W/2+dot(d,M.r)*F/z,H/2-dot(d,M.u)*F/z,z]}
const ll=(lat,lon,r=1)=>{const a=lat*Math.PI/180,o=lon*Math.PI/180;return[r*Math.cos(a)*Math.cos(o),r*Math.sin(a),-r*Math.cos(a)*Math.sin(o)]};
function occluded(v){const d=sub(v,M.p),L=Math.hypot(...d),u=d.map(x=>x/L),tca=-dot(M.p,u);if(tca<0||tca>L)return false;return dot(M.p,M.p)-tca*tca<0.995}
// move point along heading (deg) by km
function step(lat,lon,hd,km){const R0=6371,d=km/R0,a=lat*Math.PI/180,o=lon*Math.PI/180,h=hd*Math.PI/180;const a2=Math.asin(Math.sin(a)*Math.cos(d)+Math.cos(a)*Math.sin(d)*Math.cos(h));const o2=o+Math.atan2(Math.sin(h)*Math.sin(d)*Math.cos(a),Math.cos(d)-Math.sin(a)*Math.sin(a2));return[a2*180/Math.PI,o2*180/Math.PI]}
// satellites
function sat(e,ts){const[inc,raan,ecc,argp,M0,nrev]=e;const n=nrev*2*Math.PI/86400;const a=Math.cbrt(398600.4418/(n*n))/6371;let Mm=(M0*Math.PI/180+n*ts)%(2*Math.PI),E=Mm;for(let i=0;i<5;i++)E-= (E-ecc*Math.sin(E)-Mm)/(1-ecc*Math.cos(E));
 const xv=a*(Math.cos(E)-ecc),yv=a*Math.sqrt(1-ecc*ecc)*Math.sin(E);const w=argp*Math.PI/180,O=raan*Math.PI/180,i=inc*Math.PI/180;
 const x=(Math.cos(O)*Math.cos(w)-Math.sin(O)*Math.sin(w)*Math.cos(i))*xv+(-Math.cos(O)*Math.sin(w)-Math.sin(O)*Math.cos(w)*Math.cos(i))*yv;
 const y=(Math.sin(O)*Math.cos(w)+Math.cos(O)*Math.sin(w)*Math.cos(i))*xv+(-Math.sin(O)*Math.sin(w)+Math.cos(O)*Math.cos(w)*Math.cos(i))*yv;
 const z=(Math.sin(w)*Math.sin(i))*xv+(Math.cos(w)*Math.sin(i))*yv;const r=Math.hypot(x,y,z);const rv=1+0.36*Math.log(r);const s=rv/r;
 const altkm=(a-1)*6371;return{v:[x*s,z*s,-y*s],cls:altkm<2000?0:altkm<30000?1:2}}
let D;
function text(t,x,y,size,col,align='left',weight=400,ls=0){g.font=`${weight} ${size}px ${FONT}`;g.fillStyle=col;g.textAlign=align;g.textBaseline='alphabetic';if(ls){g.letterSpacing=ls+'px'}g.fillText(t,x,y);g.letterSpacing='0px'}
function legendRamp(x,y,label,rf,lo,hi,from,to){text(label,x,y,20,'#93a0ba');const w=220;for(let i=0;i<w;i++){g.fillStyle=rgba(rf(lerp(lo,hi,i/w)),1);g.fillRect(x+i,y+10,1,8)}text(from,x,y+42,17,'#5d6882');text(to,x+w,y+42,17,'#5d6882','right')}
function legendDot(x,y,col,label){g.fillStyle=col;g.beginPath();g.arc(x+6,y-6,6,0,7);g.fill();text(label,x+20,y,20,'#93a0ba')}
function vignette(){const v=g.createRadialGradient(W/2,H/2,H*0.4,W/2,H/2,H*1.05);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,0.6)');g.fillStyle=v;g.fillRect(0,0,W,H)}
function bg(){g.fillStyle='#05070f';g.fillRect(0,0,W,H);const s=(t=>{let x=7;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296}})();for(let i=0;i<500;i++){g.fillStyle=`rgba(200,215,255,${s()*0.35})`;g.fillRect(s()*W,s()*H,1,1)}}

