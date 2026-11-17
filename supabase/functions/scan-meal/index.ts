// POST /functions/v1/scan-meal
// Body: { imageBase64: string (JPEG, <= ~1.5 MB), note?: string }
// Limits (usage_counters): web free = 3 scans / 7 days, Pro = 30/day;
// native builds keep 10/day until in-app purchases exist (see _shared/plan.ts).
import { createClient } from 'npm:@supabase/supabase-js@2';
import { z } from 'zod';

import { completeJson } from '../_shared/ai.ts';
import {
  FREE_WEB_SCANS_PER_WEEK,
  NATIVE_SCANS_PER_DAY,
  PRO_SCANS_PER_DAY,
  getCaller,
  json,
  lastDays,
  preflight,
} from '../_shared/plan.ts';
import { mealScanPrompt } from '../_shared/prompts.ts';
import { mealScanResultSchema } from '../_shared/schemas.ts';

const bodySchema = z.object({
  imageBase64: z.string().min(100).max(2_000_000),
  note: z.string().max(200).optional(),
});

Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
  if (!Deno.env.get('AI_API_KEY')) return json({ error: 'ai_not_configured' }, 503);
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json({ error: 'invalid_input' }, 400);

  const caller = await getCaller(req);
  if (!caller) return json({ error: 'unauthorized' }, 401);
  const { supabase, userId, isPro, web } = caller;

  const days = lastDays(7);
  const today = days[6]!;
  const { data: rows } = await supabase
    .from('usage_counters')
    .select('id, date, meal_scans')
    .eq('user_id', userId)
    .in('date', days);
  const usage = rows?.find((r) => r.date === today);
  const used = usage?.meal_scans ?? 0;
  const usedWeek = (rows ?? []).reduce((n, r) => n + (r.meal_scans ?? 0), 0);

  // [limit, used so far] for this caller's plan
  const [limit, count, period] = isPro
    ? [PRO_SCANS_PER_DAY, used, 'day']
    : web
      ? [FREE_WEB_SCANS_PER_WEEK, usedWeek, 'week']
      : [NATIVE_SCANS_PER_DAY, used, 'day'];
  if (count >= limit)
    return json({ error: 'limit_reached', limit, period, pro: isPro }, 429);

  const { system, user: text } = mealScanPrompt(parsed.data.note);
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const out = mealScanResultSchema.safeParse(
        await completeJson({
          system,
          user: text,
          imageBase64: parsed.data.imageBase64,
          maxTokens: 800,
        }),
      );
      if (!out.success) continue;
      // Counter writes need the service role (users can't edit their own).
      const admin = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      );
      if (usage) {
        await admin.from('usage_counters').update({ meal_scans: used + 1 }).eq('id', usage.id);
      } else {
        await admin.from('usage_counters').insert({ user_id: userId, date: today, meal_scans: 1 });
      }
      return json({ ...out.data, scansLeft: isPro ? null : limit - count - 1, period });
    } catch (e) {
      console.error('scan-meal attempt failed', attempt, e);
    }
  }
  return json({ error: 'scan_unavailable' }, 502);
});
