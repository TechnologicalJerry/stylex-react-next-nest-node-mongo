import {
  AuthResult,
  AuthSession,
  ForgotPasswordInput,
  LoginInput,
  SignupInput,
  User,
} from "./types";
import {
  clearSessionRaw,
  ensureUserStore,
  getSessionRaw,
  getUsers,
  saveSessionRaw,
  saveUsers,
} from "./storage";

const SESSION_COOKIE = "app_session";
const SESSION_ROLE_COOKIE = "app_role";
const SESSION_STATUS_COOKIE = "app_status";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const setSessionCookies = (session: AuthSession): void => {
  if (typeof document === "undefined") {
    return;
  }

  const maxAge = 60 * 60 * 8;
  document.cookie = `${SESSION_COOKIE}=1; path=/; max-age=${maxAge}; samesite=lax`;
  document.cookie = `${SESSION_ROLE_COOKIE}=${session.role}; path=/; max-age=${maxAge}; samesite=lax`;
  document.cookie = `${SESSION_STATUS_COOKIE}=${session.status}; path=/; max-age=${maxAge}; samesite=lax`;
};

const clearSessionCookies = (): void => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; samesite=lax`;
  document.cookie = `${SESSION_ROLE_COOKIE}=; path=/; max-age=0; samesite=lax`;
  document.cookie = `${SESSION_STATUS_COOKIE}=; path=/; max-age=0; samesite=lax`;
};

const toSession = (user: User): AuthSession => ({
  userId: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
});

export const getCurrentSession = (): AuthSession | null => {
  const raw = getSessionRaw();
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
};

export const login = (input: LoginInput): AuthResult => {
  ensureUserStore();
  const users = getUsers();
  const email = normalizeEmail(input.email);

  const user = users.find((item) => normalizeEmail(item.email) === email);
  if (!user || user.password !== input.password) {
    return { success: false, message: "Invalid email or password." };
  }

  if (user.status !== "active") {
    return { success: false, message: "Account is inactive. Contact admin." };
  }

  const session = toSession(user);
  saveSessionRaw(JSON.stringify(session));
  setSessionCookies(session);

  return {
    success: true,
    message: "Login successful.",
    session,
  };
};

export const signup = (input: SignupInput): AuthResult => {
  ensureUserStore();
  const users = getUsers();
  const email = normalizeEmail(input.email);

  const exists = users.some((item) => normalizeEmail(item.email) === email);
  if (exists) {
    return { success: false, message: "Email already exists." };
  }

  const now = new Date().toISOString();
  const user: User = {
    id: `user-${Date.now()}`,
    name: input.name.trim(),
    email,
    password: input.password,
    role: "user",
    status: "active",
    createdAt: now,
    updatedAt: now,
  };

  const nextUsers = [...users, user];
  saveUsers(nextUsers);

  return {
    success: true,
    message: "Signup successful. You can now login.",
  };
};

export const forgotPassword = (input: ForgotPasswordInput): AuthResult => {
  ensureUserStore();
  const users = getUsers();
  const email = normalizeEmail(input.email);

  const exists = users.some((item) => normalizeEmail(item.email) === email);
  if (!exists) {
    return {
      success: false,
      message: "No account found for that email.",
    };
  }

  return {
    success: true,
    message: "Reset link sent (simulated). Please check your email.",
  };
};

export const logout = (): void => {
  clearSessionRaw();
  clearSessionCookies();
};
