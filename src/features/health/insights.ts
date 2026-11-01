/**
 * Forge health analysis — deterministic, testable.
 * Turns raw daily data (smart scale, watch, phone) into trends, a readiness
 * score and coach insights. The AI layer only rewrites these numbers into
 * friendly language; it never invents numbers itself.
 *
 * Ideas borrowed from the market:
 * - Weight trend instead of daily weight (MacroFactor-style EMA smoothing)
 * - Lean vs fat mass change from smart-scale body composition
 * - Readiness from sleep + HRV + resting HR vs your own baseline (Whoop/Bevel)
 * - Readiness changes today's training volume (our edge: it acts on the data)
 */
import type { DayPoint } from './types';

export type Goal = 'lose_fat' | 'build_muscle' | 'recomp';

const mean = (xs: number[]) =>
  xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : undefined;
const round = (n: number, d = 1) => Math.round(n * 10 ** d) / 10 ** d;
const vals = (days: DayPoint[], k: keyof DayPoint) =>
  days.map((d) => d[k]).filter((v): v is number => typeof v === 'number');

// ------------------------------------------------------------ weight trend

/** Exponential moving average over daily weigh-ins (gaps carry the trend). */
export function weightTrend(days: DayPoint[], alpha = 0.1) {
  const series: { date: string; scale?: number; trend: number }[] = [];
  let trend: number | undefined;
  for (const d of days) {
    if (d.weightKg !== undefined) {
      trend =
        trend === undefined ? d.weightKg : trend + alpha * (d.weightKg - trend);
    }
    if (trend !== undefined)
      series.push({ date: d.date, scale: d.weightKg, trend });
  }
  return series;
}

export type WeightSummary = {
  currentTrendKg: number;
  latestScaleKg?: number;
  weeklyChangeKg: number;
  weeklyChangePct: number;
  weighIns: number;
};

export function summarizeWeight(days: DayPoint[]): WeightSummary | undefined {
  const series = weightTrend(days);
  const weighIns = vals(days, 'weightKg').length;
  if (series.length < 2 || weighIns < 3) return undefined;
  const now = series[series.length - 1]!;
  const weekAgo = series[Math.max(0, series.length - 8)]!;
  const change = now.trend - weekAgo.trend;
  return {
    currentTrendKg: round(now.trend),
    latestScaleKg: vals(days, 'weightKg').at(-1),
    weeklyChangeKg: round(change, 2),
    weeklyChangePct: round((change / weekAgo.trend) * 100, 2),
    weighIns,
  };
}

// --------------------------------------------------------- body composition

export type CompositionSummary = {
  bodyFatPct: number;
  fatMassKg: number;
  leanMassKg: number;
  fatChangeKg: number; // over the window (≈4 weeks)
  leanChangeKg: number;
  windowDays: number;
};

/** Compares the first and last week of scale readings with body fat. */
export function summarizeComposition(
  days: DayPoint[],
): CompositionSummary | undefined {
  const rows = days
    .filter(
      (d) =>
        d.weightKg !== undefined &&
        (d.bodyFatPct !== undefined || d.leanMassKg !== undefined),
    )
    .map((d) => {
      const w = d.weightKg!;
      const lean = d.leanMassKg ?? w * (1 - d.bodyFatPct! / 100);
      return { date: d.date, w, lean, fat: w - lean };
    });
  if (rows.length < 6) return undefined;
  const k = Math.min(7, Math.floor(rows.length / 2));
  const first = rows.slice(0, k);
  const last = rows.slice(-k);
  const f0 = mean(first.map((r) => r.fat))!;
  const f1 = mean(last.map((r) => r.fat))!;
  const l0 = mean(first.map((r) => r.lean))!;
  const l1 = mean(last.map((r) => r.lean))!;
  const w1 = mean(last.map((r) => r.w))!;
  const span =
    (Date.parse(rows.at(-1)!.date) - Date.parse(rows[0]!.date)) / 86_400_000;
  return {
    bodyFatPct: round((f1 / w1) * 100),
    fatMassKg: round(f1),
    leanMassKg: round(l1),
    fatChangeKg: round(f1 - f0),
    leanChangeKg: round(l1 - l0),
    windowDays: Math.round(span),
  };
}

