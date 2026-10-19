// ===== 第七版 · 色彩：找回蓝色与丰富的低饱和色；橙色线条一律变细 =====
// 1) restore the original cool→warm ramps (grade() below keeps them low-saturation)
R.altitude=ramp([[0,'#1f3550'],[2500,'#2c5f8a'],[6000,'#3f8f98'],[9500,'#8fb98a'],[13000,'#efe8cf']]);
R.density=ramp([[0,'#34465f'],[0.35,'#4f78a8'],[0.7,'#6fb3ad'],[1,'#ffd27a']]);
// 2) grade: uniform soft desaturation (keeps blue/teal/green, just quieter); brand orange stays vivid
grade=function(ctx){const im=ctx.getImageData(0,0,W,H),d=im.data;const SAT=0.95;
  for(let i=0;i<d.length;i+=4){const r=d[i],gg=d[i+1],b=d[i+2];const mx=Math.max(r,gg,b),mn=Math.min(r,gg,b);if(mx-mn<6)continue;
    const warm=r>=gg&&gg>b&&r-b>70;const s=warm?0.92:SAT;const l=0.3*r+0.59*gg+0.11*b;d[i]=l+(r-l)*s;d[i+1]=l+(gg-l)*s;d[i+2]=l+(b-l)*s}ctx.putImageData(im,0,0)};
// 3) every orange stroke becomes a hairline (≤0.9px, 40% of its width)
(()=>{const P=CanvasRenderingContext2D.prototype,st=P.stroke,sr=P.strokeRect;const tmp=document.createElement('canvas').getContext('2d');
  const isOr=s=>{if(typeof s!=='string')return false;let m=s.match(/rgba?\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)/);let r,g2,b;if(m){r=+m[1];g2=+m[2];b=+m[3]}else if(s[0]==='#'&&s.length===7){r=parseInt(s.slice(1,3),16);g2=parseInt(s.slice(3,5),16);b=parseInt(s.slice(5,7),16)}else return false;return r>200&&g2>110&&g2<225&&b<140};
  const wrap=f=>function(...a){if(isOr(this.strokeStyle)){const lw=this.lineWidth;this.lineWidth=Math.min(0.9,lw*0.4);f.apply(this,a);this.lineWidth=lw}else f.apply(this,a)};
  P.stroke=wrap(st);P.strokeRect=wrap(sr)})();
