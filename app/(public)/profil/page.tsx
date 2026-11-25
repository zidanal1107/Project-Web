"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { motion, type Variants } from "framer-motion";
import { useOrganization, useDepartments } from "../../../hooks/queries/useOrg";
import { SkeletonLoader } from "../../../components/feedback/SkeletonLoader";
import { Building, Mail, Award, CheckCircle2 } from "lucide-react";

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

export default function ProfilePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: org, isLoading: isOrgLoading } = useOrganization();
  const { data: departments, isLoading: isDeptLoading } = useDepartments();

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
      gsap.from(".gsap-profile-reveal", {
        y: 26,
        opacity: 0,
        duration: 0.75,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "transform",
      });

      gsap.from(".gsap-dept-header", {
        y: 24,
        opacity: 0,
        duration: 0.75,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".gsap-dept-header",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#FFFDF2] dark:bg-[#0B0B0C] text-zinc-900 dark:text-white transition-colors"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-14">
        <div className="gsap-profile-reveal border-b border-[#E8E2CC] dark:border-zinc-800 pb-8">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold text-[#991B1B] dark:text-[#FACC15] uppercase tracking-[0.14em] mb-3">
            <Building className="w-4 h-4" />
            Profil Entitas Utama Organisasi
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
            {org?.name || "Ikatan Mahasiswa Muhammadiyah"}
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-400 mt-3 max-w-3xl leading-relaxed">
            {org?.description}
          </p>
          {org?.email && (
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 mt-5 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#F5EFD6] dark:bg-zinc-900 border border-[#E8E2CC] dark:border-zinc-800">
              <Mail className="w-4 h-4 text-[#991B1B] dark:text-[#FACC15] shrink-0" />
              <span className="font-medium">Email Resmi:</span>
              <span className="font-bold text-[#991B1B] dark:text-[#FACC15]">
                {org.email}
              </span>
            </p>
          )}
        </div>

        {isOrgLoading ? (
          <SkeletonLoader count={2} />
        ) : (
          <motion.div
            variants={cardGridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
          >
            <motion.article
              variants={cardItemVariants}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className="group relative overflow-hidden rounded-xl bg-white dark:bg-zinc-900/90 border border-[#E8E2CC] dark:border-zinc-800 hover:border-[#991B1B]/40 dark:hover:border-[#FACC15]/40 p-7 sm:p-8 shadow-xs hover:shadow-md transition-[border-color,box-shadow] space-y-4"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#7F1D1D] via-[#991B1B] to-[#FACC15]" />
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide bg-[#F5EFD6] dark:bg-zinc-800 text-[#991B1B] dark:text-[#FACC15] border border-[#E8E2CC] dark:border-zinc-700">
                <Award className="w-3.5 h-3.5" />
                Visi Organisasi (Vision)
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                Arah & Cita-Cita Gerakan
              </h2>
              <p className="text-sm sm:text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                {org?.vision}
              </p>
            </motion.article>

            <motion.article
              variants={cardItemVariants}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className="group relative overflow-hidden rounded-xl bg-white dark:bg-zinc-900/90 border border-[#E8E2CC] dark:border-zinc-800 hover:border-[#991B1B]/40 dark:hover:border-[#FACC15]/40 p-7 sm:p-8 shadow-xs hover:shadow-md transition-[border-color,box-shadow] space-y-4"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#B45309] to-[#FACC15]" />
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide bg-[#F5EFD6] dark:bg-zinc-800 text-[#B45309] dark:text-[#FACC15] border border-[#E8E2CC] dark:border-zinc-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Misi Organisasi (Mission)
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                Strategi Pencapaian
              </h2>
              <p className="text-sm sm:text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                {org?.mission}
              </p>
            </motion.article>
          </motion.div>
        )}

        <section className="space-y-8">
          <div className="gsap-dept-header border-b border-[#E8E2CC] dark:border-zinc-800 pb-5">
            <div className="text-xs font-extrabold text-[#991B1B] dark:text-[#FACC15] uppercase tracking-[0.14em]">
              Struktur Internal (Department)
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mt-2">
              Divisi & Bidang Kepengurusan
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-2 max-w-2xl">
              Daftar departemen/bidang fungsional yang bertugas melaksanakan amanah organisasi.
            </p>
          </div>

          {isDeptLoading ? (
            <SkeletonLoader count={3} />
          ) : (
            <motion.div
              variants={cardGridVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {departments?.map((dept) => (
                <motion.article
                  key={dept.department_id}
                  variants={cardItemVariants}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 320, damping: 24 }}
                  className="group relative overflow-hidden rounded-xl bg-white dark:bg-zinc-900/90 border border-[#E8E2CC] dark:border-zinc-800 hover:border-[#991B1B]/40 dark:hover:border-[#FACC15]/40 p-6 shadow-xs hover:shadow-md transition-[border-color,box-shadow] flex flex-col justify-between"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#7F1D1D] via-[#991B1B] to-[#FACC15] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <span className="px-2.5 py-1 rounded-md bg-[#F5EFD6] dark:bg-zinc-800 text-[#991B1B] dark:text-[#FACC15] border border-[#E8E2CC] dark:border-zinc-700 font-mono font-bold text-xs">
                        #{dept.department_id}
                      </span>

                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-500" />
                        Org ID #{dept.organization_id}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-zinc-900 dark:text-white text-lg leading-snug group-hover:text-[#991B1B] dark:group-hover:text-[#FACC15] transition-colors">
                      {dept.name}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2.5 line-clamp-3 leading-relaxed">
                      {dept.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E8E2CC] dark:border-zinc-800 text-xs sm:text-sm">
                    <p className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 font-medium">
                      <Mail className="w-4 h-4 text-[#B45309] dark:text-[#FACC15] shrink-0" />
                      <span className="truncate">{dept.contact_email}</span>
                    </p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}