"use client";

import { useState } from "react";
import Link from "next/link";
import {
  UserPlus,
  CheckCircle,
  Mail,
  Phone,
  User,
  ArrowRight,
} from "lucide-react";
import { useSubmitApplication } from "../../hooks/queries/useMembership";

export default function MemberRegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const submitMutation = useSubmitApplication();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) return;

    await submitMutation.mutateAsync({
      full_name: fullName,
      email,
      phone,
    });

    setIsSuccess(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-600/30">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Formulir Pendaftaran Kader Baru
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Tabel Database: <code>MemberApplication</code> • Rekrutmen &
              Keanggotaan
            </p>
          </div>
        </div>

        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Pendaftaran Berhasil Dikirim!
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Data pendaftaran atas nama <strong>{fullName}</strong> telah masuk
              ke basis data dengan status{" "}
              <span className="font-mono font-bold text-amber-600">PENDING</span>{" "}
              dan aksi telah tercatat di <strong>AuditLog</strong>.
            </p>
            <p className="text-xs text-slate-400">
              Tim Kaderisasi PC IMM Malang akan memverifikasi berkas Anda.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => {
                  setFullName("");
                  setEmail("");
                  setPhone("");
                  setIsSuccess(false);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Daftar Lagi
              </button>
              <Link
                href="/"
                className="px-5 py-2 text-xs font-bold bg-red-700 text-white rounded-xl hover:bg-red-800 flex items-center gap-1.5"
              >
                Kembali ke Beranda
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Lengkap (full_name)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Muhammad Ilham Pratama"
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Alamat Email Aktif (email)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ilham@student.umm.ac.id"
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nomor WhatsApp / Telepon (phone)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white font-mono"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full py-3 px-4 rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/25 active:scale-98 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                {submitMutation.isPending
                  ? "Mengirim Formulir..."
                  : "Kirim Pendaftaran Anggota"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}