import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

interface AppFooterProps {
  isDashboard?: boolean;
}

export default function AppFooter({ isDashboard = false }: AppFooterProps) {
  return (
    <footer className="appFooter">
      <div className="container appFooterInner">
        <p>© {new Date().getFullYear()} Nova Portal</p>
        <div className="footerLinks">
          {isDashboard ? (
            <>
              <Link href={ROUTES.profile}>Profile</Link>
              <Link href={ROUTES.analytics}>Analytics</Link>
            </>
          ) : (
            <>
              <Link href={ROUTES.home}>Home</Link>
              <Link href={ROUTES.about}>About</Link>
              <Link href={ROUTES.contact}>Contact</Link>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
