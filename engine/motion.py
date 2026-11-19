# usage: python3 motion.py <dir>   -> index.html  (needs cfg.json, seg.json, dur.json from explainer_prep.py)
# "Motion" style v3: After-Effects-like motion design. Off-black + film grain, Anton headlines, Inter Tight body,
# JetBrains Mono data labels, ONE accent (lime) + red only for "bad". Mask reveals, char/word staggers with
# expo/spring easing, shape-panel wipes, self-drawing lines/charts, counters, camera punch only on hits.
#
# Scene HTML (cfg.scenes[].html) uses .e elements with:
#   data-l (line idx it enters on)  data-dl (delay s)  data-fx = none|mask|words|chars|pop|slam|fade|panel
#   data-dim="<line idx>" -> dims to 30% from that line on.   data-rot (deg)
#   inside: .count[data-to]  .grow[data-w|data-h] (bar grows, its own data-l/dl)  svg .draw (stroke draws; data-l/dl/d)
#   .fill (box fills; data-l/dl)
# cfg.scenes[]: {l, tint: ""|red, cap: true|false, html}
import json, os, sys, base64
D = sys.argv[1]; os.chdir(D)
CF = json.load(open('cfg.json')); S = json.load(open('seg.json')); DUR = json.load(open('dur.json'))
FONTS = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fonts')
def ff(name, path, w):
    b = base64.b64encode(open(f'{FONTS}/{os.path.basename(path)}', 'rb').read()).decode()
    return f"@font-face{{font-family:'{name}';src:url(data:font/woff2;base64,{b}) format('woff2');font-weight:{w}}}"
fonts = ff('Anton', 'anton/files/anton-latin-400-normal.woff2', 400) + \
    ''.join(ff('Inter Tight', f'inter-tight/files/inter-tight-latin-{w}-normal.woff2', w) for w in (600, 800, 900)) + \
    ''.join(ff('JB', f'jetbrains-mono/files/jetbrains-mono-latin-{w}-normal.woff2', w) for w in (500, 700))
