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

export const healthCoachResultSchema = z.object({
  headline: z.string().max(80),
  summary: z.string().max(400),
  today: z.string().max(140),
});

/** Numbers-only payload produced by src/features/health/insights.ts#aiPayload. */
export const healthPayloadSchema = z.object({
  goal: z.enum(['lose_fat', 'build_muscle', 'recomp']),
  weight: z.record(z.string(), z.unknown()).optional(),
  composition: z.record(z.string(), z.unknown()).optional(),
  readiness: z.record(z.string(), z.unknown()).optional(),
  activity: z.record(z.string(), z.unknown()).optional(),
  insightIds: z.array(z.string()).max(20),
});
