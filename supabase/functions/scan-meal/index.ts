// POST /functions/v1/scan-meal
// Body: { imageBase64: string (JPEG, <= ~1.5 MB), note?: string }
// Free users: 10 scans per day (usage_counters). Pro: unlimited.
import { createClient } from 'npm:@supabase/supabase-js@2';
import { z } from 'zod';

import { completeJson } from '../_shared/ai.ts';
import { mealScanPrompt } from '../_shared/prompts.ts';
import { mealScanResultSchema } from '../_shared/schemas.ts';

const FREE_SCANS_PER_DAY = 10;

const bodySchema = z.object({
  imageBase64: z.string().min(100).max(2_000_000),
  note: z.string().max(200).optional(),
});

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
  if (!Deno.env.get('AI_API_KEY')) return json({ error: 'ai_not_configured' }, 503);
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json({ error: 'invalid_input' }, 400);

  // Act as the calling user so row-level security applies.
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } },
  );
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return json({ error: 'unauthorized' }, 401);

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_pro')
    .eq('id', user.id)
    .maybeSingle();
  const today = new Date().toISOString().slice(0, 10);
  const { data: usage } = await supabase
    .from('usage_counters')
    .select('id, meal_scans')
    .eq('user_id', user.id)
    .eq('date', today)
    .maybeSingle();
  const used = usage?.meal_scans ?? 0;
  if (!profile?.is_pro && used >= FREE_SCANS_PER_DAY)
    return json({ error: 'limit_reached', limit: FREE_SCANS_PER_DAY }, 429);

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
        await admin.from('usage_counters').insert({ user_id: user.id, date: today, meal_scans: 1 });
      }
      return json({ ...out.data, scansLeft: profile?.is_pro ? null : FREE_SCANS_PER_DAY - used - 1 });
    } catch (e) {
      console.error('scan-meal attempt failed', attempt, e);
    }
  }
  return json({ error: 'scan_unavailable' }, 502);
});
