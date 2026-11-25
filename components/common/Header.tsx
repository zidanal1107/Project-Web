"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Shield, LogOut, Sun, Moon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const lastScrollY = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHoveredRef = useRef(false);
  const mobileMenuOpenRef = useRef(false);

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

  // Fungsi memulai/mereset timer 5 detik
  const startHideTimer = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (!isHoveredRef.current && !mobileMenuOpenRef.current) {
        setIsVisible(false);
      }
    }, 3000);
  }, []);

  // Pantau arah scroll: munculkan lagi & reset timer jika digeser ke atas
  useEffect(() => {
    lastScrollY.current = window.scrollY;
    startHideTimer();

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY.current) {
        // Halaman digeser ke atas -> tampilkan header & reset timer 5 detik
        setIsVisible(true);
        startHideTimer();
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [startHideTimer]);

  // Tahan header tetap muncul saat menu mobile terbuka
  useEffect(() => {
    mobileMenuOpenRef.current = mobileMenuOpen;
    if (mobileMenuOpen) {
      setIsVisible(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    } else {
      startHideTimer();
    }
  }, [mobileMenuOpen, startHideTimer]);

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : "-100%" }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => {
        isHoveredRef.current = true;
        if (hideTimer.current) clearTimeout(hideTimer.current);
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
        startHideTimer();
      }}
      className="fixed top-0 inset-x-0 z-40 w-full border-b border-[#E8E2CC] dark:border-zinc-800 bg-[#FFFDF2]/95 dark:bg-[#0B0B0C]/95 backdrop-blur-md transition-colors"
    >
      <div className="h-1 w-full bg-linear-to-r from-[#7F1D1D] via-[#991B1B] to-[#FACC15]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link
            href="/"
            className="flex items-center gap-3.5 group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#991B1B] rounded-lg"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="w-10 h-10 rounded-lg bg-[#7F1D1D] flex items-center justify-center text-[#FACC15] font-black text-sm tracking-tight shadow-sm"
            >
              IMM
            </motion.div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-zinc-900 dark:text-white leading-tight">
                Pusat Informasi
              </span>
              <span className="text-xs font-semibold text-[#991B1B] dark:text-[#FACC15] tracking-wide">
                PC IMM Kota Malang
              </span>
            </div>
          </Link>

          <nav
            aria-label="Navigasi Utama"
            className="hidden md:flex items-center gap-1.5"
          >
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`relative px-4 py-2 rounded-lg text-sm lg:text-[15px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#991B1B] ${active
                    ? "text-[#991B1B] dark:text-[#FACC15] font-bold"
                    : "text-zinc-700 dark:text-zinc-300 font-semibold hover:text-[#991B1B] dark:hover:text-white"
                    }`}
                >
                  {active && (
                    <motion.span
                      layoutId="headerActiveNav"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                      className="absolute inset-0 rounded-lg bg-[#F5EFD6] dark:bg-zinc-900 border border-[#E8E2CC] dark:border-zinc-700 -z-10"
                    />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              onClick={toggleTheme}
              title={
                !mounted
                  ? "Ganti Tema"
                  : theme === "dark"
                    ? "Ganti ke Mode Terang"
                    : "Ganti ke Mode Gelap"
              }
              className="p-2.5 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-[#F5EFD6] dark:hover:bg-zinc-900 border border-transparent hover:border-[#E8E2CC] dark:hover:border-zinc-800 transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {!mounted ? (
                <span className="w-5 h-5 inline-block opacity-0" />
              ) : theme === "dark" ? (
                <Sun className="w-5 h-5 text-[#FACC15]" />
              ) : (
                <Moon className="w-5 h-5 text-zinc-800" />
              )}
            </motion.button>

            {mounted && isAuthenticated && (
              <div className="flex items-center gap-2 pl-3 border-l border-[#E8E2CC] dark:border-zinc-800">
                <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-[#7F1D1D] hover:bg-[#991B1B] text-white shadow-sm transition-colors"
                  >
                    <Shield className="w-4 h-4 text-[#FACC15]" />
                    Admin Panel
                  </Link>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={logout}
                  title="Keluar dari sesi admin"
                  aria-label="Keluar"
                  className="p-2.5 text-zinc-600 dark:text-zinc-400 hover:text-[#991B1B] hover:bg-[#F5EFD6] dark:hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-[#F5EFD6] dark:hover:bg-zinc-900"
            >
              {!mounted ? (
                <span className="w-5 h-5 inline-block opacity-0" />
              ) : theme === "dark" ? (
                <Sun className="w-5 h-5 text-[#FACC15]" />
              ) : (
                <Moon className="w-5 h-5 text-zinc-800" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-zinc-800 dark:text-zinc-200 hover:bg-[#F5EFD6] dark:hover:bg-zinc-900"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#991B1B] dark:text-[#FACC15]" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
            className="md:hidden overflow-hidden border-t border-[#E8E2CC] dark:border-zinc-800 bg-[#FFFDF2] dark:bg-[#0B0B0C]"
          >
            <div className="px-4 pt-3 pb-5 space-y-1.5">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-base transition-colors ${active
                      ? "bg-[#F5EFD6] dark:bg-zinc-900 text-[#991B1B] dark:text-[#FACC15] border border-[#E8E2CC] dark:border-zinc-800 font-bold"
                      : "text-zinc-800 dark:text-zinc-200 font-semibold hover:bg-[#F5EFD6]/60 dark:hover:bg-zinc-900/60"
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {mounted && isAuthenticated && (
                <div className="pt-3 mt-2 border-t border-[#E8E2CC] dark:border-zinc-800 flex items-center justify-between gap-2">
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg text-base font-semibold bg-[#7F1D1D] text-white w-full justify-center shadow-sm"
                  >
                    <Shield className="w-5 h-5 text-[#FACC15]" />
                    Admin Panel
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="p-3 rounded-lg border border-[#E8E2CC] dark:border-zinc-800 bg-[#F5EFD6] dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-[#991B1B]"
                    aria-label="Keluar"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}