// ---------------------------------------------------------------- readiness

export type Readiness = {
  score: number; // 0–100
  level: 'high' | 'normal' | 'low';
  sleepHours?: number;
  hrvVsBaselinePct?: number;
  rhrVsBaselineBpm?: number;
  /** Training call derived from readiness. */
  training: 'push' | 'normal' | 'easy';
};

export function readiness(days: DayPoint[]): Readiness | undefined {
  if (!days.length) return undefined;
  const today = days.at(-1)!;
  const base = days.slice(-29, -1);
  const parts: { w: number; v: number }[] = [];

  if (today.sleepHours !== undefined) {
    parts.push({ w: 0.4, v: Math.min(1, today.sleepHours / 8) });
  }
  const hrvBase = mean(vals(base, 'hrvMs'));
  let hrvPct: number | undefined;
  if (today.hrvMs !== undefined && hrvBase) {
    hrvPct = ((today.hrvMs - hrvBase) / hrvBase) * 100;
    // −30% → 0, baseline → 0.75, +20% or more → 1
    parts.push({ w: 0.35, v: Math.max(0, Math.min(1, 0.75 + hrvPct / 80)) });
  }
  const rhrBase = mean(vals(base, 'restingHr'));
  let rhrDiff: number | undefined;
  if (today.restingHr !== undefined && rhrBase) {
    rhrDiff = today.restingHr - rhrBase;
    // +8 bpm → 0, baseline → 0.8, −4 bpm → 1
    parts.push({ w: 0.25, v: Math.max(0, Math.min(1, 0.8 - rhrDiff / 10)) });
  }
  if (!parts.length) return undefined;
  const wSum = parts.reduce((a, p) => a + p.w, 0);
  const score = Math.round(
    (parts.reduce((a, p) => a + p.w * p.v, 0) / wSum) * 100,
  );
  const level = score >= 75 ? 'high' : score >= 50 ? 'normal' : 'low';
  return {
    score,
    level,
    sleepHours: today.sleepHours,
    hrvVsBaselinePct: hrvPct === undefined ? undefined : Math.round(hrvPct),
    rhrVsBaselineBpm: rhrDiff === undefined ? undefined : round(rhrDiff),
    training: level === 'high' ? 'push' : level === 'low' ? 'easy' : 'normal',
  };
}

// ----------------------------------------------------------------- activity

export function summarizeActivity(days: DayPoint[]) {
  const last7 = mean(vals(days.slice(-7), 'steps'));
  const prev = mean(vals(days.slice(-35, -7), 'steps'));
  const sleep7 = mean(vals(days.slice(-7), 'sleepHours'));
  if (last7 === undefined && sleep7 === undefined) return undefined;
  return {
    avgSteps7d: last7 === undefined ? undefined : Math.round(last7),
    stepsChangePct:
      last7 !== undefined && prev
        ? Math.round(((last7 - prev) / prev) * 100)
        : undefined,
    avgSleep7d: sleep7 === undefined ? undefined : round(sleep7),
  };
}

// ----------------------------------------------------------------- insights

export type Insight = {
  id: string;
  tone: 'good' | 'warn' | 'bad' | 'info';
  title: string;
  body: string;
  action?: string;
};

export type Analysis = {
  weight?: WeightSummary;
  composition?: CompositionSummary;
  readiness?: Readiness;
  activity?: ReturnType<typeof summarizeActivity>;
  insights: Insight[];
};

