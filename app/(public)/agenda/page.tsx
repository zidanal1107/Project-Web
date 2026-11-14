"use client";

import { useEvents } from "../../../hooks/queries/useEvents";
import { SkeletonLoader } from "../../../components/feedback/SkeletonLoader";
import { Calendar, MapPin, Clock } from "lucide-react";

export default function EventsPage() {
  const { data: events, isLoading } = useEvents();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-red-700 uppercase tracking-wider mb-2">
          <Calendar className="w-4 h-4" />
          Agenda & Perkaderan
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Kalender Kegiatan Organisasi
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
          Jadwal perkaderan resmi, sidang pleno cabang, rapat koordinasi pimpinan, dan forum dialektika intelektual.
        </p>
      </div>

      {isLoading ? (
        <SkeletonLoader count={3} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events?.map((evt) => (
            <div
              key={evt.event_id}
              className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono text-slate-400">
                    Event ID #{evt.event_id}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      evt.status === "UPCOMING"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400"
                        : evt.status === "ONGOING"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 animate-pulse"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {evt.status === "UPCOMING"
                      ? "Akan Datang"
                      : evt.status === "ONGOING"
                      ? "Sedang Berlangsung"
                      : "Selesai"}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                  {evt.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  {evt.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-500 font-mono">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-700 flex-shrink-0" />
                  <span>
                    Mulai:{" "}
                    {new Date(evt.start_at).toLocaleDateString("id-ID", {
                      dateStyle: "medium",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-700 flex-shrink-0" />
                  <span className="truncate font-sans">{evt.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}