import type {
  Organization,
  Department,
  AdminUser,
  Category,
  Announcement,
  AnnouncementStatus,
  Event,
  MemberApplication,
  Member,
  AuditLog,
} from '../../types/client/schema.types';

// Storage keys
const STORAGE_PREFIX = 'imm_portal_db_';
const KEYS = {
  ORGANIZATION: `${STORAGE_PREFIX}organization`,
  DEPARTMENTS: `${STORAGE_PREFIX}departments`,
  ADMIN_USERS: `${STORAGE_PREFIX}admin_users`,
  CATEGORIES: `${STORAGE_PREFIX}categories`,
  ANNOUNCEMENTS: `${STORAGE_PREFIX}announcements`,
  EVENTS: `${STORAGE_PREFIX}events`,
  APPLICATIONS: `${STORAGE_PREFIX}member_applications`,
  MEMBERS: `${STORAGE_PREFIX}members`,
  AUDIT_LOGS: `${STORAGE_PREFIX}audit_logs`,
};

// Initial Seed Data matching the schema
const SEED_ORGANIZATION: Organization = {
  organization_id: 1,
  name: 'Pimpinan Cabang IMM Malang',
  description: 'Pusat Informasi dan Tata Kelola Organisasi Ikatan Mahasiswa Muhammadiyah (IMM) Cabang Malang.',
  vision: 'Meneguhkan IMM Cabang Malang sebagai pusat diaspora intelektual profetik yang mandiri, adaptif, dan responsif terhadap advokasi kerakyatan.',
  mission: '1. Mengembangkan perkaderan berbasis kompetensi intelektual profetik.\n2. Mengawal advokasi kebijakan publik dan pendidikan tinggi yang berpihak pada mustadh\'afin.\n3. Menguatkan sinergi komisariat kampus se-Malang Raya melalui digitalisasi tata kelola organisasi.',
  email: 'sekretariat@imm-malang.or.id',
  logo_url: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Logo_IMM.png',
};

const SEED_DEPARTMENTS: Department[] = [
  {
    department_id: 1,
    organization_id: 1,
    name: 'Badan Pengurus Harian (BPH)',
    description: 'Koordinator utama kebijakan pimpinan, legalitas organisasi, dan administrasi cabang.',
    contact_email: 'bph@imm-malang.or.id',
  },
  {
    department_id: 2,
    organization_id: 1,
    name: 'Bidang Kaderisasi',
    description: 'Pengelola sistem perkaderan formal (DAD, DAM), database kader, dan instruktur cabang.',
    contact_email: 'kader@imm-malang.or.id',
  },
  {
    department_id: 3,
    organization_id: 1,
    name: 'Bidang Riset dan Pengembangan Keilmuan (RPK)',
    description: 'Fasilitator dialektika intelektual, publikasi ilmiah, dan literasi profetik kader.',
    contact_email: 'rpk@imm-malang.or.id',
  },
  {
    department_id: 4,
    organization_id: 1,
    name: 'Bidang Hikmah, Politik & Kebijakan Publik',
    description: 'Garda terdepan advokasi kampus, respon isu kerakyatan, dan kajian perpolitikan nasional.',
    contact_email: 'hikmah@imm-malang.or.id',
  },
  {
    department_id: 5,
    organization_id: 1,
    name: 'Bidang Media dan Komunikasi (Medkom)',
    description: 'Pengelola portal informasi, publikasi warta, dokumentasi, dan hubungan masyarakat.',
    contact_email: 'humas@imm-malang.or.id',
  },
];

const SEED_ADMIN_USERS: AdminUser[] = [
  {
    admin_id: 1,
    name: 'Ahmad Fauzan',
    email: 'admin@imm-malang.or.id',
    role: 'SUPER_ADMIN',
    is_active: true,
  },
  {
    admin_id: 2,
    name: 'M. Rizqi Pratama',
    email: 'sekum@imm-malang.or.id',
    role: 'SECRETARY',
    is_active: true,
  },
  {
    admin_id: 3,
    name: 'Bima Alamsyah',
    email: 'kader@imm-malang.or.id',
    role: 'KADER_ADMIN',
    is_active: true,
  },
];

