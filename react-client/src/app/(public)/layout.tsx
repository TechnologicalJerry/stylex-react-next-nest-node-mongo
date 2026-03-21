import AppFooter from "@/components/layout/AppFooter";
import AppHeader from "@/components/layout/AppHeader";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pageShell">
      <AppHeader />
      <main className="container publicMain">{children}</main>
      <AppFooter />
    </div>
  );
}
