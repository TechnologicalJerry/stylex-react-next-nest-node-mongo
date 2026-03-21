"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/constants/routes";

interface AppHeaderProps {
  isDashboard?: boolean;
}

export default function AppHeader({ isDashboard = false }: AppHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, logoutUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = useMemo(() => {
    if (isDashboard) {
      return [
        { href: ROUTES.profile, label: "Profile" },
        { href: ROUTES.analytics, label: "Analytics" },
      ];
    }

    return [
      { href: ROUTES.home, label: "Home" },
      { href: ROUTES.about, label: "About" },
      { href: ROUTES.contact, label: "Contact" },
    ];
  }, [isDashboard]);

  const onLogout = () => {
    logoutUser();
    router.push(ROUTES.login);
  };

  return (
    <header className="appHeader">
      <div className="container appHeaderInner">
        <Link href={isDashboard ? ROUTES.dashboard : ROUTES.home} className="brand">
          Nova Portal
        </Link>

        <nav className="mainNav" aria-label="Main navigation">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} className={active ? "navLink active" : "navLink"}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {!isDashboard ? (
          <div className="headerActions">
            <Link href={ROUTES.login} className="btn btnGhost">
              Login
            </Link>
            <Link href={ROUTES.signup} className="btn btnPrimary">
              Sign up
            </Link>
          </div>
        ) : (
          <div className="userMenuWrap">
            <button
              className="btn btnGhost"
              onClick={() => setMenuOpen((prev) => !prev)}
              type="button"
              aria-expanded={menuOpen}
            >
              {session?.name ?? "Account"}
            </button>
            {menuOpen && (
              <div className="userMenu" role="menu">
                <p className="userMenuItem muted">Status: {session?.status ?? "inactive"}</p>
                <Link href={ROUTES.profile} className="userMenuItem" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
                <button type="button" className="userMenuItem linkLike" onClick={onLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
