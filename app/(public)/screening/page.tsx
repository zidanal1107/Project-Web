"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Send,
  Home,
} from "lucide-react";

const STORAGE_KEY = "imm_kmd_registration_draft";

export interface QuestionOption {
  id: string;
  label: string;
  text: string;
}

export interface ScreeningQuestion {
  id: string;
  category: string;
  question: string;
  options: QuestionOption[];
}

interface ParticipantInfo {
  fullName: string;
  email: string;
  phone: string;
}

type ScreeningStep = "intro" | "quiz" | "completed";

const SCREENING_QUESTIONS: ScreeningQuestion[] = [
  {
    id: "q-1",
    category: "Kemuhammadiyahan & Sejarah IMM",
    question:
      "Kapan Ikatan Mahasiswa Muhammadiyah (IMM) resmi didirikan di Yogyakarta?",
    options: [
      { id: "a", label: "A", text: "18 November 1912 M / 8 Dzulhijjah 1330 H" },
      { id: "b", label: "B", text: "14 Maret 1964 M / 29 Syawal 1384 H" },
      { id: "c", label: "C", text: "16 Mei 1931 M / 28 Dzulhijjah 1349 H" },
      { id: "d", label: "D", text: "2 Mei 1954 M / 28 Sya'ban 1373 H" },
    ],
  },
  {
    id: "q-2",
    category: "Ideologi & Trilogi IMM",
    question:
      "Berikut ini yang merupakan tiga komponen utama dalam Trilogi Ikatan Mahasiswa Muhammadiyah adalah...",
    options: [
      {
        id: "a",
        label: "A",
        text: "Keagamaan, Kemahasiswaan, dan Kemasyarakatan",
      },
      {
        id: "b",
        label: "B",
        text: "Keislaman, Keindonesiaan, dan Kemanusiaan",
      },
      {
        id: "c",
        label: "C",
        text: "Intelektualitas, Spiritualitas, dan Humanitas",
      },
      {
        id: "d",
        label: "D",
        text: "Kaderisasi, Organisasi, dan Advokasi",
      },
    ],
  },
  {
    id: "q-3",
    category: "Nilai Dasar Ikatan",
    question:
      "Semboyan utama Ikatan Mahasiswa Muhammadiyah yang tercantum dalam lambang ikatan adalah...",
    options: [
      { id: "a", label: "A", text: "Fastabiqul Khairat" },
      { id: "b", label: "B", text: "Nuun Walqalami Wamaa Yasthuruun" },
      {id: "c", label: "C", text: "Anggun dalam Moral, Unggul dalam Intelektual",},
      { id: "d", label: "D", text: "Berilmu, Beramal, Bertaqwa" },
    ],
  },
  {
    id: "q-4",
    category: "Administrasi & Tata Kelola",
    question:
      "Dalam struktur pimpinan IMM di tingkat kabupaten/kota (seperti PC IMM Kota Malang), permusyawaratan tertinggi di tingkat cabang adalah...",
    options: [
      { id: "a", label: "A", text: "Muktamar" },
      { id: "b", label: "B", text: "Musyawarah Daerah (Musyda)" },
      { id: "c", label: "C", text: "Musyawarah Cabang (Musycab)" },
      { id: "d", label: "D", text: "Musyawarah Komisariat (Musykom)" },
    ],
  },
  {
    id: "q-5",
    category: "Keislaman & Gerakan Tajdid",
    question:
      "Makna 'Tajdid' dalam gerakan Muhammadiyah dan IMM mencakup dua dimensi utama, yaitu...",
    options: [
      { id: "a", label: "A", text: "Politisasi dan birokratisasi" },
      {id: "b",label: "B",text: "Purifikasi (pemurnian akidah-ibadah) dan Dinamisasi (pembaruan muamalah)",},
      { id: "c", label: "C", text: "Sentralisasi dan eksklusivisme gerakan" },
      { id: "d", label: "D", text: "Konservatisme dan tradisionalisme" },
    ],
  },
  {
  id: "q-6",
  category: "hidden gems",
  question: "Siapakah Tio Itu",
  image: "/images/tio.jpeg",
  imageAlt: "Foto Tio",
  options: [
    { id: "a", label: "A", text: "Manusia dari pasuaruan" },
    { id: "b", label: "B", text: "Manusia Tertampan di indonesia" },
    { id: "c", label: "C", text: "Presiden ke 8" },
    { id: "d", label: "D", text: "Pria berkarisma" },
  ],
},
];
export interface ScreeningQuestion {
  id: string;
  category: string;
  question: string;
  image?: string;
  imageAlt?: string;
  options: QuestionOption[];
}
export default function ScreeningPage() {
  const [step, setStep] = useState<ScreeningStep>("intro");
  const [participant, setParticipant] = useState<ParticipantInfo>({
    fullName: "",
    email: "",
    phone: "",
  });
  const [formError, setFormError] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitWarning, setSubmitWarning] = useState<string>("");

  // Otomatis ambil identitas dari pendaftaran terakhir jika ada
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<ParticipantInfo>;
        if (parsed.fullName && parsed.email) {
          setParticipant({
            fullName: parsed.fullName,
            email: parsed.email,
            phone: parsed.phone ?? "",
          });
          setStep("quiz");
        }
      }
    } catch {
      // Abaikan jika sessionStorage tidak tersedia
    }
  }, []);

  const totalQuestions = SCREENING_QUESTIONS.length;
  const currentQuestion = SCREENING_QUESTIONS[currentIndex];
  const answeredCount = Object.keys(answers).length;

  const handleStartScreening = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!participant.fullName.trim() || !participant.email.trim()) {
      setFormError(
        "Harap lengkapi Nama Lengkap dan Alamat Email terlebih dahulu."
      );
      return;
    }
    setFormError("");
    setStep("quiz");
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    setSubmitWarning("");
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleFinishQuiz = () => {
    if (answeredCount < totalQuestions) {
      const unanswered = totalQuestions - answeredCount;
      setSubmitWarning(
        `Masih ada ${unanswered} soal yang belum dijawab. Pastikan seluruh soal terisi sebelum mengirim.`
      );
      return;
    }

    setSubmitWarning("");
    setStep("completed");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="relative min-h-screen bg-[#FFFDF2] dark:bg-[#0B0B0C] text-zinc-900 dark:text-zinc-100 py-10 sm:py-14 transition-colors">
      {/* Aksen garis identitas di puncak layar mode standalone */}
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-30 h-1 bg-linear-to-r from-[#7F1D1D] via-[#991B1B] to-[#FACC15]"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Halaman Mandiri */}
        <div className="pb-6 border-b-2 border-zinc-900 dark:border-zinc-100 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span
                className="h-0.5 w-6 bg-[#991B1B] dark:bg-[#FACC15]"
                aria-hidden="true"
              />
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#991B1B] dark:text-[#FACC15]">
                Seleksi & Pemetaan Kader • PC IMM Kota Malang
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Screening Calon Kader & Pengurus
            </h1>
            <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
              Tahap pemetaan pemahaman dasar keislaman, kemuhammadiyahan, ke-IMM-an, dan tata kelola organisasi.
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">

          {/*  TAHAP 1: IDENTITAS PESERTA (Fallback jika diakses langsung) */}
          {step === "intro" && (
            <motion.section
              key="step-intro"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              aria-labelledby="intro-heading"
              className="mt-8 rounded-2xl border border-[#E8E2CC] dark:border-zinc-800 bg-white dark:bg-[#121214] p-6 sm:p-8 shadow-2xs"
            >
              <div className="flex items-start gap-4 pb-6 border-b border-[#E8E2CC] dark:border-zinc-800">
                <div className="p-3 rounded-xl bg-[#7F1D1D] text-[#FACC15] shrink-0">
                  <UserCheck className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h2
                    id="intro-heading"
                    className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white"
                  >
                    Konfirmasi Identitas Peserta
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    Terdiri dari {totalQuestions} soal pilihan ganda. Silakan isi data diri Anda sebelum memulai.
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleStartScreening}
                className="mt-6 space-y-5"
                noValidate
              >
                {formError && (
                  <div
                    role="alert"
                    className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs sm:text-sm text-red-700 dark:text-red-300 font-medium"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{formError}</span>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="screening-fullName"
                    className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1.5"
                  >
                    Nama Lengkap <span className="text-[#991B1B]">*</span>
                  </label>
                  <input
                    id="screening-fullName"
                    type="text"
                    required
                    value={participant.fullName}
                    onChange={(e) =>
                      setParticipant({ ...participant, fullName: e.target.value })
                    }
                    placeholder="Contoh: Muhammad Ilham Pratama"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DCD4B8] dark:border-zinc-700 bg-[#FFFDF2]/50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#991B1B] dark:focus:ring-[#FACC15]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="screening-email"
                      className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1.5"
                    >
                      Alamat Email <span className="text-[#991B1B]">*</span>
                    </label>
                    <input
                      id="screening-email"
                      type="email"
                      required
                      value={participant.email}
                      onChange={(e) =>
                        setParticipant({ ...participant, email: e.target.value })
                      }
                      placeholder="ilham@webmail.umm.ac.id"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DCD4B8] dark:border-zinc-700 bg-[#FFFDF2]/50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#991B1B] dark:focus:ring-[#FACC15]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="screening-phone"
                      className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1.5"
                    >
                      Nomor WhatsApp / Telepon
                    </label>
                    <input
                      id="screening-phone"
                      type="tel"
                      value={participant.phone}
                      onChange={(e) =>
                        setParticipant({
                          ...participant,
                          phone: e.target.value,
                        })
                      }
                      placeholder="081234567890"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DCD4B8] dark:border-zinc-700 bg-[#FFFDF2]/50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#991B1B] dark:focus:ring-[#FACC15]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7F1D1D] hover:bg-[#991B1B] text-white font-bold text-sm shadow-sm transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#991B1B]"
                  >
                    <ClipboardCheck
                      className="w-4 h-4 text-[#FACC15]"
                      aria-hidden="true"
                    />
                    Mulai Mengerjakan Soal
                  </button>
                </div>
              </form>
            </motion.section>
          )}

          {/* TAHAP 2: PENGERJAAN SOAL PILIHAN GANDA */}
          {step === "quiz" && currentQuestion && (
            <motion.section
              key="step-quiz"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              aria-label="Lembar Soal Screening"
              className="mt-8 space-y-6"
            >
              {/* Status Bar & Progress */}
              <div className="rounded-2xl border border-[#E8E2CC] dark:border-zinc-800 bg-white dark:bg-[#121214] p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm mb-3">
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-white">
                      {participant.fullName}
                    </span>
                    {participant.email && (
                      <>
                        <span className="mx-2 text-zinc-400">•</span>
                        <span className="text-zinc-600 dark:text-zinc-400">
                          {participant.email}
                        </span>
                      </>
                    )}
                  </div>
                  <span className="font-bold text-[#991B1B] dark:text-[#FACC15] tabular-nums">
                    Terjawab: {answeredCount} / {totalQuestions}
                  </span>
                </div>

                {/* Progress Bar */}
                <div
                  role="progressbar"
                  aria-valuenow={Math.round(
                    (answeredCount / totalQuestions) * 100
                  )}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="h-2 w-full rounded-full bg-[#F5EFD6] dark:bg-zinc-800 overflow-hidden"
                >
                  <div
                    className="h-full bg-[#991B1B] dark:bg-[#FACC15] transition-all duration-300"
                    style={{
                      width: `${(answeredCount / totalQuestions) * 100}%`,
                    }}
                  />
                </div>

                {/* Navigasi Nomor Soal */}
                <div
                  aria-label="Navigasi Nomor Soal"
                  className="mt-4 flex flex-wrap items-center gap-2"
                >
                  {SCREENING_QUESTIONS.map((q, idx) => {
                    const isAnswered = Boolean(answers[q.id]);
                    const isCurrent = idx === currentIndex;

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        aria-label={`Soal nomor ${idx + 1}${
                          isAnswered ? ", sudah dijawab" : ""
                        }`}
                        aria-current={isCurrent ? "step" : undefined}
                        className={`w-9 h-9 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isCurrent
                            ? "bg-[#7F1D1D] text-[#FACC15] ring-2 ring-[#FACC15]"
                            : isAnswered
                            ? "bg-[#F5EFD6] dark:bg-zinc-800 text-[#991B1B] dark:text-[#FACC15] border border-[#DCD4B8] dark:border-zinc-700"
                            : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-transparent hover:border-zinc-300"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Kartu Soal Aktif */}
              <div className="rounded-2xl border border-[#E8E2CC] dark:border-zinc-800 bg-white dark:bg-[#121214] p-6 sm:p-8 shadow-2xs">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-[#F5EFD6] dark:bg-zinc-900 text-[#991B1B] dark:text-[#FACC15] border border-[#E8E2CC] dark:border-zinc-800">
                    Soal {currentIndex + 1} dari {totalQuestions}
                  </span>
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    {currentQuestion.category}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white leading-relaxed">
                  {currentQuestion.question}
                </h2>{currentQuestion.image && (
                <div className="mt-5 overflow-hidden rounded-xl border border-[#E8E2CC] dark:border-zinc-800 bg-[#F5EFD6]/40 dark:bg-zinc-900">
                  <img
                    src={currentQuestion.image}
                    alt={currentQuestion.imageAlt ?? currentQuestion.question}
                    className="max-h-72 w-full object-contain mx-auto"
                  />
                </div>
              )}

                {/* Daftar Pilihan Jawaban */}
                <div
                  role="radiogroup"
                  aria-label={`Pilihan jawaban untuk soal ${currentIndex + 1}`}
                  className="mt-6 space-y-3"
                >
                  {currentQuestion.options.map((option) => {
                    const isSelected = answers[currentQuestion.id] === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() =>
                          handleSelectOption(currentQuestion.id, option.id)
                        }
                        className={`w-full text-left flex items-start gap-3.5 p-4 rounded-xl border transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#991B1B] ${
                          isSelected
                            ? "border-[#991B1B] dark:border-[#FACC15] bg-[#FBF7E4] dark:bg-zinc-900 shadow-2xs"
                            : "border-[#E8E2CC] dark:border-zinc-800 bg-white dark:bg-[#161618] hover:border-[#B45309] dark:hover:border-zinc-600"
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 transition-colors ${
                            isSelected
                              ? "bg-[#7F1D1D] text-[#FACC15]"
                              : "bg-[#F5EFD6] dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                          }`}
                        >
                          {option.label}
                        </span>
                        <span
                          className={`text-sm sm:text-base leading-snug pt-0.5 ${
                            isSelected
                              ? "font-bold text-zinc-900 dark:text-white"
                              : "font-medium text-zinc-700 dark:text-zinc-300"
                          }`}
                        >
                          {option.text}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {submitWarning && (
                  <div
                    role="alert"
                    className="mt-5 flex items-center gap-2 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-xs sm:text-sm text-amber-900 dark:text-amber-300 font-medium"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{submitWarning}</span>
                  </div>
                )}

                {/* Tombol Navigasi Bawah */}
                <div className="mt-8 pt-5 border-t border-[#E8E2CC] dark:border-zinc-800 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    disabled={currentIndex === 0}
                    onClick={() =>
                      setCurrentIndex((prev) => Math.max(0, prev - 1))
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#DCD4B8] dark:border-zinc-700 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-[#F5EFD6] dark:hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                    Sebelumnya
                  </button>

                  {currentIndex < totalQuestions - 1 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentIndex((prev) =>
                          Math.min(totalQuestions - 1, prev + 1)
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#7F1D1D] hover:bg-[#991B1B] text-white text-sm font-bold transition-colors cursor-pointer"
                    >
                      Selanjutnya
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleFinishQuiz}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-zinc-950 text-sm font-extrabold shadow-sm transition-colors cursor-pointer"
                    >
                      <Send className="w-4 h-4" aria-hidden="true" />
                      Selesai Screening
                    </button>
                  )}
                </div>
              </div>
            </motion.section>
          )}

          
          {/* TAHAP 3: KONFIRMASI SELESAI SCREENING (Tanpa Skor / Nilai)*/}
          {step === "completed" && (
            <motion.section
              key="step-completed"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              aria-labelledby="screening-completed-heading"
              className="mt-8"
            >
              <div className="relative overflow-hidden rounded-2xl border border-[#E8E2CC] dark:border-zinc-800 bg-white dark:bg-[#121214] p-8 sm:p-12 text-center shadow-2xs">
                <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#7F1D1D] via-[#991B1B] to-[#FACC15]" />

                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 320, damping: 20 }}
                  className="mx-auto w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
                </motion.div>

                <h2
                  id="screening-completed-heading"
                  className="mt-5 text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white"
                >
                  Selamat! Anda telah menyelesaikan Screening.
                </h2>

                <p className="mt-2.5 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                  Terima kasih{" "}
                  <strong className="text-zinc-900 dark:text-white">
                    {participant.fullName}
                  </strong>
                  , seluruh jawaban Anda telah tercatat. Tim Kaderisasi PC IMM Kota Malang akan menindaklanjuti tahapan berikutnya.
                </p>

                <div className="mt-8 flex justify-center">
                  <motion.div
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7F1D1D] hover:bg-[#991B1B] text-white text-sm font-bold shadow-xs transition-colors"
                    >
                      <Home
                        className="w-4 h-4 text-[#FACC15]"
                        aria-hidden="true"
                      />
                      Kembali ke Beranda
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}