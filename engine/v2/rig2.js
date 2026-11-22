// Forge figure v2 — anatomical side-view rig (SVG). Figure faces RIGHT.
// Every segment is drawn in its own local frame: x along the bone (proximal → distal),
// local -y = anatomical FRONT, +y = BACK. Segments are defined so that in a standing
// pose they all point downwards (neck→pelvis, shoulder→elbow, hip→knee ...).
const NS = 'http://www.w3.org/2000/svg';
const V = {
  add: (a, b) => [a[0] + b[0], a[1] + b[1]], sub: (a, b) => [a[0] - b[0], a[1] - b[1]],
  mul: (a, s) => [a[0] * s, a[1] * s], len: a => Math.hypot(a[0], a[1]),
  nrm: a => { const l = Math.hypot(a[0], a[1]) || 1; return [a[0] / l, a[1] / l]; },
  // direction from angle in degrees: 0 = straight down, +90 = pointing RIGHT (forward), -90 = back, 180 = up
  dir: d => [Math.sin(d * Math.PI / 180), Math.cos(d * Math.PI / 180)],
  ang: v => Math.atan2(v[0], v[1]) * 180 / Math.PI,
};
const P = { // lengths (px) for a ~330 px tall figure
  neck: 14, torso: 104, thigh: 84, shin: 82, foot: 30, heel: 7, ua: 60, fa: 52, head: 17,
};
// side profiles: [t, front, back] (half-widths in px)
const PROF = {
  torso: [[0, 12, 15], [.08, 18, 19], [.18, 23, 21], [.3, 22, 20], [.42, 17, 17], [.55, 15, 14], [.7, 15, 13], [.82, 16, 16], [.93, 16, 21], [1, 15, 22]],
  thigh: [[0, 15, 20], [.12, 17, 18], [.35, 18, 15], [.6, 15, 13], [.85, 11, 10], [1, 9, 9]],
  shin: [[0, 8, 9], [.15, 8, 12], [.3, 7, 15], [.5, 6, 12], [.75, 5, 7], [1, 4.5, 5]],
  ua: [[0, 14, 14], [.18, 13, 13], [.42, 11, 11], [.6, 11.5, 11], [.85, 7.5, 7.5], [1, 6.5, 6.5]],
  fa: [[0, 7, 7.5], [.2, 8.5, 8.5], [.55, 6.5, 6], [1, 4.5, 4.5]],
  neck: [[0, 7, 7], [1, 7.5, 8]],
};
function sample(prof, t) {
  for (let i = 0; i < prof.length - 1; i++) {
    const [t0, f0, b0] = prof[i], [t1, f1, b1] = prof[i + 1];
    if (t <= t1) { const u = (t - t0) / (t1 - t0 || 1), s = .5 - .5 * Math.cos(Math.PI * u); return [f0 + (f1 - f0) * s, b0 + (b1 - b0) * s]; }
  }
  const l = prof[prof.length - 1]; return [l[1], l[2]];
}
// smooth closed path through points (Catmull-Rom → cubic Bézier)
function smooth(pts, closed = true) {
  const n = pts.length, P2 = i => pts[(i + n) % n];
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = closed ? P2(i - 1) : pts[Math.max(0, i - 1)], p1 = P2(i), p2 = P2(i + 1), p3 = closed ? P2(i + 2) : pts[Math.min(n - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d + (closed ? 'Z' : '');
}
// outline of a segment in local coords (length L), rounded ends
function segPath(prof, L, scale = 1, cap = true) {
  const N = 18, top = [], bot = [];
  for (let i = 0; i <= N; i++) { const t = i / N, [f, b] = sample(prof, t); top.push([t * L, -f * scale]); bot.push([t * L, b * scale]); }
  const [fe, be] = sample(prof, 1), [fs, bs] = sample(prof, 0), pts = [...top];
  if (cap) pts.push([L + (fe + be) * .32 * scale, (be - fe) / 2 * scale]);
  pts.push(...bot.reverse());
  if (cap) pts.push([-(fs + bs) * .3 * scale, (bs - fs) / 2 * scale]);
  return smooth(pts);
}
// a muscle belly on one side of a segment: region between outer edge and an inner curve
function bellyPath(prof, L, side, t0, t1, depth = .62, inset = .94) {
  const N = 14, outer = [], inner = [];
  for (let i = 0; i <= N; i++) {
    const t = t0 + (t1 - t0) * i / N, [f, b] = sample(prof, t), w = side < 0 ? f : b;
    const taper = Math.sin(Math.PI * i / N) ** .7;
    outer.push([t * L, side * w * inset]);
    inner.push([t * L, side * w * (inset - depth * taper)]);
  }
  return smooth([...outer, ...inner.reverse()]);
}
function striations(prof, L, side, t0, t1, n = 3) {
  let d = '';
  for (let k = 1; k <= n; k++) {
    const q = k / (n + 1), pts = [];
    for (let i = 0; i <= 8; i++) { const t = t0 + (t1 - t0) * (.12 + .76 * i / 8), [f, b] = sample(prof, t), w = side < 0 ? f : b; pts.push([t * L, side * w * (.9 - .5 * q * Math.sin(Math.PI * i / 8))]); }
    d += smooth(pts, false);
  }
  return d;
}

class Fig {
  constructor(svg) { this.svg = svg; this.root = this.el('g', {}, svg); }
  el(t, a, p) { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); (p || this.root).appendChild(e); return e; }
  frame(A, B) { const d = V.sub(B, A), th = Math.atan2(d[1], d[0]) * 180 / Math.PI; return this.el('g', { transform: `translate(${A[0].toFixed(1)},${A[1].toFixed(1)}) rotate(${th.toFixed(2)})` }); }
  // draw one limb segment with muscles
  seg(name, A, B, M, far, muscles) {
    const L = V.len(V.sub(B, A)), g = this.frame(A, B), prof = PROF[name];
    this.el('path', { d: segPath(prof, L), fill: far ? 'url(#skinFar)' : 'url(#skin)', stroke: far ? '#1a1a1a' : '#7d7d7d', 'stroke-width': .8 }, g);
    for (const m of muscles || []) {
      const a = Math.max(0, Math.min(1, M[m.k] || 0));
      if (a > .03) {
        this.el('path', { d: bellyPath(prof, L, m.side, m.t0, m.t1, m.depth || .62), fill: 'url(#musc)', opacity: (far ? .45 : .35) + .65 * a, filter: a > .5 ? 'url(#mglow)' : '' }, g);
        if (!far) this.el('path', { d: striations(prof, L, m.side, m.t0, m.t1, m.n || 3), fill: 'none', stroke: '#8a2f00', 'stroke-width': .8, opacity: .55 * a }, g);
      } else if (!far) {
        this.el('path', { d: bellyPath(prof, L, m.side, m.t0, m.t1, m.depth || .62), fill: 'none', stroke: '#9a9a9a', 'stroke-width': .7, opacity: .55 }, g);
      }
    }
    return g;
  }
  torso(N, H, M) {
    const L = V.len(V.sub(H, N)), g = this.frame(N, H), pr = PROF.torso;
    this.el('path', { d: segPath(pr, L, 1, false), fill: 'url(#skin)', stroke: '#7d7d7d', 'stroke-width': .8 }, g);
    const mus = [
      { k: 'chest', side: -1, t0: .06, t1: .36, depth: .75, n: 4 },
      { k: 'abs', side: -1, t0: .42, t1: .86, depth: .42, n: 0 },
      { k: 'obliques', side: -1, t0: .48, t1: .9, depth: .9, n: 0 },
      { k: 'traps', side: 1, t0: -.02, t1: .2, depth: .55, n: 2 },
      { k: 'back', side: 1, t0: .12, t1: .58, depth: .7, n: 4 },
      { k: 'lowerback', side: 1, t0: .55, t1: .86, depth: .45, n: 2 },
    ];
    for (const m of mus) {
      const a = Math.max(0, Math.min(1, M[m.k] || 0));
      this.el('path', { d: bellyPath(pr, L, m.side, m.t0, m.t1, m.depth), fill: a > .03 ? 'url(#musc)' : 'none', stroke: a > .03 ? 'none' : '#9a9a9a', 'stroke-width': .7, opacity: a > .03 ? .35 + .65 * a : .55, filter: a > .5 ? 'url(#mglow)' : '' }, g);
      if (a > .03 && m.n) this.el('path', { d: striations(pr, L, m.side, m.t0, m.t1, m.n), fill: 'none', stroke: '#8a2f00', 'stroke-width': .8, opacity: .5 * a }, g);
    }
    // six-pack segment lines (front)
    for (const t of [.52, .62, .72]) { const [f] = sample(pr, t); this.el('path', { d: `M${t * L},${-f * .93} Q${t * L + 3},${-f * .7} ${t * L},${-f * .5}`, stroke: (M.abs || 0) > .03 ? '#8a2f00' : '#9a9a9a', 'stroke-width': .9, fill: 'none', opacity: .6 }, g); }
    // shorts waistband + shorts over pelvis
    const s0 = .84, [fw, bw] = sample(pr, s0);
    this.el('path', { d: smooth([[s0 * L, -fw - 1], [L * .97, -16], [L + 3, -12], [L + 4, 12], [L * .97, 21], [s0 * L, bw + 1]]), fill: 'url(#shorts)' }, g);
    this.el('line', { x1: s0 * L, y1: -fw - 1, x2: s0 * L, y2: bw + 1, stroke: '#FF6A1A', 'stroke-width': 2.2 }, g);
    return g;
  }
  glute(H, Hdir, M, front) { // buttock: behind and below the hip joint, oriented with the pelvis
    const back = [-front[0], -front[1]], c = V.add(V.add(H, V.mul(back, 9)), V.mul(Hdir, 6));
    const a = Math.max(0, Math.min(1, M.glutes || 0)), rot = (Math.atan2(Hdir[1], Hdir[0]) * 180 / Math.PI).toFixed(1);
    const g = this.el('g', { transform: `translate(${c[0].toFixed(1)},${c[1].toFixed(1)}) rotate(${rot})` });
    // local +x = down the pelvis, +y = back (rotated frame) → shape bulges to the back
    const d = smooth([[-12, -6], [-6, 9], [4, 14], [14, 9], [16, -2], [8, -10], [-4, -11]]);
    if (a > .03) {
      this.el('path', { d, fill: 'url(#musc)', opacity: .45 + .55 * a, filter: a > .5 ? 'url(#mglow)' : '' }, g);
      this.el('path', { d: 'M-8,2 Q4,10 13,4 M-4,-4 Q6,4 15,-2', stroke: '#8a2f00', 'stroke-width': .8, fill: 'none', opacity: .5 * a }, g);
    } else this.el('path', { d, fill: 'url(#shorts)', stroke: '#333', 'stroke-width': .8 }, g);
  }
  gluteBelly(H, K, M) { // glute = rounded mass behind the hip, drawn in the thigh frame, overlapping the pelvis
    const g = this.frame(H, K), a = Math.max(0, Math.min(1, M.glutes || 0));
    const d = smooth([[-14, 4], [-8, 17], [6, 23], [26, 21], [38, 13], [30, 4], [8, 2]]);
    this.el('path', { d, fill: a > .03 ? 'url(#musc)' : 'url(#shorts)', opacity: a > .03 ? .4 + .6 * a : 1, stroke: a > .03 ? 'none' : '#333', 'stroke-width': .8, filter: a > .5 ? 'url(#mglow)' : '' }, g);
    if (a > .03) this.el('path', { d: 'M-6,10 Q12,18 30,14 M-2,15 Q14,22 32,18', stroke: '#8a2f00', 'stroke-width': .8, fill: 'none', opacity: .5 * a }, g);
  }
  head(N, up, fwd) { // N = neck top. up = unit vector up the neck, fwd = facing direction
    const c = V.add(V.add(N, V.mul(up, 16)), V.mul(fwd, 3)), r = P.head, th = (Math.atan2(fwd[1], fwd[0]) * 180 / Math.PI).toFixed(1);
    const g = this.el('g', { transform: `translate(${c[0].toFixed(1)},${c[1].toFixed(1)}) rotate(${th})` });
    // local: +x = face direction, -y = up (when fwd = right)
    this.el('path', { d: smooth([[-r * .9, -r * .2], [-r * .55, -r * .95], [r * .3, -r * 1.02], [r * .95, -r * .45], [r * 1.05, r * .1], [r * 1.18, r * .22], [r * 1.0, r * .38], [r * .95, r * .62], [r * .55, r * 1.02], [r * .05, r * .95], [-r * .45, r * .62], [-r * .9, r * .3]]), fill: 'url(#skin)', stroke: '#7d7d7d', 'stroke-width': .8 }, g);
    this.el('path', { d: smooth([[-r * .98, -r * .05], [-r * .75, -r * .85], [r * .1, -r * 1.12], [r * .85, -r * .72], [r * .7, -r * .55], [r * .05, -r * .62], [-r * .35, -r * .28], [-r * .6, r * .15]]), fill: '#1b1b1b' }, g); // hair
    this.el('ellipse', { cx: -r * .12, cy: r * .12, rx: r * .16, ry: r * .24, fill: '#cfcfcf', stroke: '#8a8a8a', 'stroke-width': .7 }, g); // ear
    this.el('circle', { cx: r * .62, cy: -r * .12, r: 1.4, fill: '#222' }, g); // eye
    this.el('path', { d: `M${r * .45},${-r * .3} L${r * .78},${-r * .32}`, stroke: '#333', 'stroke-width': 1.1 }, g); // brow
  }
  hand(Wr, dirv, far) {
    const th = (Math.atan2(dirv[1], dirv[0]) * 180 / Math.PI).toFixed(1), g = this.el('g', { transform: `translate(${Wr[0].toFixed(1)},${Wr[1].toFixed(1)}) rotate(${th})` });
    const f = far ? '#5c5c5c' : '#ececec', st = far ? '#2a2a2a' : '#8c8c8c';
    this.el('path', { d: smooth([[0, -5], [7, -6.5], [13, -5], [15, 0], [13, 5.5], [6, 6.5], [0, 5]]), fill: f, stroke: st, 'stroke-width': .8 }, g);
    if (!far) this.el('path', { d: 'M8,-5.5 Q11,0 8,5.5 M11,-5 Q14,0 11,5', stroke: st, 'stroke-width': .6, fill: 'none' }, g);
  }
  _handOld(Wr, dirv, far) { const c = V.add(Wr, V.mul(dirv, 6)); this.el('ellipse', { cx: c[0], cy: c[1], rx: 7.5, ry: 6.5, transform: `rotate(${(Math.atan2(dirv[1], dirv[0]) * 180 / Math.PI).toFixed(1)} ${c[0]} ${c[1]})`, fill: far ? '#5c5c5c' : '#e9e9e9', stroke: far ? '#2a2a2a' : '#888', 'stroke-width': .8 }); }
  shoe(Ank, footDeg, far) { // footDeg: angle of the foot from the ankle (90 = flat, pointing forward)
    const g = this.el('g', { transform: `translate(${Ank[0].toFixed(1)},${Ank[1].toFixed(1)}) rotate(${(90 - footDeg).toFixed(1)})` });
    this.el('path', { d: smooth([[-9, -6], [4, -9], [18, -5], [28, 0], [29, 6], [-10, 7], [-12, 1]]), fill: far ? '#2a2a2a' : '#f1f1f1', stroke: far ? '#111' : '#999', 'stroke-width': .8 }, g);
    this.el('path', { d: 'M-11,5 L29,5', stroke: '#FF6A1A', 'stroke-width': 2.2, opacity: far ? .5 : 1 }, g);
  }
  // full body from joint positions. J: {neck, hip, sh, elbF, handF, elbB, handB, kneeF, ankF, footF, kneeB, ankB, footB}
  body(J, M) {
    const down = V.nrm(V.sub(J.hip, J.neck)), front = [down[1], -down[0]]; // local -y of the torso frame
    const facing = front;
    const LIMB = {
      ua: [{ k: 'delts', side: -1, t0: -.05, t1: .32, depth: .8, n: 2 }, { k: 'delts', side: 1, t0: -.05, t1: .3, depth: .8, n: 0 }, { k: 'biceps', side: -1, t0: .3, t1: .86, depth: .62 }, { k: 'triceps', side: 1, t0: .22, t1: .84, depth: .62 }],
      fa: [{ k: 'forearm', side: -1, t0: .05, t1: .6, depth: .6, n: 2 }],
      thigh: [{ k: 'quads', side: -1, t0: .08, t1: .92, depth: .72, n: 4 }, { k: 'hamstrings', side: 1, t0: .3, t1: .92, depth: .6 }],
      shin: [{ k: 'calves', side: 1, t0: .1, t1: .66, depth: .7, n: 3 }, { k: 'shins', side: -1, t0: .08, t1: .7, depth: .4, n: 0 }],
    };
    // far side first (darker)
    this.seg('ua', J.sh, J.elbB, M, true, LIMB.ua); this.seg('fa', J.elbB, J.handB, M, true, LIMB.fa); this.hand(J.handB, V.nrm(V.sub(J.handB, J.elbB)), true);
    this.seg('thigh', J.hip, J.kneeB, M, true, LIMB.thigh); this.seg('shin', J.kneeB, J.ankB, M, true, LIMB.shin); this.shoe(J.ankB, J.footB, true);
    // neck + head
    const neckTop = V.add(J.neck, V.mul(down, -P.neck));
    this.seg('neck', neckTop, V.add(J.neck, V.mul(down, 4)), M, false, []);
    this.head(neckTop, V.mul(down, -1), facing);
    this.torso(J.neck, J.hip, M);
    // near leg
    this.seg('thigh', J.hip, J.kneeF, M, false, LIMB.thigh);
    // shorts leg
    { const g = this.frame(J.hip, J.kneeF), Lt = V.len(V.sub(J.kneeF, J.hip)); this.el('path', { d: smooth([[-6, -18], [Lt * .38, -19], [Lt * .4, 0], [Lt * .38, 19], [-6, 23]]), fill: 'url(#shorts)' }, g); this.el('path', { d: `M${Lt * .38},-18.5 L${Lt * .38},18.5`, stroke: '#FF6A1A', 'stroke-width': 1.6 }, g); }
    this.glute(J.hip, down, M, front);
    this.seg('shin', J.kneeF, J.ankF, M, false, LIMB.shin); this.shoe(J.ankF, J.footF, false);
    this.el('circle', { cx: J.kneeF[0], cy: J.kneeF[1], r: 9.5, fill: '#e4e4e4', stroke: '#8a8a8a', 'stroke-width': .6, opacity: .9 });
    // near arm last (in front of the torso)
    this.seg('ua', J.sh, J.elbF, M, false, LIMB.ua); this.seg('fa', J.elbF, J.handF, M, false, LIMB.fa); this.hand(J.handF, V.nrm(V.sub(J.handF, J.elbF)), false);
  }
}
// 2-bone IK: returns middle joint. bend = preferred side vector for the middle joint
function ik(a, c, l1, l2, bend) {
  const d0 = V.sub(c, a); let d = Math.min(V.len(d0), l1 + l2 - .01); d = Math.max(d, Math.abs(l1 - l2) + .01);
  const ang = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)))), base = Math.atan2(d0[1], d0[0]);
  const e1 = [a[0] + l1 * Math.cos(base + ang), a[1] + l1 * Math.sin(base + ang)], e2 = [a[0] + l1 * Math.cos(base - ang), a[1] + l1 * Math.sin(base - ang)];
  const s1 = (e1[0] - a[0]) * bend[0] + (e1[1] - a[1]) * bend[1], s2 = (e2[0] - a[0]) * bend[0] + (e2[1] - a[1]) * bend[1];
  return s1 >= s2 ? e1 : e2;
}
