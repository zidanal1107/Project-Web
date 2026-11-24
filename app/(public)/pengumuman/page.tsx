"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Search, Bell, Calendar, ArrowRight } from "lucide-react";
import { useAnnouncements } from "../../../hooks/queries/useAnnouncements";
import { useCategories } from "../../../hooks/queries/useOrg";
import { SkeletonLoader } from "../../../components/feedback/SkeletonLoader";
import { EmptyState } from "../../../components/feedback/EmptyState";

gsap.registerPlugin(ScrollTrigger);

const cardGridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.99 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.2 },
  },
};

export default function AnnouncementsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: categories } = useCategories();
  const { data: announcements, isLoading } = useAnnouncements({
    category_id: selectedCategory,
    search: searchQuery,
    status: "PUBLISHED",
  });

  const previousDataRef = useRef(announcements);
  if (announcements !== undefined) {
    previousDataRef.current = announcements;
  }
  const displayedAnnouncements = announcements ?? previousDataRef.current;

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
      gsap.from(".gsap-ann-reveal", {
        y: 24,
        opacity: 0,
        duration: 0.7,
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
        <div className="gsap-ann-reveal border-b border-[#E8E2CC] dark:border-zinc-800 pb-8">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold text-[#991B1B] dark:text-[#FACC15] uppercase tracking-[0.14em] mb-3">
            <Bell className="w-4 h-4" />
            Kanal Informasi Resmi
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
            Warta & Pengumuman Organisasi
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-400 mt-3 max-w-2xl leading-relaxed">
            Instruksi pimpinan, surat edaran, liputan warta kegiatan, dan siaran pers resmi yang tersimpan di basis data organisasi.
          </p>
        </div>

        <div className="gsap-ann-reveal bg-white dark:bg-zinc-900/90 border border-[#E8E2CC] dark:border-zinc-800 flex flex-col sm:flex-row gap-4 justify-between items-center p-4 rounded-xl shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`relative isolate px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === "all"
                  ? "text-white"
                  : "bg-[#F5EFD6]/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-[#F5EFD6] dark:hover:bg-zinc-700"
              }`}
            >
              {selectedCategory === "all" && (
                <motion.span
                  layoutId="activeCategoryPill"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="absolute inset-0 rounded-lg bg-[#7F1D1D] shadow-xs"
                />
              )}
              <span className="relative z-10">Semua Kategori</span>
            </button>

            {categories?.map((cat) => {
              const isActive = selectedCategory === cat.category_id;
              return (
                <button
                  key={cat.category_id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.category_id)}
                  className={`relative isolate px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? "text-white"
                      : "bg-[#F5EFD6]/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-[#F5EFD6] dark:hover:bg-zinc-700"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeCategoryPill"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute inset-0 rounded-lg bg-[#7F1D1D] shadow-xs"
                    />
                  )}
                  <span className="relative z-10">{cat.name}</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pengumuman..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-[#E8E2CC] dark:border-zinc-700 bg-[#FFFDF2] dark:bg-[#0B0B0C] text-zinc-900 dark:text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#991B1B] dark:focus:ring-[#FACC15] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {isLoading && !displayedAnnouncements ? (
          <SkeletonLoader count={6} />
        ) : displayedAnnouncements && displayedAnnouncements.length > 0 ? (
          <motion.div
            variants={cardGridVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {displayedAnnouncements.map((item) => (
                <motion.article
                  key={item.announcement_id}
                  layout
                  variants={cardItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 320, damping: 24 }}
                  className="group relative flex flex-col justify-between rounded-xl bg-white dark:bg-zinc-900/90 border border-[#E8E2CC] dark:border-zinc-800 hover:border-[#991B1B]/40 dark:hover:border-[#FACC15]/40 p-6 shadow-xs hover:shadow-md transition-[border-color,box-shadow] overflow-hidden"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#7F1D1D] via-[#991B1B] to-[#FACC15] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <span className="text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-md bg-[#F5EFD6] dark:bg-zinc-800 text-[#991B1B] dark:text-[#FACC15] border border-[#E8E2CC] dark:border-zinc-700">
                        {item.category_name}
                      </span>

                      <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-500" />
                        #{item.announcement_id}
                      </span>
                    </div>

                    <h2 className="font-extrabold text-zinc-900 dark:text-white text-lg sm:text-xl leading-snug line-clamp-2 group-hover:text-[#991B1B] dark:group-hover:text-[#FACC15] transition-colors">
                      <Link href={`/pengumuman/${item.announcement_id}`}>
                        {item.title}
                      </Link>
                    </h2>

                    <p className="text-sm sm:text-[15px] text-zinc-600 dark:text-zinc-400 mt-3 line-clamp-3 leading-relaxed">
                      {item.content}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E8E2CC] dark:border-zinc-800 flex items-center justify-between text-xs sm:text-sm">
                    <span className="flex items-center gap-1.5 font-medium text-zinc-600 dark:text-zinc-400">
                      <Calendar className="w-4 h-4 text-[#B45309] dark:text-[#FACC15]" />
                      {item.published_at
                        ? new Date(item.published_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Draft"}
                    </span>

                    <Link
                      href={`/pengumuman/${item.announcement_id}`}
                      className="font-bold text-[#991B1B] dark:text-[#FACC15] flex items-center gap-1 group-hover:gap-2 transition-all"
                    >
                      Baca Lengkap
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <EmptyState
              title="Pengumuman Tidak Ditemukan"
              description="Tidak ada pengumuman yang sesuai dengan filter atau kata kunci Anda."
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}