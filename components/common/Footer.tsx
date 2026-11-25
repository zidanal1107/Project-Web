"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";

export function Footer() {
  const quickLinks = [
    { label: "Warta & Surat Edaran", href: "/pengumuman" },
    { label: "Kalender Agenda", href: "/agenda" },
    { label: "Profil & Struktur Bidang", href: "/profil" },
    { label: "Pendaftaran Anggota", href: "/daftar" },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-[#E8E2CC] dark:border-zinc-800 bg-[#FFFDF2] dark:bg-[#0B0B0C] text-zinc-700 dark:text-zinc-300 text-sm transition-colors">
      <div className="h-1 w-full bg-linear-to-r from-[#7F1D1D] via-[#991B1B] to-[#FACC15]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-[#E8E2CC] dark:border-zinc-800">
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3.5 group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#991B1B] rounded-lg"
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
                  PC IMM Kota Malang
                </span>
                <span className="text-xs font-semibold text-[#991B1B] dark:text-[#FACC15] tracking-wide">
                  Pusat Informasi & Tata Kelola
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed max-w-md text-zinc-600 dark:text-zinc-400">
              Portal resmi informasi organisasi, surat edaran pimpinan, agenda perkaderan, dan transparansi tata kelola Ikatan Mahasiswa Muhammadiyah Kota Malang.
            </p>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h3 className="font-extrabold text-zinc-900 dark:text-white text-xs uppercase tracking-[0.14em] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#991B1B] dark:bg-[#F87171]" />
              Tautan Cepat
            </h3>
            <nav aria-label="Tautan Cepat Footer" className="flex flex-col space-y-2.5">
              {quickLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group inline-flex items-center gap-1.5 w-fit text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-[#991B1B] dark:hover:text-[#FACC15] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#991B1B] rounded"
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#991B1B] dark:text-[#FACC15]" />
                </Link>
              ))}
            </nav>
          </div>

          <div className="md:col-span-4 space-y-4">
            <h3 className="font-extrabold text-zinc-900 dark:text-white text-xs uppercase tracking-[0.14em] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B45309] dark:bg-[#FACC15]" />
              Sekretariat
            </h3>
            <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <p className="flex items-start gap-2.5 leading-relaxed">
                <MapPin className="w-4 h-4 text-[#991B1B] dark:text-[#F87171] shrink-0 mt-1" />
                <span>Gedung Dakwah Muhammadiyah, Lowokwaru, Kota Malang</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B45309] dark:text-[#FACC15] shrink-0" />
                <a
                  href="mailto:sekretariat@imm-malang.or.id"
                  className="hover:text-[#991B1B] dark:hover:text-[#FACC15] transition-colors font-medium"
                >
                  sekretariat@imm-malang.or.id
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
          <p className="font-medium">© 2026 PC IMM Kota Malang. Hak cipta dilindungi.</p>
          <p className="font-bold text-[#991B1B] dark:text-[#FACC15] text-center sm:text-right">
            Anggun dalam Moral, Unggul dalam Intelektual
          </p>
        </div>
      </div>
    </footer>
  );
}