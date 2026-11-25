import { api, type ApiResponse } from './api.client';
import type {
  Organization,
  Department,
  Category,
  Announcement,
  AnnouncementStatus,
  Event,
  MemberApplication,
  Member,
  AuditLog,
} from '../../types/client/schema.types';
 
/**
 * Service data frontend: memanggil API backend (/api/v1/...).
 * Menggantikan versi lama yang memakai localStorage.
 *
 * Perbedaan penting dari versi lama:
 * - Semua method async (return Promise), pakai dengan React Query.
 * - Tidak ada parameter admin_id: admin diambil backend dari cookie sesi.
 * - Audit log dibuat oleh backend, bukan oleh frontend.
 * - Tidak ada seed data dan resetDatabase().
 */
 
// ---------------------------------------------------------------------------
// Pemetaan nilai status frontend <-> backend (ubah di sini kalau nilainya beda)
// ---------------------------------------------------------------------------
const EVENT_STATUS_TO_API: Record<string, string> = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'done',
  CANCELLED: 'cancelled',
};
const EVENT_STATUS_FROM_API: Record<string, string> = Object.fromEntries(
  Object.entries(EVENT_STATUS_TO_API).map(([front, back]) => [back, front])
);
 
const toApiAnnouncementStatus = (s: string) => s.toLowerCase();
const fromApiAnnouncementStatus = (s: string) => s.toUpperCase() as AnnouncementStatus;
const toApiEventStatus = (s: string) => EVENT_STATUS_TO_API[s] ?? s.toLowerCase();
const fromApiEventStatus = (s: string) =>
  (EVENT_STATUS_FROM_API[s.toLowerCase()] ?? s.toUpperCase()) as Event['status'];
 
// ---------------------------------------------------------------------------
// Bentuk respons mentah dari backend (nama field mengikuti Prisma; ID berupa string)
// ---------------------------------------------------------------------------
type Id = string;
 
type RawAnnouncement = {
  Announcement_id: Id;
  Tittle: string;
  Content: string | null;
  Status: string;
  Created_at: string;
  Publish_at: string | null;
  Organization_Organization_id: Id;
  Category_Category_id: Id;
  Category_Name: string;
  Admin_user_Admin_id: Id;
  Admin_user_Email: string;
  Category?: { Category_id: Id; Name: string };
  AdminUser?: { Admin_id: Id; Email: string };
};
 
type RawEvent = {
  Event_id: Id;
  Tittle: string;
  Description: string;
  Location: string;
  Start_at: string | null;
  End_at: string;
  Status: string;
  Organization_Organization_id: Id;
  Admin_user_Admin_id: Id;
  Admin_user_Email: string;
  AdminUser?: { Admin_id: Id; Email: string };
};
 
type RawApplication = {
  App_id: Id;
  Full_Name: string;
  Email: string;
  Phone_Number?: string;
  Submitted_at: string;
  Status: string;
  Organization_Organization_id?: Id;
  AdminUser?: { Admin_id: Id; Email: string } | null;
  Member?: { Member_Id: Id; Member_No: string } | null;
};
 
type RawMember = {
  Member_Id: Id;
  Member_No: string;
  Joined_at: string;
  Status: string;
  Member_app_App_id?: Id;
  MemberApp?: { Full_Name: string; Email: string; Phone_Number?: string };
};
 
type RawAuditLog = {
  Audit_id: Id;
  Action: string;
  Entity_type: string;
  Entity_id: Id;
  Created_at: string;
  Details: unknown;
  Admin_user_Admin_id: Id;
  AdminUser?: { Admin_id: Id; Email: string };
};
 
type RawOrganization = {
  Organization_id: Id;
  Name: string;
  Description: string;
  Vision: string | null;
  Mission: string | null;
  Email: string;
  Logo_url: string;
};
 
type RawDepartment = {
  Departemin_id: Id;
  Name: string;
  Description: string | null;
  Contact_email: string;
  Organization_Organization_id: Id;
};
 
type RawCategory = { Category_id: Id; Name: string; Description: string };
 
