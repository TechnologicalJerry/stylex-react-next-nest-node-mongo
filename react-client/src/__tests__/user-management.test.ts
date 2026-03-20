import {
  createUser,
  deleteUser,
  toggleUserStatus,
  updateUser,
} from "@/lib/admin/user-management";
import { User } from "@/lib/auth/types";

const makeUsers = (): User[] => [
  {
    id: "admin-1",
    name: "Admin",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    status: "active",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "user-1",
    name: "User",
    email: "user@example.com",
    password: "user123",
    role: "user",
    status: "active",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

describe("user-management", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("creates user", () => {
    const next = createUser(makeUsers(), {
      name: "A",
      email: "a@example.com",
      password: "123456",
      role: "user",
      status: "active",
    });

    expect(next).toHaveLength(3);
    expect(next.some((item) => item.email === "a@example.com")).toBe(true);
  });

  it("updates user role", () => {
    const next = updateUser(makeUsers(), "user-1", {
      name: "User",
      email: "user@example.com",
      role: "admin",
      status: "active",
    });

    expect(next.find((item) => item.id === "user-1")?.role).toBe("admin");
  });

  it("toggles user status", () => {
    const next = toggleUserStatus(makeUsers(), "user-1");
    expect(next.find((item) => item.id === "user-1")?.status).toBe("inactive");
  });

  it("does not allow self delete", () => {
    expect(() => deleteUser(makeUsers(), "admin-1", "admin-1")).toThrow();
  });
});
