# usage: python3 prep.py <dir>   (dir has raw0.mp3 + cfg.json with "lines": 14 sentences)
# -> raw.mp3 (atempo 1.08, pauses tightened), seg.json (final times incl. guess gaps), dur.json, events.json
import sys, json, subprocess, re
d=sys.argv[1]; cfg=json.load(open(f'{d}/cfg.json')); L=cfg['lines']
def run(c): return subprocess.run(c,capture_output=True,text=True)
run(['ffmpeg','-y','-v','error','-i',f'{d}/raw0.mp3','-filter:a','atempo=1.08',f'{d}/fast.mp3'])
def chunks(f,d_min):
    err=run(['ffmpeg','-i',f,'-af',f'silencedetect=noise=-35dB:d={d_min}','-f','null','-']).stderr
    dur=float(run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]).stdout)
    ss=[float(x) for x in re.findall(r'silence_start: ([\d.]+)',err)]; se=[float(x) for x in re.findall(r'silence_end: ([\d.]+)',err)]
    out=[];cur=0.0
    for a,b in zip(ss,se):
        if a>cur+0.04: out.append([cur,a])
        cur=b
    if dur>cur+0.04: out.append([cur,dur])
    return out
def align(ch,L,W1=1.0,W2=2.0,W3=6):
    """Assign consecutive speech chunks to script lines (dynamic programming).
    Cost = how well each line's length fits its syllable share (log ratio)
         + a boundary placed in a short pause (lines usually end on a long pause)
         + a long pause left inside one line."""
    import math
    w=[len(re.findall(r'[aeiouy]+',x.lower()))+0.5 for x in L]
    T=ch[-1][1]-ch[0][0]; exp=[T*x/sum(w) for x in w]
    gap=[ch[i+1][0]-ch[i][1] for i in range(len(ch)-1)]
    n,m=len(ch),len(L); INF=1e18
    f=[[INF]*(n+1) for _ in range(m+1)]; bk=[[0]*(n+1) for _ in range(m+1)]; f[0][0]=0
    for i in range(1,m+1):
        for j in range(i,n+1):
            for k in range(i-1,j):
                if f[i-1][k]>=INF: continue
                dd=ch[j-1][1]-ch[k][0]
                c=W1*math.log(max(dd,.05)/exp[i-1])**2
                c+=W3*sum(max(0,g-0.22) for g in gap[k:j-1])
                if j<n: c+=W2*max(0,0.32-gap[j-1])
                c+=f[i-1][k]
                if c<f[i][j]: f[i][j]=c; bk[i][j]=k
    if f[m][n]>=INF: return None
    segs=[];j=n
    for i in range(m,0,-1):
        k=bk[i][j]; segs.append([ch[k][0],ch[j-1][1]]); j=k
    return segs[::-1]
segs=cfg.get('segs')
if not segs:
    ch=chunks(f'{d}/fast.mp3',0.05)
    if len(ch)>=len(L): segs=align(ch,L)
if not segs: sys.exit('could not align: too few pauses')
for (a,b),t in zip(segs,L): print(f'{b-a:5.2f}s  {t}')
# tighten: cap pauses at 0.22s (keeps energy), build new audio
parts=[];t=0;out=[]
prev_end=None
for i,(a,b) in enumerate(segs):
    s0=max(0,a-0.04); e0=b+0.05
    parts.append((s0,e0)); out.append([round(t+(a-s0),3),round(t+(b-s0),3),L[i]]); t+=e0-s0+0.18
flt=';'.join(f'[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS,apad=pad_dur=0.18[p{i}]' for i,(a,b) in enumerate(parts))
cat=''.join(f'[p{i}]' for i in range(len(parts)))+f'concat=n={len(parts)}:v=0:a=1[o]'
r=run(['ffmpeg','-y','-v','error','-i',f'{d}/fast.mp3','-filter_complex',flt+';'+cat,'-map','[o]',f'{d}/raw.mp3'])
if r.returncode: sys.exit(r.stderr)
# guess gaps after myth claims (seg 3 and 8)
G=0.8; gaps=[]
shift=0;final=[]
for i,(a,b,txt) in enumerate(out):
    final.append([round(a+shift,3),round(b+shift,3),txt])
    if i in (3,8): gaps.append([round(b+0.1,3),G]); shift+=G
json.dump(final,open(f'{d}/seg.json','w'))
st=[x[0] for x in final]; en=[x[1] for x in final]
total=float(run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f'{d}/raw.mp3']).stdout)+G*2+0.4
json.dump(round(total,2),open(f'{d}/dur.json','w'))
ev={"gaps":gaps,"boom":[0.02],"hit":[st[4],st[9]],"whoosh":[st[2]-.2,st[7]-.2,st[12]-.2],
 "pop":[st[1],st[3]-.1,st[8]-.1,st[13],st[13]+.15,st[5],st[10]],
 "tick":[en[3]+.1+k*.25 for k in range(3)]+[en[8]+.1+k*.25 for k in range(3)],"ding":[st[6]+.3,st[11]+.3],
 "riser":[[en[3]-.1,st[4]-en[3]+.1],[en[8]-.1,st[9]-en[8]+.1]]}
json.dump(ev,open(f'{d}/events.json','w'))
print('segments ok', total)
