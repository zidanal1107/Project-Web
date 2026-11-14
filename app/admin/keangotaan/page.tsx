"use client";

import { useState } from "react";
import { Check, X, Users, Award } from "lucide-react";
import {
  useMemberApplications,
  useMembers,
  useApproveApplication,
  useRejectApplication,
} from "../../../hooks/queries/useMembership";
import { SkeletonLoader } from "../../../components/feedback/SkeletonLoader";

export default function ManageMembership() {
  const [activeTab, setActiveTab] = useState<"applications" | "members">(
    "applications"
  );
  const { data: applications, isLoading: isAppsLoading } =
    useMemberApplications();
  const { data: members, isLoading: isMembersLoading } = useMembers();

  const approveMutation = useApproveApplication();
  const rejectMutation = useRejectApplication();

  const handleApprove = async (id: number, name: string) => {
    if (
      confirm(
        `Setujui pendaftaran ${name}? Aksi ini akan menerbitkan Nomor Induk Anggota (NIA) dan dicatat ke AuditLog.`
      )
    ) {
      await approveMutation.mutateAsync({ application_id: id, admin_id: 1 });
    }
  };

  const handleReject = async (id: number, name: string) => {
    if (
      confirm(`Tolak pendaftaran ${name}? Tindakan ini akan dicatat ke AuditLog.`)
    ) {
      await rejectMutation.mutateAsync({ application_id: id, admin_id: 1 });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Kelola Rekrutmen & Keanggotaan
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Pengelolaan entitas <code>MemberApplication</code> dan penerbitan{" "}
          <code>Member</code> (Nomor Anggota / NIA).
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("applications")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === "applications"
              ? "bg-amber-600 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Pendaftaran Masuk (MemberApplication)</span>
          <span className="px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">
            {applications?.filter((a) => a.status === "PENDING").length || 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("members")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === "members"
              ? "bg-red-700 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Anggota Resmi Tervalidasi (Member)</span>
          <span className="px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">
            {members?.length || 0}
          </span>
        </button>
      </div>

      {/* Tab 1: MemberApplication */}
      {activeTab === "applications" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          {isAppsLoading ? (
            <div className="p-6">
              <SkeletonLoader count={3} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <tr>
                    <th className="py-3 px-4 font-semibold">ID</th>
                    <th className="py-3 px-4 font-semibold">
                      Nama Lengkap (full_name)
                    </th>
                    <th className="py-3 px-4 font-semibold">
                      Kontak (email / phone)
                    </th>
                    <th className="py-3 px-4 font-semibold">
                      Tanggal Daftar (submitted_at)
                    </th>
                    <th className="py-3 px-4 font-semibold">Status (status)</th>
                    <th className="py-3 px-4 font-semibold text-right">
                      Verifikasi Admin
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {applications?.map((item) => (
                    <tr
                      key={item.application_id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                    >
                      <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">
                        #{item.application_id}
                      </td>
                      <td className="py-3 px-4 font-sans font-semibold text-slate-900 dark:text-white">
                        {item.full_name}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        <div>{item.email}</div>
                        <div className="text-[11px] text-slate-400">
                          {item.phone}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(item.submitted_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === "APPROVED"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                              : item.status === "REJECTED"
                              ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {item.status === "PENDING" ? (
                          <div className="flex items-center justify-end gap-1 font-sans">
                            <button
                              onClick={() =>
                                handleApprove(
                                  item.application_id,
                                  item.full_name
                                )
                              }
                              disabled={approveMutation.isPending}
                              className="px-2.5 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1 shadow-sm cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Setujui</span>
                            </button>
                            <button
                              onClick={() =>
                                handleReject(
                                  item.application_id,
                                  item.full_name
                                )
                              }
                              disabled={rejectMutation.isPending}
                              className="px-2.5 py-1 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-1 shadow-sm cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Tolak</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-sans">
                            Telah diproses
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Member */}
      {activeTab === "members" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          {isMembersLoading ? (
            <div className="p-6">
              <SkeletonLoader count={3} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Member ID</th>
                    <th className="py-3 px-4 font-semibold">
                      Nomor Anggota (member_number)
                    </th>
                    <th className="py-3 px-4 font-semibold">Nama Anggota</th>
                    <th className="py-3 px-4 font-semibold">Kontak</th>
                    <th className="py-3 px-4 font-semibold">
                      Tanggal Bergabung (joined_at)
                    </th>
                    <th className="py-3 px-4 font-semibold">Status (status)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {members?.map((m) => (
                    <tr
                      key={m.member_id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                    >
                      <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">
                        #{m.member_id}
                      </td>
                      <td className="py-3 px-4 font-bold text-red-700 dark:text-red-400">
                        {m.member_number}
                      </td>
                      <td className="py-3 px-4 font-sans font-semibold text-slate-900 dark:text-white">
                        {m.full_name}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        <div>{m.email}</div>
                        <div className="text-[11px] text-slate-400">
                          {m.phone}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(m.joined_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}