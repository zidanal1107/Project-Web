import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '@/services/client/modules/event.service';
import type { Event } from '@/types/client/schema.types';
import { AUDIT_QUERY_KEY } from './useAudit';

export const EVENTS_QUERY_KEY = 'events';

export function useEvents() {
  return useQuery({
    queryKey: [EVENTS_QUERY_KEY],
    queryFn: () => eventService.getEvents(),
    select: (res) => res.data,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
      admin_id = 1,
    }: {
      payload: {
        title: string;
        description: string;
        location: string;
        start_at: string;
        end_at: string;
        status?: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
      };
      admin_id?: number;
    }) => eventService.createEvent(payload, admin_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [AUDIT_QUERY_KEY] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
      admin_id = 1,
    }: {
      id: number;
      payload: Partial<Event>;
      admin_id?: number;
    }) => eventService.updateEvent(id, payload, admin_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [AUDIT_QUERY_KEY] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, admin_id = 1 }: { id: number; admin_id?: number }) =>
      eventService.deleteEvent(id, admin_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [AUDIT_QUERY_KEY] });
    },
  });
}
