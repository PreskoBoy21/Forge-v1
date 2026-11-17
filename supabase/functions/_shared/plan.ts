// Who is calling, and on which plan.
// Web clients send `x-forge-platform: web` and get the paid-plan rules
// (free: 3 AI scans per 7 days, no AI coach; Pro: unlimited, 30 scans/day cap).
// Native builds (no header, or ios/android) keep the launch rules until
// Apple/Google in-app purchases exist, so the app in review behaves as before.
import { createClient, type SupabaseClient } from 'npm:@supabase/supabase-js@2';

export const CORS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-forge-platform',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', ...CORS },
  });

export const preflight = (req: Request) =>
  req.method === 'OPTIONS' ? new Response('ok', { headers: CORS }) : null;

export const FREE_WEB_SCANS_PER_WEEK = 3;
export const PRO_SCANS_PER_DAY = 30;
export const NATIVE_SCANS_PER_DAY = 10;

export type Caller = {
  supabase: SupabaseClient;
  userId: string;
  isPro: boolean;
  web: boolean;
};

/** Signed-in caller + plan, or null when not signed in. */
export async function getCaller(req: Request): Promise<Caller | null> {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } },
  );
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_pro')
    .eq('id', auth.user.id)
    .maybeSingle();
  return {
    supabase,
    userId: auth.user.id,
    isPro: Boolean(profile?.is_pro),
    web: req.headers.get('x-forge-platform') === 'web',
  };
}

/** Days (YYYY-MM-DD, UTC) from `n - 1` days ago up to today. */
export function lastDays(n: number, now = new Date()): string[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - (n - 1 - i));
    return d.toISOString().slice(0, 10);
  });
}
