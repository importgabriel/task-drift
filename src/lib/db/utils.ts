import { Todo } from './types';

/**
 * Validates a todo title
 */
export function validateTodoTitle(title: string): { valid: boolean; error?: string } {
  const trimmed = title.trim();

  if (!trimmed) {
    return { valid: false, error: 'Title cannot be empty' };
  }

  if (trimmed.length > 500) {
    return { valid: false, error: 'Title cannot exceed 500 characters' };
  }

  return { valid: true };
}

/**
 * Formats a date string for display
 */
export function formatTodoDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return minutes <= 1 ? 'Just now' : `${minutes} minutes ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  } catch {
    return 'Unknown date';
  }
}

/**
 * Sorts todos by creation date (newest first)
 */
export function sortTodosByDate(todos: Todo[]): Todo[] {
  return [...todos].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

/**
 * Groups todos by completion status
 */
export function groupTodosByStatus(todos: Todo[]): {
  completed: Todo[];
  pending: Todo[];
} {
  return todos.reduce(
    (groups, todo) => {
      if (todo.completed) {
        groups.completed.push(todo);
      } else {
        groups.pending.push(todo);
      }
      return groups;
    },
    { completed: [] as Todo[], pending: [] as Todo[] }
  );
}

/**
 * Filters todos by search term
 */
export function filterTodos(todos: Todo[], searchTerm: string): Todo[] {
  if (!searchTerm.trim()) return todos;

  const lowerSearchTerm = searchTerm.toLowerCase();
  return todos.filter(todo =>
    todo.title.toLowerCase().includes(lowerSearchTerm)
  );
}

/**
 * Gets todo statistics
 */
export function getTodoStats(todos: Todo[]): {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
} {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, completed, pending, completionRate };
}

/**
 * Creates a mock user ID for development/testing
 */
export function getMockUserId(): string {
  return 'mock-user-1';
}

/**
 * Sanitizes todo title input
 */
export function sanitizeTodoTitle(title: string): string {
  return title.trim().replace(/\s+/g, ' ');
}