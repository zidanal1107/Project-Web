This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


A. Warta & Pengumuman (Announcement & AuditLog)
[done] GET /api/v1/announcements — Mengambil daftar pengumuman (mendukung filter ?category_id=&status=).
[done] GET /api/v1/announcements/:id — Detail satu pengumuman.
[done] POST /api/v1/announcements — Menambah pengumuman baru (Backend otomatis meng-insert ke tabel Announcement dan tabel AuditLog dengan aksi ANNOUNCEMENT_PUBLISHED).
[done] PUT /api/v1/announcements/:id — Mengubah pengumuman (Backend mencatat log ANNOUNCEMENT_UPDATED).
[done] DELETE /api/v1/announcements/:id — Menghapus pengumuman (Backend mencatat log ANNOUNCEMENT_DELETED).

B. Agenda Kegiatan (Event & AuditLog)
[done] GET /api/v1/events — Mengambil daftar agenda.
[done] POST /api/v1/events — Menambah agenda (Mencatat log EVENT_CREATED).
[done] PUT /api/v1/events/:id — Memperbarui agenda (Mencatat log EVENT_UPDATED).
[done] DELETE /api/v1/events/:id — Menghapus agenda (Mencatat log EVENT_DELETED).

C. Rekrutmen & Anggota (MemberApplication & Member)
POST /api/v1/member-applications — Pendaftaran publik (Insert ke MemberApplication dengan status PENDING, mencatat log APPLICATION_SUBMITTED).
GET /api/v1/member-applications — Mengambil berkas pendaftaran untuk ditinjau admin.
POST /api/v1/member-applications/:id/approve — Menyetujui pendaftaran (Backend mengubah status jadi APPROVED, meng-insert baris baru di tabel Member dengan member_number, serta mencatat log APPLICATION_APPROVED).
POST /api/v1/member-applications/:id/reject — Menolak pendaftaran (Mencatat log APPLICATION_REJECTED).
GET /api/v1/members — Mengambil daftar kader resmi yang telah berstatus aktif.

D. Histori Audit (AuditLog)
[done] GET /api/v1/audit-logs — Mengambil seluruh riwayat log dari tabel AuditLog.

E. Profil Organisasi & Bidang (Organization & Department)
[done] GET /api/v1/organization & PUT /api/v1/organization
GET /api/v1/departments
GET /api/v1/categories