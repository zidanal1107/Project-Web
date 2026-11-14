"use client";

import { useState, useEffect } from "react";
import { Building, Save } from "lucide-react";
import {
  useOrganization,
  useDepartments,
  useUpdateOrganization,
} from "../../../hooks/queries/useOrg";

export default function ManageOrganization() {
  const { data: org } = useOrganization();
  const { data: departments } = useDepartments();

  // Organization form state
  const [name, setName] = useState("Pimpinan Cabang IMM Malang");
  const [description, setDescription] = useState("");
  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");
  const [email, setEmail] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // Sinkronkan state form ketika data org selesai dimuat oleh React Query
  useEffect(() => {
    if (org) {
      setName(org.name || "Pimpinan Cabang IMM Malang");
      setDescription(org.description || "");
      setVision(org.vision || "");
      setMission(org.mission || "");
      setEmail(org.email || "");
    }
  }, [org]);

  const updateOrgMutation = useUpdateOrganization();

  const handleSaveOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateOrgMutation.mutateAsync({
      data: {
        name,
        description,
        vision,
        mission,
        email,
      },
      admin_id: 1,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Kelola Profil & Entitas Organisasi
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Pengaturan entitas <code>Organization</code> dan{" "}
          <code>Department</code>. Setiap perubahan profil terekam di{" "}
          <strong>AuditLog</strong>.
        </p>
      </div>

      {/* Organization Form */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-950 text-red-700">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Entitas 1: Organization
              </h3>
              <p className="text-xs text-slate-500">organization_id = 1</p>
            </div>
          </div>
          {isSaved && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full animate-bounce">
              ✓ Berhasil disimpan & dicatat di AuditLog!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveOrg} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Organisasi (name)
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Resmi (email)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Deskripsi Singkat (description)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Visi Organisasi (vision)
              </label>
              <textarea
                rows={4}
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Misi Organisasi (mission)
              </label>
              <textarea
                rows={4}
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={updateOrgMutation.isPending}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold bg-red-700 hover:bg-red-800 text-white text-xs shadow-md transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>
                {updateOrgMutation.isPending
                  ? "Menyimpan..."
                  : "Simpan Profil & Catat Audit"}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Department Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Entitas 2: Department (Bidang / Divisi)
          </h3>
          <p className="text-xs text-slate-500">
            Daftar departemen terhubung dengan <code>organization_id = 1</code>.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-mono">
              <tr>
                <th className="py-2.5 px-3 font-semibold">department_id</th>
                <th className="py-2.5 px-3 font-semibold">
                  Nama Bidang (name)
                </th>
                <th className="py-2.5 px-3 font-semibold">
                  Deskripsi Fungsional (description)
                </th>
                <th className="py-2.5 px-3 font-semibold">
                  Email Kontak (contact_email)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {departments?.map((dept) => (
                <tr
                  key={dept.department_id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                >
                  <td className="py-2.5 px-3 font-bold text-slate-700 dark:text-slate-300">
                    #{dept.department_id}
                  </td>
                  <td className="py-2.5 px-3 font-sans font-semibold text-slate-900 dark:text-white">
                    {dept.name}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-600 dark:text-slate-300 max-w-sm">
                    {dept.description}
                  </td>
                  <td className="py-2.5 px-3 text-red-600 dark:text-red-400">
                    {dept.contact_email}
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