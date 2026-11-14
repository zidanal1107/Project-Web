"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Bell, Calendar, ArrowRight } from "lucide-react";
import { useAnnouncements } from "../../hooks/queries/useAnnouncements";
import { useCategories } from "../../hooks/queries/useOrg";
import { SkeletonLoader } from "../../components/feedback/SkeletonLoader";
import { EmptyState } from "../../components/feedback/EmptyState";

export default function AnnouncementsPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: categories } = useCategories();
  const { data: announcements, isLoading } = useAnnouncements({
    category_id: selectedCategory,
    search: searchQuery,
    status: "PUBLISHED",
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-red-700 uppercase tracking-wider mb-2">
          <Bell className="w-4 h-4" />
          Kanal Informasi Resmi
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Warta & Pengumuman Organisasi
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
          Instruksi pimpinan, surat edaran, liputan warta kegiatan, dan siaran pers resmi yang tersimpan di basis data organisasi.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === "all"
                ? "bg-red-700 text-white shadow-sm shadow-red-700/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Semua Kategori
          </button>
          {categories?.map((cat) => (
            <button
              key={cat.category_id}
              onClick={() => setSelectedCategory(cat.category_id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.category_id
                  ? "bg-red-700 text-white shadow-sm shadow-red-700/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pengumuman..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600 dark:text-white"
          />
        </div>
      </div>

      {/* Announcements List */}
      {isLoading ? (
        <SkeletonLoader count={4} />
      ) : announcements && announcements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((item) => (
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
                    ID #{item.announcement_id}
                  </span>
                </div>
                <h2 className="font-bold text-slate-900 dark:text-white text-lg line-clamp-2 hover:text-red-700 transition-colors">
                  <Link href={`/pengumuman/${item.announcement_id}`}>
                    {item.title}
                  </Link>
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-3">
                  {item.content}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.published_at
                    ? new Date(item.published_at).toLocaleDateString("id-ID")
                    : "Draft"}
                </span>
                <Link
                  href={`/pengumuman/${item.announcement_id}`}
                  className="font-semibold text-red-700 hover:underline flex items-center gap-0.5"
                >
                  Baca Lengkap
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Pengumuman Tidak Ditemukan"
          description="Tidak ada pengumuman yang sesuai dengan filter atau kata kunci Anda."
        />
      )}
    </div>
  );
}