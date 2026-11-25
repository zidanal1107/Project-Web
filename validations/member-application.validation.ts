import { z } from "zod";

export const memberApplicationBodySchema = z.object({
  full_name: z.string().trim().min(1, "Nama lengkap wajib diisi").max(150),
  email: z.string().trim().email("Format email tidak valid").max(150),
  phone_number: z.string().trim().min(8, "Nomor WhatsApp / Telepon wajib diisi").max(30),

  tempat_lahir: z.string().trim().min(1, "Tempat lahir wajib diisi").max(100),
  tanggal_lahir: z.coerce.date(),
  jenis_kelamin: z.string().trim().min(1, "Jenis kelamin wajib diisi").max(20),
  agama: z.string().trim().min(1, "Agama wajib diisi").max(30),

  jurusan: z.string().trim().min(1, "Jurusan wajib diisi").max(150),
  angkatan: z.string().trim().min(4, "Angkatan wajib diisi").max(10),

  akun_ig: z.string().trim().max(100).nullable().optional(),
  hobi: z.string().trim().min(1, "Hobi wajib diisi").max(150),

  alamat_asal: z.string().trim().min(1, "Alamat asal lengkap wajib diisi"),
  alamat_malang: z.string().trim().min(1, "Alamat di Malang lengkap wajib diisi"),

  riwayat_pendidikan: z.string().trim().min(1, "Riwayat pendidikan wajib diisi"),
  pengalaman_organisasi: z.string().trim().nullable().optional(),

  riwayat_penyakit: z.string().trim().nullable().optional(),
  minat_bakat: z.string().trim().min(1, "Minat dan bakat wajib diisi").max(200),
  motivasi: z.string().trim().min(1, "Alasan mengikuti organisasi wajib diisi"),

  sumber_informasi: z.string().trim().min(1, "Sumber informasi wajib diisi").max(200),
  siap_kader: z
    .union([
      z.boolean(),
      z.enum(["Ya", "Tidak", "ya", "tidak", "true", "false"]),
    ])
    .transform((val) => {
      if (typeof val === "boolean") return val;
      return val.toLowerCase() === "ya" || val.toLowerCase() === "true";
    }),
  foto_baju_url: z.string().trim().nullable().optional(),
});

export const memberApplicationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.string().trim().optional(),
  search: z.string().trim().optional(),
});

export type MemberApplicationBody = z.infer<typeof memberApplicationBodySchema>;
export type MemberApplicationQuery = z.infer<typeof memberApplicationQuerySchema>;