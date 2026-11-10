export const MEMBER_STATUSES = ["ACTIVE", "INACTIVE"] as const;
export type MemberStatus = (typeof MEMBER_STATUSES)[number];

export type GetAllFilter = {
    search?: string;
    organizationId: bigint;
    page: number;
    limit: number;
};