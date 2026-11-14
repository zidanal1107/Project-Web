"use client";

import { useState } from "react";
import { FileText, Trash2, Search, X, Upload } from "lucide-react";
import {
  useDocuments,
  useUploadDocument,
  useDeleteDocument,
} from "../../../hooks/queries/useDocuments";
import { SkeletonLoader } from "../../../components/feedback/SkeletonLoader";
import type { DocumentCategory, AccessLevel } from "../../../types/client/document.types";

export default function ManageDocuments() {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [category, setCategory] = useState<DocumentCategory>("sk");
  const [accessLevel, setAccessLevel] = useState<AccessLevel>("public");
  const [description, setDescription] = useState("");

  const { data: documents, isLoading } = useDocuments({ search });
  const uploadMutation = useUploadDocument();
  const deleteMutation = useDeleteDocument();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    await uploadMutation.mutateAsync({
      title,
      documentNumber,
      category,
      accessLevel,
      description,
      fileType: "pdf",
    });

    setTitle("");
    setDocumentNumber("");
    setDescription("");
    setShowModal(false);
  };

  const handleDelete = (id: string, docTitle: string) => {
    if (confirm(`Hapus dokumen "${docTitle}" dari arsip?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Kelola Arsip Dokumen
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Unggah dan arsipkan Surat Keputusan (SK), modul perkaderan, dan
            pedoman tata tertib.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white text-xs shadow-md transition-colors cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          Unggah Dokumen
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nomor SK atau judul dokumen..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-6">
            <SkeletonLoader count={4} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <tr>
                  <th className="py-3 px-4 font-semibold">
                    Judul & Nomor Dokumen
                  </th>
                  <th className="py-3 px-4 font-semibold">Kategori</th>
                  <th className="py-3 px-4 font-semibold">Hak Akses</th>
                  <th className="py-3 px-4 font-semibold">Ukuran</th>
                  <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {documents?.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {item.title}
                      </div>
                      {item.documentNumber && (
                        <div className="text-[11px] font-mono text-red-600 dark:text-red-400">
                          {item.documentNumber}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="uppercase font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          item.accessLevel === "public"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                        }`}
                      >
                        {item.accessLevel === "public"
                          ? "Publik"
                          : "Khusus Kader"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {item.fileSize}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                Unggah Dokumen Organisasi
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Dokumen
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: SK Pengesahan Panitia DAM 2026"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor Surat / Dokumen (Opsional)
                </label>
                <input
                  type="text"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  placeholder="089/A-1/PC-IMM/2026"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as DocumentCategory)
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="sk">Surat Keputusan (SK)</option>
                    <option value="pedoman">Pedoman Organisasi</option>
                    <option value="administrasi">Blangko Administrasi</option>
                    <option value="modul">Modul & SPI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Hak Akses
                  </label>
                  <select
                    value={accessLevel}
                    onChange={(e) =>
                      setAccessLevel(e.target.value as AccessLevel)
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="public">Terbuka / Publik</option>
                    <option value="kader">Khusus Kader Aktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Keterangan isi dan ketentuan dokumen..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Mock file picker */}
              <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center bg-slate-50 dark:bg-slate-800/40">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Pilih Berkas PDF / DOCX (Maks 10 MB)
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Mode simulasi otomatis mengunggah
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={uploadMutation.isPending}
                  className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  {uploadMutation.isPending
                    ? "Mengunggah..."
                    : "Simpan ke Arsip"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}