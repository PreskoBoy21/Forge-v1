import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

import { aiAllowed } from '@/features/consent/store';
import { supabase } from '@/lib/supabase';

import type { MealItem } from './nutrition';

export type ScanOutcome =
  | { ok: true; items: MealItem[]; scansLeft: number | null }
  | {
      ok: false;
      reason:
        | 'cancelled'
        | 'no_permission'
        | 'signed_out'
        | 'not_food'
        | 'limit_reached'
        | 'needs_consent'
        | 'ai_off'
        | 'unavailable';
    };

/** Take (or pick) a photo, shrink it, and ask the scan-meal function. */
export async function scanMeal(
  from: 'camera' | 'library',
  note?: string,
): Promise<ScanOutcome & { photoUri?: string }> {
  if (!supabase) return { ok: false, reason: 'unavailable' };
  const { data: s } = await supabase.auth.getSession();
  if (!s.session) return { ok: false, reason: 'signed_out' };
  // Ask before the photo goes to the AI provider (guideline 5.1.2(i)).
  if (!aiAllowed()) return { ok: false, reason: 'needs_consent' };

  if (from === 'camera') {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return { ok: false, reason: 'no_permission' };
  }
  const opts: ImagePicker.ImagePickerOptions = {
    mediaTypes: ['images'],
    quality: 0.8,
  };
  const picked =
    from === 'camera'
      ? await ImagePicker.launchCameraAsync(opts)
      : await ImagePicker.launchImageLibraryAsync(opts);
  const asset = picked.canceled ? undefined : picked.assets[0];
  if (!asset) return { ok: false, reason: 'cancelled' };

  const small = await manipulateAsync(
    asset.uri,
    [{ resize: { width: 1024 } }],
    {
      compress: 0.7,
      format: SaveFormat.JPEG,
      base64: true,
    },
  );
  if (!small.base64) return { ok: false, reason: 'unavailable' };

  const { data, error } = await supabase.functions.invoke('scan-meal', {
    body: { imageBase64: small.base64, note },
  });
  if (error) {
    const status = (error as { context?: { status?: number } }).context?.status;
    return {
      ok: false,
      reason:
        status === 429
          ? 'limit_reached'
          : status === 503
            ? 'ai_off'
            : 'unavailable',
      photoUri: asset.uri,
    };
  }
  const res = data as {
    items: {
      name: string;
      grams: number;
      kcal_per_100g: number;
      protein_per_100g: number;
      carbs_per_100g: number;
      fat_per_100g: number;
      confidence: number;
    }[];
    error?: 'not_food';
    scansLeft: number | null;
  };
  if (res.error === 'not_food' || res.items.length === 0)
    return { ok: false, reason: 'not_food', photoUri: asset.uri };
  return {
    ok: true,
    photoUri: asset.uri,
    scansLeft: res.scansLeft,
    items: res.items.map((i) => ({
      name: i.name,
      grams: Math.round(i.grams),
      kcal: i.kcal_per_100g,
      protein: i.protein_per_100g,
      carbs: i.carbs_per_100g,
      fat: i.fat_per_100g,
      confidence: i.confidence,
    })),
  };
}
