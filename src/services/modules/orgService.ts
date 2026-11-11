import type { ApiResponse } from '@/types/api.types';
import type { Organization, Department, Category } from '@/types/schema.types';
import { db } from '@/services/db.service';
import { apiClient } from '@/services/api.client';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

export const orgService = {
  async getOrganization(): Promise<ApiResponse<Organization>> {
    if (!USE_MOCK) {
      const res = await apiClient.get<ApiResponse<Organization>>('/organization');
      return res.data;
    }

    await new Promise((res) => setTimeout(res, 150));
    return {
      success: true,
      message: 'Profil organisasi berhasil dimuat',
      data: db.getOrganization(),
    };
  },

  async updateOrganization(data: Partial<Organization>, admin_id: number = 1): Promise<ApiResponse<Organization>> {
    if (!USE_MOCK) {
      const res = await apiClient.put<ApiResponse<Organization>>('/organization', data);
      return res.data;
    }

    await new Promise((res) => setTimeout(res, 250));
    const updated = db.updateOrganization(data, admin_id);
    return {
      success: true,
      message: 'Profil organisasi berhasil diperbarui',
      data: updated,
    };
  },

  async getDepartments(): Promise<ApiResponse<Department[]>> {
    if (!USE_MOCK) {
      const res = await apiClient.get<ApiResponse<Department[]>>('/departments');
      return res.data;
    }

    await new Promise((res) => setTimeout(res, 150));
    return {
      success: true,
      message: 'Daftar bidang/departemen berhasil dimuat',
      data: db.getDepartments(),
    };
  },

  async getCategories(): Promise<ApiResponse<Category[]>> {
    if (!USE_MOCK) {
      const res = await apiClient.get<ApiResponse<Category[]>>('/categories');
      return res.data;
    }

    await new Promise((res) => setTimeout(res, 150));
    return {
      success: true,
      message: 'Kategori pengumuman berhasil dimuat',
      data: db.getCategories(),
    };
  },
};
