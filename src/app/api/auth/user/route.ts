import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured
    const isSupabaseConfigured = !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== '' &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== ''
    );

    if (!isSupabaseConfigured) {
      // Mock user data
      return NextResponse.json({
        user: {
          id: 'mock-user-id',
          email: 'demo@example.com',
          created_at: new Date().toISOString(),
        },
      });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: data.user ? {
        id: data.user.id,
        email: data.user.email,
        created_at: data.user.created_at,
      } : null,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}