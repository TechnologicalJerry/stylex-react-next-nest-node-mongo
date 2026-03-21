"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/constants/routes";
import { UserRole } from "@/lib/auth/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const { isLoading, isAuthenticated, session } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated || !session) {
      router.replace(ROUTES.login);
      return;
    }

    if (session.status !== "active") {
      router.replace(ROUTES.login);
      return;
    }

    if (requiredRole && session.role !== requiredRole) {
      router.replace(ROUTES.dashboard);
    }
  }, [isLoading, isAuthenticated, session, requiredRole, router]);

  if (isLoading) {
    return <p className="loading">Loading...</p>;
  }

  if (!isAuthenticated || !session) {
    return <p className="loading">Redirecting...</p>;
  }

  if (requiredRole && session.role !== requiredRole) {
    return <p className="loading">Not authorized.</p>;
  }

  return <>{children}</>;
}
