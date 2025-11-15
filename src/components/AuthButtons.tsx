'use client';

import { useState } from 'react';
import { signIn, getProviders } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { LoginCredentials, SignupCredentials } from '@/types';

// Form validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type AuthMode = 'login' | 'signup';

interface AuthButtonsProps {
  mode?: 'inline' | 'modal' | 'page';
  redirectTo?: string;
  className?: string;
}

export default function AuthButtons({
  mode = 'inline',
  redirectTo = '/dashboard',
  className = ''
}: AuthButtonsProps) {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(mode === 'page');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loginForm = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signupForm = useForm<SignupCredentials>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signIn('google', { callbackUrl: redirectTo });
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.');
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (data: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push(redirectTo);
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignup = async (data: SignupCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Signup failed');
      }

      // Auto-login after successful signup
      await signIn('credentials', {
        email: data.email,
        password: data.password,
        callbackUrl: redirectTo,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Signup failed. Please try again.');
      setIsLoading(false);
    }
  };

  // Inline mode for header
  if (mode === 'inline' && !showForm) {
    return (
      <div className={`flex items-center space-x-4 ${className}`}>
        <button
          onClick={() => setShowForm(true)}
          className="btn-secondary"
        >
          Log In
        </button>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          Sign Up
        </button>
      </div>
    );
  }

  // Form component
  const AuthForm = () => (
    <div className="w-full max-w-md mx-auto">
      {/* Tab Switcher */}
      <div className="flex mb-8 bg-cream-bg rounded-2xl p-1">
        <button
          onClick={() => setAuthMode('login')}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
            authMode === 'login'
              ? 'bg-white text-primary-bronze shadow-sm'
              : 'text-text-brown hover:text-dark-brown'
          }`}
        >
          Log In
        </button>
        <button
          onClick={() => setAuthMode('signup')}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
            authMode === 'signup'
              ? 'bg-white text-primary-bronze shadow-sm'
              : 'text-text-brown hover:text-dark-brown'
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Google OAuth */}
      <button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full mb-6 flex items-center justify-center space-x-3 p-4 border-2 border-light-bronze/30 rounded-2xl hover:bg-cream-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin text-primary-bronze" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        <span className="font-medium text-dark-brown">
          Continue with Google
        </span>
      </button>

      {/* Divider */}
      <div className="flex items-center mb-6">
        <div className="flex-1 h-px bg-light-bronze/20"></div>
        <span className="px-4 text-sm text-text-brown">Or</span>
        <div className="flex-1 h-px bg-light-bronze/20"></div>
      </div>

      {/* Email Forms */}
      {authMode === 'login' ? (
        <form onSubmit={loginForm.handleSubmit(handleEmailLogin)} className="space-y-4">
          <div>
            <input
              {...loginForm.register('email')}
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-3 border border-light-bronze/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-bronze/20 focus:border-primary-bronze"
              disabled={isLoading}
            />
            {loginForm.formState.errors.email && (
              <p className="mt-2 text-sm text-red-600">
                {loginForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...loginForm.register('password')}
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-light-bronze/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-bronze/20 focus:border-primary-bronze"
              disabled={isLoading}
            />
            {loginForm.formState.errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {loginForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="flex justify-between items-center">
            <label className="flex items-center space-x-2 text-sm text-text-brown">
              <input type="checkbox" className="rounded border-light-bronze/30" />
              <span>Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-sm text-primary-bronze hover:text-light-bronze">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Mail className="w-5 h-5 mr-2" />
            )}
            Log In
          </button>
        </form>
      ) : (
        <form onSubmit={signupForm.handleSubmit(handleEmailSignup)} className="space-y-4">
          <div>
            <input
              {...signupForm.register('name')}
              type="text"
              placeholder="Full name"
              className="w-full px-4 py-3 border border-light-bronze/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-bronze/20 focus:border-primary-bronze"
              disabled={isLoading}
            />
            {signupForm.formState.errors.name && (
              <p className="mt-2 text-sm text-red-600">
                {signupForm.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...signupForm.register('email')}
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-3 border border-light-bronze/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-bronze/20 focus:border-primary-bronze"
              disabled={isLoading}
            />
            {signupForm.formState.errors.email && (
              <p className="mt-2 text-sm text-red-600">
                {signupForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...signupForm.register('password')}
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-light-bronze/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-bronze/20 focus:border-primary-bronze"
              disabled={isLoading}
            />
            {signupForm.formState.errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {signupForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...signupForm.register('confirmPassword')}
              type="password"
              placeholder="Confirm password"
              className="w-full px-4 py-3 border border-light-bronze/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-bronze/20 focus:border-primary-bronze"
              disabled={isLoading}
            />
            {signupForm.formState.errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600">
                {signupForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              className="mt-1 rounded border-light-bronze/30"
              required
            />
            <label className="ml-2 text-sm text-text-brown">
              I agree to the{' '}
              <Link href="/terms" className="text-primary-bronze hover:text-light-bronze">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary-bronze hover:text-light-bronze">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Mail className="w-5 h-5 mr-2" />
            )}
            Create Account
          </button>
        </form>
      )}

      {/* Switch mode link */}
      <div className="mt-6 text-center text-sm text-text-brown">
        {authMode === 'login' ? (
          <>
            Don't have an account?{' '}
            <button
              onClick={() => setAuthMode('signup')}
              className="text-primary-bronze hover:text-light-bronze font-medium"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              onClick={() => setAuthMode('login')}
              className="text-primary-bronze hover:text-light-bronze font-medium"
            >
              Log in
            </button>
          </>
        )}
      </div>
    </div>
  );

  // Modal mode
  if (mode === 'modal' && showForm) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-dark-brown">
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setError(null);
              }}
              className="p-2 hover:bg-cream-bg rounded-xl transition-colors"
            >
              ×
            </button>
          </div>
          <AuthForm />
        </div>
      </div>
    );
  }

  // Page mode or inline expanded
  return <AuthForm />;
}