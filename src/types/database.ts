// Generated from the live Supabase schema (project "forge"), then trimmed.
// Regenerate after schema changes: Supabase MCP generate_typescript_types
// or `npx supabase gen types typescript --project-id dxirfwtrrbjuflyiobjq`.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Rel = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne: boolean;
  referencedRelation: string;
  referencedColumns: string[];
}[];

export type Database = {
  __InternalSupabase: { PostgrestVersion: '14.18' };
  public: {
    Tables: {
      body_metrics: {
        Row: {
          body_fat_pct: number | null;
          created_at: string;
          id: string;
          lean_mass_kg: number | null;
          measured_at: string;
          source: string;
          user_id: string;
          weight_kg: number;
        };
        Insert: {
          body_fat_pct?: number | null;
          created_at?: string;
          id?: string;
          lean_mass_kg?: number | null;
          measured_at: string;
          source: string;
          user_id: string;
          weight_kg: number;
        };
        Update: Partial<Database['public']['Tables']['body_metrics']['Insert']>;
        Relationships: Rel;
      };
      checkins: {
        Row: {
          avg_weight_kg: number | null;
          coach_summary: string | null;
          created_at: string;
          id: string;
          kcal_change: number | null;
          prev_avg_weight_kg: number | null;
          user_id: string;
          week_start: string;
        };
        Insert: {
          avg_weight_kg?: number | null;
          coach_summary?: string | null;
          created_at?: string;
          id?: string;
          kcal_change?: number | null;
          prev_avg_weight_kg?: number | null;
          user_id: string;
          week_start: string;
        };
        Update: Partial<Database['public']['Tables']['checkins']['Insert']>;
        Relationships: Rel;
      };
      daily_plans: {
        Row: {
          coach_message: string | null;
          created_at: string;
          date: string;
          id: string;
          meal_ideas: Json | null;
          user_id: string;
          workout_id: string | null;
        };
        Insert: {
          coach_message?: string | null;
          created_at?: string;
          date: string;
          id?: string;
          meal_ideas?: Json | null;
          user_id: string;
          workout_id?: string | null;
        };
        Update: Partial<Database['public']['Tables']['daily_plans']['Insert']>;
        Relationships: Rel;
      };
      exercises: {
        Row: {
          created_at: string;
          equipment: string[];
          id: string;
          instructions: string | null;
          is_lower_body: boolean;
          movement_pattern: string;
          muscle_group: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          equipment?: string[];
          id?: string;
          instructions?: string | null;
          is_lower_body?: boolean;
          movement_pattern: string;
          muscle_group: string;
          name: string;
        };
        Update: Partial<Database['public']['Tables']['exercises']['Insert']>;
        Relationships: Rel;
      };
      health_days: {
        Row: {
          active_kcal: number | null;
          body_fat_pct: number | null;
          date: string;
          hrv_ms: number | null;
          lean_mass_kg: number | null;
          resting_hr: number | null;
          sleep_hours: number | null;
          source: string;
          steps: number | null;
          updated_at: string;
          user_id: string;
          weight_kg: number | null;
        };
        Insert: {
          active_kcal?: number | null;
          body_fat_pct?: number | null;
          date: string;
          hrv_ms?: number | null;
          lean_mass_kg?: number | null;
          resting_hr?: number | null;
          sleep_hours?: number | null;
          source: string;
          steps?: number | null;
          updated_at?: string;
          user_id: string;
          weight_kg?: number | null;
        };
        Update: Partial<Database['public']['Tables']['health_days']['Insert']>;
        Relationships: Rel;
      };
      meal_items: {
        Row: {
          ai_confidence: number | null;
          carbs_per_100g: number;
          created_at: string;
          fat_per_100g: number;
          grams: number;
          id: string;
          kcal_per_100g: number;
          meal_id: string;
          name: string;
          protein_per_100g: number;
          user_edited: boolean;
        };
        Insert: {
          ai_confidence?: number | null;
          carbs_per_100g: number;
          created_at?: string;
          fat_per_100g: number;
          grams: number;
          id?: string;
          kcal_per_100g: number;
          meal_id: string;
          name: string;
          protein_per_100g: number;
          user_edited?: boolean;
        };
        Update: Partial<Database['public']['Tables']['meal_items']['Insert']>;
        Relationships: Rel;
      };
      meals: {
        Row: {
          created_at: string;
          eaten_at: string;
          id: string;
          meal_type: string;
          photo_path: string | null;
          source: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          eaten_at: string;
          id?: string;
          meal_type: string;
          photo_path?: string | null;
          source: string;
          user_id: string;
        };
        Update: Partial<Database['public']['Tables']['meals']['Insert']>;
        Relationships: Rel;
      };
      nutrition_targets: {
        Row: {
          carbs_g: number;
          created_at: string;
          fat_g: number;
          id: string;
          kcal: number;
          protein_g: number;
          reason: string;
          user_id: string;
          valid_from: string;
        };
        Insert: {
          carbs_g: number;
          created_at?: string;
          fat_g: number;
          id?: string;
          kcal: number;
          protein_g: number;
          reason: string;
          user_id: string;
          valid_from: string;
        };
        Update: Partial<
          Database['public']['Tables']['nutrition_targets']['Insert']
        >;
        Relationships: Rel;
      };
      profiles: {
        Row: {
          birth_year: number | null;
          coach_style: string;
          created_at: string;
          diet_prefs: Json;
          display_name: string | null;
          equipment: string | null;
          experience: string | null;
          goal: string | null;
          gym: string | null;
          height_cm: number | null;
          id: string;
          is_pro: boolean;
          onboarded_at: string | null;
          sex: string | null;
          timezone: string;
          training_days: number | null;
        };
        Insert: {
          birth_year?: number | null;
          coach_style?: string;
          created_at?: string;
          diet_prefs?: Json;
          display_name?: string | null;
          equipment?: string | null;
          experience?: string | null;
          goal?: string | null;
          gym?: string | null;
          height_cm?: number | null;
          id: string;
          is_pro?: boolean;
          onboarded_at?: string | null;
          sex?: string | null;
          timezone?: string;
          training_days?: number | null;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
        Relationships: Rel;
      };
      training_programs: {
        Row: {
          created_at: string;
          days: Json;
          id: string;
          split: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          days: Json;
          id?: string;
          split: string;
          user_id: string;
        };
        Update: Partial<
          Database['public']['Tables']['training_programs']['Insert']
        >;
        Relationships: Rel;
      };
      usage_counters: {
        Row: {
          created_at: string;
          date: string;
          id: string;
          meal_scans: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          date: string;
          id?: string;
          meal_scans?: number;
          user_id: string;
        };
        Update: Partial<
          Database['public']['Tables']['usage_counters']['Insert']
        >;
        Relationships: Rel;
      };
      workout_sets: {
        Row: {
          actual_reps: number | null;
          actual_weight_kg: number | null;
          created_at: string;
          exercise_id: string;
          id: string;
          rpe: number | null;
          set_index: number;
          swapped_from: string | null;
          target_reps_max: number;
          target_reps_min: number;
          target_weight_kg: number | null;
          workout_id: string;
        };
        Insert: {
          actual_reps?: number | null;
          actual_weight_kg?: number | null;
          created_at?: string;
          exercise_id: string;
          id?: string;
          rpe?: number | null;
          set_index: number;
          swapped_from?: string | null;
          target_reps_max: number;
          target_reps_min: number;
          target_weight_kg?: number | null;
          workout_id: string;
        };
        Update: Partial<Database['public']['Tables']['workout_sets']['Insert']>;
        Relationships: Rel;
      };
      workouts: {
        Row: {
          created_at: string;
          date: string;
          day_name: string;
          id: string;
          status: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          date: string;
          day_name: string;
          id?: string;
          status: string;
          user_id: string;
        };
        Update: Partial<Database['public']['Tables']['workouts']['Insert']>;
        Relationships: Rel;
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
