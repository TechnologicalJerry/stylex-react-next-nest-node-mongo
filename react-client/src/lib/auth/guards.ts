import { AuthSession, UserRole } from "./types";

export const canAccessRole = (session: AuthSession | null, role: UserRole): boolean => {
  if (!session) {
    return false;
  }

  return session.role === role;
};

export const isSessionActive = (session: AuthSession | null): boolean => {
  if (!session) {
    return false;
  }

  return session.status === "active";
};
