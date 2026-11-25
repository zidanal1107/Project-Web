import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/services/client/db.service';
import type { MemberApplication } from '@/types/client/schema.types';
import { AUDIT_QUERY_KEY } from './useAudit';

export const APPLICATIONS_QUERY_KEY = 'member_applications';
export const MEMBERS_QUERY_KEY = 'members';

type ApplicationParams = {
  status?: MemberApplication['status'];
  search?: string;
};

// Khusus admin
export function useMemberApplications(params: ApplicationParams = {}) {
  const { status, search } = params;

  return useQuery({
    queryKey: [APPLICATIONS_QUERY_KEY, { status, search }],
    queryFn: () => db.getMemberApplications({ status, search }),
  });
}

// Khusus admin
export function useMembers(params: { search?: string } = {}) {
  const { search } = params;

  return useQuery({
    queryKey: [MEMBERS_QUERY_KEY, { search }],
    queryFn: () => db.getMembers({ search }),
  });
}

// Publik: pendaftaran tanpa login
export function useSubmitApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      full_name: string;
      email: string;
      phone: string;
      details?: Record<string, unknown>;
    }) => db.submitMemberApplication(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APPLICATIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [AUDIT_QUERY_KEY] });
    },
  });
}

export function useApproveApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ application_id }: { application_id: number }) =>
      db.approveMemberApplication(application_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APPLICATIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [MEMBERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [AUDIT_QUERY_KEY] });
    },
  });
}

export function useRejectApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      application_id,
      reason,
    }: {
      application_id: number;
      reason?: string;
    }) => db.rejectMemberApplication(application_id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APPLICATIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [AUDIT_QUERY_KEY] });
    },
  });
}