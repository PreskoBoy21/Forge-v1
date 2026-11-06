/**
 * Open Food Facts (free, open database, ~3M products).
 * Barcode lookup + text search. Values are per 100 g.
 * https://openfoodfacts.github.io/openfoodfacts-server/api/
 */
import { Platform } from 'react-native';
import { create } from 'zustand';

import type { Food } from './foods';
import type { MealItem } from './nutrition';

const BASE = 'https://world.openfoodfacts.org';
const FIELDS =
  'code,product_name,product_name_en,brands,nutriments,serving_quantity';
// OFF asks apps to identify themselves (browsers can't set User-Agent).
const HEADERS: Record<string, string> =
  Platform.OS === 'web'
    ? {}
    : { 'User-Agent': 'Forge/1.0 (forge.gym.you@gmail.com)' };

type OffProduct = {
  code?: string;
  product_name?: string;
  product_name_en?: string;
  brands?: string;
  serving_quantity?: number | string;
  nutriments?: Record<string, number | string | undefined>;
};

const num = (v: unknown) => {
  const n = typeof v === 'string' ? parseFloat(v) : (v as number);
  return Number.isFinite(n) ? n : undefined;
};
const r1 = (n: number) => Math.round(n * 10) / 10;

export type OffFood = Food & { code?: string; brand?: string };

/** Map an OFF product to a Food (per 100 g); null when macros are missing. */
export function toFood(p: OffProduct): OffFood | null {
  const n = p.nutriments ?? {};
  const kcal =
    num(n['energy-kcal_100g']) ??
    (num(n['energy_100g']) !== undefined
      ? num(n['energy_100g'])! / 4.184
      : undefined);
  const protein = num(n['proteins_100g']);
  const carbs = num(n['carbohydrates_100g']);
  const fat = num(n['fat_100g']);
  const name = (p.product_name_en || p.product_name || '').trim();
  if (!name || kcal === undefined || protein === undefined) return null;
  const brand = p.brands?.split(',')[0]?.trim();
  const serving = num(p.serving_quantity);
  return {
    code: p.code,
    brand,
    name:
      brand && !name.toLowerCase().includes(brand.toLowerCase())
        ? `${name} (${brand})`
        : name,
    kcal: Math.round(kcal),
    protein: r1(protein),
    carbs: r1(carbs ?? 0),
    fat: r1(fat ?? 0),
    portion:
      serving && serving > 0 && serving < 1000 ? Math.round(serving) : 100,
  };
}

async function get(url: string, timeoutMs = 8000) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { headers: HEADERS, signal: ctl.signal });
    if (!res.ok) throw new Error(`OFF ${res.status}`);
    return (await res.json()) as unknown;
  } finally {
    clearTimeout(t);
  }
}

export async function lookupBarcode(code: string): Promise<OffFood | null> {
  const data = (await get(
    `${BASE}/api/v2/product/${encodeURIComponent(code)}.json?fields=${FIELDS}`,
  )) as { status?: number; product?: OffProduct };
  if (data.status !== 1 || !data.product) return null;
  return toFood({ ...data.product, code });
}

export async function searchOnline(q: string): Promise<OffFood[]> {
  const term = q.trim();
  if (term.length < 3) return [];
  const data = (await get(
    `${BASE}/cgi/search.pl?search_terms=${encodeURIComponent(term)}&search_simple=1&action=process&json=1&page_size=20&fields=${FIELDS}`,
  )) as { products?: OffProduct[] };
  const seen = new Set<string>();
  return (data.products ?? [])
    .map(toFood)
    .filter((f): f is OffFood => {
      if (!f || seen.has(f.name)) return false;
      seen.add(f.name);
      return true;
    })
    .slice(0, 12);
}

export const foodToItem = (f: Food): MealItem => ({
  name: f.name,
  grams: f.portion,
  kcal: f.kcal,
  protein: f.protein,
  carbs: f.carbs,
  fat: f.fat,
});

/** Hand-off from the barcode screen back to the Food screen. */
export const useScannedFood = create<{
  pending: MealItem | null;
  set: (i: MealItem | null) => void;
}>((set) => ({ pending: null, set: (pending) => set({ pending }) }));
