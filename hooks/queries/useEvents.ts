import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/services/client/db.service';
import type { Event } from '@/types/client/schema.types';
import { AUDIT_QUERY_KEY } from './useAudit';

export const EVENTS_QUERY_KEY = 'events';

type EventParams = {
  status?: Event['status'];
  location?: string;
};

export function useEvents(params: EventParams = {}) {
  const { status, location } = params;

  return useQuery({
    queryKey: [EVENTS_QUERY_KEY, { status, location }],
    queryFn: () => db.getEvents({ status, location }),
  });
}

export function useEventDetail(id: number) {
  return useQuery({
    queryKey: [EVENTS_QUERY_KEY, 'detail', id],
    queryFn: () => db.getEventById(id),
    enabled: Boolean(id),
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
    }: {
      payload: {
        title: string;
        description: string;
        location: string;
        start_at: string;
        end_at: string;
        status?: Event['status'];
      };
    }) => db.createEvent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [AUDIT_QUERY_KEY] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<Event> }) =>
      db.updateEvent(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [AUDIT_QUERY_KEY] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => db.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [AUDIT_QUERY_KEY] });
    },
  });
}