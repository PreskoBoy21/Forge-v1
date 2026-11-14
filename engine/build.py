import json,sys,os
SKEL=os.path.join(os.path.dirname(os.path.abspath(__file__)),'skel.html')
D=sys.argv[1];os.chdir(D)
CF=json.load(open('cfg.json'))
S=json.load(open('seg.json'))  # 14 segments [a,b,text], final (post-gap) times
DUR=json.load(open('dur.json'))
s=open(SKEL).read()
PRESETS={
 'myth':   dict(badge='MYTH',     q='TRUE OR FALSE?',       a='TRUE',  b='FALSE',    stamp='FALSE',    strike=True,  which='WHICH ONE DID<br>YOU <span class="o">BELIEVE?</span>', c='MYTH'),
 'mistake':dict(badge='MISTAKE',  q='DO YOU DO THIS?',      a='FINE',  b='MISTAKE',  stamp='MISTAKE',  strike=True,  which='WHICH ONE DO<br>YOU <span class="o">DO?</span>',      c='MISTAKE'),
 'versus': dict(badge='ROUND',    q='WHICH BUILDS MORE?',   a='A',     b='B',        stamp='WINNER',   strike=False, which='WHICH ONE DO<br>YOU <span class="o">TRAIN?</span>',   c='ROUND'),
 'swap':   dict(badge='SWAP',     q='MOST LIFTERS DO THIS', a='KEEP',  b='SWAP IT',  stamp='SWAP IT',  strike=True,  which='WHICH ONE WILL<br>YOU <span class="o">SWAP?</span>',  c='SWAP'),
 'worth':  dict(badge='QUESTION', q='WORTH IT OR WASTE?',   a='WASTE', b='WORTH IT', stamp='WORTH IT', strike=False, which='DID THAT<br><span class="o">SURPRISE</span> YOU?',     c='Q'),
}
LB=dict(PRESETS[CF.get('format','myth')]); LB.update(CF.get('labels',{}))
IT=CF.get('items',[{},{}])  # optional per-item overrides: {a,b,stamp}
def lab(i,k): return IT[i].get(k,LB[k]) if i<len(IT) else LB[k]
st=[x[0] for x in S]; en=[x[1] for x in S]
M1=dict(m=st[2],cs=st[3],g=en[3],f=st[4],e=st[5],end=st[7]-.12)
M2=dict(m=st[7],cs=st[8],g=en[8],f=st[9],e=st[10],end=st[12]-.12)
C=st[12]
def chart(i,M,c):
    if 'values' not in c:
        return f'''<div class="a" style="left:820px;top:1150px" data-in="{M['e']+.2}" data-out="{M['end']}" data-fx="pop"><div class="chip" style="font-size:34px">{c['verdict']}</div></div>'''
    lab,val,unit,verdict=c['labels'],c['values'],c['unit'],c['verdict']
    mx=max(val)
    bars=''.join(f'<div class="bar" style="left:{40+k*150}px;width:110px" id="cb{i}{k}"></div><div id="cl{i}{k}" style="position:absolute;left:{20+k*150}px;width:150px;text-align:center;font-weight:900;font-size:34px">{v}{unit}</div><div class="sub" style="position:absolute;left:{k*150}px;width:190px;bottom:-60px;font-size:26px;text-align:center">{l}</div>' for k,(l,v) in enumerate(zip(lab,val)))
    return f'''<div class="a" style="left:820px;top:880px" data-in="{M['e']+.05}" data-out="{M['end']}" data-fx="fade"><div style="position:relative;width:340px;height:420px">{bars}
 <div style="position:absolute;left:0;right:0;bottom:-6px;height:6px;background:#3A4252"></div></div></div>
<div class="a" style="left:820px;top:1330px" data-in="{M['e']+.35}" data-out="{M['end']}" data-fx="pop"><div class="chip" style="font-size:30px">{verdict}</div></div>'''
props=chart(1,M1,CF['charts'][0])+chart(2,M2,CF['charts'][1])
H=CF['h2']
text=f'''<div class="a h1" style="left:540px;top:400px;font-size:{CF.get('hookSize',120)}px" data-in="0" data-out="{M1['m']-.05}" data-fx="slam">{CF['hook']}</div>
<div class="a" style="left:540px;top:{CF.get('chipTop',560)}px" data-in="{st[1]}" data-out="{M1['m']-.05}" data-fx="pop"><div class="chip" style="font-size:42px">{CF['hookChip']}</div></div>
<div id="myths"></div>
<div class="a h2" style="left:540px;top:430px" data-in="{st[5]}" data-out="{st[6]-.03}">{H[0]}</div>
<div class="a h2" style="left:540px;top:430px" data-in="{st[6]}" data-out="{M1['end']}">{H[1]}</div>
<div class="a h2" style="left:540px;top:430px" data-in="{st[10]}" data-out="{st[11]-.03}">{H[2]}</div>
<div class="a h2" style="left:540px;top:430px" data-in="{st[11]}" data-out="{M2['end']}">{H[3]}</div>
<div class="a h2" style="left:540px;top:400px" data-in="{C}" data-out="99">{LB['which']}</div>
<div class="a" style="left:330px;top:620px" data-in="{st[13]+.1}" data-out="99" data-fx="pop"><div class="btn" id="c1">{LB['c']} 1</div></div>
<div class="a" style="left:750px;top:620px" data-in="{st[13]+.25}" data-out="99" data-fx="pop"><div class="btn" id="c2">{LB['c']} 2</div></div>
<div class="a sub" style="left:540px;top:535px;color:var(--t)" data-in="{st[13]+.5}" data-out="99" data-fx="pop">COMMENT 1 OR 2 👇</div>
'''
timing=f'''const DUR={DUR};
const MY=[
 {{...{json.dumps(M1)},txt:{json.dumps(CF['myths'][0])},a:{json.dumps(lab(0,'a'))},b:{json.dumps(lab(0,'b'))},st:{json.dumps(lab(0,'stamp'))}}},
 {{...{json.dumps(M2)},txt:{json.dumps(CF['myths'][1])},a:{json.dumps(lab(1,'a'))},b:{json.dumps(lab(1,'b'))},st:{json.dumps(lab(1,'stamp'))}}}];
const LB={json.dumps(LB)};
const WH=[{M1['m']},{M2['m']},{C}];
(()=>{{let h='';MY.forEach((M,i)=>{{const dots=[0,1].map(k=>`<i class="${{k<=i?'on':''}}"></i>`).join('');
 h+=`<div class="a" style="left:540px;top:245px" data-in="${{M.m+.05}}" data-out="${{M.end}}" data-fx="pop"><div class="badge">${{LB.badge}} ${{i+1}}/2 ${{dots}}</div></div>
 <div class="a" style="left:540px;top:450px" data-in="${{M.cs-.15}}" data-out="${{M.e-.1}}" data-fx="pop"><div class="claim"><span class="q">${{LB.q}}</span>${{M.txt.toUpperCase()}}<div class="x" id="x${{i}}" style="${{LB.strike?'':'display:none'}}"></div></div></div>
 <div class="a" style="left:220px;top:680px" data-in="${{M.g-.25}}" data-out="${{M.f+.9}}" data-fx="pop"><div class="btn" id="bt${{i}}">${{M.a}}</div></div>
 <div class="a" style="left:860px;top:680px" data-in="${{M.g-.15}}" data-out="${{M.f+.9}}" data-fx="pop"><div class="btn" id="bf${{i}}">${{M.b}}</div></div>
 <div class="a" style="left:540px;top:690px" data-in="${{M.g-.05}}" data-out="${{M.f}}" data-fx="pop"><div class="ring"><svg viewBox="0 0 150 150"><circle cx="75" cy="75" r="64" fill="#12161D" stroke="#2C3442" stroke-width="10"/><circle id="rg${{i}}" cx="75" cy="75" r="64" fill="none" stroke="#C6F24E" stroke-width="10" stroke-linecap="round" stroke-dasharray="402" transform="rotate(-90 75 75)"/></svg><b id="rn${{i}}">3</b></div></div>
 <div class="a" style="left:540px;top:930px" data-in="${{M.f}}" data-out="${{M.f+.9}}" data-fx="slam" data-rot="-8"><div class="stamp" style="white-space:nowrap;font-size:${{Math.min(200,Math.floor(1250/Math.max(1,M.st.length)))}}px">${{M.st}}</div></div>`}});
 $('myths').innerHTML=h}})();
const SEG={json.dumps(S)};
const SWO=[[0,{M1['m']-.1}],[{M1['e']},{M1['end']}]];
'''
press=lambda: None
keys=f'''const K=[
 [0,{{bb:1,...rack,mouth:'grin',brow:.2}}],
 [{M1['m']},{{hy:1150,bb:1,...rack,mouth:'flat',brow:1.2,tilt:-5,tr:.01}}],
 [{M1['f']},{{mouth:'O',brow:1.4,tilt:0,tr:.15}}],
 [{M1['e']},{{hy:1080,cx:300,mouth:'grin',brow:0,tr:.4}}],
 [{M2['m']},{{hy:1160,bb:0,cx:540,...ik('L',-210,-150),...ik('R',210,-150),mouth:'o',brow:1.3,tilt:7,tr:.01}}],
 [{M2['f']},{{mouth:'O',brow:1.6,tilt:0,tr:.15}}],
 [{M2['e']},{{hy:1080,cx:300,LUA:96,LFA:96,RUA:96,RFA:96,flexL:1,flexR:1,mouth:'grin',brow:0,tr:.35}}],
 [{C},{{cx:540,flexL:0,flexR:0,...hips,mouth:'smile',brow:.5,tilt:5,tr:.01}}],
 [{st[13]},{{...ik('R',8,-340),tilt:6,mouth:'flat',brow:.8,tr:.3}}],
];
'''
def pd(i,M,c):
    if 'values' not in c: return ''
    mx=max(c['values'])
    return ''.join(f"  {{const p=eo(clamp((t-{M['e']+.25+k*.3})/.5));const h={int(300*v/mx)}*p;$('cb{i}{k}').style.height=h+'px';$('cl{i}{k}').style.bottom=(h+12)+'px';$('cl{i}{k}').style.opacity=p}}\n" for k,v in enumerate(c['values']))
