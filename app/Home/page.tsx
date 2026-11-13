"use client"
import Link from "next/link";
import {
  Bell,
  Calendar,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Clock,
  MapPin,
  Building,
  UserPlus,
  ShieldCheck,
} from 'lucide-react';
import { useAnnouncements } from '../../hooks/queries/useAnnouncements';
import { useEvents } from '../../hooks/queries/useEvents';
import { useOrganization, useDepartments } from '../../hooks/queries/useOrg';
import { useMembers } from '../../hooks/queries/useMembership';
import { SkeletonLoader } from '../../components/feedback/SkeletonLoader';

export function HomePage() {
  const { data: org } = useOrganization();
  const { data: departments } = useDepartments();
  const { data: announcements, isLoading: isAnnLoading } = useAnnouncements({ status: 'PUBLISHED' });
  const { data: events, isLoading: isEventsLoading } = useEvents();
  const { data: members } = useMembers();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-red-950 via-slate-900 to-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-red-900/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-red-600/15 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-800/80 text-red-200 border border-red-700/60 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Sistem Informasi Terpadu & Audit Akuntabilitas
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-3xl leading-[1.15]">
            {org?.name || 'Pusat Informasi Organisasi'}
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            {org?.description ||
              'Platform resmi informasi organisasi, rekrutmen kader, dan transparansi tata kelola ikatan.'}
          </p>

          {/* Quick CTA */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/pengumuman"
              className="px-6 py-3 rounded-xl font-semibold bg-red-700 hover:bg-red-800 active:scale-95 transition-all text-white shadow-lg shadow-red-700/30 flex items-center gap-2 text-sm"
            >
              Lihat Warta & Instruksi
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/daftar"
              className="px-6 py-3 rounded-xl font-semibold bg-amber-600 hover:bg-amber-700 text-white active:scale-95 transition-all flex items-center gap-2 text-sm shadow-md shadow-amber-600/20"
            >
              <UserPlus className="w-4 h-4" />
              Pendaftaran Anggota Baru
            </Link>
            <Link
              to="/profil"
              className="px-6 py-3 rounded-xl font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 active:scale-95 transition-all flex items-center gap-2 text-sm"
            >
              <Building className="w-4 h-4 text-amber-400" />
              Profil & Struktur Bidang
            </Link>
          </div>

          {/* Stat Pill Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-800/80">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-2xl sm:text-3xl font-extrabold text-white">
                {departments?.length || 5}
              </p>
              <p className="text-xs text-slate-400 mt-1">Bidang / Departemen</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                {members?.length || 0}+
              </p>
              <p className="text-xs text-slate-400 mt-1">Kader Tervalidasi (NIA)</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-2xl sm:text-3xl font-extrabold text-red-400">
                {announcements?.length || 0}
              </p>
              <p className="text-xs text-slate-400 mt-1">Warta & Instruksi Aktif</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                Audit Log
              </p>
              <p className="text-xs text-slate-400 mt-1">Histori Perubahan Terekam</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section: Latest Announcements */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-red-700 uppercase tracking-wider">
                <Bell className="w-3.5 h-3.5" />
                Pemberitahuan Terkini
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                Warta & Pengumuman Organisasi
              </h2>
            </div>
            <Link
              to="/pengumuman"
              className="text-sm font-semibold text-red-700 hover:text-red-800 flex items-center gap-1 group"
            >
              Semua Warta
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {isAnnLoading ? (
            <SkeletonLoader count={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements?.slice(0, 3).map((item) => (
                <article
                  key={item.announcement_id}
                  className="flex flex-col justify-between bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-xl hover:border-red-600/30 transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-semibold uppercase px-2.5 py-1 rounded-md bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900">
                        {item.category_name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Oleh: {item.author_name}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg line-clamp-2 hover:text-red-700 transition-colors">
                      <Link to={`/pengumuman/${item.announcement_id}`}>{item.title}</Link>
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-3">
                      {item.content}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {item.published_at
                        ? new Date(item.published_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })
                        : 'Draft'}
                    </span>
                    <Link
                      to={`/pengumuman/${item.announcement_id}`}
                      className="font-semibold text-red-700 hover:underline flex items-center gap-0.5"
                    >
                      Baca Lengkap
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Section: Departments & Events Two-Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Departments List (6 Cols) */}
          <section className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
                  <Building className="w-3.5 h-3.5" />
                  Divisi & Bidang
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  Struktur Departemen
                </h2>
              </div>
              <Link to="/profil" className="text-xs font-semibold text-red-700 hover:underline">
                Lihat Profil Lengkap
              </Link>
            </div>

            <div className="space-y-3">
              {departments?.slice(0, 4).map((dept) => (
                <div
                  key={dept.department_id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {dept.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {dept.description}
                  </p>
                  <p className="text-[11px] text-red-600 dark:text-red-400 font-mono mt-2">
                    Kontak: {dept.contact_email}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming Events (6 Cols) */}
          <section className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-red-700 uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5" />
                  Agenda Kegiatan
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  Kalender Aktivitas
                </h2>
              </div>
              <Link to="/agenda" className="text-xs font-semibold text-red-700 hover:underline">
                Buka Kalender
              </Link>
            </div>

            {isEventsLoading ? (
              <SkeletonLoader count={3} />
            ) : (
              <div className="space-y-4">
                {events?.slice(0, 3).map((evt) => (
                  <div
                    key={evt.event_id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 relative pl-4 border-l-4 border-l-red-700"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-semibold text-red-700 capitalize">
                        {evt.status.toLowerCase()}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(evt.start_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {evt.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
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
