"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavbarProps {
  userEmail?: string;
}

export default function Navbar({ userEmail }: NavbarProps) {
  const router = useRouter();

  async function handleSignOut() {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
    } catch {
      // Auth API may not be wired up yet — proceed to home regardless
    }
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white text-base font-bold">
            T
          </span>
          <span className="text-base font-bold text-gray-900">TodoApp</span>
        </Link>

        <div className="flex items-center gap-4">
          {userEmail && (
            <span className="hidden text-sm text-gray-500 sm:block">
              {userEmail}
            </span>
          )}
          <button
            type="button"
            onClick={handleSignOut}
            className="btn-secondary px-3 py-1.5 text-xs"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
