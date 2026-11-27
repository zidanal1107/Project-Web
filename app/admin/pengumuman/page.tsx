"use client";

import { useState } from "react";
import {
  Bell,
  Plus,
  Trash2,
  Edit2,
  X,
  Search,
  CheckCircle,
} from "lucide-react";
import {
  useAnnouncements,
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
} from "../../../hooks/queries/useAnnouncements";
import { useCategories } from "../../../hooks/queries/useOrg";
import { SkeletonLoader } from "../../../components/feedback/SkeletonLoader";
import type { Announcement, AnnouncementStatus } from "../../../types/client/schema.types";

export default function ManageAnnouncements() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<number>(1);
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<AnnouncementStatus>("PUBLISHED");

  const { data: categories } = useCategories();
  const { data: announcements, isLoading } = useAnnouncements({ search });

  const createMutation = useCreateAnnouncement();
  const updateMutation = useUpdateAnnouncement();
  const deleteMutation = useDeleteAnnouncement();

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle("");
    setCategoryId(categories?.[0]?.category_id || 1);
    setContent("");
    setStatus("PUBLISHED");
    setShowModal(true);
  };

  const openEditModal = (item: Announcement) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategoryId(item.category_id);
    setContent(item.content);
    setStatus(item.status);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    if (editingItem) {
      await updateMutation.mutateAsync({
        id: editingItem.announcement_id,
        payload: {
          title,
          category_id: Number(categoryId),
          content,
          status,
        },
      });
    } else {
      await createMutation.mutateAsync({
        payload: {
          title,
          category_id: Number(categoryId),
          content,
          status,
        },
      });
    }

    setShowModal(false);
  };

  const handleDelete = (id: number, itemTitle: string) => {
    if (
      confirm(
        `Hapus pengumuman "${itemTitle}"? Aksi ini akan dicatat dalam AuditLog.`
      )
    ) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Kelola Tabel Announcement
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            CRUD penuh untuk entitas Announcement. Setiap create, update, dan
            delete otomatis dicatat di <strong>AuditLog</strong>.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold bg-red-700 hover:bg-red-800 text-white text-xs shadow-md transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Tambah Pengumuman
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul pengumuman..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600 dark:text-white"
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
                  <th className="py-3 px-4 font-semibold">ID</th>
                  <th className="py-3 px-4 font-semibold">
                    Judul & Isi (title, content)
                  </th>
                  <th className="py-3 px-4 font-semibold">
                    Kategori (category_id)
                  </th>
                  <th className="py-3 px-4 font-semibold">Status (status)</th>
                  <th className="py-3 px-4 font-semibold">
                    Tanggal (created_at)
                  </th>
                  <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {announcements?.map((item) => (
                  <tr
                    key={item.announcement_id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      #{item.announcement_id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 max-w-md mt-0.5">
                        {item.content}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400">
                        {item.category_name}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === "PUBLISHED"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {new Date(item.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(item.announcement_id, item.title)
                          }
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog for Create / Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-red-700" />
                {editingItem
                  ? "Edit Pengumuman (Update)"
                  : "Terbitkan Pengumuman Baru (Create)"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Judul (title)
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Instruksi Pengawalan Sidang Pleno"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori (category_id)
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    {categories?.map((c) => (
                      <option key={c.category_id} value={c.category_id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Status (status)
                  </label>
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as AnnouncementStatus)
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Isi Konten (content)
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan isi instruksi atau pengumuman..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-xl text-[11px] text-red-700 dark:text-red-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>
                  Aksi ini akan mencatat log ke tabel AuditLog dengan admin_id
                  saat ini.
                </span>
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
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 text-xs font-bold bg-red-700 hover:bg-red-800 text-white rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Menyimpan..."
                    : "Simpan & Catat Audit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}