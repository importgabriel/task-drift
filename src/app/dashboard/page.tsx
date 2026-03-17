import Navbar from "@/components/Navbar";
import TodoList from "@/components/TodoList";

// This is a Server Component — it renders the shell.
// TodoList itself is a Client Component that manages state.
export default function DashboardPage() {
  // In production the auth agent's middleware ensures only
  // authenticated users reach this page. For demo mode we
  // render directly without a session check.
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 px-4 py-10">
        {/* Greeting */}
        <div className="mx-auto mb-8 max-w-lg text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            My Tasks
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Interactive todo list */}
        <TodoList />
      </main>
    </div>
  );
}
