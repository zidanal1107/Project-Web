# Pusat Informasi Organisasi — IMM Cabang Malang

Aplikasi web modern, responsif, dan siap pakai untuk pusat informasi organisasi, rekrutmen kader, publikasi warta/instruksi, serta tata kelola akuntabilitas pimpinan dengan pencatatan audit log otomatis.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 8 (Hot Module Replacement)
- **Styling:** Tailwind CSS v4 (Native Vite Plugin)
- **Routing:** React Router v7 (`react-router-dom`)
- **Server State Management:** TanStack Query v5 (`@tanstack/react-query`)
- **HTTP Client:** Axios (Interceptors & Error Normalizer)
- **Icons:** Lucide React

---

## 🗄️ Database Schema & Entities

Arsitektur aplikasi dipadukan secara presisi 1:1 dengan 9 entitas database:

```
A. Core Organization
   ├── 1. Organization        : Profil utama organisasi, visi, misi, logo, email
   ├── 2. Department          : Bidang/divisi fungsional pimpinan cabang
   └── 3. AdminUser           : Akun pengurus/admin sistem

B. Information & Activities
   ├── 4. Announcement        : Warta, instruksi, surat edaran, siaran pers (CRUD)
   ├── 5. Category            : Kategori pengumuman
   └── 6. Event               : Agenda kegiatan & perkaderan (CRUD)

C. Recruitment & Membership
   ├── 7. MemberApplication   : Formulir pendaftaran calon kader (PENDING / APPROVED / REJECTED)
   └── 8. Member              : Anggota resmi aktif dengan Nomor Induk Anggota (NIA)

D. System Accountability
   └── 9. AuditLog            : Jejak rekam mutasi data (create, update, delete, approve)
```

---

## 📁 Struktur Folder Proyek

```
d:\KMD\src\
├── assets/                  # File statis dan ikon
├── components/              # Komponen antarmuka modular
│   ├── common/              # Header, Footer, RoleSwitcher
│   └── feedback/            # SkeletonLoader, EmptyState, ErrorBanner
├── context/                 # AuthContext (Role: guest, kader, admin)
├── hooks/                   # Custom query hooks (useAnnouncements, useEvents, useMembership, useAudit, useOrg)
├── layouts/                 # PublicLayout, AdminLayout, RootLayout
├── pages/                   # Halaman publik & panel manajemen admin
│   ├── HomePage.tsx         # Beranda portal organisasi
│   ├── AnnouncementsPage.tsx # Arsip warta & filter kategori
│   ├── AnnouncementDetailPage.tsx # Baca pengumuman lengkap
│   ├── EventsPage.tsx       # Kalender agenda kegiatan
│   ├── ProfilePage.tsx      # Profil entitas organisasi & departemen
│   ├── MemberRegisterPage.tsx # Formulir pendaftaran kader baru (MemberApplication)
│   ├── LoginPage.tsx        # Autentikasi pengurus
│   └── admin/               # Panel admin backoffice
│       ├── AdminDashboard.tsx      # Metrik ringkasan & live audit log
│       ├── ManageAnnouncements.tsx # CRUD penuh Announcement
│       ├── ManageEvents.tsx        # CRUD penuh Event
│       ├── ManageMembership.tsx    # Verifikasi pendaftaran & penerbitan NIA Member
│       ├── ManageOrganization.tsx  # Pengaturan Organization & Department
│       └── AuditLogsPage.tsx       # Viewer histori AuditLog & Ekspor CSV
├── routes/                  # Route definitions & ProtectedRoute guard
├── services/                # API client, database service, & service adapters
│   ├── api.client.ts        # Axios client instance
│   ├── db.service.ts        # In-browser persistent database (localStorage)
│   └── modules/             # Dual-mode service adapters (Mock / Real API)
├── types/                   # TypeScript interfaces (schema.types.ts, api.types.ts)
└── main.tsx
```

---

## 🚀 Menjalankan Aplikasi

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Menjalankan Server Pengembangan (Dev)
```bash
npm run dev
```
Akses di peramban: `http://localhost:5173`

### 3. Build Produksi
```bash
npm run build
```

---

## 🔌 Integrasi Database (Dual-Mode Architecture)

Aplikasi memiliki **Dual-Mode Adapter** yang memungkinkan Anda beralih dari database simulasi internal ke database riil server backend tanpa perlu mengubah kode komponen tampilan.

### Beralih ke Database Riil:
1. Buat file `.env` di direktori utama:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   VITE_USE_MOCK=false
   ```
2. Ketika `VITE_USE_MOCK=false`, Axios langsung mengirim HTTP request ke REST API backend server Anda.

### Kontrak Endpoint REST API untuk Backend Developer:

| Metode | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/announcements` | Mengambil daftar pengumuman (`?category_id=&status=&search=`) |
| `GET` | `/announcements/:id` | Detail pengumuman |
| `POST` | `/announcements` | Buat pengumuman baru *(Backend wajib mencatat ke `AuditLog`)* |
| `PUT` | `/announcements/:id` | Edit pengumuman *(Backend wajib mencatat ke `AuditLog`)* |
| `DELETE` | `/announcements/:id` | Hapus pengumuman *(Backend wajib mencatat ke `AuditLog`)* |
| `GET` | `/events` | Mengambil kalender agenda |
| `POST` | `/events` | Buat agenda baru *(Mencatat ke `AuditLog`)* |
| `PUT` | `/events/:id` | Edit agenda *(Mencatat ke `AuditLog`)* |
| `DELETE` | `/events/:id` | Hapus agenda *(Mencatat ke `AuditLog`)* |
| `POST` | `/member-applications` | Pendaftaran publik (status awal `PENDING`) |
| `GET` | `/member-applications` | Daftar formulir pendaftaran untuk diverifikasi admin |
| `POST` | `/member-applications/:id/approve` | Menyetujui pendaftaran & menerbitkan `Member` (NIA) |
| `POST` | `/member-applications/:id/reject` | Menolak pendaftaran kader |
| `GET` | `/members` | Daftar anggota resmi aktif |
| `GET` | `/audit-logs` | Mengambil seluruh riwayat tabel `AuditLog` |
| `GET` / `PUT` | `/organization` | Profil organisasi utama |
| `GET` | `/departments` | Daftar bidang/divisi |
| `GET` | `/categories` | Daftar kategori pengumuman |

---

## 👥 Pengujian Role (Widget Role Switcher)

Tersedia tombol widget melayang di pojok kanan bawah yang memungkinkan penguji beralih peran instan:
- **Guest:** Pengunjung umum & calon kader (mengakses Beranda, Warta, Agenda, Profil, dan Pendaftaran Anggota).
- **Kader:** Anggota aktif terdaftar.
- **Admin:** Pimpinan/pengurus dengan akses penuh ke seluruh tabel backoffice dan histori `AuditLog`.
