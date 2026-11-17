/**
 * Forge Pro on the web: Stripe Payment Links (no card data ever touches the
 * app). Fill these in from the Stripe dashboard. Empty = paywall shows
 * "coming soon" instead of buy buttons.
 * Payment Links must redirect to `<web app>/you?pro=1` after payment.
 */
export const BILLING = {
  monthly: '', // https://buy.stripe.com/...  (€4.99 / month)
  yearly: '', // https://buy.stripe.com/...  (€29.99 / year)
  portal: '', // https://billing.stripe.com/p/login/...  (manage / cancel)
  prices: { monthly: '€4.99', yearly: '€29.99', yearlyPerMonth: '€2.50' },
};

export const billingReady = () => Boolean(BILLING.monthly && BILLING.yearly);

/** Payment Link with the Forge user attached, so the webhook can find them. */
export function checkoutUrl(
  link: string,
  userId: string,
  email?: string | null,
) {
  const q = new URLSearchParams({ client_reference_id: userId });
  if (email) q.set('prefilled_email', email);
  return `${link}?${q.toString()}`;
}

/** Header the AI functions use to apply the web plan rules. */
export const platformHeader = (os: string) => ({ 'x-forge-platform': os });
