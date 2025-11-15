export interface Character {
  id: string;
  name: string;
  description: string;
  model_url: string;
  unlock_criteria: UnlockCriteria;
  is_active: boolean;
  personality_type: PersonalityType;
  animation_states: AnimationState[];
  color_theme: ColorTheme;
}

export interface UnlockCriteria {
  type: 'assessments_completed' | 'chat_sessions' | 'weekly_usage' | 'stress_level_achieved' | 'default';
  value: number | string;
  description: string;
}

export interface UserCharacterProgress {
  id: string;
  user_id: string;
  character_id: string;
  unlocked_at?: string;
  interaction_count: number;
  favorite_character: boolean;
  last_interaction_at?: string;
  unlock_progress: number; // 0-100 percentage
}

export interface AnimationState {
  name: 'idle' | 'happy' | 'encouraging' | 'celebrating' | 'thinking' | 'sleeping';
  animation_url?: string;
  trigger_conditions: string[];
  duration?: number; // in seconds
  loop?: boolean;
}

export type PersonalityType =
  | 'wise_mentor'    // Zen Turtle
  | 'encouraging_friend' // Encouraging Fox
  | 'playful_companion'  // Playful Otter
  | 'knowledgeable_guide' // Wise Owl
  | 'energetic_coach';   // Energetic Dolphin

export interface ColorTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

export interface CharacterInteraction {
  character_id: string;
  user_id: string;
  interaction_type: 'assessment_complete' | 'chat_message' | 'milestone_achieved' | 'daily_checkin';
  response: string;
  animation_triggered: string;
  timestamp: string;
}

export interface CharacterSelection {
  user_id: string;
  selected_character_id: string;
  context: 'dashboard' | 'assessment' | 'chat' | 'celebration';
  timestamp: string;
}

// Predefined character data
export const DEFAULT_CHARACTERS: Omit<Character, 'id'>[] = [
  {
    name: 'Zen Turtle',
    description: 'A calm and wise companion who helps you find inner peace through mindfulness and steady guidance.',
    model_url: '/models/zen_turtle.glb',
    unlock_criteria: {
      type: 'default',
      value: 0,
      description: 'Available from the start'
    },
    is_active: true,
    personality_type: 'wise_mentor',
    animation_states: [
      { name: 'idle', trigger_conditions: ['always'], duration: 0, loop: true },
      { name: 'happy', trigger_conditions: ['assessment_improved', 'goal_achieved'], duration: 3 },
      { name: 'encouraging', trigger_conditions: ['chat_support', 'difficult_question'], duration: 2 },
      { name: 'celebrating', trigger_conditions: ['milestone_reached', 'character_unlocked'], duration: 4 }
    ],
    color_theme: {
      primary: '#8b7355',
      secondary: '#a0826d',
      accent: '#d4a574',
      background: '#f8f5f2'
    }
  },
  {
    name: 'Encouraging Fox',
    description: 'An energetic and uplifting friend who celebrates your progress and motivates you to keep going.',
    model_url: '/models/encouraging_fox.glb',
    unlock_criteria: {
      type: 'assessments_completed',
      value: 3,
      description: 'Complete 3 assessments'
    },
    is_active: true,
    personality_type: 'encouraging_friend',
    animation_states: [
      { name: 'idle', trigger_conditions: ['always'], duration: 0, loop: true },
      { name: 'happy', trigger_conditions: ['daily_login', 'consistency'], duration: 3 },
      { name: 'encouraging', trigger_conditions: ['low_motivation', 'challenge_faced'], duration: 2 },
      { name: 'celebrating', trigger_conditions: ['streak_milestone', 'personal_best'], duration: 4 }
    ],
    color_theme: {
      primary: '#d4a574',
      secondary: '#e6b885',
      accent: '#f4c89a',
      background: '#fef6e9'
    }
  },
  {
    name: 'Playful Otter',
    description: 'A fun-loving companion who reminds you not to take life too seriously and finds joy in small moments.',
    model_url: '/models/playful_otter.glb',
    unlock_criteria: {
      type: 'chat_sessions',
      value: 10,
      description: 'Complete 10 chat sessions'
    },
    is_active: true,
    personality_type: 'playful_companion',
    animation_states: [
      { name: 'idle', trigger_conditions: ['always'], duration: 0, loop: true },
      { name: 'happy', trigger_conditions: ['joke_told', 'breakthrough'], duration: 3 },
      { name: 'encouraging', trigger_conditions: ['stress_detected', 'anxiety_high'], duration: 2 },
      { name: 'celebrating', trigger_conditions: ['fun_moment', 'laughter_shared'], duration: 4 }
    ],
    color_theme: {
      primary: '#7fb3d5',
      secondary: '#9fc5e8',
      accent: '#b8d4f1',
      background: '#f0f8ff'
    }
  },
  {
    name: 'Wise Owl',
    description: 'A knowledgeable guide who provides deep insights and helps you understand patterns in your stress journey.',
    model_url: '/models/wise_owl.glb',
    unlock_criteria: {
      type: 'weekly_usage',
      value: 4,
      description: 'Use the app consistently for 4 weeks'
    },
    is_active: true,
    personality_type: 'knowledgeable_guide',
    animation_states: [
      { name: 'idle', trigger_conditions: ['always'], duration: 0, loop: true },
      { name: 'thinking', trigger_conditions: ['complex_question', 'insight_needed'], duration: 2 },
      { name: 'happy', trigger_conditions: ['understanding_dawned', 'pattern_recognized'], duration: 3 },
      { name: 'celebrating', trigger_conditions: ['wisdom_shared', 'breakthrough_achieved'], duration: 4 }
    ],
    color_theme: {
      primary: '#8b6f47',
      secondary: '#a0826d',
      accent: '#b8956a',
      background: '#f8f4e6'
    }
  },
  {
    name: 'Energetic Dolphin',
    description: 'A vibrant and enthusiastic coach who cheers you on and helps you achieve your stress reduction goals.',
    model_url: '/models/energetic_dolphin.glb',
    unlock_criteria: {
      type: 'stress_level_achieved',
      value: 'low',
      description: 'Achieve low stress level'
    },
    is_active: true,
    personality_type: 'energetic_coach',
    animation_states: [
      { name: 'idle', trigger_conditions: ['always'], duration: 0, loop: true },
      { name: 'happy', trigger_conditions: ['goal_achieved', 'progress_made'], duration: 3 },
      { name: 'encouraging', trigger_conditions: ['challenge_accepted', 'motivation_needed'], duration: 2 },
      { name: 'celebrating', trigger_conditions: ['target_reached', 'success_won'], duration: 4 }
    ],
    color_theme: {
      primary: '#5dade2',
      secondary: '#85c1e9',
      accent: '#aed6f1',
      background: '#ebf5fb'
    }
  }
] as const;