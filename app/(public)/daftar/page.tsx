"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import Lenis from "lenis";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  UserPlus,
  CheckCircle,
  Mail,
  Phone,
  User,
  ArrowRight,
  Sparkles,
  Edit3,
  ClipboardCheck,
  AlertCircle,
} from "lucide-react";
import { useSubmitApplication } from "../../../hooks/queries/useMembership";

const STORAGE_KEY = "imm_kmd_registration_draft";

interface SavedRegistrationData {
  applicationId?: string;
  fullName: string;
  email: string;
  phone: string;
}

const formCardVariants: Variants = {
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

const stateSwitchVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -14,
    scale: 0.98,
    transition: { duration: 0.25 },
  },
};

export default function MemberRegisterPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [applicationId, setApplicationId] = useState<string | undefined>(
    undefined
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submitMutation = useSubmitApplication();

  // Pulihkan data pendaftaran jika pengguna kembali untuk mengedit
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SavedRegistrationData;
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.applicationId) setApplicationId(parsed.applicationId);
      }
    } catch {
      // Abaikan jika storage tidak tersedia
    }
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

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
      gsap.from(".gsap-reg-reveal", {
        y: 24,
        opacity: 0,
        duration: 0.75,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "transform",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !email.trim() || !phone.trim()) return;

    try {
      const response = await submitMutation.mutateAsync({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });

      const returnedId =
        typeof response === "object" &&
        response !== null &&
        "application_id" in response
          ? String((response as { application_id?: unknown }).application_id)
          : applicationId;

      if (returnedId) {
        setApplicationId(returnedId);
      }

      const payloadToSave: SavedRegistrationData = {
        applicationId: returnedId,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
      };

      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payloadToSave));
      } catch {
        // Abaikan jika storage penuh/diblokir
      }

      setIsEditing(false);
      setIsSuccess(true);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengirim data pendaftaran. Silakan coba lagi."
      );
    }
  };

  const handleEditRegistration = () => {
    setErrorMessage(null);
    setIsEditing(true);
    setIsSuccess(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#FFFDF2] dark:bg-[#0B0B0C] text-zinc-900 dark:text-white transition-colors flex items-center"
    >
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div
          variants={formCardVariants}
          initial="hidden"
          animate="visible"
          className="relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900/90 border border-[#E8E2CC] dark:border-zinc-800 shadow-xs p-6 sm:p-10"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#7F1D1D] via-[#991B1B] to-[#FACC15]" />

          <div className="gsap-reg-reveal flex items-start sm:items-center gap-4 mb-8 pb-6 border-b border-[#E8E2CC] dark:border-zinc-800">
            <div className="w-12 h-12 rounded-xl bg-[#7F1D1D] text-[#FACC15] flex items-center justify-center shadow-xs shrink-0">
              <UserPlus className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#991B1B] dark:text-[#FACC15] uppercase tracking-[0.14em] mb-1">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                Rekrutmen & Perkaderan
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                {isEditing
                  ? "Edit Data Pendaftaran Kader"
                  : "Formulir Pendaftaran Kader Baru"}
              </h1>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success-state"
                variants={stateSwitchVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-center py-6 space-y-4"
              >
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 320, damping: 20 }}
                  className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 mx-auto flex items-center justify-center"
                >
                  <CheckCircle className="w-8 h-8" aria-hidden="true" />
                </motion.div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white">
                  Pendaftaran Berhasil Dikirim!
                </h2>

                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                  Data pendaftaran atas nama{" "}
                  <strong className="text-zinc-900 dark:text-white">
                    {fullName}
                  </strong>{" "}
                  telah masuk ke basis data dengan status{" "}
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#F5EFD6] dark:bg-zinc-800 text-[#B45309] dark:text-[#FACC15] border border-[#E8E2CC] dark:border-zinc-700 font-mono font-bold text-xs">
                    PENDING
                  </span>{" "}
                  dan aksi telah tercatat di{" "}
                  <strong className="text-zinc-900 dark:text-white">
                    AuditLog
                  </strong>
                  .
                </p>

                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                  Silakan lanjutkan ke tahap Screening atau periksa kembali data pendaftaran Anda.
                </p>

                <div className="pt-5 flex flex-wrap justify-center gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleEditRegistration}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-lg bg-[#F5EFD6] dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-[#E8E2CC] dark:border-zinc-700 hover:border-[#991B1B]/40 dark:hover:border-[#FACC15]/40 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" aria-hidden="true" />
                    Edit Pendaftaran
                  </motion.button>

                  <motion.div
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Link
                      href="/screening"
                      className="px-5 py-2.5 text-xs sm:text-sm font-bold bg-[#7F1D1D] hover:bg-[#991B1B] text-white rounded-lg shadow-xs transition-colors inline-flex items-center gap-2"
                    >
                      <ClipboardCheck
                        className="w-4 h-4 text-[#FACC15]"
                        aria-hidden="true"
                      />
                      Screening
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form-state"
                variants={stateSwitchVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {errorMessage && (
                  <div
                    role="alert"
                    className="flex items-center gap-2.5 p-3.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs sm:text-sm text-red-700 dark:text-red-300 font-medium"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="reg-full-name"
                    className="block text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2"
                  >
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User
                      className="w-4 h-4 text-[#991B1B] dark:text-[#FACC15] absolute left-3.5 top-1/2 -translate-y-1/2"
                      aria-hidden="true"
                    />
                    <input
                      id="reg-full-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Contoh: Muhammad Ilham Pratama"
                      className="w-full pl-10 pr-4 py-3 text-sm rounded-lg border border-[#E8E2CC] dark:border-zinc-700 bg-[#FFFDF2] dark:bg-[#0B0B0C] text-zinc-900 dark:text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#991B1B] dark:focus:ring-[#FACC15] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="reg-email"
                    className="block text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2"
                  >
                    Alamat Email Aktif
                  </label>
                  <div className="relative">
                    <Mail
                      className="w-4 h-4 text-[#B45309] dark:text-[#FACC15] absolute left-3.5 top-1/2 -translate-y-1/2"
                      aria-hidden="true"
                    />
                    <input
                      id="reg-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ilham@webmail.umm.ac.id"
                      className="w-full pl-10 pr-4 py-3 text-sm rounded-lg border border-[#E8E2CC] dark:border-zinc-700 bg-[#FFFDF2] dark:bg-[#0B0B0C] text-zinc-900 dark:text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#991B1B] dark:focus:ring-[#FACC15] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="reg-phone"
                    className="block text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2"
                  >
                    Nomor WhatsApp / Telepon
                  </label>
                  <div className="relative">
                    <Phone
                      className="w-4 h-4 text-emerald-700 dark:text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                      aria-hidden="true"
                    />
                    <input
                      id="reg-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="081234567890"
                      className="w-full pl-10 pr-4 py-3 text-sm rounded-lg border border-[#E8E2CC] dark:border-zinc-700 bg-[#FFFDF2] dark:bg-[#0B0B0C] text-zinc-900 dark:text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#991B1B] dark:focus:ring-[#FACC15] focus:border-transparent transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <motion.button
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="w-full py-3.5 px-4 rounded-lg font-bold bg-[#7F1D1D] hover:bg-[#991B1B] disabled:opacity-60 text-white shadow-xs transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    {submitMutation.isPending
                      ? "Menyimpan Data..."
                      : isEditing
                      ? "Simpan Perubahan Pendaftaran"
                      : "Kirim Pendaftaran Anggota"}
                    {!submitMutation.isPending && (
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    )}
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}