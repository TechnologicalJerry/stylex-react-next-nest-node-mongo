import { User, UserStore } from "./types";

const USERS_KEY = "app_users_v1";
const SESSION_KEY = "app_session_v1";

const defaultUsers: User[] = [
  {
    id: "seed-admin",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-user",
    name: "Normal User",
    email: "user@example.com",
    password: "user123",
    role: "user",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-inactive-user",
    name: "Inactive User",
    email: "inactive@example.com",
    password: "user123",
    role: "user",
    status: "inactive",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const canUseStorage = () => typeof window !== "undefined";

export const ensureUserStore = (): void => {
  if (!canUseStorage()) {
    return;
  }

  const existing = localStorage.getItem(USERS_KEY);
  if (!existing) {
    const seed: UserStore = { users: defaultUsers };
    localStorage.setItem(USERS_KEY, JSON.stringify(seed));
  }
};

export const getUsers = (): User[] => {
  if (!canUseStorage()) {
    return [];
  }

  ensureUserStore();

  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as UserStore;
    return parsed.users ?? [];
  } catch {
    return [];
  }
};

export const saveUsers = (users: User[]): void => {
  if (!canUseStorage()) {
    return;
  }

  const next: UserStore = { users };
  localStorage.setItem(USERS_KEY, JSON.stringify(next));
};

export const getSessionRaw = (): string | null => {
  if (!canUseStorage()) {
    return null;
  }

  return localStorage.getItem(SESSION_KEY);
};

export const saveSessionRaw = (raw: string): void => {
  if (!canUseStorage()) {
    return;
  }

  localStorage.setItem(SESSION_KEY, raw);
};

export const clearSessionRaw = (): void => {
  if (!canUseStorage()) {
    return;
  }

  localStorage.removeItem(SESSION_KEY);
};
