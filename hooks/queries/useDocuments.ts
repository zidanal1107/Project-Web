import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '@/services/client/modules/document.service';
import type { OrgDocument } from '@/types/client/document.types';

export const DOCUMENTS_QUERY_KEY = 'documents';

export function useDocuments(params?: { category?: string; search?: string }) {
  return useQuery({
    queryKey: [DOCUMENTS_QUERY_KEY, params],
    queryFn: () => documentService.getDocuments(params),
    select: (res) => res.data,
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<OrgDocument>) => documentService.uploadDocument(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENTS_QUERY_KEY] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documentService.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENTS_QUERY_KEY] });
    },
  });
}

