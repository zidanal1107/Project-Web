import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/services/client/db.service';
import type { Organization } from '@/types/client/schema.types';
import { AUDIT_QUERY_KEY } from './useAudit';

export const ORG_QUERY_KEY = 'organization';

export function useOrganization() {
  return useQuery({
    queryKey: [ORG_QUERY_KEY, 'profile'],
    queryFn: () => db.getOrganization(),
    staleTime: 5 * 60_000,
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: [ORG_QUERY_KEY, 'departments'],
    queryFn: () => db.getDepartments(),
    staleTime: 5 * 60_000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: [ORG_QUERY_KEY, 'categories'],
    queryFn: () => db.getCategories(),
    staleTime: 5 * 60_000,
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Organization>) => db.updateOrganization(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORG_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [AUDIT_QUERY_KEY] });
    },
  });
}