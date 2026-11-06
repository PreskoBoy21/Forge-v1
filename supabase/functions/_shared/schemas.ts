import { z } from 'zod';

export const mealScanItemSchema = z.object({
  name: z.string(),
  grams: z.number(),
  kcal_per_100g: z.number(),
  protein_per_100g: z.number(),
  carbs_per_100g: z.number(),
  fat_per_100g: z.number(),
  confidence: z.number().min(0).max(1),
});

export const mealScanResultSchema = z.object({
  items: z.array(mealScanItemSchema),
  error: z.literal('not_food').optional(),
});

const explainText = z
  .string()
  .nullish()
  .transform((t) => (t ? t.slice(0, 260) : undefined));

export const healthCoachResultSchema = z.object({
  headline: z.string().max(80),
  summary: z.string().max(400),
  today: z.string().max(140),
  /** Plain-language explanation per area, only for areas with data. */
  explain: z
    .object({
      recovery: explainText,
      weight: explainText,
      body: explainText,
      activity: explainText,
      training: explainText,
      nutrition: explainText,
    })
    .partial()
    .nullish()
    .transform((e) => e ?? undefined),
});

/** Numbers-only payload produced by src/features/health/insights.ts#aiPayload. */
export const healthPayloadSchema = z.object({
  goal: z.enum(['lose_fat', 'build_muscle', 'recomp']),
  weight: z.record(z.string(), z.unknown()).optional(),
  composition: z.record(z.string(), z.unknown()).optional(),
  readiness: z.record(z.string(), z.unknown()).optional(),
  activity: z.record(z.string(), z.unknown()).optional(),
  training: z.record(z.string(), z.unknown()).optional(),
  nutrition: z.record(z.string(), z.unknown()).optional(),
  insightIds: z.array(z.string()).max(20),
});
