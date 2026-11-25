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
  Calendar,
  MapPin,
  GraduationCap,
  BookOpen,
  HeartPulse,
  AtSign,
  Upload,
  FileImage,
  Briefcase,
  Compass,
  Lightbulb,
  Info,
} from "lucide-react";
import { useSubmitApplication } from "../../../hooks/queries/useMembership";

const STORAGE_KEY = "imm_kmd_registration_draft";

interface SavedRegistrationData {
  applicationId?: string;
  fullName: string;
  email: string;
  birthPlace: string;
  birthDate: string;
  gender: string;
  major: string;
  batch: string;
  religion: string;
  instagram: string;
  originAddress: string;
  malangAddress: string;
  educationHistory: string;
  organizationExperience: string;
  medicalHistory: string;
  hobby: string;
  interestsTalents: string;
  joinReason: string;
  infoSource: string;
  readyToBeCadre: string;
  collaredPhotoName: string;
  phone: string;
}

const ANGKATAN_OPTIONS = [
  "2026",
  "2025",
  "2024",
  "2023",
  "2022",
  "2021",
  "2020",
  "Lainnya",
];

const AGAMA_OPTIONS = [
  "Islam",
  "Kristen",
  "Katolik",
  "Hindu",
  "Buddha",
  "Konghucu",
];

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

const inputBaseClass =
  "w-full px-4 py-3 text-sm rounded-lg border border-[#E8E2CC] dark:border-zinc-700 bg-[#FFFDF2] dark:bg-[#0B0B0C] text-zinc-900 dark:text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#991B1B] dark:focus:ring-[#FACC15] focus:border-transparent transition-all";

const labelBaseClass =
  "block text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2";

