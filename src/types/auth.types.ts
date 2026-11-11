export type UserRole = 'guest' | 'kader' | 'pimpinan' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  komisariat?: string;
  avatarUrl?: string;
  nia?: string; // Nomor Induk Anggota
}

export interface AuthSession {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

