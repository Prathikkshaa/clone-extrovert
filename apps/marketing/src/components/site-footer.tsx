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
      <div className="shell grid grid-cols-2 gap-x-6 gap-y-8 py-12 md:grid-cols-[1.4fr_repeat(3,1fr)] md:gap-10 md:py-14">
        <div className="col-span-2 max-w-xs md:col-span-1">
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
        <div className="shell flex flex-col gap-3 py-6 text-body-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {APP_NAME}. Built by {FOUNDER_NAME}.
          </p>
          <nav aria-label="Trust" className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-ink">
              Privacy
            </Link>
            <span aria-hidden className="h-3 w-px bg-line" />
            <Link href="/security" className="hover:text-ink">
              Security
            </Link>
            <span aria-hidden className="h-3 w-px bg-line" />
            <Link href="/terms" className="hover:text-ink">
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
