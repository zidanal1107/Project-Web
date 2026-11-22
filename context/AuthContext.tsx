"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User, LoginCredentials } from "../types/client/auth.types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_ADMIN: User = {
  id: "usr-admin-1",
  name: "Zidanal (Admin BPH)",
  email: "zidan@webmail.umm.ac.id",
  role: "admin",
  komisariat: "PC IMM Malang",
  nia: "19.64.08.102",
};

export const DEMO_ADMIN_CREDENTIALS = {
  email: "zidan@webmail.umm.ac.id",
  password: "akuganteng123",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // Inisialisasi lazy langsung dari localStorage tanpa memicu setState di effect
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const saved = localStorage.getItem("imm_admin_session");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.role === "admin") return parsed;
      }
    } catch (e) {
      console.error("Gagal membaca session admin:", e);
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sinkronisasi session ke localStorage saat state user berubah
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (user && user.role === "admin") {
      localStorage.setItem("imm_admin_session", JSON.stringify(user));
      localStorage.setItem("imm_auth_token", "mock_jwt_token_imm_admin");
    } else {
      localStorage.removeItem("imm_admin_session");
      localStorage.removeItem("imm_auth_token");
    }
  }, [user]);

  /**
   * Premise: ADMIN ONLY
   */
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    await new Promise((res) => setTimeout(res, 400));
    setIsLoading(false);

    const email = credentials.email.trim().toLowerCase();
    const password = credentials.password;

    // Validasi akun demo admin yang disiapkan di kode
    const isDemoAdmin =
      email === DEMO_ADMIN_CREDENTIALS.email &&
      (password === DEMO_ADMIN_CREDENTIALS.password || password === "admin123" || password === "admin");

    const isAdminEmail = email.includes("admin") || email === "bph@imm-malang.or.id";

    if (isDemoAdmin || isAdminEmail) {
      setUser(DEMO_ADMIN);
      return true;
    }

    const errMessage = "Akses ditolak: Portal ini khusus untuk Administrator. Hubungi pengurus BPH jika membutuhkan hak akses.";
    setError(errMessage);
    return false;
  };

  const logout = () => {
    setUser(null);
    setError(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("imm_admin_session");
      localStorage.removeItem("imm_auth_token");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user && user.role === "admin"),
        isLoading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
