"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import type { Todo, FilterType } from "./types";
import TodoItem from "./TodoItem";

// ── Sample mock data so the UI looks populated without a database ──
const MOCK_TODOS: Todo[] = [
  {
    id: "1",
    title: "Buy groceries",
    completed: true,
    userId: "demo",
    createdAt: new Date(Date.now() - 5 * 60_000).toISOString(),
  },
  {
    id: "2",
    title: "Go for a morning run",
    completed: false,
    userId: "demo",
    createdAt: new Date(Date.now() - 4 * 60_000).toISOString(),
  },
  {
    id: "3",
    title: "Review project proposal",
    completed: false,
    userId: "demo",
    createdAt: new Date(Date.now() - 3 * 60_000).toISOString(),
  },
  {
    id: "4",
    title: "Call dentist for appointment",
    completed: false,
    userId: "demo",
    createdAt: new Date(Date.now() - 2 * 60_000).toISOString(),
  },
  {
    id: "5",
    title: "Read a book before bed",
    completed: false,
    userId: "demo",
    createdAt: new Date(Date.now() - 1 * 60_000).toISOString(),
  },
];

const FILTERS: { key: FilterType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
];

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

interface TodoListProps {
  userId?: string;
}

export default function TodoList({ userId = "demo" }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(MOCK_TODOS);
  const [filter, setFilter] = useState<FilterType>("all");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Try to load real todos from the API on mount ──
  useEffect(() => {
    async function fetchTodos() {
      try {
        const res = await fetch("/api/todos");
        if (!res.ok) return;
        const data = (await res.json()) as { todos?: Todo[] };
        if (Array.isArray(data.todos) && data.todos.length >= 0) {
          setTodos(data.todos);
          setApiAvailable(true);
        }
      } catch {
        // API not wired up yet — stay on mock data
      }
    }
    fetchTodos();
  }, []);

  // ── Add a todo ──
  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    const title = inputValue.trim();
    if (!title) return;

    const optimistic: Todo = {
      id: generateId(),
      title,
      completed: false,
      userId,
      createdAt: new Date().toISOString(),
    };

    setTodos((prev) => [optimistic, ...prev]);
    setInputValue("");
    inputRef.current?.focus();

    if (!apiAvailable) return;

    setLoading(true);
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (res.ok) {
        const data = (await res.json()) as { todo?: Todo };
        if (data.todo) {
          setTodos((prev) =>
            prev.map((t) => (t.id === optimistic.id ? data.todo! : t))
          );
        }
      }
    } catch {
      // Keep optimistic state
    } finally {
      setLoading(false);
    }
  }

  // ── Toggle completed ──
  async function handleToggle(id: string) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

    if (!apiAvailable) return;

    try {
      await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });
    } catch {
      // Keep local state — no rollback needed for a simple toggle
    }
  }

  // ── Delete a todo ──
  async function handleDelete(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));

    if (!apiAvailable) return;

    try {
      await fetch(`/api/todos/${id}`, { method: "DELETE" });
    } catch {
      // Item already removed from UI
    }
  }

  // ── Clear all completed ──
  async function handleClearCompleted() {
    const completedIds = todos.filter((t) => t.completed).map((t) => t.id);
    setTodos((prev) => prev.filter((t) => !t.completed));

    if (!apiAvailable) return;
    await Promise.allSettled(
      completedIds.map((id) => fetch(`/api/todos/${id}`, { method: "DELETE" }))
    );
  }

  // ── Filtered view ──
  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="mx-auto w-full max-w-lg">
      {/* ── Stats row ── */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: todos.length, color: "text-gray-900" },
          { label: "Active", value: activeCount, color: "text-indigo-600" },
          { label: "Done", value: completedCount, color: "text-emerald-600" },
        ].map((s) => (
          <div
            key={s.label}
            className="card flex flex-col items-center py-4"
          >
            <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
            <span className="text-xs text-gray-500">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Add todo form ── */}
      <form onSubmit={handleAdd} className="card mb-4 flex gap-2 p-3">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new task…"
          className="input-field shadow-none"
          disabled={loading}
          maxLength={200}
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || loading}
          className="btn-primary flex-shrink-0 px-4"
        >
          {loading ? (
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
          ) : (
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          )}
          <span className="sr-only">Add task</span>
        </button>
      </form>

      {/* ── Filter tabs ── */}
      <div className="card mb-2 flex gap-1 p-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`flex-1 rounded-lg py-1.5 text-sm font-semibold transition-colors ${
              filter === f.key
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {f.label}
            <span
              className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                filter === f.key ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-500"
              }`}
            >
              {f.key === "all"
                ? todos.length
                : f.key === "active"
                ? activeCount
                : completedCount}
            </span>
          </button>
        ))}
      </div>

      {/* ── Todo list ── */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            {filter === "completed" ? (
              <>
                <span className="mb-3 text-4xl">🎯</span>
                <p className="text-sm font-medium text-gray-500">
                  No completed tasks yet.
                </p>
                <p className="text-xs text-gray-400">
                  Check off a task to see it here.
                </p>
              </>
            ) : filter === "active" ? (
              <>
                <span className="mb-3 text-4xl">🎉</span>
                <p className="text-sm font-medium text-gray-500">
                  All caught up!
                </p>
                <p className="text-xs text-gray-400">
                  No active tasks remaining.
                </p>
              </>
            ) : (
              <>
                <span className="mb-3 text-4xl">📝</span>
                <p className="text-sm font-medium text-gray-500">
                  Your list is empty.
                </p>
                <p className="text-xs text-gray-400">
                  Add your first task above.
                </p>
              </>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}

        {/* Footer: clear completed */}
        {completedCount > 0 && (
          <div className="border-t border-gray-100 px-4 py-3 text-right">
            <button
              type="button"
              onClick={handleClearCompleted}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear {completedCount} completed{" "}
              {completedCount === 1 ? "task" : "tasks"}
            </button>
          </div>
        )}
      </div>

      {/* Demo mode notice */}
      {!apiAvailable && (
        <p className="mt-4 text-center text-xs text-gray-400">
          Running in demo mode — changes are local only.
        </p>
      )}
    </div>
  );
}
