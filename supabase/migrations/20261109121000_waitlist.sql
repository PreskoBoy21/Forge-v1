-- Launch waitlist from the website (preskoboy21.github.io/Forge-v1).
-- Insert-only for the public key; only the project owner can read it (dashboard / service role).
create table if not exists public.waitlist (
  id bigint generated always as identity primary key,
  email text not null,
  source text,
  created_at timestamptz not null default now(),
  constraint waitlist_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$' and char_length(email) <= 254),
  constraint waitlist_source_len check (source is null or char_length(source) <= 40)
);
create unique index if not exists waitlist_email_key on public.waitlist (lower(email));

alter table public.waitlist enable row level security;

create policy "waitlist insert"
  on public.waitlist for insert
  to anon, authenticated
  with check (true);

comment on table public.waitlist is 'Launch waitlist emails from the Forge website. Insert-only from the public key.';
