import type { ApiResponse } from '@/types/api.types';
import type { MemberApplication, Member } from '@/types/schema.types';
import { db } from '@/services/db.service';
import { apiClient } from '@/services/api.client';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

export const membershipService = {
  async getApplications(): Promise<ApiResponse<MemberApplication[]>> {
    if (!USE_MOCK) {
      const res = await apiClient.get<ApiResponse<MemberApplication[]>>('/member-applications');
      return res.data;
    }

    await new Promise((res) => setTimeout(res, 200));
    return {
      success: true,
      message: 'Daftar pendaftaran anggota berhasil diambil',
      data: db.getMemberApplications(),
    };
  },

  async submitApplication(payload: {
    full_name: string;
    email: string;
    phone: string;
  }): Promise<ApiResponse<MemberApplication>> {
    if (!USE_MOCK) {
      const res = await apiClient.post<ApiResponse<MemberApplication>>('/member-applications', payload);
      return res.data;
    }

    await new Promise((res) => setTimeout(res, 300));
    const created = db.submitMemberApplication(payload);
    return {
      success: true,
      message: 'Pendaftaran anggota berhasil dikirim dan menunggu verifikasi admin',
      data: created,
    };
  },

  async approveApplication(application_id: number, admin_id: number = 1): Promise<ApiResponse<{ application: MemberApplication; member: Member }>> {
    if (!USE_MOCK) {
      const res = await apiClient.post<ApiResponse<{ application: MemberApplication; member: Member }>>(
        `/member-applications/${application_id}/approve`
      );
      return res.data;
    }

    await new Promise((res) => setTimeout(res, 300));
    const result = db.approveMemberApplication(application_id, admin_id);
    return {
      success: true,
      message: 'Pendaftaran disetujui, Nomor Anggota resmi diterbitkan, dan tercatat di Audit Log',
      data: result,
    };
  },

  async rejectApplication(application_id: number, admin_id: number = 1): Promise<ApiResponse<MemberApplication>> {
    if (!USE_MOCK) {
      const res = await apiClient.post<ApiResponse<MemberApplication>>(
        `/member-applications/${application_id}/reject`
      );
      return res.data;
    }

    await new Promise((res) => setTimeout(res, 250));
    const result = db.rejectMemberApplication(application_id, admin_id);
    return {
      success: true,
      message: 'Pendaftaran ditolak dan tercatat di Audit Log',
      data: result,
    };
  },

  async getMembers(): Promise<ApiResponse<Member[]>> {
    if (!USE_MOCK) {
      const res = await apiClient.get<ApiResponse<Member[]>>('/members');
      return res.data;
    }

    await new Promise((res) => setTimeout(res, 200));
    return {
      success: true,
      message: 'Daftar anggota resmi berhasil dimuat',
      data: db.getMembers(),
    };
  },
};
