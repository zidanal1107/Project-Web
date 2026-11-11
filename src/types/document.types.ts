export type DocumentCategory = 'sk' | 'pedoman' | 'administrasi' | 'modul';
export type AccessLevel = 'public' | 'kader' | 'pengurus';

export interface OrgDocument {
  id: string;
  title: string;
  description: string;
  category: DocumentCategory;
  accessLevel: AccessLevel;
  fileUrl: string;
  fileType: 'pdf' | 'docx' | 'xlsx';
  fileSize: string;
  uploadedAt: string;
  documentNumber?: string; // e.g. 012/A-1/PC-IMM/2026
  downloadCount: number;
}

