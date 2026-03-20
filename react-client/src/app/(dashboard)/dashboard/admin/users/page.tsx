import UsersCrud from "@/components/admin/UsersCrud";
import ProtectedRoute from "@/components/dashboard/ProtectedRoute";

export default function AdminUsersPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <UsersCrud />
    </ProtectedRoute>
  );
}
