// POST /functions/v1/analyze-health
// Body: { payload: <aiPayload()>, coachStyle?: 'buddy'|'sergeant'|'scientist' }
// Auth: Supabase user JWT (verify_jwt is on by default for Edge Functions).
import { z } from 'zod';

import { completeJson } from '../_shared/ai.ts';
import { healthCoachPrompt } from '../_shared/prompts.ts';
import { healthCoachResultSchema, healthPayloadSchema } from '../_shared/schemas.ts';

const bodySchema = z.object({
  payload: healthPayloadSchema,
  coachStyle: z.enum(['buddy', 'sergeant', 'scientist']).default('buddy'),
});

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
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
