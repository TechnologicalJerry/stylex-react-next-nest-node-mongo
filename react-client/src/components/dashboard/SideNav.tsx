"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/constants/routes";

export default function SideNav() {
  const pathname = usePathname();
  const { session } = useAuth();

  const links = [
    { href: ROUTES.profile, label: "Profile" },
    { href: ROUTES.analytics, label: "Analytics" },
  ];

  if (session?.role === "admin") {
    links.push({ href: ROUTES.adminUsers, label: "Admin Users" });
  }

  return (
    <aside className="sideNav" aria-label="Dashboard navigation">
      <h2>Dashboard</h2>
      <ul>
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <li key={link.href}>
              <Link href={link.href} className={active ? "sideNavLink active" : "sideNavLink"}>
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
