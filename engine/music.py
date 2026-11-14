# usage: python3 music.py vo.mp3 out.mp3 [bpm]  — adds a quiet driving beat bed (kick/hat/sub) ducked under the voice.
import sys, subprocess, wave, numpy as np
SR=44100; vo,out=sys.argv[1:3]; bpm=float(sys.argv[3]) if len(sys.argv)>3 else 104
v=np.frombuffer(subprocess.check_output(["ffmpeg","-v","error","-i",vo,"-ac","1","-ar",str(SR),"-f","s16le","-"]),np.int16).astype(np.float32)/32768
N=len(v); m=np.zeros(N,np.float32); beat=60/bpm; rng=np.random.default_rng(3)
def env(n,a,d): t=np.arange(n)/SR; return np.minimum(1,t/a)*np.exp(-t/d)
def kick(): n=int(.35*SR);t=np.arange(n)/SR;f=120*np.exp(-t*25)+48;return np.sin(2*np.pi*np.cumsum(f)/SR)*env(n,.002,.12)
def hat(): n=int(.05*SR);z=rng.standard_normal(n);z=np.diff(np.concatenate([[0],z]));return z*env(n,.0005,.012)*.35
def sub(f,d): n=int(d*SR);t=np.arange(n)/SR;return np.sin(2*np.pi*f*t)*env(n,.01,d*.5)*.5
notes=[55,55,65.4,49]
def add(t,z,g):
    i=int(t*SR);z=z[:max(0,N-i)];m[i:i+len(z)]+=z*g
t=0;k=0
while t<N/SR-.3:
    add(t,kick(),1.0)
    add(t+beat/2,hat(),1.0); add(t+beat*.75,hat(),.6)
    if k%2==0: add(t,sub(notes[(k//8)%4],beat*1.8),1.0)
    t+=beat;k+=1
# duck under voice (envelope follower)
e=np.abs(v); w=int(.08*SR); e=np.convolve(e,np.ones(w)/w,'same'); duck=1-0.55*np.clip(e/0.08,0,1)
mix=v+m*0.16*duck
fade=np.ones(N);fl=int(.6*SR);fade[-fl:]=np.linspace(1,0,fl);mix*=np.where(np.arange(N)>N-fl,fade,1)
mix/=max(1,np.abs(mix).max()/.97)
wv=wave.open(out+".wav","wb");wv.setnchannels(1);wv.setsampwidth(2);wv.setframerate(SR);wv.writeframes((mix*32767).astype(np.int16).tobytes());wv.close()
subprocess.run(["ffmpeg","-y","-v","error","-i",out+".wav","-b:a","192k",out],check=True); print("music ok")