export default function MemberRegisterPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // Field tambahan di atas Nomor Telepon
  const [birthPlace, setBirthPlace] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [major, setMajor] = useState("");
  const [batch, setBatch] = useState("");
  const [religion, setReligion] = useState("");
  const [instagram, setInstagram] = useState("");
  const [originAddress, setOriginAddress] = useState("");
  const [malangAddress, setMalangAddress] = useState("");
  const [educationHistory, setEducationHistory] = useState("");
  const [organizationExperience, setOrganizationExperience] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [hobby, setHobby] = useState("");
  const [interestsTalents, setInterestsTalents] = useState("");
  const [joinReason, setJoinReason] = useState("");
  const [infoSource, setInfoSource] = useState("");
  const [readyToBeCadre, setReadyToBeCadre] = useState("");
  const [collaredPhotoFile, setCollaredPhotoFile] = useState<File | null>(null);
  const [collaredPhotoName, setCollaredPhotoName] = useState("");

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
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<SavedRegistrationData>;
      queueMicrotask(() => {
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.birthPlace) setBirthPlace(parsed.birthPlace);
        if (parsed.birthDate) setBirthDate(parsed.birthDate);
        if (parsed.gender) setGender(parsed.gender);
        if (parsed.major) setMajor(parsed.major);
        if (parsed.batch) setBatch(parsed.batch);
        if (parsed.religion) setReligion(parsed.religion);
        if (parsed.instagram) setInstagram(parsed.instagram);
        if (parsed.originAddress) setOriginAddress(parsed.originAddress);
        if (parsed.malangAddress) setMalangAddress(parsed.malangAddress);
        if (parsed.educationHistory)
          setEducationHistory(parsed.educationHistory);
        if (parsed.organizationExperience)
          setOrganizationExperience(parsed.organizationExperience);
        if (parsed.medicalHistory) setMedicalHistory(parsed.medicalHistory);
        if (parsed.hobby) setHobby(parsed.hobby);
        if (parsed.interestsTalents)
          setInterestsTalents(parsed.interestsTalents);
        if (parsed.joinReason) setJoinReason(parsed.joinReason);
        if (parsed.infoSource) setInfoSource(parsed.infoSource);
        if (parsed.readyToBeCadre) setReadyToBeCadre(parsed.readyToBeCadre);
        if (parsed.collaredPhotoName)
          setCollaredPhotoName(parsed.collaredPhotoName);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.applicationId) setApplicationId(parsed.applicationId);
      });
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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCollaredPhotoFile(file);
    setCollaredPhotoName(file ? file.name : "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !email.trim() || !phone.trim()) return;

    if (!readyToBeCadre) {
      setErrorMessage(
        "Silakan pilih kesediaan Anda menjadi kader IMM Aufklarung (Ya/Tidak)."
      );
      return;
    }

    if (!collaredPhotoFile && !collaredPhotoName) {
      setErrorMessage("Silakan unggah foto memakai baju berkerah terlebih dahulu.");
      return;
    }

    const detailsPayload = {
      birth_place: birthPlace.trim(),
      birth_date: birthDate,
      gender,
      major: major.trim(),
      batch,
      religion,
      instagram: instagram.trim(),
      origin_address: originAddress.trim(),
      malang_address: malangAddress.trim(),
      education_history: educationHistory.trim(),
      organization_experience: organizationExperience.trim(),
      medical_history: medicalHistory.trim(),
      hobby: hobby.trim(),
      interests_talents: interestsTalents.trim(),
      join_reason: joinReason.trim(),
      info_source: infoSource.trim(),
      ready_to_be_cadre: readyToBeCadre,
      collared_photo_name: collaredPhotoFile?.name || collaredPhotoName,
    };

    try {
      const response = await submitMutation.mutateAsync({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        details: detailsPayload,
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
        birthPlace: birthPlace.trim(),
        birthDate,
        gender,
        major: major.trim(),
        batch,
        religion,
        instagram: instagram.trim(),
        originAddress: originAddress.trim(),
        malangAddress: malangAddress.trim(),
        educationHistory: educationHistory.trim(),
        organizationExperience: organizationExperience.trim(),
        medicalHistory: medicalHistory.trim(),
        hobby: hobby.trim(),
        interestsTalents: interestsTalents.trim(),
        joinReason: joinReason.trim(),
        infoSource: infoSource.trim(),
        readyToBeCadre,
        collaredPhotoName: collaredPhotoFile?.name || collaredPhotoName,
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
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
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

                {/* Nama Lengkap */}
                <div>
                  <label htmlFor="reg-full-name" className={labelBaseClass}>
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
                      className={`${inputBaseClass} pl-10`}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="reg-email" className={labelBaseClass}>
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
                      className={`${inputBaseClass} pl-10`}
                    />
                  </div>
                </div>

                {/* Nomor WhatsApp / Telepon */}
                <div>
                  <label htmlFor="reg-phone" className={labelBaseClass}>
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
                      className={`${inputBaseClass} pl-10 font-mono`}
                    />
                  </div>
                </div>

                {/* Tempat & Tanggal Lahir */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="reg-birth-place" className={labelBaseClass}>
                      Tempat Lahir
                    </label>
                    <div className="relative">
                      <MapPin
                        className="w-4 h-4 text-[#991B1B] dark:text-[#FACC15] absolute left-3.5 top-1/2 -translate-y-1/2"
                        aria-hidden="true"
                      />
                      <input
                        id="reg-birth-place"
                        type="text"
                        required
                        value={birthPlace}
                        onChange={(e) => setBirthPlace(e.target.value)}
                        placeholder="Contoh: Malang"
                        className={`${inputBaseClass} pl-10`}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="reg-birth-date" className={labelBaseClass}>
                      Tanggal Lahir
                    </label>
                    <div className="relative">
                      <Calendar
                        className="w-4 h-4 text-[#991B1B] dark:text-[#FACC15] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        aria-hidden="true"
                      />
                      <input
                        id="reg-birth-date"
                        type="date"
                        required
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className={`${inputBaseClass} pl-10`}
                      />
                    </div>
                  </div>
                </div>

                {/* Jenis Kelamin & Agama */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="reg-gender" className={labelBaseClass}>
                      Jenis Kelamin
                    </label>
                    <select
                      id="reg-gender"
                      required
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className={inputBaseClass}
                    >
                      <option value="">Pilih jenis kelamin</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="reg-religion" className={labelBaseClass}>
                      Agama
                    </label>
                    <select
                      id="reg-religion"
                      required
                      value={religion}
                      onChange={(e) => setReligion(e.target.value)}
                      className={inputBaseClass}
                    >
                      <option value="">Pilih agama</option>
                      {AGAMA_OPTIONS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Jurusan & Angkatan (Dropdown) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="reg-major" className={labelBaseClass}>
                      Jurusan
                    </label>
                    <div className="relative">
                      <GraduationCap
                        className="w-4 h-4 text-[#991B1B] dark:text-[#FACC15] absolute left-3.5 top-1/2 -translate-y-1/2"
                        aria-hidden="true"
                      />
                      <input
                        id="reg-major"
                        type="text"
                        required
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        placeholder="Contoh: Teknik Informatika"
                        className={`${inputBaseClass} pl-10`}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="reg-batch" className={labelBaseClass}>
                      Angkatan
                    </label>
                    <select
                      id="reg-batch"
                      required
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                      className={inputBaseClass}
                    >
                      <option value="">Pilih angkatan</option>
                      {ANGKATAN_OPTIONS.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Nama Akun IG Pribadi & Hobi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="reg-instagram" className={labelBaseClass}>
                      Nama Akun IG Pribadi
                    </label>
                    <div className="relative">
                      <AtSign
                        className="w-4 h-4 text-[#991B1B] dark:text-[#FACC15] absolute left-3.5 top-1/2 -translate-y-1/2"
                        aria-hidden="true"
                      />
                      <input
                        id="reg-instagram"
                        type="text"
                        required
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        placeholder="@username_ig"
                        className={`${inputBaseClass} pl-10`}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="reg-hobby" className={labelBaseClass}>
                      Hobi
                    </label>
                    <div className="relative">
                      <Compass
                        className="w-4 h-4 text-[#B45309] dark:text-[#FACC15] absolute left-3.5 top-1/2 -translate-y-1/2"
                        aria-hidden="true"
                      />
                      <input
                        id="reg-hobby"
                        type="text"
                        required
                        value={hobby}
                        onChange={(e) => setHobby(e.target.value)}
                        placeholder="Contoh: Membaca, Futsal, Desain"
                        className={`${inputBaseClass} pl-10`}
                      />
                    </div>
                  </div>
                </div>

                {/* Alamat Asal Lengkap */}
                <div>
                  <label htmlFor="reg-origin-address" className={labelBaseClass}>
                    Alamat Asal Lengkap
                  </label>
                  <textarea
                    id="reg-origin-address"
                    required
                    rows={2}
                    value={originAddress}
                    onChange={(e) => setOriginAddress(e.target.value)}
                    placeholder="Jalan, RT/RW, Kelurahan/Desa, Kecamatan, Kabupaten/Kota, Provinsi"
                    className={inputBaseClass}
                  />
                </div>

                {/* Alamat di Malang Lengkap */}
                <div>
                  <label htmlFor="reg-malang-address" className={labelBaseClass}>
                    Alamat di Malang Lengkap
                  </label>
                  <textarea
                    id="reg-malang-address"
                    required
                    rows={2}
                    value={malangAddress}
                    onChange={(e) => setMalangAddress(e.target.value)}
                    placeholder="Alamat kos/kontrakan/rumah di Malang beserta RT/RW dan Kecamatan"
                    className={inputBaseClass}
                  />
                </div>

                {/* Riwayat Pendidikan (Alamat dan Tahun) */}
                <div>
                  <label htmlFor="reg-education" className={labelBaseClass}>
                    <span className="inline-flex items-center gap-1.5">
                      <BookOpen
                        className="w-3.5 h-3.5 text-[#991B1B] dark:text-[#FACC15]"
                        aria-hidden="true"
                      />
                      Riwayat Pendidikan (Alamat dan Tahun)
                    </span>
                  </label>
                  <textarea
                    id="reg-education"
                    required
                    rows={3}
                    value={educationHistory}
                    onChange={(e) => setEducationHistory(e.target.value)}
                    placeholder={
                      "Contoh:\nSDN 1 ... (Jl. ..., 2012-2018)\nSMPN 1 ... (Jl. ..., 2018-2021)\nSMAN 1 ... (Jl. ..., 2021-2024)"
                    }
                    className={inputBaseClass}
                  />
                </div>

                {/* Pengalaman Organisasi (Jabatan dan Tahun) */}
                <div>
                  <label htmlFor="reg-org-exp" className={labelBaseClass}>
                    <span className="inline-flex items-center gap-1.5">
                      <Briefcase
                        className="w-3.5 h-3.5 text-[#991B1B] dark:text-[#FACC15]"
                        aria-hidden="true"
                      />
                      Pengalaman Organisasi (Jabatan dan Tahun)
                    </span>
                  </label>
                  <textarea
                    id="reg-org-exp"
                    required
                    rows={3}
                    value={organizationExperience}
                    onChange={(e) => setOrganizationExperience(e.target.value)}
                    placeholder={
                      "Contoh:\nOSIS SMAN 1 - Ketua Bidang ... (2022-2023)\nJika belum ada, tulis: Belum ada"
                    }
                    className={inputBaseClass}
                  />
                </div>

                {/* Riwayat Penyakit & Minat dan Bakat */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="reg-medical-history"
                      className={labelBaseClass}
                    >
                      Riwayat Penyakit
                    </label>
                    <div className="relative">
                      <HeartPulse
                        className="w-4 h-4 text-[#991B1B] dark:text-[#FACC15] absolute left-3.5 top-1/2 -translate-y-1/2"
                        aria-hidden="true"
                      />
                      <input
                        id="reg-medical-history"
                        type="text"
                        required
                        value={medicalHistory}
                        onChange={(e) => setMedicalHistory(e.target.value)}
                        placeholder="Contoh: Tidak ada / Asma / Maag"
                        className={`${inputBaseClass} pl-10`}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="reg-interests" className={labelBaseClass}>
                      Minat dan Bakat
                    </label>
                    <div className="relative">
                      <Lightbulb
                        className="w-4 h-4 text-[#B45309] dark:text-[#FACC15] absolute left-3.5 top-1/2 -translate-y-1/2"
                        aria-hidden="true"
                      />
                      <input
                        id="reg-interests"
                        type="text"
                        required
                        value={interestsTalents}
                        onChange={(e) => setInterestsTalents(e.target.value)}
                        placeholder="Contoh: Public Speaking, Menulis, IT"
                        className={`${inputBaseClass} pl-10`}
                      />
                    </div>
                  </div>
                </div>

                {/* Alasan Mengikuti Organisasi */}
                <div>
                  <label htmlFor="reg-join-reason" className={labelBaseClass}>
                    Alasan Mengikuti Organisasi
                  </label>
                  <textarea
                    id="reg-join-reason"
                    required
                    rows={3}
                    value={joinReason}
                    onChange={(e) => setJoinReason(e.target.value)}
                    placeholder="Tuliskan motivasi dan harapan Anda bergabung dengan IMM Aufklarung"
                    className={inputBaseClass}
                  />
                </div>

                {/* Mendapatkan Informasi IMM Aufklarung Darimana */}
                <div>
                  <label htmlFor="reg-info-source" className={labelBaseClass}>
                    <span className="inline-flex items-center gap-1.5">
                      <Info
                        className="w-3.5 h-3.5 text-[#991B1B] dark:text-[#FACC15]"
                        aria-hidden="true"
                      />
                      Mendapatkan Informasi IMM Aufklarung Darimana
                    </span>
                  </label>
                  <input
                    id="reg-info-source"
                    type="text"
                    required
                    value={infoSource}
                    onChange={(e) => setInfoSource(e.target.value)}
                    placeholder="Contoh: Instagram, Teman, Masta, Pamflet Kampus"
                    className={inputBaseClass}
                  />
                </div>

                {/* Apakah Siap Menjadi Kader Aufklarung (Ya/Tidak) */}
                <div>
                  <span className={labelBaseClass}>
                    Apakah Siap Menjadi Kader Aufklarung?
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {["Ya", "Tidak"].map((option) => {
                      const isSelected = readyToBeCadre === option;
                      return (
                        <label
                          key={option}
                          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border text-sm font-semibold cursor-pointer transition-all ${
                            isSelected
                              ? "bg-[#7F1D1D] text-white border-[#7F1D1D] dark:bg-[#FACC15] dark:text-zinc-900 dark:border-[#FACC15]"
                              : "bg-[#FFFDF2] dark:bg-[#0B0B0C] text-zinc-700 dark:text-zinc-300 border-[#E8E2CC] dark:border-zinc-700 hover:border-[#991B1B]/50 dark:hover:border-[#FACC15]/50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="readyToBeCadre"
                            value={option}
                            checked={isSelected}
                            onChange={(e) => setReadyToBeCadre(e.target.value)}
                            className="sr-only"
                          />
                          <span>{option}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Foto Baju Berkerah (Kirim File) */}
                <div>
                  <label htmlFor="reg-photo" className={labelBaseClass}>
                    Foto Baju Berkerah (Kirim File)
                  </label>
                  <label
                    htmlFor="reg-photo"
                    className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full px-4 py-3.5 rounded-lg border border-dashed border-[#C7BDA0] dark:border-zinc-700 bg-[#FFFDF2] dark:bg-[#0B0B0C] hover:border-[#991B1B] dark:hover:border-[#FACC15] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-[#F5EFD6] dark:bg-zinc-800 text-[#991B1B] dark:text-[#FACC15] flex items-center justify-center shrink-0">
                        {collaredPhotoName ? (
                          <FileImage className="w-4 h-4" aria-hidden="true" />
                        ) : (
                          <Upload className="w-4 h-4" aria-hidden="true" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                          {collaredPhotoName ||
                            "Pilih file foto memakai baju berkerah"}
                        </p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          Format gambar (JPG, PNG, WEBP)
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 rounded-md text-xs font-bold bg-[#7F1D1D] text-white dark:bg-[#FACC15] dark:text-zinc-900 shrink-0">
                      {collaredPhotoName ? "Ganti File" : "Pilih File"}
                    </span>
                    <input
                      id="reg-photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="sr-only"
                    />
                  </label>
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
