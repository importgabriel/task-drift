import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TodoApp — Stay Organized",
  description: "A simple, clean todo list app to keep you on track.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
