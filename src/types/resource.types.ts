export type ResourceCategory = 'ideopolitor' | 'kemuhammadiyahan' | 'keimman' | 'filsafat' | 'metodologi';

export interface LearningResource {
  id: string;
  title: string;
  author: string;
  category: ResourceCategory;
  description: string;
  coverImage?: string;
  downloadUrl: string;
  fileSize: string;
  pagesCount: number;
  readTime: string;
  level: 'dasar' | 'madya' | 'utama';
  downloadCount: number;
}

