"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User, UserRole, LoginCredentials } from "../types/client/auth.types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEFAULT_ADMIN_USER: User = {
  id: "usr-admin-1",
  name: "Ahmad Fauzan",
  email: "admin@imm-malang.or.id",
  role: "admin",
  komisariat: "PC IMM Malang",
  nia: "19.64.08.102",
};

export const DEFAULT_MEMBER_USER: User = {
  id: "usr-kader-1",
  name: "Fauzi Ramadhan",
  email: "kader@imm-malang.or.id",
  role: "kader",
  komisariat: "PK IMM Tamaddun",
  nia: "21.64.08.455",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // 1. Jangan baca localStorage di dalam useState agar tidak error saat SSR
  const [user, setUser] = useState<User | null>(DEFAULT_ADMIN_USER);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // 2. Baca localStorage hanya setelah komponen terpasang di browser (client)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("imm_user");
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Gagal membaca data user dari localStorage:", error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // 3. Simpan perubahan ke localStorage hanya setelah proses baca awal selesai
  useEffect(() => {
    if (!isInitialized) return;

    if (user) {
      localStorage.setItem("imm_user", JSON.stringify(user));
      localStorage.setItem("imm_auth_token", "mock_jwt_token_imm_malang");
    } else {
      localStorage.removeItem("imm_user");
      localStorage.removeItem("imm_auth_token");
    }
  }, [user, isInitialized]);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));
    setIsLoading(false);

    if (credentials.email.includes("admin")) {
      setUser(DEFAULT_ADMIN_USER);
    } else {
      setUser({
        ...DEFAULT_MEMBER_USER,
        email: credentials.email,
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    if (role === "guest") {
      setUser(null);
    } else if (role === "admin" || role === "pimpinan") {
      setUser({ ...DEFAULT_ADMIN_USER, role });
    } else {
      setUser({ ...DEFAULT_MEMBER_USER, role: "kader" });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        logout,
        switchRole,
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