// POST /functions/v1/stripe-webhook  (verify_jwt: false — Stripe signs the request)
// Stripe → profiles.is_pro for the web subscription (Forge Pro).
//  - checkout.session.completed: client_reference_id = Supabase user id → Pro on,
//    remember the Stripe customer id.
//  - customer.subscription.updated / .deleted: Pro follows the subscription status.
// Secret: STRIPE_WEBHOOK_SECRET (Supabase → Edge Functions → Secrets).
import { createClient } from 'npm:@supabase/supabase-js@2';

import { verifyStripe } from './verify.ts';

const ACTIVE = new Set(['active', 'trialing', 'past_due']);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type StripeEvent = {
  type?: string;
  data?: {
    object?: {
      client_reference_id?: string | null;
      customer?: string | null;
      status?: string;
      mode?: string;
      payment_status?: string;
    };
  };
};

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('method not allowed', { status: 405 });
  const secret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  if (!secret) return new Response('not configured', { status: 503 });
  const body = await req.text();
  if (!(await verifyStripe(body, req.headers.get('stripe-signature'), secret)))
    return new Response('bad signature', { status: 400 });

  let ev: StripeEvent;
  try {
    ev = JSON.parse(body);
  } catch {
    return new Response('bad json', { status: 400 });
  }
  const obj = ev.data?.object ?? {};
  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  if (ev.type === 'checkout.session.completed') {
    const uid = obj.client_reference_id ?? '';
    if (!UUID.test(uid)) {
      console.warn('checkout without a Forge user id', obj.customer);
      return new Response('ok (no user)', { status: 200 });
    }
    if (obj.mode === 'subscription' || obj.payment_status === 'paid') {
      const { error } = await admin
        .from('profiles')
        .update({ is_pro: true, stripe_customer_id: obj.customer ?? null })
        .eq('id', uid);
      if (error) {
        console.error('pro on failed', error);
        return new Response('error', { status: 500 });
      }
    }
    return new Response('ok', { status: 200 });
  }

  if (ev.type === 'customer.subscription.updated' || ev.type === 'customer.subscription.deleted') {
    if (!obj.customer) return new Response('ok (no customer)', { status: 200 });
    const isPro = ev.type === 'customer.subscription.updated' && ACTIVE.has(obj.status ?? '');
    const { error } = await admin
      .from('profiles')
      .update({ is_pro: isPro })
      .eq('stripe_customer_id', obj.customer);
    if (error) {
      console.error('pro update failed', error);
      return new Response('error', { status: 500 });
    }
    return new Response('ok', { status: 200 });
  }

  return new Response('ignored', { status: 200 });
});
