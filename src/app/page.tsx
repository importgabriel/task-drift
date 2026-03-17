import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Nav ── */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white text-lg font-bold">
              T
            </span>
            <span className="text-lg font-bold text-gray-900">TodoApp</span>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/login" className="btn-secondary text-sm px-4 py-2">
              Sign in
            </Link>
            <Link href="/login?tab=signup" className="btn-primary text-sm px-4 py-2">
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <main className="flex flex-1 flex-col">
        <section className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
          <span className="mb-4 inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200">
            Simple &amp; Free
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
            Get things{" "}
            <span className="text-indigo-600">done</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-gray-500">
            TodoApp is the simplest way to capture tasks, stay organized, and
            actually finish what you start. No clutter, no friction.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/login?tab=signup" className="btn-primary px-8 py-3 text-base">
              Start for free
            </Link>
            <Link href="/login" className="btn-secondary px-8 py-3 text-base">
              Sign in
            </Link>
          </div>
          {/* Mini preview card */}
          <div className="mt-16 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl text-left">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
              My tasks · Today
            </p>
            {[
              { label: "Buy groceries", done: true },
              { label: "Go for a morning run", done: false },
              { label: "Review project proposal", done: false },
              { label: "Call dentist for appointment", done: false },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0"
              >
                <span
                  className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                    item.done
                      ? "border-indigo-500 bg-indigo-500"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {item.done && (
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
                </span>
                <span
                  className={`text-sm ${
                    item.done ? "text-gray-400 line-through" : "text-gray-700"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section className="border-t border-gray-200 bg-white py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
              Everything you need, nothing you don&apos;t
            </h2>
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                {
                  icon: "✅",
                  title: "Quick capture",
                  body: "Add tasks instantly with a single keystroke. Never lose a thought again.",
                },
                {
                  icon: "🔍",
                  title: "Smart filters",
                  body: "View all tasks, only active ones, or completed items with one click.",
                },
                {
                  icon: "🔒",
                  title: "Your data, safe",
                  body: "Each user sees only their own tasks, secured with modern auth.",
                },
              ].map((f) => (
                <div key={f.title} className="rounded-xl bg-gray-50 p-6">
                  <div className="mb-3 text-3xl">{f.icon}</div>
                  <h3 className="mb-2 font-semibold text-gray-900">{f.title}</h3>
                  <p className="text-sm text-gray-500">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} TodoApp — Built with Next.js &amp; Tailwind CSS
      </footer>
    </div>
  );
}
