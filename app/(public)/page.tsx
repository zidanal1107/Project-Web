"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/services/client/db.service";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { motion, type Variants } from "framer-motion";
import {
  Bell,
  Calendar,
  ArrowRight,
  ChevronRight,
  Clock,
  MapPin,
  Building2,
  ShieldCheck,
  BookOpen,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { SkeletonLoader } from "@/components/feedback/SkeletonLoader";

gsap.registerPlugin(ScrollTrigger);

const cardContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: organization } = useQuery({
    queryKey: ["organization"],
    queryFn: () => db.getOrganization(),
  });

  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: () => db.getDepartments(),
  });

  const { data: announcements = [], isLoading: isAnnLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: () => db.getAnnouncements(),
  });

  const { data: events = [], isLoading: isEventsLoading } = useQuery({
    queryKey: ["events"],
    queryFn: () => db.getEvents(),
  });

  const { data: members = [] } = useQuery({
    queryKey: ["members"],
    queryFn: () => db.getMembers(),
  });

  // 1. Lenis Smooth Scrolling + GSAP ScrollTrigger Sync
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
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

  // 2. GSAP Hero Reveal & ScrollTrigger untuk Section Headers
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(".gsap-hero-reveal", {
        y: 26,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "transform",
      });

      gsap.utils.toArray<HTMLElement>(".gsap-section-header").forEach((el) => {
        gsap.from(el, {
          y: 20,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    {
      label: "Bidang Fungsional",
      value: departments?.length ?? 5,
      icon: Building2,
      accent: "text-[#991B1B] dark:text-[#F87171]",
    },
    {
      label: "Warta & Instruksi",
      value: announcements?.length ?? 0,
      icon: Bell,
      accent: "text-[#991B1B] dark:text-[#F87171]",
    },
    {
      label: "Kader Tervalidasi",
      value: `${members?.length ?? 0}+`,
      icon: Users,
      accent: "text-[#B45309] dark:text-[#FACC15]",
    },
    {
      label: "Tata Kelola",
      value: "Teraudit",
      icon: ShieldCheck,
      accent: "text-[#15803D] dark:text-[#4ADE80]",
    },
  ];

  const featuredAnnouncement = announcements?.[0];
  const secondaryAnnouncements = announcements?.slice(1, 4) ?? [];

  return (
    <main
      ref={containerRef}
      className="min-h-screen bg-[#FFFDF2] dark:bg-[#0B0B0C] text-zinc-900 dark:text-zinc-100 transition-colors"
    >
      {/* =================================================================
      1. HERO SECTION (Video Background Full-Bleed)
      ================================================================= */}
      <section
        aria-labelledby="hero-heading"
        className="gsap-hero-section relative text-white"
      >
        <div className="relative min-h-screen w-full overflow-hidden flex items-center bg-black">
          <video
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center"
          >
            <source src="/videos/Video_Profil.mp4" type="video/mp4" />
          </video>

          {/* Overlay tipis agar teks hero tetap kontras di atas video */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-black/40"
          />

          {/* Konten Hero */}
          <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 sm:pt-36 sm:pb-28">
            <div className="gsap-hero-reveal inline-flex items-center gap-2.5 mb-6">
              <span className="h-0.5 w-8 bg-[#FACC15]" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FDE047]">
                Portal Resmi Cabang Malang
              </span>
            </div>

            <h1
              id="hero-heading"
              className="gsap-hero-reveal text-3xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.12] max-w-4xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)]"
            >
              {organization?.name || "Ikatan Mahasiswa Muhammadiyah"}
            </h1>

            <p className="gsap-hero-reveal mt-5 text-base sm:text-lg text-zinc-100 max-w-2xl leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">
              {organization?.description ||
                "Pusat informasi resmi, surat edaran pimpinan, agenda perkaderan, dan transparansi tata kelola Ikatan Mahasiswa Muhammadiyah Kota Malang."}
            </p>

            <div className="gsap-hero-reveal mt-8 flex flex-wrap items-center gap-3">
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/pengumuman"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#FACC15] hover:bg-[#EAB308] text-zinc-950 font-bold text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FACC15]"
                >
                  Warta & Instruksi
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/agenda"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-black/30 hover:bg-black/45 text-white border border-white/30 font-semibold text-sm backdrop-blur-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <Calendar
                    className="w-4 h-4 text-[#FACC15]"
                    aria-hidden="true"
                  />
                  Kalender Kegiatan
                </Link>
              </motion.div>

              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/profil"
                  className="inline-flex items-center gap-1.5 px-4 py-3 rounded-lg text-zinc-100 hover:text-white font-medium text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Profil & Struktur
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Strip Statistik Institusional tepat di bawah video */}
        <div className="relative z-10 bg-[#FFFDF2] dark:bg-[#121214] border-t border-[#E8E2CC] dark:border-zinc-800">
          <motion.div
            variants={cardContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 divide-x divide-[#E8E2CC] dark:divide-zinc-800"
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={cardItemVariants}
                  className="px-4 sm:px-6 py-5 flex items-center gap-3.5"
                >
                  <div className="p-2.5 rounded-lg bg-[#F5EFD6] dark:bg-zinc-900 shrink-0">
                    <Icon
                      className={`w-5 h-5 ${stat.accent}`}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-xl sm:text-2xl font-extrabold tabular-nums tracking-tight ${stat.accent}`}
                    >
                      {stat.value}
                    </p>
                    <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 truncate">
                      {stat.label}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* =================================================================
      2. WARTA & SURAT EDARAN (Layout Editorial Featured + List)
      ================================================================= */}
      <section
        aria-labelledby="warta-heading"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20"
      >
        <div className="gsap-section-header flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b-2 border-zinc-900 dark:border-zinc-100">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#991B1B] dark:text-[#F87171]">
              Berita & Pemberitahuan
            </p>
            <h2
              id="warta-heading"
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-1"
            >
              Warta & Surat Edaran
            </h2>
          </div>

          <Link
            href="/pengumuman"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#991B1B] dark:text-[#F87171] hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#991B1B]"
          >
            Indeks Warta
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8">
          {isAnnLoading ? (
            <SkeletonLoader count={3} />
          ) : !announcements?.length ? (
            <div className="p-8 rounded-xl border border-dashed border-[#D8D0B5] dark:border-zinc-700 bg-white/60 dark:bg-transparent text-center text-sm text-zinc-600 dark:text-zinc-400">
              Belum ada warta atau surat edaran yang dipublikasikan.
            </div>
          ) : (
            <motion.div
              variants={cardContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Kartu Utama (Featured - 7 Kolom di Desktop) */}
              {featuredAnnouncement && (
                <motion.article
                  variants={cardItemVariants}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 320, damping: 24 }}
                  className="lg:col-span-7 group flex flex-col justify-between rounded-xl border border-[#E8E2CC] dark:border-zinc-800 bg-white dark:bg-[#121214] p-6 sm:p-8 shadow-2xs hover:border-[#991B1B] dark:hover:border-[#F87171] transition-colors"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3 text-xs mb-4">
                      <span className="px-2.5 py-1 rounded font-bold uppercase tracking-wider bg-[#991B1B] text-white">
                        {featuredAnnouncement.category_name}
                      </span>
                      <time
                        dateTime={
                          featuredAnnouncement.published_at || undefined
                        }
                        className="text-zinc-600 dark:text-zinc-400 font-medium"
                      >
                        {featuredAnnouncement.published_at
                          ? new Date(
                              featuredAnnouncement.published_at
                            ).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "Draft"}
                      </time>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white leading-snug group-hover:text-[#991B1B] dark:group-hover:text-[#F87171] transition-colors">
                      <Link
                        href={`/pengumuman/${featuredAnnouncement.announcement_id}`}
                        className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#991B1B]"
                      >
                        {featuredAnnouncement.title}
                      </Link>
                    </h3>

                    <p className="mt-4 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-4">
                      {featuredAnnouncement.content}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-[#E8E2CC] dark:border-zinc-800 flex items-center justify-between gap-4 text-xs">
                    <span className="font-medium text-zinc-600 dark:text-zinc-400 truncate">
                      Oleh {featuredAnnouncement.author_name}
                    </span>
                    <Link
                      href={`/pengumuman/${featuredAnnouncement.announcement_id}`}
                      className="inline-flex items-center gap-1 font-bold text-[#991B1B] dark:text-[#F87171] shrink-0 group-hover:gap-2 transition-all"
                    >
                      Baca Selengkapnya
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </motion.article>
              )}

              {/* Daftar Warta Sekunder (5 Kolom di Desktop) */}
              <div className="lg:col-span-5 flex flex-col divide-y divide-[#E8E2CC] dark:divide-zinc-800 border-t lg:border-t-0 border-[#E8E2CC] dark:border-zinc-800">
                {secondaryAnnouncements.map((item) => (
                  <motion.article
                    key={item.announcement_id}
                    variants={cardItemVariants}
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 350, damping: 26 }}
                    className="group py-5 first:pt-5 lg:first:pt-0 last:pb-0 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs mb-2">
                      <span className="font-bold uppercase tracking-wider text-[#991B1B] dark:text-[#F87171]">
                        {item.category_name}
                      </span>
                      <time
                        dateTime={item.published_at || undefined}
                        className="text-zinc-500 dark:text-zinc-400"
                      >
                        {item.published_at
                          ? new Date(item.published_at).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "Draft"}
                      </time>
                    </div>

                    <h3 className="text-base font-bold text-zinc-900 dark:text-white leading-snug line-clamp-2 group-hover:text-[#991B1B] dark:group-hover:text-[#F87171] transition-colors">
                      <Link
                        href={`/pengumuman/${item.announcement_id}`}
                        className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#991B1B]"
                      >
                        {item.title}
                      </Link>
                    </h3>

                    <p className="mt-1.5 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {item.content}
                    </p>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* =================================================================
      3. AGENDA MENDATANG & BIDANG FUNGSIONAL (Split Section)
      ================================================================= */}
      <section
        aria-label="Agenda dan Bidang Fungsional"
        className="bg-[#FBF7E4] dark:bg-[#111113] border-t border-[#E8E2CC] dark:border-zinc-800 py-16 sm:py-20"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Kolom Kiri: Agenda Mendatang */}
          <div className="lg:col-span-6 space-y-6">
            <div className="gsap-section-header flex items-end justify-between pb-4 border-b border-[#DCD4B8] dark:border-zinc-700">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#B45309] dark:text-[#FACC15]">
                  Kalender Cabang
                </p>
                <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">
                  Agenda Mendatang
                </h2>
              </div>
              <Link
                href="/agenda"
                className="text-xs font-bold text-[#991B1B] dark:text-[#F87171] hover:underline underline-offset-4"
              >
                Semua Agenda →
              </Link>
            </div>

            {isEventsLoading ? (
              <SkeletonLoader count={3} />
            ) : !events?.length ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400 py-4">
                Belum ada agenda terdekat yang terjadwal.
              </p>
            ) : (
              <motion.div
                variants={cardContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="space-y-3"
              >
                {events.slice(0, 4).map((evt) => {
                  const dateObj = new Date(evt.start_at);
                  const day = dateObj.toLocaleDateString("id-ID", {
                    day: "2-digit",
                  });
                  const month = dateObj.toLocaleDateString("id-ID", {
                    month: "short",
                  });

                  return (
                    <motion.article
                      key={evt.event_id}
                      variants={cardItemVariants}
                      whileHover={{ y: -2 }}
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 24,
                      }}
                      className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-[#161618] border border-[#E8E2CC] dark:border-zinc-800 hover:border-[#B45309] dark:hover:border-[#FACC15] transition-colors"
                    >
                      <div className="w-14 shrink-0 rounded-lg bg-[#7F1D1D] text-white text-center py-2">
                        <span className="block text-lg font-extrabold leading-none tabular-nums">
                          {day}
                        </span>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-[#FDE047] mt-1">
                          {month}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-[#15803D] dark:text-[#4ADE80] uppercase tracking-wide mb-1">
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-current"
                            aria-hidden="true"
                          />
                          {evt.status.toLowerCase()}
                        </div>
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white leading-snug">
                          {evt.title}
                        </h3>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                          <span className="inline-flex items-center gap-1 min-w-0">
                            <MapPin
                              className="w-3.5 h-3.5 text-[#991B1B] dark:text-[#F87171] shrink-0"
                              aria-hidden="true"
                            />
                            <span className="truncate">{evt.location}</span>
                          </span>
                          <span className="inline-flex items-center gap-1 shrink-0">
                            <Clock
                              className="w-3.5 h-3.5 text-zinc-400"
                              aria-hidden="true"
                            />
                            {dateObj.toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            WIB
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* Kolom Kanan: Bidang Fungsional */}
          <div className="lg:col-span-6 space-y-6">
            <div className="gsap-section-header flex items-end justify-between pb-4 border-b border-[#DCD4B8] dark:border-zinc-700">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#991B1B] dark:text-[#F87171]">
                  Struktur Pimpinan
                </p>
                <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">
                  Bidang Fungsional
                </h2>
              </div>
              <Link
                href="/profil"
                className="text-xs font-bold text-[#991B1B] dark:text-[#F87171] hover:underline underline-offset-4"
              >
                Lihat Semua →
              </Link>
            </div>

            <motion.div
              variants={cardContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
            >
              {departments?.slice(0, 4).map((dept) => (
                <motion.div
                  key={dept.department_id}
                  variants={cardItemVariants}
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 320, damping: 24 }}
                  className="group p-4 rounded-xl bg-white dark:bg-[#161618] border border-[#E8E2CC] dark:border-zinc-800 hover:border-[#991B1B] dark:hover:border-[#F87171] transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <BookOpen
                        className="w-4 h-4 text-[#991B1B] dark:text-[#F87171]"
                        aria-hidden="true"
                      />
                      <ArrowUpRight
                        className="w-4 h-4 text-zinc-400 group-hover:text-[#991B1B] dark:group-hover:text-[#F87171] transition-colors"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                      {dept.name}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {dept.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}