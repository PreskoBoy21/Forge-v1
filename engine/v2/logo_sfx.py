# FORGE sonic logo: anvil-like hit + two rising tones (~1.6 s). usage: python3 logo_sfx.py out.wav
import sys,wave,numpy as np
SR=44100;n=int(1.8*SR);t=np.arange(n)/SR;o=np.zeros(n)
o+=np.sin(2*np.pi*(55+90*np.exp(-t*30))*t)*np.exp(-t*4)*.9                      # sub impact
rng=np.random.default_rng(1);o+=rng.standard_normal(n)*np.exp(-t*40)*.25          # transient
for f,d in [(1318.5,0),(1975.5,.14)]:                                              # metallic ping E6 -> B6
    tt=np.clip(t-d,0,None);g=(t>=d)*np.exp(-tt*3.2)
    o+=(np.sin(2*np.pi*f*tt)+.35*np.sin(2*np.pi*f*2.76*tt)*np.exp(-tt*8))*g*.28
o/=np.abs(o).max()/.9
w=wave.open(sys.argv[1],'wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((o*32767).astype(np.int16).tobytes());w.close()
