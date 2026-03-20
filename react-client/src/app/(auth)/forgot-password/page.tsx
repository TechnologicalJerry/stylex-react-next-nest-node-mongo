"use client";

import { FormEvent, useState } from "react";
import AuthCard from "@/components/auth/AuthCard";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/constants/routes";

export default function ForgotPasswordPage() {
  const { forgotPasswordUser } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = forgotPasswordUser({ email });
    setMessage(result.message);
  };

  return (
    <AuthCard
      title="Forgot Password"
      subtitle="Enter your email to receive a reset link."
      helperText="Remember your password?"
      helperLinkLabel="Back to login"
      helperLinkHref={ROUTES.login}
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
        <button type="submit" className="btn btnPrimary">
          Send reset link
        </button>
      </form>
      <p className="muted">{message}</p>
    </AuthCard>
  );
}
