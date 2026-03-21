import Link from "next/link";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  helperText?: string;
  helperLinkLabel?: string;
  helperLinkHref?: string;
}

export default function AuthCard({
  title,
  subtitle,
  children,
  helperText,
  helperLinkHref,
  helperLinkLabel,
}: AuthCardProps) {
  return (
    <section className="authSection">
      <div className="authCard">
        <h1>{title}</h1>
        <p className="muted">{subtitle}</p>
        {children}
        {helperText && helperLinkHref && helperLinkLabel && (
          <p className="helperRow">
            {helperText} <Link href={helperLinkHref}>{helperLinkLabel}</Link>
          </p>
        )}
      </div>
    </section>
  );
}
