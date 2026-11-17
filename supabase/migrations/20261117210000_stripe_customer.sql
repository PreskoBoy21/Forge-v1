-- Web subscriptions (Stripe): link a Stripe customer to a Forge account so
-- cancellations and failed renewals turn Pro off again.
-- Written only by the stripe-webhook function (service role). Users have no
-- UPDATE grant on it; row-level security already limits reads to their own row.
alter table public.profiles
  add column if not exists stripe_customer_id text;

create unique index if not exists profiles_stripe_customer_id_key
  on public.profiles (stripe_customer_id)
  where stripe_customer_id is not null;
