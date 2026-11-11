import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-700 flex items-center justify-center text-white font-bold">
                IMM
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-base">
                Pimpinan Cabang IMM Malang
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-md">
              Pusat Informasi Organisasi Ikatan Mahasiswa Muhammadiyah (IMM) Cabang Malang.
              Mewadahi gerak dakwah intelektual, humanitas, dan religiusitas mahasiswa se-Malang Raya.
            </p>
            <div className="flex items-center gap-3 text-slate-500">
              <a
                href="https://imm-malang.or.id"
                target="_blank"
                rel="noreferrer"
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg hover:text-red-600 transition-colors"
                title="Situs Resmi"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav Links */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Tautan Cepat</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/pengumuman" className="hover:text-red-600 transition-colors">
                  Warta & Instruksi
                </Link>
              </li>
              <li>
                <Link to="/dokumen" className="hover:text-red-600 transition-colors">
                  Arsip SK & Pedoman
                </Link>
              </li>
              <li>
                <Link to="/profil" className="hover:text-red-600 transition-colors">
                  Struktur Pimpinan
                </Link>
              </li>
              <li>
                <Link to="/agenda" className="hover:text-red-600 transition-colors">
                  Kalender Perkaderan
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Sekretariat</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>Gedung Dakwah Muhammadiyah, Jl. Gajayana No. 28B, Lowokwaru, Kota Malang, Jawa Timur</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>sekretariat@imm-malang.or.id</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>+62 812-3456-7890</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Pimpinan Cabang IMM Malang. All rights reserved.</p>
          <p className="text-slate-400">Anggun dalam Moral, Unggul dalam Intelektual</p>
        </div>
      </div>
    </footer>
  );
}
