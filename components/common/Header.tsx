"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Shield, LogOut, Sun, Moon, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme, mounted } = useTheme();
  const pathname = usePathname();

  const navLinks = [
    { label: "Beranda", path: "/" },
    { label: "Pengumuman", path: "/pengumuman" },
    { label: "Agenda", path: "/agenda" },
    { label: "Profil", path: "/profil" },
    { label: "Pendaftaran", path: "/daftar" },
  ];

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === "/" && pathname !== "/") return false;
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/[0.06] dark:border-white/[0.06] bg-white/85 dark:bg-black/85 backdrop-blur-md transition-colors">
      {/* Top 2px subtle red-yellow gradient accent line */}
      <div className="h-0.5 w-full bg-gradient-imm" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo with Red-Yellow Gradient */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-imm flex items-center justify-center text-white font-black text-xs shadow-md shadow-red-500/20 transition-transform group-hover:scale-105">
              IMM
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-white flex items-center gap-1.5">
                Pusat Informasi
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium -mt-0.5">
                PC IMM Malang
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive(link.path)
                    ? "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-amber-400 font-semibold"
                    : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions: Theme Toggle + Admin Button */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={!mounted ? "Ganti Tema" : theme === "dark" ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {!mounted ? (
                <span className="w-4 h-4 inline-block opacity-0" />
              ) : theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-700 transition-transform hover:-rotate-12" />
              )}
            </button>

            {/* Admin State Button */}
            {!mounted ? (
              <div className="w-24 h-8" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-1.5 pl-2 border-l border-black/[0.08] dark:border-white/[0.08]">
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-imm text-white shadow-sm hover:opacity-95 active:scale-95 transition-all"
                >
                  <Shield className="w-3.5 h-3.5 text-yellow-200" />
                  Admin Panel
                </Link>
                <button
                  onClick={logout}
                  title="Keluar dari sesi admin"
                  className="p-2 text-zinc-500 hover:text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-amber-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors border border-black/[0.08] dark:border-white/[0.08] hover:border-red-500/40"
              >
                <Lock className="w-3.5 h-3.5" />
                Masuk Admin
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              {!mounted ? (
                <span className="w-4 h-4 inline-block opacity-0" />
              ) : theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-700" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                isActive(link.path)
                  ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-amber-400 font-semibold"
                  : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
            {!mounted ? (
              <div className="h-9 w-full" />
            ) : isAuthenticated ? (
              <div className="flex items-center justify-between">
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-gradient-imm text-white w-full mr-2 justify-center shadow-sm"
                >
                  <Shield className="w-4 h-4 text-yellow-200" />
                  Admin Panel
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 text-zinc-500 hover:text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200"
              >
                <Lock className="w-4 h-4" />
                Masuk Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
