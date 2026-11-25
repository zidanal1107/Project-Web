export interface SystemActor {
  adminId: bigint;
  email: string;
  organizationId: bigint;
}

export interface CreateMemberApplicationData {
  fullName: string;
  email: string;
  phoneNumber: string;

  tempatLahir: string;
  tanggalLahir: Date;
  jenisKelamin: string;
  agama: string;

  jurusan: string;
  angkatan: string;

  akunIg?: string | null;
  hobi: string;

  alamatAsal: string;
  alamatMalang: string;

  riwayatPendidikan: string;
  pengalamanOrganisasi?: string | null;

  riwayatPenyakit?: string | null;
  minatBakat: string;
  motivasi: string;

  sumberInformasi: string;
  siapKader: boolean;
  fotoBajuUrl?: string | null;
}

export interface GetMemberApplicationsParams {
  page: number;
  limit: number;
  status?: string;
  search?: string;
  organizationId: bigint;
}