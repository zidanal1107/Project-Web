export type GetFilter = {
    name?: string;
};

export type UpdateOrganizationData = {
    name: string;
    description: string;
    vision?: string | null;
    mission?: string | null;
    email: string;
    logoUrl: string;
};

export type Actor = {
    adminId: bigint;
    email: string;
    organizationId: bigint;
};