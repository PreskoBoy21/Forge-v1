# usage: python3 explainer_prep.py <dir>   (dir has raw0.mp3 + cfg.json with "lines" and "scenes")
# -> raw.mp3 (atempo 1.08, pauses tightened), seg.json, dur.json, events.json (sfx at scene changes)
import sys, json, subprocess, re, math
d = sys.argv[1]; cfg = json.load(open(f'{d}/cfg.json')); L = cfg['lines']
def run(c): return subprocess.run(c, capture_output=True, text=True)
run(['ffmpeg', '-y', '-v', 'error', '-i', f'{d}/raw0.mp3', '-filter:a', 'atempo='+str(cfg.get('tempo',1.08)), f'{d}/fast.mp3'])
def dur_of(f): return float(run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).stdout)
def chunks(f, d_min):
    err = run(['ffmpeg', '-i', f, '-af', f'silencedetect=noise=-35dB:d={d_min}', '-f', 'null', '-']).stderr
    T = dur_of(f)
    ss = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', err)]; se = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', err)]
    out = []; cur = 0.0
    for a, b in zip(ss, se):
        if a > cur + 0.04: out.append([cur, a])
        cur = b
    if T > cur + 0.04: out.append([cur, T])
    return out
def align(ch, L, W1=1.0, W2=2.0, W3=6):
    w = [len(re.findall(r'[aeiouy]+', x.lower())) + 0.5 for x in L]
    T = ch[-1][1] - ch[0][0]; exp = [T * x / sum(w) for x in w]
    gap = [ch[i + 1][0] - ch[i][1] for i in range(len(ch) - 1)]
    n, m = len(ch), len(L); INF = 1e18
    f = [[INF] * (n + 1) for _ in range(m + 1)]; bk = [[0] * (n + 1) for _ in range(m + 1)]; f[0][0] = 0
    for i in range(1, m + 1):
        for j in range(i, n + 1):
            for k in range(i - 1, j):
                if f[i - 1][k] >= INF: continue
                dd = ch[j - 1][1] - ch[k][0]
                c = W1 * math.log(max(dd, .05) / exp[i - 1]) ** 2 + W3 * sum(max(0, g - 0.22) for g in gap[k:j - 1])
                if j < n: c += W2 * max(0, 0.32 - gap[j - 1])
                c += f[i - 1][k]
                if c < f[i][j]: f[i][j] = c; bk[i][j] = k
    if f[m][n] >= INF: return None
    segs = []; j = n
    for i in range(m, 0, -1):
        k = bk[i][j]; segs.append([ch[k][0], ch[j - 1][1]]); j = k
    return segs[::-1]
segs = cfg.get('segs')
if not segs:
    ch = chunks(f'{d}/fast.mp3', 0.05)
    segs = align(ch, L) if len(ch) >= len(L) else None
if not segs: sys.exit('could not align: too few pauses')
for (a, b), t in zip(segs, L): print(f'{b - a:5.2f}s  {t}')
parts = []; t = 0; out = []
for i, (a, b) in enumerate(segs):
    s0 = max(0, a - 0.04); e0 = b + 0.05
    parts.append((s0, e0)); out.append([round(t + (a - s0), 3), round(t + (b - s0), 3), L[i]]); t += e0 - s0 + 0.16
flt = ';'.join(f'[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS,apad=pad_dur=0.16[p{i}]' for i, (a, b) in enumerate(parts))
cat = ''.join(f'[p{i}]' for i in range(len(parts))) + f'concat=n={len(parts)}:v=0:a=1[o]'
r = run(['ffmpeg', '-y', '-v', 'error', '-i', f'{d}/fast.mp3', '-filter_complex', flt + ';' + cat, '-map', '[o]', f'{d}/raw.mp3'])
if r.returncode: sys.exit(r.stderr)
json.dump(out, open(f'{d}/seg.json', 'w'))
TAIL = cfg.get('tail', 2.2)
total = dur_of(f'{d}/raw.mp3') + TAIL
json.dump(round(total, 2), open(f'{d}/dur.json', 'w'))
st = [x[0] for x in out]
starts = [st[s['l']] for s in cfg['scenes']]
ev = {"gaps": [], "boom": [0.02], "whoosh": [max(0, x - .18) for x in starts[1:]],
      "pop": [st[l] + .1 for s in cfg['scenes'] for l in s.get('pops', [])],
      "ding": [st[l] + .5 for l in cfg.get('dings', [])], "hit": [st[h[0]]+h[1] if isinstance(h,list) else st[h] for h in cfg.get('hits', [])],
      "tick": [st[h[0]]+h[1] for h in cfg.get('ticks', [])]}
json.dump(ev, open(f'{d}/events.json', 'w'))
print('segments ok', total)
