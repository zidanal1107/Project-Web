export const APPLICATION_STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export type CreateMemberApplicationData = {
    fullName: string;
    email: string;
    phoneNumber: string;
};

export type GetAllFilter = {
    status?: string;
    search?: string;
    organizationId: bigint;
    page: number;
    limit: number;
};