propdata=pd(1,M1,CF['charts'][0])+pd(2,M2,CF['charts'][1])+f'''  ['c1','c2'].forEach((c,i)=>{{const on=Math.floor((t-{st[13]})*1.6)%2===i&&t>{st[13]+.6};const e=$(c);e.style.background=on?'#C6F24E':'';e.style.color=on?'#0A0C10':'';e.style.borderColor=on?'#C6F24E':''}});
'''
anim=f'''  let liftL=0,liftR=0,bob=0,rot=0;
  const press=win(t,[[0,{M1['m']-.1}],[{M1['e']+.15},{M1['end']-.1}]],.2);
  if(press>0){{const sp=t<{M1['m']}?4.2:6.5;const c=.5-.5*Math.cos(t*sp);['L','R'].forEach(s=>{{P[s+'UA']+=(60+98*c-P[s+'UA'])*press;P[s+'FA']+=(115-103*c-P[s+'FA'])*press}});bob=c*6*press}}
  const shrug=win(t,[[{M2['cs']},{M2['f']}]],.25);if(shrug>0){{bob+=Math.abs(Math.sin(t*5))*10*shrug}}
  const look=win(t,[[{M1['cs']},{M1['f']}]],.25);rot+=Math.sin(t*3)*2*look;
  if(t>{st[13]+.4}){{P.LFA+=Math.sin(t*9)*6}}
'''
s=s.replace('@@PROPS@@',props).replace('@@TEXT@@',text).replace('@@TIMING@@',timing).replace('@@KEYS@@',keys).replace('@@PROPDATA@@',propdata).replace('@@ANIM@@',anim)
s=s.replace("$('rn'+i).textContent=t<M.g+.6?'3':t<M.g+1.2?'2':'1';","{const q=(t-M.g)/(M.f-M.g);$('rn'+i).textContent=q<.34?'3':q<.67?'2':'1';}")
open('index.html','w').write(s)
