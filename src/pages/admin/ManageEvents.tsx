import { useState } from 'react';
import { Calendar, Plus, Trash2, Edit2, X, Search } from 'lucide-react';
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from '@/hooks/queries/useEvents';
import { SkeletonLoader } from '@/components/feedback/SkeletonLoader';
import type { Event, EventStatus } from '@/types/schema.types';

export function ManageEvents() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Event | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [status, setStatus] = useState<EventStatus>('UPCOMING');

  const { data: events, isLoading } = useEvents();
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const deleteMutation = useDeleteEvent();

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setDescription('');
    setLocation('');
    setStartAt('');
    setEndAt('');
    setStatus('UPCOMING');
    setShowModal(true);
  };

  const openEditModal = (item: Event) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setLocation(item.location);
    setStartAt(item.start_at.slice(0, 10));
    setEndAt(item.end_at ? item.end_at.slice(0, 10) : '');
    setStatus(item.status);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startAt) return;

    if (editingItem) {
      await updateMutation.mutateAsync({
        id: editingItem.event_id,
        payload: {
          title,
          description,
          location,
          start_at: new Date(startAt).toISOString(),
          end_at: endAt ? new Date(endAt).toISOString() : new Date(startAt).toISOString(),
          status,
        },
      });
    } else {
      await createMutation.mutateAsync({
        payload: {
          title,
          description,
          location: location || 'Gedung Dakwah Muhammadiyah',
          start_at: new Date(startAt).toISOString(),
          end_at: endAt ? new Date(endAt).toISOString() : new Date(startAt).toISOString(),
          status,
        },
      });
    }

    setShowModal(false);
  };

  const handleDelete = (id: number, itemTitle: string) => {
    if (confirm(`Hapus agenda "${itemTitle}"? Aksi ini akan dicatat dalam AuditLog.`)) {
      deleteMutation.mutate({ id });
    }
  };

  const filtered = events?.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Kelola Tabel Event
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            CRUD penuh untuk entitas Event. Setiap perubahan terekam ke dalam <strong>AuditLog</strong>.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white text-xs shadow-md transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Jadwalkan Event Baru
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
            placeholder="Cari nama agenda atau lokasi..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-6">
            <SkeletonLoader count={3} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <tr>
                  <th className="py-3 px-4 font-semibold">ID</th>
                  <th className="py-3 px-4 font-semibold">Nama Event & Deskripsi (title)</th>
                  <th className="py-3 px-4 font-semibold">Waktu Mulai (start_at)</th>
                  <th className="py-3 px-4 font-semibold">Lokasi (location)</th>
                  <th className="py-3 px-4 font-semibold">Status (status)</th>
                  <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered?.map((item) => (
                  <tr key={item.event_id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      #{item.event_id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 max-w-sm mt-0.5">
                        {item.description}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {new Date(item.start_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {item.location}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === 'UPCOMING'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
                            : item.status === 'ONGOING'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.event_id, item.title)}
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

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                {editingItem ? 'Edit Agenda (Update)' : 'Tambah Agenda Baru (Create)'}
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
                  Judul Kegiatan (title)
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Darul Arqam Madya (DAM) 2026"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal Mulai (start_at)
                  </label>
                  <input
                    type="date"
                    required
                    value={startAt}
                    onChange={(e) => setStartAt(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Status (status)
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as EventStatus)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="UPCOMING">UPCOMING</option>
                    <option value="ONGOING">ONGOING</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Lokasi (location)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Aula Gedung PDM Kota Malang"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi Kegiatan (description)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail pelaksanaan dan target agenda..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm cursor-pointer"
                >
                  Simpan & Catat Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
