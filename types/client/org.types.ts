export interface LeadershipMember {
  id: string;
  name: string;
  role: string;
  division: string;
  avatarUrl: string;
  order: number;
  contactEmail?: string;
  socials?: {
    instagram?: string;
    linkedin?: string;
  };
}

export interface Commissariat {
  id: string;
  name: string;
  campus: string; // e.g. "Universitas Muhammadiyah Malang", "Universitas Brawijaya", etc.
  address: string;
  leaderName: string;
  memberCount: number;
  socialInstagram?: string;
}

