// 1. Organization
export interface Organization {
  organization_id: number;
  name: string;
  description: string;
  vision: string;
  mission: string;
  email: string;
  logo_url: string;
}

// 2. Department
export interface Department {
  department_id: number;
  organization_id: number;
  name: string;
  description: string;
  contact_email: string;
}

// 3. AdminUser
export interface AdminUser {
  admin_id: number;
  name: string;
  email: string;
  password_hash?: string;
  role: string;
  is_active: boolean;
}

// 5. Category
export interface Category {
  category_id: number;
  name: string;
  description: string;
}

// 4. Announcement
export type AnnouncementStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';

export interface Announcement {
  announcement_id: number;
  organization_id: number;
  category_id: number;
  created_by: number; // references admin_id
  title: string;
  content: string;
  status: AnnouncementStatus;
  created_at: string; // ISO DATETIME
  published_at: string | null;
  // joined fields for UI convenience:
  category_name?: string;
  author_name?: string;
}

// 6. Event
export type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export interface Event {
  event_id: number;
  organization_id: number;
  created_by: number; // references admin_id
  title: string;
  description: string;
  location: string;
  start_at: string; // ISO DATETIME
  end_at: string;   // ISO DATETIME
  status: EventStatus;
  // joined fields for UI:
  author_name?: string;
}

// 7. MemberApplication
export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface MemberApplication {
  application_id: number;
  organization_id: number;
  reviewed_by: number | null; // references admin_id
  full_name: string;
  email: string;
  phone: string;
  submitted_at: string; // ISO DATETIME
  status: ApplicationStatus;
  // joined fields for UI:
  reviewer_name?: string;
}

// 8. Member
export type MemberStatus = 'ACTIVE' | 'INACTIVE' | 'ALUMNI';

export interface Member {
  member_id: number;
  application_id: number;
  member_number: string; // e.g. NIA-2026-001
  joined_at: string;     // ISO DATETIME
  status: MemberStatus;
  // joined fields for UI:
  full_name?: string;
  email?: string;
  phone?: string;
}

// 9. AuditLog
export type AuditAction =
  | 'ANNOUNCEMENT_CREATED'
  | 'ANNOUNCEMENT_UPDATED'
  | 'ANNOUNCEMENT_DELETED'
  | 'ANNOUNCEMENT_PUBLISHED'
  | 'EVENT_CREATED'
  | 'EVENT_UPDATED'
  | 'EVENT_DELETED'
  | 'APPLICATION_SUBMITTED'
  | 'APPLICATION_APPROVED'
  | 'APPLICATION_REJECTED'
  | 'DEPARTMENT_UPDATED';

export interface AuditLog {
  audit_id: number;
  admin_id: number | null;
  action: AuditAction | string;
  entity_type: 'Announcement' | 'Event' | 'MemberApplication' | 'Member' | 'Department' | 'Organization';
  entity_id: number;
  created_at: string; // ISO DATETIME
  details: string | null;
  // joined fields for UI:
  admin_name?: string;
}

