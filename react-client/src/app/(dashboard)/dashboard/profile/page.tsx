"use client";

import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { session } = useAuth();

  return (
    <section className="card">
      <h1>Profile</h1>
      <p className="muted">Your account details and current status.</p>
      <div className="stack">
        <p>
          <strong>Name:</strong> {session?.name}
        </p>
        <p>
          <strong>Email:</strong> {session?.email}
        </p>
        <p>
          <strong>Role:</strong> {session?.role}
        </p>
        <p>
          <strong>Status:</strong> {session?.status}
        </p>
      </div>
    </section>
  );
}