st = [x[0] for x in S]
sc = CF['scenes']
starts = [0.0 if i == 0 else st[s['l']] - .04 for i, s in enumerate(sc)]
ends = starts[1:] + [999]
body = ''.join(f"<div class='scene' data-a='{starts[i]}' data-b='{ends[i]}' data-tint='{s.get('tint','')}' data-cap='{1 if s.get('cap',True) else 0}'>{s['html'].replace('/>',' />')}</div>\n" for i, s in enumerate(sc))
html = r'''<!doctype html><html><head><meta charset="utf-8"><style>@@FONTS@@
:root{--bg:#0B0B0C;--fg:#F2F0EB;--mu:#7D7A75;--ac:#C8F04A;--rd:#FF4B4B;--ln:#2A2A2D}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:var(--bg);color:var(--fg);font-family:'Inter Tight',sans-serif}
#tint{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 38%,rgba(255,75,75,.22),rgba(255,75,75,0) 70%);opacity:0}
#world{position:absolute;inset:0;transform-origin:50% 40%}
.scene{position:absolute;inset:0;visibility:hidden}
.e{position:absolute;transform:translate(-50%,-50%);white-space:nowrap;text-align:center;opacity:0}
.an{font-family:'Anton';text-transform:uppercase;line-height:.92;letter-spacing:.005em}
.mono{font-family:'JB';font-weight:500;font-size:30px;letter-spacing:.14em;text-transform:uppercase;color:var(--mu)}
.ac{color:var(--ac)}.rd{color:var(--rd)}.mu{color:var(--mu)}
.m{display:inline-block;overflow:hidden;vertical-align:top;padding:0 .02em}
.m>i{display:inline-block;font-style:normal;will-change:transform}
.ch{display:inline-block;will-change:transform}
.panel{position:absolute;left:0;top:0;width:1080px;height:1920px;background:var(--ac);transform-origin:50% 100%;transform:scaleY(0)}
.track{position:relative;height:96px;background:#151517;border-radius:8px;overflow:hidden}
.grow{position:absolute;left:0;top:0;bottom:0;width:0;border-radius:8px}
.box{width:96px;height:96px;border:3px solid var(--ln);border-radius:10px;position:relative;overflow:hidden}
.box .fill{position:absolute;inset:0;background:var(--ac);transform:scaleY(0);transform-origin:50% 100%}
#hud{position:absolute;left:64px;right:64px;top:150px;display:flex;justify-content:space-between;font-family:'JB';font-weight:700;font-size:26px;letter-spacing:.2em;color:rgba(242,240,235,.55)}
#hud b{display:inline-block;width:16px;height:16px;background:var(--ac);margin-right:14px;vertical-align:1px}
#prog{position:absolute;left:0;top:0;height:6px;background:var(--ac)}
#cap{position:absolute;left:540px;top:1430px;transform:translate(-50%,-50%);width:960px;text-align:center;font-family:'Inter Tight';font-weight:900;font-size:62px;line-height:1.08;letter-spacing:-.01em;text-transform:uppercase;color:var(--fg)}
#cap span{display:inline-block;margin:0 9px;text-shadow:0 4px 18px rgba(0,0,0,.8)}
#cap span.on{color:var(--ac)}
canvas#grain{position:absolute;inset:0;width:1080px;height:1920px;opacity:.07;mix-blend-mode:screen}
#vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,transparent 60%,rgba(0,0,0,.55))}
</style></head><body>
<div id="tint"></div><div id="world">@@BODY@@</div>
<canvas id="grain" width="360" height="640"></canvas><div id="vig"></div>
<div id="hud"><span><b></b>FORGE</span><span id="chap">01 / 01</span></div><div id="cap"></div><div id="prog"></div>
<script>
const DUR=@@DUR@@,SEG=@@SEG@@,ST=SEG.map(x=>x[0]),HITS=@@HITS@@,KW=new Set(@@KW@@);
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const expo=p=>p>=1?1:1-Math.pow(2,-10*p), cub=p=>1-Math.pow(1-p,3), inq=p=>p*p*p;
const spring=p=>{if(p>=1)return 1;return 1-Math.exp(-7*p)*Math.cos(10*p)};
const $=id=>document.getElementById(id);
const tOf=e=>ST[+e.dataset.l]+(+(e.dataset.dl||0));
const SC=[...document.querySelectorAll('.scene')].map(el=>({el,a:+el.dataset.a,b:+el.dataset.b,tint:el.dataset.tint,cap:el.dataset.cap==='1'}));
$('chap').textContent='01 / '+String(SC.length).padStart(2,'0');
// split text for words/chars fx
document.querySelectorAll('.e[data-fx=words],.e[data-fx=mask]').forEach(e=>{
  const parts=e.dataset.fx==='mask'?[e.innerHTML]:e.innerHTML.split(/(<br>)/);
  e.innerHTML=parts.map(p=>p==='<br>'?p:(e.dataset.fx==='mask'?`<span class="m"><i>${p}</i></span>`:p.split(/ (?![^<]*>)/).map(w=>`<span class="m"><i>${w}</i></span>`).join(' '))).join('')});
document.querySelectorAll('.e[data-fx=chars]').forEach(e=>{
  const walk=n=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();[...c.textContent].forEach(ch=>{const s=document.createElement('span');s.className='ch';s.textContent=ch===' '?' ':ch;f.appendChild(s)});c.replaceWith(f)}else if(c.tagName!=='BR')walk(c)})};walk(e)});
const EL=[];SC.forEach(s=>s.el.querySelectorAll('.e').forEach(e=>{
  const tin=(+e.dataset.l===s0l(s)&&!e.dataset.dl&&e.dataset.fx==='none')?-1:tOf(e);
  EL.push({e,s,tin,fx:e.dataset.fx||'mask',rot:+(e.dataset.rot||0),dim:e.dataset.dim!==undefined?ST[+e.dataset.dim]:null,
    parts:[...e.querySelectorAll('.m>i')],chs:[...e.querySelectorAll('.ch')],panel:e.classList.contains('panel')})}));
function s0l(s){return +(s.el.querySelector('[data-l]')||{dataset:{l:-1}}).dataset.l}
const GR=[...document.querySelectorAll('.grow')].map(e=>({e,t:tOf(e),w:e.dataset.w,h:e.dataset.h,from:+(e.dataset.from||0),d:+(e.dataset.d||.8)}));
const FI=[...document.querySelectorAll('.fill')].map(e=>({e,t:tOf(e)}));
const CN=[...document.querySelectorAll('.count')].map(e=>({e,to:+e.dataset.to,t:tOf(e.closest('[data-l]')),pre:e.dataset.pre||''}));
const DR=[...document.querySelectorAll('.draw')].map(e=>{let L=2400;try{L=e.getTotalLength()}catch(_){};e.style.strokeDasharray=L;e.style.strokeDashoffset=L;return{e,L,t:tOf(e),d:+(e.dataset.d||.7)}});
// grain
const gc=$('grain').getContext('2d'),gi=gc.createImageData(360,640);
function grain(f){let s=(f*9301+49297)%233280;for(let i=0;i<gi.data.length;i+=4){s=(s*9301+49297)%233280;const v=s/233280*255;gi.data[i]=gi.data[i+1]=gi.data[i+2]=v;gi.data[i+3]=255}gc.putImageData(gi,0,0)}
// captions: 3 words, current word accent
const CH=[];SEG.forEach(([a,b,txt])=>{const w=txt.replace(/\.\.\./g,'').split(/\s+/).filter(Boolean);let acc=0;const tot=w.reduce((p,x)=>p+x.length+2,0);
  const tm=w.map(x=>{const s=a+(b-a)*acc/tot;acc+=x.length+2;return s});for(let i=0;i<w.length;i+=3)CH.push({s:tm[i],w:w.slice(i,i+3),ts:tm.slice(i,i+3),end:i+3>=w.length?b:tm[i+3]})});
let lastCh=-1;
function caption(t,on){const cap=$('cap');let k=-1;for(let i=0;i<CH.length;i++)if(CH[i].s<=t)k=i;
  if(!on||k<0||t>CH[k].end+.3){cap.style.opacity=0;return}const c=CH[k];
  if(k!==lastCh){cap.innerHTML=c.w.map(x=>`<span>${x.replace(/[,.?]$/,'')}</span>`).join(' ');lastCh=k}
  let a=0;c.ts.forEach((x,i)=>{if(x<=t)a=i});[...cap.children].forEach((s,i)=>{s.className=i===a?'on':'';s.style.opacity=c.ts[i]<=t?1:.4});
  const p=expo(clamp((t-c.s)/.18));cap.style.opacity=p;cap.style.transform=`translate(-50%,-50%) translateY(${(1-p)*24}px)`}
function render(t){
  let cur=SC[0];SC.forEach((s,i)=>{const on=t>=s.a-.01&&t<s.b+.3;s.el.style.visibility=on?'visible':'hidden';if(t>=s.a){cur=s;$('chap').textContent=String(i+1).padStart(2,'0')+' / '+String(SC.length).padStart(2,'0')}});
  for(const x of EL){const T=t-x.tin,out=t-x.s.b;let o=0,y=0,s=1,bl=0;
    if(T>=0||x.tin<0){
      const p=x.tin<0?1:T;
      if(x.fx==='none'){o=1}
      else if(x.fx==='fade'){o=cub(clamp(p/.4))}
      else if(x.fx==='pop'){const q=clamp(p/.55);o=clamp(p/.12);s=.6+.4*spring(q)}
      else if(x.fx==='slam'){const q=clamp(p/.28);o=clamp(p/.06);s=1.7-.7*expo(q);bl=(1-q)*10}
      else if(x.panel){const q=expo(clamp(p/.32));x.e.style.transformOrigin='50% 100%';x.e.style.transform=`scaleY(${q})`;o=1}
      else {o=1; // mask / words / chars
        x.parts.forEach((pi,i)=>{const q=expo(clamp((p-i*.07)/.55));pi.style.transform=`translateY(${(1-q)*105}%)`});
        x.chs.forEach((c,i)=>{const q=clamp((p-i*.028)/.5);c.style.transform=`translateY(${(1-expo(q))*90}px) rotate(${(1-expo(q))*8}deg)`;c.style.opacity=clamp(q*3)})}
    }
    if(out>-0.02&&x.s.b<900){const q=clamp((out+.02)/.22);
      if(x.panel){x.e.style.transformOrigin='50% 0%';x.e.style.transform=`scaleY(${1-expo(q)})`}
      else if(x.parts.length){x.parts.forEach(pi=>{pi.style.transform=`translateY(${-inq(q)*105}%)`})}
      else {o*=1-q;s*=1-.06*q}}
    if(x.dim!==null&&t>=x.dim)o*=1-.68*cub(clamp((t-x.dim)/.3));
    if(x.panel){x.e.style.opacity=1}else{x.e.style.opacity=o;x.e.style.transform=`translate(-50%,-50%) translateY(${y}px) scale(${s}) rotate(${x.rot}deg)`;x.e.style.filter=bl>.3?`blur(${bl}px)`:'none'}}
  for(const g of GR){const q=expo(clamp((t-g.t)/g.d));if(g.w!==undefined)g.e.style.width=(g.from+(+g.w-g.from)*q)+'%';if(g.h!==undefined)g.e.style.height=(g.from+(+g.h-g.from)*q)+'%'}
  for(const f of FI){f.e.style.transform=`scaleY(${expo(clamp((t-f.t)/.3))})`}
  for(const c of CN){const q=expo(clamp((t-c.t)/1.1));c.e.textContent=c.pre+Math.round(c.to*q).toLocaleString('en-US')}
  for(const d of DR){d.e.style.strokeDashoffset=d.L*(1-cub(clamp((t-d.t)/d.d)))}
  // tint (red scenes)
  $('tint').style.opacity=SC.reduce((v,s)=>s.tint==='red'?Math.max(v,clamp((t-s.a)/.25)*clamp((s.b-t)/.25)):v,0);
  // camera: slow push per scene, punch + small shake on hits only
  const ds=t-cur.a;let z=1+.025*cub(clamp(ds/3)),sx=0,sy=0;
  HITS.forEach(h=>{const d=t-h;if(d>=0&&d<.6){const k=Math.exp(-d*9);z+=.045*k;sx+=Math.sin(d*80)*9*k;sy+=Math.cos(d*70)*7*k}});
  $('world').style.transform=`translate(${sx}px,${sy}px) scale(${z})`;
  grain(Math.floor(t*30));
  $('prog').style.width=(t/DUR*1080)+'px';
  caption(t,cur.cap);
}
window.render=render;render(0);
</script></body></html>'''
hits = [st[h[0]] + h[1] if isinstance(h, list) else st[h] for h in CF.get('hits', [])]
html = html.replace('</style></head>', CF.get('css','')+'</style></head>',1)
html = html.replace('@@FONTS@@', fonts).replace('@@BODY@@', body).replace('@@DUR@@', json.dumps(DUR)).replace('@@SEG@@', json.dumps(S)) \
    .replace('@@HITS@@', json.dumps(hits)).replace('@@KW@@', json.dumps(CF.get('keywords', [])))
open('index.html', 'w').write(html)
print('motion built', len(sc), 'scenes')
