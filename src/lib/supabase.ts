import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

import type { Database } from '@/types/database';

/**
 * Project "forge" (EU). The URL and publishable key are designed to be public
 * (they ship inside every app build); row-level security protects the data.
 * Override with EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY.
 */
const DEFAULT_URL = 'https://dxirfwtrrbjuflyiobjq.supabase.co';
const DEFAULT_KEY = 'sb_publishable_zu5bhrjh681kKzfBFHizQw_bf0dRljF';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || DEFAULT_URL;
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const isServer = typeof window === 'undefined' && Platform.OS === 'web';

export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: isServer ? undefined : AsyncStorage,
        autoRefreshToken: !isServer,
        persistSession: !isServer,
        detectSessionInUrl: false,
      },
    })
  : null;
