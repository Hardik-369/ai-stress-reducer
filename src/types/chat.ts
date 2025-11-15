export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokens_used?: number;
  created_at: string;
  session_id: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title?: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  total_tokens: number;
}

export interface ChatContext {
  user_assessment?: {
    stress_level: string;
    anxiety_level: string;
    depression_level: string;
    completed_at: string;
  };
  previous_topics: string[];
  session_history: ChatMessage[];
  user_preferences: {
    tone?: 'supportive' | 'professional' | 'casual' | 'empathetic';
    focus_areas?: string[];
  };
}

export interface ChatRequest {
  message: string;
  session_id?: string;
  context?: Partial<ChatContext>;
}

export interface ChatResponse {
  message: string;
  session_id: string;
  message_id: string;
  tokens_used: number;
  suggestions?: string[];
}

export interface TypingIndicator {
  is_typing: boolean;
  user_id: string;
  session_id: string;
}

export interface ChatError {
  code?: string;
  message: string;
  type?: 'rate_limit' | 'context_length' | 'api_error' | 'invalid_request';
}

// OpenAI API types
export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
}

export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}