// Stripe webhook signature check (no Stripe SDK needed).
// Header: Stripe-Signature: t=<unix>,v1=<hex hmac>[,v1=...]
// Signed payload: `${t}.${rawBody}`, HMAC-SHA256 with the endpoint secret (whsec_...).
const enc = new TextEncoder();

async function hmacHex(secret: string, msg: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(msg)));
  return [...sig].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

/** true when `header` is a valid signature of `body` within `toleranceS` seconds. */
export async function verifyStripe(
  body: string,
  header: string | null,
  secret: string,
  nowS = Math.floor(Date.now() / 1000),
  toleranceS = 300,
): Promise<boolean> {
  if (!header) return false;
  const parts = header.split(',').map((p) => p.split('='));
  const t = Number(parts.find(([k]) => k === 't')?.[1]);
  const sigs = parts.filter(([k]) => k === 'v1').map(([, v]) => v ?? '');
  if (!Number.isFinite(t) || !sigs.length || Math.abs(nowS - t) > toleranceS) return false;
  const expected = await hmacHex(secret, `${t}.${body}`);
  return sigs.some((s) => safeEqual(s, expected));
}

export { hmacHex };
