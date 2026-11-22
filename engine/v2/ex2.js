const stage=document.getElementById('stage');
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
function floorLine(F){F.el('ellipse',{cx:300,cy:528,rx:210,ry:10,fill:'#FF6A1A',opacity:.13});F.el('rect',{x:80,y:526,width:440,height:2,fill:'#FF6A1A',opacity:.35});}
// SQUAT. k: 0 standing → 1 bottom. bad=true: heels lift, knees shoot forward, chest drops
function squat(F,k,bad){
  const ax=290, ay=516, heel=bad? 10*k:0;
  const A=[ax, ay-heel], mid=ax+8;
  const s=bad? 44*k : 30*k;               // shin forward lean
  const q=bad? 82*k : 98*k;               // thigh angle from vertical (going back)
  const K=V.add(A,V.mul([Math.sin(s*Math.PI/180),-Math.cos(s*Math.PI/180)],P.shin));
  const H=V.add(K,V.mul([-Math.sin(q*Math.PI/180),-Math.cos(q*Math.PI/180)],P.thigh));
  // torso lean solved so the bar (on the upper back) stays over midfoot
  let a=0; for(let i=0;i<40;i++){const N=V.add(H,V.mul([Math.sin(a*Math.PI/180),-Math.cos(a*Math.PI/180)],P.torso));const bar=V.add(N,V.mul([-Math.cos(a*Math.PI/180),-Math.sin(a*Math.PI/180)],9));a+= (mid-bar[0])*0.4; }
  if(bad) a+=14*k;                        // chest collapses forward → bar drifts past midfoot
  const N=V.add(H,V.mul([Math.sin(a*Math.PI/180),-Math.cos(a*Math.PI/180)],P.torso));
  const down=V.nrm(V.sub(H,N)), back=[-down[1],down[0]].map(x=>-x);
  const backv=[-(down[1]),down[0]]; // pointing back
  const sh=V.add(N,V.mul(down,12));
  const bar=V.add(V.add(N,V.mul(down,2)),V.mul([-down[1]*-1,down[0]*-1],-11));
  const barC=V.add(N,V.add(V.mul(down,3),V.mul([down[1]*-1,-down[0]*-1],0)));
  const B=V.add(V.add(N,V.mul(down,4)),V.mul([-down[1],down[0]].map(x=>x),-0));
  // bar on upper traps: behind the neck
  const front=[down[1],-down[0]], bk=[-front[0],-front[1]];
  const barP=V.add(V.add(N,V.mul(down,5)),V.mul(bk,12));
  const hand=V.add(barP,V.mul(front,-2));
  const elb=V.add(V.add(sh,V.mul(down,40)),V.mul(bk,20)); // arm is foreshortened (goes out to the side)
  F.el('circle',{cx:barP[0],cy:barP[1],r:44,fill:'url(#plate)'});
  const Ab=V.add(A,[-9,-1]),Kb=ik(V.add(H,[-3,0]),Ab,P.thigh,P.shin,[1,-.3]);
  const M=bad?{quads:.55+.4*k,glutes:.3*k,lowerback:.95*k,abs:.3}:{quads:.35+.65*k,glutes:.3+.7*k,hamstrings:.2+.3*k,lowerback:.25+.25*k,abs:.4};
  F.body({neck:N,hip:H,sh,elbF:elb,handF:hand,elbB:V.add(elb,[-4,-2]),handB:V.add(hand,[-3,-2]),kneeF:K,ankF:A,footF:90+heel*2.2,kneeB:Kb,ankB:Ab,footB:90+heel*2.2},M);
  F.el('circle',{cx:barP[0],cy:barP[1],r:44,fill:'none',stroke:'#FF6A1A','stroke-width':2,opacity:.35});F.el('circle',{cx:barP[0],cy:barP[1],r:6,fill:'#d8d8d8'});
  return {mid,bar:barP,knee:K,heel:V.add(A,[-8,6]),hip:H,toe:V.add(A,[26,6])};
}
function render(t,mode){
  stage.innerHTML='';stage.setAttribute('transform','translate(-140,-190) scale(1.5)');const F=new Fig(stage);floorLine(F);
  const c=t%3.2,k=c<1.3?ease(c/1.3):c<1.6?1:c<2.6?1-ease((c-1.6)/1):0;
  const r=squat(F,k,mode==='bad');
  // midfoot guide line
  F.el('line',{x1:r.mid,y1:110,x2:r.mid,y2:526,stroke:mode==='bad'?'#FF3B3B':'#FFFFFF','stroke-dasharray':'5 7','stroke-width':1.5,opacity:.45});
}
window.render=render;
