import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { membershipService } from '@/services/modules/membershipService';
import { AUDIT_QUERY_KEY } from './useAudit';

export const APPLICATIONS_QUERY_KEY = 'member_applications';
export const MEMBERS_QUERY_KEY = 'members';

export function useMemberApplications() {
  return useQuery({
    queryKey: [APPLICATIONS_QUERY_KEY],
    queryFn: () => membershipService.getApplications(),
    select: (res) => res.data,
  });
}

export function useMembers() {
  return useQuery({
    queryKey: [MEMBERS_QUERY_KEY],
    queryFn: () => membershipService.getMembers(),
    select: (res) => res.data,
  });
}

export function useSubmitApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { full_name: string; email: string; phone: string }) =>
      membershipService.submitApplication(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APPLICATIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [AUDIT_QUERY_KEY] });
    },
  });
}

export function useApproveApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ application_id, admin_id = 1 }: { application_id: number; admin_id?: number }) =>
      membershipService.approveApplication(application_id, admin_id),
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
    mutationFn: ({ application_id, admin_id = 1 }: { application_id: number; admin_id?: number }) =>
      membershipService.rejectApplication(application_id, admin_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APPLICATIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [AUDIT_QUERY_KEY] });
    },
  });
}

