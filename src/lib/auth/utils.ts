import { createClient as createBrowserClient } from '../supabase/client';
import { createClient as createServerClient } from '../supabase/server';
import type { User, Session, AuthResponse, SignUpCredentials, SignInCredentials } from './types';

// Check if Supabase is configured
function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== '' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== ''
  );
}

// Mock user for fallback when Supabase is not configured
const MOCK_USER: User = {
  id: 'mock-user-id',
  email: 'demo@example.com',
  created_at: new Date().toISOString(),
};

const MOCK_SESSION: Session = {
  access_token: 'mock-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  user: MOCK_USER,
};

// Browser-side auth utilities
export const browserAuth = {
  async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    if (!isSupabaseConfigured()) {
      // Mock successful signup
      return {
        user: MOCK_USER,
        session: MOCK_SESSION,
        error: null,
      };
    }

    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return {
          user: null,
          session: null,
          error: { message: error.message, status: 400 },
        };
      }

      return {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email!,
          created_at: data.user.created_at,
        } : null,
        session: data.session ? {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_in: data.session.expires_in,
          user: {
            id: data.session.user.id,
            email: data.session.user.email!,
            created_at: data.session.user.created_at,
          },
        } : null,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: { message: 'An unexpected error occurred', status: 500 },
      };
    }
  },

  async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    if (!isSupabaseConfigured()) {
      // Mock successful signin
      return {
        user: MOCK_USER,
        session: MOCK_SESSION,
        error: null,
      };
    }

    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return {
          user: null,
          session: null,
          error: { message: error.message, status: 401 },
        };
      }

      return {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email!,
          created_at: data.user.created_at,
        } : null,
        session: data.session ? {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_in: data.session.expires_in,
          user: {
            id: data.session.user.id,
            email: data.session.user.email!,
            created_at: data.session.user.created_at,
          },
        } : null,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: { message: 'An unexpected error occurred', status: 500 },
      };
    }
  },

  async signOut(): Promise<{ error: { message: string } | null }> {
    if (!isSupabaseConfigured()) {
      // Mock successful signout
      return { error: null };
    }

    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { error: { message: error.message } };
      }

      return { error: null };
    } catch (error) {
      return { error: { message: 'An unexpected error occurred' } };
    }
  },

  async getUser(): Promise<{ user: User | null; error: { message: string } | null }> {
    if (!isSupabaseConfigured()) {
      // Mock returning current user
      return { user: MOCK_USER, error: null };
    }

    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        return { user: null, error: { message: error.message } };
      }

      return {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email!,
          created_at: data.user.created_at,
        } : null,
        error: null,
      };
    } catch (error) {
      return { user: null, error: { message: 'An unexpected error occurred' } };
    }
  },
};

// Server-side auth utilities
export const serverAuth = {
  async getUser(): Promise<{ user: User | null; error: { message: string } | null }> {
    if (!isSupabaseConfigured()) {
      // Mock returning current user
      return { user: MOCK_USER, error: null };
    }

    try {
      const supabase = await createServerClient();
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        return { user: null, error: { message: error.message } };
      }

      return {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email!,
          created_at: data.user.created_at,
        } : null,
        error: null,
      };
    } catch (error) {
      return { user: null, error: { message: 'An unexpected error occurred' } };
    }
  },
};