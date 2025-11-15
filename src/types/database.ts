// This file defines the database schema types for Supabase
// Generated based on the planning.md schema specification

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
          last_assessment_date: string | null;
          preferred_character_id: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          last_assessment_date?: string | null;
          preferred_character_id?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          last_assessment_date?: string | null;
          preferred_character_id?: string | null;
        };
      };
      assessments: {
        Row: {
          id: string;
          user_id: string;
          depression_score: number;
          anxiety_score: number;
          stress_score: number;
          depression_level: 'normal' | 'mild' | 'moderate' | 'severe' | 'extremely_severe';
          anxiety_level: 'normal' | 'mild' | 'moderate' | 'severe' | 'extremely_severe';
          stress_level: 'normal' | 'mild' | 'moderate' | 'severe' | 'extremely_severe';
          answers: Record<string, number>;
          completed_at: string;
          question_order: number[];
        };
        Insert: {
          id?: string;
          user_id: string;
          depression_score: number;
          anxiety_score: number;
          stress_score: number;
          depression_level: 'normal' | 'mild' | 'moderate' | 'severe' | 'extremely_severe';
          anxiety_level: 'normal' | 'mild' | 'moderate' | 'severe' | 'extremely_severe';
          stress_level: 'normal' | 'mild' | 'moderate' | 'severe' | 'extremely_severe';
          answers: Record<string, number>;
          completed_at?: string;
          question_order: number[];
        };
        Update: {
          id?: string;
          user_id?: string;
          depression_score?: number;
          anxiety_score?: number;
          stress_score?: number;
          depression_level?: 'normal' | 'mild' | 'moderate' | 'severe' | 'extremely_severe';
          anxiety_level?: 'normal' | 'mild' | 'moderate' | 'severe' | 'extremely_severe';
          stress_level?: 'normal' | 'mild' | 'moderate' | 'severe' | 'extremely_severe';
          answers?: Record<string, number>;
          completed_at?: string;
          question_order?: number[];
        };
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          tokens_used: number | null;
          created_at: string;
          session_id: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          tokens_used?: number | null;
          created_at?: string;
          session_id: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: 'user' | 'assistant' | 'system';
          content?: string;
          tokens_used?: number | null;
          created_at?: string;
          session_id?: string;
        };
      };
      chat_sessions: {
        Row: {
          id: string;
          user_id: string;
          title: string | null;
          created_at: string;
          updated_at: string;
          message_count: number;
          total_tokens: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string | null;
          created_at?: string;
          updated_at?: string;
          message_count?: number;
          total_tokens?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string | null;
          created_at?: string;
          updated_at?: string;
          message_count?: number;
          total_tokens?: number;
        };
      };
      characters: {
        Row: {
          id: string;
          name: string;
          description: string;
          model_url: string;
          unlock_criteria: Record<string, any>;
          is_active: boolean;
          personality_type: 'wise_mentor' | 'encouraging_friend' | 'playful_companion' | 'knowledgeable_guide' | 'energetic_coach';
          animation_states: Record<string, any>[];
          color_theme: Record<string, string>;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          model_url: string;
          unlock_criteria: Record<string, any>;
          is_active?: boolean;
          personality_type: 'wise_mentor' | 'encouraging_friend' | 'playful_companion' | 'knowledgeable_guide' | 'energetic_coach';
          animation_states?: Record<string, any>[];
          color_theme: Record<string, string>;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          model_url?: string;
          unlock_criteria?: Record<string, any>;
          is_active?: boolean;
          personality_type?: 'wise_mentor' | 'encouraging_friend' | 'playful_companion' | 'knowledgeable_guide' | 'energetic_coach';
          animation_states?: Record<string, any>[];
          color_theme?: Record<string, string>;
        };
      };
      user_character_progress: {
        Row: {
          id: string;
          user_id: string;
          character_id: string;
          unlocked_at: string | null;
          interaction_count: number;
          favorite_character: boolean;
          last_interaction_at: string | null;
          unlock_progress: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          character_id: string;
          unlocked_at?: string | null;
          interaction_count?: number;
          favorite_character?: boolean;
          last_interaction_at?: string | null;
          unlock_progress?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          character_id?: string;
          unlocked_at?: string | null;
          interaction_count?: number;
          favorite_character?: boolean;
          last_interaction_at?: string | null;
          unlock_progress?: number;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}