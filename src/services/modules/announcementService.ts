import type { ApiResponse } from '@/types/api.types';
import type { Announcement, AnnouncementStatus } from '@/types/schema.types';
import { db } from '@/services/db.service';
import { apiClient } from '@/services/api.client';

// Ketika VITE_USE_MOCK bernilai 'false', request langsung diarahkan ke server Backend REST API
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

export const announcementService = {
  async getAnnouncements(params?: { category_id?: number | 'all'; search?: string; status?: string }): Promise<ApiResponse<Announcement[]>> {
    if (!USE_MOCK) {
      const res = await apiClient.get<ApiResponse<Announcement[]>>('/announcements', { params });
      return res.data;
    }

    // Mock Database fallback
    await new Promise((res) => setTimeout(res, 200));
    let data = db.getAnnouncements();

    if (params?.category_id && params.category_id !== 'all') {
      data = data.filter((a) => a.category_id === Number(params.category_id));
    }
    if (params?.status) {
      data = data.filter((a) => a.status === params.status);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      data = data.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q) ||
          (a.author_name && a.author_name.toLowerCase().includes(q))
      );
    }

    return {
      success: true,
      message: 'Data pengumuman berhasil dimuat',
      data,
    };
  },

  async getAnnouncementById(id: number): Promise<ApiResponse<Announcement>> {
    if (!USE_MOCK) {
      const res = await apiClient.get<ApiResponse<Announcement>>(`/announcements/${id}`);
      return res.data;
    }

    await new Promise((res) => setTimeout(res, 150));
    const all = db.getAnnouncements();
    const found = all.find((a) => a.announcement_id === id);
    if (!found) throw new Error('Pengumuman tidak ditemukan');

    return {
      success: true,
      message: 'Detail pengumuman berhasil dimuat',
      data: found,
    };
  },

  async createAnnouncement(
    payload: {
      category_id: number;
      title: string;
      content: string;
      status?: AnnouncementStatus;
    },
    admin_id: number = 1
  ): Promise<ApiResponse<Announcement>> {
    if (!USE_MOCK) {
      const res = await apiClient.post<ApiResponse<Announcement>>('/announcements', payload);
      return res.data;
    }

    await new Promise((res) => setTimeout(res, 250));
    const created = db.createAnnouncement(payload, admin_id);
    return {
      success: true,
      message: 'Pengumuman berhasil dibuat dan dicatat ke Audit Log',
      data: created,
    };
  },

  async updateAnnouncement(
    id: number,
    payload: Partial<Announcement>,
    admin_id: number = 1
  ): Promise<ApiResponse<Announcement>> {
    if (!USE_MOCK) {
      const res = await apiClient.put<ApiResponse<Announcement>>(`/announcements/${id}`, payload);
      return res.data;
    }

    await new Promise((res) => setTimeout(res, 250));
    const updated = db.updateAnnouncement(id, payload, admin_id);
    return {
      success: true,
      message: 'Pengumuman berhasil diperbarui dan dicatat ke Audit Log',
      data: updated,
    };
  },

  async deleteAnnouncement(id: number, admin_id: number = 1): Promise<ApiResponse<null>> {
    if (!USE_MOCK) {
      const res = await apiClient.delete<ApiResponse<null>>(`/announcements/${id}`);
      return res.data;
    }

    await new Promise((res) => setTimeout(res, 200));
    db.deleteAnnouncement(id, admin_id);
    return {
      success: true,
      message: 'Pengumuman berhasil dihapus dan dicatat ke Audit Log',
      data: null,
    };
  },
};
