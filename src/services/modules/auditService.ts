import type { ApiResponse } from '@/types/api.types';
import type { AuditLog } from '@/types/schema.types';
import { db } from '@/services/db.service';
import { apiClient } from '@/services/api.client';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

export const auditService = {
  async getAuditLogs(): Promise<ApiResponse<AuditLog[]>> {
    if (!USE_MOCK) {
      const res = await apiClient.get<ApiResponse<AuditLog[]>>('/audit-logs');
      return res.data;
    }

    await new Promise((res) => setTimeout(res, 200));
    return {
      success: true,
      message: 'Histori audit log berhasil diambil',
      data: db.getAuditLogs(),
    };
  },
};
