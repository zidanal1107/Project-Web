import type { ApiResponse } from '@/types/api.types';
import type { Event } from '@/types/schema.types';
import { db } from '@/services/db.service';
import { apiClient } from '@/services/api.client';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

export const eventService = {
  async getEvents(): Promise<ApiResponse<Event[]>> {
    if (!USE_MOCK) {
      const res = await apiClient.get<ApiResponse<Event[]>>('/events');
      return res.data;
    }

    await new Promise((res) => setTimeout(res, 200));
    return {
      success: true,
      message: 'Data agenda berhasil dimuat',
      data: db.getEvents(),
    };
  },

  async createEvent(
    payload: {
      title: string;
      description: string;
      location: string;
      start_at: string;
      end_at: string;
      status?: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
    },
    admin_id: number = 1
  ): Promise<ApiResponse<Event>> {
    if (!USE_MOCK) {
      const res = await apiClient.post<ApiResponse<Event>>('/events', payload);
      return res.data;
    }

    await new Promise((res) => setTimeout(res, 250));
    const created = db.createEvent(payload, admin_id);
    return {
      success: true,
      message: 'Agenda berhasil dijadwalkan dan dicatat ke Audit Log',
      data: created,
    };
  },

  async updateEvent(
    id: number,
    payload: Partial<Event>,
    admin_id: number = 1
  ): Promise<ApiResponse<Event>> {
    if (!USE_MOCK) {
      const res = await apiClient.put<ApiResponse<Event>>(`/events/${id}`, payload);
      return res.data;
    }

    await new Promise((res) => setTimeout(res, 250));
    const updated = db.updateEvent(id, payload, admin_id);
    return {
      success: true,
      message: 'Agenda berhasil diperbarui dan dicatat ke Audit Log',
      data: updated,
    };
  },

  async deleteEvent(id: number, admin_id: number = 1): Promise<ApiResponse<null>> {
    if (!USE_MOCK) {
      const res = await apiClient.delete<ApiResponse<null>>(`/events/${id}`);
      return res.data;
    }

    await new Promise((res) => setTimeout(res, 200));
    db.deleteEvent(id, admin_id);
    return {
      success: true,
      message: 'Agenda berhasil dihapus dan dicatat ke Audit Log',
      data: null,
    };
  },
};
