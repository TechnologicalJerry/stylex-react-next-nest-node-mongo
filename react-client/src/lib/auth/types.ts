export type UserRole = "user" | "admin";

export type UserStatus = "active" | "inactive";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  session?: AuthSession;
}

export interface UserStore {
  users: User[];
}
