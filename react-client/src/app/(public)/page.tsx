import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

export default function LandingPage() {
  return (
    <section className="hero">
      <p className="eyebrow">Role-based Portal</p>
      <h1>Production-ready auth and dashboard foundation</h1>
      <p>
        Secure login, signup, password reset, user/admin roles, profile status, and
        admin user management in one clean Next.js app structure.
      </p>
      <div className="row">
        <Link href={ROUTES.signup} className="btn btnPrimary">
          Get Started
        </Link>
        <Link href={ROUTES.login} className="btn btnGhost">
          Login
        </Link>
      </div>
    </section>
  );
}
