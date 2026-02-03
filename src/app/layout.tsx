import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DSA Progress Tracker",
  description: "Track your DSA learning journey with spaced repetition",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🧠</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                DSA Tracker
              </span>
            </Link>

            <div className="flex items-center gap-8">
              <Link
                href="/dashboard"
                className="text-slate-300 hover:text-cyan-400 transition-colors font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/problems"
                className="text-slate-300 hover:text-cyan-400 transition-colors font-medium"
              >
                Problems
              </Link>
              <Link
                href="/review"
                className="text-slate-300 hover:text-cyan-400 transition-colors font-medium"
              >
                Review
              </Link>
              <Link
                href="/approaches"
                className="text-slate-300 hover:text-cyan-400 transition-colors font-medium"
              >
                Approaches
              </Link>
            </div>
          </div>
        </nav>

        <main className="pt-20">{children}</main>
      </body>
    </html>
  );
}
