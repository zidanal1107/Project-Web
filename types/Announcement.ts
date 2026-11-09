// types/announcement.ts

export const ANNOUNCEMENT_STATUSES = ["draft", "published", "archived"] as const;
export type AnnouncementStatus = (typeof ANNOUNCEMENT_STATUSES)[number];

// Sesuai baris di database (hasil query tabel announcement)
export interface Announcement {
    id: number;
    title: string;
    content: string;
    status: AnnouncementStatus;
    createdAt: Date;
    publishAt: Date | null; // null kalau belum dijadwalkan
    organizationId: number;
    categoryId: number;
    adminId: number;
}

// Hasil JOIN, dipakai untuk tampilan (list/detail)
export interface AnnouncementWithRelations extends Announcement {
    category: {
        id: number;
        name: string;
    };
    admin: {
        id: number;
        email: string;
    };
}

// Input dari form / request body
export type CreateAnnouncementInput = Pick<
    Announcement,
    "title" | "content" | "status" | "categoryId"
> & {
    publishAt?: Date | null;
};

export type UpdateAnnouncementInput = Partial<CreateAnnouncementInput>;

export type GetAllFilter = {
    category_id?: number;
    status?: string;
};

export type CreateAnnouncementData = {
  title: string;
  content?: string | null;
  status: AnnouncementStatus;
  categoryId: number;
  publishAt?: Date | null;
};

export type UpdateAnnouncementData = {
  title: string;
  content?: string | null;
  status: AnnouncementStatus;
  categoryId: number;
  publishAt?: Date | null;
};