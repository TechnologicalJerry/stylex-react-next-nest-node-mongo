"use client";

import { FormEvent, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUsers } from "@/lib/auth/storage";
import { User, UserRole, UserStatus } from "@/lib/auth/types";
import {
  createUser,
  deleteUser,
  toggleUserStatus,
  updateUser,
} from "@/lib/admin/user-management";

type FormState = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
};

const initialState: FormState = {
  name: "",
  email: "",
  password: "",
  role: "user",
  status: "active",
};

export default function UsersCrud() {
  const { session } = useAuth();
  const [users, setUsers] = useState<User[]>(() => getUsers());
  const [form, setForm] = useState<FormState>(initialState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  const canManage = session?.role === "admin";

  const sortedUsers = useMemo(
    () => [...users].sort((a, b) => a.email.localeCompare(b.email)),
    [users],
  );

  const resetForm = () => {
    setForm(initialState);
    setEditingId(null);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canManage) {
      return;
    }

    try {
      if (editingId) {
        const next = updateUser(users, editingId, form);
        setUsers(next);
        setMessage("User updated.");
      } else {
        const next = createUser(users, form);
        setUsers(next);
        setMessage("User created.");
      }
      resetForm();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Operation failed.");
    }
  };

  const onEdit = (user: User) => {
    setEditingId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status,
    });
    setMessage("");
  };

  const onDelete = (userId: string) => {
    if (!session) {
      return;
    }

    try {
      const next = deleteUser(users, userId, session.userId);
      setUsers(next);
      setMessage("User deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Delete failed.");
    }
  };

  const onToggleStatus = (userId: string) => {
    const next = toggleUserStatus(users, userId);
    setUsers(next);
    setMessage("User status changed.");
  };

  if (!canManage) {
    return <p className="card">Only admins can manage users.</p>;
  }

  return (
    <div className="stackLg">
      <section className="card">
        <h1>{editingId ? "Edit User" : "Create User"}</h1>
        <form className="form" onSubmit={onSubmit}>
          <label>
            Name
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
          </label>

          <label>
            Email
            <input
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              required
              type="email"
            />
          </label>

          <label>
            Password {editingId ? "(optional)" : ""}
            <input
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              required={!editingId}
              minLength={6}
              type="password"
            />
          </label>

          <label>
            Role
            <select
              value={form.role}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, role: event.target.value as UserRole }))
              }
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <label>
            Status
            <select
              value={form.status}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, status: event.target.value as UserStatus }))
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>

          <div className="row">
            <button className="btn btnPrimary" type="submit">
              {editingId ? "Update User" : "Create User"}
            </button>
            {editingId && (
              <button className="btn btnGhost" onClick={resetForm} type="button">
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <h2>Users</h2>
        {message && <p className="muted">{message}</p>}
        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                  <td>
                    <div className="row">
                      <button className="btn btnGhost" onClick={() => onEdit(user)} type="button">
                        Edit
                      </button>
                      <button
                        className="btn btnGhost"
                        onClick={() => onToggleStatus(user.id)}
                        type="button"
                      >
                        Toggle Status
                      </button>
                      <button
                        className="btn btnDanger"
                        onClick={() => onDelete(user.id)}
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
