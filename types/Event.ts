export type GetAllFilter = {
  location?: string;
  status?: string;
  page: number;
  limit: number;
};

export const EVENT_STATUSES = ["upcoming", "ongoing", "done", "cancelled"] as const;
export type EventStatus = (typeof EVENT_STATUSES)[number];

export type CreateEventData = {
  title: string;
  description: string;
  location: string;
  startAt?: Date | null;
  endAt: Date;
  status: EventStatus;
};

export type UpdateEventData = CreateEventData;