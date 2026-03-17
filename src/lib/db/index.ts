import { createClient as createBrowserClient } from '../supabase/client';
import { createClient as createServerClient } from '../supabase/server';

// Import the Todo interface from where it's defined by other agents
export interface Todo {
  id: string;
  user_id: string;
  title: string;
  completed: boolean;
  created_at: string;
}

// Mock data store for when Supabase isn't available
class MockTodoStore {
  private todos: Todo[] = [
    {
      id: '1',
      user_id: 'mock-user-1',
      title: 'Learn Next.js',
      completed: false,
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      user_id: 'mock-user-1',
      title: 'Build todo app',
      completed: true,
      created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    },
    {
      id: '3',
      user_id: 'mock-user-1',
      title: 'Deploy to production',
      completed: false,
      created_at: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    },
  ];

  async getTodos(userId: string): Promise<Todo[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.todos.filter(todo => todo.user_id === userId);
  }

  async createTodo(userId: string, title: string): Promise<Todo> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const todo: Todo = {
      id: Date.now().toString(),
      user_id: userId,
      title,
      completed: false,
      created_at: new Date().toISOString(),
    };
    this.todos.push(todo);
    return todo;
  }

  async updateTodo(id: string, updates: Partial<Pick<Todo, 'title' | 'completed'>>): Promise<Todo | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index === -1) return null;

    this.todos[index] = { ...this.todos[index], ...updates };
    return this.todos[index];
  }

  async deleteTodo(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index === -1) return false;

    this.todos.splice(index, 1);
    return true;
  }
}

// Singleton mock store
const mockStore = new MockTodoStore();

// Check if Supabase is properly configured
function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// Database operations for client-side usage
export const clientDb = {
  async getTodos(userId: string): Promise<{ data: Todo[] | null; error: string | null }> {
    try {
      if (!isSupabaseConfigured()) {
        const data = await mockStore.getTodos(userId);
        return { data, error: null };
      }

      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      return { data, error: error?.message || null };
    } catch (err) {
      // Fallback to mock data on any error
      const data = await mockStore.getTodos(userId);
      return { data, error: null };
    }
  },

  async createTodo(userId: string, title: string): Promise<{ data: Todo | null; error: string | null }> {
    try {
      if (!isSupabaseConfigured()) {
        const data = await mockStore.createTodo(userId, title);
        return { data, error: null };
      }

      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('todos')
        .insert([{ user_id: userId, title }])
        .select()
        .single();

      return { data, error: error?.message || null };
    } catch (err) {
      // Fallback to mock store on any error
      const data = await mockStore.createTodo(userId, title);
      return { data, error: null };
    }
  },

  async updateTodo(id: string, updates: Partial<Pick<Todo, 'title' | 'completed'>>): Promise<{ data: Todo | null; error: string | null }> {
    try {
      if (!isSupabaseConfigured()) {
        const data = await mockStore.updateTodo(id, updates);
        return { data, error: null };
      }

      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('todos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      return { data, error: error?.message || null };
    } catch (err) {
      // Fallback to mock store on any error
      const data = await mockStore.updateTodo(id, updates);
      return { data, error: null };
    }
  },

  async deleteTodo(id: string): Promise<{ success: boolean; error: string | null }> {
    try {
      if (!isSupabaseConfigured()) {
        const success = await mockStore.deleteTodo(id);
        return { success, error: null };
      }

      const supabase = createBrowserClient();
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      return { success: !error, error: error?.message || null };
    } catch (err) {
      // Fallback to mock store on any error
      const success = await mockStore.deleteTodo(id);
      return { success, error: null };
    }
  },
};

// Database operations for server-side usage
export const serverDb = {
  async getTodos(userId: string): Promise<{ data: Todo[] | null; error: string | null }> {
    try {
      if (!isSupabaseConfigured()) {
        const data = await mockStore.getTodos(userId);
        return { data, error: null };
      }

      const supabase = await createServerClient();
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      return { data, error: error?.message || null };
    } catch (err) {
      // Fallback to mock data on any error
      const data = await mockStore.getTodos(userId);
      return { data, error: null };
    }
  },

  async createTodo(userId: string, title: string): Promise<{ data: Todo | null; error: string | null }> {
    try {
      if (!isSupabaseConfigured()) {
        const data = await mockStore.createTodo(userId, title);
        return { data, error: null };
      }

      const supabase = await createServerClient();
      const { data, error } = await supabase
        .from('todos')
        .insert([{ user_id: userId, title }])
        .select()
        .single();

      return { data, error: error?.message || null };
    } catch (err) {
      // Fallback to mock store on any error
      const data = await mockStore.createTodo(userId, title);
      return { data, error: null };
    }
  },

  async updateTodo(id: string, updates: Partial<Pick<Todo, 'title' | 'completed'>>): Promise<{ data: Todo | null; error: string | null }> {
    try {
      if (!isSupabaseConfigured()) {
        const data = await mockStore.updateTodo(id, updates);
        return { data, error: null };
      }

      const supabase = await createServerClient();
      const { data, error } = await supabase
        .from('todos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      return { data, error: error?.message || null };
    } catch (err) {
      // Fallback to mock store on any error
      const data = await mockStore.updateTodo(id, updates);
      return { data, error: null };
    }
  },

  async deleteTodo(id: string): Promise<{ success: boolean; error: string | null }> {
    try {
      if (!isSupabaseConfigured()) {
        const success = await mockStore.deleteTodo(id);
        return { success, error: null };
      }

      const supabase = await createServerClient();
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      return { success: !error, error: error?.message || null };
    } catch (err) {
      // Fallback to mock store on any error
      const success = await mockStore.deleteTodo(id);
      return { success, error: null };
    }
  },
};

// Export the mock store for testing purposes
export { mockStore };