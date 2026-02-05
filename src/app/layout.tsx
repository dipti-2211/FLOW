import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "../styles/globals.css";
import BrandLogo from "@/components/branding/BrandLogo";
import BrandFooter from "@/components/branding/BrandFooter";
import VibeSwitcher, { VibeProvider } from "@/components/ui/VibeSwitcher";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "vibe.cpp | DSA Progress Tracker",
  description:
    "Track your DSA learning journey with spaced repetition. Hand-coded with ☕ and C++.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <VibeProvider>
          {/* Navigation */}
          <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
              {/* Custom Brand Logo */}
              <BrandLogo size="md" showTagline={false} />

              <div className="flex items-center gap-8">
                <Link
                  href="/dashboard"
                  className="nav-link text-slate-300 hover:text-pink-400 transition-all duration-300 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/problems"
                  className="nav-link text-slate-300 hover:text-pink-400 transition-all duration-300 font-medium"
                >
                  Problems
                </Link>
                <Link
                  href="/review"
                  className="nav-link text-slate-300 hover:text-pink-400 transition-all duration-300 font-medium"
                >
                  Review
                </Link>
                <Link
                  href="/approaches"
                  className="nav-link text-slate-300 hover:text-pink-400 transition-all duration-300 font-medium"
                >
                  Approaches
                </Link>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="pt-20 flex-1">{children}</main>

          {/* Custom Branded Footer */}
          <BrandFooter authorName="Your Name" />

          {/* Vibe Switcher */}
          <VibeSwitcher />
        </VibeProvider>
      </body>
    </html>
  );
}
