# Forge SFX kit: pop (bar drop), thud (big bar), hit (gone), ding (check), buzz (cross), whoosh. usage: python3 sfx.py out.wav dur "kind@t,kind@t,..."
import sys,wave,numpy as np
SR=44100
def env(n,a,d):t=np.arange(n)/SR;return np.minimum(1,t/a)*np.exp(-t*d)
def pop(): n=int(.12*SR);t=np.arange(n)/SR;f=900*np.exp(-t*25)+300;return np.sin(2*np.pi*np.cumsum(f)/SR)*env(n,.002,35)*.5
def thud(): n=int(.35*SR);t=np.arange(n)/SR;f=120*np.exp(-t*10)+45;return np.sin(2*np.pi*np.cumsum(f)/SR)*env(n,.003,9)*.9
def hit():
    n=int(.9*SR);t=np.arange(n)/SR;r=np.random.default_rng(3).standard_normal(n)
    return (np.sin(2*np.pi*np.cumsum(70*np.exp(-t*6)+38)/SR)*np.exp(-t*4)*.9+r*np.exp(-t*25)*.35)
def ding(): n=int(.7*SR);t=np.arange(n)/SR;return (np.sin(2*np.pi*1568*t)+.4*np.sin(2*np.pi*2349*t))*env(n,.003,6)*.3
def buzz(): n=int(.35*SR);t=np.arange(n)/SR;return np.sign(np.sin(2*np.pi*110*t))*env(n,.005,8)*.18
def whoosh():
    n=int(.4*SR);t=np.arange(n)/SR;r=np.random.default_rng(5).standard_normal(n);w=np.sin(np.pi*t/.4)**2
    return np.convolve(r,np.ones(30)/30,'same')*w*.5
K=dict(pop=pop,thud=thud,hit=hit,ding=ding,buzz=buzz,whoosh=whoosh)
out,dur,spec=sys.argv[1],float(sys.argv[2]),sys.argv[3]
o=np.zeros(int(dur*SR))
for item in spec.split(','):
    k,tt=item.split('@');s=K[k]();i=int(float(tt)*SR);e=min(len(o),i+len(s));o[i:e]+=s[:e-i]
o=o/max(1,np.abs(o).max()/.9)
w=wave.open(out,'wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((o*32767).astype(np.int16).tobytes());w.close()
