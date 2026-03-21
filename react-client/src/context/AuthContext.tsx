"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  forgotPassword,
  getCurrentSession,
  login,
  logout,
  signup,
} from "@/lib/auth/auth-service";
import {
  AuthResult,
  AuthSession,
  ForgotPasswordInput,
  LoginInput,
  SignupInput,
} from "@/lib/auth/types";

interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginUser: (input: LoginInput) => AuthResult;
  signupUser: (input: SignupInput) => AuthResult;
  forgotPasswordUser: (input: ForgotPasswordInput) => AuthResult;
  logoutUser: () => void;
  refreshSession: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(() => {
    setSession(getCurrentSession());
  }, []);

  useEffect(() => {
    refreshSession();
    setIsLoading(false);
  }, [refreshSession]);

  const loginUser = (input: LoginInput): AuthResult => {
    const result = login(input);
    if (result.success) {
      setSession(result.session ?? null);
    }
    return result;
  };

  const signupUser = (input: SignupInput): AuthResult => signup(input);

  const forgotPasswordUser = (input: ForgotPasswordInput): AuthResult =>
    forgotPassword(input);

  const logoutUser = () => {
    logout();
    setSession(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      isLoading,
      loginUser,
      signupUser,
      forgotPasswordUser,
      logoutUser,
      refreshSession,
    }),
    [isLoading, session, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
