import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Share2, Check, Tag } from 'lucide-react';
import { useState } from 'react';
import { useAnnouncementDetail } from '@/hooks/queries/useAnnouncements';
import { SkeletonLoader } from '@/components/feedback/SkeletonLoader';
import { ErrorBanner } from '@/components/feedback/ErrorBanner';

export function AnnouncementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const numId = Number(id);
  const { data: announcement, isLoading, error } = useAnnouncementDetail(numId);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <SkeletonLoader count={4} />
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <ErrorBanner message="Pengumuman tidak ditemukan di basis data." />
        <Link
          to="/pengumuman"
          className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-red-700 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Pengumuman
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Back Button */}
      <Link
        to="/pengumuman"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-red-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Daftar Pengumuman
      </Link>

      {/* Header Info */}
      <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase px-3 py-1 rounded-md bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {announcement.category_name}
          </span>
          <span className="text-xs font-mono text-slate-400">
            ID #{announcement.announcement_id} • Status: {announcement.status}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
          {announcement.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 pt-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <User className="w-4 h-4 text-red-700" />
              Diterbitkan oleh: <strong>{announcement.author_name}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-mono">
              <Calendar className="w-4 h-4" />
              {announcement.published_at
                ? new Date(announcement.published_at).toLocaleDateString('id-ID', { dateStyle: 'full' })
                : 'Draft'}
            </span>
          </div>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin' : 'Bagikan'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="text-slate-800 dark:text-slate-200 leading-relaxed text-base whitespace-pre-line bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {announcement.content}
      </div>
    </article>
  );
}
