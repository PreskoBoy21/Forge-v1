# usage: segs.py audio.mp3 N  -> prints N speech segments [start,end] using the N-1 largest silences
import sys,subprocess,re,json
a,N=sys.argv[1],int(sys.argv[2])
o=subprocess.run(['ffmpeg','-i',a,'-af','silencedetect=noise=-35dB:d=0.12','-f','null','-'],capture_output=True,text=True).stderr
st=[float(x) for x in re.findall(r'silence_start: ([\d.]+)',o)];en=[float(x) for x in re.findall(r'silence_end: ([\d.]+)',o)]
dur=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',a]))
sil=[(s,e) for s,e in zip(st,en) if s>0.05 and e<dur-0.05]
gaps=sorted(sorted(sil,key=lambda x:x[1]-x[0],reverse=True)[:N-1])
segs=[];cur=0.0
for s,e in gaps: segs.append([round(cur,2),round(s,2)]);cur=e
segs.append([round(cur,2),round(dur,2)])
print(json.dumps(segs))
