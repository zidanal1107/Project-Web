"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  // State kosong tanpa nilai bawaan (tidak autofill)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login({ email, password });
    if (success) {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center py-12 px-4 sm:px-6">
      {/* Modern Gradient Glowing Border Card (Linear / Vercel Aesthetic) */}
      <div className="portal-glow-border max-w-sm w-full transition-all">
        <div className="bg-white dark:bg-[#0c0c0e]/95 backdrop-blur-xl p-7 sm:p-8 rounded-[1.2rem] space-y-6">

          {/* Header with Red-Yellow Gradient Badge */}
          <div className="text-center space-y-2">
            <div className="w-10 h-10 bg-gradient-imm text-white rounded-xl mx-auto flex items-center justify-center font-bold text-sm shadow-md shadow-red-500/20">
              IMM
            </div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Masuk Administrator
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Akses khusus pengelolaan data & audit organisasi
            </p>
          </div>

          {/* Error notification if unauthorized */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50/80 dark:bg-red-950/40 border border-red-200/80 dark:border-red-900/60 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form with Modern Portal Inputs - Clean without autofill */}
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Email Admin
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="portal-input w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl font-mono"
                  placeholder="Masukkan email admin..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="portal-input w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl"
                  placeholder="Masukkan kata sandi..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl font-semibold bg-gradient-imm text-white shadow-md shadow-red-500/20 hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Masuk ke Panel Admin</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Link kembali ke publik */}
          <div className="pt-2 text-center">
            <Link
              href="/"
              className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-amber-400 transition-colors"
            >
              ← Kembali ke Beranda Publik
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
