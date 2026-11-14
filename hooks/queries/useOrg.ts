import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orgService } from '@/services/client/modules/org.service';
import type { Organization } from '@/types/client/schema.types';
import { AUDIT_QUERY_KEY } from './useAudit';

export const ORG_QUERY_KEY = 'organization';

export function useOrganization() {
  return useQuery({
    queryKey: [ORG_QUERY_KEY, 'profile'],
    queryFn: () => orgService.getOrganization(),
    select: (res) => res.data,
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: [ORG_QUERY_KEY, 'departments'],
    queryFn: () => orgService.getDepartments(),
    select: (res) => res.data,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: [ORG_QUERY_KEY, 'categories'],
    queryFn: () => orgService.getCategories(),
    select: (res) => res.data,
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, admin_id = 1 }: { data: Partial<Organization>; admin_id?: number }) =>
      orgService.updateOrganization(data, admin_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORG_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [AUDIT_QUERY_KEY] });
    },
  });
}
