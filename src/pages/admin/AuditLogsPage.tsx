import { useState } from 'react';
import { Search, History, Clock, Download } from 'lucide-react';
import { useAuditLogs } from '@/hooks/queries/useAudit';
import { SkeletonLoader } from '@/components/feedback/SkeletonLoader';
import { EmptyState } from '@/components/feedback/EmptyState';

export function AuditLogsPage() {
  const [filterEntity, setFilterEntity] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const { data: logs, isLoading } = useAuditLogs();

  const handleExportCSV = () => {
    if (!logs || logs.length === 0) return;
    const header = 'audit_id,created_at,action,entity_type,entity_id,admin_name,details\n';
    const rows = logs
      .map(
        (l) =>
          `"${l.audit_id}","${l.created_at}","${l.action}","${l.entity_type}","${l.entity_id}","${l.admin_name || ''}","${(l.details || '').replace(/"/g, '""')}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AuditLog_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const entityFilters = [
    { id: 'all', label: 'Semua Entitas' },
    { id: 'Announcement', label: 'Announcement' },
    { id: 'Event', label: 'Event' },
    { id: 'MemberApplication', label: 'MemberApplication' },
    { id: 'Organization', label: 'Organization' },
  ];

  const filtered = logs?.filter((item) => {
    const matchesEntity = filterEntity === 'all' || item.entity_type === filterEntity;
    const matchesSearch =
      item.action.toLowerCase().includes(search.toLowerCase()) ||
      (item.details && item.details.toLowerCase().includes(search.toLowerCase())) ||
      (item.admin_name && item.admin_name.toLowerCase().includes(search.toLowerCase())) ||
      String(item.entity_id).includes(search);
    return matchesEntity && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-700 uppercase tracking-wider mb-1">
            <History className="w-4 h-4" />
            System Accountability
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Tabel AuditLog & Histori Aktivitas
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Rekaman jejak mutasi data secara permanen. Menampilkan atribut: <code>audit_id</code>, <code>admin_id</code>, <code>action</code>, <code>entity_type</code>, <code>entity_id</code>, <code>created_at</code>, dan <code>details</code>.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Ekspor CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {entityFilters.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterEntity(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterEntity === tab.id
                  ? 'bg-red-700 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari aksi, rincian, atau admin..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600 dark:text-white"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-6">
            <SkeletonLoader count={5} />
          </div>
        ) : filtered && filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-mono">
                <tr>
                  <th className="py-3 px-4 font-semibold">audit_id</th>
                  <th className="py-3 px-4 font-semibold">created_at</th>
                  <th className="py-3 px-4 font-semibold">action</th>
                  <th className="py-3 px-4 font-semibold">entity_type (entity_id)</th>
                  <th className="py-3 px-4 font-semibold">admin_id</th>
                  <th className="py-3 px-4 font-semibold">details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {filtered.map((item) => (
                  <tr key={item.audit_id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">
                      #{item.audit_id}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{new Date(item.created_at).toLocaleString('id-ID')}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-red-700 dark:text-red-400">
                        {item.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-800 dark:text-slate-200">
                      <span className="font-semibold">{item.entity_type}</span>{' '}
                      <span className="font-mono text-slate-400">#{item.entity_id}</span>
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-600 dark:text-slate-400">
                      {item.admin_name}
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-600 dark:text-slate-300 max-w-sm">
                      {item.details || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="Tidak Ada Rekaman Audit"
            description="Belum ada aktivitas mutasi data yang terekam dengan filter ini."
          />
        )}
      </div>
    </div>
  );
}
