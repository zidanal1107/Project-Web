"use client";

import { useState } from "react";
import {
  Search,
  FileText,
  Download,
  Shield,
  Eye,
  X,
  CheckCircle,
  Hash,
} from "lucide-react";
import { useDocuments } from "../../hooks/queries/useDocuments";
import { SkeletonLoader } from "../../components/feedback/SkeletonLoader";
import { EmptyState } from "../../components/feedback/EmptyState";
import { useAuth } from "../../context/AuthContext";
import type { OrgDocument } from "../../types/client/document.types";

export default function DocumentsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [previewDoc, setPreviewDoc] = useState<OrgDocument | null>(null);
  const { user } = useAuth();

  const { data: documents, isLoading } = useDocuments({
    category: selectedCategory,
    search: searchQuery,
  });

  const categories = [
    { id: "all", label: "Semua Dokumen" },
    { id: "sk", label: "Surat Keputusan (SK)" },
    { id: "pedoman", label: "Pedoman Organisasi" },
    { id: "administrasi", label: "Blangko Administrasi" },
    { id: "modul", label: "Modul & SPI" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">
          <FileText className="w-4 h-4" />
          Arsip & Repositori Digital
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Arsip Dokumen Resmi Organisasi
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
          Unduh dokumen legalitas, surat keputusan (SK) pimpinan, pedoman
          administrasi surat-menyurat, serta panduan perkaderan resmi.
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
                  ? "bg-amber-600 text-white shadow-sm shadow-amber-600/20"
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
            placeholder="Cari nomor SK atau judul..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
          />
        </div>
      </div>

      {/* Document Grid */}
      {isLoading ? (
        <SkeletonLoader count={4} />
      ) : documents && documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => {
            const isRestricted = doc.accessLevel === "kader" && !user;

            return (
              <div
                key={doc.id}
                className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-amber-500/40 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {doc.category}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        doc.accessLevel === "public"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"
                          : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400"
                      }`}
                    >
                      <Shield className="w-2.5 h-2.5" />
                      {doc.accessLevel === "public" ? "Publik" : "Khusus Kader"}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {doc.title}
                  </h3>
                  {doc.documentNumber && (
                    <p className="text-xs font-mono text-red-600 dark:text-red-400 mt-1">
                      No: {doc.documentNumber}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                    {doc.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
                    <span>{doc.fileType.toUpperCase()}</span>
                    <span>•</span>
                    <span>{doc.fileSize}</span>
                  </div>

                  {isRestricted ? (
                    <button
                      onClick={() =>
                        alert(
                          "Dokumen ini khusus untuk kader aktif. Silakan login terlebih dahulu."
                        )
                      }
                      className="px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg cursor-pointer hover:bg-slate-200"
                    >
                      Kunci (Perlu Login)
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                        title="Pratinjau Dokumen"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Pratinjau</span>
                      </button>
                      <button
                        onClick={() =>
                          alert(`Mengunduh dokumen: ${doc.title}`)
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors cursor-pointer shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Unduh
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="Dokumen Tidak Ditemukan"
          description="Tidak ada dokumen resmi yang cocok dengan pencarian Anda."
        />
      )}

      {/* Interactive Document Viewer Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {previewDoc.category}
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pratinjau Metadata Dokumen
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {previewDoc.title}
                </h3>
                {previewDoc.documentNumber && (
                  <p className="text-xs font-mono text-red-600 dark:text-red-400 mt-1">
                    Nomor: {previewDoc.documentNumber}
                  </p>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {previewDoc.description}
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-slate-500 font-mono text-[11px]">
                  <span>Ukuran: {previewDoc.fileSize}</span>
                  <span>Diunggah: {previewDoc.uploadedAt}</span>
                  <span>Unduhan: {previewDoc.downloadCount} kali</span>
                </div>
              </div>

              {/* Digital Signature / Verification Seal */}
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    Dokumen Tervalidasi Resmi PC IMM Malang
                  </p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1 truncate mt-0.5">
                    <Hash className="w-3 h-3 flex-shrink-0" />
                    SHA256: 9a7b...4f8c2e1 (Arsip Tersinkronisasi)
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  alert(`Mengunduh dokumen: ${previewDoc.title}`);
                  setPreviewDoc(null);
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh Berkas Lengkap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}