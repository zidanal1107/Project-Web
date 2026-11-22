"use client";

import Link from "next/link";
import {
  Bell,
  Calendar,
  ArrowRight,
  ChevronRight,
  Clock,
  MapPin,
  Building,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useAnnouncements } from "@/hooks/queries/useAnnouncements";
import { useEvents } from "@/hooks/queries/useEvents";
import { useOrganization, useDepartments } from "@/hooks/queries/useOrg";
import { useMembers } from "@/hooks/queries/useMembership";
import { SkeletonLoader } from "@/components/feedback/SkeletonLoader";

export default function HomePage() {
  const { data: org } = useOrganization();
  const { data: departments } = useDepartments();
  const { data: announcements, isLoading: isAnnLoading } = useAnnouncements({
    status: "PUBLISHED",
  });
  const { data: events, isLoading: isEventsLoading } = useEvents();
  const { data: members } = useMembers();

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section with Red-Yellow Ambient Lighting */}
      <section className="relative overflow-hidden border-b border-black/[0.06] dark:border-white/[0.06] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-5xl mx-auto relative z-10">
          
          {/* Subtle Red-Yellow Pill Tag */}
          <div className="flex items-center gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-amber-300 border border-red-500/20 font-mono shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Sistem Informasi & Akuntabilitas Organisasi
            </span>
          </div>

          {/* Heading with Red-Yellow Gradient Text */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
            <span className="text-gradient-imm">
              {org?.name || "Pusat Informasi Organisasi"}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            {org?.description ||
              "Portal informasi resmi, instruksi pimpinan, dan transparansi tata kelola Ikatan Mahasiswa Muhammadiyah Cabang Malang."}
          </p>

          {/* Action Links */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/pengumuman"
              className="px-5 py-2.5 rounded-xl font-semibold bg-gradient-imm text-white shadow-md shadow-red-500/20 hover:opacity-95 active:scale-95 transition-all flex items-center gap-2 text-xs"
            >
              Lihat Warta & Instruksi
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/agenda"
              className="portal-card px-5 py-2.5 rounded-xl font-medium text-zinc-800 dark:text-zinc-200 flex items-center gap-2 text-xs"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              Kalender Kegiatan
            </Link>
            <Link
              href="/profil"
              className="px-5 py-2.5 rounded-xl font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all flex items-center gap-2 text-xs"
            >
              <Building className="w-3.5 h-3.5" />
              Struktur Organisasi
            </Link>
          </div>

          {/* Stat Bento Strip with Modern Soft Glow */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-black/[0.06] dark:border-white/[0.06]">
            <div className="portal-card p-4 rounded-xl">
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                {departments?.length || 5}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Bidang / Departemen</p>
            </div>
            <div className="portal-card p-4 rounded-xl">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {members?.length || 0}+
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Kader Tervalidasi</p>
            </div>
            <div className="portal-card p-4 rounded-xl">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {announcements?.length || 0}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Warta & Instruksi</p>
            </div>
            <div className="portal-card p-4 rounded-xl">
              <p className="text-2xl font-bold text-gradient-imm flex items-center gap-1.5">
                <ShieldCheck className="w-5 h-5 text-red-600" />
                Audit
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Jejak Rekam Akuntabel</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section: Warta & Pengumuman */}
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-black/[0.06] dark:border-white/[0.06] pb-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-amber-400 uppercase tracking-wider font-mono">
                <Bell className="w-3.5 h-3.5" />
                Pemberitahuan
              </div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-1">
                Warta & Surat Edaran
              </h2>
            </div>
            <Link
              href="/pengumuman"
              className="text-xs font-semibold text-red-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              Semua Warta
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isAnnLoading ? (
            <SkeletonLoader count={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {announcements?.slice(0, 3).map((item) => (
                <article
                  key={item.announcement_id}
                  className="portal-card flex flex-col justify-between rounded-2xl p-5"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-red-500/10 text-red-700 dark:text-amber-400">
                        {item.category_name}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        {item.published_at
                          ? new Date(item.published_at).toLocaleDateString("id-ID", {
                              month: "short",
                              day: "numeric",
                            })
                          : "Draft"}
                      </span>
                    </div>

                    <h3 className="font-bold text-zinc-900 dark:text-white text-base line-clamp-2 hover:text-red-600 dark:hover:text-amber-400 transition-colors">
                      <Link href={`/pengumuman/${item.announcement_id}`}>
                        {item.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                      {item.content}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-black/[0.04] dark:border-white/[0.04] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {item.author_name}
                    </span>
                    <Link
                      href={`/pengumuman/${item.announcement_id}`}
                      className="font-medium text-red-600 dark:text-amber-400 hover:underline flex items-center gap-0.5 text-xs"
                    >
                      Baca
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Section: 2 Columns - Departments & Events */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Departemen */}
          <section className="portal-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.04] dark:border-white/[0.05]">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-red-600" />
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                  Bidang Fungsional
                </h3>
              </div>
              <Link
                href="/profil"
                className="text-xs text-zinc-500 hover:text-red-600 dark:hover:text-amber-400 transition-colors"
              >
                Lihat Semua →
              </Link>
            </div>

            <div className="space-y-2.5">
              {departments?.slice(0, 4).map((dept) => (
                <div
                  key={dept.department_id}
                  className="p-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] hover:bg-red-500/[0.04] transition-colors"
                >
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {dept.name}
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1">
                    {dept.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Agenda Kegiatan */}
          <section className="portal-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.04] dark:border-white/[0.05]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                  Agenda Mendatang
                </h3>
              </div>
              <Link
                href="/agenda"
                className="text-xs text-zinc-500 hover:text-red-600 dark:hover:text-amber-400 transition-colors"
              >
                Kalender →
              </Link>
            </div>

            {isEventsLoading ? (
              <SkeletonLoader count={2} />
            ) : (
              <div className="space-y-2.5">
                {events?.slice(0, 3).map((evt) => (
                  <div
                    key={evt.event_id}
                    className="p-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] hover:bg-red-500/[0.04] transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono mb-1">
                      <span className="text-red-600 font-medium capitalize">
                        {evt.status.toLowerCase()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500" />
                        {new Date(evt.start_at).toLocaleDateString("id-ID", {
                          dateStyle: "medium",
                        })}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                      {evt.title}
                    </h4>
                    <p className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-zinc-400" />
                      <span className="truncate">{evt.location}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>

      </div>
    </div>
  );
}