export function analyze(days: DayPoint[], goal: Goal): Analysis {
  const weight = summarizeWeight(days);
  const composition = summarizeComposition(days);
  const ready = readiness(days);
  const activity = summarizeActivity(days);
  const out: Insight[] = [];

  if (ready) {
    if (ready.level === 'low') {
      out.push({
        id: 'readiness_low',
        tone: 'warn',
        title: `Readiness ${ready.score} — easy day`,
        body: 'Your sleep and heart data say you are under-recovered. Same weights, one set less per exercise today.',
        action: 'Gym Mode will drop one set automatically.',
      });
    } else if (ready.level === 'high') {
      out.push({
        id: 'readiness_high',
        tone: 'good',
        title: `Readiness ${ready.score} — go for it`,
        body: 'You are well recovered. Good day to push for a rep PR on your first lift.',
      });
    }
  }

  if (weight) {
    const pct = weight.weeklyChangePct;
    if (pct < -1.5) {
      out.push({
        id: 'loss_too_fast',
        tone: 'bad',
        title: 'Losing weight too fast',
        body: `Trend is ${weight.weeklyChangeKg} kg this week (${pct}%). Above 1%/week you risk losing muscle.`,
        action: 'Your calories go up at the next check-in.',
      });
    } else if (goal === 'lose_fat' && pct > -0.25) {
      out.push({
        id: 'loss_stalled',
        tone: 'info',
        title: 'Weight trend is flat',
        body: 'Normal for a week. If it stays flat next week, your coach lowers calories by 100.',
      });
    } else if (goal === 'lose_fat') {
      out.push({
        id: 'loss_on_track',
        tone: 'good',
        title: 'Right on track',
        body: `Trend ${weight.weeklyChangeKg} kg this week. That is the sweet spot for keeping muscle.`,
      });
    } else if (goal === 'build_muscle' && pct > 0.75) {
      out.push({
        id: 'gain_too_fast',
        tone: 'warn',
        title: 'Gaining too fast',
        body: `+${weight.weeklyChangeKg} kg this week. Above 0.5%/week most of the extra is fat.`,
      });
    }
  }

  if (composition && composition.windowDays >= 14) {
    if (composition.leanChangeKg <= -0.5 && composition.fatChangeKg < 0) {
      out.push({
        id: 'lean_loss',
        tone: 'warn',
        title: 'Protect your muscle',
        body: `Your scale shows −${Math.abs(composition.leanChangeKg)} kg lean mass in ${composition.windowDays} days. Hit your protein and keep lifting heavy.`,
        action: 'Protein target is now your #1 number.',
      });
    } else if (composition.leanChangeKg > 0.2 && composition.fatChangeKg <= 0) {
      out.push({
        id: 'recomp_win',
        tone: 'good',
        title: 'Muscle up, fat down',
        body: `+${composition.leanChangeKg} kg lean and ${composition.fatChangeKg} kg fat in ${composition.windowDays} days. This is what a recomp looks like.`,
      });
    }
  }

  if (activity?.avgSleep7d !== undefined && activity.avgSleep7d < 6.5) {
    out.push({
      id: 'short_sleep',
      tone: 'warn',
      title: `${activity.avgSleep7d} h sleep on average`,
      body: 'Short sleep makes more of your weight loss come from muscle. Aim for 7+ hours.',
    });
  }
  if (
    activity?.stepsChangePct !== undefined &&
    activity.stepsChangePct <= -25
  ) {
    out.push({
      id: 'steps_drop',
      tone: 'info',
      title: `Steps down ${Math.abs(activity.stepsChangePct)}%`,
      body: `You are averaging ${activity.avgSteps7d} steps. A 15-minute walk after dinner closes the gap.`,
    });
  }

  const rank = { bad: 0, warn: 1, good: 2, info: 3 } as const;
  out.sort((a, b) => rank[a.tone] - rank[b.tone]);
  return { weight, composition, readiness: ready, activity, insights: out };
}

/** Numbers-only payload for the AI coach (no names, no raw history). */
export function aiPayload(a: Analysis, goal: Goal) {
  return {
    goal,
    weight: a.weight,
    composition: a.composition,
    readiness: a.readiness,
    activity: a.activity,
    insightIds: a.insights.map((i) => i.id),
  };
}
