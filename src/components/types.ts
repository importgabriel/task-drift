// Core Todo entity used throughout the UI
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
  createdAt: string;
}

// Compatible with other agents' shared interfaces
// CreateTodoInput: { title: string }
// UpdateTodoInput: { title?: string, completed?: boolean }
export type CreateTodoInput = { title: string };
export type UpdateTodoInput = { title?: string; completed?: boolean };

// Compatible with auth agent's Session/AuthResult
export type Session = { user: { id: string; email: string } | null };
export type AuthResult = { session: Session | null; error: string | null };

export type FilterType = "all" | "active" | "completed";
