import AppFooter from "@/components/layout/AppFooter";
import AppHeader from "@/components/layout/AppHeader";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pageShell">
      <AppHeader />
      <main className="container authMain">{children}</main>
      <AppFooter />
    </div>
  );
}
