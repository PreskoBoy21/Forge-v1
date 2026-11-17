// POST /functions/v1/analyze-health
// Body: { payload: <aiPayload()>, coachStyle?: 'buddy'|'sergeant'|'scientist' }
// Auth: Supabase user JWT (verify_jwt is on by default for Edge Functions).
// Web callers (x-forge-platform: web) must be Pro.
import { z } from 'zod';

import { completeJson } from '../_shared/ai.ts';
import { getCaller, json, preflight } from '../_shared/plan.ts';
import { healthCoachPrompt } from '../_shared/prompts.ts';
import { healthCoachResultSchema, healthPayloadSchema } from '../_shared/schemas.ts';

const bodySchema = z.object({
  payload: healthPayloadSchema,
  coachStyle: z.enum(['buddy', 'sergeant', 'scientist']).default('buddy'),
});

Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
  // Web: the AI coach is a Pro feature. Native builds keep it free for now.
  if (req.headers.get('x-forge-platform') === 'web') {
    const caller = await getCaller(req);
    if (!caller) return json({ error: 'unauthorized' }, 401);
    if (!caller.isPro) return json({ error: 'pro_required' }, 402);
  }
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json({ error: 'invalid_input' }, 400);

  const { system, user } = healthCoachPrompt(parsed.data.payload, parsed.data.coachStyle);
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const out = healthCoachResultSchema.safeParse(await completeJson({ system, user, maxTokens: 900 }));
      if (out.success) return json(out.data);
    } catch (e) {
      console.error('analyze-health attempt failed', attempt, e);
    }
  }
  return json({ error: 'coach_unavailable' }, 502);
});
