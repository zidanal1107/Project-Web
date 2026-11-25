import { useQuery } from '@tanstack/react-query';
import { db } from '@/services/client/db.service';

export const AUDIT_QUERY_KEY = 'audit_logs';

type AuditParams = {
  action?: string;
  entity_type?: string;
  entity_id?: number;
};

export function useAuditLogs(params: AuditParams = {}) {
  const { action, entity_type, entity_id } = params;

  return useQuery({
    queryKey: [AUDIT_QUERY_KEY, { action, entity_type, entity_id }],
    queryFn: () => db.getAuditLogs({ action, entity_type, entity_id }),
  });
}