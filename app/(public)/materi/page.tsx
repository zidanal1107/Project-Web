"use client";

import { useState } from "react";
import { BookOpen, Search, Download, Clock, FileText } from "lucide-react";
import { useResources } from "../../../hooks/queries/useResources";
import { SkeletonLoader } from "../../../components/feedback/SkeletonLoader";
import { EmptyState } from "../../../components/feedback/EmptyState";

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: resources, isLoading } = useResources({
    category: selectedCategory,
    search: searchQuery,
  });

  const categories = [
    { id: "all", label: "Semua Materi" },
    { id: "keimman", label: "Ke-IMM-an & Profetik" },
    { id: "kemuhammadiyahan", label: "Kemuhammadiyahan" },
    { id: "ideopolitor", label: "Ideopolitor" },
    { id: "filsafat", label: "Filsafat & Epistemologi" },
    { id: "metodologi", label: "Metodologi Gerakan" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-red-700 uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" />
          Pusat Literasi & Khazanah Intelektual
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Sumber Belajar & Perkaderan
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
          Modul kurikulum kaderisasi, buku pedoman ideologis, literatur filsafat profetik, serta referensi kajian untuk seluruh kader IMM se-Malang Raya.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-red-700 text-white shadow-sm shadow-red-700/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {cat.label}
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
            placeholder="Cari judul modul atau topik..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600 dark:text-white"
          />
        </div>
      </div>

      {/* Resource Cards Grid */}
      {isLoading ? (
        <SkeletonLoader count={4} />
      ) : resources && resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:border-red-600/30 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400">
                    {item.category}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                      item.level === "dasar"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                        : item.level === "madya"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400"
                        : "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-400"
                    }`}
                  >
                    Jenjang {item.level}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-base line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-red-700 dark:text-red-400 font-medium mt-1">
                  Oleh: {item.author}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    {item.pagesCount} Halaman
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {item.readTime}
                  </span>
                  <span>{item.fileSize}</span>
                </div>

                <button
                  onClick={() => alert(`Mengunduh materi: ${item.title}`)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-red-700 dark:hover:bg-red-600 dark:hover:text-white transition-colors cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Modul Lengkap</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Materi Belum Ditemukan"
          description="Tidak ada modul atau referensi yang cocok dengan kriteria pencarian Anda."
        />
      )}
    </div>
  );
}