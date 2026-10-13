// Provider-agnostic AI wrapper. Secrets live in Edge Function env only.
// Implemented in later phases. Do not import this from the Expo app.

export async function completeJson(_input: {
  system: string;
  user: string;
}): Promise<unknown> {
  throw new Error('AI wrapper is not implemented yet.');
}
