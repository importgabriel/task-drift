// Database operation result types
export interface DatabaseResult<T> {
  data: T | null;
  error: string | null;
}

export interface DatabaseDeleteResult {
  success: boolean;
  error: string | null;
}

// Todo-specific database operation types
export interface TodoCreateInput {
  title: string;
}

export interface TodoUpdateInput {
  title?: string;
  completed?: boolean;
}

// Re-export the Todo interface for convenience
export interface Todo {
  id: string;
  user_id: string;
  title: string;
  completed: boolean;
  created_at: string;
}

// Database operation interfaces
export interface TodoDatabase {
  getTodos(userId: string): Promise<DatabaseResult<Todo[]>>;
  createTodo(userId: string, title: string): Promise<DatabaseResult<Todo>>;
  updateTodo(id: string, updates: TodoUpdateInput): Promise<DatabaseResult<Todo>>;
  deleteTodo(id: string): Promise<DatabaseDeleteResult>;
}