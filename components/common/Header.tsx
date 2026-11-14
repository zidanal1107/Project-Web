"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Shield, LogOut, UserPlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { label: "Beranda", path: "/" },
    { label: "Pengumuman", path: "/pengumuman" },
    { label: "Agenda Kegiatan", path: "/agenda" },
    { label: "Profil Organisasi", path: "/profil" },
    { label: "Pendaftaran Anggota", path: "/daftar" },
  ];

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === "/" && pathname !== "/") return false;
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-bold shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
              <span className="tracking-tighter text-sm font-extrabold">IMM</span>
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
                Pusat Informasi
                <span className="text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-800">
                  PC MALANG
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Ikatan Mahasiswa Muhammadiyah
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User / Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/daftar"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Daftar Kader
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {user?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Admin Panel
                  </Link>
                )}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                      {user?.name}
                    </p>
                    <p className="text-[11px] text-red-600 dark:text-red-400 capitalize">
                      {user?.role}
                    </p>
                  </div>
                  <button
                    onClick={logout}
                    title="Keluar"
                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-700 hover:bg-red-800 text-white transition-colors shadow-sm cursor-pointer"
              >
                Masuk
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                isActive(link.path)
                  ? "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 font-semibold"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-red-600 capitalize">{user?.role}</p>
                </div>
                <div className="flex gap-2">
                  {user?.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="p-1.5 text-slate-500 hover:text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2 bg-red-700 text-white rounded-lg text-sm font-semibold"
              >
                Masuk
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}