const SEED_CATEGORIES: Category[] = [
  {
    category_id: 1,
    name: 'Instruksi Pimpinan',
    description: 'Surat perintah dan instruksi langsung pimpinan cabang untuk jajaran komisariat.',
  },
  {
    category_id: 2,
    name: 'Surat Edaran',
    description: 'Pemberitahuan resmi berkala terkait pelaksanaan agenda dan tata kelola.',
  },
  {
    category_id: 3,
    name: 'Warta Kegiatan',
    description: 'Liputan dan berita kegiatan perkaderan, pelantikan, dan forum ilmiah.',
  },
  {
    category_id: 4,
    name: 'Siaran Pers',
    description: 'Pernyataan sikap dan rilis resmi kelembagaan terhadap isu publik.',
  },
];

const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    announcement_id: 1,
    organization_id: 1,
    category_id: 1,
    created_by: 1,
    title: 'Instruksi Pimpinan: Konsolidasi Akbar Komisariat Se-Malang Raya',
    content: 'Menindaklanjuti hasil Rapat Pleno BPH PC IMM Malang, seluruh Ketua Umum dan Sekretaris Umum PK IMM se-Malang Raya diinstruksikan hadir dalam agenda Konsolidasi Akbar dan Evaluasi Gerak Kader Semester Ganjil.',
    status: 'PUBLISHED',
    created_at: '2026-11-04T08:00:00Z',
    published_at: '2026-11-04T08:30:00Z',
  },
  {
    announcement_id: 2,
    organization_id: 1,
    category_id: 2,
    created_by: 3,
    title: 'Edaran Pembukaan Pendaftaran Darul Arqam Madya (DAM) Nasional 2026',
    content: 'Bidang Kaderisasi resmi membuka seleksi berkas dan penulisan gagasan calon peserta DAM Nasional 2026. Seluruh komisariat diharapkan mengutus kader terbaik yang telah lulus DAD minimal 1 tahun.',
    status: 'PUBLISHED',
    created_at: '2026-11-01T10:00:00Z',
    published_at: '2026-11-01T10:15:00Z',
  },
  {
    announcement_id: 3,
    organization_id: 1,
    category_id: 4,
    created_by: 1,
    title: 'Siaran Pers: Sikap IMM Malang Terkait Transparansi Pembiayaan Pendidikan Tinggi',
    content: 'PC IMM Malang mendesak pimpinan perguruan tinggi di Malang Raya membuka rincian alokasi biaya operasional kuliah serta menjamin beasiswa darurat bagi mahasiswa ekonomi rentan.',
    status: 'PUBLISHED',
    created_at: '2026-10-28T14:00:00Z',
    published_at: '2026-10-28T14:30:00Z',
  },
];

const SEED_EVENTS: Event[] = [
  {
    event_id: 1,
    organization_id: 1,
    created_by: 1,
    title: 'Konsolidasi Akbar & Evaluasi Semester Ganjil',
    description: 'Forum koordinasi strategis pimpinan cabang dengan seluruh 24 pimpinan komisariat.',
    location: 'Aula PDM Kota Malang, Jl. Gajayana No. 28',
    start_at: '2026-11-14T08:30:00Z',
    end_at: '2026-11-14T16:00:00Z',
    status: 'UPCOMING',
  },
  {
    event_id: 2,
    organization_id: 1,
    created_by: 3,
    title: 'Darul Arqam Madya (DAM) Tingkat Nasional 2026',
    description: 'Perkaderan kepemimpinan tingkat madya nasional dengan fokus intelektualisme profetik.',
    location: 'Balai Diklat Keagamaan / Kampus Utama',
    start_at: '2026-12-05T08:00:00Z',
    end_at: '2026-12-11T12:00:00Z',
    status: 'UPCOMING',
  },
  {
    event_id: 3,
    organization_id: 1,
    created_by: 2,
    title: 'Sidang Pleno Triwulan I PC IMM Malang',
    description: 'Penyampaian progres kerja setiap bidang pimpinan cabang dan evaluasi serapan anggaran.',
    location: 'Gedung Dakwah Muhammadiyah',
    start_at: '2026-10-10T09:00:00Z',
    end_at: '2026-10-10T17:00:00Z',
    status: 'COMPLETED',
  },
];

