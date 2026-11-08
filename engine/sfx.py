# usage: python3 sfx.py raw.mp3 events.json out.mp3
# events.json: {"gaps":[[t,dur],...] (optional silence inserted at raw time t),
#   "boom":[t..],"hit":[t..],"whoosh":[t..],"pop":[t..],"tick":[t..],"ding":[t..],"key":[t..],"riser":[[t,dur],..]}
# All event times are in FINAL (post-gap) seconds. Keeps SFX well under the voice.
import sys, json, subprocess, wave, numpy as np
SR=44100; raw,evf,out=sys.argv[1:4]; ev=json.load(open(evf))
x=np.frombuffer(subprocess.check_output(["ffmpeg","-v","error","-i",raw,"-ac","1","-ar",str(SR),"-f","s16le","-"]),np.int16).astype(np.float32)/32768
parts=[];prev=0
for t,d in sorted(ev.get("gaps",[])):
    i=int(t*SR);parts+=[x[prev:i],np.zeros(int(d*SR),np.float32)];prev=i
parts.append(x[prev:]);v=np.concatenate(parts+[np.zeros(int(.4*SR),np.float32)])
N=len(v);s=np.zeros(N,np.float32);rng=np.random.default_rng(1)
def env(n,a,d): t=np.arange(n)/SR; return np.minimum(1,t/a)*np.exp(-t/d)
def lp(z,c):
    y=np.zeros_like(z);a=0
    for i in range(len(z)): a+=c*(z[i]-a);y[i]=a
    return y
def sweep(n,c0,c1,p=1.4):
    z=rng.standard_normal(n);c=np.linspace(c0,c1,n)**p;o=np.zeros(n);y=0
    for i in range(n): y+=c[i]*(z[i]-y);o[i]=y
    return o
def boom(): n=int(.8*SR);t=np.arange(n)/SR;f=65*np.exp(-t*4)+36;return np.sin(2*np.pi*np.cumsum(f)/SR)*env(n,.004,.35)
def hit(): n=int(.5*SR);t=np.arange(n)/SR;f=110*np.exp(-t*10)+42;return np.sin(2*np.pi*np.cumsum(f)/SR)*env(n,.002,.14)+lp(rng.standard_normal(n),.3)*env(n,.001,.04)*.5
def whoosh(): n=int(.36*SR);t=np.arange(n)/SR;return sweep(n,.03,.4)*np.sin(np.pi*t/t[-1])**2*1.7
def pop(): n=int(.09*SR);t=np.arange(n)/SR;f=500+1500*t/t[-1];return np.sin(2*np.pi*np.cumsum(f)/SR)*env(n,.002,.03)
def tick(): n=int(.05*SR);t=np.arange(n)/SR;return np.sin(2*np.pi*2200*t)*env(n,.001,.01)
def ding(): n=int(SR);t=np.arange(n)/SR;return (np.sin(2*np.pi*1318*t)+.6*np.sin(2*np.pi*1975*t)+.3*np.sin(2*np.pi*2637*t))*env(n,.002,.28)*.5
def key(): n=int(.04*SR);return lp(rng.standard_normal(n),.6)*env(n,.0005,.008)*1.4
def riser(d): n=int(d*SR);t=np.arange(n)/SR;return sweep(n,.02,.5,2)*(t/t[-1])**2*1.2
G={"boom":(boom,.6),"hit":(hit,.42),"whoosh":(whoosh,.26),"pop":(pop,.13),"tick":(tick,.18),"ding":(ding,.16),"key":(key,.25)}
def add(t,z,g):
    i=int(t*SR);z=z[:max(0,N-i)];s[i:i+len(z)]+=z*g
for k,(fn,g) in G.items():
    for t in ev.get(k,[]): add(t,fn(),g)
for t,d in ev.get("riser",[]): add(t,riser(d),.18)
m=v+s;m/=max(1,np.abs(m).max()/.97)
w=wave.open(out+".wav","wb");w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((m*32767).astype(np.int16).tobytes());w.close()
subprocess.run(["ffmpeg","-y","-v","error","-i",out+".wav","-b:a","192k",out],check=True)
print(N/SR)
