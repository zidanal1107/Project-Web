import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { db } from '@/services/client/db.service';
import type { Announcement, AnnouncementStatus } from '@/types/client/schema.types';
import { AUDIT_QUERY_KEY } from './useAudit';

export const ANNOUNCEMENTS_QUERY_KEY = 'announcements';

type AnnouncementParams = {
  category_id?: number | 'all';
  search?: string;
  status?: AnnouncementStatus;
};

export function useAnnouncements(params: AnnouncementParams = {}) {
  const { category_id, search, status } = params;
  const categoryId = category_id === 'all' ? undefined : category_id;

  return useQuery({
    // hanya filter yang dikirim ke server; search tidak masuk key
    queryKey: [ANNOUNCEMENTS_QUERY_KEY, { status, category_id: categoryId }],
    queryFn: () => db.getAnnouncements({ status, category_id: categoryId }),
    placeholderData: keepPreviousData,
    // pencarian dilakukan di browser
    select: (items) => {
      const q = search?.trim().toLowerCase();
      if (!q) return items;
      return items.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q)
      );
    },
  });
}

export function useAnnouncementDetail(id: number) {
  return useQuery({
    queryKey: [ANNOUNCEMENTS_QUERY_KEY, 'detail', id],
    queryFn: () => db.getAnnouncementById(id),
    enabled: Boolean(id),
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
    }: {
      payload: { category_id: number; title: string; content: string; status?: AnnouncementStatus };
    }) => db.createAnnouncement(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ANNOUNCEMENTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [AUDIT_QUERY_KEY] });
    },
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<Announcement> }) =>
      db.updateAnnouncement(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ANNOUNCEMENTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [AUDIT_QUERY_KEY] });
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => db.deleteAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ANNOUNCEMENTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [AUDIT_QUERY_KEY] });
    },
  });
}