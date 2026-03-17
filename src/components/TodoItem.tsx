"use client";

import { useState } from "react";
import type { Todo } from "./types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleDeleteClick() {
    if (confirmDelete) {
      onDelete(todo.id);
    } else {
      setConfirmDelete(true);
      // Auto-cancel after 2 s
      setTimeout(() => setConfirmDelete(false), 2000);
    }
  }

  return (
    <li className="group flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-gray-50">
      {/* Checkbox */}
      <button
        type="button"
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? "Mark as active" : "Mark as complete"}
        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          todo.completed
            ? "border-indigo-500 bg-indigo-500 hover:bg-indigo-600 hover:border-indigo-600"
            : "border-gray-300 bg-white hover:border-indigo-400"
        }`}
      >
        {todo.completed && (
          <svg
            className="h-3 w-3 text-white"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M2 6l3 3 5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Title */}
      <span
        className={`flex-1 text-sm leading-snug transition-colors ${
          todo.completed ? "text-gray-400 line-through" : "text-gray-800"
        }`}
      >
        {todo.title}
      </span>

      {/* Delete button */}
      <button
        type="button"
        onClick={handleDeleteClick}
        aria-label={confirmDelete ? "Confirm delete" : "Delete task"}
        className={`flex-shrink-0 rounded-md px-2 py-1 text-xs font-medium transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 ${
          confirmDelete
            ? "bg-red-100 text-red-600 hover:bg-red-200 opacity-100"
            : "text-gray-400 hover:bg-gray-200 hover:text-gray-600"
        }`}
      >
        {confirmDelete ? "Confirm?" : "Delete"}
      </button>
    </li>
  );
}
