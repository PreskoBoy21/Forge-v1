// POST /functions/v1/delete-account
// Permanently deletes the calling user and (via ON DELETE CASCADE) all their
// data. Required by the App Store (in-app account deletion).
import { createClient } from 'npm:@supabase/supabase-js@2';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
  const url = Deno.env.get('SUPABASE_URL')!;
  const asUser = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
  });
  const { data } = await asUser.auth.getUser();
  if (!data.user) return json({ error: 'unauthorized' }, 401);

  const admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  // Also remove analytics sent from this phone before the user signed in
  // (rows with user_id are removed by the FK cascade below).
  const body = (await req.json().catch(() => ({}))) as { installId?: unknown };
  if (typeof body.installId === 'string' && body.installId.length >= 8 && body.installId.length <= 64) {
    await admin.from('app_events').delete().eq('install_id', body.installId).is('user_id', null);
  }
  const { error } = await admin.auth.admin.deleteUser(data.user.id);
  if (error) {
    console.error('delete-account failed', error);
    return json({ error: 'delete_failed' }, 500);
  }
  return json({ deleted: true });
});
