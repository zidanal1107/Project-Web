"use client";

import { useOrganization, useDepartments } from "../../hooks/queries/useOrg";
import { SkeletonLoader } from "../../components/feedback/SkeletonLoader";
import { Building, Mail, Award, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
  const { data: org, isLoading: isOrgLoading } = useOrganization();
  const { data: departments, isLoading: isDeptLoading } = useDepartments();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header Profile */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-red-700 uppercase tracking-wider mb-2">
          <Building className="w-4 h-4" />
          Profil Entitas Utama Organisasi
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          {org?.name}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
          {org?.description}
        </p>
        <p className="text-xs font-mono text-red-600 dark:text-red-400 mt-3 flex items-center gap-1.5">
          <Mail className="w-4 h-4" />
          Email Resmi: {org?.email}
        </p>
      </div>

      {/* Visi & Misi */}
      {isOrgLoading ? (
        <SkeletonLoader count={2} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400">
              <Award className="w-3.5 h-3.5" />
              Visi Organisasi (Vision)
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Arah & Cita-Cita Gerakan
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {org?.vision}
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Misi Organisasi (Mission)
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Strategi Pencapaian
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {org?.mission}
            </p>
          </div>
        </div>
      )}

      {/* Departments Table / Cards */}
      <section className="space-y-6">
        <div>
          <div className="text-xs font-bold text-red-700 uppercase tracking-wider">
            Struktur Internal (Department)
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Divisi & Bidang Kepengurusan
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Daftar departemen/bidang fungsional yang bertugas melaksanakan amanah organisasi.
          </p>
        </div>

        {isDeptLoading ? (
          <SkeletonLoader count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments?.map((dept) => (
              <div
                key={dept.department_id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-700 flex items-center justify-center font-bold text-xs">
                      #{dept.department_id}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      Org ID #{dept.organization_id}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3">
                    {dept.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <p className="flex items-center gap-1.5 text-slate-500 font-mono">
                    <Mail className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                    <span className="truncate">{dept.contact_email}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}