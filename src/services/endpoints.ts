export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  ANNOUNCEMENTS: {
    LIST: '/announcements',
    DETAIL: (slug: string) => `/announcements/${slug}`,
    CREATE: '/announcements',
    UPDATE: (id: string) => `/announcements/${id}`,
    DELETE: (id: string) => `/announcements/${id}`,
  },
  DOCUMENTS: {
    LIST: '/documents',
    DETAIL: (id: string) => `/documents/${id}`,
    DOWNLOAD: (id: string) => `/documents/${id}/download`,
    UPLOAD: '/documents',
    DELETE: (id: string) => `/documents/${id}`,
  },
  EVENTS: {
    LIST: '/events',
    DETAIL: (id: string) => `/events/${id}`,
    CREATE: '/events',
    UPDATE: (id: string) => `/events/${id}`,
    DELETE: (id: string) => `/events/${id}`,
  },
  ORGANIZATION: {
    PROFILE: '/org/profile',
    LEADERSHIP: '/org/leadership',
    COMMISSARIATS: '/org/commissariats',
  },
} as const;

