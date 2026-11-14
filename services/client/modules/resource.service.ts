import type { ApiResponse } from "@/types/client/api.types";
import type { LearningResource } from "@/types/client/resource.types";
import { MOCK_RESOURCES } from "@/services/client/mock/resources.mock";

const USE_MOCK = true;

export const resourceService = {
  async getResources(params?: {
    category?: string;
    search?: string;
  }): Promise<ApiResponse<LearningResource[]>> {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 350));
      let filtered = [...MOCK_RESOURCES];

      if (params?.category && params.category !== "all") {
        filtered = filtered.filter((r) => r.category === params.category);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.title.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q) ||
            r.author.toLowerCase().includes(q)
        );
      }

      return {
        success: true,
        message: "Sumber belajar berhasil dimuat",
        data: filtered,
        meta: {
          currentPage: 1,
          totalPages: 1,
          totalItems: filtered.length,
          limit: 10,
        },
      };
    }
    throw new Error("Endpoint not implemented");
  },
};