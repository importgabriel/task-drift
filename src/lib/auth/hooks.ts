import { useState, useEffect } from 'react';
import { browserAuth } from './utils';
import type { User } from './types';

/**
 * Hook to get the current user and loading state
 * Automatically handles loading and error states
 */
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const { user, error } = await browserAuth.getUser();

        if (error) {
          setError(error.message);
        } else {
          setUser(user);
        }
      } catch (err) {
        setError('Failed to get user');
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  return { user, loading, error };
}

/**
 * Hook to handle authentication actions
 * Provides sign up, sign in, and sign out functions with loading states
 */
export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await browserAuth.signUp({ email, password });

      if (result.error) {
        setError(result.error.message);
        return { success: false, error: result.error.message };
      }

      return { success: true, user: result.user, session: result.session };
    } catch (err) {
      const errorMessage = 'Failed to sign up';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await browserAuth.signIn({ email, password });

      if (result.error) {
        setError(result.error.message);
        return { success: false, error: result.error.message };
      }

      return { success: true, user: result.user, session: result.session };
    } catch (err) {
      const errorMessage = 'Failed to sign in';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await browserAuth.signOut();

      if (result.error) {
        setError(result.error.message);
        return { success: false, error: result.error.message };
      }

      return { success: true };
    } catch (err) {
      const errorMessage = 'Failed to sign out';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    signUp,
    signIn,
    signOut,
    loading,
    error,
    clearError: () => setError(null),
  };
}