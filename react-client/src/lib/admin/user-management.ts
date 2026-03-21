import { saveUsers } from "@/lib/auth/storage";
import { User, UserRole, UserStatus } from "@/lib/auth/types";

export interface UserFormInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const createUser = (users: User[], input: UserFormInput): User[] => {
  const email = normalizeEmail(input.email);
  const exists = users.some((user) => normalizeEmail(user.email) === email);
  if (exists) {
    throw new Error("Email already exists.");
  }

  const now = new Date().toISOString();
  const user: User = {
    id: `user-${Date.now()}`,
    name: input.name.trim(),
    email,
    password: input.password,
    role: input.role,
    status: input.status,
    createdAt: now,
    updatedAt: now,
  };

  const nextUsers = [...users, user];
  saveUsers(nextUsers);
  return nextUsers;
};

export const updateUser = (
  users: User[],
  userId: string,
  input: Omit<UserFormInput, "password"> & { password?: string },
): User[] => {
  const email = normalizeEmail(input.email);
  const emailClash = users.some(
    (user) => user.id !== userId && normalizeEmail(user.email) === email,
  );

  if (emailClash) {
    throw new Error("Email already exists.");
  }

  const nextUsers = users.map((user) => {
    if (user.id !== userId) {
      return user;
    }

    return {
      ...user,
      name: input.name.trim(),
      email,
      role: input.role,
      status: input.status,
      password: input.password ? input.password : user.password,
      updatedAt: new Date().toISOString(),
    };
  });

  saveUsers(nextUsers);
  return nextUsers;
};

export const deleteUser = (users: User[], userId: string, currentUserId: string): User[] => {
  if (userId === currentUserId) {
    throw new Error("You cannot delete your own account.");
  }

  const nextUsers = users.filter((user) => user.id !== userId);
  saveUsers(nextUsers);
  return nextUsers;
};

export const toggleUserStatus = (users: User[], userId: string): User[] => {
  const nextUsers = users.map((user) => {
    if (user.id !== userId) {
      return user;
    }

    return {
      ...user,
      status: user.status === "active" ? "inactive" : "active",
      updatedAt: new Date().toISOString(),
    };
  });

  saveUsers(nextUsers);
  return nextUsers;
};
