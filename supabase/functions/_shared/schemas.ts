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