const SEED_APPLICATIONS: MemberApplication[] = [
  {
    application_id: 1,
    organization_id: 1,
    reviewed_by: 1,
    full_name: 'Fathur Rozak',
    email: 'fathur.rozak@student.umm.ac.id',
    phone: '081234567891',
    submitted_at: '2026-11-02T09:15:00Z',
    status: 'APPROVED',
  },
  {
    application_id: 2,
    organization_id: 1,
    reviewed_by: null,
    full_name: 'Annisa Rahmawati',
    email: 'annisa.rahma@student.ub.ac.id',
    phone: '081398765432',
    submitted_at: '2026-11-06T11:20:00Z',
    status: 'PENDING',
  },
  {
    application_id: 3,
    organization_id: 1,
    reviewed_by: null,
    full_name: 'Dwi Prasetyo',
    email: 'dwi.prasetyo@student.um.ac.id',
    phone: '085711223344',
    submitted_at: '2026-11-07T14:45:00Z',
    status: 'PENDING',
  },
];

const SEED_MEMBERS: Member[] = [
  {
    member_id: 1,
    application_id: 1,
    member_number: 'NIA-2026-001',
    joined_at: '2026-11-02T10:00:00Z',
    status: 'ACTIVE',
  },
];

const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    audit_id: 1,
    admin_id: 1,
    action: 'ANNOUNCEMENT_PUBLISHED',
    entity_type: 'Announcement',
    entity_id: 1,
    created_at: '2026-11-04T08:30:00Z',
    details: 'Menerbitkan pengumuman: Instruksi Pimpinan Konsolidasi Akbar',
  },
  {
    audit_id: 2,
    admin_id: 3,
    action: 'ANNOUNCEMENT_PUBLISHED',
    entity_type: 'Announcement',
    entity_id: 2,
    created_at: '2026-11-01T10:15:00Z',
    details: 'Menerbitkan edaran: Pembukaan Pendaftaran DAM Nasional 2026',
  },
  {
    audit_id: 3,
    admin_id: 1,
    action: 'APPLICATION_APPROVED',
    entity_type: 'MemberApplication',
    entity_id: 1,
    created_at: '2026-11-02T10:00:00Z',
    details: 'Menyetujui pendaftaran anggota Fathur Rozak dan menerbitkan nomor anggota NIA-2026-001',
  },
];

// Helper to read and write to LocalStorage
function getItem<T>(key: string, seed: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  } catch {
    return seed;
  }
}

