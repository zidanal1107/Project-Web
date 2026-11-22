"use client";

import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-black/[0.06] dark:border-white/[0.06] bg-zinc-50/50 dark:bg-zinc-950/40 text-zinc-500 dark:text-zinc-400 text-xs transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-black/[0.06] dark:border-white/[0.06]">
          
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-xs">
                IMM
              </div>
              <span className="font-bold text-zinc-900 dark:text-white text-sm">
                Pimpinan Cabang IMM Malang
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm text-zinc-500 dark:text-zinc-400">
              Pusat Informasi Organisasi & Tata Kelola Ikatan Mahasiswa Muhammadiyah Cabang Malang Raya.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-semibold text-zinc-900 dark:text-white text-xs uppercase tracking-wider">
              Tautan Cepat
            </h4>
            <div className="flex flex-col space-y-1.5">
              <Link href="/pengumuman" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
                Warta & Surat Edaran
              </Link>
              <Link href="/agenda" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
                Kalender Agenda
              </Link>
              <Link href="/profil" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
                Profil & Struktur Bidang
              </Link>
              <Link href="/daftar" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
                Pendaftaran Anggota
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <h4 className="font-semibold text-zinc-900 dark:text-white text-xs uppercase tracking-wider">
              Sekretariat
            </h4>
            <div className="space-y-1.5 text-zinc-500 dark:text-zinc-400">
              <p className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                <span>Gedung Dakwah Muhammadiyah, Lowokwaru, Kota Malang</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>sekretariat@imm-malang.or.id</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-400 dark:text-zinc-500">
          <p>© 2026 PC IMM Malang. Hak cipta dilindungi.</p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
              Portal Admin
            </Link>
            <span>•</span>
            <span className="text-amber-500/80">Anggun dalam Moral, Unggul dalam Intelektual</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
