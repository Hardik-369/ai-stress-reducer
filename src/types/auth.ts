export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_assessment_date?: string;
  preferred_character_id?: string;
}

export interface Session {
  user: User;
  expires: string;
  accessToken?: string;
}

export interface AuthError {
  code?: string;
  message: string;
  type?: 'CredentialsSignin' | 'OAuthSignin' | 'OAuthCallback' | 'OAuthCreateAccount' | 'EmailCreateAccount' | 'Verification' | 'Default';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name: string;
}