function setItem<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// In-Memory & LocalStorage Database Service
export const db = {
  // 1. Organization
  getOrganization(): Organization {
    return getItem(KEYS.ORGANIZATION, SEED_ORGANIZATION);
  },
  updateOrganization(data: Partial<Organization>, admin_id: number): Organization {
    const current = this.getOrganization();
    const updated = { ...current, ...data };
    setItem(KEYS.ORGANIZATION, updated);
    this.addAuditLog(admin_id, 'DEPARTMENT_UPDATED', 'Organization', 1, 'Memperbarui profil organisasi');
    return updated;
  },

  // 2. Departments
  getDepartments(): Department[] {
    return getItem(KEYS.DEPARTMENTS, SEED_DEPARTMENTS);
  },

  // 3. Admin Users
  getAdminUsers(): AdminUser[] {
    return getItem(KEYS.ADMIN_USERS, SEED_ADMIN_USERS);
  },
  getAdminUserById(id: number): AdminUser | undefined {
    return this.getAdminUsers().find((u) => u.admin_id === id);
  },

  // 5. Categories
  getCategories(): Category[] {
    return getItem(KEYS.CATEGORIES, SEED_CATEGORIES);
  },

  // 4. Announcements (Full CRUD + Audit)
  getAnnouncements(): Announcement[] {
    const announcements = getItem(KEYS.ANNOUNCEMENTS, SEED_ANNOUNCEMENTS);
    const categories = this.getCategories();
    const admins = this.getAdminUsers();

    // Attach joined category_name and author_name
    return announcements.map((a) => ({
      ...a,
      category_name: categories.find((c) => c.category_id === a.category_id)?.name || 'Umum',
      author_name: admins.find((u) => u.admin_id === a.created_by)?.name || 'Admin',
    }));
  },

  createAnnouncement(
    payload: {
      category_id: number;
      title: string;
      content: string;
      status?: AnnouncementStatus;
    },
    admin_id: number
  ): Announcement {
    const announcements = getItem(KEYS.ANNOUNCEMENTS, SEED_ANNOUNCEMENTS);
    const newId = announcements.length > 0 ? Math.max(...announcements.map((a) => a.announcement_id)) + 1 : 1;
    const now = new Date().toISOString();

    const newAnnouncement: Announcement = {
      announcement_id: newId,
      organization_id: 1,
      category_id: Number(payload.category_id),
      created_by: admin_id,
      title: payload.title,
      content: payload.content,
      status: payload.status || 'PUBLISHED',
      created_at: now,
      published_at: payload.status === 'DRAFT' ? null : now,
    };

    announcements.unshift(newAnnouncement);
    setItem(KEYS.ANNOUNCEMENTS, announcements);

    // Audit Log Entry
    const action = payload.status === 'DRAFT' ? 'ANNOUNCEMENT_CREATED' : 'ANNOUNCEMENT_PUBLISHED';
    this.addAuditLog(admin_id, action, 'Announcement', newId, `Membuat pengumuman: "${payload.title}" [${newAnnouncement.status}]`);

    return newAnnouncement;
  },

  updateAnnouncement(
    announcement_id: number,
    payload: Partial<Announcement>,
    admin_id: number
  ): Announcement {
    const announcements = getItem(KEYS.ANNOUNCEMENTS, SEED_ANNOUNCEMENTS);
    const index = announcements.findIndex((a) => a.announcement_id === announcement_id);
    if (index === -1) throw new Error('Pengumuman tidak ditemukan');

    const updated = {
      ...announcements[index],
      ...payload,
      published_at:
        payload.status === 'PUBLISHED' && !announcements[index].published_at
          ? new Date().toISOString()
          : announcements[index].published_at,
    };

    announcements[index] = updated;
    setItem(KEYS.ANNOUNCEMENTS, announcements);

    // Audit Log Entry
    this.addAuditLog(admin_id, 'ANNOUNCEMENT_UPDATED', 'Announcement', announcement_id, `Memperbarui pengumuman ID ${announcement_id}: "${updated.title}"`);

    return updated;
  },

  deleteAnnouncement(announcement_id: number, admin_id: number): void {
    const announcements = getItem(KEYS.ANNOUNCEMENTS, SEED_ANNOUNCEMENTS);
    const target = announcements.find((a) => a.announcement_id === announcement_id);
    const filtered = announcements.filter((a) => a.announcement_id !== announcement_id);
    setItem(KEYS.ANNOUNCEMENTS, filtered);

    // Audit Log Entry
    this.addAuditLog(
      admin_id,
      'ANNOUNCEMENT_DELETED',
      'Announcement',
      announcement_id,
      `Menghapus pengumuman ID ${announcement_id}: "${target?.title || 'Unknown'}"`
    );
  },

  // 6. Events (CRUD + Audit)
  getEvents(): Event[] {
    const events = getItem(KEYS.EVENTS, SEED_EVENTS);
    const admins = this.getAdminUsers();
    return events.map((e) => ({
      ...e,
      author_name: admins.find((u) => u.admin_id === e.created_by)?.name || 'Admin',
    }));
  },

  createEvent(
    payload: {
      title: string;
      description: string;
      location: string;
      start_at: string;
      end_at: string;
      status?: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
    },
    admin_id: number
  ): Event {
    const events = getItem(KEYS.EVENTS, SEED_EVENTS);
    const newId = events.length > 0 ? Math.max(...events.map((e) => e.event_id)) + 1 : 1;

    const newEvent: Event = {
      event_id: newId,
      organization_id: 1,
      created_by: admin_id,
      title: payload.title,
      description: payload.description,
      location: payload.location,
      start_at: payload.start_at,
      end_at: payload.end_at,
      status: payload.status || 'UPCOMING',
    };

    events.unshift(newEvent);
    setItem(KEYS.EVENTS, events);

    this.addAuditLog(admin_id, 'EVENT_CREATED', 'Event', newId, `Menjadwalkan agenda baru: "${payload.title}" di ${payload.location}`);
    return newEvent;
  },

  updateEvent(event_id: number, payload: Partial<Event>, admin_id: number): Event {
    const events = getItem(KEYS.EVENTS, SEED_EVENTS);
    const idx = events.findIndex((e) => e.event_id === event_id);
    if (idx === -1) throw new Error('Agenda tidak ditemukan');

    const updated = { ...events[idx], ...payload };
    events[idx] = updated;
    setItem(KEYS.EVENTS, events);

    this.addAuditLog(admin_id, 'EVENT_UPDATED', 'Event', event_id, `Memperbarui status/detail agenda ID ${event_id}: "${updated.title}"`);
    return updated;
  },

  deleteEvent(event_id: number, admin_id: number): void {
    const events = getItem(KEYS.EVENTS, SEED_EVENTS);
    const target = events.find((e) => e.event_id === event_id);
    const filtered = events.filter((e) => e.event_id !== event_id);
    setItem(KEYS.EVENTS, filtered);

    this.addAuditLog(admin_id, 'EVENT_DELETED', 'Event', event_id, `Menghapus agenda ID ${event_id}: "${target?.title || 'Unknown'}"`);
  },

  // 7. Member Applications (Public Submit + Admin Review)
  getMemberApplications(): MemberApplication[] {
    const apps = getItem(KEYS.APPLICATIONS, SEED_APPLICATIONS);
    const admins = this.getAdminUsers();
    return apps.map((a) => ({
      ...a,
      reviewer_name: a.reviewed_by ? admins.find((u) => u.admin_id === a.reviewed_by)?.name : undefined,
    }));
  },

  submitMemberApplication(payload: {
    full_name: string;
    email: string;
    phone: string;
  }): MemberApplication {
    const apps = getItem(KEYS.APPLICATIONS, SEED_APPLICATIONS);
    const newId = apps.length > 0 ? Math.max(...apps.map((a) => a.application_id)) + 1 : 1;

    const newApp: MemberApplication = {
      application_id: newId,
      organization_id: 1,
      reviewed_by: null,
      full_name: payload.full_name,
      email: payload.email,
      phone: payload.phone,
      submitted_at: new Date().toISOString(),
      status: 'PENDING',
    };

    apps.unshift(newApp);
    setItem(KEYS.APPLICATIONS, apps);

    // Audit log (guest action, admin_id is null)
    this.addAuditLog(null, 'APPLICATION_SUBMITTED', 'MemberApplication', newId, `Pendaftaran anggota baru diajukan oleh: ${payload.full_name}`);
    return newApp;
  },

  approveMemberApplication(application_id: number, admin_id: number): { application: MemberApplication; member: Member } {
    const apps = getItem(KEYS.APPLICATIONS, SEED_APPLICATIONS);
    const appIndex = apps.findIndex((a) => a.application_id === application_id);
    if (appIndex === -1) throw new Error('Pendaftaran tidak ditemukan');

    // Update application
    apps[appIndex].status = 'APPROVED';
    apps[appIndex].reviewed_by = admin_id;
    setItem(KEYS.APPLICATIONS, apps);

    // Create Member row
    const members = getItem(KEYS.MEMBERS, SEED_MEMBERS);
    const newMemberId = members.length > 0 ? Math.max(...members.map((m) => m.member_id)) + 1 : 1;
    const year = new Date().getFullYear();
    const seq = String(newMemberId).padStart(3, '0');
    const member_number = `NIA-${year}-${seq}`;

    const newMember: Member = {
      member_id: newMemberId,
      application_id,
      member_number,
      joined_at: new Date().toISOString(),
      status: 'ACTIVE',
    };
    members.unshift(newMember);
    setItem(KEYS.MEMBERS, members);

    // Audit Log Entry
    this.addAuditLog(
      admin_id,
      'APPLICATION_APPROVED',
      'MemberApplication',
      application_id,
      `Menyetujui berkas pendaftaran ${apps[appIndex].full_name} dan menerbitkan Nomor Induk Anggota ${member_number}`
    );

    return { application: apps[appIndex], member: newMember };
  },

  rejectMemberApplication(application_id: number, admin_id: number): MemberApplication {
    const apps = getItem(KEYS.APPLICATIONS, SEED_APPLICATIONS);
    const appIndex = apps.findIndex((a) => a.application_id === application_id);
    if (appIndex === -1) throw new Error('Pendaftaran tidak ditemukan');

    apps[appIndex].status = 'REJECTED';
    apps[appIndex].reviewed_by = admin_id;
    setItem(KEYS.APPLICATIONS, apps);

    // Audit Log Entry
    this.addAuditLog(
      admin_id,
      'APPLICATION_REJECTED',
      'MemberApplication',
      application_id,
      `Menolak pendaftaran anggota ID ${application_id}: ${apps[appIndex].full_name}`
    );

    return apps[appIndex];
  },

  // 8. Members
  getMembers(): Member[] {
    const members = getItem(KEYS.MEMBERS, SEED_MEMBERS);
    const apps = getItem(KEYS.APPLICATIONS, SEED_APPLICATIONS);

    return members.map((m) => {
      const app = apps.find((a) => a.application_id === m.application_id);
      return {
        ...m,
        full_name: app?.full_name || 'Kader',
        email: app?.email || '',
        phone: app?.phone || '',
      };
    });
  },

  // 9. AuditLog
  getAuditLogs(): AuditLog[] {
    const logs = getItem(KEYS.AUDIT_LOGS, SEED_AUDIT_LOGS);
    const admins = this.getAdminUsers();

    // Join admin_name & sort newest first
    return logs
      .map((l) => ({
        ...l,
        admin_name: l.admin_id ? admins.find((u) => u.admin_id === l.admin_id)?.name || `Admin #${l.admin_id}` : 'Sistem / Publik',
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  addAuditLog(
    admin_id: number | null,
    action: string,
    entity_type: AuditLog['entity_type'],
    entity_id: number,
    details: string | null
  ): AuditLog {
    const logs = getItem(KEYS.AUDIT_LOGS, SEED_AUDIT_LOGS);
    const newId = logs.length > 0 ? Math.max(...logs.map((l) => l.audit_id)) + 1 : 1;

    const newLog: AuditLog = {
      audit_id: newId,
      admin_id,
      action,
      entity_type,
      entity_id,
      created_at: new Date().toISOString(),
      details,
    };

    logs.unshift(newLog);
    setItem(KEYS.AUDIT_LOGS, logs);
    return newLog;
  },

  // Database Reset
  resetDatabase(): void {
    setItem(KEYS.ORGANIZATION, SEED_ORGANIZATION);
    setItem(KEYS.DEPARTMENTS, SEED_DEPARTMENTS);
    setItem(KEYS.ADMIN_USERS, SEED_ADMIN_USERS);
    setItem(KEYS.CATEGORIES, SEED_CATEGORIES);
    setItem(KEYS.ANNOUNCEMENTS, SEED_ANNOUNCEMENTS);
    setItem(KEYS.EVENTS, SEED_EVENTS);
    setItem(KEYS.APPLICATIONS, SEED_APPLICATIONS);
    setItem(KEYS.MEMBERS, SEED_MEMBERS);
    setItem(KEYS.AUDIT_LOGS, SEED_AUDIT_LOGS);
  },
};
