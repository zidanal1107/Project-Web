import type { ApiResponse } from '@/types/api.types';
import type { OrgDocument, DocumentCategory } from '@/types/document.types';
import { MOCK_DOCUMENTS } from '@/services/mock/documents.mock';

const USE_MOCK = true;

export const documentService = {
  async getDocuments(params?: { category?: string; search?: string }): Promise<ApiResponse<OrgDocument[]>> {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 400));
      let filtered = [...MOCK_DOCUMENTS];

      if (params?.category && params.category !== 'all') {
        filtered = filtered.filter((d) => d.category === params.category);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (d) =>
            d.title.toLowerCase().includes(q) ||
            d.description.toLowerCase().includes(q) ||
            (d.documentNumber && d.documentNumber.toLowerCase().includes(q))
        );
      }

      return {
        success: true,
        message: 'Dokumen berhasil diambil',
        data: filtered,
        meta: {
          currentPage: 1,
          totalPages: 1,
          totalItems: filtered.length,
          limit: 10,
        },
      };
    }
    throw new Error('Endpoint not implemented');
  },

  async uploadDocument(payload: Partial<OrgDocument>): Promise<ApiResponse<OrgDocument>> {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 600));
      const newDoc: OrgDocument = {
        id: `doc-${Date.now()}`,
        title: payload.title || 'Dokumen Baru',
        description: payload.description || '',
        category: (payload.category as DocumentCategory) || 'administrasi',
        accessLevel: payload.accessLevel || 'public',
        fileUrl: payload.fileUrl || '/mock-file.pdf',
        fileType: payload.fileType || 'pdf',
        fileSize: '1.2 MB',
        uploadedAt: new Date().toISOString().split('T')[0],
        documentNumber: payload.documentNumber || `DOC/${Date.now().toString().slice(-4)}`,
        downloadCount: 0,
      };
      MOCK_DOCUMENTS.unshift(newDoc);
      return {
        success: true,
        message: 'Dokumen berhasil diunggah',
        data: newDoc,
      };
    }
    throw new Error('Endpoint not implemented');
  },

  async deleteDocument(id: string): Promise<ApiResponse<null>> {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 400));
      const idx = MOCK_DOCUMENTS.findIndex((d) => d.id === id);
      if (idx !== -1) {
        MOCK_DOCUMENTS.splice(idx, 1);
      }
      return {
        success: true,
        message: 'Dokumen berhasil dihapus',
        data: null,
      };
    }
    throw new Error('Endpoint not implemented');
  },
};

