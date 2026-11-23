// Hinge family for figure v2: RDL, deadlift, barbell row. Needs rig2.js (Fig, V, P, ik) and ex2.js (ease, squat).
// Bar is kept over mid-foot; arms hang straight unless rowing. Shoulder→hip distance = torso - 12.
const MID=298, ANK=[290,516], ARM=P.ua+P.fa-2, SH2HIP=P.torso-12;
function bar(F,p){F.el('circle',{cx:p[0],cy:p[1],r:44,fill:'url(#plate)'});}
function barFront(F,p){F.el('circle',{cx:p[0],cy:p[1],r:44,fill:'none',stroke:'#FF6A1A','stroke-width':2,opacity:.35});F.el('circle',{cx:p[0],cy:p[1],r:6,fill:'#d8d8d8'});}
// core solver: shin angle s (deg forward), shoulder position sh → full joint set
function hingeJoints(s,sh,round){
  const A=ANK, K=V.add(A,V.mul([Math.sin(s*Math.PI/180),-Math.cos(s*Math.PI/180)],P.shin));
  let H=ik(K,sh,P.thigh,SH2HIP,[-1,.2]);
  const up=V.nrm(V.sub(sh,H)); const N=V.add(H,V.mul(up,P.torso));
  // rounded back: push the neck down/forward (spine flexion look)
  let Nn=N; if(round){const fw=[up[1]*-1,up[0]];Nn=V.add(N,V.add(V.mul(up,-round*10),V.mul([-fw[0],-fw[1]],0)));Nn=V.add(Nn,[round*6,round*10]);}
  const Ab=V.add(A,[-9,-1]),Kb=ik(V.add(H,[-3,0]),Ab,P.thigh,P.shin,[1,-.3]);
  return {A,K,H,N:Nn,Ab,Kb};
}
function drawBody(F,j,sh,hand,elb,M){
  F.body({neck:j.N,hip:j.H,sh,elbF:elb,handF:hand,elbB:V.add(elb,[-4,-2]),handB:V.add(hand,[-3,-2]),kneeF:j.K,ankF:j.A,footF:90,kneeB:j.Kb,ankB:j.Ab,footB:90},M);
}
function hangArm(sh,hand){return ik(sh,hand,P.ua,P.fa,[-1,0]);}
// RDL: soft knees, hips travel back, bar to just below the knee
function rdl(F,k){
  const s=9*Math.min(1,k*3), by=372+(452-372)*k, hand=[MID,by], sh=[MID+3,by-ARM];
  const j=hingeJoints(s,sh,0); bar(F,hand);
  drawBody(F,j,sh,hand,hangArm(sh,hand),{hamstrings:.35+.65*k,glutes:.3+.6*k,lowerback:.3+.2*k,forearm:.4});
  barFront(F,hand); return {mid:MID,bar:hand,knee:j.K,hip:j.H,ham:V.add(V.mul(j.H,.45),V.mul(j.K,.55)),back:V.add(V.mul(j.H,.6),V.mul(j.N,.4))};
}
// Deadlift: bar from the floor, more knee bend, hips lower
function deadlift(F,k){
  const s=26*k, by=372+(484-372)*k, hand=[MID,by], sh=[MID+6*k,by-ARM];
  const j=hingeJoints(s,sh,0); bar(F,hand);
  drawBody(F,j,sh,hand,hangArm(sh,hand),{quads:.3+.6*k,glutes:.4+.5*k,hamstrings:.3+.3*k,lowerback:.4+.4*k,back:.3+.3*k,traps:.5,forearm:.5});
  barFront(F,hand); return {mid:MID,bar:hand,knee:j.K,hip:j.H,ham:V.add(V.mul(j.H,.45),V.mul(j.K,.55)),back:V.add(V.mul(j.H,.6),V.mul(j.N,.4))};
}
// Barbell row. k = pull (0 hang → 1 bar at torso). bad: too upright + swings up + pulls to chest
function row(F,k,bad){
  const hy=bad?392:440, swing=bad?7*k:0;
  const sh0=[MID+(bad?2:8),hy-ARM+swing*0]; 
  let j=hingeJoints(bad?8:14,[sh0[0]-swing*1.2,sh0[1]-swing*2.2],0);
  const sh=[sh0[0]-swing*1.2,sh0[1]-swing*2.2];
  const up=V.nrm(V.sub(sh,j.H)), fw=[-up[1],up[0]].map(x=>-x); // front of torso
  const front=[up[1]*-1,up[0]]; const fr=V.dot?0:0;
  const f2=[-up[1],up[0]]; const frontv=(f2[0]>0)?f2:[-f2[0],-f2[1]];
  const tgtT=bad?.28:.72; // where the bar touches: chest vs lower belly
  const touch=V.add(V.add(j.H,V.mul(V.sub(j.N,j.H),1-tgtT)),V.mul(frontv,30));
  const hang=[MID,hy];
  const hand=V.add(V.mul(hang,1-k),V.mul(touch,k));
  const backv=[-frontv[0],-frontv[1]];
  const elb=ik(sh,hand,P.ua,P.fa,V.add(V.mul(backv,1),V.mul(up,.6)));
  bar(F,hand);
  const M=bad?{traps:.5+.5*k,biceps:.4+.5*k,back:.25+.15*k,lowerback:.5+.4*k,delts:.3+.3*k,forearm:.5}:{back:.35+.65*k,traps:.3+.3*k,delts:.25+.3*k,biceps:.2+.2*k,hamstrings:.35,lowerback:.35,forearm:.4};
  drawBody(F,j,sh,hand,elb,M); barFront(F,hand);
  return {mid:MID,bar:hand,knee:j.K,hip:j.H,elbow:elb,lats:V.add(V.mul(j.H,.45),V.mul(j.N,.55)),traps:V.add(V.mul(j.N,.9),V.mul(j.H,.1)),back:V.add(V.mul(j.H,.6),V.mul(j.N,.4))};
}
const EX={squat:(F,k,a)=>squat(F,k,a),rdl:(F,k)=>rdl(F,k),deadlift:(F,k)=>deadlift(F,k),row:(F,k,a)=>row(F,k,a)};
