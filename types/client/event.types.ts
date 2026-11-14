export type EventStatus = 'upcoming' | 'ongoing' | 'completed';
export type EventType = 'perkaderan' | 'kajian' | 'rapat' | 'aksi' | 'umum';

export interface OrgEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  status: EventStatus;
  startDate: string;
  endDate?: string;
  location: string;
  isOnline: boolean;
  meetingLink?: string;
  organizer: string; // e.g. "Bidang Kader PC IMM Malang" or "Komisariat Tamaddun"
  registrationUrl?: string;
  bannerUrl?: string;
}

