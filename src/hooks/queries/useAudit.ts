import { useQuery } from '@tanstack/react-query';
import { auditService } from '@/services/modules/auditService';

export const AUDIT_QUERY_KEY = 'audit_logs';

export function useAuditLogs() {
  return useQuery({
    queryKey: [AUDIT_QUERY_KEY],
    queryFn: () => auditService.getAuditLogs(),
    select: (res) => res.data,
  });
}

