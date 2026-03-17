# Authentication System

This directory contains a complete authentication system built with Supabase Auth and Next.js, with graceful fallbacks when Supabase is not configured.

## Features

- **Email/Password Authentication**: Sign up, sign in, and sign out functionality
- **Route Protection**: Middleware that protects `/dashboard` routes and redirects unauthenticated users to `/login`
- **Graceful Fallbacks**: When Supabase is not configured, the system uses mock data so the UI remains functional
- **TypeScript Support**: Fully typed interfaces and error handling
- **Server & Client Utils**: Separate utilities for server-side and client-side auth operations

## Quick Start

### 1. Environment Setup

Add these environment variables to your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

If these are not set, the system will use mock data and still function for development/testing.

### 2. API Routes

The following API routes are available:

- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/signin` - Sign in with email/password
- `POST /api/auth/signout` - Sign out the current user
- `GET /api/auth/user` - Get current user information

### 3. Client-Side Usage

```typescript
import { browserAuth } from '@/lib/auth';

// Sign up a new user
const { user, session, error } = await browserAuth.signUp({
  email: 'user@example.com',
  password: 'password123'
});

// Sign in
const result = await browserAuth.signIn({
  email: 'user@example.com',
  password: 'password123'
});

// Sign out
await browserAuth.signOut();

// Get current user
const { user } = await browserAuth.getUser();
```

### 4. Server-Side Usage

```typescript
import { serverAuth } from '@/lib/auth';

// Get current user on the server
const { user, error } = await serverAuth.getUser();
```

## Route Protection

The middleware automatically:

- **Protects `/dashboard/*` routes**: Redirects unauthenticated users to `/login?redirectTo=/dashboard/...`
- **Handles auth pages**: Redirects authenticated users away from `/login` and `/signup` to `/dashboard`
- **Refreshes sessions**: Keeps Supabase sessions fresh on all requests
- **Graceful fallbacks**: When Supabase is not configured, allows access to all routes

## Types

All authentication-related types are available:

```typescript
import type { User, Session, AuthResponse, SignUpCredentials, SignInCredentials } from '@/lib/auth';
```

## Error Handling

All auth functions return consistent error objects:

```typescript
interface AuthError {
  message: string;
  status?: number;
}
```

## Mock Mode

When Supabase environment variables are missing or empty, the system automatically switches to mock mode:

- All auth operations return successful responses with mock data
- Protected routes remain accessible
- The UI can be developed and tested without external dependencies

## Development

To test the auth system:

1. **With Supabase**: Set up your Supabase project and add the environment variables
2. **Without Supabase**: Leave environment variables empty and the system will use mock data

Both modes allow full UI development and testing.