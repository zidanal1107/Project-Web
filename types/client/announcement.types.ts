export type AnnouncementCategory = 'instruksi' | 'edaran' | 'berita' | 'siaran-pers';

export interface Announcement {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: AnnouncementCategory;
  author: string;
  authorRole: string;
  publishedAt: string;
  isPinned?: boolean;
  coverImage?: string;
  attachments?: {
    name: string;
    url: string;
    size: string;
  }[];
}

