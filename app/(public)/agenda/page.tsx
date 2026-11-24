"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { motion, type Variants } from "framer-motion";
import { useEvents } from "../../../hooks/queries/useEvents";
import { SkeletonLoader } from "../../../components/feedback/SkeletonLoader";
import { Calendar, MapPin, Clock } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const cardGridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function EventsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: events, isLoading } = useEvents();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".gsap-events-reveal", {
        y: 26,
        opacity: 0,
        duration: 0.75,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "transform",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#FFFDF2] dark:bg-[#0B0B0C] text-zinc-900 dark:text-white transition-colors"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        <div className="gsap-events-reveal border-b border-[#E8E2CC] dark:border-zinc-800 pb-8">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold text-[#991B1B] dark:text-[#FACC15] uppercase tracking-[0.14em] mb-3">
            <Calendar className="w-4 h-4" />
            Agenda & Perkaderan
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
            Kalender Kegiatan Organisasi
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-400 mt-3 max-w-2xl leading-relaxed">
            Jadwal perkaderan resmi, sidang pleno cabang, rapat koordinasi pimpinan, dan forum dialektika intelektual.
          </p>
        </div>

        {isLoading ? (
          <SkeletonLoader count={4} />
        ) : (
          <motion.div
            variants={cardGridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {events?.map((evt) => {
              const isUpcoming = evt.status === "UPCOMING";
              const isOngoing = evt.status === "ONGOING";

              return (
                <motion.article
                  key={evt.event_id}
                  variants={cardItemVariants}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 320, damping: 24 }}
                  className="group relative flex flex-col justify-between rounded-xl bg-white dark:bg-zinc-900/90 border border-[#E8E2CC] dark:border-zinc-800 hover:border-[#991B1B]/40 dark:hover:border-[#FACC15]/40 p-6 shadow-xs hover:shadow-md transition-[border-color,box-shadow] overflow-hidden"
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${
                      isOngoing
                        ? "bg-emerald-600 dark:bg-emerald-500"
                        : isUpcoming
                        ? "bg-gradient-to-r from-[#B45309] to-[#FACC15]"
                        : "bg-gradient-to-r from-[#7F1D1D] via-[#991B1B] to-[#FACC15]"
                    }`}
                  />

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                        Event ID #{evt.event_id}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-md border ${
                          isUpcoming
                            ? "bg-[#F5EFD6] dark:bg-zinc-800 text-[#B45309] dark:text-[#FACC15] border-[#E8E2CC] dark:border-zinc-700"
                            : isOngoing
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60"
                            : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700"
                        }`}
                      >
                        {isOngoing && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-500 animate-ping" />
                        )}
                        {isUpcoming && (
                          <span className="w-2 h-2 rounded-full bg-[#B45309] dark:bg-[#FACC15]" />
                        )}
                        {isUpcoming
                          ? "Akan Datang"
                          : isOngoing
                          ? "Sedang Berlangsung"
                          : "Selesai"}
                      </span>
                    </div>

                    <h2 className="font-extrabold text-zinc-900 dark:text-white text-lg sm:text-xl leading-snug group-hover:text-[#991B1B] dark:group-hover:text-[#FACC15] transition-colors">
                      {evt.title}
                    </h2>
                    <p className="text-sm sm:text-[15px] text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E8E2CC] dark:border-zinc-800 space-y-2.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center gap-2 font-medium">
                      <Clock className="w-4 h-4 text-[#B45309] dark:text-[#FACC15] shrink-0" />
                      <span>
                        Mulai:{" "}
                        {new Date(evt.start_at).toLocaleDateString("id-ID", {
                          dateStyle: "medium",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-medium">
                      <MapPin className="w-4 h-4 text-[#991B1B] dark:text-[#FACC15] shrink-0" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}