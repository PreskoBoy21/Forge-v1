export type Props = Record<string, string | number | boolean | null>;

/** Keep props small and free of personal data: max 12 keys, strings cut to 300 chars, no NaN/Infinity. */
export function cleanProps(props: Props = {}): Props {
  const out: Props = {};
  for (const [k, v] of Object.entries(props).slice(0, 12)) {
    if (typeof v === 'string') out[k] = v.slice(0, 300);
    else if (typeof v === 'number') out[k] = Number.isFinite(v) ? v : null;
    else out[k] = v;
  }
  return out;
}
