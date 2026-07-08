// SERVER component - footer. Real link groups, an honest compliance/trust line,
// and an honest "built by [founder]" placeholder. No fake badges, no invented
// counts (M00 §7).
import Link from 'next/link';
import { Wordmark } from './wordmark';
import { APP_NAME, FOOTER_GROUPS, FOUNDER_NAME } from '@/lib/site';

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-canvas">
      <div className="shell grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Wordmark />
          <p className="mt-4 text-body-sm text-muted">
            Find the right local businesses, reach out like your best salesperson wrote each
            email, and stay out of spam - one tool, pay for what you use.
          </p>
        </div>

        {FOOTER_GROUPS.map((group) => (
          <nav key={group.heading} aria-label={group.heading}>
            <h2 className="text-eyebrow uppercase text-muted">{group.heading}</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {group.links.map((link) => {
                const external = link.href.startsWith('http');
                return (
                  <li key={link.href}>
                    {external ? (
                      <a
                        href={link.href}
                        className="text-body-sm text-ink/80 transition-colors hover:text-accent"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-body-sm text-ink/80 transition-colors hover:text-accent"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="shell flex py-6 text-body-sm text-muted">
          <p>
            © {year} {APP_NAME}. Built by {FOUNDER_NAME}.
          </p>
        </div>
      </div>
    </footer>
  );
}
