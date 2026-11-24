-- Waitlist: keep insert-only for the public key, and only on the email/source columns.
-- (Applied 2026-11-24; the table itself comes from 20261109121000_waitlist.sql.)
revoke all on public.waitlist from anon, authenticated;
grant insert (email, source) on public.waitlist to anon, authenticated;