// ---------------------------------------------------------------------------
// Mapper: bentuk backend -> bentuk frontend
// ---------------------------------------------------------------------------
const mapOrganization = (r: RawOrganization): Organization => ({
  organization_id: Number(r.Organization_id),
  name: r.Name,
  description: r.Description,
  vision: r.Vision,
  mission: r.Mission,
  email: r.Email,
  logo_url: r.Logo_url,
});
 
const mapDepartment = (r: RawDepartment): Department => ({
  department_id: Number(r.Departemin_id),
  organization_id: Number(r.Organization_Organization_id),
  name: r.Name,
  description: r.Description,
  contact_email: r.Contact_email,
});
 
const mapCategory = (r: RawCategory): Category => ({
  category_id: Number(r.Category_id),
  name: r.Name,
  description: r.Description,
});
 
const mapAnnouncement = (r: RawAnnouncement): Announcement => ({
  announcement_id: Number(r.Announcement_id),
  organization_id: Number(r.Organization_Organization_id),
  category_id: Number(r.Category_Category_id),
  created_by: Number(r.Admin_user_Admin_id),
  title: r.Tittle,
  content: r.Content ?? '',
  status: fromApiAnnouncementStatus(r.Status),
  created_at: r.Created_at,
  published_at: r.Publish_at,
  category_name: r.Category?.Name ?? r.Category_Name,
  author_name: r.AdminUser?.Email ?? r.Admin_user_Email, // backend belum punya nama admin
});
 
const mapEvent = (r: RawEvent): Event => ({
  event_id: Number(r.Event_id),
  organization_id: Number(r.Organization_Organization_id),
  created_by: Number(r.Admin_user_Admin_id),
  title: r.Tittle,
  description: r.Description,
  location: r.Location,
  start_at: r.Start_at ?? '',
  end_at: r.End_at,
  status: fromApiEventStatus(r.Status),
  author_name: r.AdminUser?.Email ?? r.Admin_user_Email,
});
 
const mapApplication = (r: RawApplication, fallbackPhone = ''): MemberApplication => {
  const processed = r.Status !== 'PENDING' && r.AdminUser;
  return {
    application_id: Number(r.App_id),
    organization_id: Number(r.Organization_Organization_id ?? 1), // organisasi tunggal
    // Saat PENDING, kolom admin di database berisi admin sistem, bukan peninjau
    reviewed_by: processed ? Number(r.AdminUser!.Admin_id) : null,
    full_name: r.Full_Name,
    email: r.Email,
    phone: r.Phone_Number ?? fallbackPhone,
    submitted_at: r.Submitted_at,
    status: r.Status as MemberApplication['status'],
    reviewer_name: processed ? r.AdminUser!.Email : undefined,
  };
};
 
const mapMember = (r: RawMember): Member => ({
  member_id: Number(r.Member_Id),
  application_id: Number(r.Member_app_App_id ?? 0), // 0 kalau backend belum mengirim
  member_number: r.Member_No,
  joined_at: r.Joined_at,
  status: r.Status as Member['status'],
  full_name: r.MemberApp?.Full_Name,
  email: r.MemberApp?.Email,
  phone: r.MemberApp?.Phone_Number,
});
 
const mapAuditLog = (r: RawAuditLog): AuditLog => {
  // Pendaftaran publik dicatat atas nama admin sistem di database
  const isPublic = r.Action === 'APPLICATION_SUBMITTED';
  return {
    audit_id: Number(r.Audit_id),
    admin_id: isPublic ? null : Number(r.Admin_user_Admin_id),
    action: r.Action,
    entity_type: r.Entity_type as AuditLog['entity_type'],
    entity_id: Number(r.Entity_id),
    created_at: r.Created_at,
    details:
      r.Details == null
        ? null
        : typeof r.Details === 'string'
          ? r.Details
          : JSON.stringify(r.Details),
    admin_name: isPublic
      ? 'Sistem / Publik'
      : (r.AdminUser?.Email ?? `Admin #${r.Admin_user_Admin_id}`),
  };
};
 
// ---------------------------------------------------------------------------
// Helper HTTP
// ---------------------------------------------------------------------------
const PAGE_SIZE = 50; // batas maksimum yang diterima backend
const MAX_PAGES = 40; // pengaman: maksimal 2000 baris
 
type Params = Record<string, string | number | undefined>;
 
