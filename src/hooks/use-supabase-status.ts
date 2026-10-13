import { useQuery } from '@tanstack/react-query';

import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export function useSupabaseStatus() {
  return useQuery({
    queryKey: ['supabase-status'],
    queryFn: async () => {
      if (!supabase) {
        return {
          ok: false as const,
          message: 'Missing Expo public Supabase env vars.',
        };
      }

      const { error, count } = await supabase
        .from('exercises')
        .select('id', { count: 'exact', head: true });

      if (error) {
        return { ok: false as const, message: error.message };
      }

      return {
        ok: true as const,
        message: `Connected. Exercise library rows: ${count ?? 0}.`,
      };
    },
    enabled: isSupabaseConfigured,
    retry: false,
  });
}
