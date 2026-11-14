export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',   // backend belum dibuat
    LOGOUT: '/auth/logout', // backend belum dibuat
    ME: '/auth/me',         // backend belum dibuat
  },
  ANNOUNCEMENTS: {
    LIST: '/announcements',
    DETAIL: (id: string) => `/announcements/${id}`,
    CREATE: '/announcements',
    UPDATE: (id: string) => `/announcements/${id}`,
    DELETE: (id: string) => `/announcements/${id}`,
  },
  CATEGORIES: {
    LIST: '/categories',
  },
  EVENTS: {
    LIST: '/events',
    DETAIL: (id: string) => `/events/${id}`,
    CREATE: '/events',
    UPDATE: (id: string) => `/events/${id}`,
    DELETE: (id: string) => `/events/${id}`,
  },
  ORGANIZATION: {
    PROFILE: '/organization', // GET dan PUT
  },
  DEPARTMENTS: {
    LIST: '/departments',
  },
  MEMBER_APPLICATIONS: {
    LIST: '/member-applications',
    CREATE: '/member-applications', // pendaftaran publik
    APPROVE: (id: string) => `/member-applications/${id}/approve`,
    REJECT: (id: string) => `/member-applications/${id}/reject`,
  },
  MEMBERS: {
    LIST: '/members',
  },
  AUDIT_LOGS: {
    LIST: '/audit-logs',
  },
} as const;