"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Bell,
  Calendar,
  Users,
  History,
  Building,
  ArrowLeft,
  LogOut,
  Shield,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme, mounted } = useTheme();

  const adminMenu = [
    { label: "Dasbor Utama", path: "/admin", icon: LayoutDashboard },
    { label: "Pengumuman", path: "/admin/pengumuman", icon: Bell },
    { label: "Agenda Kegiatan", path: "/admin/agenda", icon: Calendar },
    { label: "Rekrutmen & Anggota", path: "/admin/keanggotaan", icon: Users },
    { label: "Profil & Struktur", path: "/admin/organisasi", icon: Building },
    { label: "Histori Audit", path: "/admin/audit", icon: History },
  ];

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === "/admin" && pathname !== "/admin") return false;
    return pathname === path;
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen flex bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 bg-ambient-gradient transition-colors">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Minimalist Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-60 bg-white dark:bg-zinc-950 border-r border-black/[0.06] dark:border-white/[0.06] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Top small gradient accent */}
          <div className="h-0.5 w-full bg-gradient-imm" />

          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-black/[0.06] dark:border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-imm flex items-center justify-center font-black text-white text-xs shadow-sm">
                IMM
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs tracking-tight text-zinc-900 dark:text-white">
                  Panel Admin
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  PC IMM Malang
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-zinc-500 hover:text-zinc-800 dark:hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {adminMenu.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? "bg-gradient-imm text-white font-semibold shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-yellow-200" : ""}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-black/[0.06] dark:border-white/[0.06] space-y-2">
            <Link
              href="/"
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-amber-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Portal Publik</span>
            </Link>

            <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between px-1">
              <div className="flex items-center gap-2 truncate">
                <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-700 dark:text-zinc-300 shrink-0">
                  {user?.name?.charAt(0) || "A"}
                </div>
                <div className="text-left truncate">
                  <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">
                    Administrator
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                title="Keluar"
                className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 lg:pl-60 flex flex-col min-w-0">
          {/* Minimal Top Header */}
          <header className="h-16 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 transition-colors">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-600" />
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 hidden sm:inline">
                  Portal Tata Kelola & Audit
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                title={!mounted ? "Ganti Tema" : theme === "dark" ? "Mode Terang" : "Mode Gelap"}
                className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 cursor-pointer"
                aria-label="Toggle Theme"
              >
                {!mounted ? (
                  <span className="w-4 h-4 inline-block opacity-0" />
                ) : theme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-zinc-700" />
                )}
              </button>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-amber-400 border border-red-200/80 dark:border-red-900/60">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Terhubung
              </span>
            </div>
          </header>

          {/* Main Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
