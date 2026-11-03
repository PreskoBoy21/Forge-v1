// POST /functions/v1/revenuecat-webhook  (verify_jwt: false — own auth)
// RevenueCat → set profiles.is_pro. In RevenueCat, set the webhook
// Authorization header to "Bearer <RC_WEBHOOK_AUTH>" (Supabase secret).
import { createClient } from 'npm:@supabase/supabase-js@2';

const ACTIVE = new Set([
  'INITIAL_PURCHASE', 'RENEWAL', 'UNCANCELLATION', 'PRODUCT_CHANGE',
  'NON_RENEWING_PURCHASE', 'SUBSCRIPTION_EXTENDED', 'TEMPORARY_ENTITLEMENT_GRANT',
]);
const INACTIVE = new Set(['EXPIRATION']);

Deno.serve(async (req) => {
  const secret = Deno.env.get('RC_WEBHOOK_AUTH');
  if (!secret || req.headers.get('Authorization') !== `Bearer ${secret}`)
    return new Response('unauthorized', { status: 401 });
  const body = await req.json().catch(() => null) as
    | { event?: { type?: string; app_user_id?: string; entitlement_ids?: string[] } }
    | null;
  const ev = body?.event;
  if (!ev?.type || !ev.app_user_id) return new Response('ignored', { status: 200 });
  if (ev.entitlement_ids && !ev.entitlement_ids.includes('pro'))
    return new Response('ignored', { status: 200 });
  const isPro = ACTIVE.has(ev.type) ? true : INACTIVE.has(ev.type) ? false : null;
  if (isPro === null) return new Response('ok', { status: 200 });
  // app_user_id is the Supabase user id; anonymous RC ids are skipped.
  if (!/^[0-9a-f-]{36}$/.test(ev.app_user_id)) return new Response('ok', { status: 200 });

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { error } = await admin.from('profiles').update({ is_pro: isPro }).eq('id', ev.app_user_id);
  if (error) {
    console.error('webhook update failed', error);
    return new Response('error', { status: 500 });
  }
  return new Response('ok', { status: 200 });
});