async function getBody<T>(url: string, params?: Params) {
  const res = await api.get<ApiResponse<T>>(url, { params });
  return res.data;
}
 
async function getData<T>(url: string, params?: Params): Promise<T> {
  return (await getBody<T>(url, params)).data;
}
 
async function sendData<T>(
  method: 'post' | 'put',
  url: string,
  body?: unknown
): Promise<T> {
  const res = await api.request<ApiResponse<T>>({ method, url, data: body });
  return res.data.data;
}
 
// Mengambil semua halaman dari endpoint yang berpagination
async function getAllPages<T>(url: string, params: Params = {}): Promise<T[]> {
  const items: T[] = [];
  let page = 1;
  let totalPages = 1;
 
  do {
    const body = await getBody<T[]>(url, { ...params, page, limit: PAGE_SIZE });
    items.push(...body.data);
    totalPages = body.meta?.totalPages ?? 1;
    page++;
  } while (page <= totalPages && page <= MAX_PAGES);
 
  return items;
}
 
// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------
export type CurrentAdmin = { admin_id: number; email: string };
 
export const db = {
  // 0. Auth
  async login(email: string, password: string): Promise<CurrentAdmin> {
    const data = await sendData<{ adminId: string; email: string }>('post', '/auth/login', {
      email,
      password,
    });
    return { admin_id: Number(data.adminId), email: data.email };
  },
 
  async logout(): Promise<void> {
    await sendData('post', '/auth/logout');
  },
 
  async getMe(): Promise<CurrentAdmin> {
    const data = await getData<{ adminId: string; email: string }>('/auth/me');
    return { admin_id: Number(data.adminId), email: data.email };
  },
 
  // 1. Organization
  async getOrganization(): Promise<Organization> {
    return mapOrganization(await getData<RawOrganization>('/organization'));
  },
 
  async updateOrganization(data: Partial<Organization>): Promise<Organization> {
    // Backend memakai PUT (semua field wajib), jadi gabungkan dengan data saat ini
    const current = await db.getOrganization();
    const merged = { ...current, ...data };
    const result = await sendData<RawOrganization>('put', '/organization', {
      name: merged.name,
      description: merged.description,
      vision: merged.vision,
      mission: merged.mission,
      email: merged.email,
      logo_url: merged.logo_url,
    });
    return mapOrganization(result);
  },
 
  // 2. Departments
  async getDepartments(): Promise<Department[]> {
    const rows = await getAllPages<RawDepartment>('/departments');
    return rows.map(mapDepartment);
  },
 
  // 3. Categories
  async getCategories(): Promise<Category[]> {
    const rows = await getData<RawCategory[]>('/categories');
    return rows.map(mapCategory);
  },
 
  // 4. Announcements
  async getAnnouncements(
    filter: { status?: AnnouncementStatus; category_id?: number } = {}
  ): Promise<Announcement[]> {
    const rows = await getData<RawAnnouncement[]>('/announcements', {
      status: filter.status ? toApiAnnouncementStatus(filter.status) : undefined,
      category_id: filter.category_id,
    });
    return rows.map(mapAnnouncement);
  },
 
  async getAnnouncementById(id: number): Promise<Announcement> {
    return mapAnnouncement(await getData<RawAnnouncement>(`/announcements/${id}`));
  },
 
  async createAnnouncement(payload: {
    category_id: number;
    title: string;
    content: string;
    status?: AnnouncementStatus;
  }): Promise<Announcement> {
    const status = payload.status ?? 'PUBLISHED';
    const result = await sendData<RawAnnouncement>('post', '/announcements', {
      title: payload.title,
      content: payload.content,
      status: toApiAnnouncementStatus(status),
      category_id: Number(payload.category_id),
      publish_at: status === 'DRAFT' ? null : new Date().toISOString(),
    });
    return mapAnnouncement(result);
  },
 
  async updateAnnouncement(
    announcement_id: number,
    payload: Partial<Announcement>
  ): Promise<Announcement> {
    const current = await db.getAnnouncementById(announcement_id);
    const merged = { ...current, ...payload };
    const publishedAt =
      merged.status === 'PUBLISHED' && !merged.published_at
        ? new Date().toISOString()
        : merged.published_at;
 
    const result = await sendData<RawAnnouncement>('put', `/announcements/${announcement_id}`, {
      title: merged.title,
      content: merged.content,
      status: toApiAnnouncementStatus(merged.status),
      category_id: Number(merged.category_id),
      publish_at: publishedAt,
    });
    return mapAnnouncement(result);
  },
 
  async deleteAnnouncement(announcement_id: number): Promise<void> {
    await api.delete(`/announcements/${announcement_id}`);
  },
 
  // 5. Events
  async getEvents(
    filter: { status?: Event['status']; location?: string } = {}
  ): Promise<Event[]> {
    const rows = await getAllPages<RawEvent>('/events', {
      status: filter.status ? toApiEventStatus(filter.status) : undefined,
      location: filter.location,
    });
    return rows.map(mapEvent);
  },
 
  async getEventById(id: number): Promise<Event> {
    return mapEvent(await getData<RawEvent>(`/events/${id}`));
  },
 
  async createEvent(payload: {
    title: string;
    description: string;
    location: string;
    start_at: string;
    end_at: string;
    status?: Event['status'];
  }): Promise<Event> {
    const result = await sendData<RawEvent>('post', '/events', {
      title: payload.title,
      description: payload.description,
      location: payload.location,
      start_at: payload.start_at,
      end_at: payload.end_at,
      status: toApiEventStatus(payload.status ?? 'UPCOMING'),
    });
    return mapEvent(result);
  },
 
  async updateEvent(event_id: number, payload: Partial<Event>): Promise<Event> {
    const current = await db.getEventById(event_id);
    const merged = { ...current, ...payload };
    const result = await sendData<RawEvent>('put', `/events/${event_id}`, {
      title: merged.title,
      description: merged.description,
      location: merged.location,
      start_at: merged.start_at || null,
      end_at: merged.end_at,
      status: toApiEventStatus(merged.status),
    });
    return mapEvent(result);
  },
 
  async deleteEvent(event_id: number): Promise<void> {
    await api.delete(`/events/${event_id}`);
  },
 
  // 6. Member Applications (pendaftaran publik + tinjauan admin)
  async getMemberApplications(
    filter: { status?: MemberApplication['status']; search?: string } = {}
  ): Promise<MemberApplication[]> {
    const rows = await getAllPages<RawApplication>('/member-applications', {
      status: filter.status,
      search: filter.search,
    });
    return rows.map((r) => mapApplication(r));
  },
 
  // Publik: tidak butuh login
  async submitMemberApplication(payload: {
    full_name: string;
    email: string;
    phone: string;
  }): Promise<MemberApplication> {
    const result = await sendData<RawApplication>('post', '/member-applications', {
      full_name: payload.full_name,
      email: payload.email,
      phone_number: payload.phone,
    });
    return mapApplication(result, payload.phone);
  },
 
  async approveMemberApplication(
    application_id: number
  ): Promise<{ application: MemberApplication; member: Member }> {
    const result = await sendData<{ application: RawApplication; member: RawMember }>(
      'post',
      `/member-applications/${application_id}/approve`
    );
    return {
      application: mapApplication(result.application),
      member: {
        ...mapMember(result.member),
        application_id, // diketahui dari parameter
      },
    };
  },
 
  async rejectMemberApplication(
    application_id: number,
    reason?: string
  ): Promise<MemberApplication> {
    const result = await sendData<RawApplication>(
      'post',
      `/member-applications/${application_id}/reject`,
      reason ? { reason } : {}
    );
    return mapApplication(result);
  },
 
  // 7. Members (kader aktif)
  async getMembers(filter: { search?: string } = {}): Promise<Member[]> {
    const rows = await getAllPages<RawMember>('/members', { search: filter.search });
    return rows.map(mapMember);
  },
 
  // 8. Audit log (hanya dibaca: pencatatan dilakukan backend)
  async getAuditLogs(
    filter: { action?: string; entity_type?: string; entity_id?: number } = {}
  ): Promise<AuditLog[]> {
    const rows = await getAllPages<RawAuditLog>('/audit-logs', {
      action: filter.action,
      entity_type: filter.entity_type,
      entity_id: filter.entity_id,
    });
    return rows.map(mapAuditLog);
  },
};
 