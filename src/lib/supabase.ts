import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
});

// Service role client for admin operations
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (supabaseServiceRoleKey) {
  export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Database helper functions
export class DatabaseHelper {
  static async createUser(userData: {
    email: string;
    name?: string;
    avatar_url?: string;
  }) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async updateUser(id: string, updates: Partial<{
    name: string;
    avatar_url: string;
    last_assessment_date: string;
    preferred_character_id: string;
  }>) {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async createAssessment(assessmentData: {
    user_id: string;
    depression_score: number;
    anxiety_score: number;
    stress_score: number;
    depression_level: string;
    anxiety_level: string;
    stress_level: string;
    answers: Record<string, number>;
    question_order: number[];
  }) {
    const { data, error } = await supabase
      .from('assessments')
      .insert(assessmentData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserAssessments(userId: string, limit = 10, offset = 0) {
    const { data, error, count } = await supabase
      .from('assessments')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data: data || [], count: count || 0 };
  }

  static async getLatestAssessment(userId: string) {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async createChatMessage(messageData: {
    user_id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    session_id: string;
    tokens_used?: number;
  }) {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert(messageData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getChatMessages(sessionId: string, limit = 50) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  static async getUserChatSessions(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  static async createChatSession(sessionData: {
    user_id: string;
    title?: string;
  }) {
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert(sessionData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getCharacters() {
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data || [];
  }

  static async getUserCharacterProgress(userId: string) {
    const { data, error } = await supabase
      .from('user_character_progress')
      .select(`
        *,
        characters (*)
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  }

  static async unlockCharacter(userId: string, characterId: string) {
    const { data, error } = await supabase
      .from('user_character_progress')
      .upsert({
        user_id: userId,
        character_id: characterId,
        unlocked_at: new Date().toISOString(),
        interaction_count: 0,
        favorite_character: false,
        unlock_progress: 100
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateCharacterInteraction(userId: string, characterId: string) {
    const { data, error } = await supabase
      .from('user_character_progress')
      .update({
        interaction_count: supabase.raw('interaction_count + 1'),
        last_interaction_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('character_id', characterId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async setFavoriteCharacter(userId: string, characterId: string) {
    // First, unset all favorite characters for this user
    await supabase
      .from('user_character_progress')
      .update({ favorite_character: false })
      .eq('user_id', userId);

    // Then set the new favorite
    const { data, error } = await supabase
      .from('user_character_progress')
      .update({ favorite_character: true })
      .eq('user_id', userId)
      .eq('character_id', characterId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

// Realtime subscriptions
export class RealtimeManager {
  static subscribeToUserAssessments(
    userId: string,
    callback: (payload: any) => void
  ) {
    return supabase
      .channel('assessments_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'assessments',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  }

  static subscribeToChatMessages(
    sessionId: string,
    callback: (payload: any) => void
  ) {
    return supabase
      .channel('chat_messages_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${sessionId}`,
        },
        callback
      )
      .subscribe();
  }

  static subscribeToCharacterProgress(
    userId: string,
    callback: (payload: any) => void
  ) {
    return supabase
      .channel('character_progress_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_character_progress',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  }
}

// Error handling
export class SupabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'SupabaseError';
  }

  static fromSupabaseError(error: any): SupabaseError {
    return new SupabaseError(
      error.message || 'Database operation failed',
      error.code,
      error.details
    );
  }
}

// Connection test utility
export async function testConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('users').select('count').single();
    return !error;
  } catch {
    return false;
  }
}