"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/constants/routes";

export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = loginUser({ email, password });
    setMessage(result.message);

    if (result.success) {
      router.push(ROUTES.dashboard);
    }
  };

  return (
    <AuthCard
      title="Login"
      subtitle="Welcome back. Access your dashboard."
      helperText="No account?"
      helperLinkLabel="Sign up"
      helperLinkHref={ROUTES.signup}
    >
      <form onSubmit={onSubmit} className="form">
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
          />
        </label>
        <button type="submit" className="btn btnPrimary">
          Login
        </button>
      </form>
      <p className="muted">{message}</p>
      <p className="helperRow">
        <Link href={ROUTES.forgotPassword}>Forgot password?</Link>
      </p>
      <p className="muted">
        Demo admin: admin@example.com / admin123. Demo user: user@example.com / user123.
      </p>
    </AuthCard>
  );
}
