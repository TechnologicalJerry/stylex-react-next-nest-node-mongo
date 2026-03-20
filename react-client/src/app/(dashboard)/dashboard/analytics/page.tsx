"use client";

import { useMemo } from "react";
import { getUsers } from "@/lib/auth/storage";

export default function AnalyticsPage() {
  const stats = useMemo(() => {
    const users = getUsers();
    const activeUsers = users.filter((user) => user.status === "active").length;
    const adminCount = users.filter((user) => user.role === "admin").length;

    return {
      totalUsers: users.length,
      activeUsers,
      inactiveUsers: users.length - activeUsers,
      adminCount,
    };
  }, []);

  return (
    <section className="card">
      <h1>Analytics</h1>
      <p className="muted">Basic account analytics snapshot.</p>
      <div className="metricsGrid">
        <article className="metricCard">
          <h2>{stats.totalUsers}</h2>
          <p>Total Users</p>
        </article>
        <article className="metricCard">
          <h2>{stats.activeUsers}</h2>
          <p>Active Users</p>
        </article>
        <article className="metricCard">
          <h2>{stats.inactiveUsers}</h2>
          <p>Inactive Users</p>
        </article>
        <article className="metricCard">
          <h2>{stats.adminCount}</h2>
          <p>Admins</p>
        </article>
      </div>
    </section>
  );
}
