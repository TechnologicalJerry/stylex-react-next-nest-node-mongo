import AppFooter from "@/components/layout/AppFooter";
import AppHeader from "@/components/layout/AppHeader";
import ProtectedRoute from "@/components/dashboard/ProtectedRoute";
import SideNav from "@/components/dashboard/SideNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="pageShell">
        <AppHeader isDashboard />
        <div className="container dashboardLayout">
          <SideNav />
          <main className="dashboardMain">{children}</main>
        </div>
        <AppFooter isDashboard />
      </div>
    </ProtectedRoute>
  );
}
