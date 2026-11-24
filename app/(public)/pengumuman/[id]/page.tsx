"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { motion, type Variants } from "framer-motion";
import { ArrowLeft, Calendar, User, Share2, Check, Tag } from "lucide-react";
import { useAnnouncementDetail } from "@/hooks/queries/useAnnouncements";
import { SkeletonLoader } from "@/components/feedback/SkeletonLoader";
import { ErrorBanner } from "@/components/feedback/ErrorBanner";

gsap.registerPlugin(ScrollTrigger);

const contentCardVariants: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.99 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function AnnouncementDetailPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const params = useParams<{ id: string }>();
  const numId = Number(params?.id);

  const { data: announcement, isLoading, error } = useAnnouncementDetail(numId);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
    if (isLoading || !announcement) return;

    const ctx = gsap.context(() => {
      gsap.from(".gsap-detail-reveal", {
        y: 24,
        opacity: 0,
        duration: 0.75,
        stagger: 0.09,
        ease: "power3.out",
        clearProps: "transform",
      });

      gsap.to(".gsap-read-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".gsap-article-body",
          start: "top 25%",
          end: "bottom 75%",
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isLoading, announcement]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFDF2] dark:bg-[#0B0B0C] px-4 sm:px-6 py-12 sm:py-16 transition-colors">
        <div className="max-w-4xl mx-auto">
          <SkeletonLoader count={4} />
        </div>
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className="min-h-screen bg-[#FFFDF2] dark:bg-[#0B0B0C] px-4 sm:px-6 py-12 sm:py-16 transition-colors">
        <div className="max-w-4xl mx-auto space-y-5">
          <ErrorBanner message="Pengumuman tidak ditemukan di basis data." />
          <Link
            href="/pengumuman"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#991B1B] dark:text-[#FACC15] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Pengumuman
          </Link>
        </div>
      </div>
    );
  }

  const isPublished = announcement.status === "PUBLISHED";

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#FFFDF2] dark:bg-[#0B0B0C] text-zinc-900 dark:text-white transition-colors"
    >
      <div className="fixed inset-x-0 top-0 z-50 h-1 bg-transparent pointer-events-none">
        <div className="gsap-read-progress h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[#7F1D1D] via-[#991B1B] to-[#FACC15]" />
      </div>

      <article className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
        <div className="gsap-detail-reveal">
          <motion.div className="inline-block" whileHover={{ x: -4 }}>
            <Link
              href="/pengumuman"
              className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-[#991B1B] dark:hover:text-[#FACC15] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Daftar Pengumuman
            </Link>
          </motion.div>
        </div>

        <div className="space-y-5 border-b border-[#E8E2CC] dark:border-zinc-800 pb-8">
          <div className="gsap-detail-reveal flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-md bg-[#F5EFD6] dark:bg-zinc-800 text-[#991B1B] dark:text-[#FACC15] border border-[#E8E2CC] dark:border-zinc-700 inline-flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              {announcement.category_name}
            </span>

            <span className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
              <span>ID #{announcement.announcement_id}</span>
              <span>•</span>
              <span
                className={`inline-flex items-center gap-1.5 font-semibold ${
                  isPublished
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-[#B45309] dark:text-[#FACC15]"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isPublished
                      ? "bg-emerald-600 dark:bg-emerald-500"
                      : "bg-[#B45309] dark:bg-[#FACC15]"
                  }`}
                />
                {announcement.status}
              </span>
            </span>
          </div>

          <h1 className="gsap-detail-reveal text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight leading-tight text-zinc-900 dark:text-white">
            {announcement.title}
          </h1>

          <div className="gsap-detail-reveal flex flex-wrap items-center justify-between gap-4 text-sm text-zinc-600 dark:text-zinc-400 pt-1">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <span className="flex items-center gap-1.5 font-medium text-zinc-700 dark:text-zinc-300">
                <User className="w-4 h-4 text-[#991B1B] dark:text-[#FACC15]" />
                Diterbitkan oleh:{" "}
                <strong className="text-zinc-900 dark:text-white font-semibold">
                  {announcement.author_name}
                </strong>
              </span>

              <span className="hidden sm:inline text-zinc-400 dark:text-zinc-600">•</span>

              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-[#B45309] dark:text-[#FACC15]" />
                {announcement.published_at
                  ? new Date(announcement.published_at).toLocaleDateString(
                      "id-ID",
                      {
                        dateStyle: "full",
                      }
                    )
                  : "Draft"}
              </span>
            </div>

            <motion.button
              type="button"
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleCopyLink}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold border shadow-xs transition-colors cursor-pointer ${
                copied
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400"
                  : "bg-white dark:bg-zinc-900/90 border-[#E8E2CC] dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:border-[#991B1B]/50 dark:hover:border-[#FACC15]/50 hover:text-[#991B1B] dark:hover:text-[#FACC15]"
              }`}
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Share2 className="w-4 h-4 text-[#991B1B] dark:text-[#FACC15]" />
              )}
              <span>{copied ? "Tautan Tersalin" : "Bagikan"}</span>
            </motion.button>
          </div>
        </div>

        <motion.div
          variants={contentCardVariants}
          initial="hidden"
          animate="visible"
          className="gsap-article-body relative overflow-hidden bg-white dark:bg-zinc-900/90 border border-[#E8E2CC] dark:border-zinc-800 shadow-xs p-6 sm:p-10 rounded-xl text-zinc-800 dark:text-zinc-200 leading-relaxed text-base sm:text-[17px] whitespace-pre-line"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#7F1D1D] via-[#991B1B] to-[#FACC15]" />
          {announcement.content}
        </motion.div>
      </article>
    </div>
  );
}