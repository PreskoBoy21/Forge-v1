export type Sex = 'male' | 'female';
export type Goal = 'lose_fat' | 'build_muscle' | 'recomp';
export type Experience = 'beginner' | 'intermediate';
export type Equipment = 'full_gym' | 'basic_gym' | 'home_dumbbells';
export type CoachStyle = 'buddy' | 'strict';
export type WorkoutStatus = 'planned' | 'in_progress' | 'done' | 'skipped';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type MealSource = 'scan' | 'manual';
export type MetricSource = 'manual' | 'apple_health' | 'health_connect';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          display_name: string | null;
          sex: Sex | null;
          birth_year: number | null;
          height_cm: number | null;
          goal: Goal | null;
          training_days: number | null;
          experience: Experience | null;
          equipment: Equipment | null;
          diet_prefs: Record<string, unknown>;
          coach_style: CoachStyle;
          timezone: string;
          is_pro: boolean;
          onboarded_at: string | null;
        };
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & {
          id: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Row']>;
      };
      exercises: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          muscle_group: string;
          movement_pattern: string;
          equipment: string[];
          is_lower_body: boolean;
          instructions: string | null;
        };
        Insert: Omit<
          Database['public']['Tables']['exercises']['Row'],
          'id' | 'created_at'
        > & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['exercises']['Row']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
