import { useQuery } from '@tanstack/react-query';
import { resourceService } from '@/services/modules/resourceService';

export const RESOURCES_QUERY_KEY = 'learning_resources';

export function useResources(params?: { category?: string; search?: string }) {
  return useQuery({
    queryKey: [RESOURCES_QUERY_KEY, params],
    queryFn: () => resourceService.getResources(params),
    select: (res) => res.data,
  });
}

