// Provider-agnostic AI wrapper. Secrets live in Edge Function env only.
// Do not import this from the Expo app.
//
// Env:
//   AI_API_KEY   – Anthropic API key (set with `supabase secrets set AI_API_KEY=...`)
//   AI_MODEL     – optional, defaults to a fast, cheap model for coach copy

const DEFAULT_MODEL = 'claude-haiku-5-5';

export async function completeJson(input: {
  system: string;
  user: string;
  maxTokens?: number;
  /** Optional JPEG, base64 (no data: prefix), sent before the text. */
  imageBase64?: string;
}): Promise<unknown> {
  const key = Deno.env.get('AI_API_KEY');
  if (!key) throw new Error('AI_API_KEY is not set');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: Deno.env.get('AI_MODEL') ?? DEFAULT_MODEL,
      max_tokens: input.maxTokens ?? 600,
      system: input.system,
      messages: [
        {
          role: 'user',
          content: input.imageBase64
            ? [
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: 'image/jpeg',
                    data: input.imageBase64,
                  },
                },
                { type: 'text', text: input.user },
              ]
            : input.user,
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`AI request failed: ${res.status}`);
  const data = (await res.json()) as { content?: { type: string; text?: string }[] };
  const text = data.content?.find((c) => c.type === 'text')?.text ?? '';
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end < start) throw new Error('AI returned no JSON');
  return JSON.parse(text.slice(start, end + 1));
}
