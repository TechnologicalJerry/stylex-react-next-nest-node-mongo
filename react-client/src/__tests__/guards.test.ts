import { canAccessRole, isSessionActive } from "@/lib/auth/guards";
import { AuthSession } from "@/lib/auth/types";

const session: AuthSession = {
  userId: "1",
  name: "Admin",
  email: "admin@example.com",
  role: "admin",
  status: "active",
};

describe("auth guards", () => {
  it("checks role access", () => {
    expect(canAccessRole(session, "admin")).toBe(true);
    expect(canAccessRole(session, "user")).toBe(false);
  });

  it("checks active status", () => {
    expect(isSessionActive(session)).toBe(true);
    expect(isSessionActive({ ...session, status: "inactive" })).toBe(false);
  });
});
