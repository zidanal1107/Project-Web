import type { ApiResponse } from "@/types/client/api.types";
import type { AuditLog } from "@/types/client/schema.types";
import { db } from "@/services/client/db.service";
import { apiClient } from "@/services/client/api.client";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export const auditService = {
  async getAuditLogs(): Promise<ApiResponse<AuditLog[]>> {
    if (!USE_MOCK) {
      const res = await apiClient.get<ApiResponse<AuditLog[]>>("/audit-logs");
      return res.data;
    }

    await new Promise((res) => setTimeout(res, 200));
    return {
      success: true,
      message: "Histori audit log berhasil diambil",
      data: db.getAuditLogs(),
    };
  },
};