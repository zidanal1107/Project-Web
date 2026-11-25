import axios, { AxiosError } from "axios";

// Frontend dan backend satu proyek Next, jadi cukup alamat relatif (tanpa CORS)
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type PageMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiResponse<T> = {
  success: true;
  message?: string;
  data: T;
  meta?: PageMeta;
};

// Semua error API diseragamkan menjadi satu bentuk ini
export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string[]>;

  constructor(message: string, status: number, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // cookie sesi ikut terkirim otomatis
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Alias supaya db.service.ts bisa memakai nama `api`
export const api = apiClient;

type ErrorBody = { message?: string; errors?: Record<string, string[]> };

// Response interceptor: format error standar + deteksi sesi habis
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorBody>) => {
    if (axios.isCancel(error)) return Promise.reject(error);

    if (!error.response) {
      return Promise.reject(new ApiError("Tidak dapat terhubung ke server", 0));
    }

    const { status, data } = error.response;
    const url = error.config?.url ?? "";

    // 401 dari /auth/* (login salah, /auth/me belum login) bukan "sesi habis"
    if (status === 401 && !url.startsWith("/auth/") && typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth:unauthorized"));
    }

    return Promise.reject(
      new ApiError(data?.message ?? "Terjadi kesalahan pada server", status, data?.errors)
    );
  }
);