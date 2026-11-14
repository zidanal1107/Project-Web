"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@imm-malang.or.id");
  const [password, setPassword] = useState("password123");
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
    if (email.includes("admin")) {
      router.push("/admin");
    } else {
      router.push("/");
    }
  };

  const fillQuickAccount = (type: "admin" | "kader") => {
    if (type === "admin") {
      setEmail("admin@imm-malang.or.id");
      setPassword("admin123");
    } else {
      setEmail("kader@imm-malang.or.id");
      setPassword("kader123");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-red-700 text-white rounded-2xl mx-auto flex items-center justify-center font-bold text-lg shadow-md shadow-red-700/20">
            IMM
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Autentikasi Kader
          </h2>
          <p className="text-xs text-slate-500">
            Masuk untuk mengakses dokumen internal dan panel manajemen organisasi
          </p>
        </div>

        {/* Quick Demo Fill Buttons */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center">
            Akun Percobaan (Demo)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillQuickAccount("admin")}
              className="py-1.5 px-2 rounded-lg text-xs font-semibold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 hover:bg-red-200 cursor-pointer text-center"
            >
              Akun Admin (BPH)
            </button>
            <button
              type="button"
              onClick={() => fillQuickAccount("kader")}
              className="py-1.5 px-2 rounded-lg text-xs font-semibold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 hover:bg-amber-200 cursor-pointer text-center"
            >
              Akun Kader Aktif
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Kader / NIA
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600 dark:text-white"
                placeholder="nama@imm-malang.or.id"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600 dark:text-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl font-bold bg-red-700 hover:bg-red-800 text-white shadow-lg shadow-red-700/20 active:scale-98 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          <Link href="/" className="text-red-700 font-semibold hover:underline">
            Kembali ke Portal Publik
          </Link>
        </div>
      </div>
    </div>
  );
}