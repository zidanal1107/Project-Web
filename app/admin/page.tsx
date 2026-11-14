"use client";

import Link from "next/link";
import {
  Bell,
  Calendar,
  Users,
  ShieldCheck,
  PlusCircle,
  TrendingUp,
  ArrowUpRight,
  RotateCcw,
} from "lucide-react";
import { useAnnouncements } from "../../../hooks/queries/useAnnouncements";
import { useEvents } from "../../../hooks/queries/useEvents";
import {
  useMemberApplications,
  useMembers,
} from "../../../hooks/queries/useMembership";
import { useAuditLogs } from "../../../hooks/queries/useAudit";
import { db } from "../../../services/client/db.service";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const { data: announcements } = useAnnouncements();
  const { data: events } = useEvents();
  const { data: applications } = useMemberApplications();
  const { data: members } = useMembers();
  const { data: auditLogs } = useAuditLogs();

  const pendingApps =
    applications?.filter((a) => a.status === "PENDING").length || 0;

  const handleResetDb = () => {
    if (
      confirm(
        "Reset seluruh data ke konfigurasi awal database? Tindakan ini akan mengembalikan data contoh."
      )
    ) {
      db.resetDatabase();
      queryClient.invalidateQueries();
      alert("Basis data berhasil direset ke konfigurasi awal.");
    }
  };

  const stats = [
    {
      title: "Tabel Announcement",
      value: announcements?.length || 0,
      icon: Bell,
      change: "Warta & Instruksi",
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-950/40",
      link: "/admin/pengumuman",
    },
    {
      title: "Tabel Event",
      value: events?.length || 0,
      icon: Calendar,
      change: "Agenda Organisasi",
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      link: "/admin/agenda",
    },
    {
      title: "Pendaftaran Masuk",
      value: pendingApps,
      icon: Users,
      change: `${pendingApps} Menunggu Persetujuan`,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/40",
      link: "/admin/keanggotaan",
    },
    {
      title: "Anggota Aktif (Member)",
      value: members?.length || 0,
      icon: ShieldCheck,
      change: "Memiliki Nomor Anggota (NIA)",
      color: "text-indigo-600",
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
      link: "/admin/keanggotaan",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-red-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
            Sistem Manajemen & Audit Terpadu
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">
            Dasbor Tata Kelola Database Organisasi
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Seluruh mutasi data pada Announcement, Event, dan MemberApplication
            secara otomatis tercatat ke dalam tabel <strong>AuditLog</strong>.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/pengumuman"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold bg-white text-slate-900 text-xs hover:bg-slate-100 transition-colors shadow-md"
          >
            <PlusCircle className="w-4 h-4 text-red-700" />
            Tulis Pengumuman
          </Link>
          <button
            onClick={handleResetDb}
            title="Reset DB ke Seed Awal"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            Reset Data
          </button>
        </div>
      </div>

      {/* Stat cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <Link
              key={i}
              href={s.link}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${s.bg} ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-red-700 transition-colors" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-4">
                {s.value}
              </p>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                {s.title}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {s.change}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Audit Log Live Snapshot */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-100 dark:bg-red-950 text-red-700 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Histori Audit Terkini (AuditLog)
              </h3>
              <p className="text-xs text-slate-500">
                Log akuntabilitas sistem terekam secara otomatis setiap kali ada
                perubahan entitas.
              </p>
            </div>
          </div>
          <Link
            href="/admin/audit"
            className="text-xs font-bold text-red-700 hover:underline flex items-center gap-1"
          >
            Lihat Semua Log Audit
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500">
              <tr>
                <th className="py-2.5 px-3 font-semibold">ID</th>
                <th className="py-2.5 px-3 font-semibold">
                  Waktu (created_at)
                </th>
                <th className="py-2.5 px-3 font-semibold">Aksi (action)</th>
                <th className="py-2.5 px-3 font-semibold">
                  Entitas (entity_type)
                </th>
                <th className="py-2.5 px-3 font-semibold">Admin (admin_id)</th>
                <th className="py-2.5 px-3 font-semibold">
                  Rincian Perubahan (details)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {auditLogs?.slice(0, 5).map((log) => (
                <tr
                  key={log.audit_id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                >
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                    #{log.audit_id}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">
                    {new Date(log.created_at).toLocaleTimeString("id-ID")}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-red-700 dark:text-red-400">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 font-sans">
                    {log.entity_type} #{log.entity_id}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 font-sans">
                    {log.admin_name}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 font-sans max-w-xs truncate">
                    {log.details || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}