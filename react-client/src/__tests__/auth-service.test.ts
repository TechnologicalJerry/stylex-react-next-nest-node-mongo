import {
  forgotPassword,
  getCurrentSession,
  login,
  logout,
  signup,
} from "@/lib/auth/auth-service";

const clearCookies = () => {
  document.cookie = "app_session=; path=/; max-age=0";
  document.cookie = "app_role=; path=/; max-age=0";
  document.cookie = "app_status=; path=/; max-age=0";
};

describe("auth-service", () => {
  beforeEach(() => {
    localStorage.clear();
    clearCookies();
  });

  it("logs in active seeded user and stores session", () => {
    const result = login({ email: "user@example.com", password: "user123" });

    expect(result.success).toBe(true);
    expect(result.session?.email).toBe("user@example.com");
    expect(getCurrentSession()?.email).toBe("user@example.com");
  });

  it("rejects inactive user login", () => {
    const result = login({ email: "inactive@example.com", password: "user123" });

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/inactive/i);
  });

  it("supports signup and forgot-password flow", () => {
    const sign = signup({
      name: "New User",
      email: "new@example.com",
      password: "newuser123",
    });
    const forgot = forgotPassword({ email: "new@example.com" });

    expect(sign.success).toBe(true);
    expect(forgot.success).toBe(true);
  });

  it("clears session on logout", () => {
    login({ email: "user@example.com", password: "user123" });
    logout();

    expect(getCurrentSession()).toBeNull();
  });
});
