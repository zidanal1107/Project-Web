import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { announcementService } from '@/services/modules/announcementService';
import type { Announcement, AnnouncementStatus } from '@/types/schema.types';
import { AUDIT_QUERY_KEY } from './useAudit';

export const ANNOUNCEMENTS_QUERY_KEY = 'announcements';

export function useAnnouncements(params?: { category_id?: number | 'all'; search?: string; status?: string }) {
  return useQuery({
    queryKey: [ANNOUNCEMENTS_QUERY_KEY, params],
    queryFn: () => announcementService.getAnnouncements(params),
    select: (res) => res.data,
  });
}

export function useAnnouncementDetail(id: number) {
  return useQuery({
    queryKey: [ANNOUNCEMENTS_QUERY_KEY, 'detail', id],
    queryFn: () => announcementService.getAnnouncementById(id),
    select: (res) => res.data,
    enabled: Boolean(id),
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
      admin_id = 1,
    }: {
      payload: { category_id: number; title: string; content: string; status?: AnnouncementStatus };
      admin_id?: number;
    }) => announcementService.createAnnouncement(payload, admin_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ANNOUNCEMENTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [AUDIT_QUERY_KEY] });
    },
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
      admin_id = 1,
    }: {
      id: number;
      payload: Partial<Announcement>;
      admin_id?: number;
    }) => announcementService.updateAnnouncement(id, payload, admin_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ANNOUNCEMENTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [AUDIT_QUERY_KEY] });
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, admin_id = 1 }: { id: number; admin_id?: number }) =>
      announcementService.deleteAnnouncement(id, admin_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ANNOUNCEMENTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [AUDIT_QUERY_KEY] });
    },
  });
}
