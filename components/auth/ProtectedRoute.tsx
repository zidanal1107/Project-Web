"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types/client/auth.types";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const isAuthorized =
    !isLoading &&
    isAuthenticated &&
    Boolean(user) &&
    (!allowedRoles || (user ? allowedRoles.includes(user.role) : false));

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.replace("/login");
    } else if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}