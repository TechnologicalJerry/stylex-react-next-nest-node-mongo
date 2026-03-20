"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/constants/routes";

export default function SignupPage() {
  const router = useRouter();
  const { signupUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const result = signupUser({ name, email, password });
    setMessage(result.message);

    if (result.success) {
      router.push(ROUTES.login);
    }
  };

  return (
    <AuthCard
      title="Sign Up"
      subtitle="Create your account to continue."
      helperText="Already have an account?"
      helperLinkLabel="Login"
      helperLinkHref={ROUTES.login}
    >
      <form onSubmit={onSubmit} className="form">
        <label>
          Name
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
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
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            minLength={6}
          />
        </label>
        <button type="submit" className="btn btnPrimary">
          Create account
        </button>
      </form>
      <p className="muted">{message}</p>
    </AuthCard>
  );
}
