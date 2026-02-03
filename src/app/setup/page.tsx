"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SetupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    gmail: "",
    password: "",
    leetcodeUrl: "",
    gfgUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Gmail validation (mandatory)
    if (!formData.gmail.trim()) {
      newErrors.gmail = "Gmail is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.gmail)) {
      newErrors.gmail = "Please enter a valid email address";
    }

    // Password validation (mandatory)
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // LeetCode URL validation (mandatory)
    if (!formData.leetcodeUrl.trim()) {
      newErrors.leetcodeUrl = "LeetCode URL is required";
    } else if (!formData.leetcodeUrl.includes("leetcode.com")) {
      newErrors.leetcodeUrl = "Please enter a valid LeetCode profile URL";
    }

    // GFG URL validation (optional, but validate if provided)
    if (
      formData.gfgUrl.trim() &&
      !formData.gfgUrl.includes("geeksforgeeks.org")
    ) {
      newErrors.gfgUrl = "Please enter a valid GeeksforGeeks profile URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Here you would typically send this to your API
      // For now, we'll store in localStorage and redirect
      localStorage.setItem(
        "userSetup",
        JSON.stringify({
          gmail: formData.gmail,
          leetcodeUrl: formData.leetcodeUrl,
          gfgUrl: formData.gfgUrl,
          setupComplete: true,
        }),
      );

      // Redirect to dashboard after setup
      router.push("/dashboard");
    } catch (error) {
      console.error("Setup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <span>←</span> Back to Home
        </Link>

        {/* Form Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🚀</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Let's Get Started!
            </h1>
            <p className="text-slate-400">
              Connect your accounts to sync your progress
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Gmail Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Gmail <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="gmail"
                value={formData.gmail}
                onChange={handleChange}
                placeholder="yourname@gmail.com"
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                  errors.gmail ? "border-red-500" : "border-slate-700"
                }`}
              />
              {errors.gmail && (
                <p className="text-red-400 text-sm mt-1">{errors.gmail}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all pr-12 ${
                    errors.password ? "border-red-500" : "border-slate-700"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* LeetCode URL Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                LeetCode Profile URL <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">
                  🟠
                </span>
                <input
                  type="url"
                  name="leetcodeUrl"
                  value={formData.leetcodeUrl}
                  onChange={handleChange}
                  placeholder="https://leetcode.com/u/yourusername"
                  className={`w-full px-4 py-3 pl-10 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                    errors.leetcodeUrl ? "border-red-500" : "border-slate-700"
                  }`}
                />
              </div>
              {errors.leetcodeUrl && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.leetcodeUrl}
                </p>
              )}
            </div>

            {/* GFG URL Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                GeeksforGeeks Profile URL{" "}
                <span className="text-slate-500">(Optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">
                  🟢
                </span>
                <input
                  type="url"
                  name="gfgUrl"
                  value={formData.gfgUrl}
                  onChange={handleChange}
                  placeholder="https://www.geeksforgeeks.org/user/yourusername"
                  className={`w-full px-4 py-3 pl-10 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                    errors.gfgUrl ? "border-red-500" : "border-slate-700"
                  }`}
                />
              </div>
              {errors.gfgUrl && (
                <p className="text-red-400 text-sm mt-1">{errors.gfgUrl}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  Complete Setup
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Privacy note */}
          <p className="text-center text-xs text-slate-500 mt-6">
            🔒 Your credentials are securely stored and never shared
          </p>
        </div>
      </div>
    </div>
  );
}
